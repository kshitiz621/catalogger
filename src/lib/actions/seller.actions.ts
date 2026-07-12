"use server";

import { getAppSession } from "@/lib/auth/app-session";
import { hasSellerAccess } from "@/lib/auth/roles";
import { prisma } from "@/lib/prisma";
import { findStoreByUserId, updateOnboardingFields } from "@/lib/prisma-compat";
import { AnalyticsService } from "@/lib/services/analytics.service";
import { StoreSettingsService } from "@/lib/services/store-settings.service";
import { StoreUpdateSchema } from "@/lib/schema";
import { DEFAULT_STORE_THEME, type OnboardingState } from "@/types/onboarding";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

// Utility to enforce Seller role and get Store ID securely
async function getSellerContext() {
  const session = await getAppSession();
  if (!session || !hasSellerAccess(session.user.role)) {
    throw new Error("Unauthorized: Seller access required");
  }

  const store = await findStoreByUserId(session.user.id);

  if (!store) {
    throw new Error("Store not found for this user");
  }

  return { session, store };
}

// -----------------------------------------------------------------------------
// Dashboard Metrics
// -----------------------------------------------------------------------------

export async function getDashboardMetrics() {
  const { store } = await getSellerContext();
  const analytics = await AnalyticsService.getSellerAnalytics(store.id);

  return {
    totalProducts: analytics.totalProducts,
    totalCategories: analytics.totalCategories,
    totalViews: analytics.totalViews,
    totalOrders: analytics.totalOrders,
    viewsArePlaceholder: analytics.viewsArePlaceholder,
    ordersArePlaceholder: analytics.ordersArePlaceholder,
    productTrend: analytics.productTrend,
    viewsTrend: analytics.viewsTrend,
    ordersTrend: analytics.ordersTrend,
    store,
  };
}

// -----------------------------------------------------------------------------
// Products
// -----------------------------------------------------------------------------

export async function getSellerProducts() {
  const { store } = await getSellerContext();
  return prisma.product.findMany({
    where: { storeId: store.id },
    include: { category: true },
    orderBy: { createdAt: 'desc' }
  });
}

export async function deleteProduct(id: string) {
  const { store } = await getSellerContext();
  
  // Ensure product belongs to seller's store
  const product = await prisma.product.findFirst({
    where: { id, storeId: store.id }
  });
  
  if (!product) return { error: "Product not found or unauthorized" };
  
  await prisma.product.delete({ where: { id } });
  revalidatePath("/dashboard/products");
  revalidatePath("/dashboard");
  return { success: true };
}

// -----------------------------------------------------------------------------
// Onboarding
// -----------------------------------------------------------------------------

export async function updateOnboardingProgress(step: number, completed: boolean = false) {
  const { store } = await getSellerContext();
  
  await updateOnboardingFields(store.id, {
    onboardingStep: step,
    ...(completed && { onboardingCompleted: true }),
  });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function getOnboardingState(): Promise<OnboardingState> {
  const { store } = await getSellerContext();

  const productCount = await prisma.product.count({ where: { storeId: store.id } });

  const steps = [
    {
      id: 1,
      title: "Add your first product",
      description: "Start building your catalog to share with customers.",
      href: "/dashboard/products/new",
      completed: productCount >= 1,
    },
    {
      id: 2,
      title: "Customize your store",
      description: "Upload a logo, banner, and pick your brand colors.",
      href: "/dashboard/settings",
      completed:
        !!store.logoUrl ||
        !!store.bannerUrl ||
        store.themeColor !== DEFAULT_STORE_THEME.themeColor,
    },
    {
      id: 3,
      title: "Set up WhatsApp",
      description: "Ensure customers can contact you easily.",
      href: "/dashboard/settings",
      completed: !!store.whatsappNumber,
    },
  ];

  const completedCount = steps.filter((step) => step.completed).length;
  const allCompleted = completedCount === steps.length;
  const highestStep = steps.filter((step) => step.completed).length;

  if (allCompleted && !store.onboardingCompleted) {
    await updateOnboardingFields(store.id, {
      onboardingStep: steps.length,
      onboardingCompleted: true,
    });
    store.onboardingCompleted = true;
    store.onboardingStep = steps.length;
  } else if (highestStep > store.onboardingStep) {
    await updateOnboardingFields(store.id, { onboardingStep: highestStep });
    store.onboardingStep = highestStep;
  }

  return {
    steps,
    completedCount,
    progressPercent: Math.round((completedCount / steps.length) * 100),
    allCompleted,
    onboardingCompleted: store.onboardingCompleted || allCompleted,
    store,
  };
}

// -----------------------------------------------------------------------------
// Categories
// -----------------------------------------------------------------------------

export async function getSellerCategories() {
  const { store } = await getSellerContext();
  return prisma.category.findMany({
    where: { storeId: store.id },
    include: { _count: { select: { products: true } } },
    orderBy: { createdAt: 'desc' }
  });
}

export async function deleteCategory(id: string) {
  const { store } = await getSellerContext();
  
  // Ensure category belongs to seller's store
  const category = await prisma.category.findFirst({
    where: { id, storeId: store.id }
  });
  
  if (!category) return { error: "Category not found or unauthorized" };
  
  await prisma.category.delete({ where: { id } });
  revalidatePath("/dashboard/categories");
  return { success: true };
}

// -----------------------------------------------------------------------------
// Store Settings
// -----------------------------------------------------------------------------

export async function getStoreSettings() {
  const { session } = await getSellerContext();
  const settings = await StoreSettingsService.getByUserId(session.user.id);
  if (!settings) throw new Error("Store not found for this user");
  return settings;
}

export async function updateStoreSettings(data: unknown) {
  const { session } = await getSellerContext();

  const result = StoreUpdateSchema.safeParse(data);
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  try {
    const store = await StoreSettingsService.update(session.user.id, result.data);
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/settings");
    revalidatePath(`/store/${store.slug}`);
    return { success: true, store };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to update settings",
    };
  }
}

// -----------------------------------------------------------------------------
// Seller Profile
// -----------------------------------------------------------------------------

export async function getSellerProfile() {
  const { session } = await getSellerContext();
  return prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true }
  });
}

export async function updateSellerProfile(data: { name: string; email: string; password?: string }) {
  const { session } = await getSellerContext();

  // Validate email
  if (!data.email || !data.email.includes("@")) {
    return { error: "Valid email is required" };
  }

  // Check if email taken
  const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
  if (existingUser && existingUser.id !== session.user.id) {
    return { error: "Email is already in use" };
  }

  const updateData: any = {
    name: data.name,
    email: data.email
  };

  if (data.password && data.password.length >= 6) {
    updateData.password = await bcrypt.hash(data.password, 10);
  } else if (data.password && data.password.length < 6) {
    return { error: "Password must be at least 6 characters" };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: updateData
  });

  revalidatePath("/dashboard/profile");
  return { success: true };
}
