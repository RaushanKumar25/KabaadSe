import { NextRequest, NextResponse } from "next/server";
import { prisma, withDbTimeout } from "@/lib/prisma";
import {
  saveLocalPickup,
  getAllPickups,
  updatePickupStatus,
  deletePickup,
  getStorageInfo,
  PickupBooking,
} from "@/lib/pickupStore";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const VALID_ESTIMATED_LOADS = [
  "< 20 kg",
  "20 - 50 kg",
  "50+ kg",
  "Commercial / Bulk",
];

const VALID_STATUSES = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

export async function GET() {
  try {
    const [pickups, storageInfo] = await Promise.all([
      getAllPickups(),
      getStorageInfo(),
    ]);

    const total = pickups.length;
    const pending = pickups.filter(
      (p) => (p.status || "").toUpperCase() === "PENDING"
    ).length;
    const confirmed = pickups.filter(
      (p) => (p.status || "").toUpperCase() === "CONFIRMED"
    ).length;
    const completed = pickups.filter(
      (p) => (p.status || "").toUpperCase() === "COMPLETED"
    ).length;
    const cancelled = pickups.filter(
      (p) => (p.status || "").toUpperCase() === "CANCELLED"
    ).length;

    return NextResponse.json(
      {
        success: true,
        count: total,
        summary: {
          total,
          pending,
          confirmed,
          completed,
          cancelled,
        },
        storageInfo,
        pickups,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0, must-revalidate",
        },
      }
    );
  } catch (error: any) {
    console.error("GET /api/pickup error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve pickups" },
      { status: 500 }
    );
  }
}

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

    const {
      customerName,
      customerPhone,
      city,
      locality,
      address,
      pickupDate,
      estimatedLoad,
      scrapTypes,
    } = body || {};

    // 1. Validate customerName: min 2 chars
    if (
      !customerName ||
      typeof customerName !== "string" ||
      customerName.trim().length < 2
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Full name must be at least 2 characters.",
        },
        { status: 400 }
      );
    }

    // 2. Validate customerPhone: exact 10 digits
    let sanitizedPhone =
      typeof customerPhone === "string" ? customerPhone.trim() : "";
    sanitizedPhone = sanitizedPhone.replace(/[\s\-\(\)]/g, "");

    if (sanitizedPhone.startsWith("+91")) {
      sanitizedPhone = sanitizedPhone.slice(3);
    } else if (sanitizedPhone.startsWith("91") && sanitizedPhone.length === 12) {
      sanitizedPhone = sanitizedPhone.slice(2);
    }
    sanitizedPhone = sanitizedPhone.replace(/^0+/, "");

    if (!/^\d{10}$/.test(sanitizedPhone)) {
      return NextResponse.json(
        {
          success: false,
          error: "Please provide a valid 10-digit mobile number.",
        },
        { status: 400 }
      );
    }

    // 3. Validate City (defaults to Patna if unspecified)
    const cleanCity =
      typeof city === "string" && city.trim().length > 0
        ? city.trim()
        : "Patna";

    // 4. Validate Locality: non-empty string
    if (
      !locality ||
      typeof locality !== "string" ||
      locality.trim().length < 2
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Please enter your area, sector, or colony.",
        },
        { status: 400 }
      );
    }

    // 5. Validate Address: min 5 chars
    if (
      !address ||
      typeof address !== "string" ||
      address.trim().length < 5
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Complete address must be at least 5 characters.",
        },
        { status: 400 }
      );
    }

    // 6. Validate Preferred Pickup Date: valid date string
    if (!pickupDate || typeof pickupDate !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "Preferred pickup date is required.",
        },
        { status: 400 }
      );
    }

    const parsedDate = new Date(pickupDate);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid pickup date format.",
        },
        { status: 400 }
      );
    }

    // 7. Validate Scrap Types
    const normalizedScrapTypes = Array.isArray(scrapTypes)
      ? scrapTypes.filter((t) => typeof t === "string" && t.trim()).join(", ")
      : typeof scrapTypes === "string"
      ? scrapTypes.trim()
      : "";

    if (!normalizedScrapTypes) {
      return NextResponse.json(
        {
          success: false,
          error: "Please select at least one scrap type.",
        },
        { status: 400 }
      );
    }

    // 8. Validate Estimated Weight
    if (
      !estimatedLoad ||
      typeof estimatedLoad !== "string" ||
      !VALID_ESTIMATED_LOADS.includes(estimatedLoad.trim())
    ) {
      return NextResponse.json(
        {
          success: false,
          error: `Estimated weight must be one of: ${VALID_ESTIMATED_LOADS.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const newId = crypto.randomUUID();
    const cleanCustomerName = customerName.trim();
    const cleanLocality = locality.trim();
    const cleanAddress = address.trim();
    const cleanLoad = estimatedLoad.trim();

    // 9. Gracefully ensure City exists in PostgreSQL City table (if DATABASE_URL is configured and table is migrated)
    const citySlug = cleanCity.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    if (process.env.DATABASE_URL) {
      try {
        await withDbTimeout(
          prisma.city.upsert({
            where: { slug: citySlug },
            update: {},
            create: {
              name: cleanCity,
              slug: citySlug,
              isActive: true,
            },
          }),
          5000
        );
      } catch {
        // Safe to ignore if City table is not yet migrated; PickupRequest uses direct string
      }
    }

    // 10. If DATABASE_URL is not configured, fall back gracefully to local store
    if (!process.env.DATABASE_URL) {
      try {
        const fallbackRecord: PickupBooking = {
          id: newId,
          customerName: cleanCustomerName,
          customerPhone: sanitizedPhone,
          city: cleanCity,
          locality: cleanLocality,
          address: cleanAddress,
          pickupDate: parsedDate.toISOString(),
          estimatedLoad: cleanLoad,
          scrapTypes: normalizedScrapTypes,
          status: "PENDING",
          createdAt: new Date().toISOString(),
          source: "local-json",
        };

        await saveLocalPickup(fallbackRecord);

        return NextResponse.json(
          {
            success: true,
            bookingId: newId,
            message: "Pickup scheduled successfully (local dev store)",
          },
          { status: 201 }
        );
      } catch (localErr: any) {
        return NextResponse.json(
          {
            success: false,
            error: localErr?.message || "Local storage error while saving pickup booking.",
            code: "LOCAL_STORAGE_ERROR",
          },
          { status: 500 }
        );
      }
    }

    // 11. Save to PostgreSQL database as primary source of truth
    try {
      const pickup = await withDbTimeout(
        prisma.pickupRequest.create({
          data: {
            id: newId,
            customerName: cleanCustomerName,
            customerPhone: sanitizedPhone,
            city: cleanCity,
            locality: cleanLocality,
            address: cleanAddress,
            pickupDate: parsedDate,
            estimatedLoad: cleanLoad,
            scrapTypes: normalizedScrapTypes,
            status: "PENDING",
          },
        }),
        15000 // 15-second serverless timeout for Neon compute wake-up
      );

      // Best-effort mirror to local store in non-production
      if (process.env.NODE_ENV !== "production") {
        try {
          await saveLocalPickup({
            id: pickup.id,
            customerName: pickup.customerName,
            customerPhone: pickup.customerPhone,
            city: pickup.city,
            locality: pickup.locality,
            address: pickup.address,
            pickupDate: pickup.pickupDate.toISOString(),
            estimatedLoad: pickup.estimatedLoad,
            scrapTypes: pickup.scrapTypes || normalizedScrapTypes,
            status: pickup.status,
            createdAt: pickup.createdAt.toISOString(),
            source: "postgres",
          });
        } catch {
          // ignore in read-only environment
        }
      }

      return NextResponse.json(
        {
          success: true,
          bookingId: pickup.id,
          message: "Pickup scheduled successfully",
        },
        { status: 201 }
      );
    } catch (dbError: any) {
      console.error("❌ Failed to create pickup in PostgreSQL:", dbError);

      // Fallback for offline local dev environment only
      const isLocalhost =
        process.env.DATABASE_URL?.includes("localhost") ||
        process.env.DATABASE_URL?.includes("127.0.0.1");

      if (process.env.NODE_ENV !== "production" && isLocalhost) {
        try {
          const fallbackRecord: PickupBooking = {
            id: newId,
            customerName: cleanCustomerName,
            customerPhone: sanitizedPhone,
            city: cleanCity,
            locality: cleanLocality,
            address: cleanAddress,
            pickupDate: parsedDate.toISOString(),
            estimatedLoad: cleanLoad,
            scrapTypes: normalizedScrapTypes,
            status: "PENDING",
            createdAt: new Date().toISOString(),
            source: "local-json",
          };

          await saveLocalPickup(fallbackRecord);

          return NextResponse.json(
            {
              success: true,
              bookingId: newId,
              message: "Pickup scheduled successfully (local dev fallback)",
            },
            { status: 201 }
          );
        } catch {
          // continue to error response
        }
      }

      // In production (Vercel with Neon), return clear error so frontend knows immediately
      return NextResponse.json(
        {
          success: false,
          error: dbError?.message || "Database connection error. Could not save pickup booking.",
          code: dbError?.code || "DATABASE_ERROR",
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Unexpected error in /api/pickup:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "An unexpected server error occurred.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
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

    const { id, status } = body || {};

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { success: false, error: "Booking ID is required." },
        { status: 400 }
      );
    }

    const normalizedStatus = (status || "").toUpperCase();
    if (!VALID_STATUSES.includes(normalizedStatus)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const updated = await updatePickupStatus(id, normalizedStatus);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Pickup booking not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      pickup: updated,
      message: `Pickup status updated to ${normalizedStatus}`,
    });
  } catch (error: any) {
    console.error("PATCH /api/pickup error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update pickup status." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get("id");

    if (!id) {
      try {
        const body = await request.json();
        id = body?.id;
      } catch {
        // ignore
      }
    }

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { success: false, error: "Booking ID is required." },
        { status: 400 }
      );
    }

    await deletePickup(id);
    return NextResponse.json({
      success: true,
      id,
      message: "Pickup booking deleted successfully.",
    });
  } catch (error: any) {
    console.error("DELETE /api/pickup error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete pickup booking." },
      { status: 500 }
    );
  }
}
