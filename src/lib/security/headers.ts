import type { NextConfig } from "next";

export const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

export function applySecurityHeaders(config: NextConfig): NextConfig {
  return {
    ...config,
    poweredByHeader: false,
    async headers() {
      return [
        {
          source: "/(.*)",
          headers: securityHeaders,
        },
      ];
    },
  };
}
