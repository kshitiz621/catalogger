import type { MetadataRoute } from "next";
import { getPublicSitemapEntries } from "@/lib/seo/sitemap.service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { base, stores } = await getPublicSitemapEntries();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  const storeRoutes: MetadataRoute.Sitemap = stores.map((store) => ({
    url: `${base}/store/${store.slug}`,
    lastModified: store.createdAt,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  return [...staticRoutes, ...storeRoutes];
}
