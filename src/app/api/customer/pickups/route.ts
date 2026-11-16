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

    const customerId = session.customer.id;
    const customerPhone = session.customer.phone;

    // Fetch all pickups belonging to this customer (by customerId or matched customerPhone)
    const pickups = await withDbTimeout(
      prisma.pickupRequest.findMany({
        where: {
          OR: [
            { customerId },
            ...(customerPhone ? [{ customerPhone }] : []),
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    );

    // Format pickup date strings and numeric fields for clean UI display
    const formattedPickups = pickups.map((p) => ({
      id: p.id,
      customerName: p.customerName,
      customerPhone: p.customerPhone,
      city: p.city,
      locality: p.locality,
      address: p.address,
      pickupDate: p.pickupDate.toISOString().split("T")[0],
      estimatedLoad: p.estimatedLoad,
      scrapTypes: p.scrapTypes,
      status: (p.status || "PENDING").toUpperCase(),
      actualWeightKg: p.actualWeightKg,
      finalPayoutInr: p.finalPayoutInr,
      createdAt: p.createdAt.toISOString(),
    }));

    return NextResponse.json(
      {
        success: true,
        count: formattedPickups.length,
        pickups: formattedPickups,
      },
      {
        status: 200,
        headers: { "Cache-Control": "no-store, max-age=0" },
      }
    );
  } catch (error: any) {
    console.error("GET /api/customer/pickups error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to load customer bookings.",
      },
      { status: 500 }
    );
  }
}

