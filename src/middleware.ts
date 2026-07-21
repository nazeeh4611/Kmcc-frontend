import { NextResponse, type NextRequest } from "next/server";

const ADMIN_PREFIX = "/admin";
const MEMBER_PREFIX = "/dashboard";
const ADMIN_LOGIN_PATH = "/admin/login";
const MEMBER_LOGIN_PATH = "/login";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasAccessToken = request.cookies.has("accessToken");

  const isAdminRoute = pathname.startsWith(ADMIN_PREFIX) && pathname !== ADMIN_LOGIN_PATH;
  const isMemberRoute = pathname.startsWith(MEMBER_PREFIX);

  if ((isAdminRoute || isMemberRoute) && !hasAccessToken) {
    const loginUrl = new URL(isAdminRoute ? ADMIN_LOGIN_PATH : MEMBER_LOGIN_PATH, request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Note: this only checks for the cookie's presence, not its validity or
  // which account type it belongs to — the access token is short-lived and
  // opaque to the edge runtime. Each protected layout additionally calls
  // GET /auth/me on mount and redirects if the session is invalid or the
  // wrong type (admin vs member), so this middleware is a fast first pass,
  // not the sole guard.
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
