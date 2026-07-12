"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Store,
  Link as LinkIcon,
  MessageSquare,
  Save,
  Loader2,
  Hash,
  Palette,
  Globe,
  Shield,
  Layout,
  Code,
  AlertTriangle,
  Search,
  Share2,
  Eye,
  Type,
} from "lucide-react";
import { updateStoreSettings } from "@/lib/actions/seller.actions";
import PasswordChangeForm from "./PasswordChangeForm";
import { ImageUploadField } from "./ImageUploadField";
import { StoreSettingsPreview } from "@/components/dashboard/StoreSettingsPreview";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { StoreSettings, StoreSocialLinks } from "@/types/store-settings";
import { DEFAULT_ACCENT_COLOR, EMPTY_SOCIAL_LINKS } from "@/types/store-settings";

interface StoreSettingsFormProps {
  initialData: StoreSettings;
}

const TABS = [
  { id: "brand", label: "Brand", icon: Store },
  { id: "theme", label: "Theme", icon: Palette },
  { id: "seo", label: "SEO & Social", icon: Search },
  { id: "domain", label: "Domain", icon: Globe },
  { id: "preview", label: "Preview", icon: Eye },
  { id: "security", label: "Security", icon: Shield },
] as const;

type TabId = (typeof TABS)[number]["id"];

const fieldLabel =
  "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5";
const sectionHeading =
  "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground pb-3 border-b border-border mb-5";

