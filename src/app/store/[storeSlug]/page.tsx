import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import StoreCatalogue from "./StoreCatalogue";

interface PageProps {
  params: Promise<{ storeSlug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { storeSlug } = await params;
  const store = await prisma.store.findUnique({
    where: { slug: storeSlug },
    select: { name: true },
  });

  if (!store) {
    return { title: "Store Not Found" };
  }

  return { title: `${store.name} | Catalogue` };
}

export default async function StorePage({ params }: PageProps) {
  const { storeSlug } = await params;

  const store = await (prisma as any).store.findUnique({
    where: { slug: storeSlug },
    select: {
      id: true,
      name: true,
      slug: true,
      showCategoryImages: true,
      categoryImageStyle: true,
      categories: {
        select: { 
          id: true, 
          name: true,
          products: {
            select: { imageUrl: true },
            orderBy: { createdAt: "desc" },
            take: 1
          }
        },
        orderBy: { name: "asc" },
      },
      products: {
        select: {
          id: true,
          name: true,
          price: true,
          imageUrl: true,
          categoryId: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!store) {
    notFound();
  }

  const categoriesWithImages = store.categories.map((cat: any) => ({
    id: cat.id,
    name: cat.name,
    imageUrl: cat.products[0]?.imageUrl || null
  }));

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <StoreCatalogue 
        store={{ 
          name: store.name,
          showCategoryImages: store.showCategoryImages,
          categoryImageStyle: store.categoryImageStyle
        }} 
        storeSlug={store.slug}
        storeId={store.id}
        categories={categoriesWithImages} 
        products={store.products} 
      />
    </div>
  );
}
