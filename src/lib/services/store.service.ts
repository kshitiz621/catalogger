import { prisma } from "@/lib/prisma";
import { findStoreByUserId, findStoreBySlug, updateStore } from "@/lib/prisma-compat";

export const StoreService = {
  /**
   * Fetch a store by user ID
   */
  async getByUserId(userId: string) {
    if (!userId) return null;
    return prisma.store.findUnique({
      where: { userId },
      select: {
        id: true,
        name: true,
        slug: true,
        whatsappNumber: true,
        createdAt: true,
        _count: {
          select: {
            products: true,
            categories: true,
          }
        }
      }
    });
  },

  /**
   * Fetch a store by its unique slug
   */
  async getBySlug(slug: string) {
    return prisma.store.findUnique({
      where: { slug },
      select: { 
        id: true, 
        name: true, 
        slug: true, 
        whatsappNumber: true 
      }
    });
  },

  /**
   * Update store settings with ownership check
   */
  async update(userId: string, data: { name: string; slug: string; whatsappNumber: string }) {
    const store = await findStoreByUserId(userId);
    
    if (!store) throw new Error("Store not found");

    // Check if slug is taken by another store
    const existing = await findStoreBySlug(data.slug);

    if (existing && existing.id !== store.id) throw new Error("Slug is already taken");

    return updateStore(store.id, {
      name: data.name,
      slug: data.slug,
      whatsappNumber: data.whatsappNumber
    });
  }
};
