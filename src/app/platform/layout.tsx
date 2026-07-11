import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ShieldCheck, LogOut, Users, Settings, LayoutDashboard, Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default async function PlatformLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "SUPER_ADMIN") {
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
      {/* Desktop Sidebar */}
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
          <Link href="/api/auth/signout" className="flex items-center justify-start w-full px-4 py-2 text-sm font-medium rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors">
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col">
        {/* Mobile Header */}
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

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
