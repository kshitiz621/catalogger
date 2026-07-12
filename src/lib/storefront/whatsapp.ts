import type { CartItem } from "@/hooks/useCart";
import type { CheckoutCustomer } from "@/types/storefront";
import { cleanWhatsAppNumber } from "./format";

export function buildWhatsAppOrderMessage(
  storeName: string,
  customer: CheckoutCustomer,
  items: CartItem[],
  total: number
): string {
  let msg = `🛒 *New Order — ${storeName}*\n\n`;
  msg += `👤 *Name:* ${customer.name}\n`;
  msg += `📞 *Phone:* ${customer.phone}\n\n`;
  msg += `📦 *Items:*\n`;

  items.forEach((item) => {
    const lineTotal = item.price * item.quantity;
    msg += `• ${item.name} × ${item.quantity} = ₹${lineTotal.toFixed(2)}\n`;
  });

  msg += `\n💰 *Total: ₹${total.toFixed(2)}*\n`;

  if (customer.note?.trim()) {
    msg += `\n📝 *Note:* ${customer.note.trim()}`;
  }

  return msg;
}

export function buildWhatsAppCheckoutUrl(
  whatsappNumber: string,
  message: string
): string {
  const cleanNumber = cleanWhatsAppNumber(whatsappNumber);
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}
