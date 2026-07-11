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
  Hash,
  Upload,
  X,
  Image as ImageIcon,
  Palette,
  Globe,
  Shield,
  Layout,
  Code,
  AlertTriangle,
} from "lucide-react";
import { updateStoreSettings } from "@/lib/actions/seller.actions";
import { uploadImage } from "@/lib/upload-utils";
import PasswordChangeForm from "./PasswordChangeForm";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
    productsPerRow?: number;
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: string;
    cardRadius?: string;
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
  const [productsPerRow, setProductsPerRow] = useState(initialData.productsPerRow ?? 4);
  const [fontFamily, setFontFamily] = useState(initialData.fontFamily || "Inter");
  const [fontSize, setFontSize] = useState(initialData.fontSize || "medium");
  const [fontWeight, setFontWeight] = useState(initialData.fontWeight || "semibold");
  const [cardRadius, setCardRadius] = useState(initialData.cardRadius || "lg");

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
    footerCode !== (initialData.footerCode || "") ||
    productsPerRow !== (initialData.productsPerRow ?? 4) ||
    fontFamily !== (initialData.fontFamily || "Inter") ||
    fontSize !== (initialData.fontSize || "medium") ||
    fontWeight !== (initialData.fontWeight || "semibold") ||
    cardRadius !== (initialData.cardRadius || "lg");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const toastId = toast.loading("Uploading logo...");
    try {
      const cloudUrl = await uploadImage(file);
      setLogoUrl(cloudUrl);
      toast.success("Logo uploaded!", { id: toastId });
    } catch (err: any) {
      toast.error(err.message || "Upload failed", { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  const handleSlugChange = (value: string) => {
    setSlug(value.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-"));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasChanges) return;
    setLoading(true);
    try {
      const result = await updateStoreSettings({
        name, slug, whatsappNumber, logoUrl, storeTitle,
        showCategoryImages, categoryImageStyle, themeColor,
        headerCode, footerCode, productsPerRow,
        fontFamily, fontSize, fontWeight, cardRadius,
      });
      if (result.error) throw new Error(result.error);
      toast.success("Settings saved!");
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

  // Shared field label style
  const fieldLabel = "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5";
  // Shared section heading style
  const sectionHeading = "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground pb-3 border-b border-border mb-5";

  return (
    <div className="space-y-6">
      {/* Tab switcher */}
      <div className="flex items-center gap-1 p-1 bg-secondary/40 rounded-xl border border-border/60 w-full overflow-x-auto scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium rounded-lg transition-all whitespace-nowrap",
              activeTab === tab.id
                ? "bg-card text-foreground shadow-sm border border-border/60"
                : "text-muted-foreground hover:text-foreground hover:bg-card/50"
            )}
          >
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* GENERAL TAB */}
        {activeTab === "general" && (
          <div className="animate-in fade-in slide-in-from-bottom-3 duration-300 space-y-6">
            <div className="rounded-xl border border-border bg-card shadow-sm p-5 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Store Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="store-name" className={fieldLabel}>
                    <Store className="h-3.5 w-3.5 text-primary" />
                    Business Name <span className="text-destructive normal-case tracking-normal font-medium">*</span>
                  </Label>
                  <Input
                    id="store-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your incredible store name"
                  />
                </div>

                {/* WhatsApp */}
                <div className="space-y-1.5">
                  <Label htmlFor="whatsapp" className={fieldLabel}>
                    <MessageSquare className="h-3.5 w-3.5 text-[#25D366]" />
                    WhatsApp Number <span className="text-destructive normal-case tracking-normal font-medium">*</span>
                  </Label>
                  <Input
                    id="whatsapp"
                    type="tel"
                    required
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="e.g. 919876543210"
                  />
                </div>
              </div>

              {/* Store Title */}
              <div className="space-y-1.5">
                <Label htmlFor="store-title" className={fieldLabel}>
                  <LinkIcon className="h-3.5 w-3.5 text-primary" />
                  SEO Page Title
                </Label>
                <Input
                  id="store-title"
                  type="text"
                  value={storeTitle}
                  onChange={(e) => setStoreTitle(e.target.value)}
                  placeholder="e.g. Best Handmade Crafts | Shop Name"
                />
                <p className="text-[11px] text-muted-foreground">
                  Appears in browser tabs and search results.
                </p>
              </div>
            </div>

            {/* Code injection */}
            <div className="rounded-xl border border-border bg-card shadow-sm p-5 space-y-5">
              <p className={sectionHeading}>Analytics & Custom Code</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="header-code" className={fieldLabel}>
                    <Code className="h-3.5 w-3.5 text-info" />
                    Header Code
                  </Label>
                  <textarea
                    id="header-code"
                    value={headerCode}
                    onChange={(e) => setHeaderCode(e.target.value)}
                    placeholder="<!-- Google Analytics or Pixel scripts -->"
                    className="w-full rounded-lg border border-input bg-secondary/20 px-3 py-2.5 text-[12px] font-mono text-foreground focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring/30 transition-all resize-none min-h-[100px]"
                  />
                  <p className="text-[11px] text-muted-foreground">Injected in the &lt;head&gt; tag.</p>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="footer-code" className={fieldLabel}>
                    <Code className="h-3.5 w-3.5 text-destructive" />
                    Footer Code
                  </Label>
                  <textarea
                    id="footer-code"
                    value={footerCode}
                    onChange={(e) => setFooterCode(e.target.value)}
                    placeholder="<!-- Chat widgets or tracking pixels -->"
                    className="w-full rounded-lg border border-input bg-secondary/20 px-3 py-2.5 text-[12px] font-mono text-foreground focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring/30 transition-all resize-none min-h-[100px]"
                  />
                  <p className="text-[11px] text-muted-foreground">Injected before &lt;/body&gt;.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CUSTOMIZE TAB */}
        {activeTab === "customize" && (
          <div className="animate-in fade-in slide-in-from-bottom-3 duration-300 space-y-6">
            {/* Logo + Theme */}
            <div className="rounded-xl border border-border bg-card shadow-sm p-5">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Logo upload */}
                <div className="space-y-3">
                  <Label className={fieldLabel}>
                    <ImageIcon className="h-3.5 w-3.5 text-primary" />
                    Store Logo
                  </Label>
                  <div className="group relative aspect-square w-full max-w-[160px] rounded-xl border-2 border-dashed border-border bg-secondary/20 flex flex-col items-center justify-center overflow-hidden hover:border-primary/40 transition-all cursor-pointer">
                    {logoUrl ? (
                      <>
                        <img src={logoUrl} alt="Logo" className="h-full w-full object-cover rounded-xl" />
                        <div
                          className="absolute inset-0 bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="h-5 w-5 text-white" />
                          <span className="text-[10px] font-semibold text-white">Change</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setLogoUrl("")}
                          className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white hover:scale-110 transition-transform"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </>
                    ) : (
                      <div
                        className="flex flex-col items-center justify-center text-center h-full w-full p-3"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                          Click to upload
                        </p>
                      </div>
                    )}
                    {uploading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    )}
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                </div>

                {/* Theme color */}
                <div className="lg:col-span-2 space-y-3">
                  <Label className={fieldLabel}>
                    <Palette className="h-3.5 w-3.5 text-primary" />
                    Theme Brand Color
                  </Label>
                  <div className="flex items-start gap-4">
                    <div className="relative h-16 w-16 rounded-xl border-2 border-border overflow-hidden shadow-sm shrink-0">
                      <input
                        type="color"
                        value={themeColor}
                        onChange={(e) => setThemeColor(e.target.value)}
                        className="absolute inset-0 h-[200%] w-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
                      />
                    </div>
                    <div className="space-y-2 flex-1">
                      <Input
                        type="text"
                        value={themeColor}
                        onChange={(e) => setThemeColor(e.target.value)}
                        className="max-w-[110px] font-mono text-[12px]"
                      />
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        Used for buttons, links, and accents in your public store.
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        {["#E11D48", "#2563EB", "#059669", "#7C3AED", "#EA580C", "#25D366", "#000000"].map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setThemeColor(c)}
                            title={c}
                            className={cn(
                              "h-5 w-5 rounded-md border-2 transition-all ring-offset-1",
                              themeColor === c
                                ? "ring-2 ring-primary/50 scale-110 border-transparent"
                                : "border-border/50 hover:scale-105"
                            )}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Gallery settings */}
            <div className="rounded-xl border border-border bg-card shadow-sm p-5 space-y-5">
              <p className={sectionHeading}>Gallery Settings</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/20 p-4">
                  <div className="space-y-0.5">
                    <p className="text-[13px] font-medium text-foreground">Show Category Images</p>
                    <p className="text-[11px] text-muted-foreground">Display visual icons for categories.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowCategoryImages(!showCategoryImages)}
                    className={cn(
                      "relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-1",
                      showCategoryImages ? "bg-primary" : "bg-muted"
                    )}
                  >
                    <span className={cn(
                      "inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform",
                      showCategoryImages ? "translate-x-4" : "translate-x-0.5"
                    )} />
                  </button>
                </div>

                {showCategoryImages && (
                  <div className="flex gap-3">
                    {(["square", "rounded"] as const).map((style) => (
                      <button
                        key={style}
                        type="button"
                        onClick={() => setCategoryImageStyle(style)}
                        className={cn(
                          "flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                          categoryImageStyle === style
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-border/80 bg-card"
                        )}
                      >
                        <div className={cn("h-9 w-9 bg-muted border-2 border-border/40", style === "rounded" ? "rounded-full" : "rounded-lg")} />
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {style === "square" ? "Square" : "Rounded"}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Product Grid */}
            <div className="rounded-xl border border-border bg-card shadow-sm p-5 space-y-5">
              <p className={sectionHeading}>Product Grid</p>
              <div className="max-w-md space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-medium text-foreground">
                    Products per row: <span className="font-bold text-primary">{productsPerRow}</span>
                  </p>
                  <span className="text-[11px] text-muted-foreground">2 – 8</span>
                </div>
                <input
                  id="products-per-row"
                  type="range" min="2" max="8" step="1"
                  value={productsPerRow}
                  onChange={(e) => setProductsPerRow(parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-secondary rounded-full appearance-none cursor-pointer accent-primary"
                />
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Number of product cards in a single row on desktop.
                </p>
              </div>
            </div>

            {/* Typography */}
            <div className="rounded-xl border border-border bg-card shadow-sm p-5 space-y-5">
              <p className={sectionHeading}>Typography & Card Style</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Font Family */}
                <div className="space-y-1.5">
                  <Label htmlFor="font-family" className={fieldLabel}>Font Family</Label>
                  <div className="relative">
                    <select
                      id="font-family"
                      value={fontFamily}
                      onChange={(e) => setFontFamily(e.target.value)}
                      className="h-9 w-full appearance-none rounded-lg border border-input bg-card px-3 pr-8 text-[13px] text-foreground focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring/30 transition-all cursor-pointer"
                    >
                      {["Inter", "Outfit", "Playfair Display", "Plus Jakarta Sans", "Lora", "Montserrat", "Caveat"].map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Font Weight */}
                <div className="space-y-1.5">
                  <Label htmlFor="font-weight" className={fieldLabel}>Product Name Weight</Label>
                  <div className="relative">
                    <select
                      id="font-weight"
                      value={fontWeight}
                      onChange={(e) => setFontWeight(e.target.value)}
                      className="h-9 w-full appearance-none rounded-lg border border-input bg-card px-3 pr-8 text-[13px] text-foreground focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring/30 transition-all cursor-pointer"
                    >
                      <option value="normal">Normal (400)</option>
                      <option value="medium">Medium (500)</option>
                      <option value="semibold">Semibold (600)</option>
                      <option value="bold">Bold (700)</option>
                      <option value="black">Heavy (900)</option>
                    </select>
                  </div>
                </div>

                {/* Font Size */}
                <div className="space-y-1.5">
                  <Label className={fieldLabel}>Product Name Size</Label>
                  <div className="flex gap-2">
                    {(["small", "medium", "large"] as const).map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setFontSize(size)}
                        className={cn(
                          "flex-1 py-2 text-[11px] font-semibold uppercase tracking-wider rounded-lg border-2 transition-all",
                          fontSize === size
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border text-muted-foreground hover:border-border/80 bg-card"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Card corners */}
                <div className="space-y-1.5">
                  <Label className={fieldLabel}>Card Corners</Label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: "none", label: "Square" },
                      { id: "sm", label: "Soft" },
                      { id: "md", label: "Medium" },
                      { id: "lg", label: "Rounded" },
                      { id: "xl", label: "Extra" },
                      { id: "full", label: "Full" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setCardRadius(opt.id)}
                        className={cn(
                          "px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider rounded-lg border-2 transition-all",
                          cardRadius === opt.id
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border text-muted-foreground hover:border-border/80 bg-card"
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DOMAIN TAB */}
        {activeTab === "domain" && (
          <div className="animate-in fade-in slide-in-from-bottom-3 duration-300 max-w-xl">
            <div className="rounded-xl border border-border bg-card shadow-sm p-5 space-y-5">
              {/* Section header */}
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-success-bg border border-success-border">
                  <Globe className="h-4 w-4 text-success" />
                </div>
                <div>
                  <h2 className="text-[15px] font-semibold text-foreground">Store URL & Domain</h2>
                  <p className="text-[12px] text-muted-foreground">Control the public address of your store.</p>
                </div>
              </div>

              {/* Slug input */}
              <div className="space-y-1.5">
                <Label htmlFor="store-slug" className={fieldLabel}>
                  <Hash className="h-3.5 w-3.5 text-success" />
                  Public Name (Slug) <span className="text-destructive normal-case tracking-normal font-medium">*</span>
                </Label>
                <Input
                  id="store-slug"
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="my-store"
                  className="font-mono"
                />
                <div className="flex items-center gap-1.5 mt-2 rounded-lg border border-success-border bg-success-bg px-3 py-2">
                  <span className="text-[11px] font-semibold text-success uppercase tracking-wider">Live URL:</span>
                  <span className="text-[12px] font-medium text-success">
                    catalogger.com/store/{slug || "..."}
                  </span>
                </div>
              </div>

              {/* Warning */}
              <Alert variant="warning" icon={<AlertTriangle className="h-4 w-4" />}>
                <AlertDescription>
                  Changing your slug will immediately break any links previously shared with customers.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        )}

        {/* SECURITY TAB */}
        {activeTab === "security" && (
          <div className="animate-in fade-in slide-in-from-bottom-3 duration-300 max-w-xl">
            <div className="rounded-xl border border-border bg-card shadow-sm p-5 space-y-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-warning-bg border border-warning-border">
                  <Shield className="h-4 w-4 text-warning" />
                </div>
                <div>
                  <h2 className="text-[15px] font-semibold text-foreground">Security & Password</h2>
                  <p className="text-[12px] text-muted-foreground">Keep your dashboard account secure.</p>
                </div>
              </div>
              <div className="pt-2">
                <PasswordChangeForm />
              </div>
            </div>
          </div>
        )}

        {/* Save button (not for security) */}
        {activeTab !== "security" && (
          <div className="flex justify-end sticky bottom-5 z-10">
            <Button
              type="submit"
              disabled={loading || !hasChanges || uploading}
              size="default"
              className="shadow-lg"
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" />Saving…</>
              ) : (
                <><Save className="h-4 w-4" />Save Changes</>
              )}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
