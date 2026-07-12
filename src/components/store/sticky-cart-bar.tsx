"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/storefront/format";

interface StickyCartBarProps {
  storeId: string;
  storeSlug: string;
}

export function StickyCartBar({ storeId, storeSlug }: StickyCartBarProps) {
  const { mounted, itemCount, total } = useCart(storeId);

  if (!mounted || itemCount === 0) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="mx-auto max-w-lg rounded-2xl border border-border bg-card/95 backdrop-blur-xl shadow-lg p-3 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <ShoppingBag className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-foreground">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </p>
          <p className="text-xs text-muted-foreground tabular-nums">{formatPrice(total)}</p>
        </div>
        <Link
          href={`/store/${storeSlug}/cart`}
          className="shrink-0 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
        >
          View Cart
        </Link>
      </div>
    </div>
  );
}
