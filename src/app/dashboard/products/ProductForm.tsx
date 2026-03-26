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
  ChevronRight,
  Upload,
  Link as LinkIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { uploadImage } from "@/lib/upload-utils";

interface ProductFormProps {
  initialData?: {
    id: string;
    name: string;
    price: number;
    description?: string | null;
    imageUrl?: string | null;
    categoryId?: string | null;
  };
  categories: { id: string; name: string; }[];
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

    // Use actual service for real cloud uploads
    setUploading(true);
    const toastId = toast.loading("Uploading image to cloud...");

    try {
      // THE REAL HANDSHAKE (Cloudinary/S3-Compatible)
      const cloudUrl = await uploadImage(file);
      setImageUrl(cloudUrl);
      
      toast.success("Image uploaded successfully!", { id: toastId });
    } catch (err: any) {
      toast.error(err.message || "Upload failed. Check .env keys.", { id: toastId });
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
      const url = initialData 
        ? `/api/products/${initialData.id}` 
        : `/api/products`;
      const method = initialData ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save product");

      toast.success(initialData ? "Product updated!" : "New product created!");
      router.push("/dashboard/products");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl animate-in fade-in slide-in-from-bottom-3 duration-500">
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        
        {/* MEDIA SECTION */}
        <div className="lg:col-span-2 space-y-6">
          <div className="group">
            <label className="flex items-center gap-2 text-sm font-black text-foreground mb-4 uppercase tracking-widest opacity-80">
              <ImageIcon className="w-4 h-4 text-primary" />
              Product Image
            </label>
            
            <div className="relative aspect-square w-full rounded-[32px] border-2 border-dashed border-border/80 bg-secondary/20 overflow-hidden group-hover:border-primary/30 transition-all flex flex-col items-center justify-center p-4">
              {imageUrl ? (
                <>
                  <img 
                    src={imageUrl} 
                    alt="Preview" 
                    className="h-full w-full object-contain rounded-2xl transition-all duration-300 shadow-sm" 
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm">
                    <button 
                      type="button" 
                      onClick={() => fileInputRef.current?.click()}
                      className="p-3 bg-white text-foreground rounded-full hover:scale-110 transition-transform shadow-lg"
                    >
                      <Upload className="w-5 h-5" />
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setImageUrl("")}
                      className="p-3 bg-destructive text-white rounded-full hover:scale-110 transition-transform shadow-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </>
              ) : (
                <div 
                  className="flex flex-col items-center justify-center text-center cursor-pointer hover:bg-secondary/40 h-full w-full transition-all"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-16 h-16 rounded-3xl bg-white border border-border shadow-sm flex items-center justify-center mb-4 transition-transform group-hover:scale-110 group-hover:rotate-3">
                    <Upload className="w-7 h-7 text-primary/70" />
                  </div>
                  <p className="text-sm font-black text-foreground">Click to upload</p>
                  <p className="text-[10px] text-muted-foreground mt-2 font-bold uppercase tracking-widest px-4">PNG, JPG or WebP (Max 2MB)</p>
                </div>
              )}
              
              {uploading && (
                <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3 animate-in fade-in duration-300">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <span className="text-xs font-black text-primary uppercase tracking-widest">Saving to Cloud...</span>
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

            <div className="mt-6 p-4 rounded-2xl bg-white border border-border/60 space-y-3 shadow-black/[0.01]">
              <label htmlFor="p-img-url" className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                <LinkIcon className="w-3 h-3" /> or paste direct URL
              </label>
              <input 
                id="p-img-url"
                type="url" 
                value={imageUrl} 
                onChange={(e) => setImageUrl(e.target.value)} 
                placeholder="https://example.com/image.jpg"
                className="w-full rounded-xl border border-border/60 bg-secondary/10 px-3 py-2 text-xs focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none" 
              />
            </div>
          </div>
        </div>

        {/* DETAILS SECTION */}
        <div className="lg:col-span-3 space-y-8">
          
          <div className="bg-white rounded-[32px] border border-border/60 p-6 md:p-8 shadow-sm space-y-6">
            
            {/* Name */}
            <div className="group">
              <label htmlFor="p-name" className="flex items-center gap-2 text-xs font-black text-foreground mb-3 uppercase tracking-widest opacity-80">
                <Package className="w-4 h-4 text-primary" />
                Product Name <span className="text-destructive">*</span>
              </label>
              <input 
                id="p-name"
                type="text" 
                required 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Name your high-end product"
                className="w-full rounded-2xl border-2 border-border/80 bg-white px-4 py-4 text-base font-bold text-foreground focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none shadow-sm" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Price */}
              <div className="group">
                <label htmlFor="p-price" className="flex items-center gap-2 text-xs font-black text-foreground mb-3 uppercase tracking-widest opacity-80">
                  <IndianRupee className="w-4 h-4 text-emerald-600" />
                  Price <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-black text-lg">₹</span>
                  <input
                    id="p-price"
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-4 rounded-2xl border-2 border-border/80 bg-white text-base font-black text-foreground focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none tabular-nums shadow-sm"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="group">
                <label htmlFor="p-cat" className="flex items-center gap-2 text-xs font-black text-foreground mb-3 uppercase tracking-widest opacity-80">
                  <Folder className="w-4 h-4 text-primary" />
                  Category
                </label>
                <div className="relative">
                  <select
                    id="p-cat"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full appearance-none rounded-2xl border-2 border-border/80 bg-white px-4 py-4 text-sm font-black text-foreground focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none shadow-sm"
                  >
                    <option value="" className="font-sans">No Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id} className="font-sans">{cat.name}</option>
                    ))}
                  </select>
                  <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground rotate-90" />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="group">
              <label htmlFor="p-desc" className="flex items-center gap-2 text-xs font-black text-foreground mb-3 uppercase tracking-widest opacity-80">
                <FileText className="w-4 h-4 text-primary" />
                Description
              </label>
              <textarea 
                id="p-desc"
                rows={5}
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Market your product with a great description..."
                className="w-full rounded-2xl border-2 border-border/80 bg-white px-4 py-4 text-sm font-medium text-foreground focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none resize-none shadow-sm" 
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 px-4">
            <button 
              type="button" 
              onClick={() => router.back()}
              disabled={loading || uploading}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl border-2 border-border bg-white font-black text-xs text-foreground uppercase tracking-widest hover:bg-secondary transition-all active:scale-95 disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading || uploading}
              className="flex items-center gap-2.5 px-12 py-4 rounded-2xl bg-primary font-black text-xs text-primary-foreground uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary/95 hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Save className="w-4 h-4" />}
              {initialData ? "Save Product" : "Publish Listing"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
