"use client";

import { SlidersHorizontal } from "lucide-react";
import type { StorefrontSort } from "@/types/storefront";

interface StoreFiltersProps {
  sort: StorefrontSort;
  onSortChange: (sort: StorefrontSort) => void;
  minPrice: string;
  maxPrice: string;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  priceRange?: { min: number; max: number };
}

const SORT_OPTIONS: { value: StorefrontSort; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A–Z" },
  { value: "name-desc", label: "Name: Z–A" },
];

export function StoreFilters({
  sort,
  onSortChange,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  priceRange,
}: StoreFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <SlidersHorizontal className="h-4 w-4" />
        <span className="font-medium hidden sm:inline">Filters</span>
      </div>

      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value as StorefrontSort)}
        aria-label="Sort products"
        className="rounded-xl border border-input bg-card px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <div className="flex items-center gap-2">
        <input
          type="number"
          min={0}
          placeholder={priceRange ? `Min ₹${priceRange.min}` : "Min ₹"}
          value={minPrice}
          onChange={(e) => onMinPriceChange(e.target.value)}
          className="w-24 rounded-xl border border-input bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          aria-label="Minimum price"
        />
        <span className="text-muted-foreground text-sm">–</span>
        <input
          type="number"
          min={0}
          placeholder={priceRange ? `Max ₹${priceRange.max}` : "Max ₹"}
          value={maxPrice}
          onChange={(e) => onMaxPriceChange(e.target.value)}
          className="w-24 rounded-xl border border-input bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          aria-label="Maximum price"
        />
      </div>
    </div>
  );
}
