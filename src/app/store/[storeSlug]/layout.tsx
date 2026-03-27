import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import StoreHeader from "./StoreHeader";
import StoreFooter from "./StoreFooter";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ storeSlug: string }>;
}

export default async function StoreLayout({ children, params }: LayoutProps) {
  const { storeSlug } = await params;

  const store = await prisma.store.findUnique({
    where: { slug: storeSlug },
    select: { 
      id: true, 
      name: true, 
      slug: true, 
      logoUrl: true, 
      themeColor: true,
      headerCode: true,
      footerCode: true
    },
  });

  if (!store) {
    notFound();
  }

  const themeColor = store.themeColor || "#E11D48";

  return (
    <div 
      className="min-h-screen flex flex-col bg-background"
      style={{ '--primary': themeColor } as React.CSSProperties}
    >
      {/* Dynamic Scripts from Settings */}
      {store.headerCode && (
        <div dangerouslySetInnerHTML={{ __html: store.headerCode }} />
      )}

      <StoreHeader
        storeName={store.name}
        storeSlug={store.slug}
        storeId={store.id}
        logoUrl={store.logoUrl}
      />

      <main className="flex-1">
        {children}
      </main>

      <StoreFooter
        storeName={store.name}
        storeSlug={store.slug}
      />

      {store.footerCode && (
        <div dangerouslySetInnerHTML={{ __html: store.footerCode }} />
      )}
    </div>
  );
}
