"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Package,
  IndianRupee,
  FileText,
  Image as ImageIcon,
  Folder,
  Save,
  X,
  Loader2,
  ChevronDown,
  Upload,
  Link as LinkIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { uploadImage } from "@/lib/upload-utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface ProductFormProps {
  initialData?: {
    id: string;
    name: string;
    price: number;
    description?: string | null;
    imageUrl?: string | null;
    categoryId?: string | null;
  };
  categories: { id: string; name: string }[];
}

export default function ProductForm({ initialData, categories }: ProductFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState(initialData?.name || "");
  const [price, setPrice] = useState(initialData?.price?.toString() || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || "");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const toastId = toast.loading("Uploading image...");
    try {
      const cloudUrl = await uploadImage(file);
      setImageUrl(cloudUrl);
      toast.success("Image uploaded!", { id: toastId });
    } catch (err: any) {
      toast.error(err.message || "Upload failed", { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      name: name.trim(),
      price: parseFloat(price),
      description: description.trim() || null,
      imageUrl: imageUrl.trim() || null,
      categoryId: categoryId || null,
    };
    try {
      const url = initialData ? `/api/products/${initialData.id}` : `/api/products`;
      const method = initialData ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save product");
      toast.success(initialData ? "Product updated!" : "Product created!");
      router.push("/dashboard/products");
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
      className="space-y-6 max-w-4xl animate-in fade-in slide-in-from-bottom-2 duration-400"
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Image Upload */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <Label className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
              <ImageIcon className="h-3.5 w-3.5 text-primary" />
              Product Image
            </Label>
            <div className="group relative aspect-square w-full rounded-xl border-2 border-dashed border-border bg-secondary/20 overflow-hidden hover:border-primary/40 hover:bg-secondary/30 transition-all">
              {imageUrl ? (
                <>
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="h-full w-full object-contain p-2"
                  />
                  <div className="absolute inset-0 bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="secondary"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="destructive"
                      onClick={() => setImageUrl("")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <div
                  className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-3 p-4 text-center"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-card shadow-sm">
                    <Upload className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-foreground">Click to upload</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">PNG, JPG, WebP (max 2MB)</p>
                  </div>
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/70 backdrop-blur-sm">
                  <Loader2 className="h-7 w-7 animate-spin text-primary" />
                  <span className="text-[11px] font-medium text-primary">Uploading…</span>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept="image/*"
            />
          </div>

          {/* URL input */}
          <div className="rounded-lg border border-border bg-card p-3.5 space-y-2">
            <Label htmlFor="p-img-url" className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
              <LinkIcon className="h-3 w-3" /> Or paste URL
            </Label>
            <Input
              id="p-img-url"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="h-8 text-[12px]"
            />
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-3 space-y-5">
          <div className="rounded-xl border border-border bg-card shadow-sm p-5 space-y-5">
            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="p-name" className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Package className="h-3.5 w-3.5 text-primary" />
                Product Name <span className="text-destructive normal-case tracking-normal font-medium">*</span>
              </Label>
              <Input
                id="p-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter product name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Price */}
              <div className="space-y-1.5">
                <Label htmlFor="p-price" className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <IndianRupee className="h-3.5 w-3.5 text-success" />
                  Price <span className="text-destructive normal-case tracking-normal font-medium">*</span>
                </Label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] font-semibold text-muted-foreground">
                    ₹
                  </span>
                  <Input
                    id="p-price"
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    className="pl-7 tabular-nums"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <Label htmlFor="p-cat" className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Folder className="h-3.5 w-3.5 text-primary" />
                  Category
                </Label>
                <div className="relative">
                  <select
                    id="p-cat"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="h-9 w-full appearance-none rounded-lg border border-input bg-card px-3 pr-8 text-[13px] text-foreground focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring/30 transition-all cursor-pointer"
                  >
                    <option value="">No Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="p-desc" className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-primary" />
                Description
              </Label>
              <textarea
                id="p-desc"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your product..."
                className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring/30 transition-all resize-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading || uploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || uploading}
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" />{initialData ? "Saving…" : "Publishing…"}</>
              ) : (
                <><Save className="h-4 w-4" />{initialData ? "Save Product" : "Publish Listing"}</>
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
