import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import type {
  PublicCatalogue,
  PublicCategory,
  PublicProduct,
  PublicStore,
  StorefrontProductFilters,
  StorefrontSort,
} from "@/types/storefront";

import type { StoreSocialLinks } from "@/types/storefront";

const storeSelect = {
  id: true,
  name: true,
  slug: true,
  logoUrl: true,
  bannerUrl: true,
  description: true,
  storeTitle: true,
  seoDescription: true,
  seoKeywords: true,
  themeColor: true,
  accentColor: true,
  socialLinks: true,
  whatsappNumber: true,
  showCategoryImages: true,
  categoryImageStyle: true,
  productsPerRow: true,
  fontFamily: true,
  fontSize: true,
  fontWeight: true,
  cardRadius: true,
  headerCode: true,
  footerCode: true,
} as const;

const legacyStoreSelect = {
  id: true,
  name: true,
  slug: true,
  logoUrl: true,
  storeTitle: true,
  themeColor: true,
  whatsappNumber: true,
  showCategoryImages: true,
  categoryImageStyle: true,
  productsPerRow: true,
  fontFamily: true,
  fontSize: true,
  fontWeight: true,
  cardRadius: true,
  headerCode: true,
  footerCode: true,
} as const;

const layoutSelect = {
  id: true,
  name: true,
  slug: true,
  logoUrl: true,
  themeColor: true,
  accentColor: true,
  socialLinks: true,
  headerCode: true,
  footerCode: true,
} as const;

const legacyLayoutSelect = {
  id: true,
  name: true,
  slug: true,
  logoUrl: true,
  themeColor: true,
  headerCode: true,
  footerCode: true,
} as const;

function isPrismaSchemaMismatch(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientValidationError;
}

async function findStoreForPublic<T extends Record<string, boolean>>(
  slug: string,
  select: T,
  legacySelect: T
) {
  try {
    return await prisma.store.findUnique({ where: { slug }, select });
  } catch (error) {
    if (!isPrismaSchemaMismatch(error)) throw error;
    return prisma.store.findUnique({ where: { slug }, select: legacySelect });
  }
}

function parseSocialLinks(value: unknown): StoreSocialLinks {
  if (!value || typeof value !== "object") return {};
  const raw = value as Record<string, unknown>;
  return {
    instagram: typeof raw.instagram === "string" ? raw.instagram : null,
    facebook: typeof raw.facebook === "string" ? raw.facebook : null,
    twitter: typeof raw.twitter === "string" ? raw.twitter : null,
    youtube: typeof raw.youtube === "string" ? raw.youtube : null,
    tiktok: typeof raw.tiktok === "string" ? raw.tiktok : null,
    website: typeof raw.website === "string" ? raw.website : null,
  };
}

function toPublicStore(store: {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  description?: string | null;
  storeTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  themeColor?: string | null;
  accentColor?: string | null;
  socialLinks?: unknown;
  whatsappNumber?: string | null;
  showCategoryImages?: boolean;
  categoryImageStyle?: string;
  productsPerRow?: number;
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  cardRadius?: string;
}): PublicStore {
  return {
    id: store.id,
    name: store.name,
    slug: store.slug,
    logoUrl: store.logoUrl ?? null,
    bannerUrl: store.bannerUrl ?? null,
    description: store.description ?? null,
    storeTitle: store.storeTitle ?? null,
    seoDescription: store.seoDescription ?? null,
    seoKeywords: store.seoKeywords ?? null,
    themeColor: store.themeColor ?? "#E11D48",
    accentColor: store.accentColor ?? "#F43F5E",
    whatsappNumber: store.whatsappNumber ?? null,
    socialLinks: parseSocialLinks(store.socialLinks),
    theme: {
      showCategoryImages: store.showCategoryImages ?? false,
      categoryImageStyle: store.categoryImageStyle ?? "square",
      productsPerRow: store.productsPerRow ?? 4,
      fontFamily: store.fontFamily ?? "Inter",
      fontSize: store.fontSize ?? "medium",
      fontWeight: store.fontWeight ?? "semibold",
      cardRadius: store.cardRadius ?? "lg",
    },
  };
}

function applyProductFilters(
  products: PublicProduct[],
  filters: StorefrontProductFilters
): PublicProduct[] {
  let result = [...products];

  if (filters.search?.trim()) {
    const q = filters.search.trim().toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.categoryName?.toLowerCase().includes(q)
    );
  }

  if (filters.categoryId && filters.categoryId !== "all") {
    result = result.filter((p) => p.categoryId === filters.categoryId);
  }

  if (filters.minPrice !== undefined) {
    result = result.filter((p) => p.price >= filters.minPrice!);
  }

  if (filters.maxPrice !== undefined) {
    result = result.filter((p) => p.price <= filters.maxPrice!);
  }

  const sort = filters.sort ?? "newest";
  result.sort((a, b) => sortProducts(a, b, sort));

  return result;
}

