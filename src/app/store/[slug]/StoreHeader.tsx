"use client";

import Link from "next/link";
import { ShoppingCart, Store as StoreIcon } from "lucide-react";
import { useCart } from "@/hooks/useCart";

interface StoreHeaderProps {
  storeName: string;
  slug: string;
  storeId: string;
  logoUrl?: string | null;
}

export default function StoreHeader({
  storeName,
  slug,
  storeId,
  logoUrl,
}: StoreHeaderProps) {
  const { itemCount, mounted } = useCart(storeId);

  return (
    <header className="sticky top-0 z-30 w-full bg-card/80 backdrop-blur-xl border-b border-border/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          <Link
            href={`/store/${slug}`}
            className="flex items-center gap-2.5 group min-w-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center group-hover:bg-primary/10 transition-colors overflow-hidden shrink-0">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoUrl}
                  alt={storeName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <StoreIcon className="w-5 h-5 text-primary" />
              )}
            </div>
            <span className="text-base sm:text-lg font-bold text-foreground tracking-tight group-hover:text-primary transition-colors truncate">
              {storeName}
            </span>
          </Link>

          <Link
            href={`/store/${slug}/cart`}
            className="relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl hover:bg-muted transition-all group"
            aria-label="View cart"
          >
            <ShoppingCart className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
            <span className="text-sm font-medium text-foreground hidden sm:inline">
              Cart
            </span>
            {mounted && itemCount > 0 && (
              <span className="absolute -top-1 -right-1 sm:static min-w-[20px] h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center px-1.5 shadow-sm animate-in zoom-in-50 duration-200">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
