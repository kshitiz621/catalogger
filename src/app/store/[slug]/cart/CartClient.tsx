"use client";

import { useCart } from "@/hooks/useCart";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { formatPrice } from "@/lib/storefront/format";
import { CartSkeleton } from "@/components/store/skeletons";

interface CartClientProps {
  storeId: string;
  storeSlug: string;
  storeName: string;
}

export default function CartClient({
  storeId,
  storeSlug,
  storeName,
}: CartClientProps) {
  const { cart, mounted, total, itemCount, removeFromCart, updateQuantity, clearCart } =
    useCart(storeId);

  if (!mounted) return <CartSkeleton />;

  if (cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in-95 duration-400">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-8 max-w-sm">
          Browse {storeName} and add items you&apos;d like to order.
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
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Your Cart
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            clearCart();
            toast.success("Cart cleared");
          }}
          className="text-sm font-medium text-destructive hover:underline"
        >
          Clear all
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item, index) => (
            <div
              key={item.productId}
              className="flex gap-4 sm:gap-5 bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow animate-in fade-in slide-in-from-bottom-2 duration-300"
              style={{ animationDelay: `${index * 50}ms`, animationFillMode: "backwards" }}
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl bg-muted flex items-center justify-center overflow-hidden border border-border/60">
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <ShoppingBag className="w-8 h-8 text-muted-foreground/50" />
                )}
              </div>

              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <Link
                    href={`/store/${storeSlug}/product/${item.productId}`}
                    className="text-sm sm:text-base font-semibold text-foreground hover:text-primary transition-colors line-clamp-2"
                  >
                    {item.name}
                  </Link>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {formatPrice(item.price)} each
                  </p>
                </div>

                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center border border-border rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="p-2 hover:bg-muted transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 py-1.5 text-sm font-semibold min-w-[36px] text-center tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="p-2 hover:bg-muted transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
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

              <div className="text-right flex-shrink-0 flex flex-col justify-center">
                <span className="text-base sm:text-lg font-bold tabular-nums">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm sticky top-20 space-y-5">
            <h2 className="text-lg font-bold text-foreground">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal ({itemCount} items)</span>
                <span className="font-medium text-foreground tabular-nums">
                  {formatPrice(total)}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span className="font-medium text-foreground">Free</span>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex justify-between text-foreground">
                  <span className="text-base font-bold">Total</span>
                  <span className="text-xl font-bold tabular-nums">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>
            </div>

            <Link
              href={`/store/${storeSlug}/checkout`}
              className="w-full py-3.5 px-6 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-all shadow-sm text-center block"
            >
              Proceed to Checkout
            </Link>

            <Link
              href={`/store/${storeSlug}`}
              className="w-full py-3 px-6 border border-border text-foreground font-medium rounded-xl hover:bg-muted transition-all text-center block text-sm"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
