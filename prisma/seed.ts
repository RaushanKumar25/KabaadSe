import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface ItemSeedData {
  name: string;
  category: "Paper" | "Plastic" | "Metal" | "E-waste" | "Other";
  unit: "kg" | "pcs";
  basePrice: number;
  iconPath: string;
}

const SEED_CITIES = [
  { name: "Patna", slug: "patna", isActive: true },
  { name: "Mumbai", slug: "mumbai", isActive: true },
  { name: "Delhi NCR", slug: "delhi-ncr", isActive: true },
  { name: "Bhubaneswar", slug: "bhubaneswar", isActive: true },
];

const SEED_ITEMS: ItemSeedData[] = [
  // Paper
  { name: "Newspaper", category: "Paper", unit: "kg", basePrice: 10, iconPath: "/images/ScrapImages/newspaper.png" },
  { name: "Carton", category: "Paper", unit: "kg", basePrice: 11, iconPath: "/images/ScrapImages/carton.png" },
  { name: "Books", category: "Paper", unit: "kg", basePrice: 12, iconPath: "/images/ScrapImages/books.png" },
  { name: "Grey Board", category: "Paper", unit: "kg", basePrice: 2, iconPath: "/images/ScrapImages/grey-board.png" },
  { name: "Copy", category: "Paper", unit: "kg", basePrice: 10, iconPath: "/images/ScrapImages/copy.png" },
  { name: "Magazines", category: "Paper", unit: "kg", basePrice: 4, iconPath: "/images/ScrapImages/magazines.png" },
  { name: "Record Paper", category: "Paper", unit: "kg", basePrice: 10, iconPath: "/images/ScrapImages/record-paper.png" },
  { name: "White Paper", category: "Paper", unit: "kg", basePrice: 10, iconPath: "/images/ScrapImages/white-paper.png" },
  { name: "Core Pipe (Cardboard)", category: "Paper", unit: "kg", basePrice: 1, iconPath: "/images/ScrapImages/core-pipe.png" },

  // Plastic
  { name: "Mix Plastic", category: "Plastic", unit: "kg", basePrice: 7, iconPath: "/images/ScrapImages/mix-plastic.png" },
  { name: "Soft Plastic", category: "Plastic", unit: "kg", basePrice: 10, iconPath: "/images/ScrapImages/soft-plastic.png" },
  { name: "Hard Plastic", category: "Plastic", unit: "kg", basePrice: 2, iconPath: "/images/ScrapImages/hard-plastic.png" },
  { name: "Plastic Jar (15 Litre)", category: "Plastic", unit: "kg", basePrice: 10, iconPath: "/images/ScrapImages/plastic-jar-15.png" },
  { name: "Plastic Jar (5 Litre)", category: "Plastic", unit: "kg", basePrice: 10, iconPath: "/images/ScrapImages/plastic-jar-5.png" },
  { name: "Polythene Bags (LD)", category: "Plastic", unit: "kg", basePrice: 10, iconPath: "/images/ScrapImages/polythene-ld.png" },
  { name: "Plastic (PP) Bags", category: "Plastic", unit: "kg", basePrice: 4, iconPath: "/images/ScrapImages/plastic-pp-bags.png" },
  { name: "Milk Covers", category: "Plastic", unit: "kg", basePrice: 1.7, iconPath: "/images/ScrapImages/milk-covers.png" },
  { name: "PVC Pipe", category: "Plastic", unit: "kg", basePrice: 5, iconPath: "/images/ScrapImages/pvc-pipe.png" },
  { name: "PET Bottle", category: "Plastic", unit: "kg", basePrice: 14, iconPath: "/images/ScrapImages/pet-bottle.png" },
  { name: "Water Tank (Sintex)", category: "Plastic", unit: "kg", basePrice: 20, iconPath: "/images/ScrapImages/water-tank.png" },
  { name: "Plastic Can (20 Litre)", category: "Plastic", unit: "kg", basePrice: 10, iconPath: "/images/ScrapImages/plastic-can-20.png" },
  { name: "Plastic Drum (200 Litre)", category: "Plastic", unit: "kg", basePrice: 15, iconPath: "/images/ScrapImages/plastic-drum-200.png" },
  { name: "Plastic Can (25 Litre)", category: "Plastic", unit: "kg", basePrice: 15, iconPath: "/images/ScrapImages/plastic-can-25.png" },
  { name: "Plastic Can (50 Litre)", category: "Plastic", unit: "kg", basePrice: 15, iconPath: "/images/ScrapImages/plastic-can-50.png" },
  { name: "Polythene Bags (HM)", category: "Plastic", unit: "kg", basePrice: 10, iconPath: "/images/ScrapImages/polythene-hm.png" },
  { name: "Packaging Film", category: "Plastic", unit: "kg", basePrice: 1, iconPath: "/images/ScrapImages/packaging-film.png" },

  // Metal
  { name: "Iron", category: "Metal", unit: "kg", basePrice: 22, iconPath: "/images/ScrapImages/iron.png" },
  { name: "Tin", category: "Metal", unit: "kg", basePrice: 15, iconPath: "/images/ScrapImages/tin.png" },
  { name: "Aluminium", category: "Metal", unit: "kg", basePrice: 150, iconPath: "/images/ScrapImages/aluminium.png" },
  { name: "Steel", category: "Metal", unit: "kg", basePrice: 40, iconPath: "/images/ScrapImages/steel.png" },
  { name: "Brass", category: "Metal", unit: "kg", basePrice: 500, iconPath: "/images/ScrapImages/brass.png" },
  { name: "Copper", category: "Metal", unit: "kg", basePrice: 700, iconPath: "/images/ScrapImages/copper.png" },
  { name: "Casting Aluminium", category: "Metal", unit: "kg", basePrice: 95, iconPath: "/images/ScrapImages/casting-aluminium.png" },
  { name: "Beverage Cans (Aluminium)", category: "Metal", unit: "kg", basePrice: 25, iconPath: "/images/ScrapImages/beverage-cans.png" },
  { name: "Copper Wire", category: "Metal", unit: "kg", basePrice: 400, iconPath: "/images/ScrapImages/copper-wire.png" },
  { name: "Aluminium Wire", category: "Metal", unit: "kg", basePrice: 25, iconPath: "/images/ScrapImages/aluminium-wire.png" },
  { name: "Cooler (Tin)", category: "Metal", unit: "kg", basePrice: 15, iconPath: "/images/ScrapImages/cooler-tin.png" },
  { name: "MS Drums (200 Litre)", category: "Metal", unit: "kg", basePrice: 20, iconPath: "/images/ScrapImages/ms-drums-200.png" },
  { name: "MS Drum (50 Litre)", category: "Metal", unit: "kg", basePrice: 20, iconPath: "/images/ScrapImages/ms-drum-50.png" },

  // E-waste
  { name: "E-waste", category: "E-waste", unit: "kg", basePrice: 20, iconPath: "/images/ScrapImages/E-waste.png" },
  { name: "Inverter Battery", category: "E-waste", unit: "pcs", basePrice: 1700, iconPath: "/images/ScrapImages/inverter-battery.png" },
  { name: "Television (LCD/LED)", category: "E-waste", unit: "pcs", basePrice: 100, iconPath: "/images/ScrapImages/tv-lcd.png" },
  { name: "Laptop", category: "E-waste", unit: "pcs", basePrice: 300, iconPath: "/images/ScrapImages/laptop.png" },
  { name: "AC (1 ton)", category: "E-waste", unit: "pcs", basePrice: 2000, iconPath: "/images/ScrapImages/ac-1ton.png" },
  { name: "AC (1.5 ton)", category: "E-waste", unit: "pcs", basePrice: 3000, iconPath: "/images/ScrapImages/ac-1-5ton.png" },
  { name: "Washing machine", category: "E-waste", unit: "pcs", basePrice: 300, iconPath: "/images/ScrapImages/washing-machine.png" },
  { name: "AC (2 Ton)", category: "E-waste", unit: "pcs", basePrice: 3500, iconPath: "/images/ScrapImages/ac-2ton.png" },
  { name: "Television (CRT)", category: "E-waste", unit: "pcs", basePrice: 100, iconPath: "/images/ScrapImages/tv-crt.png" },
  { name: "Refrigerator (Single Door)", category: "E-waste", unit: "pcs", basePrice: 500, iconPath: "/images/ScrapImages/fridge-single.png" },
  { name: "Refrigerator (Double Door)", category: "E-waste", unit: "pcs", basePrice: 700, iconPath: "/images/ScrapImages/fridge-double.png" },
  { name: "Monitor (CRT)", category: "E-waste", unit: "pcs", basePrice: 200, iconPath: "/images/ScrapImages/monitor-crt.png" },
  { name: "Monitor (LCD/LED)", category: "E-waste", unit: "pcs", basePrice: 100, iconPath: "/images/ScrapImages/monitor-lcd.png" },
  { name: "CPU", category: "E-waste", unit: "pcs", basePrice: 150, iconPath: "/images/ScrapImages/cpu.png" },
  { name: "Geyser", category: "E-waste", unit: "pcs", basePrice: 200, iconPath: "/images/ScrapImages/geyser.png" },
  { name: "Printer", category: "E-waste", unit: "pcs", basePrice: 200, iconPath: "/images/ScrapImages/printer.png" },
  { name: "UPS (with battery)", category: "E-waste", unit: "pcs", basePrice: 200, iconPath: "/images/ScrapImages/ups-battery.png" },
  { name: "UPS (without battery)", category: "E-waste", unit: "pcs", basePrice: 150, iconPath: "/images/ScrapImages/ups-no-battery.png" },
  { name: "Alkaline Battery (Cell)", category: "E-waste", unit: "kg", basePrice: 1, iconPath: "/images/ScrapImages/alkaline-battery.png" },
  { name: "Microwave", category: "E-waste", unit: "pcs", basePrice: 199, iconPath: "/images/ScrapImages/microwave.png" },

  // Other
  { name: "Fibre", category: "Other", unit: "kg", basePrice: 5, iconPath: "/images/ScrapImages/fibre.png" },
  { name: "Cooler (Plastic/Fibre)", category: "Other", unit: "kg", basePrice: 10, iconPath: "/images/ScrapImages/cooler-plastic.png" },
  { name: "Bike", category: "Other", unit: "pcs", basePrice: 2000, iconPath: "/images/ScrapImages/bike.png" },
  { name: "Car", category: "Other", unit: "pcs", basePrice: 10000, iconPath: "/images/ScrapImages/car.png" },
];