function sortProducts(
  a: PublicProduct,
  b: PublicProduct,
  sort: StorefrontSort
): number {
  switch (sort) {
    case "price-asc":
      return a.price - b.price;
    case "price-desc":
      return b.price - a.price;
    case "name-asc":
      return a.name.localeCompare(b.name);
    case "name-desc":
      return b.name.localeCompare(a.name);
    case "newest":
    default:
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  }
}

export const PublicStoreService = {
  async getStoreBySlug(slug: string): Promise<PublicStore | null> {
    const store = await findStoreForPublic(slug, storeSelect, legacyStoreSelect);
    if (!store) return null;
    return toPublicStore(store);
  },

  async getLayoutBySlug(slug: string) {
    const store = await findStoreForPublic(slug, layoutSelect, legacyLayoutSelect);
    if (!store) return null;

    const row = store as {
      accentColor?: string | null;
      socialLinks?: unknown;
    };

    return {
      ...store,
      accentColor: row.accentColor ?? "#F43F5E",
      socialLinks: parseSocialLinks(row.socialLinks),
    };
  },

  /**
   * Load store → products → categories in sequence by slug.
   */
  async getCatalogueBySlug(slug: string): Promise<PublicCatalogue | null> {
    const store = await findStoreForPublic(slug, storeSelect, legacyStoreSelect);

    if (!store) return null;

    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        where: { storeId: store.id },
        select: {
          id: true,
          name: true,
          price: true,
          description: true,
          imageUrl: true,
          categoryId: true,
          createdAt: true,
          category: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.category.findMany({
        where: { storeId: store.id },
        select: {
          id: true,
          name: true,
          _count: { select: { products: true } },
          products: {
            select: { imageUrl: true },
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
        orderBy: { name: "asc" },
      }),
    ]);

    const publicProducts: PublicProduct[] = products.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      description: p.description,
      imageUrl: p.imageUrl,
      categoryId: p.categoryId,
      categoryName: p.category?.name ?? null,
      createdAt: p.createdAt.toISOString(),
    }));

    const publicCategories: PublicCategory[] = categories.map((c) => ({
      id: c.id,
      name: c.name,
      imageUrl: c.products[0]?.imageUrl ?? null,
      productCount: c._count.products,
    }));

    return {
      store: toPublicStore(store),
      categories: publicCategories,
      products: publicProducts,
    };
  },

  async listProductsBySlug(
    slug: string,
    filters: StorefrontProductFilters = {}
  ): Promise<{ products: PublicProduct[]; total: number } | null> {
    const store = await findStoreIdBySlug(slug);
    if (!store) return null;

    const products = await prisma.product.findMany({
      where: { storeId: store.id },
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        imageUrl: true,
        categoryId: true,
        createdAt: true,
        category: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const publicProducts: PublicProduct[] = products.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      description: p.description,
      imageUrl: p.imageUrl,
      categoryId: p.categoryId,
      categoryName: p.category?.name ?? null,
      createdAt: p.createdAt.toISOString(),
    }));

    const filtered = applyProductFilters(publicProducts, filters);
    return { products: filtered, total: filtered.length };
  },

  async listCategoriesBySlug(slug: string): Promise<PublicCategory[] | null> {
    const store = await findStoreIdBySlug(slug);
    if (!store) return null;

    const categories = await prisma.category.findMany({
      where: { storeId: store.id },
      select: {
        id: true,
        name: true,
        _count: { select: { products: true } },
        products: {
          select: { imageUrl: true },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { name: "asc" },
    });

    return categories.map((c) => ({
      id: c.id,
      name: c.name,
      imageUrl: c.products[0]?.imageUrl ?? null,
      productCount: c._count.products,
    }));
  },

  async getProductBySlugAndId(slug: string, productId: string) {
    const store = await prisma.store.findUnique({
      where: { slug },
      select: { id: true, name: true, slug: true, whatsappNumber: true },
    });

    if (!store) return null;

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: { select: { id: true, name: true } },
      },
    });

    if (!product || product.storeId !== store.id) return null;

    const relatedProducts = await prisma.product.findMany({
      where: {
        storeId: store.id,
        NOT: { id: product.id },
      },
      select: {
        id: true,
        name: true,
        price: true,
        imageUrl: true,
        categoryId: true,
        category: { select: { name: true } },
        createdAt: true,
      },
      take: 4,
      orderBy: { createdAt: "desc" },
    });

    return {
      store,
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        imageUrl: product.imageUrl,
        storeId: product.storeId,
        categoryId: product.categoryId,
        categoryName: product.category?.name ?? null,
        createdAt: product.createdAt.toISOString(),
      },
      relatedProducts: relatedProducts.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        imageUrl: p.imageUrl,
        categoryId: p.categoryId,
        categoryName: p.category?.name ?? null,
        createdAt: p.createdAt.toISOString(),
      })),
    };
  },
};

async function findStoreIdBySlug(slug: string) {
  return prisma.store.findUnique({
    where: { slug },
    select: { id: true },
  });
}
