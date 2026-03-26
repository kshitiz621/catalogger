import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ArrowRight, Package } from "lucide-react";
import AddToCartButton from "./AddToCartButton";

interface PageProps {
  params: Promise<{ storeSlug: string; productId: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { storeSlug, productId } = await params;

  // Fetch store and current product in parallel
  const [store, product] = await Promise.all([
    prisma.store.findUnique({
      where: { slug: storeSlug },
      select: { id: true, name: true, slug: true }
    }),
    prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: { select: { name: true } }
      }
    })
  ]);

  if (!store || !product || product.storeId !== store.id) {
    notFound();
  }

  // Related Products (Other from same store/category)
  const relatedProducts = await prisma.product.findMany({
    where: { 
      storeId: store.id,
      NOT: { id: product.id }
    },
    take: 4,
    orderBy: { createdAt: "desc" }
  });

  const safeProductForClient = {
    id: product.id,
    name: product.name,
    price: product.price,
    imageUrl: product.imageUrl,
    storeId: product.storeId,
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
      
      {/* Back navigation */}
      <Link 
        href={`/store/${store.slug}`}
        className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-primary transition-all mb-8 group"
      >
        <ChevronLeft className="h-4 w-4 mr-1 transition-transform group-hover:-translate-x-1" />
        Back to {store.name}
      </Link>
      
      <div className="bg-white rounded-[32px] shadow-sm border border-border/60 overflow-hidden mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* IMAGE SECTION */}
          <div className="relative aspect-square md:aspect-auto md:h-[650px] w-full bg-secondary/30 flex items-center justify-center p-8 border-b md:border-b-0 md:border-r border-border/40">
            {product.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="w-full h-full object-contain rounded-2xl transition-transform hover:scale-105 duration-500"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-muted-foreground opacity-40">
                 <Package className="w-20 h-20 mb-4 stroke-1" />
                 <span className="font-black text-xs tracking-widest uppercase">No Image</span>
              </div>
            )}
          </div>

          {/* DETAILS SECTION */}
          <div className="p-8 md:p-14 flex flex-col h-full bg-white/50">
            <div>
              {product.category && (
                <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black tracking-widest uppercase rounded-full mb-6 border border-primary/20">
                  {product.category.name}
                </div>
              )}
              <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tight leading-[1.1] mb-6">
                {product.name}
              </h1>
              
              <p className="text-3xl text-foreground font-black mb-10 tabular-nums">
                ₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>

              {/* ACTION: Add to Cart (Desktop & Mobile together now) */}
              <div className="max-w-xs mb-12">
                <AddToCartButton product={safeProductForClient} storeSlug={store.slug} />
              </div>

              {product.description && (
                <div className="prose prose-sm text-muted-foreground/80 leading-relaxed max-w-none pt-10 border-t border-border/40">
                  <h4 className="text-xs font-black text-foreground uppercase tracking-widest mb-4">Description</h4>
                  <p className="text-sm font-medium">{product.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS SECTION */}
      {relatedProducts.length > 0 && (
        <section className="space-y-10">
          <div className="flex items-center justify-between border-b border-border/40 pb-6">
            <h2 className="text-2xl font-black text-foreground tracking-tight">More from this store</h2>
            <Link 
              href={`/store/${store.slug}`} 
              className="text-sm font-bold text-primary flex items-center gap-1.5 hover:underline"
            >
              Browse all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <Link
                key={p.id}
                href={`/store/${store.slug}/product/${p.id}`}
                className="group flex flex-col bg-white rounded-2xl border border-border/60 overflow-hidden hover:border-primary/20 hover:shadow-md transition-all duration-300"
              >
                <div className="aspect-square bg-secondary/30 flex items-center justify-center p-4">
                  {p.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={p.imageUrl} 
                      alt={p.name} 
                      className="w-full h-full object-contain transition-transform group-hover:scale-110 duration-500" 
                    />
                  ) : (
                    <Package className="w-10 text-muted-foreground/30" />
                  )}
                </div>
                <div className="p-4 bg-white/50 space-y-1">
                  <h3 className="text-sm font-black text-foreground truncate group-hover:text-primary transition-colors">{p.name}</h3>
                  <p className="text-sm font-bold text-muted-foreground">₹{p.price.toLocaleString('en-IN')}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
