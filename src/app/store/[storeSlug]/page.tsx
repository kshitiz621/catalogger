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

  const store = await prisma.store.findUnique({
    where: { slug: storeSlug },
    select: {
      id: true,
      name: true,
      slug: true,
      categories: {
        select: { id: true, name: true },
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <main className="flex-1 w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <StoreCatalogue 
          store={{ name: store.name }} 
          categories={store.categories} 
          products={store.products} 
        />
      </main>
    </div>
  );
}
