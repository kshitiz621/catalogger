"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Tags, Save, X, Loader2, Folder } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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
      const method = initialData ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save category");
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
    <form
      onSubmit={handleSubmit}
      className="space-y-5 max-w-lg animate-in fade-in slide-in-from-bottom-2 duration-400"
    >
      <div className="rounded-xl border border-border bg-card shadow-sm p-5 space-y-5">
        {/* Form header */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/8 border border-primary/15">
            <Tags className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h2 className="text-[15px] font-semibold text-foreground">
              {initialData ? "Edit Category" : "New Category"}
            </h2>
            <p className="text-[12px] text-muted-foreground mt-0.5">
              Group products for easy customer browsing.
            </p>
          </div>
        </div>

        {/* Category name */}
        <div className="space-y-1.5">
          <Label
            htmlFor="cat-name"
            className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
          >
            <Folder className="h-3.5 w-3.5 text-success" />
            Category Name <span className="text-destructive normal-case tracking-normal font-medium">*</span>
          </Label>
          <Input
            id="cat-name"
            type="text"
            required
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Menswear, Home Decor, Organic Spices"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2.5">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          <X className="h-4 w-4" />
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading || !name.trim()}
        >
          {loading ? (
            <><Loader2 className="h-4 w-4 animate-spin" />Saving…</>
          ) : (
            <><Save className="h-4 w-4" />{initialData ? "Save Changes" : "Create Category"}</>
          )}
        </Button>
      </div>
    </form>
  );
}
