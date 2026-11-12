import { NextRequest, NextResponse } from "next/server";
import { prisma, withDbTimeout } from "@/lib/prisma";
import {
  getAllPickups,
  getStorageInfo,
  updatePickupStatus,
  deletePickup,
  saveLocalPickup,
} from "@/lib/pickupStore";

export async function GET() {
  try {
    const [pickups, storageInfo] = await Promise.all([
      getAllPickups(),
      getStorageInfo(),
    ]);

    // Compute dynamic real-world summary metrics
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
    console.error("GET /api/pickups error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve pickups." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Delegate directly to existing /api/pickup POST logic
  const { POST: createPickup } = await import("@/app/api/pickup/route");
  return createPickup(request);
}

export async function PATCH(request: NextRequest) {
  const { PATCH: updatePickup } = await import("@/app/api/pickup/route");
  return updatePickup(request);
}

export async function DELETE(request: NextRequest) {
  const { DELETE: deletePickupHandler } = await import("@/app/api/pickup/route");
  return deletePickupHandler(request);
}

