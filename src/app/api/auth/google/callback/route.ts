import { NextRequest, NextResponse } from "next/server";
import { prisma, withDbTimeout } from "@/lib/prisma";
import {
  signCustomerSessionToken,
  CUSTOMER_SESSION_COOKIE,
  CUSTOMER_SESSION_MAX_AGE,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const origin =
    request.nextUrl.origin ||
    request.headers.get("origin") ||
    "http://localhost:3000";
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || origin).trim().replace(/\/+$/, "");

  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const errorParam = searchParams.get("error");

    // 1. Handle error returned by Google
    if (errorParam) {
      console.warn("Google OAuth returned an error:", errorParam);
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(errorParam)}`, baseUrl)
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        new URL("/login?error=missing_code_or_state", baseUrl)
      );
    }

    // 2. Validate state token against httpOnly cookie
    const savedState = request.cookies.get("kabaadse_oauth_state")?.value;
    if (!savedState || savedState !== state) {
      console.error("OAuth state mismatch. Received:", state, "Expected:", savedState);
      return NextResponse.redirect(
        new URL("/login?error=invalid_oauth_state", baseUrl)
      );
    }

    const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
    const redirectUri = `${baseUrl}/api/auth/google/callback`;

    if (!clientId || !clientSecret) {
      console.error("Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET.");
      return NextResponse.redirect(
        new URL("/login?error=google_not_configured", baseUrl)
      );
    }

    // 3. Exchange authorization code for Google access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokens = await tokenResponse.json();

    if (!tokenResponse.ok || !tokens.access_token) {
      console.error("Failed to exchange code for token:", tokens);
      return NextResponse.redirect(
        new URL("/login?error=token_exchange_failed", baseUrl)
      );
    }

    // 4. Fetch user profile information from Google userinfo API
    const userinfoResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    const userInfo = await userinfoResponse.json();

    if (!userinfoResponse.ok || !userInfo?.email) {
      console.error("Failed to fetch userinfo from Google:", userInfo);
      return NextResponse.redirect(
        new URL("/login?error=userinfo_fetch_failed", baseUrl)
      );
    }

    const cleanEmail = String(userInfo.email).trim().toLowerCase();
    const cleanName = String(
      userInfo.name || cleanEmail.split("@")[0] || "Customer"
    ).trim();
    const pictureUrl = userInfo.picture ? String(userInfo.picture).trim() : null;

    // 5. Find or create Customer in Neon database
    let customer = await withDbTimeout(
      prisma.customer.findFirst({
        where: {
          email: {
            equals: cleanEmail,
            mode: "insensitive",
          },
        },
      })
    );

    if (!customer) {
      // Auto-signup: create a new customer record
      customer = await withDbTimeout(
        prisma.customer.create({
          data: {
            name: cleanName,
            email: cleanEmail,
            phone: null,
            passwordHash: null,
            defaultAddress: null,
          },
        })
      );
    } else if (cleanName && (!customer.name || customer.name === "Customer")) {
      // Update customer name if generic
      try {
        customer = await withDbTimeout(
          prisma.customer.update({
            where: { id: customer.id },
            data: { name: cleanName },
          })
        );
      } catch (updateErr) {
        console.warn("Notice: Could not update customer name:", updateErr);
      }
    }

    // Best-effort: link unlinked guest pickups if customer already has a phone saved
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
      } catch (linkErr) {
        console.warn("Notice: Could not link previous guest pickups:", linkErr);
      }
    }

    // 6. Sign customer session token (exact same JWT structure as /api/customer/login)
    const token = await signCustomerSessionToken({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone || null,
    });

    // 7. Redirect to /dashboard with session cookie
    const destinationUrl = new URL("/dashboard", baseUrl);
    const response = NextResponse.redirect(destinationUrl);

    // Set Customer Session HttpOnly cookie
    response.cookies.set({
      name: CUSTOMER_SESSION_COOKIE,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: CUSTOMER_SESSION_MAX_AGE,
    });

    // Clean up temporary oauth state cookie
    response.cookies.set({
      name: "kabaadse_oauth_state",
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    // If Google returned an avatar picture, set a non-httpOnly temporary cookie
    // so dashboard client can automatically set customer photo
    if (pictureUrl) {
      response.cookies.set({
        name: "kabaadse_google_avatar",
        value: pictureUrl,
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 3600,
      });
    }

    return response;
  } catch (error: any) {
    console.error("GET /api/auth/google/callback error:", error);
    return NextResponse.redirect(
      new URL("/login?error=authentication_failed", baseUrl)
    );
  }
}

