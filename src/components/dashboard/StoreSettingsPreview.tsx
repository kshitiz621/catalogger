"use client";

import Link from "next/link";
import { ExternalLink, Instagram, Facebook, Globe, Youtube } from "lucide-react";
import type { StoreSocialLinks } from "@/types/store-settings";
import { getStoreFontUrl } from "@/lib/storefront/theme";

export interface StorePreviewData {
  name: string;
  slug: string;
  logoUrl?: string;
  bannerUrl?: string;
  description?: string;
  storeTitle?: string;
  seoDescription?: string;
  themeColor: string;
  accentColor: string;
  fontFamily: string;
  socialLinks: StoreSocialLinks;
}

interface StoreSettingsPreviewProps {
  data: StorePreviewData;
}

export function StoreSettingsPreview({ data }: StoreSettingsPreviewProps) {
  const fontUrl = getStoreFontUrl(data.fontFamily);
  const displayTitle = data.storeTitle || data.name;

  return (
    <div
      className="rounded-xl border border-border overflow-hidden bg-card shadow-sm"
      style={
        {
          "--primary": data.themeColor,
          "--accent": data.accentColor,
          fontFamily: `'${data.fontFamily}', sans-serif`,
        } as React.CSSProperties
      }
    >
      <link rel="stylesheet" href={fontUrl} />

      <div className="flex items-center justify-between border-b border-border px-4 py-2.5 bg-muted/30">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Live Preview
        </p>
        <Link
          href={`/store/${data.slug}`}
          target="_blank"
          className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
        >
          Open store <ExternalLink className="h-3 w-3" />
        </Link>
      </div>

      <div className="max-h-[520px] overflow-y-auto">
        {/* Mock browser chrome */}
        <div className="flex items-center gap-1.5 border-b border-border bg-muted/40 px-3 py-2">
          <div className="h-2 w-2 rounded-full bg-destructive/60" />
          <div className="h-2 w-2 rounded-full bg-warning/60" />
          <div className="h-2 w-2 rounded-full bg-success/60" />
          <div className="ml-2 flex-1 rounded-md bg-background border border-border px-2 py-0.5 text-[10px] text-muted-foreground truncate">
            catalogger.com/store/{data.slug}
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-card/80">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-8 w-8 rounded-lg border border-border overflow-hidden bg-muted shrink-0">
              {data.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={data.logoUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-primary/10" />
              )}
            </div>
            <span className="text-sm font-bold truncate">{data.name}</span>
          </div>
          <div
            className="rounded-lg px-2.5 py-1 text-[10px] font-bold text-primary-foreground"
            style={{ backgroundColor: data.themeColor }}
          >
            Cart
          </div>
        </div>

        {/* Banner */}
        <div
          className="relative h-28 sm:h-36 bg-muted/40 overflow-hidden"
          style={
            data.bannerUrl
              ? undefined
              : {
                  background: `linear-gradient(135deg, ${data.themeColor}22, ${data.accentColor}33)`,
                }
          }
        >
          {data.bannerUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.bannerUrl} alt="" className="h-full w-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4">
            <h2 className="text-lg font-extrabold text-foreground truncate">{data.name}</h2>
            {data.description && (
              <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">
                {data.description}
              </p>
            )}
          </div>
        </div>

        {/* Product grid mock */}
        <div className="p-4 space-y-3">
          <div className="flex gap-2">
            <div
              className="h-6 w-14 rounded-full"
              style={{ backgroundColor: data.themeColor }}
            />
            <div className="h-6 w-14 rounded-full bg-muted" />
            <div className="h-6 w-14 rounded-full bg-muted" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-xl border border-border overflow-hidden bg-card">
                <div className="aspect-square bg-muted/50" />
                <div className="p-2 space-y-1">
                  <div className="h-2.5 w-3/4 rounded bg-muted" />
                  <div
                    className="h-2 w-1/3 rounded"
                    style={{ backgroundColor: `${data.themeColor}44` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SEO snippet */}
        <div className="border-t border-border p-4 bg-muted/20 space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Search Preview
          </p>
          <p className="text-sm text-[#1a0dab] font-medium truncate">{displayTitle}</p>
          <p className="text-[11px] text-[#006621] truncate">
            catalogger.com/store/{data.slug}
          </p>
          <p className="text-[11px] text-muted-foreground line-clamp-2">
            {data.seoDescription ||
              data.description ||
              `Browse products from ${data.name}.`}
          </p>
        </div>

        {/* Social links */}
        {(data.socialLinks.instagram ||
          data.socialLinks.facebook ||
          data.socialLinks.website ||
          data.socialLinks.youtube) && (
          <div className="border-t border-border px-4 py-3 flex items-center gap-3">
            {data.socialLinks.instagram && <Instagram className="h-4 w-4 text-muted-foreground" />}
            {data.socialLinks.facebook && <Facebook className="h-4 w-4 text-muted-foreground" />}
            {data.socialLinks.youtube && <Youtube className="h-4 w-4 text-muted-foreground" />}
            {data.socialLinks.website && <Globe className="h-4 w-4 text-muted-foreground" />}
          </div>
        )}
      </div>
    </div>
  );
}
