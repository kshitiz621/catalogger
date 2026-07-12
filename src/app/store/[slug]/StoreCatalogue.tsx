"use client";

import { useMemo, useState } from "react";
import type {
  PublicCategory,
  PublicProduct,
  PublicStore,
  StorefrontSort,
} from "@/types/storefront";
import { getStoreFontUrl } from "@/lib/storefront/theme";
import { StoreSearch } from "@/components/store/store-search";
import { StoreFilters } from "@/components/store/store-filters";
import { CategoryChips } from "@/components/store/category-chips";
import { ProductGrid } from "@/components/store/product-grid";
import { StoreEmptyState } from "@/components/store/empty-state";

interface StoreCatalogueProps {
  store: PublicStore;
  categories: PublicCategory[];
  products: PublicProduct[];
}

export default function StoreCatalogue({
  store,
  categories,
  products,
}: StoreCatalogueProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [sort, setSort] = useState<StorefrontSort>("newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const priceRange = useMemo(() => {
    if (products.length === 0) return undefined;
    const prices = products.map((p) => p.price);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.categoryName?.toLowerCase().includes(q)
      );
    }

    if (selectedCategoryId !== "all") {
      result = result.filter((p) => p.categoryId === selectedCategoryId);
    }

    const min = minPrice ? parseFloat(minPrice) : undefined;
    const max = maxPrice ? parseFloat(maxPrice) : undefined;
    if (min !== undefined && !isNaN(min)) {
      result = result.filter((p) => p.price >= min);
    }
    if (max !== undefined && !isNaN(max)) {
      result = result.filter((p) => p.price <= max);
    }

    result.sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    });

    return result;
  }, [products, searchQuery, selectedCategoryId, sort, minPrice, maxPrice]);

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedCategoryId !== "all" ||
    minPrice !== "" ||
    maxPrice !== "" ||
    sort !== "newest";

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategoryId("all");
    setSort("newest");
    setMinPrice("");
    setMaxPrice("");
  };

  const fontUrl = getStoreFontUrl(store.theme.fontFamily);

  return (
    <div
      className="space-y-8"
      style={{ fontFamily: `'${store.theme.fontFamily}', sans-serif` }}
    >
      <link rel="stylesheet" href={fontUrl} />

      <link rel="stylesheet" href={fontUrl} />

      {/* Hero / Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-border mb-2">
        <div
          className="relative h-36 sm:h-44 md:h-52"
          style={
            store.bannerUrl
              ? undefined
              : {
                  background: `linear-gradient(135deg, ${store.themeColor}18, ${store.accentColor}28)`,
                }
          }
        >
          {store.bannerUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={store.bannerUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7 text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground animate-in fade-in slide-in-from-top-3 duration-500">
              {store.name}
            </h1>
            {store.description ? (
              <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto line-clamp-3">
                {store.description}
              </p>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">
                Browse {products.length} {products.length === 1 ? "product" : "products"}
                {categories.length > 0 && ` across ${categories.length} categories`}.
              </p>
            )}
          </div>
        </div>
      </div>

      {products.length === 0 ? (
        <StoreEmptyState variant="no-products" />
      ) : (
        <>
          <div className="space-y-4 border-b border-border pb-5">
            <div className="flex flex-col lg:flex-row gap-4 lg:items-start lg:justify-between">
              <StoreSearch
                value={searchQuery}
                onChange={setSearchQuery}
                resultCount={searchQuery ? filteredProducts.length : undefined}
              />
              <StoreFilters
                sort={sort}
                onSortChange={setSort}
                minPrice={minPrice}
                maxPrice={maxPrice}
                onMinPriceChange={setMinPrice}
                onMaxPriceChange={setMaxPrice}
                priceRange={priceRange}
              />
            </div>

            <CategoryChips
              categories={categories}
              selectedId={selectedCategoryId}
              onSelect={setSelectedCategoryId}
              theme={store.theme}
            />
          </div>

          {filteredProducts.length === 0 ? (
            <StoreEmptyState
              variant="no-results"
              onClearFilters={hasActiveFilters ? clearFilters : undefined}
            />
          ) : (
            <ProductGrid
              products={filteredProducts}
              storeSlug={store.slug}
              storeId={store.id}
              theme={store.theme}
            />
          )}
        </>
      )}
    </div>
  );
}
