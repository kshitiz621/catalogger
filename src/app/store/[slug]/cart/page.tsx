import { PublicStoreService } from "@/lib/services/public-store.service";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { createStorePrivateMetadata } from "@/lib/seo/store-metadata";
import CartClient from "./CartClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const store = await PublicStoreService.getStoreBySlug(slug);
  if (!store) return { title: "Store Not Found" };
  return createStorePrivateMetadata(`Cart | ${store.name}`);
}

export default async function CartPage({ params }: PageProps) {
  const { slug } = await params;
  const store = await PublicStoreService.getStoreBySlug(slug);

  if (!store) notFound();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-in fade-in duration-500">
      <CartClient
        storeId={store.id}
        storeSlug={store.slug}
        storeName={store.name}
      />
    </div>
  );
}
