import { auth } from "@/lib/auth/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const neonAuthMiddleware = auth.middleware({
  loginUrl: "/login",
});

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/platform/login") {
    return NextResponse.next();
  }

  return neonAuthMiddleware(req);
}

export const config = {
  matcher: ["/dashboard/:path*", "/platform/:path*"],
};
