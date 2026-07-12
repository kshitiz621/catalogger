"use server";

import { getAppSession } from "@/lib/auth/app-session";
import { prisma } from "@/lib/prisma";
import { PlatformSettingsSchema, SellerCreateSchema, SellerUpdateSchema } from "@/lib/schema";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

// Utility to enforce Super Admin role
async function ensureSuperAdmin() {
  const session = await getAppSession();
  if (!session || session.user.role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized: Super Admin access required");
  }
}

// -----------------------------------------------------------------------------
// Platform Settings
// -----------------------------------------------------------------------------

export async function getPlatformSettings() {
  await ensureSuperAdmin();
  let settings = await prisma.platformSettings.findUnique({
    where: { id: "singleton" }
  });
  
  if (!settings) {
    settings = await prisma.platformSettings.create({
      data: { id: "singleton" }
    });
  }
  return settings;
}

export async function updatePlatformSettings(data: any) {
  await ensureSuperAdmin();
  const result = PlatformSettingsSchema.safeParse(data);
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const settings = await prisma.platformSettings.upsert({
    where: { id: "singleton" },
    update: result.data,
    create: { id: "singleton", ...result.data }
  });

  revalidatePath("/platform/settings");
  revalidatePath("/login");
  revalidatePath("/signup");
  return { success: true, settings };
}

// -----------------------------------------------------------------------------
// Sellers Management
// -----------------------------------------------------------------------------

export async function getPlatformStats() {
  await ensureSuperAdmin();
  const [totalSellers, activeSellers, suspendedSellers, newSellers] = await Promise.all([
    prisma.user.count({ where: { role: "SELLER" } }),
    prisma.user.count({ where: { role: "SELLER", status: "ACTIVE" } }),
    prisma.user.count({ where: { role: "SELLER", status: "SUSPENDED" } }),
    prisma.user.count({ 
      where: { 
        role: "SELLER", 
        createdAt: { gte: new Date(new Date().setDate(new Date().getDate() - 7)) } 
      } 
    }),
  ]);

  return { totalSellers, activeSellers, suspendedSellers, newSellers };
}

export async function getSellers(search?: string, status?: string) {
  await ensureSuperAdmin();
  const where: any = { role: "SELLER" };
  
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { store: { name: { contains: search, mode: 'insensitive' } } }
    ];
  }
  if (status && status !== "ALL") {
    where.status = status;
  }

  const sellers = await prisma.user.findMany({
    where,
    include: { store: true },
    orderBy: { createdAt: 'desc' }
  });
  return sellers;
}

export async function getSellerById(id: string) {
  await ensureSuperAdmin();
  return prisma.user.findUnique({
    where: { id, role: "SELLER" },
    include: { store: true }
  });
}

export async function createSeller(data: any) {
  await ensureSuperAdmin();
  const result = SellerCreateSchema.safeParse(data);
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const { name, email, password, storeName, storeSlug } = result.data;

  // Check if email exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) return { error: "Email already exists" };

  // Check if slug exists
  const existingStore = await prisma.store.findUnique({ where: { slug: storeSlug } });
  if (existingStore) return { error: "Store slug already exists" };

  const hashedPassword = await bcrypt.hash(password, 10);

  const newSeller = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "SELLER",
      store: {
        create: {
          name: storeName,
          slug: storeSlug,
        }
      }
    },
    include: { store: true }
  });

  revalidatePath("/platform/sellers");
  revalidatePath("/platform/dashboard");
  return { success: true, seller: newSeller };
}

export async function updateSeller(id: string, data: any) {
  await ensureSuperAdmin();
  const result = SellerUpdateSchema.safeParse(data);
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const { name, email, password, storeName, storeSlug, status } = result.data;

  // Check email
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser && existingUser.id !== id) return { error: "Email already taken by another user" };

  const seller = await prisma.user.findUnique({ where: { id }, include: { store: true } });
  if (!seller) return { error: "Seller not found" };

  // Check slug
  const existingStore = await prisma.store.findUnique({ where: { slug: storeSlug } });
  if (existingStore && existingStore.userId !== id) return { error: "Store slug already taken" };

  const updateData: any = {
    name,
    email,
    status
  };

  if (password && password.length >= 6) {
    updateData.password = await bcrypt.hash(password, 10);
  }

  await prisma.user.update({
    where: { id },
    data: updateData
  });

  if (seller.store) {
    await prisma.store.update({
      where: { userId: id },
      data: {
        name: storeName,
        slug: storeSlug,
      }
    });
  } else {
    // If somehow they don't have a store
    await prisma.store.create({
      data: {
        name: storeName,
        slug: storeSlug,
        userId: id
      }
    });
  }

  revalidatePath("/platform/sellers");
  return { success: true };
}

export async function toggleSellerStatus(id: string) {
  await ensureSuperAdmin();
  const seller = await prisma.user.findUnique({ where: { id, role: "SELLER" } });
  if (!seller) return { error: "Seller not found" };

  const newStatus = seller.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
  
  await prisma.user.update({
    where: { id },
    data: { status: newStatus }
  });

  revalidatePath("/platform/sellers");
  return { success: true, status: newStatus };
}

export async function deleteSeller(id: string) {
  await ensureSuperAdmin();
  const seller = await prisma.user.findUnique({ where: { id, role: "SELLER" } });
  if (!seller) return { error: "Seller not found" };

  await prisma.user.delete({ where: { id } });
  
  revalidatePath("/platform/sellers");
  revalidatePath("/platform/dashboard");
  return { success: true };
}
