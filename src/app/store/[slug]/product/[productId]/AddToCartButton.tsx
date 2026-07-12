"use client";

import { useState } from "react";
import {
  ShoppingCart,
  Check,
  Minus,
  Plus,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/storefront/format";

type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  storeId: string;
};

interface AddToCartButtonProps {
  product: Product;
  storeSlug: string;
  variant?: "default" | "sticky";
}

export default function AddToCartButton({
  product,
  storeSlug,
  variant = "default",
}: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart, mounted } = useCart(product.storeId);

  const handleAddToCart = () => {
    addToCart(
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
      },
      quantity
    );
    setIsAdded(true);
    toast.success(
      `${quantity} ${quantity === 1 ? "item" : "items"} added to cart`
    );
  };

  if (!mounted) return null;

  if (isAdded) {
    const addedView = (
      <div className="space-y-3 animate-in fade-in zoom-in-95 duration-300">
        <Link
          href={`/store/${storeSlug}/cart`}
          className="w-full flex items-center justify-center gap-2 py-3.5 sm:py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white text-sm sm:text-base font-bold rounded-2xl transition-all shadow-md active:scale-[0.98]"
        >
          <ShoppingBag className="w-5 h-5" />
          View Cart
          <ArrowRight className="w-4 h-4" />
        </Link>
        <button
          type="button"
          onClick={() => setIsAdded(false)}
          className="w-full text-center text-sm font-medium text-muted-foreground hover:text-primary py-2"
        >
          Add more
        </button>
      </div>
    );

    if (variant === "sticky") return addedView;
    return addedView;
  }

  const controls = (
    <>
      {variant === "default" && (
        <div className="flex flex-col gap-3">
          <span className="text-sm font-bold text-foreground/70">Quantity</span>
          <div className="flex items-center w-fit border-2 border-border/80 rounded-2xl overflow-hidden bg-card shadow-sm">
            <button
              type="button"
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              className="p-3.5 hover:bg-muted transition-all"
              aria-label="Decrease"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-6 py-2 text-lg font-black tabular-nums min-w-[52px] text-center border-x border-border/60">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((prev) => prev + 1)}
              className="p-3.5 hover:bg-muted transition-all"
              aria-label="Increase"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {variant === "sticky" && (
        <div className="flex items-center border border-border rounded-xl overflow-hidden bg-background">
          <button
            type="button"
            onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            className="p-2.5 hover:bg-muted"
            aria-label="Decrease"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="px-3 text-sm font-bold tabular-nums min-w-[32px] text-center">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((prev) => prev + 1)}
            className="p-2.5 hover:bg-muted"
            aria-label="Increase"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={handleAddToCart}
        className={`flex items-center justify-center gap-2 bg-primary hover:bg-primary/95 text-primary-foreground font-bold rounded-2xl transition-all shadow-lg shadow-primary/10 active:scale-[0.98] ${
          variant === "sticky"
            ? "flex-1 py-3 px-4 text-sm"
            : "w-full py-4 px-8 text-base"
        }`}
      >
        <ShoppingCart className="w-5 h-5" />
        Add to Cart · {formatPrice(product.price * quantity)}
      </button>
    </>
  );

  if (variant === "sticky") {
    return (
      <div className="flex items-center gap-3 w-full">{controls}</div>
    );
  }

  return <div className="space-y-6">{controls}</div>;
}
