import { NextRequest, NextResponse } from "next/server";
import { prisma, withDbTimeout } from "@/lib/prisma";
import {
  signCustomerSessionToken,
  CUSTOMER_SESSION_COOKIE,
  CUSTOMER_SESSION_MAX_AGE,
} from "@/lib/auth";
import { comparePassword } from "@/lib/password";

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

    const { identifier, email, phone, password } = body || {};
    const rawIdentifier = (identifier || email || phone || "").trim();
    const cleanPassword = (password || "").trim();

    if (!rawIdentifier || !cleanPassword) {
      return NextResponse.json(
        { success: false, error: "Please enter your email or phone number and password." },
        { status: 400 }
      );
    }

    const isEmail = rawIdentifier.includes("@");
    const digitsOnly = rawIdentifier.replace(/\D/g, "");
    const cleanPhone = digitsOnly.slice(-10);

    // 1. Locate customer by email or 10-digit phone number
    const customer = await withDbTimeout(
      prisma.customer.findFirst({
        where: isEmail
          ? { email: rawIdentifier.toLowerCase() }
          : { phone: cleanPhone },
      })
    );

    if (!customer) {
      return NextResponse.json(
        { success: false, error: "No account found matching this identifier. Please check your credentials or sign up." },
        { status: 401 }
      );
    }

    // 2. Validate password
    if (!customer.passwordHash) {
      return NextResponse.json(
        {
          success: false,
          error: "This account was created with Google. Please use 'Continue with Google' to sign in.",
        },
        { status: 400 }
      );
    }

    const isPasswordValid = await comparePassword(cleanPassword, customer.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: "Invalid email/phone or password." },
        { status: 401 }
      );
    }

    // 3. Best-effort: link any new unlinked guest pickups for this phone number
    if (customer.phone) {
      try {
        await withDbTimeout(
          prisma.pickupRequest.updateMany({
            where: {
              customerPhone: customer.phone,
              customerId: null,
            },
            data: {
              customerId: customer.id,
            },
          }),
          5000
        );
      } catch {
        // Ignore background link errors
      }
    }

    // 4. Sign customer session token
    const token = await signCustomerSessionToken({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
    });

    // 5. Return success response with HttpOnly cookie
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
      { status: 200 }
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
    console.error("POST /api/customer/login error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Authentication failed. Please try again.",
      },
      { status: 500 }
    );
  }
}

