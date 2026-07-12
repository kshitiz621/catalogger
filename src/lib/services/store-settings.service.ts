import { prisma } from "@/lib/prisma";
import { findStoreByUserId, findStoreBySlug, updateStore } from "@/lib/prisma-compat";
import type { StoreSettings, StoreSocialLinks } from "@/types/store-settings";
import { EMPTY_SOCIAL_LINKS } from "@/types/store-settings";
import type { z } from "zod";
import type { StoreUpdateSchema } from "@/lib/schema";
import { Prisma } from "@prisma/client";

type StoreUpdateInput = z.infer<typeof StoreUpdateSchema>;

function normalizeSocialLinks(links?: StoreSocialLinks | null): StoreSocialLinks {
  if (!links) return { ...EMPTY_SOCIAL_LINKS };
  return {
    instagram: links.instagram || null,
    facebook: links.facebook || null,
    twitter: links.twitter || null,
    youtube: links.youtube || null,
    tiktok: links.tiktok || null,
    website: links.website || null,
  };
}

function toStoreSettings(store: NonNullable<Awaited<ReturnType<typeof findStoreByUserId>>>): StoreSettings {
  return {
    id: store.id,
    name: store.name,
    slug: store.slug,
    whatsappNumber: store.whatsappNumber,
    logoUrl: store.logoUrl,
    bannerUrl: store.bannerUrl ?? null,
    description: store.description ?? null,
    storeTitle: store.storeTitle,
    seoDescription: store.seoDescription ?? null,
    seoKeywords: store.seoKeywords ?? null,
    themeColor: store.themeColor ?? "#E11D48",
    accentColor: store.accentColor ?? "#F43F5E",
    showCategoryImages: store.showCategoryImages ?? false,
    categoryImageStyle: store.categoryImageStyle ?? "square",
    productsPerRow: store.productsPerRow ?? 4,
    fontFamily: store.fontFamily ?? "Inter",
    fontSize: store.fontSize ?? "medium",
    fontWeight: store.fontWeight ?? "semibold",
    cardRadius: store.cardRadius ?? "lg",
    headerCode: store.headerCode,
    footerCode: store.footerCode,
    socialLinks: normalizeSocialLinks(store.socialLinks as StoreSocialLinks),
  };
}

export const StoreSettingsService = {
  async getByUserId(userId: string): Promise<StoreSettings | null> {
    const store = await findStoreByUserId(userId);
    return store ? toStoreSettings(store) : null;
  },

  async update(userId: string, data: StoreUpdateInput) {
    const store = await findStoreByUserId(userId);
    if (!store) throw new Error("Store not found");

    const existing = await findStoreBySlug(data.slug);
    if (existing && existing.id !== store.id) {
      throw new Error("Store URL slug is already taken");
    }

    const socialLinks = normalizeSocialLinks(data.socialLinks);

    const updated = await updateStore(store.id, {
      name: data.name,
      slug: data.slug,
      whatsappNumber: data.whatsappNumber,
      logoUrl: data.logoUrl,
      bannerUrl: data.bannerUrl,
      description: data.description,
      storeTitle: data.storeTitle,
      seoDescription: data.seoDescription,
      seoKeywords: data.seoKeywords,
      showCategoryImages: data.showCategoryImages,
      categoryImageStyle: data.categoryImageStyle,
      themeColor: data.themeColor,
      accentColor: data.accentColor,
      headerCode: data.headerCode,
      footerCode: data.footerCode,
      productsPerRow: data.productsPerRow,
      fontFamily: data.fontFamily,
      fontSize: data.fontSize,
      fontWeight: data.fontWeight,
      cardRadius: data.cardRadius,
      socialLinks: socialLinks as Prisma.InputJsonValue,
    });

    return toStoreSettings(updated);
  },
};
