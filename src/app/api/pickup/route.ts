import { NextRequest, NextResponse } from "next/server";
import prisma, { withDbTimeout } from "@/lib/prisma";
import {
  saveLocalPickup,
  getAllPickups,
  updatePickupStatus,
  deletePickup,
  getStorageInfo,
  PickupBooking,
} from "@/lib/pickupStore";

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

    return NextResponse.json({
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
    });
  } catch (error: any) {
    console.error("GET /api/pickup error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve pickups" },
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

    // 2. Validate customerPhone: exact 10 digits (strip leading +91 or 0)
    let sanitizedPhone =
      typeof customerPhone === "string" ? customerPhone.trim() : "";
    sanitizedPhone = sanitizedPhone.replace(/[\s\-\(\)]/g, "");

    if (sanitizedPhone.startsWith("+91")) {
      sanitizedPhone = sanitizedPhone.slice(3);
    } else if (sanitizedPhone.startsWith("91") && sanitizedPhone.length === 12) {
      sanitizedPhone = sanitizedPhone.slice(2);
    }

    // Strip leading zeroes if present
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

    // 6. Validate Preferred Pickup Date: valid date string, cannot be in the past
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

    // Compare date against today (ignoring hours/minutes to allow booking for today)
    const now = new Date();
    const todayMidnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const selectedMidnight = new Date(
      parsedDate.getFullYear(),
      parsedDate.getMonth(),
      parsedDate.getDate()
    );

    if (selectedMidnight < todayMidnight) {
      return NextResponse.json(
        {
          success: false,
          error: "Pickup date cannot be in the past.",
        },
        { status: 400 }
      );
    }

    // 7. Validate Scrap Types (multi-select categories)
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

    // 9. Save to PostgreSQL if available, otherwise fallback to local JSON file
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
        2500
      );

      // Also mirror to local file store for synchronized local access
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

      return NextResponse.json(
        {
          success: true,
          bookingId: pickup.id,
          message: "Pickup scheduled successfully",
        },
        { status: 201 }
      );
    } catch (dbError: any) {
      console.warn(
        "⚠️ PostgreSQL is offline or unreachable. Persisting pickup to local JSON store (data/pickups.json)...",
        dbError?.message || dbError?.code
      );

      // Persist to local JSON storage so zero data is lost
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
          message: "Pickup scheduled successfully",
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Unexpected error in /api/pickup:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected server error occurred.",
      },
      { status: 500 }
    );
  }
}
