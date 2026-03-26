"use client";

import Link from "next/link";
import { ShoppingCart, Store as StoreIcon } from "lucide-react";
import { useCart } from "@/hooks/useCart";

interface StoreHeaderProps {
  storeName: string;
  storeSlug: string;
  storeId: string;
}

export default function StoreHeader({ storeName, storeSlug, storeId }: StoreHeaderProps) {
  const { itemCount } = useCart(storeId);

  return (
    <header className="sticky top-0 z-30 w-full bg-card/80 backdrop-blur-xl border-b border-border/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Store Brand */}
          <Link
            href={`/store/${storeSlug}`}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
              <StoreIcon className="w-4 h-4 text-primary" />
            </div>
            <span className="text-lg font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">
              {storeName}
            </span>
          </Link>

          {/* Cart */}
          <Link
            href={`/store/${storeSlug}/cart`}
            className="relative flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-muted transition-all group"
            aria-label="View cart"
          >
            <ShoppingCart className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
            <span className="text-sm font-medium text-foreground hidden sm:inline">Cart</span>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 sm:static sm:ml-0 min-w-[20px] h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center px-1.5 shadow-sm">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
