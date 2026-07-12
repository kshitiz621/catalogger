import type { Metadata } from "next";
import { getAppUrl } from "@/lib/env";
import { getMetadataBase, SITE_NAME } from "@/lib/seo/metadata";
import type { PublicProduct, PublicStore } from "@/types/storefront";

function storeKeywords(store: PublicStore): string[] | undefined {
  return store.seoKeywords
    ?.split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);
}

export function createStoreMetadata(store: PublicStore): Metadata {
  const title = store.storeTitle || `${store.name} | Catalogue`;
  const description =
    store.seoDescription ||
    store.description ||
    `Shop ${store.name} — browse products and order via WhatsApp.`;
  const base = getMetadataBase();
  const url = `${getAppUrl()}/store/${store.slug}`;
  const image = store.bannerUrl || store.logoUrl;

  return {
    metadataBase: base,
    title,
    description,
    keywords: storeKeywords(store),
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: store.name,
      type: "website",
      images: image ? [{ url: image, alt: store.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
    icons: store.logoUrl
      ? [
          { rel: "icon", url: store.logoUrl },
          { rel: "apple-touch-icon", url: store.logoUrl },
        ]
      : undefined,
  };
}

export function createProductMetadata(
  store: PublicStore,
  product: PublicProduct
): Metadata {
  const title = `${product.name} | ${store.name}`;
  const description =
    product.description?.slice(0, 160) ||
    `Buy ${product.name} from ${store.name}. Order via WhatsApp.`;
  const url = `${getAppUrl()}/store/${store.slug}/product/${product.id}`;
  const image = product.imageUrl || store.logoUrl;

  return {
    metadataBase: getMetadataBase(),
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: store.name,
      type: "website",
      images: image ? [{ url: image, alt: product.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
    icons: store.logoUrl
      ? [
          { rel: "icon", url: store.logoUrl },
          { rel: "apple-touch-icon", url: store.logoUrl },
        ]
      : undefined,
  };
}

export function createStorePrivateMetadata(storeName: string): Metadata {
  return {
    title: `${storeName} | ${SITE_NAME}`,
    robots: { index: false, follow: false },
  };
}
