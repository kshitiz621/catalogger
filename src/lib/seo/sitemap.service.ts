import { prisma } from "@/lib/prisma";
import { getAppUrl } from "@/lib/env";

export async function getPublicSitemapEntries() {
  const base = getAppUrl();

  const stores = await prisma.store.findMany({
    where: {
      status: "ACTIVE",
      user: { status: "ACTIVE" },
    },
    select: { slug: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  return {
    base,
    stores,
  };
}
