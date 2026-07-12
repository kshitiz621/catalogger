import type { StorefrontTheme } from "@/types/storefront";

export function getStoreFontUrl(fontFamily: string): string {
  const family = (fontFamily || "Inter").replace(/\s+/g, "+");
  return `https://fonts.googleapis.com/css2?family=${family}:wght@300;400;500;600;700;800;900&display=swap`;
}

export function getProductGridStyle(productsPerRow: number): Record<string, string | number> {
  const cols = Math.min(Math.max(productsPerRow || 4, 2), 8);
  return {
    gridTemplateColumns: `repeat(2, minmax(0, 1fr))`,
    ["--store-cols-sm" as string]: `repeat(${Math.min(cols, 3)}, minmax(0, 1fr))`,
    ["--store-cols-lg" as string]: `repeat(${cols}, minmax(0, 1fr))`,
  };
}

export function getThemeClasses(theme: StorefrontTheme) {
  const sizeClasses: Record<string, string> = {
    small: "text-xs md:text-sm",
    medium: "text-sm md:text-base",
    large: "text-base md:text-lg",
  };

  const weightClasses: Record<string, string> = {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
    black: "font-black",
  };

  const radiusClasses: Record<string, string> = {
    none: "rounded-none",
    sm: "rounded-md",
    md: "rounded-xl",
    lg: "rounded-2xl",
    xl: "rounded-3xl",
    full: "rounded-[40px]",
  };

  return {
    size: sizeClasses[theme.fontSize] || sizeClasses.medium,
    weight: weightClasses[theme.fontWeight] || weightClasses.semibold,
    radius: radiusClasses[theme.cardRadius] || radiusClasses.lg,
    categoryShape:
      theme.categoryImageStyle === "rounded" ? "rounded-full" : "rounded-2xl",
  };
}
