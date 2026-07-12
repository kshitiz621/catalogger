export type StorefrontSort =
  | "newest"
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc";

export interface StorefrontTheme {
  showCategoryImages: boolean;
  categoryImageStyle: string;
  productsPerRow: number;
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  cardRadius: string;
}

export interface StoreSocialLinks {
  instagram?: string | null;
  facebook?: string | null;
  twitter?: string | null;
  youtube?: string | null;
  tiktok?: string | null;
  website?: string | null;
}

export interface PublicStore {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  bannerUrl: string | null;
  description: string | null;
  storeTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  themeColor: string;
  accentColor: string;
  whatsappNumber: string | null;
  socialLinks: StoreSocialLinks;
  theme: StorefrontTheme;
}

export interface PublicCategory {
  id: string;
  name: string;
  imageUrl: string | null;
  productCount: number;
}

export interface PublicProduct {
  id: string;
  name: string;
  price: number;
  description: string | null;
  imageUrl: string | null;
  categoryId: string | null;
  categoryName: string | null;
  createdAt: string;
}

export interface PublicCatalogue {
  store: PublicStore;
  categories: PublicCategory[];
  products: PublicProduct[];
}

export interface StorefrontProductFilters {
  search?: string;
  categoryId?: string;
  sort?: StorefrontSort;
  minPrice?: number;
  maxPrice?: number;
}

export interface CheckoutCustomer {
  name: string;
  phone: string;
  note?: string;
}
