import type { NextConfig } from "next";
import { applySecurityHeaders } from "@/lib/security/headers";

const nextConfig: NextConfig = applySecurityHeaders({
  allowedDevOrigins: ["192.168.29.37"],
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "**.amazonaws.com" },
      { protocol: "https", hostname: "**.r2.dev" },
      { protocol: "https", hostname: "**.cloudinary.com" },
    ],
    minimumCacheTTL: 60,
  },
});

export default nextConfig;
