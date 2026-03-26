"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Package, 
  Tags, 
  Settings, 
  ExternalLink, 
  Store as StoreIcon, 
  Menu, 
  X,
  Plus
} from "lucide-react";
import LogoutButton from "@/components/LogoutButton";
import { cn } from "@/lib/utils";

interface SidebarProps {
  store: { name: string; slug: string } | null;
  userName: string;
  userEmail: string;
  closeMobileMenu?: () => void;
}

function SidebarContent({ store, userName, userEmail, closeMobileMenu }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { label: "Overview", href: "/dashboard", icon: Home },
    { label: "Products", href: "/dashboard/products", icon: Package, requireStore: true },
    { label: "Categories", href: "/dashboard/categories", icon: Tags, requireStore: true },
    { label: "Store Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="flex flex-col h-full bg-white border-r border-border shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
      <div className="flex h-16 items-center px-6 border-b border-border/60">
        <Link 
          href="/dashboard" 
          className="flex items-center gap-2 text-primary hover:opacity-90 transition-opacity"
          onClick={closeMobileMenu}
        >
          <div className="bg-primary/10 p-1.5 rounded-lg border border-primary/20">
            <StoreIcon className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">Catalogger</span>
        </Link>
      </div>
      
      <div className="flex-1 px-4 py-6 overflow-y-auto scrollbar-none">
        <div className="px-2 mb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
          Menu
        </div>
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            if (item.requireStore && !store) return null;
            const isActive = pathname === item.href;
            
            return (
              <Link 
                key={item.href}
                href={item.href} 
                onClick={closeMobileMenu}
                className={cn(
                  "group flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <item.icon className={cn(
                  "mr-3 h-[18px] w-[18px] transition-colors",
                  isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"
                )} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {store && (
          <div className="mt-10">
            <div className="px-2 mb-3 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
              Public Store
            </div>
            <a 
              href={`/store/${store.slug}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center rounded-xl px-4 py-3 text-sm font-semibold text-primary bg-primary/5 hover:bg-primary/10 border border-primary/10 hover:border-primary/20 transition-all shadow-sm"
            >
              <ExternalLink className="mr-3 h-[18px] w-[18px]" />
              View Live Store
            </a>
          </div>
        )}

        {!store && (
          <div className="mt-8 p-4 rounded-2xl bg-amber-50 border border-amber-100/50">
            <p className="text-xs text-amber-800 font-medium leading-relaxed">
              Finish setting up your store to start adding products.
            </p>
            <Link 
              href="/dashboard/settings" 
              onClick={closeMobileMenu}
              className="mt-3 flex items-center justify-center gap-1.5 w-full py-2 bg-amber-600 text-white rounded-lg text-xs font-bold hover:bg-amber-700 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Complete Setup
            </Link>
          </div>
        )}
      </div>
      
      {/* User Session Footer */}
      <div className="p-4 border-t border-border/60 bg-gray-50/50">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold shadow-sm flex-shrink-0">
            {userName.charAt(0) || userEmail.charAt(0) || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground truncate">{userName || "Store Owner"}</p>
            <p className="text-[11px] text-muted-foreground truncate">{userEmail}</p>
          </div>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}

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

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isMobileMenuOpen]);

  return (
    <div className="flex h-screen w-full bg-[#fafafa] overflow-hidden font-sans">
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-[280px] flex-shrink-0 z-30">
        <SidebarContent 
          store={store} 
          userName={session.user?.name || ""} 
          userEmail={session.user?.email || ""} 
        />
      </aside>

      {/* Mobile Sidebar (Overlay) */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-all duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      <aside className={cn(
        "fixed inset-y-0 left-0 w-[280px] z-50 lg:hidden transform transition-transform duration-300 ease-in-out bg-white",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {isMobileMenuOpen && (
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-4 -right-12 p-2 bg-white rounded-lg shadow-lg lg:hidden border border-border/50 transition-all hover:bg-secondary focus:ring-2 focus:ring-primary/20"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        )}
        <SidebarContent 
          store={store} 
          userName={session.user?.name || ""} 
          userEmail={session.user?.email || ""} 
          closeMobileMenu={() => setIsMobileMenuOpen(false)}
        />
      </aside>

      {/* Main UI Body */}
      <div className="flex flex-1 flex-col overflow-hidden relative">
        
        {/* Superior Header */}
        <header className="flex h-16 items-center justify-between border-b border-border/40 bg-white/80 backdrop-blur-md px-4 md:px-8 sticky top-0 z-20 transition-all">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-secondary text-muted-foreground transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-base md:text-lg font-bold text-foreground tracking-tight">Dashboard</h2>
          </div>
          
          <div className="flex items-center gap-3">
             {/* Dynamic header content could go here */}
          </div>
        </header>

        {/* Dashboard Content Container */}
        <main className="flex-1 overflow-y-auto w-full scroll-smooth">
          <div className="mx-auto max-w-6xl w-full p-5 md:p-10 pb-20 md:pb-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
