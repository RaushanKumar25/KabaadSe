import { NextRequest, NextResponse } from "next/server";
import { prisma, withDbTimeout } from "@/lib/prisma";
import {
  signCustomerSessionToken,
  CUSTOMER_SESSION_COOKIE,
  CUSTOMER_SESSION_MAX_AGE,
} from "@/lib/auth";
import { hashPassword } from "@/lib/password";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON request body." },
        { status: 400 }
      );
    }

    const { name, email, phone, password, defaultAddress } = body || {};

    const cleanName = (name || "").trim();
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPhone = (phone || "").replace(/\D/g, "").slice(0, 10);
    const cleanPassword = (password || "").trim();
    const cleanAddress = (defaultAddress || "").trim();

    // 1. Validation
    if (cleanName.length < 2) {
      return NextResponse.json(
        { success: false, error: "Name must be at least 2 characters." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (cleanPhone.length !== 10) {
      return NextResponse.json(
        { success: false, error: "Contact phone number must be exactly 10 digits." },
        { status: 400 }
      );
    }

    if (cleanPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    // 2. Check for duplicate email or phone
    const existing = await withDbTimeout(
      prisma.customer.findFirst({
        where: {
          OR: [{ email: cleanEmail }, { phone: cleanPhone }],
        },
      })
    );

    if (existing) {
      if (existing.email === cleanEmail) {
        return NextResponse.json(
          { success: false, error: "An account with this email address already exists. Please log in." },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { success: false, error: "An account with this phone number already exists. Please log in." },
        { status: 409 }
      );
    }

    // 3. Hash password
    const passwordHash = await hashPassword(cleanPassword);

    // 4. Create Customer
    const customer = await withDbTimeout(
      prisma.customer.create({
        data: {
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          passwordHash,
          defaultAddress: cleanAddress || null,
        },
      })
    );

    // 5. Automatically link any earlier guest pickups matching this customer's phone number
    try {
      await withDbTimeout(
        prisma.pickupRequest.updateMany({
          where: {
            customerPhone: cleanPhone,
            customerId: null,
          },
          data: {
            customerId: customer.id,
          },
        }),
        10000
      );
    } catch (linkErr) {
      console.warn("Notice: Could not link previous guest pickups:", linkErr);
    }

    // 6. Sign customer session token
    const token = await signCustomerSessionToken({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
    });

    // 7. Prepare response with HttpOnly session cookie
    const response = NextResponse.json(
      {
        success: true,
        customer: {
          id: customer.id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          defaultAddress: customer.defaultAddress,
        },
      },
      { status: 201 }
    );

    response.cookies.set({
      name: CUSTOMER_SESSION_COOKIE,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: CUSTOMER_SESSION_MAX_AGE,
    });

    return response;
  } catch (error: any) {
    console.error("POST /api/customer/signup error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to create customer account. Please try again.",
      },
      { status: 500 }
    );
  }
}

