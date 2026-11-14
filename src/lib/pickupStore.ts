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
 * Safely ensures data directory and pickups.json file exist in environments with write access
 */
async function ensureStorageFile(): Promise<boolean> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(PICKUPS_FILE);
    } catch {
      await fs.writeFile(PICKUPS_FILE, JSON.stringify([], null, 2), "utf-8");
    }
    return true;
  } catch {
    // Vercel serverless has a read-only filesystem; safe to ignore
    return false;
  }
}

/**
 * Read local JSON bookings (for local offline dev fallback)
 */
export async function getLocalPickups(): Promise<PickupBooking[]> {
  try {
    const isWritable = await ensureStorageFile();
    if (!isWritable) return [];

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
  } catch {
    return [];
  }
}

/**
 * Append or update a booking in the local JSON storage
 */
export async function saveLocalPickup(booking: PickupBooking): Promise<void> {
  try {
    const isWritable = await ensureStorageFile();
    if (!isWritable) return;

    const current = await getLocalPickups();
    const filtered = current.filter((b) => b.id !== booking.id);
    const updated = [booking, ...filtered];
    await fs.writeFile(PICKUPS_FILE, JSON.stringify(updated, null, 2), "utf-8");
  } catch {
    // Read-only filesystem in production; safe to ignore
  }
}

/**
 * Fetch all pickups: PostgreSQL is the primary source of truth across all devices.
 */
export async function getAllPickups(): Promise<PickupBooking[]> {
  // 1. Primary Source of Truth: PostgreSQL database
  try {
    const rawDb = await withDbTimeout(
      prisma.pickupRequest.findMany({
        orderBy: { createdAt: "desc" },
      }),
      15000 // 15-second timeout for Neon PostgreSQL serverless compute
    );

    return rawDb.map((p) => ({
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
      source: "postgres" as const,
    }));
  } catch (dbErr) {
    console.error("PostgreSQL unavailable in getAllPickups, checking local dev store:", dbErr);

    // 2. Fallback to local file only if in local development
    const localItems = await getLocalPickups();
    return localItems.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
}

/**
 * Update the status of a pickup in PostgreSQL and local storage
 */
export async function updatePickupStatus(
  id: string,
  newStatus: string
): Promise<PickupBooking | null> {
  let updatedRecord: PickupBooking | null = null;

  // 1. Attempt database update in PostgreSQL
  try {
    const dbRecord = await withDbTimeout(
      prisma.pickupRequest.update({
        where: { id },
        data: { status: newStatus },
      }),
      15000
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
    }
  } catch (dbErr) {
    console.warn(`Could not update pickup ${id} in PostgreSQL:`, dbErr);
  }

  // 2. Mirror to local file in development
  try {
    const current = await getLocalPickups();
    const existingIndex = current.findIndex((b) => b.id === id);
    if (existingIndex !== -1) {
      current[existingIndex].status = newStatus;
      if (!updatedRecord) updatedRecord = current[existingIndex];
      await fs.writeFile(PICKUPS_FILE, JSON.stringify(current, null, 2), "utf-8");
    }
  } catch {
    // Ignore read-only errors on serverless
  }

  return updatedRecord;
}

/**
 * Delete a pickup record from PostgreSQL and local storage
 */
export async function deletePickup(id: string): Promise<boolean> {
  let dbSuccess = false;

  try {
    await withDbTimeout(
      prisma.pickupRequest.delete({
        where: { id },
      }),
      15000
    );
    dbSuccess = true;
  } catch (err) {
    console.warn(`Prisma delete on PostgreSQL for ID ${id}:`, err);
  }

  try {
    const current = await getLocalPickups();
    const filtered = current.filter((b) => b.id !== id);
    await fs.writeFile(PICKUPS_FILE, JSON.stringify(filtered, null, 2), "utf-8");
  } catch {
    // Ignore read-only errors on serverless
  }

  return dbSuccess;
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
    await withDbTimeout(prisma.$queryRaw`SELECT 1`, 5000);
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
