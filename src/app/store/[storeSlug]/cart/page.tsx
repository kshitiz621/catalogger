import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import CartClient from "./CartClient";

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

  return { title: `Cart | ${store.name}` };
}

export default async function CartPage({ params }: PageProps) {
  const { storeSlug } = await params;

  const store = await prisma.store.findUnique({
    where: { slug: storeSlug },
    select: { id: true, name: true, slug: true },
  });

  if (!store) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <CartClient storeId={store.id} storeSlug={store.slug} storeName={store.name} />
    </div>
  );
}
