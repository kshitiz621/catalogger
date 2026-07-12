export function formatPrice(amount: number): string {
  return `₹${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function cleanWhatsAppNumber(number: string): string {
  return number.replace(/[^0-9+]/g, "");
}
