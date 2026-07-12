type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, RateLimitEntry>();

export type RateLimitConfig = {
  limit: number;
  windowMs: number;
};

export function checkRateLimit(
  key: string,
  { limit, windowMs }: RateLimitConfig
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = buckets.get(key);

  if (!entry || now >= entry.resetAt) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  buckets.set(key, entry);
  return { allowed: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}

export const RATE_LIMITS = {
  auth: { limit: 10, windowMs: 60_000 },
  slugCheck: { limit: 30, windowMs: 60_000 },
  publicApi: { limit: 120, windowMs: 60_000 },
} as const;

export function getRateLimitForPath(pathname: string): RateLimitConfig | null {
  if (pathname.startsWith("/api/auth/legacy-login") || pathname.startsWith("/api/auth/signup")) {
    return RATE_LIMITS.auth;
  }
  if (pathname.startsWith("/api/store/check-slug")) {
    return RATE_LIMITS.slugCheck;
  }
  if (pathname.startsWith("/api/store/") && !pathname.startsWith("/api/store/check-slug")) {
    return RATE_LIMITS.publicApi;
  }
  return null;
}
