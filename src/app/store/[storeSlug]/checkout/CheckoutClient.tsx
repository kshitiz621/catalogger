"use client";

import { useState } from "react";
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

  // Loading state
  if (!mounted) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent" />
      </div>
    );
  }

  // No WhatsApp number configured
  if (!whatsappNumber) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
          <AlertTriangle className="w-10 h-10 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Checkout Unavailable
        </h2>
        <p className="text-muted-foreground mb-8 max-w-sm">
          This store hasn&apos;t configured a WhatsApp number for orders yet.
          Please contact the store owner or try again later.
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

  // Empty cart
  if (cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Your cart is empty
        </h2>
        <p className="text-muted-foreground mb-8 max-w-sm">
          Add some items to your cart before checking out.
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

  // Build the WhatsApp message
  const buildMessage = () => {
    const currencySymbol = "₹";
    let msg = `🛒 *New Order from ${storeName}*\n\n`;
    msg += `👤 *Name:* ${name}\n`;
    msg += `📞 *Phone:* ${phone}\n\n`;
    msg += `📦 *Products:*\n`;

    cart.items.forEach((item) => {
      const lineTotal = item.price * item.quantity;
      msg += `• ${item.name} x${item.quantity} = ${currencySymbol}${lineTotal.toFixed(2)}\n`;
    });

    msg += `\n💰 *Total: ${currencySymbol}${total.toFixed(2)}*\n`;

    if (note.trim()) {
      msg += `\n📝 *Note:* ${note.trim()}`;
    }

    return msg;
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!phone.trim()) newErrors.phone = "Phone number is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    setSubmitting(true);

    const message = buildMessage();
    const encoded = encodeURIComponent(message);

    // Clean the WhatsApp number (remove spaces, dashes, etc.)
    const cleanNumber = whatsappNumber.replace(/[^0-9+]/g, "");
    const waUrl = `https://wa.me/${cleanNumber}?text=${encoded}`;

    // Clear cart after successful order
    clearCart();
    toast.success("Redirecting to WhatsApp...");

    // Small delay for toast visibility, then redirect
    setTimeout(() => {
      window.open(waUrl, "_blank");
      setSubmitting(false);
    }, 500);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link
          href={`/store/${storeSlug}/cart`}
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-4 group"
        >
          <ArrowLeft className="h-4 w-4 mr-1 transition-transform group-hover:-translate-x-1" />
          Back to Cart
        </Link>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Checkout
        </h1>
        <p className="text-muted-foreground mt-1">
          Complete your order via WhatsApp
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Form */}
        <div className="lg:col-span-3 space-y-6">
          {/* Customer Info Card */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Customer Information
            </h2>

            {/* Name */}
            <div>
              <label
                htmlFor="checkout-name"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Full Name <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="checkout-name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((p) => ({ ...p, name: "" }));
                  }}
                  className={`w-full pl-10 pr-4 py-3 bg-background border ${
                    errors.name
                      ? "border-destructive ring-1 ring-destructive"
                      : "border-border"
                  } rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm`}
                />
              </div>
              {errors.name && (
                <p className="mt-1.5 text-xs text-destructive font-medium">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="checkout-phone"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Phone Number <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="checkout-phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errors.phone) setErrors((p) => ({ ...p, phone: "" }));
                  }}
                  className={`w-full pl-10 pr-4 py-3 bg-background border ${
                    errors.phone
                      ? "border-destructive ring-1 ring-destructive"
                      : "border-border"
                  } rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm`}
                />
              </div>
              {errors.phone && (
                <p className="mt-1.5 text-xs text-destructive font-medium">
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Note */}
            <div>
              <label
                htmlFor="checkout-note"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Order Note{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
                <textarea
                  id="checkout-note"
                  rows={3}
                  placeholder="Any special instructions..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm resize-none"
                />
              </div>
            </div>
          </div>

          {/* Message Preview */}
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/50 transition-colors"
            >
              <span className="flex items-center gap-2 text-sm font-bold text-foreground">
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
              <div className="px-5 pb-5 border-t border-border">
                <div className="mt-4 bg-[#e5f6df] dark:bg-[#1a3a2e] rounded-xl p-4 text-sm text-foreground whitespace-pre-wrap font-mono leading-relaxed border border-green-200/30 dark:border-green-800/30">
                  {name || phone ? buildMessage() : (
                    <span className="text-muted-foreground italic">
                      Fill in your name and phone to see the preview...
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm sticky top-24 space-y-5">
            <h2 className="text-lg font-bold text-foreground">
              Order Summary
            </h2>

            {/* Product list */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {cart.items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center gap-3"
                >
                  {/* Thumbnail */}
                  <div className="w-12 h-12 flex-shrink-0 rounded-lg bg-muted flex items-center justify-center overflow-hidden border border-border/60">
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ShoppingBag className="w-4 h-4 text-muted-foreground/50" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ₹{item.price.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-foreground tabular-nums flex-shrink-0">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-3 pt-3 border-t border-border text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal ({itemCount} items)</span>
                <span className="font-medium text-foreground tabular-nums">
                  ₹{total.toFixed(2)}
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
                    ₹{total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={submitting || cart.items.length === 0}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-sm"
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

            <Link
              href={`/store/${storeSlug}/cart`}
              className="w-full py-2.5 px-6 border border-border text-foreground font-medium rounded-xl hover:bg-muted transition-all text-center block text-sm"
            >
              Edit Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
