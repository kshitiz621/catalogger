"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Plus,
  Trash2,
  Edit,
  Tags,
  Search,
  Folder,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { cn } from "@/lib/utils";
import { deleteCategory } from "@/lib/actions/seller.actions";

export default function CategoriesClient({ initialCategories }: { initialCategories: any[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    
    const result = await deleteCategory(deleteTarget);
    
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Category deleted");
    }
    
    setDeleting(false);
    setDeleteTarget(null);
  };

  const filtered = initialCategories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground tracking-tight">Categories</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">
            Organize your products into groups for easy browsing.
          </p>
        </div>
        <Link
          href="/dashboard/categories/new"
          className={cn(buttonVariants({ size: "sm" }))}
        >
          <Plus className="h-4 w-4" /> Add Category
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          placeholder="Filter categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-xl border border-dashed border-border bg-card text-center px-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted border border-border mb-4">
            <Tags className="h-5 w-5 text-muted-foreground" />
          </div>
          <h3 className="text-[15px] font-semibold text-foreground">No categories found</h3>
          <p className="text-[13px] text-muted-foreground mt-1.5 max-w-xs">
            Categories help keep your store organized and professional.
          </p>
          {!searchQuery && (
            <Link
              href="/dashboard/categories/new"
              className={cn(buttonVariants({ size: "sm" }), "mt-5")}
            >
              <Plus className="h-4 w-4" /> Create first category
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((category) => (
            <div
              key={category.id}
              className="group flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3.5 shadow-sm hover:border-primary/25 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/8 border border-primary/15">
                  <Folder className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-[13px] font-medium text-foreground group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-[11px] text-muted-foreground font-mono">
                    #{category.id.slice(-6).toUpperCase()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Link
                  href={`/dashboard/categories/${category.id}/edit`}
                  aria-label="Edit category"
                  className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }))}
                >
                  <Edit className="h-4 w-4" />
                </Link>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setDeleteTarget(category.id)}
                  aria-label="Delete category"
                  className="hover:text-destructive hover:bg-destructive/8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirm Delete */}
      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        title="Delete category?"
        description="Products in this category will become uncategorized. This action cannot be undone."
        confirmLabel="Delete Category"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
