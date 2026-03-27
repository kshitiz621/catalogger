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
  Image as ImageIcon,
  Palette,
  Globe,
  Shield,
  Layout,
  Code
} from "lucide-react";
import { uploadImage } from "@/lib/upload-utils";
import PasswordChangeForm from "./PasswordChangeForm";
import { cn } from "@/lib/utils";

interface StoreSettingsFormProps {
  initialData: {
    name: string;
    slug: string;
    whatsappNumber: string | null;
    logoUrl?: string | null;
    storeTitle?: string | null;
    showCategoryImages?: boolean;
    categoryImageStyle?: string;
    themeColor?: string;
    headerCode?: string | null;
    footerCode?: string | null;
  };
}

export default function StoreSettingsForm({ initialData }: StoreSettingsFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [name, setName] = useState(initialData.name);
  const [slug, setSlug] = useState(initialData.slug);
  const [whatsappNumber, setWhatsappNumber] = useState(initialData.whatsappNumber || "");
  const [logoUrl, setLogoUrl] = useState(initialData.logoUrl || "");
  const [storeTitle, setStoreTitle] = useState(initialData.storeTitle || "");
  const [showCategoryImages, setShowCategoryImages] = useState(initialData.showCategoryImages ?? false);
  const [categoryImageStyle, setCategoryImageStyle] = useState(initialData.categoryImageStyle ?? "square");
  const [themeColor, setThemeColor] = useState(initialData.themeColor || "#E11D48");
  const [headerCode, setHeaderCode] = useState(initialData.headerCode || "");
  const [footerCode, setFooterCode] = useState(initialData.footerCode || "");

  const hasChanges = 
    name !== initialData.name || 
    slug !== initialData.slug || 
    whatsappNumber !== (initialData.whatsappNumber || "") ||
    logoUrl !== (initialData.logoUrl || "") ||
    storeTitle !== (initialData.storeTitle || "") ||
    showCategoryImages !== (initialData.showCategoryImages ?? false) ||
    categoryImageStyle !== (initialData.categoryImageStyle ?? "square") ||
    themeColor !== (initialData.themeColor || "#E11D48") ||
    headerCode !== (initialData.headerCode || "") ||
    footerCode !== (initialData.footerCode || "");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const toastId = toast.loading("Updating brand logo...");

    try {
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
        body: JSON.stringify({ 
          name, 
          slug, 
          whatsappNumber, 
          logoUrl, 
          storeTitle, 
          showCategoryImages, 
          categoryImageStyle,
          themeColor,
          headerCode,
          footerCode
        }),
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

  const tabs = [
    { id: "general", label: "General", icon: Layout },
    { id: "customize", label: "Customize", icon: Palette },
    { id: "domain", label: "Domain", icon: Globe },
    { id: "security", label: "Security", icon: Shield },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs Layout */}
      <div className="flex items-center gap-1 p-1 bg-secondary/30 rounded-2xl border border-border/40 w-full overflow-x-auto scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 text-sm font-bold rounded-xl transition-all whitespace-nowrap whitespace-nowrap",
              activeTab === tab.id 
                ? "bg-white text-primary shadow-sm border border-border/40 scale-[1.02]" 
                : "text-muted-foreground hover:text-foreground hover:bg-white/50"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-8 transition-all duration-300">
        <form onSubmit={handleSubmit} className="space-y-10">
          {activeTab === "general" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

              {/* Analytics & Code */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <div className="group">
                  <label htmlFor="header-code" className="flex items-center gap-2 text-xs font-black text-foreground mb-3 uppercase tracking-widest opacity-80">
                    <Code className="w-4 h-4 text-indigo-500" />
                    Header Code (Scripts)
                  </label>
                  <textarea 
                    id="header-code"
                    value={headerCode} 
                    onChange={(e) => setHeaderCode(e.target.value)} 
                    placeholder="<!-- Add Google Analytics or Facebook Pixel scripts here -->"
                    className="w-full rounded-2xl border-2 border-border/80 bg-white px-4 py-4 text-sm font-medium transition-all focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none shadow-sm font-mono min-h-[120px]" 
                  />
                  <p className="mt-2 text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Scripts injected in the &lt;head&gt; tag.</p>
                </div>

                <div className="group">
                  <label htmlFor="footer-code" className="flex items-center gap-2 text-xs font-black text-foreground mb-3 uppercase tracking-widest opacity-80">
                    <Code className="w-4 h-4 text-rose-500" />
                    Footer Code (Scripts)
                  </label>
                  <textarea 
                    id="footer-code"
                    value={footerCode} 
                    onChange={(e) => setFooterCode(e.target.value)} 
                    placeholder="<!-- Custom chat widgets or tracking pixels -->"
                    className="w-full rounded-2xl border-2 border-border/80 bg-white px-4 py-4 text-sm font-medium transition-all focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none shadow-sm font-mono min-h-[120px]" 
                  />
                  <p className="mt-2 text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Scripts injected before the closing &lt;/body&gt; tag.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "customize" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* LOGO */}
                <div className="lg:col-span-1 space-y-4">
                  <label className="flex items-center gap-2 text-xs font-black text-foreground uppercase tracking-widest opacity-80">
                    <ImageIcon className="w-4 h-4 text-primary" />
                    Store Logo
                  </label>
                  <div className="group relative aspect-square w-full max-w-[200px] rounded-3xl border-2 border-dashed border-border bg-secondary/10 flex flex-col items-center justify-center p-2 shadow-sm overflow-hidden hover:border-primary transition-all">
                    {logoUrl ? (
                      <>
                        <img src={logoUrl} alt="Logo" className="h-full w-full object-cover rounded-2xl" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 backdrop-blur-sm cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                          <Upload className="w-6 h-6 text-white" />
                          <span className="text-[10px] font-black text-white hover:underline">Change Logo</span>
                        </div>
                        <button type="button" onClick={() => setLogoUrl("")} className="absolute top-2 right-2 p-1.5 bg-destructive text-white rounded-full hover:scale-110 active:scale-95 transition-all"><X className="w-4 h-4" /></button>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center cursor-pointer h-full w-full" onClick={() => fileInputRef.current?.click()}>
                        <Upload className="w-8 h-8 text-muted-foreground mb-3" />
                        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Click to upload</p>
                      </div>
                    )}
                    {uploading && <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] flex items-center justify-center"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>}
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                </div>

                {/* THEME COLOR */}
                <div className="lg:col-span-2 space-y-6">
                  <label className="flex items-center gap-2 text-xs font-black text-foreground uppercase tracking-widest opacity-80">
                    <Palette className="w-4 h-4 text-primary" />
                    Theme Brand Color
                  </label>
                  <div className="flex flex-wrap gap-4">
                    <div className="relative w-20 h-20 rounded-2xl border-2 border-border overflow-hidden shadow-sm group">
                      <input 
                        type="color" 
                        value={themeColor} 
                        onChange={(e) => setThemeColor(e.target.value)}
                        className="absolute inset-0 w-full h-full cursor-pointer scale-150"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                       <input 
                        type="text" 
                        value={themeColor} 
                        onChange={(e) => setThemeColor(e.target.value)}
                        className="w-full max-w-[120px] rounded-xl border-2 border-border/80 bg-white px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" 
                      />
                      <p className="text-xs text-muted-foreground font-medium">This color will be used for buttons, icons, and accents across your public store.</p>
                      <div className="flex items-center gap-2 mt-3">
                        {['#E11D48', '#2563EB', '#059669', '#7C3AED', '#EA580C', '#000000'].map(c => (
                          <button 
                            key={c} 
                            type="button" 
                            onClick={() => setThemeColor(c)}
                            className={cn(
                              "w-6 h-6 rounded-lg border border-white ring-2 ring-transparent transition-all",
                              themeColor === c && "scale-110 ring-primary/40 ring-offset-1"
                            )}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Category Display */}
              <div className="pt-8 border-t border-border/40 space-y-6">
                <div>
                  <h3 className="text-sm font-black text-foreground uppercase tracking-widest mb-6">Gallery Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex items-center justify-between p-5 rounded-2xl border-2 border-border/60 bg-secondary/5">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-foreground">Show Category Images</p>
                        <p className="text-[11px] text-muted-foreground">Display visual icons for your product categories.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowCategoryImages(!showCategoryImages)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${showCategoryImages ? 'bg-primary' : 'bg-muted'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showCategoryImages ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>

                    {showCategoryImages && (
                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={() => setCategoryImageStyle("square")}
                          className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${categoryImageStyle === "square" ? "border-primary bg-primary/5 shadow-sm" : "border-border/60 hover:border-border bg-white"}`}
                        >
                          <div className="w-10 h-10 bg-muted rounded-md border-2 border-border/40" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Square</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setCategoryImageStyle("rounded")}
                          className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${categoryImageStyle === "rounded" ? "border-primary bg-primary/5 shadow-sm" : "border-border/60 hover:border-border bg-white"}`}
                        >
                          <div className="w-10 h-10 bg-muted rounded-full border-2 border-border/40" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Rounded</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "domain" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl bg-white p-8 rounded-3xl border border-border/60 shadow-sm">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-sm">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-foreground tracking-tight">Store URL & Domain</h2>
                    <p className="text-xs text-muted-foreground font-medium">Control the public address of your online store.</p>
                  </div>
                </div>
                
                <div className="pt-4 group">
                  <label htmlFor="store-slug" className="flex items-center gap-2 text-xs font-black text-foreground mb-4 uppercase tracking-widest opacity-80">
                    <Hash className="w-4 h-4 text-emerald-600" />
                    Public Name (Slug) <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <input 
                      id="store-slug"
                      type="text" 
                      required 
                      value={slug} 
                      onChange={(e) => handleSlugChange(e.target.value)} 
                      placeholder="my-store"
                      className="w-full rounded-2xl border-2 border-border/80 bg-white px-6 py-5 text-xl font-black text-foreground focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none shadow-sm" 
                    />
                    <div className="mt-4 px-4 py-3 rounded-xl bg-emerald-50/50 border border-emerald-100 inline-flex items-center gap-2">
                       <span className="text-xs font-black uppercase text-emerald-700 tracking-widest">Public Link:</span>
                       <span className="text-sm font-bold text-emerald-600">catalogger.com/store/{slug || '...'}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex gap-3 shadow-inner">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <p className="text-[11px] text-amber-800 font-medium leading-relaxed uppercase tracking-tighter">
                    Changing your slug will immediately break any old links shared on social media or with customers.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl bg-white p-8 rounded-3xl border border-border/60 shadow-sm">
               <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shadow-sm">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-foreground tracking-tight">Security & Password</h2>
                    <p className="text-xs text-muted-foreground font-medium">Keep your dashboard account safe and secure.</p>
                  </div>
                </div>
                
                <div className="pt-6">
                   <PasswordChangeForm />
                </div>
              </div>
            </div>
          )}

          {activeTab !== "security" && (
            <div className="pt-10 flex justify-end sticky bottom-6 z-10">
              <button 
                type="submit" 
                disabled={loading || !hasChanges || uploading}
                className="flex items-center gap-2.5 px-12 py-5 rounded-2xl bg-primary font-black text-sm text-primary-foreground uppercase tracking-widest shadow-2xl shadow-primary/40 hover:bg-primary/95 hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-30 disabled:hover:scale-100 disabled:cursor-not-allowed group"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin text-white text-white" /> : <Save className="w-5 h-5 group-hover:rotate-12 transition-transform" />}
                {loading ? "Updating Store..." : "Save All Changes"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
