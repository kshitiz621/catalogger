import { getStoreSettings } from "@/lib/actions/seller.actions";
import StoreSettingsForm from "./StoreSettingsForm";
import { Settings, AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default async function SettingsPage() {
  const store = await getStoreSettings();

  if (!store) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Alert variant="destructive" className="max-w-sm">
          <AlertTitle>Store not found</AlertTitle>
          <AlertDescription>
            No store is associated with your account. Please contact support or create a new store.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-7 max-w-4xl mx-auto pb-20">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/8 border border-primary/15">
          <Settings className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground tracking-tight">Store Settings</h1>
          <p className="text-[13px] text-muted-foreground">
            Customize your branding, domain, and store configuration.
          </p>
        </div>
      </div>

      <StoreSettingsForm
        initialData={{
          name: store.name,
          slug: store.slug,
          whatsappNumber: store.whatsappNumber,
          logoUrl: store.logoUrl,
          storeTitle: store.storeTitle,
          showCategoryImages: store.showCategoryImages,
          categoryImageStyle: store.categoryImageStyle,
          themeColor: store.themeColor || "#E11D48",
          headerCode: store.headerCode,
          footerCode: store.footerCode,
          productsPerRow: store.productsPerRow,
          fontFamily: store.fontFamily,
          fontSize: store.fontSize,
          fontWeight: store.fontWeight,
          cardRadius: store.cardRadius,
        }}
      />
    </div>
  );
}
