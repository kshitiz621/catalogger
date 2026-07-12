import type { MetadataRoute } from "next";
import { getAppUrl } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  const base = getAppUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/store/"],
        disallow: [
          "/dashboard/",
          "/platform/",
          "/api/",
          "/login",
          "/signup",
          "/auth/",
          "/store/*/cart",
          "/store/*/checkout",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
