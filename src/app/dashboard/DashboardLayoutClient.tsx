"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import LogoutButton from "@/components/LogoutButton";
import SidebarContent from "./SidebarContent";

export default function DashboardLayoutClient({
  children,
  store,
  session
}: {
  children: React.ReactNode;
  store: any;
  session: any;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isMobileMenuOpen]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 z-30">
        <SidebarContent
          store={store}
          userName={session.user?.name || ""}
          userEmail={session.user?.email || ""}
          logoUrl={store?.logoUrl}
        />
      </aside>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 w-64 z-50 lg:hidden transform transition-transform duration-200 ease-out",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {isMobileMenuOpen && (
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-4 -right-11 flex h-9 w-9 items-center justify-center rounded-lg bg-card border border-border shadow-sm"
          >
            <X className="h-4 w-4 text-foreground" />
          </button>
        )}
        <SidebarContent
          store={store}
          userName={session.user?.name || ""}
          userEmail={session.user?.email || ""}
          logoUrl={store?.logoUrl}
          closeMobileMenu={() => setIsMobileMenuOpen(false)}
        />
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">

        {/* Top Header */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card/80 backdrop-blur-md px-4 md:px-6 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4" />
            </button>
            <h2 className="text-[14px] font-semibold text-foreground tracking-tight">Dashboard</h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Reserved for future header actions */}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto scroll-smooth">
          <div className="mx-auto max-w-5xl w-full p-5 md:p-8 pb-16">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
