"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import Link from "next/link";

type CategoryProps = { id: string; name: string; imageUrl?: string | null };
type ProductProps = { id: string; name: string; price: number; imageUrl: string | null; categoryId: string | null };

interface StoreCatalogueProps {
  store: { 
    name: string;
    showCategoryImages?: boolean;
    categoryImageStyle?: string;
  };
  storeSlug: string;
  storeId: string;
  categories: CategoryProps[];
  products: ProductProps[];
}

export default function StoreCatalogue({ store, storeSlug, storeId, categories, products }: StoreCatalogueProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = selectedCategoryId === "all" || p.categoryId === selectedCategoryId;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, searchQuery, selectedCategoryId]);

  return (
    <div className="space-y-8">
      {/* Store Hero */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          {store.name}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore our complete catalogue.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b border-border pb-5">
        <div className="relative w-full md:w-96">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <input
            type="text"
            className="block w-full rounded-xl border border-input bg-card py-2.5 pl-10 pr-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring text-sm text-foreground placeholder:text-muted-foreground"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {categories.length > 0 && (
          <div className="w-full flex overflow-x-auto gap-3 pb-4 md:pb-2 scrollbar-hide py-2">
            <button
              onClick={() => setSelectedCategoryId("all")}
              className={`flex-shrink-0 flex flex-col items-center gap-2 group transition-all ${
                selectedCategoryId === "all" ? "opacity-100" : "opacity-60 hover:opacity-100"
              }`}
            >
              <div 
                className={`w-14 h-14 md:w-16 md:h-16 flex items-center justify-center border-2 transition-all ${
                  selectedCategoryId === "all" 
                    ? "border-primary bg-primary/5 shadow-md scale-105" 
                    : "border-border/60 bg-muted/30"
                } ${store.categoryImageStyle === "rounded" ? "rounded-full" : "rounded-2xl"}`}
              >
                <div className="text-[10px] font-black uppercase tracking-tighter text-center px-1">All</div>
              </div>
              <span className={`text-[11px] font-bold uppercase tracking-wider ${selectedCategoryId === "all" ? "text-primary" : "text-muted-foreground"}`}>
                All
              </span>
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`flex-shrink-0 flex flex-col items-center gap-2 group transition-all ${
                  selectedCategoryId === cat.id ? "opacity-100" : "opacity-60 hover:opacity-100"
                }`}
              >
                <div 
                  className={`w-14 h-14 md:w-16 md:h-16 overflow-hidden border-2 transition-all ${
                    selectedCategoryId === cat.id 
                      ? "border-primary bg-primary/5 shadow-md scale-105" 
                      : "border-border/60 bg-muted/30"
                  } ${store.categoryImageStyle === "rounded" ? "rounded-full" : "rounded-2xl"}`}
                >
                  {store.showCategoryImages && cat.imageUrl ? (
                    <img 
                      src={cat.imageUrl} 
                      alt={cat.name} 
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/5">
                       <span className="text-[10px] font-black uppercase tracking-tighter text-center px-1 truncate w-full">
                         {cat.name.substring(0, 3)}
                       </span>
                    </div>
                  )}
                </div>
                <span className={`text-[11px] font-bold uppercase tracking-wider truncate max-w-[70px] ${selectedCategoryId === cat.id ? "text-primary" : "text-muted-foreground"}`}>
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 px-4">
          <h3 className="text-lg font-medium text-foreground">No products found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Try adjusting your search or filter to find what you&apos;re looking for.
          </p>
          {(searchQuery !== "" || selectedCategoryId !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategoryId("all");
              }}
              className="mt-4 text-primary hover:opacity-80 font-medium text-sm"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-y-8 gap-x-5 sm:grid-cols-3 lg:grid-cols-4 xl:gap-x-7">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/store/${storeSlug}/product/${product.id}`}
              className="group relative border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 bg-card duration-200"
            >
              <div className="aspect-square w-full overflow-hidden bg-muted/50 border-b border-border flex items-center justify-center">
                {product.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    <span className="text-xs border border-border rounded-lg px-3 py-1.5 bg-muted font-medium">No Image</span>
                  </div>
                )}
              </div>
              <div className="p-4 flex flex-col gap-1.5">
                <h3 className="text-sm font-semibold text-foreground break-words group-hover:text-primary transition-colors leading-snug">
                  {product.name}
                </h3>
                <p className="text-base font-bold text-foreground tabular-nums">
                  ₹{product.price.toFixed(2)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
