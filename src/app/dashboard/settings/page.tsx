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
      storeTitle: true,
      showCategoryImages: true,
      categoryImageStyle: true,
      themeColor: true,
      headerCode: true,
      footerCode: true
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
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-sm">
            <Settings className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-foreground tracking-tight">Store Management</h1>
            <p className="text-[13px] font-medium text-muted-foreground">Customize your branding, domains, and global settings.</p>
          </div>
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
          footerCode: store.footerCode
        }} 
      />
    </div>
  );
}
