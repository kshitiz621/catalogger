"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { StoreUpdateSchema, ProductSchema, CategorySchema } from "@/lib/schema";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

// Utility to enforce Seller role and get Store ID securely
async function getSellerContext() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "SELLER") {
    throw new Error("Unauthorized: Seller access required");
  }

  const store = await prisma.store.findUnique({
    where: { userId: session.user.id }
  });

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

  const [totalProducts, totalCategories] = await Promise.all([
    prisma.product.count({ where: { storeId: store.id } }),
    prisma.category.count({ where: { storeId: store.id } })
  ]);

  // Placeholders for Views and Orders
  const totalViews = 1240; 
  const totalOrders = 42;

  return {
    totalProducts,
    totalCategories,
    totalViews,
    totalOrders,
    store
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
  return { success: true };
}

// -----------------------------------------------------------------------------
// Onboarding
// -----------------------------------------------------------------------------

export async function updateOnboardingProgress(step: number, completed: boolean = false) {
  const { store } = await getSellerContext();
  
  await prisma.store.update({
    where: { id: store.id },
    data: {
      onboardingStep: step,
      ...(completed && { onboardingCompleted: true })
    }
  });

  revalidatePath("/dashboard");
  return { success: true };
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
  const { store } = await getSellerContext();
  return store;
}

export async function updateStoreSettings(data: any) {
  const { store } = await getSellerContext();
  
  const result = StoreUpdateSchema.safeParse(data);
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  // Check if slug is taken by someone else
  const existingStore = await prisma.store.findUnique({ where: { slug: result.data.slug } });
  if (existingStore && existingStore.id !== store.id) {
    return { error: "Store URL slug is already taken" };
  }

  const updatedStore = await prisma.store.update({
    where: { id: store.id },
    data: result.data
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
  return { success: true, store: updatedStore };
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
