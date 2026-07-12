const OPTIMIZED_HOSTS = new Set([
  "images.unsplash.com",
  "res.cloudinary.com",
  "cdn.jsdelivr.net",
]);

export function isOptimizableImageUrl(src?: string | null): src is string {
  if (!src) return false;

  try {
    const url = new URL(src);
    if (url.protocol !== "https:" && url.protocol !== "http:") return false;

    const hostname = url.hostname.toLowerCase();
    if (OPTIMIZED_HOSTS.has(hostname)) return true;

    if (hostname.endsWith(".cloudinary.com")) return true;
    if (hostname.endsWith(".amazonaws.com")) return true;
    if (hostname.endsWith(".r2.dev")) return true;

    const extraHosts = process.env.NEXT_PUBLIC_IMAGE_HOSTS?.split(",") ?? [];
    return extraHosts.some((host) => hostname === host.trim().toLowerCase());
  } catch {
    return false;
  }
}
