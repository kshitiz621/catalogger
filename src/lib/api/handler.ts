import { NextResponse } from "next/server";
import { ZodSchema } from "zod";
import { getAppSession } from "@/lib/auth/app-session";
import { canAccessPlatformAdmin, hasSellerAccess } from "@/lib/auth/roles";
import { checkRateLimit, getClientIp, getRateLimitForPath } from "@/lib/security/rate-limit";

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function jsonSuccess<T extends Record<string, unknown>>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export async function withRateLimit(request: Request, pathname: string) {
  const config = getRateLimitForPath(pathname);
  if (!config) return null;

  const ip = getClientIp(request);
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

export async function parseJsonBody<T>(request: Request, schema: ZodSchema<T>) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return { error: jsonError("Invalid JSON body") } as const;
  }

  const result = schema.safeParse(body);
  if (!result.success) {
    return { error: jsonError(result.error.issues[0]?.message ?? "Invalid request") } as const;
  }

  return { data: result.data } as const;
}

export async function requireSellerSession() {
  const session = await getAppSession();
  if (!session || !hasSellerAccess(session.user.role)) {
    return { error: jsonError("Unauthorized", 401) } as const;
  }
  return { session } as const;
}

export async function requireSuperAdminSession() {
  const session = await getAppSession();
  if (!session || !canAccessPlatformAdmin(session.user.role)) {
    return { error: jsonError("Unauthorized", 401) } as const;
  }
  return { session } as const;
}
