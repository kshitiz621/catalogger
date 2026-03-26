"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { 
  Store, 
  Link as LinkIcon, 
  MessageSquare, 
  Save, 
  Loader2, 
  AlertCircle,
  Hash,
  Upload,
  X,
  Image as ImageIcon
} from "lucide-react";
import { uploadImage } from "@/lib/upload-utils";

interface StoreSettingsFormProps {
  initialData: {
    name: string;
    slug: string;
    whatsappNumber: string | null;
    logoUrl?: string | null;
    storeTitle?: string | null;
    showCategoryImages?: boolean;
    categoryImageStyle?: string;
  };
}

export default function StoreSettingsForm({ initialData }: StoreSettingsFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [name, setName] = useState(initialData.name);
  const [slug, setSlug] = useState(initialData.slug);
  const [whatsappNumber, setWhatsappNumber] = useState(initialData.whatsappNumber || "");
  const [logoUrl, setLogoUrl] = useState(initialData.logoUrl || "");
  const [storeTitle, setStoreTitle] = useState(initialData.storeTitle || "");
  const [showCategoryImages, setShowCategoryImages] = useState(initialData.showCategoryImages ?? false);
  const [categoryImageStyle, setCategoryImageStyle] = useState(initialData.categoryImageStyle ?? "square");

  const hasChanges = 
    name !== initialData.name || 
    slug !== initialData.slug || 
    whatsappNumber !== (initialData.whatsappNumber || "") ||
    logoUrl !== (initialData.logoUrl || "") ||
    storeTitle !== (initialData.storeTitle || "") ||
    showCategoryImages !== (initialData.showCategoryImages ?? false) ||
    categoryImageStyle !== (initialData.categoryImageStyle ?? "square");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const toastId = toast.loading("Updating brand logo...");

    try {
      // THE REAL HANDSHAKE (Cloudinary/S3-Compatible)
      const cloudUrl = await uploadImage(file);
      setLogoUrl(cloudUrl);
      
      toast.success("Logo uploaded successfully!", { id: toastId });
    } catch (err: any) {
      toast.error(err.message || "Upload failed. Check .env keys.", { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  const handleSlugChange = (value: string) => {
    const formatted = value.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");
    setSlug(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasChanges) return;

    setLoading(true);
    try {
      const res = await fetch("/api/store", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug, whatsappNumber, logoUrl, storeTitle, showCategoryImages, categoryImageStyle }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update store");

      toast.success("Store settings updated!");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* LOGO COLUMN */}
        <div className="lg:col-span-1 space-y-6">
          <label className="flex items-center gap-2 text-xs font-black text-foreground mb-4 uppercase tracking-widest opacity-80">
            <ImageIcon className="w-4 h-4 text-primary" />
            Store Logo
          </label>
          
          <div className="group relative aspect-square w-full max-w-[240px] mx-auto rounded-full border-2 border-dashed border-border/60 bg-secondary/20 hover:border-primary/40 transition-all flex flex-col items-center justify-center p-2 group shadow-sm overflow-hidden">
            {logoUrl ? (
              <>
                <img src={logoUrl} alt="Logo" className="h-full w-full object-cover rounded-full transition-transform group-hover:scale-110 duration-500" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 backdrop-blur-sm">
                   <Upload className="w-6 h-6 text-white" />
                   <span className="text-[10px] font-black text-white uppercase tracking-widest">Change</span>
                   <button 
                    type="button" 
                    onClick={() => setLogoUrl("")}
                    className="absolute top-2 right-2 p-1.5 bg-destructive text-white rounded-full hover:scale-110 transition-transform shadow-lg"
                   >
                     <X className="w-4 h-4" />
                   </button>
                </div>
              </>
            ) : (
              <div 
                className="flex flex-col items-center justify-center text-center cursor-pointer p-6 h-full w-full"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4 transition-transform group-hover:scale-110 group-hover:rotate-6">
                  <Upload className="w-6 h-6 text-primary/70" />
                </div>
                <p className="text-xs font-black text-foreground">Click to upload</p>
                <p className="text-[9px] text-muted-foreground mt-2 font-bold uppercase tracking-widest leading-relaxed">Square Logo Recommended</p>
              </div>
            )}
            
            {uploading && (
              <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] flex items-center justify-center animate-in fade-in duration-300">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
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

        {/* DETAILS COLUMN */}
        <div className="lg:col-span-2 space-y-8 px-2 md:px-0">
          
          {/* Store Name */}
          <div className="group">
            <label htmlFor="store-name" className="flex items-center gap-2 text-xs font-black text-foreground mb-3 uppercase tracking-widest opacity-80">
              <Store className="w-4 h-4 text-primary" />
              Business Name <span className="text-destructive">*</span>
            </label>
            <input 
              id="store-name"
              type="text" 
              required 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Your incredible store name"
              className="w-full rounded-2xl border-2 border-border/80 bg-white px-4 py-4 text-base font-bold transition-all focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none shadow-sm" 
            />
          </div>

          {/* Store Title */}
          <div className="group">
            <label htmlFor="store-title" className="flex items-center gap-2 text-xs font-black text-foreground mb-3 uppercase tracking-widest opacity-80">
              <LinkIcon className="w-4 h-4 text-primary" />
              SEO Page Title
            </label>
            <input 
              id="store-title"
              type="text" 
              value={storeTitle} 
              onChange={(e) => setStoreTitle(e.target.value)} 
              placeholder="e.g. Best Handmade Crafts | Shop Name"
              className="w-full rounded-2xl border-2 border-border/80 bg-white px-4 py-4 text-base font-bold transition-all focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none shadow-sm" 
            />
            <p className="mt-2 text-[10px] text-muted-foreground font-medium uppercase tracking-wider">This title appears in browser tabs and search results.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Slug */}
            <div className="group">
              <label htmlFor="store-slug" className="flex items-center gap-2 text-xs font-black text-foreground mb-3 uppercase tracking-widest opacity-80">
                <Hash className="w-4 h-4 text-emerald-600" />
                Live URL Slug <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <input 
                  id="store-slug"
                  type="text" 
                  required 
                  value={slug} 
                  onChange={(e) => handleSlugChange(e.target.value)} 
                  placeholder="my-store"
                  className="w-full rounded-2xl border-2 border-border/80 bg-white px-4 py-4 text-sm font-black text-foreground focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none shadow-sm" 
                />
                <div className="mt-2.5 px-3 py-1.5 rounded-xl bg-secondary/40 border border-border/60 inline-flex items-center gap-1.5">
                  <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Live at:</span>
                   <span className="text-[10px] font-bold text-primary truncate">catalogger.com/store/{slug || '...'}</span>
                </div>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="group">
              <label htmlFor="whatsapp" className="flex items-center gap-2 text-xs font-black text-foreground mb-3 uppercase tracking-widest opacity-80">
                <MessageSquare className="w-4 h-4 text-[#25D366]" />
                WhatsApp Number <span className="text-destructive">*</span>
              </label>
              <input 
                id="whatsapp"
                type="tel" 
                required 
                value={whatsappNumber} 
                onChange={(e) => setWhatsappNumber(e.target.value)} 
                placeholder="e.g. 919876543210"
                className="w-full rounded-2xl border-2 border-border/80 bg-white px-4 py-4 text-sm font-black text-foreground focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none shadow-sm" 
              />
            </div>
          </div>

          {/* Category Display Settings */}
          <div className="pt-6 border-t border-border/40 space-y-6">
            <div>
              <h3 className="text-sm font-black text-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-primary" />
                Category Display Settings
              </h3>
              
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between p-4 rounded-2xl border-2 border-border/60 bg-secondary/10">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-foreground">Show Category Images</p>
                    <p className="text-xs text-muted-foreground">Display product images for each category on the home page.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowCategoryImages(!showCategoryImages)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${showCategoryImages ? 'bg-primary' : 'bg-muted'}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showCategoryImages ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                  </button>
                </div>

                {showCategoryImages && (
                  <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <p className="text-xs font-black text-foreground uppercase tracking-widest opacity-80">Thumbnail Style</p>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setCategoryImageStyle("square")}
                        className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${categoryImageStyle === "square" ? "border-primary bg-primary/5 shadow-sm" : "border-border/60 hover:border-border bg-white"}`}
                      >
                        <div className="w-12 h-12 bg-muted rounded-md border-2 border-border/40" />
                        <span className="text-xs font-bold uppercase tracking-wider">Sharp Square</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCategoryImageStyle("rounded")}
                        className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${categoryImageStyle === "rounded" ? "border-primary bg-primary/5 shadow-sm" : "border-border/60 hover:border-border bg-white"}`}
                      >
                        <div className="w-12 h-12 bg-muted rounded-full border-2 border-border/40" />
                        <span className="text-xs font-bold uppercase tracking-wider">Soft Rounded</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-6 flex justify-end">
            <button 
              type="submit" 
              disabled={loading || !hasChanges || uploading}
              className="flex items-center gap-2.5 px-12 py-4 rounded-2xl bg-primary font-black text-xs text-primary-foreground uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary/95 hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-30 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Save className="w-4 h-4" />}
              {loading ? "Updating..." : "Save Store Settings"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
