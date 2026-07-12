import { PublicStoreService } from "@/lib/services/public-store.service";
import { notFound } from "next/navigation";
import StoreHeader from "./StoreHeader";
import StoreFooter from "./StoreFooter";
import { StickyCartBar } from "@/components/store/sticky-cart-bar";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function StoreLayout({ children, params }: LayoutProps) {
  const { slug } = await params;
  const store = await PublicStoreService.getLayoutBySlug(slug);

  if (!store) {
    notFound();
  }

  const themeColor = store.themeColor || "#E11D48";
  const accentColor = store.accentColor || "#F43F5E";

  return (
    <div
      className="min-h-screen flex flex-col bg-background"
      style={
        {
          "--primary": themeColor,
          "--accent": accentColor,
        } as React.CSSProperties
      }
    >
      {store.headerCode && (
        <div dangerouslySetInnerHTML={{ __html: store.headerCode }} />
      )}

      <StoreHeader
        storeName={store.name}
        slug={store.slug}
        storeId={store.id}
        logoUrl={store.logoUrl}
      />

      <main className="flex-1 pb-20 md:pb-0">{children}</main>

      <StoreFooter
        storeName={store.name}
        slug={store.slug}
        socialLinks={store.socialLinks}
      />

      <StickyCartBar storeId={store.id} storeSlug={store.slug} />

      {store.footerCode && (
        <div dangerouslySetInnerHTML={{ __html: store.footerCode }} />
      )}
    </div>
  );
}
