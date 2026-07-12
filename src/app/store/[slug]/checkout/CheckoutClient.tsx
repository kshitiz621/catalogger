"use client";

import { useState } from "react";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { useCart } from "@/hooks/useCart";
import Link from "next/link";
import {
  ArrowLeft,
  ShoppingBag,
  User,
  Phone,
  MessageSquare,
  Send,
  AlertTriangle,
  Eye,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import toast from "react-hot-toast";
import { CheckoutFormSchema } from "@/lib/schema";
import {
  buildWhatsAppCheckoutUrl,
  buildWhatsAppOrderMessage,
} from "@/lib/storefront/whatsapp";
import { formatPrice } from "@/lib/storefront/format";
import { CartSkeleton } from "@/components/store/skeletons";

interface CheckoutClientProps {
  storeId: string;
  storeSlug: string;
  storeName: string;
  whatsappNumber: string | null;
}

export default function CheckoutClient({
  storeId,
  storeSlug,
  storeName,
  whatsappNumber,
}: CheckoutClientProps) {
  const { cart, mounted, total, itemCount, clearCart } = useCart(storeId);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!mounted) return <CartSkeleton />;

  if (!whatsappNumber) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in-95 duration-400">
        <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
          <AlertTriangle className="w-10 h-10 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Checkout Unavailable</h2>
        <p className="text-muted-foreground mb-8 max-w-sm">
          This store hasn&apos;t configured WhatsApp for orders yet.
        </p>
        <Link
          href={`/store/${storeSlug}`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Store
        </Link>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in-95 duration-400">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-8 max-w-sm">
          Add items before checking out.
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

  const previewMessage = buildWhatsAppOrderMessage(
    storeName,
    { name: name || "—", phone: phone || "—", note },
    cart.items,
    total
  );

  const handleSubmit = () => {
    const result = CheckoutFormSchema.safeParse({ name, phone, note });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0];
        if (typeof key === "string") fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    const message = buildWhatsAppOrderMessage(
      storeName,
      result.data,
      cart.items,
      total
    );
    const waUrl = buildWhatsAppCheckoutUrl(whatsappNumber, message);

    clearCart();
    toast.success("Opening WhatsApp...");

    setTimeout(() => {
      window.open(waUrl, "_blank");
      setSubmitting(false);
    }, 400);
  };

  return (
    <div className="space-y-8">
      <div>
        <Link
          href={`/store/${storeSlug}/cart`}
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-4 group"
        >
          <ArrowLeft className="h-4 w-4 mr-1 transition-transform group-hover:-translate-x-1" />
          Back to Cart
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          WhatsApp Checkout
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Fill in your details and send your order via WhatsApp
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Your Details
            </h2>

            <div>
              <label htmlFor="checkout-name" className="block text-sm font-medium mb-1.5">
                Full Name <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="checkout-name"
                  type="text"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((p) => ({ ...p, name: "" }));
                  }}
                  className={`w-full pl-10 pr-4 py-3 bg-background border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                    errors.name ? "border-destructive" : "border-border"
                  }`}
                />
              </div>
              {errors.name && (
                <p className="mt-1.5 text-xs text-destructive font-medium">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="checkout-phone" className="block text-sm font-medium mb-1.5">
                Phone Number <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="checkout-phone"
                  type="tel"
                  placeholder="With country code"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errors.phone) setErrors((p) => ({ ...p, phone: "" }));
                  }}
                  className={`w-full pl-10 pr-4 py-3 bg-background border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                    errors.phone ? "border-destructive" : "border-border"
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="mt-1.5 text-xs text-destructive font-medium">{errors.phone}</p>
              )}
            </div>

            <div>
              <label htmlFor="checkout-note" className="block text-sm font-medium mb-1.5">
                Order Note <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
                <textarea
                  id="checkout-note"
                  rows={3}
                  placeholder="Delivery instructions, preferences..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/50 transition-colors"
            >
              <span className="flex items-center gap-2 text-sm font-bold">
                <Eye className="w-4 h-4 text-primary" />
                Preview WhatsApp Message
              </span>
              {showPreview ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
            {showPreview && (
              <div className="px-5 pb-5 border-t border-border animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="mt-4 bg-[#e5f6df] dark:bg-[#1a3a2e] rounded-xl p-4 text-sm whitespace-pre-wrap font-mono leading-relaxed border border-green-200/30">
                  {previewMessage}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm sticky top-20 space-y-5">
            <h2 className="text-lg font-bold">Order Summary</h2>

            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {cart.items.map((item) => (
                <div key={item.productId} className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-lg bg-muted overflow-hidden border border-border/60 shrink-0">
                    {item.imageUrl ? (
                      <OptimizedImage
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        containerClassName="h-full w-full"
                        className="object-cover"
                        sizes="44px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-4 h-4 text-muted-foreground/50" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatPrice(item.price)} × {item.quantity}
                    </p>
                  </div>
                  <span className="text-sm font-semibold tabular-nums shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-3 border-t border-border text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal ({itemCount} items)</span>
                <span className="font-medium text-foreground tabular-nums">
                  {formatPrice(total)}
                </span>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex justify-between">
                  <span className="text-base font-bold">Total</span>
                  <span className="text-xl font-bold tabular-nums">{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl transition-all shadow-sm disabled:opacity-50 text-sm"
            >
              {submitting ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Order via WhatsApp
                </>
              )}
            </button>

            <p className="text-xs text-muted-foreground text-center">
              You&apos;ll be redirected to WhatsApp to complete your order
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
