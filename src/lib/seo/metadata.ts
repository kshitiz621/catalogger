import type { Metadata } from "next";
import { getAppUrl } from "@/lib/env";

export const SITE_NAME = "Catalogger";
export const SITE_DESCRIPTION =
  "Create stunning online product catalogues in minutes. Share anywhere, let customers order via WhatsApp.";

export function getMetadataBase(): URL {
  return new URL(getAppUrl());
}

export function createPageMetadata({
  title,
  description = SITE_DESCRIPTION,
  path = "",
  noIndex = false,
  keywords,
  imagePath = "/opengraph-image",
}: {
  title: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
  keywords?: string[];
  imagePath?: string;
}): Metadata {
  const base = getMetadataBase();
  const url = new URL(path, base).toString();
  const imageUrl = new URL(imagePath, base).toString();

  return {
    metadataBase: base,
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_IN",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export const privateRouteMetadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};
