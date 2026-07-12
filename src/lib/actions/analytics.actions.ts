"use server";

import { getAppSession } from "@/lib/auth/app-session";
import { canAccessPlatformAdmin, hasSellerAccess } from "@/lib/auth/roles";
import { findStoreByUserId } from "@/lib/prisma-compat";
import { AnalyticsService } from "@/lib/services/analytics.service";

async function ensureSuperAdmin() {
  const session = await getAppSession();
  if (!session || !canAccessPlatformAdmin(session.user.role)) {
    throw new Error("Unauthorized: Super Admin access required");
  }
}

async function ensureSellerStore() {
  const session = await getAppSession();
  if (!session || !hasSellerAccess(session.user.role)) {
    throw new Error("Unauthorized: Seller access required");
  }

  const store = await findStoreByUserId(session.user.id);
  if (!store) {
    throw new Error("Store not found for this user");
  }

  return store;
}

export async function getPlatformAnalytics() {
  await ensureSuperAdmin();
  return AnalyticsService.getPlatformAnalytics();
}

export async function getSellerAnalytics() {
  const store = await ensureSellerStore();
  return AnalyticsService.getSellerAnalytics(store.id);
}
