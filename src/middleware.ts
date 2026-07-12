import { auth } from "@/lib/auth/server";
import { isMaintenanceMode } from "@/lib/env";
import {
  checkRateLimit,
  getRateLimitForPath,
} from "@/lib/security/rate-limit";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const neonAuthMiddleware = auth.middleware({
  loginUrl: "/login",
});

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return req.headers.get("x-real-ip") ?? "unknown";
}

function applyRateLimit(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const config = getRateLimitForPath(pathname);
  if (!config) return null;

  const ip = getClientIp(req);
  const result = checkRateLimit(`${ip}:${pathname}`, config);

  if (!result.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((result.resetAt - Date.now()) / 1000)),
        },
      }
    );
  }

  return null;
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isMaintenanceMode()) {
    const allowed =
      pathname.startsWith("/maintenance") ||
      pathname.startsWith("/api/health") ||
      pathname.startsWith("/platform") ||
      pathname.startsWith("/_next");

    if (!allowed) {
      return NextResponse.rewrite(new URL("/maintenance", req.url));
    }
  }

  if (pathname.startsWith("/api/")) {
    const rateLimited = applyRateLimit(req);
    if (rateLimited) return rateLimited;
    return NextResponse.next();
  }

  if (pathname === "/platform/login") {
    return NextResponse.next();
  }

  if (pathname.startsWith("/dashboard/") || pathname.startsWith("/platform/")) {
    return neonAuthMiddleware(req);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/platform/:path*",
    "/api/:path*",
    "/((?!_next/static|_next/image|favicon.ico|icon|opengraph-image|robots.txt|sitemap.xml|manifest.webmanifest).*)",
  ],
};
