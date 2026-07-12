import { getStoreSettings } from "@/lib/actions/seller.actions";
import StoreSettingsForm from "./StoreSettingsForm";
import { Settings } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default async function SettingsPage() {
  let store;

  try {
    store = await getStoreSettings();
  } catch {
    store = null;
  }

  if (!store) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Alert variant="destructive" className="max-w-sm">
          <AlertTitle>Store not found</AlertTitle>
          <AlertDescription>
            No store is associated with your account.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-7 max-w-6xl mx-auto pb-20">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/8 border border-primary/15">
          <Settings className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground tracking-tight">Store Settings</h1>
          <p className="text-[13px] text-muted-foreground">
            Branding, theme, SEO, social links, and storefront preview.
          </p>
        </div>
      </div>

      <StoreSettingsForm initialData={store} />
    </div>
  );
}
