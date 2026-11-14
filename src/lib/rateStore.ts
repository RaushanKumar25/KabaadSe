import fs from "node:fs/promises";
import path from "node:path";
import prisma, { withDbTimeout } from "@/lib/prisma";
import { SCRAP_ITEMS_DATA, CITIES_LIST, normalizeCityName } from "@/lib/scrapRatesData";

export interface ManagedRateItem {
  id: string;
  name: string;
  category: "Paper" | "Plastic" | "Metal" | "E-waste" | "Other";
  price: number;
  unit: string;
  iconPath: string;
  city: string;
  isActive: boolean;
  isCustom?: boolean;
  updatedAt?: string;
}

interface RatesStorageSchema {
  overrides: Record<string, { price: number; isActive: boolean; updatedAt: string }>;
  customItems: Array<{
    id: string;
    name: string;
    category: "Paper" | "Plastic" | "Metal" | "E-waste" | "Other";
    price: number;
    unit: string;
    iconPath: string;
    city: string;
    isActive: boolean;
    createdAt: string;
  }>;
}

const DATA_DIR = path.join(process.cwd(), "data");
const RATES_FILE = path.join(DATA_DIR, "rates-overrides.json");

async function ensureRatesStorage(): Promise<RatesStorageSchema> {
  const defaultSchema: RatesStorageSchema = {
    overrides: {},
    customItems: [],
  };

  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      const raw = await fs.readFile(RATES_FILE, "utf-8");
      if (raw.trim()) {
        return JSON.parse(raw) as RatesStorageSchema;
      }
    } catch {
      // File does not exist yet
    }

    try {
      await fs.writeFile(RATES_FILE, JSON.stringify(defaultSchema, null, 2), "utf-8");
    } catch {
      // Ignore read-only errors in serverless
    }
    return defaultSchema;
  } catch {
    // In serverless / read-only Vercel environment, fallback to memory default
    return defaultSchema;
  }
}

async function saveRatesStorage(data: RatesStorageSchema): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(RATES_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch {
    // Safe to ignore on serverless read-only filesystem
  }
}

function getCityMultiplier(citySlug: string): number {
  const slug = citySlug.toLowerCase();
  if (slug.includes("mumbai")) return 1.08;
  if (slug.includes("delhi")) return 1.05;
  if (slug.includes("bhubaneswar")) return 0.98;
  return 1.0;
}

export function getAdminCitiesList(): string[] {
  return [
    "Patna",
    "Jalandhar",
    "Ludhiana",
    "Delhi NCR",
    "Ranchi",
    "Mumbai",
    "Bhubaneswar (Odisha)",
    "Bangalore",
    "Pune",
    "Hyderabad",
  ];
}

/**
 * Get managed rates for a city (or "all" cities)
 */
export async function getManagedRates(city = "Patna"): Promise<ManagedRateItem[]> {
  const store = await ensureRatesStorage();
  const normalizedCity = normalizeCityName(city) || city || "Patna";
  const cityKey = normalizedCity.toLowerCase();
  const multiplier = getCityMultiplier(cityKey);

  // 1. Build base items list from SCRAP_ITEMS_DATA
  const baseItems: ManagedRateItem[] = SCRAP_ITEMS_DATA.map((item) => {
    const priceMatch = item.price.match(/₹([\d.]+)\s*\/(kg|pcs)/i);
    const rawPrice = priceMatch ? parseFloat(priceMatch[1]) : 10;
    const unit = priceMatch ? priceMatch[2].toLowerCase() : "kg";
    const calculatedPrice =
      rawPrice >= 100
        ? Math.round((rawPrice * multiplier) / 5) * 5
        : rawPrice >= 10
        ? Math.round(rawPrice * multiplier)
        : Math.round(rawPrice * multiplier * 10) / 10;

    const overrideKey = `${cityKey}::${item.id}`;
    const override = store.overrides[overrideKey];

    let iconPath = item.image;
    if (!iconPath) {
      if (item.name.toLowerCase() === "e-waste") {
        iconPath = "/images/ScrapImages/E-waste.png";
      } else {
        iconPath = `/images/ScrapImages/${item.id}.png`;
      }
    }

    return {
      id: item.id,
      name: item.name,
      category: item.category as any,
      price: override ? override.price : calculatedPrice,
      unit,
      iconPath,
      city: normalizedCity,
      isActive: override ? override.isActive : true,
      isCustom: false,
      updatedAt: override?.updatedAt,
    };
  });

  // 2. Append custom items matching this city or global ("all")
  const customItems: ManagedRateItem[] = store.customItems
    .filter(
      (ci) =>
        ci.city.toLowerCase() === cityKey ||
        ci.city.toLowerCase() === "all" ||
        normalizedCity.toLowerCase() === "all"
    )
    .map((ci) => {
      const overrideKey = `${cityKey}::${ci.id}`;
      const override = store.overrides[overrideKey];

      return {
        id: ci.id,
        name: ci.name,
        category: ci.category,
        price: override ? override.price : ci.price,
        unit: ci.unit,
        iconPath: ci.iconPath || "/images/ScrapImages/E-waste.png",
        city: normalizedCity,
        isActive: override ? override.isActive : ci.isActive,
        isCustom: true,
        updatedAt: override?.updatedAt || ci.createdAt,
      };
    });

  return [...customItems, ...baseItems];
}

