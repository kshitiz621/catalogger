import { prisma } from "@/lib/prisma";

export const StoreService = {
  /**
   * Fetch a store by user ID
   */
  async getByUserId(userId: string) {
    if (!userId) return null;
    return prisma.store.findFirst({
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
    const store = await prisma.store.findFirst({ where: { userId } });
    
    if (!store) throw new Error("Store not found");

    // Check if slug is taken by another store
    const existing = await prisma.store.findFirst({
      where: { 
        slug: data.slug,
        NOT: { id: store.id }
      }
    });

    if (existing) throw new Error("Slug is already taken");

    return prisma.store.update({
      where: { id: store.id },
      data: {
        name: data.name,
        slug: data.slug,
        whatsappNumber: data.whatsappNumber
      }
    });
  }
};
