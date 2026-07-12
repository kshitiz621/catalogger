import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import type { StoreSocialLinks } from "@/types/store-settings";
import { EMPTY_SOCIAL_LINKS } from "@/types/store-settings";

/** Full select including newer store settings columns. */
export const storeBaseSelect = {
  id: true,
  name: true,
  slug: true,
  whatsappNumber: true,
  userId: true,
  createdAt: true,
  categoryImageStyle: true,
  logoUrl: true,
  bannerUrl: true,
  description: true,
  showCategoryImages: true,
  storeTitle: true,
  seoDescription: true,
  seoKeywords: true,
  footerCode: true,
  headerCode: true,
  themeColor: true,
  accentColor: true,
  socialLinks: true,
  productsPerRow: true,
  cardRadius: true,
  fontFamily: true,
  fontSize: true,
  fontWeight: true,
} as const;

/** Fallback when Prisma client has not been regenerated yet. */
export const legacyStoreBaseSelect = {
  id: true,
  name: true,
  slug: true,
  whatsappNumber: true,
  userId: true,
  createdAt: true,
  categoryImageStyle: true,
  logoUrl: true,
  showCategoryImages: true,
  storeTitle: true,
  footerCode: true,
  headerCode: true,
  themeColor: true,
  productsPerRow: true,
  cardRadius: true,
  fontFamily: true,
  fontSize: true,
  fontWeight: true,
} as const;

type LegacyStoreRow = Prisma.StoreGetPayload<{ select: typeof legacyStoreBaseSelect }>;
type ExtendedStoreRow = Prisma.StoreGetPayload<{ select: typeof storeBaseSelect }>;

export type StoreRecord = Omit<ExtendedStoreRow, "socialLinks"> & {
  status: "ACTIVE" | "SUSPENDED";
  onboardingCompleted: boolean;
  onboardingStep: number;
  socialLinks: StoreSocialLinks;
  bannerUrl: string | null;
  description: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  accentColor: string;
};

function isPrismaSchemaMismatch(error: unknown): boolean {
  if (error instanceof Prisma.PrismaClientValidationError) return true;
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    (error.code === "P2022" || error.code === "P2021")
  );
}

function parseSocialLinks(value: unknown): StoreSocialLinks {
  if (!value || typeof value !== "object") return { ...EMPTY_SOCIAL_LINKS };
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

function withStoreDefaults(store: ExtendedStoreRow | LegacyStoreRow): StoreRecord {
  const extended = store as Partial<ExtendedStoreRow>;
  return {
    ...(store as ExtendedStoreRow),
    bannerUrl: extended.bannerUrl ?? null,
    description: extended.description ?? null,
    seoDescription: extended.seoDescription ?? null,
    seoKeywords: extended.seoKeywords ?? null,
    accentColor: extended.accentColor ?? "#F43F5E",
    socialLinks: parseSocialLinks(extended.socialLinks),
    status: "ACTIVE",
    onboardingCompleted: false,
    onboardingStep: 0,
  };
}

async function findStoreUnique(
  where: Prisma.StoreWhereUniqueInput
): Promise<StoreRecord | null> {
  try {
    const store = await prisma.store.findUnique({
      where,
      select: storeBaseSelect,
    });
    return store ? withStoreDefaults(store) : null;
  } catch (error) {
    if (!isPrismaSchemaMismatch(error)) throw error;

    const store = await prisma.store.findUnique({
      where,
      select: legacyStoreBaseSelect,
    });
    return store ? withStoreDefaults(store) : null;
  }
}

const EXTENDED_ONLY_FIELDS = new Set([
  "bannerUrl",
  "description",
  "seoDescription",
  "seoKeywords",
  "accentColor",
  "socialLinks",
]);

function stripExtendedFields(data: Prisma.StoreUpdateInput): Prisma.StoreUpdateInput {
  const next = { ...data };
  for (const key of EXTENDED_ONLY_FIELDS) {
    delete (next as Record<string, unknown>)[key];
  }
  return next;
}

export async function findStoreByUserId(userId: string): Promise<StoreRecord | null> {
  return findStoreUnique({ userId });
}

export async function findStoreBySlug(slug: string): Promise<StoreRecord | null> {
  return findStoreUnique({ slug });
}

export async function findStoreIdBySlug(slug: string): Promise<{ id: string } | null> {
  return prisma.store.findUnique({
    where: { slug },
    select: { id: true },
  });
}

export async function findStoreIdByUserId(userId: string): Promise<{ id: string } | null> {
  return prisma.store.findUnique({
    where: { userId },
    select: { id: true },
  });
}

export async function updateOnboardingFields(
  storeId: string,
  data: { onboardingStep: number; onboardingCompleted?: boolean }
): Promise<void> {
  try {
    await prisma.store.update({
      where: { id: storeId },
      data: {
        onboardingStep: data.onboardingStep,
        ...(data.onboardingCompleted !== undefined && {
          onboardingCompleted: data.onboardingCompleted,
        }),
      },
    });
  } catch (error) {
    if (isPrismaSchemaMismatch(error)) return;
    throw error;
  }
}

export async function updateStore(
  storeId: string,
  data: Prisma.StoreUpdateInput
): Promise<StoreRecord> {
  try {
    const store = await prisma.store.update({
      where: { id: storeId },
      data,
      select: storeBaseSelect,
    });
    return withStoreDefaults(store);
  } catch (error) {
    if (!isPrismaSchemaMismatch(error)) throw error;

    const store = await prisma.store.update({
      where: { id: storeId },
      data: stripExtendedFields(data),
      select: legacyStoreBaseSelect,
    });
    return withStoreDefaults(store);
  }
}
