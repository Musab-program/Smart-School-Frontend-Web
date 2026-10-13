// src/middleware.ts
// Next.js middleware — runs before EVERY request.
// Redirects unauthenticated users to /auth/login.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Pages that do NOT require authentication
const PUBLIC_PATHS = ["/auth/login", "/auth/register", "/auth/forgot-password"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths, API routes, and static assets
  if (
    PUBLIC_PATHS.some((p) => pathname.startsWith(p)) ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/fonts/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check for the access token cookie
  const token = request.cookies.get("smart_school_access_token")?.value;

  if (!token) {
    // Not authenticated — redirect to login
    const loginUrl = new URL("/auth/login", request.url);
    // Save the original URL so we can redirect back after login
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Apply middleware to all routes
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
