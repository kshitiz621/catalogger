"use client";

import type { PublicProduct, StorefrontTheme } from "@/types/storefront";
import { ProductCard } from "./product-card";

interface ProductGridProps {
  products: PublicProduct[];
  storeSlug: string;
  storeId: string;
  theme: StorefrontTheme;
}

export function ProductGrid({
  products,
  storeSlug,
  storeId,
  theme,
}: ProductGridProps) {
  const cols = Math.min(Math.max(theme.productsPerRow || 4, 2), 8);

  return (
    <>
      <style>{`
        .store-product-grid {
          display: grid;
          gap: 1.25rem 1rem;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        @media (min-width: 640px) {
          .store-product-grid {
            grid-template-columns: repeat(${Math.min(cols, 3)}, minmax(0, 1fr));
            gap: 1.5rem 1.25rem;
          }
        }
        @media (min-width: 1024px) {
          .store-product-grid {
            grid-template-columns: repeat(${cols}, minmax(0, 1fr));
            gap: 2rem 1.75rem;
          }
        }
      `}</style>
      <div className="store-product-grid">
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
    </>
  );
}
