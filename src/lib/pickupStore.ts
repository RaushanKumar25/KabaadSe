import fs from "node:fs/promises";
import path from "node:path";
import prisma, { withDbTimeout } from "@/lib/prisma";

export interface PickupBooking {
  id: string;
  customerName: string;
  customerPhone: string;
  city: string;
  locality: string;
  address: string;
  pickupDate: string;
  estimatedLoad: string;
  scrapTypes: string;
  status: string;
  createdAt: string;
  source: "postgres" | "local-json";
}

const DATA_DIR = path.join(process.cwd(), "data");
const PICKUPS_FILE = path.join(DATA_DIR, "pickups.json");

/**
 * Ensures data directory and pickups.json file exist
 */
async function ensureStorageFile(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(PICKUPS_FILE);
    } catch {
      await fs.writeFile(PICKUPS_FILE, JSON.stringify([], null, 2), "utf-8");
    }
  } catch (err) {
    console.error("Failed to initialize pickups storage file:", err);
  }
}

/**
 * Read all local JSON bookings
 */
export async function getLocalPickups(): Promise<PickupBooking[]> {
  try {
    await ensureStorageFile();
    const raw = await fs.readFile(PICKUPS_FILE, "utf-8");
    if (!raw.trim()) return [];
    const list = JSON.parse(raw);
    return list.map((item: any) => ({
      ...item,
      city: item.city || "Patna",
      scrapTypes: Array.isArray(item.scrapTypes)
        ? item.scrapTypes.join(", ")
        : item.scrapTypes || "Mixed Scrap",
    })) as PickupBooking[];
  } catch (err) {
    console.warn("Could not read local pickups:", err);
    return [];
  }
}

/**
 * Append or update a booking in the local JSON storage
 */
export async function saveLocalPickup(booking: PickupBooking): Promise<void> {
  try {
    await ensureStorageFile();
    const current = await getLocalPickups();
    // Prepend new booking
    const filtered = current.filter((b) => b.id !== booking.id);
    const updated = [booking, ...filtered];
    await fs.writeFile(PICKUPS_FILE, JSON.stringify(updated, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write pickup to local file:", err);
  }
}

/**
 * Fetch all pickups across PostgreSQL and local JSON store, merged and deduplicated
 */
export async function getAllPickups(): Promise<PickupBooking[]> {
  const localItems = await getLocalPickups();
  let dbItems: PickupBooking[] = [];

  try {
    const rawDb = await withDbTimeout(
      prisma.pickupRequest.findMany({
        orderBy: { createdAt: "desc" },
      }),
      2000
    );

    dbItems = rawDb.map((p) => ({
      id: p.id,
      customerName: p.customerName,
      customerPhone: p.customerPhone,
      city: p.city || "Patna",
      locality: p.locality,
      address: p.address,
      pickupDate: p.pickupDate.toISOString(),
      estimatedLoad: p.estimatedLoad,
      scrapTypes: p.scrapTypes || "Mixed Scrap",
      status: p.status,
      createdAt: p.createdAt.toISOString(),
      source: "postgres",
    }));
  } catch (dbErr) {
    console.warn("PostgreSQL unavailable for reading pickups, returning local store:", dbErr);
  }

  // Merge and deduplicate by id (Postgres takes precedence if present in both)
  const map = new Map<string, PickupBooking>();
  for (const item of localItems) {
    map.set(item.id, item);
  }
  for (const item of dbItems) {
    map.set(item.id, item);
  }

  return Array.from(map.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Update the status of a pickup in both local JSON storage and PostgreSQL (if connected)
 */
export async function updatePickupStatus(
  id: string,
  newStatus: string
): Promise<PickupBooking | null> {
  await ensureStorageFile();
  const current = await getLocalPickups();
  const existingIndex = current.findIndex((b) => b.id === id);

  let updatedRecord: PickupBooking | null = null;

  if (existingIndex !== -1) {
    current[existingIndex].status = newStatus;
    updatedRecord = current[existingIndex];
    await fs.writeFile(PICKUPS_FILE, JSON.stringify(current, null, 2), "utf-8");
  }

  // Attempt database update if reachable
  try {
    const dbRecord = await withDbTimeout(
      prisma.pickupRequest.update({
        where: { id },
        data: { status: newStatus },
      }),
      2000
    );

    if (dbRecord) {
      updatedRecord = {
        id: dbRecord.id,
        customerName: dbRecord.customerName,
        customerPhone: dbRecord.customerPhone,
        city: dbRecord.city || "Patna",
        locality: dbRecord.locality,
        address: dbRecord.address,
        pickupDate: dbRecord.pickupDate.toISOString(),
        estimatedLoad: dbRecord.estimatedLoad,
        scrapTypes: dbRecord.scrapTypes || "Mixed Scrap",
        status: dbRecord.status,
        createdAt: dbRecord.createdAt.toISOString(),
        source: "postgres",
      };

      // Ensure local store also mirrors this updated status
      if (existingIndex === -1) {
        await saveLocalPickup(updatedRecord);
      }
    }
  } catch (dbErr) {
    console.warn(
      `Could not update pickup ${id} in PostgreSQL (offline or not found in DB). Local store updated:`,
      dbErr
    );
  }

  return updatedRecord;
}

/**
 * Delete a pickup record from local storage and PostgreSQL (if present)
 */
export async function deletePickup(id: string): Promise<boolean> {
  await ensureStorageFile();
  const current = await getLocalPickups();
  const filtered = current.filter((b) => b.id !== id);
  await fs.writeFile(PICKUPS_FILE, JSON.stringify(filtered, null, 2), "utf-8");

  try {
    await withDbTimeout(
      prisma.pickupRequest.delete({
        where: { id },
      }),
      2000
    );
  } catch {
    // If not in DB or DB offline, ignore
  }

  return true;
}

/**
 * Check storage connectivity and stats for the admin shell indicator
 */
export async function getStorageInfo(): Promise<{
  mode: "postgres" | "local-json";
  totalCount: number;
  pendingCount: number;
}> {
  let mode: "postgres" | "local-json" = "local-json";

  try {
    await withDbTimeout(prisma.$queryRaw`SELECT 1`, 1200);
    mode = "postgres";
  } catch {
    mode = "local-json";
  }

  const all = await getAllPickups();
  const pendingCount = all.filter(
    (p) => (p.status || "").toUpperCase() === "PENDING"
  ).length;

  return {
    mode,
    totalCount: all.length,
    pendingCount,
  };
}
