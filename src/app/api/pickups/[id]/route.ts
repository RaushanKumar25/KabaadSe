import { NextRequest, NextResponse } from "next/server";
import { prisma, withDbTimeout } from "@/lib/prisma";
import { deletePickup, updatePickupStatus } from "@/lib/pickupStore";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { success: false, error: "Valid pickup ID is required." },
        { status: 400 }
      );
    }

    // 1. Delete from PostgreSQL via prisma.pickup.delete()
    let dbSuccess = false;
    try {
      await withDbTimeout(
        prisma.pickup.delete({
          where: { id },
        }),
        15000
      );
      dbSuccess = true;
    } catch (dbErr: any) {
      console.warn(
        `Prisma delete on PostgreSQL for ID ${id} (${dbErr?.code || dbErr?.message})`
      );
    }

    // 2. Also ensure deleted from local fallback store
    await deletePickup(id);

    return NextResponse.json({
      success: true,
      id,
      deletedFromDb: dbSuccess,
      message: "Pickup request deleted successfully.",
    });
  } catch (error: any) {
    console.error("DELETE /api/pickups/[id] error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to delete pickup request.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body." },
        { status: 400 }
      );
    }

    const { status } = body || {};

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { success: false, error: "Valid pickup ID is required." },
        { status: 400 }
      );
    }

    const VALID_STATUSES = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];
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

    // 1. Update in PostgreSQL
    let dbRecord;
    try {
      dbRecord = await withDbTimeout(
        prisma.pickup.update({
          where: { id },
          data: { status: normalizedStatus },
        }),
        15000
      );
    } catch (dbErr: any) {
      console.warn(
        `Prisma update on PostgreSQL for ID ${id} (${dbErr?.code || dbErr?.message})`
      );
    }

    // 2. Update local store
    const storeRecord = await updatePickupStatus(id, normalizedStatus);

    return NextResponse.json({
      success: true,
      pickup: dbRecord || storeRecord,
      message: `Pickup status updated to ${normalizedStatus}`,
    });
  } catch (error: any) {
    console.error("PATCH /api/pickups/[id] error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to update pickup request.",
      },
      { status: 500 }
    );
  }
}