function ColorPicker({
  label,
  value,
  onChange,
  presets,
}: {
  label: string;
  value: string;
  onChange: (color: string) => void;
  presets: string[];
}) {
  return (
    <div className="space-y-2">
      <Label className={fieldLabel}>
        <Palette className="h-3.5 w-3.5 text-primary" />
        {label}
      </Label>
      <div className="flex items-start gap-4">
        <div className="relative h-14 w-14 rounded-xl border-2 border-border overflow-hidden shrink-0">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 h-[200%] w-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
          />
        </div>
        <div className="space-y-2 flex-1">
          <Input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="max-w-[120px] font-mono text-[12px]"
          />
          <div className="flex flex-wrap gap-2">
            {presets.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => onChange(c)}
                className={cn(
                  "h-5 w-5 rounded-md border-2 transition-all",
                  value === c ? "ring-2 ring-primary/50 scale-110 border-transparent" : "border-border/50"
                )}
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StoreSettingsForm({ initialData }: StoreSettingsFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("brand");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: initialData.name,
    slug: initialData.slug,
    whatsappNumber: initialData.whatsappNumber || "",
    logoUrl: initialData.logoUrl || "",
    bannerUrl: initialData.bannerUrl || "",
    description: initialData.description || "",
    storeTitle: initialData.storeTitle || "",
    seoDescription: initialData.seoDescription || "",
    seoKeywords: initialData.seoKeywords || "",
    themeColor: initialData.themeColor || "#E11D48",
    accentColor: initialData.accentColor || DEFAULT_ACCENT_COLOR,
    showCategoryImages: initialData.showCategoryImages ?? false,
    categoryImageStyle: initialData.categoryImageStyle ?? "square",
    headerCode: initialData.headerCode || "",
    footerCode: initialData.footerCode || "",
    productsPerRow: initialData.productsPerRow ?? 4,
    fontFamily: initialData.fontFamily || "Inter",
    fontSize: initialData.fontSize || "medium",
    fontWeight: initialData.fontWeight || "semibold",
    cardRadius: initialData.cardRadius || "lg",
    socialLinks: { ...EMPTY_SOCIAL_LINKS, ...initialData.socialLinks },
  });

  const hasChanges = useMemo(() => {
    return JSON.stringify(form) !== JSON.stringify({
      name: initialData.name,
      slug: initialData.slug,
      whatsappNumber: initialData.whatsappNumber || "",
      logoUrl: initialData.logoUrl || "",
      bannerUrl: initialData.bannerUrl || "",
      description: initialData.description || "",
      storeTitle: initialData.storeTitle || "",
      seoDescription: initialData.seoDescription || "",
      seoKeywords: initialData.seoKeywords || "",
      themeColor: initialData.themeColor || "#E11D48",
      accentColor: initialData.accentColor || DEFAULT_ACCENT_COLOR,
      showCategoryImages: initialData.showCategoryImages ?? false,
      categoryImageStyle: initialData.categoryImageStyle ?? "square",
      headerCode: initialData.headerCode || "",
      footerCode: initialData.footerCode || "",
      productsPerRow: initialData.productsPerRow ?? 4,
      fontFamily: initialData.fontFamily || "Inter",
      fontSize: initialData.fontSize || "medium",
      fontWeight: initialData.fontWeight || "semibold",
      cardRadius: initialData.cardRadius || "lg",
      socialLinks: { ...EMPTY_SOCIAL_LINKS, ...initialData.socialLinks },
    });
  }, [form, initialData]);

  const updateField = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateSocial = (key: keyof StoreSocialLinks, value: string) => {
    setForm((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [key]: value || null },
    }));
  };

  const handleSlugChange = (value: string) => {
    updateField(
      "slug",
      value.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-")
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasChanges) return;

    setLoading(true);
    try {
      const result = await updateStoreSettings(form);
      if (result.error) throw new Error(result.error);
      toast.success("Settings saved!");
      router.refresh();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  const previewData = {
    name: form.name,
    slug: form.slug,
    logoUrl: form.logoUrl,
    bannerUrl: form.bannerUrl,
    description: form.description,
    storeTitle: form.storeTitle,
    seoDescription: form.seoDescription,
    themeColor: form.themeColor,
    accentColor: form.accentColor,
    fontFamily: form.fontFamily,
    socialLinks: form.socialLinks,
  };

  const colorPresets = ["#E11D48", "#2563EB", "#059669", "#7C3AED", "#EA580C", "#25D366", "#000000"];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">
      <div className="space-y-6 min-w-0">
        <div className="flex items-center gap-1 p-1 bg-secondary/40 rounded-xl border border-border/60 w-full overflow-x-auto scrollbar-none">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium rounded-lg transition-all whitespace-nowrap",
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

        {activeTab === "security" ? (
          <div className="animate-in fade-in slide-in-from-bottom-3 duration-300 max-w-xl space-y-6">
            <div className="rounded-xl border border-border bg-card shadow-sm p-5 space-y-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning-bg border border-warning-border">
                  <Shield className="h-4 w-4 text-warning" />
                </div>
                <div>
                  <h2 className="text-[15px] font-semibold">Password</h2>
                  <p className="text-[12px] text-muted-foreground">Update your dashboard password.</p>
                </div>
              </div>
              <PasswordChangeForm />
            </div>
          </div>
        ) : activeTab === "preview" ? (
          <div className="animate-in fade-in duration-300 xl:hidden">
            <StoreSettingsPreview data={previewData} />
          </div>
        ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {activeTab === "brand" && (
            <div className="animate-in fade-in slide-in-from-bottom-3 duration-300 space-y-6">
              <div className="rounded-xl border border-border bg-card shadow-sm p-5 space-y-5">
                <p className={sectionHeading}>Business Info</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="store-name" className={fieldLabel}>
                      <Store className="h-3.5 w-3.5 text-primary" />
                      Business Name *
                    </Label>
                    <Input
                      id="store-name"
                      required
                      value={form.name}
                      onChange={(e) => updateField("name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="whatsapp" className={fieldLabel}>
                      <MessageSquare className="h-3.5 w-3.5 text-[#25D366]" />
                      WhatsApp Number *
                    </Label>
                    <Input
                      id="whatsapp"
                      type="tel"
                      required
                      value={form.whatsappNumber}
                      onChange={(e) => updateField("whatsappNumber", e.target.value)}
                      placeholder="919876543210"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="description" className={fieldLabel}>
                    <Type className="h-3.5 w-3.5 text-primary" />
                    Store Description
                  </Label>
                  <textarea
                    id="description"
                    rows={4}
                    maxLength={1000}
                    value={form.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    placeholder="Tell customers what your store is about..."
                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <p className="text-[11px] text-muted-foreground text-right">
                    {form.description.length}/1000
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card shadow-sm p-5 space-y-5">
                <p className={sectionHeading}>Brand Assets</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ImageUploadField
                    label="Store Logo"
                    value={form.logoUrl}
                    onChange={(url) => updateField("logoUrl", url)}
                    hint="Square image, shown in header and browser tab."
                  />
                  <ImageUploadField
                    label="Store Banner"
                    value={form.bannerUrl}
                    onChange={(url) => updateField("bannerUrl", url)}
                    aspect="banner"
                    hint="Wide image displayed at the top of your store."
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "theme" && (
            <div className="animate-in fade-in slide-in-from-bottom-3 duration-300 space-y-6">
              <div className="rounded-xl border border-border bg-card shadow-sm p-5 space-y-6">
                <p className={sectionHeading}>Colors</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ColorPicker
                    label="Primary Color"
                    value={form.themeColor}
                    onChange={(c) => updateField("themeColor", c)}
                    presets={colorPresets}
                  />
                  <ColorPicker
                    label="Accent Color"
                    value={form.accentColor}
                    onChange={(c) => updateField("accentColor", c)}
                    presets={["#F43F5E", "#3B82F6", "#10B981", "#8B5CF6", "#F97316", "#F59E0B", "#64748B"]}
                  />
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card shadow-sm p-5 space-y-5">
                <p className={sectionHeading}>Gallery</p>
                <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/20 p-4">
                  <div>
                    <p className="text-[13px] font-medium">Show Category Images</p>
                    <p className="text-[11px] text-muted-foreground">Visual icons on category chips.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateField("showCategoryImages", !form.showCategoryImages)}
                    className={cn(
                      "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
                      form.showCategoryImages ? "bg-primary" : "bg-muted"
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform",
                        form.showCategoryImages ? "translate-x-4" : "translate-x-0.5"
                      )}
                    />
                  </button>
                </div>
                {form.showCategoryImages && (
                  <div className="flex gap-3">
                    {(["square", "rounded"] as const).map((style) => (
                      <button
                        key={style}
                        type="button"
                        onClick={() => updateField("categoryImageStyle", style)}
                        className={cn(
                          "flex-1 p-4 rounded-xl border-2 transition-all capitalize text-[11px] font-semibold",
                          form.categoryImageStyle === style
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border text-muted-foreground"
                        )}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                )}
                <div className="space-y-2">
                  <p className="text-[13px] font-medium">
                    Products per row: <span className="text-primary font-bold">{form.productsPerRow}</span>
                  </p>
                  <input
                    type="range"
                    min={2}
                    max={8}
                    value={form.productsPerRow}
                    onChange={(e) => updateField("productsPerRow", parseInt(e.target.value, 10))}
                    className="w-full accent-primary"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card shadow-sm p-5 space-y-5">
                <p className={sectionHeading}>Typography & Cards</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className={fieldLabel}>Font Family</Label>
                    <select
                      value={form.fontFamily}
                      onChange={(e) => updateField("fontFamily", e.target.value)}
                      className="h-9 w-full rounded-lg border border-input bg-card px-3 text-[13px]"
                    >
                      {["Inter", "Outfit", "Playfair Display", "Plus Jakarta Sans", "Lora", "Montserrat", "Caveat"].map(
                        (f) => (
                          <option key={f} value={f}>{f}</option>
                        )
                      )}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className={fieldLabel}>Font Weight</Label>
                    <select
                      value={form.fontWeight}
                      onChange={(e) => updateField("fontWeight", e.target.value)}
                      className="h-9 w-full rounded-lg border border-input bg-card px-3 text-[13px]"
                    >
                      <option value="normal">Normal</option>
                      <option value="medium">Medium</option>
                      <option value="semibold">Semibold</option>
                      <option value="bold">Bold</option>
                      <option value="black">Heavy</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className={fieldLabel}>Font Size</Label>
                    <div className="flex gap-2">
                      {(["small", "medium", "large"] as const).map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => updateField("fontSize", size)}
                          className={cn(
                            "flex-1 py-2 text-[11px] font-semibold uppercase rounded-lg border-2",
                            form.fontSize === size
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border text-muted-foreground"
                          )}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className={fieldLabel}>Card Corners</Label>
                    <div className="flex flex-wrap gap-1.5">
                      {["none", "sm", "md", "lg", "xl", "full"].map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => updateField("cardRadius", r)}
                          className={cn(
                            "px-2.5 py-1 text-[10px] font-semibold uppercase rounded-lg border-2",
                            form.cardRadius === r
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border text-muted-foreground"
                          )}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card shadow-sm p-5 space-y-4">
                <p className={sectionHeading}>Custom Code</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className={fieldLabel}><Code className="h-3.5 w-3.5" />Header Code</Label>
                    <textarea
                      value={form.headerCode}
                      onChange={(e) => updateField("headerCode", e.target.value)}
                      rows={4}
                      className="w-full rounded-lg border border-input bg-secondary/20 px-3 py-2 text-[12px] font-mono resize-none"
                      placeholder="Analytics scripts..."
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className={fieldLabel}><Code className="h-3.5 w-3.5" />Footer Code</Label>
                    <textarea
                      value={form.footerCode}
                      onChange={(e) => updateField("footerCode", e.target.value)}
                      rows={4}
                      className="w-full rounded-lg border border-input bg-secondary/20 px-3 py-2 text-[12px] font-mono resize-none"
                      placeholder="Chat widgets..."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "seo" && (
            <div className="animate-in fade-in slide-in-from-bottom-3 duration-300 space-y-6">
              <div className="rounded-xl border border-border bg-card shadow-sm p-5 space-y-5">
                <p className={sectionHeading}>Search Engine Optimization</p>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="store-title" className={fieldLabel}>
                      <LinkIcon className="h-3.5 w-3.5" />
                      SEO Title
                    </Label>
                    <Input
                      id="store-title"
                      maxLength={70}
                      value={form.storeTitle}
                      onChange={(e) => updateField("storeTitle", e.target.value)}
                      placeholder={`${form.name} | Online Store`}
                    />
                    <p className="text-[11px] text-muted-foreground text-right">{form.storeTitle.length}/70</p>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="seo-desc" className={fieldLabel}>Meta Description</Label>
                    <textarea
                      id="seo-desc"
                      rows={3}
                      maxLength={160}
                      value={form.seoDescription}
                      onChange={(e) => updateField("seoDescription", e.target.value)}
                      placeholder="A short description for search engines..."
                      className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm resize-none"
                    />
                    <p className="text-[11px] text-muted-foreground text-right">{form.seoDescription.length}/160</p>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="seo-keywords" className={fieldLabel}>Keywords</Label>
                    <Input
                      id="seo-keywords"
                      maxLength={200}
                      value={form.seoKeywords}
                      onChange={(e) => updateField("seoKeywords", e.target.value)}
                      placeholder="handmade, crafts, gifts"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card shadow-sm p-5 space-y-5">
                <p className={sectionHeading}>
                  <Share2 className="h-3.5 w-3.5 inline mr-1.5" />
                  Social Links
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(
                    [
                      ["instagram", "Instagram"],
                      ["facebook", "Facebook"],
                      ["twitter", "X / Twitter"],
                      ["youtube", "YouTube"],
                      ["tiktok", "TikTok"],
                      ["website", "Website"],
                    ] as const
                  ).map(([key, label]) => (
                    <div key={key} className="space-y-1.5">
                      <Label className={fieldLabel}>{label}</Label>
                      <Input
                        type="url"
                        value={form.socialLinks[key] || ""}
                        onChange={(e) => updateSocial(key, e.target.value)}
                        placeholder={`https://${key === "website" ? "yoursite.com" : key + ".com/you"}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "domain" && (
            <div className="animate-in fade-in slide-in-from-bottom-3 duration-300 max-w-xl">
              <div className="rounded-xl border border-border bg-card shadow-sm p-5 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success-bg border border-success-border">
                    <Globe className="h-4 w-4 text-success" />
                  </div>
                  <div>
                    <h2 className="text-[15px] font-semibold">Store URL</h2>
                    <p className="text-[12px] text-muted-foreground">Your public store address.</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="store-slug" className={fieldLabel}>
                    <Hash className="h-3.5 w-3.5" />
                    Slug *
                  </Label>
                  <Input
                    id="store-slug"
                    required
                    value={form.slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    className="font-mono"
                  />
                  <p className="text-[12px] text-success font-medium mt-2">
                    catalogger.com/store/{form.slug || "..."}
                  </p>
                </div>
                <Alert variant="warning" icon={<AlertTriangle className="h-4 w-4" />}>
                  <AlertDescription>
                    Changing your slug breaks previously shared links.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          )}

          <div className="flex justify-end sticky bottom-5 z-10">
            <Button type="submit" disabled={loading || !hasChanges} className="shadow-lg">
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" />Saving…</>
              ) : (
                <><Save className="h-4 w-4" />Save Changes</>
              )}
            </Button>
          </div>
        </form>
        )}
      </div>

      {/* Sticky preview sidebar (desktop) */}
      <div className="hidden xl:block">
        <div className="sticky top-6">
          <StoreSettingsPreview data={previewData} />
        </div>
      </div>
    </div>
  );
}
