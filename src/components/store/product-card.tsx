"use client";

import Link from "next/link";
import { Package, Plus, ShoppingCart } from "lucide-react";
import { OptimizedImage } from "@/components/ui/optimized-image";
import toast from "react-hot-toast";
import type { PublicProduct, StorefrontTheme } from "@/types/storefront";
import { formatPrice } from "@/lib/storefront/format";
import { getThemeClasses } from "@/lib/storefront/theme";
import { useCart } from "@/hooks/useCart";

interface ProductCardProps {
  product: PublicProduct;
  storeSlug: string;
  storeId: string;
  theme: StorefrontTheme;
  index?: number;
}

export function ProductCard({
  product,
  storeSlug,
  storeId,
  theme,
  index = 0,
}: ProductCardProps) {
  const { addToCart, mounted } = useCart(storeId);
  const classes = getThemeClasses(theme);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
    });
    toast.success("Added to cart");
  };

  return (
    <Link
      href={`/store/${storeSlug}/product/${product.id}`}
      className={`group relative flex flex-col border border-border overflow-hidden bg-card hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${classes.radius}`}
      style={{ animationDelay: `${Math.min(index * 40, 320)}ms`, animationFillMode: "backwards" }}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-muted/40 border-b border-border">
        {product.imageUrl ? (
          <OptimizedImage
            src={product.imageUrl}
            alt={product.name}
            fill
            containerClassName="h-full w-full"
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <Package className="h-10 w-10 opacity-30" />
          </div>
        )}

        {product.categoryName && (
          <span className="absolute top-2 left-2 rounded-full bg-background/90 backdrop-blur px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border border-border/60">
            {product.categoryName}
          </span>
        )}

        {mounted && (
          <button
            type="button"
            onClick={handleQuickAdd}
            className="absolute bottom-2 right-2 flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-bold text-primary-foreground shadow-md opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 hover:scale-105 active:scale-95"
            aria-label={`Add ${product.name} to cart`}
          >
            <Plus className="h-3.5 w-3.5" />
            <ShoppingCart className="h-3.5 w-3.5 sm:hidden" />
            <span className="hidden sm:inline">Add</span>
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3
          className={`text-foreground break-words group-hover:text-primary transition-colors leading-snug line-clamp-2 ${classes.size} ${classes.weight}`}
        >
          {product.name}
        </h3>
        <p className="text-base font-bold text-foreground tabular-nums mt-auto">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
