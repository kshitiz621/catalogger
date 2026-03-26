import { prisma } from "@/lib/prisma";

export const ProductService = {
  /**
   * Fetch all products for a specific store
   */
  async listByStoreId(storeId: string) {
    return prisma.product.findMany({
      where: { storeId },
      include: {
        category: {
          select: { id: true, name: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });
  },

  /**
   * Fetch a single product by ID (with store check)
   */
  async getById(id: string, storeId?: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: { select: { name: true } },
        store: { select: { id: true, name: true, slug: true } }
      }
    });

    if (storeId && product?.storeId !== storeId) {
      return null;
    }

    return product;
  },

  /**
   * Create/Update with explicit ownership check
   */
  async upsert(userId: string, productId: string | null, data: any) {
    const store = await prisma.store.findFirst({ where: { userId } });
    if (!store) throw new Error("Unauthorized: Store not found");

    const payload = { ...data, storeId: store.id };

    if (productId) {
      // Check ownership before update
      const existing = await prisma.product.findUnique({ where: { id: productId } });
      if (!existing || existing.storeId !== store.id) throw new Error("Forbidden: Resource mismatch");

      return prisma.product.update({
        where: { id: productId },
        data: payload
      });
    }

    return prisma.product.create({ data: payload });
  },

  /**
   * Delete with ownership check
   */
  async delete(userId: string, productId: string) {
    const store = await prisma.store.findFirst({ where: { userId } });
    if (!store) throw new Error("Unauthorized");

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || product.storeId !== store.id) throw new Error("Forbidden");

    return prisma.product.delete({ where: { id: productId } });
  }
};
