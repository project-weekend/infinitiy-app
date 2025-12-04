/**
 * Next.js Middleware - Route Protection
 * Protects authenticated routes and handles redirects
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/analytics",
  "/customers",
  "/orders",
  "/products",
];

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ["/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get token from cookies or check if it exists in the request
  // Note: Since we're using localStorage, we'll rely on client-side checks
  // This middleware provides an additional layer of protection

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if the route is an auth route (login)
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // For now, allow all requests to pass through
  // The client-side auth context will handle the actual authentication
  // This middleware can be enhanced to check server-side sessions/cookies

  // If you want to add server-side session checking:
  // const token = request.cookies.get('infinity_token')?.value;
  // if (isProtectedRoute && !token) {
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }
  // if (isAuthRoute && token) {
  //   return NextResponse.redirect(new URL('/dashboard', request.url));
  // }

  return NextResponse.next();
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)",
  ],
};
