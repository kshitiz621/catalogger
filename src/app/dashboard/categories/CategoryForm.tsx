"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { 
  Plus, 
  Trash2, 
  Edit, 
  Tags, 
  Folder, 
  Save, 
  X, 
  Loader2,
  ChevronRight
} from "lucide-react";

interface CategoryFormProps {
  initialData?: {
    id: string;
    name: string;
  };
}

export default function CategoryForm({ initialData }: CategoryFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(initialData?.name || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = initialData 
        ? `/api/categories/${initialData.id}` 
        : `/api/categories`;
      const method = initialData ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to save category");
      }

      toast.success(initialData ? "Category updated!" : "Category created!");
      router.push("/dashboard/categories");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      
      <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-6 overflow-hidden">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Tags className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">{initialData ? 'Edit Category' : 'Create New Category'}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Use categories to group products for customers.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="group">
            <label htmlFor="cat-name" className="flex items-center gap-2 text-sm font-bold text-foreground mb-2">
              <Folder className="w-4 h-4 text-emerald-600" />
              Category Name <span className="text-destructive">*</span>
            </label>
            <input 
              id="cat-name"
              type="text" 
              required 
              autoFocus
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="e.g. Menswear, Home Decor, Organic Spices"
              className="w-full rounded-2xl border border-border/80 bg-secondary/30 px-4 py-3.5 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium" 
            />
          </div>
        </div>
      </div>

       {/* Footer Actions */}
       <div className="pt-2 flex items-center justify-end gap-3">
        <button 
          type="button" 
          onClick={() => router.back()}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-border/80 bg-white font-bold text-xs text-foreground hover:bg-secondary transition-all active:scale-95 disabled:opacity-50"
        >
          <X className="w-4 h-4" /> Cancel
        </button>
        <button 
          type="submit" 
          disabled={loading || !name.trim()}
          className="flex items-center gap-2 px-8 py-3 rounded-xl bg-primary font-bold text-sm text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/95 hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {initialData ? "Save Changes" : "Confirm Category"}
        </button>
      </div>
    </form>
  );
}
