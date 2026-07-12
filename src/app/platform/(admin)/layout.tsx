import { getAppSession } from "@/lib/auth/app-session";
import { canAccessPlatformAdmin } from "@/lib/auth/roles";
import { redirect } from "next/navigation";
import { ShieldCheck, Users, Settings, LayoutDashboard, Menu, Store } from "lucide-react";
import Link from "next/link";
import PlatformSignOutButton from "@/components/PlatformSignOutButton";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import type { Metadata } from "next";
import { privateRouteMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  title: "Platform Admin",
  ...privateRouteMetadata,
};

export default async function PlatformAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAppSession();

  if (!session || !canAccessPlatformAdmin(session.user.role)) {
    redirect("/platform/login");
  }

  const NavLinks = () => (
    <>
      <Link
        href="/platform/dashboard"
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-400 transition-colors hover:text-zinc-50"
      >
        <LayoutDashboard className="h-4 w-4" />
        Dashboard
      </Link>
      <Link
        href="/platform/sellers"
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-400 transition-colors hover:text-zinc-50"
      >
        <Users className="h-4 w-4" />
        Sellers
      </Link>
      <Link
        href="/dashboard"
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-400 transition-colors hover:text-zinc-50"
      >
        <Store className="h-4 w-4" />
        My Store
      </Link>
      <Link
        href="/platform/settings"
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-400 transition-colors hover:text-zinc-50"
      >
        <Settings className="h-4 w-4" />
        Settings
      </Link>
    </>
  );

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <aside className="hidden w-64 flex-col border-r bg-zinc-950 md:flex">
        <div className="flex h-14 items-center gap-2 border-b border-zinc-800 px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800">
            <ShieldCheck className="h-5 w-5 text-zinc-100" />
          </div>
          <span className="font-semibold tracking-tight text-zinc-100">Platform Admin</span>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          <NavLinks />
        </nav>
        <div className="border-t border-zinc-800 p-4">
          <div className="mb-4 truncate px-2 text-sm text-zinc-400">
            {session.user.email}
          </div>
          <PlatformSignOutButton />
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b bg-white px-4 md:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-zinc-900" />
            <span className="font-semibold text-zinc-900">Admin</span>
          </div>
          <Sheet>
            <SheetTrigger className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-zinc-100">
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-zinc-950 p-0">
              <div className="flex h-14 items-center gap-2 border-b border-zinc-800 px-6">
                <ShieldCheck className="h-5 w-5 text-zinc-100" />
                <span className="font-semibold text-zinc-100">Platform Admin</span>
              </div>
              <nav className="space-y-1 p-4">
                <NavLinks />
              </nav>
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex-1 p-4 md:p-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
