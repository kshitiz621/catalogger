"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { 
  Plus, 
  Trash2, 
  Edit, 
  Tags, 
  Search, 
  Folder 
} from "lucide-react";
import { ListSkeleton } from "@/components/ui/skeleton";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      toast.error("Error loading categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete category? Products in this category will become uncategorized.")) return;
    
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Category deleted");
      fetchCategories();
    } catch (error) {
      toast.error("Error deleting category");
    }
  };

  const filtered = categories.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  if (loading) return <ListSkeleton />;

  return (
    <div className="space-y-6">
       {/* Page Header */}
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Categories</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Organize your products into groups for easy browsing.
          </p>
        </div>
        <Link 
          href="/dashboard/categories/new" 
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md hover:bg-primary/90 hover:scale-[1.02] transition-all"
        >
          <Plus className="h-4 w-4" /> Add New Category
        </Link>
      </div>

       {/* Filters/Search */}
       <div className="relative group max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <input 
          type="text"
          placeholder="Filter categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-border/80 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-border text-center px-6">
          <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-5 text-muted-foreground/40">
            <Tags className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-foreground">No categories found</h3>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-sm">
            Categories help keep your store clean and professional.
          </p>
          {!searchQuery && (
            <Link 
              href="/dashboard/categories/new" 
              className="mt-6 font-bold text-primary text-sm hover:underline"
            >
              Create your first category
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((category) => (
             <div key={category.id} className="group bg-white p-5 rounded-2xl border border-border/60 hover:border-primary/20 hover:shadow-md transition-all flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center">
                    <Folder className="w-5 h-5 text-primary/70" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{category.name}</h3>
                    <p className="text-xs text-muted-foreground">ID: {category.id.slice(-6).toUpperCase()}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1.5">
                   <Link 
                    href={`/dashboard/categories/${category.id}/edit`} 
                    className="p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
                    aria-label="Edit category"
                  >
                    <Edit className="h-[18px] w-[18px]" />
                  </Link>
                  <button 
                    onClick={() => handleDelete(category.id)} 
                    className="p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all"
                    aria-label="Delete category"
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
