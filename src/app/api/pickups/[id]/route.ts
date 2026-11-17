import { NextRequest, NextResponse } from "next/server";
import { prisma, withDbTimeout } from "@/lib/prisma";
import { deletePickup, updatePickupStatus } from "@/lib/pickupStore";
import {
  ADMIN_SESSION_COOKIE,
  verifyAdminSessionToken,
  CUSTOMER_SESSION_COOKIE,
  verifyCustomerSessionToken,
} from "@/lib/auth";

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

    // Verify authentication
    const adminCookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    const adminSession = await verifyAdminSessionToken(adminCookie);

    const customerCookie = request.cookies.get(CUSTOMER_SESSION_COOKIE)?.value;
    const customerSession = await verifyCustomerSessionToken(customerCookie);

    if (!adminSession.valid && !customerSession.valid) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    // If customer, verify ownership and pending status
    if (!adminSession.valid && customerSession.valid && customerSession.customer) {
      const existing = await withDbTimeout(
        prisma.pickup.findUnique({
          where: { id },
        })
      );

      if (
        !existing ||
        (existing.customerId !== customerSession.customer.id &&
          existing.customerPhone !== customerSession.customer.phone)
      ) {
        return NextResponse.json(
          { success: false, error: "You are not authorized to delete this pickup." },
          { status: 403 }
        );
      }

      if (existing.status !== "PENDING" && existing.status !== "CANCELLED") {
        return NextResponse.json(
          {
            success: false,
            error: "Only pending or cancelled pickups can be deleted by customers.",
          },
          { status: 400 }
        );
      }
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

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { success: false, error: "Valid pickup ID is required." },
        { status: 400 }
      );
    }

    // Check sessions
    const adminCookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    const adminSession = await verifyAdminSessionToken(adminCookie);

    const customerCookie = request.cookies.get(CUSTOMER_SESSION_COOKIE)?.value;
    const customerSession = await verifyCustomerSessionToken(customerCookie);

    if (!adminSession.valid && !customerSession.valid) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in to modify this booking." },
        { status: 401 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body." },
        { status: 400 }
      );
    }

    const { status, pickupDate, actualWeightKg, finalPayoutInr } = body || {};

    // Retrieve existing record to check ownership & rules
    let existingPickup: any = null;
    try {
      existingPickup = await withDbTimeout(
        prisma.pickup.findUnique({
          where: { id },
        })
      );
    } catch (dbErr: any) {
      console.warn(`Could not fetch existing pickup ${id} from DB:`, dbErr?.message);
    }

    // Customer-specific security & authorization
    const isCustomer = !adminSession.valid && customerSession.valid;
    if (isCustomer) {
      const cust = customerSession.customer!;
      if (
        existingPickup &&
        existingPickup.customerId !== cust.id &&
        existingPickup.customerPhone !== cust.phone
      ) {
        return NextResponse.json(
          { success: false, error: "Forbidden: You are not authorized to modify this booking." },
          { status: 403 }
        );
      }

      // Customer can only cancel or reschedule pending bookings
      if (existingPickup && !["PENDING", "CONFIRMED"].includes(existingPickup.status)) {
        return NextResponse.json(
          {
            success: false,
            error: `Cannot modify a pickup that is already ${existingPickup.status.toLowerCase()}.`,
          },
          { status: 400 }
        );
      }

      if (status && status.toUpperCase() !== "CANCELLED") {
        return NextResponse.json(
          {
            success: false,
            error: "Customers may only cancel a booking. Other status updates are reserved for dispatchers.",
          },
          { status: 403 }
        );
      }
    }

    // Construct update data
    const updateData: Record<string, any> = {};

    if (status) {
      const VALID_STATUSES = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];
      const normalizedStatus = status.toUpperCase();
      if (!VALID_STATUSES.includes(normalizedStatus)) {
        return NextResponse.json(
          {
            success: false,
            error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
          },
          { status: 400 }
        );
      }
      updateData.status = normalizedStatus;
    }

    if (pickupDate) {
      const parsedDate = new Date(pickupDate);
      if (isNaN(parsedDate.getTime())) {
        return NextResponse.json(
          { success: false, error: "Invalid pickupDate format." },
          { status: 400 }
        );
      }
      updateData.pickupDate = parsedDate;
    }

    // Admin-only fields
    if (adminSession.valid) {
      if (typeof actualWeightKg === "number") {
        updateData.actualWeightKg = actualWeightKg;
      }
      if (typeof finalPayoutInr === "number") {
        updateData.finalPayoutInr = finalPayoutInr;
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, error: "No valid fields provided to update." },
        { status: 400 }
      );
    }

    // 1. Update in PostgreSQL
    let dbRecord;
    try {
      dbRecord = await withDbTimeout(
        prisma.pickup.update({
          where: { id },
          data: updateData,
        }),
        15000
      );
    } catch (dbErr: any) {
      console.warn(
        `Prisma update on PostgreSQL for ID ${id} (${dbErr?.code || dbErr?.message})`
      );
    }

    // 2. Update local fallback store if status changed
    let storeRecord = null;
    if (updateData.status) {
      storeRecord = await updatePickupStatus(id, updateData.status);
    }

    return NextResponse.json({
      success: true,
      pickup: dbRecord || storeRecord || { id, ...updateData },
      message: updateData.status === "CANCELLED"
        ? "Pickup cancelled successfully."
        : updateData.pickupDate
        ? "Pickup slot rescheduled successfully."
        : "Pickup updated successfully.",
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
