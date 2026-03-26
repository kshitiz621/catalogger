"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { 
  Plus, 
  Trash2, 
  Edit, 
  Package, 
  Search, 
  ArrowUpRight,
  MoreHorizontal,
  Image as ImageIcon
} from "lucide-react";
import { ListSkeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      toast.error("Error loading products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this product? Customers will no longer see it.")) return;
    
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Product removed");
      fetchProducts();
    } catch (error) {
      toast.error("Error deleting product");
    }
  };

  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <ListSkeleton />;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Browse and manage your item catalogue.
          </p>
        </div>
        <Link 
          href="/dashboard/products/new" 
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md hover:bg-primary/90 hover:scale-[1.02] transition-all"
        >
          <Plus className="h-4 w-4" /> Add New Product
        </Link>
      </div>

      {/* Filters/Search */}
      <div className="relative group max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <input 
          type="text"
          placeholder="Search products or categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-border/80 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-border text-center px-6">
          <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-5 text-muted-foreground">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-foreground">No products found</h3>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-sm">
            {searchQuery 
              ? "We couldn't find any products matching your search term."
              : "Items you add to your store will appear here."}
          </p>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="mt-4 text-sm font-bold text-primary hover:underline hover:opacity-80 transition-all"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden divide-y divide-border/40">
          {filtered.map((product) => (
            <div key={product.id} className="group p-4 sm:p-5 flex items-center justify-between hover:bg-secondary/20 transition-all duration-200">
              <div className="flex items-center gap-4 min-w-0">
                <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-secondary/40 flex-shrink-0 relative overflow-hidden flex items-center justify-center border border-border/40 transition-transform group-hover:scale-[1.03] duration-300">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-muted-foreground/30" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm sm:text-base font-bold text-foreground truncate">{product.name}</h3>
                    {product.category && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-primary/5 text-primary border border-primary/10">
                        {product.category.name}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-bold text-foreground/90">₹{product.price.toLocaleString('en-IN')}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 ml-4 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-all duration-200">
                 <Link 
                  href={`/dashboard/products/${product.id}/edit`} 
                  className="p-2 sm:p-2.5 rounded-xl bg-white border border-border/80 text-muted-foreground hover:text-primary hover:border-primary/30 hover:shadow-sm transition-all shadow-none"
                  aria-label="Edit product"
                >
                  <Edit className="h-[18px] w-[18px]" />
                </Link>
                <button 
                  onClick={() => handleDelete(product.id)} 
                  className="p-2 sm:p-2.5 rounded-xl bg-white border border-border/80 text-muted-foreground hover:text-destructive hover:border-destructive/30 hover:shadow-sm transition-all shadow-none"
                  aria-label="Delete product"
                >
                  <Trash2 className="h-[18px] w-[18px]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
