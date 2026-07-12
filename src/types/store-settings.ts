export interface StoreSocialLinks {
  instagram?: string | null;
  facebook?: string | null;
  twitter?: string | null;
  youtube?: string | null;
  tiktok?: string | null;
  website?: string | null;
}

export interface StoreSettings {
  id: string;
  name: string;
  slug: string;
  whatsappNumber: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  description: string | null;
  storeTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  themeColor: string;
  accentColor: string;
  showCategoryImages: boolean;
  categoryImageStyle: string;
  productsPerRow: number;
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  cardRadius: string;
  headerCode: string | null;
  footerCode: string | null;
  socialLinks: StoreSocialLinks;
}

export type StoreSettingsInput = Omit<StoreSettings, "id">;

export const DEFAULT_ACCENT_COLOR = "#F43F5E";

export const EMPTY_SOCIAL_LINKS: StoreSocialLinks = {
  instagram: null,
  facebook: null,
  twitter: null,
  youtube: null,
  tiktok: null,
  website: null,
};
