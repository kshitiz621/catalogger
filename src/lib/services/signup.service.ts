import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { initStoreAnalytics } from "@/lib/services/analytics.service";
import { findStoreIdBySlug } from "@/lib/prisma-compat";
import { DEFAULT_CATEGORY_NAME, DEFAULT_STORE_THEME } from "@/types/onboarding";
import { SellerSignupSchema } from "@/lib/schema";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

export type SellerRegistrationInput = {
  name: string;
  email: string;
  businessName: string;
  whatsappNumber: string;
  storeSlug: string;
};

function isMissingColumnError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2022"
  );
}

async function createSellerUser(input: SellerRegistrationInput) {
  const hashedPassword = await bcrypt.hash(randomBytes(32).toString("hex"), 10);

  try {
    return await prisma.user.create({
      data: {
        email: input.email,
        password: hashedPassword,
        name: input.name,
        role: "SELLER",
        status: "ACTIVE",
      },
      select: { id: true, email: true, name: true },
    });
  } catch (error) {
    if (!isMissingColumnError(error)) throw error;

    return prisma.user.create({
      data: {
        email: input.email,
        password: hashedPassword,
        name: input.name,
      },
      select: { id: true, email: true, name: true },
    });
  }
}

async function createSellerStore(userId: string, input: SellerRegistrationInput) {
  const baseData = {
    name: input.businessName,
    slug: input.storeSlug,
    whatsappNumber: input.whatsappNumber,
    userId,
    storeTitle: input.businessName,
    ...DEFAULT_STORE_THEME,
  };

  try {
    return await prisma.store.create({
      data: {
        ...baseData,
        status: "ACTIVE",
        onboardingStep: 0,
        onboardingCompleted: false,
      },
      select: { id: true, slug: true, name: true },
    });
  } catch (error) {
    if (!isMissingColumnError(error)) throw error;

    return prisma.store.create({
      data: baseData,
      select: { id: true, slug: true, name: true },
    });
  }
}

export async function registerSellerStore(input: SellerRegistrationInput) {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
    select: { id: true },
  });

  if (existingUser) {
    return { error: "An account with this email already exists" as const };
  }

  const existingStore = await findStoreIdBySlug(input.storeSlug);
  if (existingStore) {
    return { error: "This store URL is already taken" as const };
  }

  const user = await createSellerUser(input);
  const store = await createSellerStore(user.id, input);

  await initStoreAnalytics(store.id);

  await prisma.category.create({
    data: {
      name: DEFAULT_CATEGORY_NAME,
      storeId: store.id,
    },
  });

  return {
    user,
    store,
  };
}
