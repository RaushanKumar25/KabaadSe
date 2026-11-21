import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
    if (!clientId) {
      console.error("Missing GOOGLE_CLIENT_ID environment variable.");
      return NextResponse.redirect(new URL("/login?error=google_not_configured", request.url));
    }

    // Determine canonical base URL
    const origin =
      request.nextUrl.origin ||
      request.headers.get("origin") ||
      "http://localhost:3000";
    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || origin).trim().replace(/\/+$/, "");
    const redirectUri = `${baseUrl}/api/auth/google/callback`;

    // Generate random cryptographic state token
    const state = crypto.randomBytes(32).toString("hex");

    // Construct Google OAuth 2.0 authorization endpoint URL
    const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    googleAuthUrl.searchParams.set("client_id", clientId);
    googleAuthUrl.searchParams.set("redirect_uri", redirectUri);
    googleAuthUrl.searchParams.set("response_type", "code");
    googleAuthUrl.searchParams.set("scope", "openid email profile");
    googleAuthUrl.searchParams.set("state", state);
    googleAuthUrl.searchParams.set("access_type", "offline");
    googleAuthUrl.searchParams.set("prompt", "select_account");

    const response = NextResponse.redirect(googleAuthUrl.toString());

    // Store state token in an httpOnly cookie valid for 10 minutes (600s)
    response.cookies.set({
      name: "kabaadse_oauth_state",
      value: state,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 600,
    });

    return response;
  } catch (error: any) {
    console.error("GET /api/auth/google error:", error);
    return NextResponse.redirect(new URL("/login?error=oauth_init_failed", request.url));
  }
}

