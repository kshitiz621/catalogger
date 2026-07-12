import { PublicStoreService } from "@/lib/services/public-store.service";
import { createStoreMetadata } from "@/lib/seo/store-metadata";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import StoreCatalogue from "./StoreCatalogue";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const store = await PublicStoreService.getStoreBySlug(slug);

  if (!store) {
    return { title: "Store Not Found" };
  }

  return createStoreMetadata(store);
}

export default async function StorePage({ params }: PageProps) {
  const { slug } = await params;
  const catalogue = await PublicStoreService.getCatalogueBySlug(slug);

  if (!catalogue) {
    notFound();
  }

  const payload = JSON.parse(JSON.stringify(catalogue));

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-in fade-in duration-500">
      <StoreCatalogue
        store={payload.store}
        categories={payload.categories}
        products={payload.products}
      />
    </div>
  );
}
