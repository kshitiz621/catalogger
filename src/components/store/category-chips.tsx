"use client";

import type { PublicCategory, StorefrontTheme } from "@/types/storefront";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { getThemeClasses } from "@/lib/storefront/theme";

interface CategoryChipsProps {
  categories: PublicCategory[];
  selectedId: string;
  onSelect: (id: string) => void;
  theme: StorefrontTheme;
}

export function CategoryChips({
  categories,
  selectedId,
  onSelect,
  theme,
}: CategoryChipsProps) {
  if (categories.length === 0) return null;

  const { categoryShape } = getThemeClasses(theme);

  const chips = [
    { id: "all", name: "All", imageUrl: null, productCount: categories.reduce((s, c) => s + c.productCount, 0) },
    ...categories,
  ];

  return (
    <div className="w-full overflow-x-auto scrollbar-hide -mx-1 px-1">
      <div className="flex gap-3 py-2 min-w-max snap-x snap-mandatory">
        {chips.map((cat) => {
          const isActive = selectedId === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelect(cat.id)}
              className={`snap-start flex-shrink-0 flex flex-col items-center gap-2 transition-all duration-200 ${
                isActive ? "opacity-100 scale-100" : "opacity-60 hover:opacity-90"
              }`}
            >
              <div
                className={`w-14 h-14 md:w-16 md:h-16 overflow-hidden border-2 transition-all duration-200 ${categoryShape} ${
                  isActive
                    ? "border-primary bg-primary/5 shadow-md scale-105"
                    : "border-border/60 bg-muted/30"
                }`}
              >
                {theme.showCategoryImages && cat.imageUrl ? (
                  <OptimizedImage
                    src={cat.imageUrl}
                    alt={cat.name}
                    width={64}
                    height={64}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                    sizes="64px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/5">
                    <span className="text-[10px] font-black uppercase tracking-tighter text-center px-1">
                      {cat.id === "all" ? "All" : cat.name.substring(0, 3)}
                    </span>
                  </div>
                )}
              </div>
              <span
                className={`text-[11px] font-bold uppercase tracking-wider truncate max-w-[72px] ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
