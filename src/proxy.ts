import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  const isProtectedPath =
    pathname.startsWith("/create") ||
    pathname.startsWith("/edit") ||
    pathname.startsWith("/design");

  if (isProtectedPath && !token) {
    const url = new URL("/", request.url);
    url.searchParams.set("login", "true");
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|images|icons|favicon.ico).*)"],
};
