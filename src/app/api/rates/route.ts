import { NextRequest, NextResponse } from "next/server";
import {
  getManagedRates,
  updateRatePrice,
  addCustomMaterial,
  getAdminCitiesList,
  ManagedRateItem,
} from "@/lib/rateStore";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export interface RateResponseItem {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  iconPath: string;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawCity = searchParams.get("city")?.trim() || "Patna";
  const format = searchParams.get("format") || "client"; // "client" | "admin"

  try {
    const managedRates = await getManagedRates(rawCity);

    // If admin requested, return complete items with status, custom flag, and available cities list
    if (format === "admin") {
      const cities = getAdminCitiesList();
      return NextResponse.json(
        {
          success: true,
          city: rawCity,
          availableCities: cities,
          count: managedRates.length,
          rates: managedRates,
        },
        {
          status: 200,
          headers: {
            "Cache-Control": "no-store, max-age=0, must-revalidate",
          },
        }
      );
    }

    // Default client format: only active items with public properties
    const activeClientRates: RateResponseItem[] = managedRates
      .filter((r) => r.isActive !== false)
      .map((r) => ({
        id: r.id,
        name: r.name,
        category: r.category,
        price: r.price,
        unit: r.unit,
        iconPath: r.iconPath,
      }));

    return NextResponse.json(activeClientRates, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0, must-revalidate",
        "X-Rates-City": rawCity,
      },
    });
  } catch (error) {
    console.error("GET /api/rates error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve scrap rates." },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/rates
 * Update pricePerUnit and isActive for any scrap item by ID and city
 */
export async function PUT(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON request body." },
        { status: 400 }
      );
    }

    const { city, itemId, price, isActive } = body || {};

    if (!itemId || typeof itemId !== "string") {
      return NextResponse.json(
        { success: false, error: "Scrap item ID is required." },
        { status: 400 }
      );
    }

    if (price === undefined || typeof price !== "number" || price < 0) {
      return NextResponse.json(
        { success: false, error: "Valid non-negative price is required." },
        { status: 400 }
      );
    }

    const targetCity = typeof city === "string" && city.trim() ? city.trim() : "Patna";
    const updated = await updateRatePrice({
      city: targetCity,
      itemId,
      price,
      isActive: typeof isActive === "boolean" ? isActive : true,
    });

    return NextResponse.json({
      success: true,
      item: updated,
      message: "Scrap rate updated successfully.",
    });
  } catch (error: any) {
    console.error("PUT /api/rates error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update scrap rate." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/rates
 * Add a new scrap material to a city or global catalog
 */
export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON request body." },
        { status: 400 }
      );
    }

    const { name, category, unit, price, city } = body || {};

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Material name must be at least 2 characters." },
        { status: 400 }
      );
    }

    const validCategories = ["Paper", "Plastic", "Metal", "E-waste", "Other"];
    const normalizedCategory =
      validCategories.find(
        (c) => c.toLowerCase() === (category || "").toLowerCase()
      ) || "Other";

    const normalizedUnit =
      typeof unit === "string" && (unit.toLowerCase() === "piece" || unit.toLowerCase() === "pcs")
        ? "pcs"
        : "kg";

    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      return NextResponse.json(
        { success: false, error: "Price must be a valid positive number." },
        { status: 400 }
      );
    }

    const newItem = await addCustomMaterial({
      name: name.trim(),
      category: normalizedCategory as any,
      unit: normalizedUnit,
      price: numPrice,
      city: typeof city === "string" ? city.trim() : "Patna",
    });

    return NextResponse.json(
      {
        success: true,
        item: newItem,
        message: `Material "${newItem.name}" added successfully.`,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/rates error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add scrap material." },
      { status: 500 }
    );
  }
}
