import type { Role } from "@prisma/client";

export function isSuperAdmin(role?: string | null): role is "SUPER_ADMIN" {
  return role === "SUPER_ADMIN";
}

/** Super admins can also manage their own store when one exists. */
export function hasSellerAccess(role?: string | null): boolean {
  return role === "SELLER" || role === "SUPER_ADMIN";
}

export function canAccessPlatformAdmin(role?: string | null): boolean {
  return isSuperAdmin(role);
}

export type AppRole = Role;
