"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";

type CategoryProps = { id: string; name: string };
type ProductProps = { id: string; name: string; price: number; imageUrl: string | null; categoryId: string | null };

interface StoreCatalogueProps {
  store: { name: string };
  categories: CategoryProps[];
  products: ProductProps[];
}

export default function StoreCatalogue({ store, categories, products }: StoreCatalogueProps) {
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
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          {store.name}
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Explore our complete catalogue.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b border-gray-200 pb-5">
        <div className="relative w-full md:w-96">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {categories.length > 0 && (
          <div className="w-full md:w-auto flex overflow-x-auto gap-2 pb-2 md:pb-0 scrollbar-hide">
            <button
              onClick={() => setSelectedCategoryId("all")}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                selectedCategoryId === "all"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Products
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  selectedCategoryId === cat.id
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 px-4">
          <h3 className="text-lg font-medium text-gray-900">No products found</h3>
          <p className="mt-2 text-sm text-gray-500">
            Try adjusting your search or filter to find what you're looking for.
          </p>
          {(searchQuery !== "" || selectedCategoryId !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategoryId("all");
              }}
              className="mt-4 text-blue-600 hover:text-blue-500 font-medium text-sm"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-3 lg:grid-cols-4 xl:gap-x-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group relative border rounded-xl overflow-hidden hover:shadow-lg transition-transform hover:-translate-y-1 bg-white pb-3 duration-200">
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-50 border-b flex items-center justify-center p-0" style={{ height: '240px' }}>
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover object-center"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-300">
                    <span className="text-sm border border-gray-200 rounded p-2 bg-gray-100">No Image</span>
                  </div>
                )}
              </div>
              <div className="mt-4 px-4 flex flex-col sm:flex-row justify-between sm:items-start gap-2">
                <div>
                  <h3 className="text-base text-gray-900 font-semibold break-words">
                    {product.name}
                  </h3>
                </div>
                <p className="text-base font-bold text-gray-900 whitespace-nowrap bg-blue-50 px-2 rounded-md shadow-sm border border-blue-100 inline-block self-start sm:self-auto">${product.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
