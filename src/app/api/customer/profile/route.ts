import { NextRequest, NextResponse } from "next/server";
import { prisma, withDbTimeout } from "@/lib/prisma";
import { verifyCustomerSessionToken, CUSTOMER_SESSION_COOKIE } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get(CUSTOMER_SESSION_COOKIE)?.value;
    const session = await verifyCustomerSessionToken(sessionCookie);

    if (!session.valid || !session.customer?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const customer = await withDbTimeout(
      prisma.customer.findUnique({
        where: { id: session.customer.id },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          defaultAddress: true,
          createdAt: true,
        },
      })
    );

    if (!customer) {
      return NextResponse.json(
        { success: false, error: "Customer not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, customer },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch (error: any) {
    console.error("GET /api/customer/profile error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get(CUSTOMER_SESSION_COOKIE)?.value;
    const session = await verifyCustomerSessionToken(sessionCookie);

    if (!session.valid || !session.customer?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in." },
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

    const { defaultAddress, name } = body || {};

    const updateData: { defaultAddress?: string | null; name?: string } = {};

    if (typeof defaultAddress === "string") {
      updateData.defaultAddress = defaultAddress.trim() || null;
    }

    if (typeof name === "string" && name.trim().length >= 2) {
      updateData.name = name.trim();
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, error: "No valid profile fields provided to update." },
        { status: 400 }
      );
    }

    const updated = await withDbTimeout(
      prisma.customer.update({
        where: { id: session.customer.id },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          defaultAddress: true,
          updatedAt: true,
        },
      })
    );

    return NextResponse.json({
      success: true,
      customer: updated,
      message: "Customer profile updated successfully.",
    });
  } catch (error: any) {
    console.error("PATCH /api/customer/profile error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update profile." },
      { status: 500 }
    );
  }
}

