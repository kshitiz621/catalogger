"use client";

import { useState } from "react";
import { 
  ShoppingCart, 
  Check, 
  Minus, 
  Plus, 
  ShoppingBag,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useCart } from "@/hooks/useCart";

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
}

export default function AddToCartButton({ product, storeSlug }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart, mounted } = useCart(product.storeId);

  const handleAddToCart = () => {
    try {
      // Logic for adding multiple quantities
      for (let i = 0; i < quantity; i++) {
        addToCart({
          productId: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl
        });
      }
      
      setIsAdded(true);
      toast.success(`${quantity} ${quantity === 1 ? 'item' : 'items'} added to cart`);
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  if (!mounted) return null;

  if (isAdded) {
    return (
      <div className="space-y-3 animate-in fade-in zoom-in-95 duration-300">
        <Link
          href={`/store/${storeSlug}/cart`}
          className="w-full flex items-center justify-center gap-2 py-4 px-8 bg-emerald-600 hover:bg-emerald-700 text-white text-base font-bold rounded-2xl transition-all shadow-md active:scale-[0.98]"
        >
          <ShoppingBag className="w-5 h-5" />
          View Cart
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
        <button 
          onClick={() => setIsAdded(false)}
          className="w-full text-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2"
        >
          Add more of this item
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quantity Selector */}
      <div className="flex flex-col gap-3">
        <span className="text-sm font-bold text-foreground/70 tracking-tight">Quantity</span>
        <div className="flex items-center w-fit border-2 border-border/80 rounded-2xl overflow-hidden bg-white/50 shadow-sm">
          <button
            onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
            className="p-3.5 hover:bg-secondary transition-all active:bg-border/40"
            aria-label="Decrease"
          >
            <Minus className="w-4 h-4 text-foreground" />
          </button>
          <span className="px-8 py-2 text-lg font-black text-foreground tabular-nums min-w-[60px] text-center border-x border-border/60">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(prev => prev + 1)}
            className="p-3.5 hover:bg-secondary transition-all active:bg-border/40"
            aria-label="Increase"
          >
            <Plus className="w-4 h-4 text-foreground" />
          </button>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleAddToCart}
        className="w-full flex items-center justify-center gap-2.5 py-4 px-8 bg-primary hover:bg-primary/95 text-primary-foreground text-base font-bold rounded-2xl transition-all shadow-lg shadow-primary/10 active:scale-[0.98]"
      >
        <ShoppingCart className="w-5 h-5" />
        Add to Cart
      </button>
    </div>
  );
}
