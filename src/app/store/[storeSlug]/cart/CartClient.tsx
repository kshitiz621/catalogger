"use client";

import { useCart } from "@/hooks/useCart";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface CartClientProps {
  storeId: string;
  storeSlug: string;
  storeName: string;
}

export default function CartClient({ storeId, storeSlug, storeName }: CartClientProps) {
  const { cart, mounted, total, itemCount, removeFromCart, updateQuantity, clearCart } = useCart(storeId);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent" />
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-8 max-w-sm">
          Looks like you haven&apos;t added any items yet. Browse the store and find something you love!
        </p>
        <Link
          href={`/store/${storeSlug}`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Your Cart</h1>
          <p className="text-muted-foreground mt-1">
            {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
          </p>
        </div>
        <button
          onClick={() => {
            clearCart();
            toast.success("Cart cleared");
          }}
          className="text-sm font-medium text-destructive hover:underline transition-all"
        >
          Clear all
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div
              key={item.productId}
              className="flex gap-5 bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Image */}
              <div className="w-24 h-24 flex-shrink-0 rounded-xl bg-muted flex items-center justify-center overflow-hidden border border-border/60">
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ShoppingBag className="w-8 h-8 text-muted-foreground/50" />
                )}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <Link
                    href={`/store/${storeSlug}/product/${item.productId}`}
                    className="text-base font-semibold text-foreground hover:text-primary transition-colors truncate block"
                  >
                    {item.name}
                  </Link>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    ₹{item.price.toFixed(2)} each
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="p-2 hover:bg-muted transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5 text-foreground" />
                    </button>
                    <span className="px-4 py-1.5 text-sm font-semibold text-foreground min-w-[40px] text-center tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="p-2 hover:bg-muted transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5 text-foreground" />
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      removeFromCart(item.productId);
                      toast.success("Removed from cart");
                    }}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Line Total */}
              <div className="text-right flex-shrink-0 flex flex-col justify-center">
                <span className="text-lg font-bold text-foreground tabular-nums">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm sticky top-24">
            <h2 className="text-lg font-bold text-foreground mb-5">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal ({itemCount} items)</span>
                <span className="font-medium text-foreground tabular-nums">₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span className="font-medium text-foreground">Free</span>
              </div>
              <div className="border-t border-border pt-3 mt-3">
                <div className="flex justify-between text-foreground">
                  <span className="text-base font-bold">Total</span>
                  <span className="text-xl font-bold tabular-nums">₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Link
              href={`/store/${storeSlug}/checkout`}
              className="w-full mt-6 py-3.5 px-6 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-all shadow-sm text-center block"
            >
              Proceed to Checkout
            </Link>

            <Link
              href={`/store/${storeSlug}`}
              className="w-full mt-3 py-3 px-6 border border-border text-foreground font-medium rounded-xl hover:bg-muted transition-all text-center block text-sm"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
