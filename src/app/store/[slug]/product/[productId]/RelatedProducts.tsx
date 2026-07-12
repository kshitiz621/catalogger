"use client";

import type { PublicProduct } from "@/types/storefront";
import { ProductCard } from "@/components/store/product-card";
import type { StorefrontTheme } from "@/types/storefront";

interface RelatedProductsProps {
  products: PublicProduct[];
  storeSlug: string;
  storeId: string;
  theme: StorefrontTheme;
}

export function RelatedProducts({
  products,
  storeSlug,
  storeId,
  theme,
}: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          storeSlug={storeSlug}
          storeId={storeId}
          theme={theme}
          index={index}
        />
      ))}
    </div>
  );
}
