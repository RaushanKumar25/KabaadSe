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
        { success: false, customer: null },
        { status: 200 }
      );
    }

    // Retrieve fresh customer record from database
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
        { success: false, customer: null },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: true, customer },
      {
        status: 200,
        headers: { "Cache-Control": "no-store, max-age=0" },
      }
    );
  } catch (error: any) {
    console.error("GET /api/customer/me error:", error);
    return NextResponse.json(
      { success: false, customer: null, error: error?.message },
      { status: 500 }
    );
  }
}

