import { prisma } from "@/lib/prisma";

export const CategoryService = {
  /**
   * List all categories by store ID
   */
  async listByStoreId(storeId: string) {
    return prisma.category.findMany({
      where: { storeId },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        _count: {
          select: { products: true }
        }
      }
    });
  },

  /**
   * Get Category by ID (with store check)
   */
  async getById(id: string, storeId?: string) {
    const category = await prisma.category.findUnique({
      where: { id },
      select: { id: true, name: true, storeId: true }
    });

    if (storeId && category?.storeId !== storeId) {
      return null;
    }

    return category;
  },

  /**
   * Create/Update with explicit ownership check
   */
  async upsert(userId: string, categoryId: string | null, name: string) {
    const store = await prisma.store.findFirst({ where: { userId } });
    if (!store) throw new Error("Unauthorized");

    if (categoryId) {
      const existing = await prisma.category.findUnique({ where: { id: categoryId } });
      if (!existing || existing.storeId !== store.id) throw new Error("Forbidden");

      return prisma.category.update({
        where: { id: categoryId },
        data: { name }
      });
    }

    return prisma.category.create({
      data: { name, storeId: store.id }
    });
  },

  /**
   * Delete with ownership check
   */
  async delete(userId: string, categoryId: string) {
    const store = await prisma.store.findFirst({ where: { userId } });
    if (!store) throw new Error("Unauthorized");

    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category || category.storeId !== store.id) throw new Error("Forbidden");

    return prisma.category.delete({ where: { id: categoryId } });
  }
};
