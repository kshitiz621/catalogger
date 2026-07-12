import { PackageSearch, SearchX } from "lucide-react";

interface StoreEmptyStateProps {
  variant: "no-products" | "no-results" | "no-categories";
  onClearFilters?: () => void;
}

const COPY = {
  "no-products": {
    icon: PackageSearch,
    title: "No products yet",
    description: "This store hasn't added any products to their catalogue.",
  },
  "no-results": {
    icon: SearchX,
    title: "No products found",
    description: "Try adjusting your search or filters to find what you're looking for.",
  },
  "no-categories": {
    icon: PackageSearch,
    title: "No categories",
    description: "Products will appear here once categories are set up.",
  },
};

export function StoreEmptyState({ variant, onClearFilters }: StoreEmptyStateProps) {
  const { icon: Icon, title, description } = COPY[variant];

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-in fade-in zoom-in-95 duration-400">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted/60 border border-border">
        <Icon className="h-10 w-10 text-muted-foreground/70" />
      </div>
      <h3 className="text-lg font-bold text-foreground">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      {onClearFilters && (
        <button
          type="button"
          onClick={onClearFilters}
          className="mt-5 text-sm font-semibold text-primary hover:opacity-80 transition-opacity"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
