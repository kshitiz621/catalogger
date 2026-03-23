import middleware from "next-auth/middleware";
import type { NextRequest } from "next/server";
import type { NextFetchEvent } from "next/server";

export function proxy(req: NextRequest, event: NextFetchEvent) {
  return middleware(req as any, event);
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