function calculateCityPrice(basePrice: number, citySlug: string): number {
  const slug = citySlug.toLowerCase();
  let multiplier = 1.0;
  if (slug.includes("mumbai")) multiplier = 1.08;
  else if (slug.includes("delhi")) multiplier = 1.05;
  else if (slug.includes("bhubaneswar")) multiplier = 0.98;
  else multiplier = 1.0; // Patna and default base

  const calculated = basePrice * multiplier;
  if (basePrice >= 100) {
    return Math.round(calculated / 5) * 5;
  } else if (basePrice >= 10) {
    return Math.round(calculated);
  } else {
    return Math.round(calculated * 10) / 10;
  }
}

async function main() {
  console.log("Starting KabaadSe database seeding...");

  // 1. Seed or Upsert Cities
  const createdCities = [];
  for (const city of SEED_CITIES) {
    const record = await prisma.city.upsert({
      where: { slug: city.slug },
      update: {
        name: city.name,
        isActive: city.isActive,
      },
      create: {
        name: city.name,
        slug: city.slug,
        isActive: city.isActive,
      },
    });
    createdCities.push(record);
    console.log(`✓ City synced: ${record.name} (${record.slug})`);
  }

  // 2. Efficient Bulk Seed/Upsert for ScrapItems
  const existingItems = await prisma.scrapItem.findMany();
  const existingMap = new Map(existingItems.map((item) => [item.name, item]));

  const createdItems = [];
  for (const item of SEED_ITEMS) {
    const existing = existingMap.get(item.name);
    let record;

    if (!existing) {
      record = await prisma.scrapItem.create({
        data: {
          name: item.name,
          category: item.category,
          unit: item.unit,
          iconPath: item.iconPath,
        },
      });
    } else {
      record = await prisma.scrapItem.update({
        where: { id: existing.id },
        data: {
          category: item.category,
          unit: item.unit,
          iconPath: item.iconPath,
        },
      });
    }
    createdItems.push({ ...record, basePrice: item.basePrice });
  }
  console.log(`✓ Synced ${createdItems.length} ScrapItems.`);

  // 3. Seed City-Specific Rates in optimized transaction batches
  const rateOperations = [];
  for (const city of createdCities) {
    for (const item of createdItems) {
      const cityPrice = calculateCityPrice(item.basePrice, city.slug);

      rateOperations.push(
        prisma.scrapRate.upsert({
          where: {
            cityId_itemId: {
              cityId: city.id,
              itemId: item.id,
            },
          },
          update: {
            price: cityPrice,
          },
          create: {
            cityId: city.id,
            itemId: item.id,
            price: cityPrice,
          },
        })
      );
    }
  }

  // Execute in batches of 50 to prevent connection pool exhaustion and maximize performance
  const BATCH_SIZE = 50;
  for (let i = 0; i < rateOperations.length; i += BATCH_SIZE) {
    const batch = rateOperations.slice(i, i + BATCH_SIZE);
    await prisma.$transaction(batch);
  }

  console.log(`✓ Successfully seeded ${rateOperations.length} city-specific scrap rates across ${createdCities.length} cities.`);
}

main()
  .catch((e) => {
    console.error("Error during database seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
