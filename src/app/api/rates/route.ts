import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { SCRAP_ITEMS_DATA, normalizeCityName } from "@/lib/scrapRatesData";

export interface RateResponseItem {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  iconPath: string;
}

// Built-in fallback helper when DB is offline or city not found
function getFallbackRates(multiplier = 1.0): RateResponseItem[] {
  return SCRAP_ITEMS_DATA.map((item) => {
    const priceMatch = item.price.match(/₹([\d.]+)\s*\/(kg|pcs)/i);
    const rawPrice = priceMatch ? parseFloat(priceMatch[1]) : 10;
    const unit = priceMatch ? priceMatch[2].toLowerCase() : "kg";
    const calculatedPrice =
      rawPrice >= 100
        ? Math.round((rawPrice * multiplier) / 5) * 5
        : rawPrice >= 10
        ? Math.round(rawPrice * multiplier)
        : Math.round(rawPrice * multiplier * 10) / 10;

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
      category: item.category,
      price: calculatedPrice,
      unit,
      iconPath,
    };
  });
}

function getCityMultiplier(citySlug: string): number {
  if (citySlug.includes("mumbai")) return 1.08;
  if (citySlug.includes("delhi")) return 1.05;
  if (citySlug.includes("bhubaneswar")) return 0.98;
  return 1.0;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawCity = searchParams.get("city")?.trim() || "patna";
  const normalizedCity = normalizeCityName(rawCity);
  const searchSlug = normalizedCity
    ? normalizedCity.toLowerCase().replace(/[\s()]+/g, "-").replace(/-+$/, "")
    : rawCity.toLowerCase().replace(/[\s()]+/g, "-");

  try {
    const whereConditions: Prisma.CityWhereInput[] = [
      { slug: { equals: searchSlug, mode: "insensitive" } },
      { name: { equals: rawCity, mode: "insensitive" } },
      { slug: { contains: searchSlug, mode: "insensitive" } },
    ];

    if (normalizedCity) {
      whereConditions.push({ name: { equals: normalizedCity, mode: "insensitive" } });
    }

    // 1. Attempt to find city by slug or case-insensitive name
    let city = await prisma.city.findFirst({
      where: {
        isActive: true,
        OR: whereConditions,
      },
    });

    // 2. If requested city is not found, fallback to default city (Patna or first active city)
    if (!city) {
      city = await prisma.city.findFirst({
        where: {
          isActive: true,
          OR: [{ slug: "patna" }, { name: "Patna" }],
        },
      });

      if (!city) {
        city = await prisma.city.findFirst({
          where: { isActive: true },
        });
      }
    }

    // 3. If city is located in Prisma DB, fetch its live scrap rates
    if (city) {
      const dbRates = await prisma.scrapRate.findMany({
        where: {
          cityId: city.id,
        },
        include: {
          item: true,
        },
        orderBy: [
          { item: { category: "asc" } },
          { item: { name: "asc" } },
        ],
      });

      if (dbRates.length > 0) {
        const formattedRates: RateResponseItem[] = dbRates.map((r) => ({
          id: r.item.id,
          name: r.item.name,
          category: r.item.category,
          price: r.price,
          unit: r.item.unit,
          iconPath: r.item.iconPath,
        }));

        return NextResponse.json(formattedRates, {
          status: 200,
          headers: {
            "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
            "X-Rates-Source": "database",
            "X-Rates-City": city.name,
          },
        });
      }
    }

    // Fallback if city exists but has no rates or DB has no cities yet
    const multiplier = getCityMultiplier(searchSlug);
    const fallbackData = getFallbackRates(multiplier);
    return NextResponse.json(fallbackData, {
      status: 200,
      headers: {
        "X-Rates-Source": "fallback-defaults",
        "X-Rates-City": normalizedCity || rawCity,
      },
    });
  } catch (error) {
    console.warn("Prisma rates query failed, serving fallback rates:", error);

    // Resilient fallback defaults in case DB connection is unavailable
    const multiplier = getCityMultiplier(searchSlug);
    const fallbackData = getFallbackRates(multiplier);
    return NextResponse.json(fallbackData, {
      status: 200,
      headers: {
        "X-Rates-Source": "offline-fallback",
        "X-Rates-City": normalizedCity || rawCity,
      },
    });
  }
}
