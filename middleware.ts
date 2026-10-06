import { NextRequest, NextResponse } from "next/server";
import { COOKIE, verifySession } from "@/lib/session";

export async function middleware(req: NextRequest) {
  const s = await verifySession(req.cookies.get(COOKIE)?.value);
  const { pathname } = req.nextUrl;
  if (!s || (pathname.startsWith("/admin") && s.role !== "admin")) return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(pathname)}`, req.url));
  return NextResponse.next();
}
export const config = { matcher: ["/admin/:path*", "/account/:path*", "/checkout/:path*", "/order-confirmation/:path*", "/wishlist/:path*"] };
