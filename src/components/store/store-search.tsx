"use client";

import { Search, X } from "lucide-react";

interface StoreSearchProps {
  value: string;
  onChange: (value: string) => void;
  resultCount?: number;
}

export function StoreSearch({ value, onChange, resultCount }: StoreSearchProps) {
  return (
    <div className="relative w-full md:max-w-md">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
        <Search className="h-4 w-4 text-muted-foreground" />
      </div>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search products..."
        aria-label="Search products"
        className="block w-full rounded-xl border border-input bg-card py-2.5 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      {value && resultCount !== undefined && (
        <p className="mt-1.5 text-xs text-muted-foreground">
          {resultCount} {resultCount === 1 ? "result" : "results"}
        </p>
      )}
    </div>
  );
}
