import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  if (pathname === "/verify-email") {
    const token = searchParams.get("token");
    const lang = searchParams.get("lang");

    const url = new URL(request.url);
    if (token && lang) {
      url.pathname = "/auth/verify-email";
      return NextResponse.redirect(url);
    }
    url.pathname = "/auth/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/complete-registration/")) {
    const userId = pathname.split("/complete-registration/")[1];
    const url = new URL(request.url);
    if (userId) {
      url.pathname = `/auth/complete-registration/${userId}`;
      return NextResponse.redirect(url);
    }
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/reset-password/")) {
    const token = pathname.split("/reset-password/")[1];
    const url = new URL(request.url);
    if (token) {
      url.pathname = "/auth/reset-password";
      url.searchParams.set("token", token);
      return NextResponse.redirect(url);
    }
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/verify-email",
    "/complete-registration/:path*",
    "/reset-password/:path*",
  ],
};