/**
 * Update rate price and/or active status for an item in a given city
 */
export async function updateRatePrice(params: {
  city: string;
  itemId: string;
  price: number;
  isActive?: boolean;
}): Promise<ManagedRateItem | null> {
  const { city, itemId, price, isActive = true } = params;
  const store = await ensureRatesStorage();
  const normalizedCity = normalizeCityName(city) || city || "Patna";
  const cityKey = normalizedCity.toLowerCase();
  const citySlug = cityKey.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const overrideKey = `${cityKey}::${itemId}`;

  store.overrides[overrideKey] = {
    price,
    isActive,
    updatedAt: new Date().toISOString(),
  };

  await saveRatesStorage(store);

  // Try updating PostgreSQL database if connected
  try {
    // Gracefully connect or auto-create City in Neon PostgreSQL
    const dbCity = await withDbTimeout(
      prisma.city.upsert({
        where: { slug: citySlug },
        update: { name: normalizedCity },
        create: {
          name: normalizedCity,
          slug: citySlug,
          isActive: true,
        },
      }),
      10000
    );

    if (dbCity) {
      // Gracefully connect or auto-create ScrapItem if not present
      await withDbTimeout(
        prisma.scrapItem.upsert({
          where: { id: itemId },
          update: {},
          create: {
            id: itemId,
            name: itemId.replace(/-/g, " "),
            category: "Other",
            unit: "kg",
            iconPath: `/images/ScrapImages/${itemId}.png`,
          },
        }),
        10000
      );

      await withDbTimeout(
        prisma.scrapRate.upsert({
          where: {
            cityId_itemId: {
              cityId: dbCity.id,
              itemId,
            },
          },
          update: {
            price,
          },
          create: {
            cityId: dbCity.id,
            itemId,
            price,
          },
        }),
        10000
      );
    }
  } catch (err) {
    console.warn("Could not sync rate update with PostgreSQL (offline or tables unmigrated):", err);
  }

  const allRates = await getManagedRates(normalizedCity);
  return allRates.find((r) => r.id === itemId) || null;
}

/**
 * Add a new custom scrap material
 */
export async function addCustomMaterial(params: {
  name: string;
  category: "Paper" | "Plastic" | "Metal" | "E-waste" | "Other";
  unit: string;
  price: number;
  city?: string;
}): Promise<ManagedRateItem> {
  const store = await ensureRatesStorage();
  const targetCity = params.city?.trim() || "Patna";
  const normalizedCity = normalizeCityName(targetCity) || targetCity;
  const citySlug = normalizedCity.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const cleanId = `custom-${params.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}-${Date.now().toString().slice(-4)}`;

  let iconPath = "/images/ScrapImages/E-waste.png";
  if (params.category === "Paper") iconPath = "/images/ScrapImages/newspaper.png";
  else if (params.category === "Plastic") iconPath = "/images/ScrapImages/mix-plastic.png";
  else if (params.category === "Metal") iconPath = "/images/ScrapImages/iron.png";

  const newItem = {
    id: cleanId,
    name: params.name.trim(),
    category: params.category,
    price: Number(params.price),
    unit: params.unit.toLowerCase() === "piece" || params.unit.toLowerCase() === "pcs" ? "pcs" : "kg",
    iconPath,
    city: normalizedCity,
    isActive: true,
    createdAt: new Date().toISOString(),
  };

  store.customItems.unshift(newItem);
  await saveRatesStorage(store);

  // Try creating in PostgreSQL database if connected
  try {
    const dbCity = await withDbTimeout(
      prisma.city.upsert({
        where: { slug: citySlug },
        update: { name: normalizedCity },
        create: {
          name: normalizedCity,
          slug: citySlug,
          isActive: true,
        },
      }),
      10000
    );

    const dbItem = await withDbTimeout(
      prisma.scrapItem.upsert({
        where: { id: cleanId },
        update: {},
        create: {
          id: cleanId,
          name: newItem.name,
          category: newItem.category,
          unit: newItem.unit,
          iconPath: newItem.iconPath,
        },
      }),
      10000
    );

    if (dbItem && dbCity) {
      await withDbTimeout(
        prisma.scrapRate.upsert({
          where: {
            cityId_itemId: {
              cityId: dbCity.id,
              itemId: dbItem.id,
            },
          },
          update: {
            price: newItem.price,
          },
          create: {
            cityId: dbCity.id,
            itemId: dbItem.id,
            price: newItem.price,
          },
        }),
        10000
      );
    }
  } catch (err) {
    console.warn("Could not sync custom scrap item to PostgreSQL (offline):", err);
  }

  return {
    ...newItem,
    isCustom: true,
  };
}
