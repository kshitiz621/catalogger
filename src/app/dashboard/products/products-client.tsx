"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Plus,
  Trash2,
  Edit,
  Package,
  Search,
  Image as ImageIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { cn } from "@/lib/utils";
import { deleteProduct } from "@/lib/actions/seller.actions";

export default function ProductsClient({ initialProducts }: { initialProducts: any[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    
    const result = await deleteProduct(deleteTarget);
    
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Product removed");
    }
    
    setDeleting(false);
    setDeleteTarget(null);
  };

  const filtered = initialProducts.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground tracking-tight">Products</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">
            Browse and manage your item catalogue.
          </p>
        </div>
        <Link
          href="/dashboard/products/new"
          className={cn(buttonVariants({ size: "sm" }))}
        >
          <Plus className="h-4 w-4" /> Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          placeholder="Search products or categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-xl border border-dashed border-border bg-card text-center px-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted border border-border mb-4">
            <Package className="h-5 w-5 text-muted-foreground" />
          </div>
          <h3 className="text-[15px] font-semibold text-foreground">No products found</h3>
          <p className="text-[13px] text-muted-foreground mt-1.5 max-w-xs">
            {searchQuery
              ? "No products match your search. Try a different term."
              : "Items you add will appear here."}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="mt-4 text-[13px] font-medium text-primary hover:underline underline-offset-4"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden divide-y divide-border/60">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="group flex items-center justify-between px-5 py-4 hover:bg-secondary/30 transition-colors duration-150"
            >
              {/* Product info */}
              <div className="flex items-center gap-4 min-w-0">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted border border-border overflow-hidden">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="h-5 w-5 text-muted-foreground/40" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <h3 className="text-[13px] font-medium text-foreground truncate">
                      {product.name}
                    </h3>
                    {product.category && (
                      <Badge variant="secondary" className="shrink-0 text-[10px] px-1.5 py-0">
                         {product.category.name}
                      </Badge>
                    )}
                  </div>
                  <p className="text-[13px] font-semibold text-foreground/90 tabular-nums">
                    ₹{product.price.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 shrink-0 ml-4 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-150">
                <Link
                  href={`/dashboard/products/${product.id}/edit`}
                  aria-label="Edit product"
                  className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }))}
                >
                  <Edit className="h-4 w-4" />
                </Link>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setDeleteTarget(product.id)}
                  aria-label="Delete product"
                  className="hover:text-destructive hover:bg-destructive/8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        title="Remove product?"
        description="This product will be permanently removed from your catalogue. Customers will no longer see it."
        confirmLabel="Remove Product"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
