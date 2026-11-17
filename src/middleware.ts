import { NextRequest, NextResponse } from "next/server";
import {
  verifySessionToken,
  ADMIN_SESSION_COOKIE,
  verifyCustomerSessionToken,
  CUSTOMER_SESSION_COOKIE,
} from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Protect Customer Dashboard Routes (/dashboard)
  if (pathname.startsWith("/dashboard")) {
    const customerCookie = request.cookies.get(CUSTOMER_SESSION_COOKIE)?.value;
    const customerSession = await verifyCustomerSessionToken(customerCookie);

    if (!customerSession.valid) {
      const redirectUrl = new URL("/", request.url);
      redirectUrl.searchParams.set("auth", "customer");
      return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
  }

  // 2. Protect Admin Page Routes (/admin)
  const sessionCookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const session = await verifySessionToken(sessionCookie);

  if (pathname.startsWith("/admin")) {
    const isLoginPage = pathname === "/admin/login";

    // If visiting /admin/login while already authenticated, redirect to /admin
    if (isLoginPage) {
      if (session.valid) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.next();
    }

    // Unauthenticated access to /admin or subpaths -> redirect to /admin/login
    if (!session.valid) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // 3. Protect Admin API Write Operations & Operations Queries
  const method = request.method.toUpperCase();

  // /api/pickup & /api/pickups:
  // - Public: POST (customer doorstep pickup submissions)
  // - Protected (Admin or Customer): PATCH & DELETE on individual bookings (/api/pickups/[id])
  // - Protected (Admin only): GET (operations dashboard data)
  if (
    pathname.startsWith("/api/pickups") ||
    pathname.startsWith("/api/pickup")
  ) {
    if (method === "POST") {
      return NextResponse.next();
    }

    if (["PATCH", "DELETE"].includes(method)) {
      const customerCookie = request.cookies.get(CUSTOMER_SESSION_COOKIE)?.value;
      const customerSession = await verifyCustomerSessionToken(customerCookie);

      if (!session.valid && !customerSession.valid) {
        return NextResponse.json(
          { success: false, error: "Unauthorized. Valid session required." },
          { status: 401 }
        );
      }
      return NextResponse.next();
    }

    if (method === "GET") {
      if (!session.valid) {
        return NextResponse.json(
          { success: false, error: "Unauthorized. Admin session required." },
          { status: 401 }
        );
      }
    }
  }

  // /api/rates:
  // - Public: GET (live rate card for website visitors)
  // - Protected: POST, PUT, PATCH, DELETE (admin rate price and catalog updates)
  if (pathname.startsWith("/api/rates")) {
    if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
      if (!session.valid) {
        return NextResponse.json(
          { success: false, error: "Unauthorized. Admin session required." },
          { status: 401 }
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/dashboard",
    "/admin/:path*",
    "/api/pickups/:path*",
    "/api/pickups",
    "/api/pickup/:path*",
    "/api/pickup",
    "/api/rates/:path*",
    "/api/rates",
  ],
};
