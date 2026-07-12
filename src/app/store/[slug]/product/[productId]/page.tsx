import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ArrowRight, Package } from "lucide-react";
import { PublicStoreService } from "@/lib/services/public-store.service";
import { formatPrice } from "@/lib/storefront/format";
import AddToCartButton from "./AddToCartButton";
import { RelatedProducts } from "./RelatedProducts";

interface PageProps {
  params: Promise<{ slug: string; productId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, productId } = await params;
  const data = await PublicStoreService.getProductBySlugAndId(slug, productId);

  if (!data) return { title: "Product Not Found" };

  const store = await PublicStoreService.getStoreBySlug(slug);

  return {
    title: `${data.product.name} | ${data.store.name}`,
    icons: store?.logoUrl
      ? [
          { rel: "icon", url: store.logoUrl },
          { rel: "apple-touch-icon", url: store.logoUrl },
        ]
      : undefined,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug, productId } = await params;
  const [data, storeMeta] = await Promise.all([
    PublicStoreService.getProductBySlugAndId(slug, productId),
    PublicStoreService.getStoreBySlug(slug),
  ]);

  if (!data || !storeMeta) notFound();

  const { store, product, relatedProducts } = data;

  const clientProduct = {
    id: product.id,
    name: product.name,
    price: product.price,
    imageUrl: product.imageUrl,
    storeId: product.storeId,
  };

  const related = JSON.parse(JSON.stringify(relatedProducts));

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 md:py-14 pb-28 md:pb-14 animate-in fade-in duration-500">
        <Link
          href={`/store/${store.slug}`}
          className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-primary transition-all mb-6 sm:mb-8 group"
        >
          <ChevronLeft className="h-4 w-4 mr-1 transition-transform group-hover:-translate-x-1" />
          Back to {store.name}
        </Link>

        <div className="bg-card rounded-2xl sm:rounded-[32px] shadow-sm border border-border overflow-hidden mb-12 sm:mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative aspect-square md:aspect-auto md:min-h-[480px] lg:min-h-[560px] w-full bg-muted/30 flex items-center justify-center p-6 sm:p-8 border-b md:border-b-0 md:border-r border-border/40">
              {product.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full max-h-[420px] md:max-h-none object-contain rounded-2xl transition-transform hover:scale-[1.02] duration-500"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-muted-foreground opacity-40">
                  <Package className="w-20 h-20 mb-4 stroke-1" />
                  <span className="font-black text-xs tracking-widest uppercase">
                    No Image
                  </span>
                </div>
              )}
            </div>

            <div className="p-6 sm:p-8 md:p-12 lg:p-14 flex flex-col">
              {product.categoryName && (
                <div className="inline-flex w-fit px-3 py-1 bg-primary/10 text-primary text-[10px] font-black tracking-widest uppercase rounded-full mb-4 border border-primary/20">
                  {product.categoryName}
                </div>
              )}

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-[1.1] mb-4 sm:mb-6">
                {product.name}
              </h1>

              <p className="text-2xl sm:text-3xl text-foreground font-black mb-8 tabular-nums">
                {formatPrice(product.price)}
              </p>

              <div className="hidden md:block max-w-sm mb-8">
                <AddToCartButton product={clientProduct} storeSlug={store.slug} />
              </div>

              {product.description && (
                <div className="pt-6 sm:pt-8 border-t border-border/40 mt-auto">
                  <h2 className="text-xs font-black text-foreground uppercase tracking-widest mb-3">
                    Description
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {product.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="space-y-6 sm:space-y-8">
            <div className="flex items-center justify-between border-b border-border/40 pb-4 sm:pb-6">
              <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                More from this store
              </h2>
              <Link
                href={`/store/${store.slug}`}
                className="text-sm font-bold text-primary flex items-center gap-1.5 hover:underline"
              >
                Browse all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <RelatedProducts
              products={related}
              storeSlug={store.slug}
              storeId={store.id}
              theme={storeMeta.theme}
            />
          </section>
        )}
      </div>

      <div className="fixed bottom-0 inset-x-0 z-40 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden border-t border-border bg-card/95 backdrop-blur-xl animate-in slide-in-from-bottom-4 duration-300">
        <AddToCartButton
          product={clientProduct}
          storeSlug={store.slug}
          variant="sticky"
        />
      </div>
    </>
  );
}
