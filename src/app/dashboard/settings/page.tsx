import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import StoreSettingsForm from "./StoreSettingsForm";
import PasswordChangeForm from "./PasswordChangeForm";
import { Settings, Store, Shield, AlertCircle } from "lucide-react";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    redirect("/login");
  }

  const store = await prisma.store.findFirst({
    where: { userId: session.user.id },
    select: { 
      id: true, 
      name: true, 
      slug: true, 
      whatsappNumber: true,
      logoUrl: true,
      showCategoryImages: true,
      categoryImageStyle: true
    }
  });

  if (!store) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center mb-4">
          <AlertCircle className="w-7 h-7 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Store Not Found</h3>
        <p className="mt-1 text-sm text-muted-foreground max-w-sm">
          No store is associated with your account. Please contact support or create a new store.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Settings className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Settings</h1>
            <p className="text-sm text-muted-foreground">Manage your store and account preferences.</p>
          </div>
        </div>
      </div>

      {/* Store Settings Card */}
      <section
        id="store-settings-section"
        className="bg-white rounded-2xl border border-border/60 shadow-sm hover:shadow-md transition-shadow duration-300"
      >
        <div className="px-6 py-5 border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Store className="w-[18px] h-[18px] text-primary" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">Store Settings</h2>
              <p className="text-sm text-muted-foreground">Update your store name, public URL, and WhatsApp contact.</p>
            </div>
          </div>
        </div>
        <div className="px-6 py-6">
          <StoreSettingsForm 
            initialData={{
              name: store.name,
              slug: store.slug,
              whatsappNumber: store.whatsappNumber,
              logoUrl: store.logoUrl,
              showCategoryImages: store.showCategoryImages,
              categoryImageStyle: store.categoryImageStyle
            }} 
          />
        </div>
      </section>

      {/* Security Card */}
      <section
        id="security-settings-section"
        className="bg-white rounded-2xl border border-border/60 shadow-sm hover:shadow-md transition-shadow duration-300"
      >
        <div className="px-6 py-5 border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Shield className="w-[18px] h-[18px] text-amber-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">Security</h2>
              <p className="text-sm text-muted-foreground">Change your account password to keep your account secure.</p>
            </div>
          </div>
        </div>
        <div className="px-6 py-6">
          <PasswordChangeForm />
        </div>
      </section>
    </div>
  );
}
