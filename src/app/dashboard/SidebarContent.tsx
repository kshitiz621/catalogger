"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Package, 
  Tags, 
  Settings, 
  ExternalLink, 
  Store as StoreIcon, 
  Plus
} from "lucide-react";
import LogoutButton from "@/components/LogoutButton";
import { cn } from "@/lib/utils";

interface SidebarProps {
  store: { name: string; slug: string; logoUrl?: string | null } | null;
  userName: string;
  userEmail: string;
  closeMobileMenu?: () => void;
  logoUrl?: string | null;
}

export default function SidebarContent({ store, userName, userEmail, closeMobileMenu, logoUrl }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { label: "Overview", href: "/dashboard", icon: Home },
    { label: "Products", href: "/dashboard/products", icon: Package, requireStore: true },
    { label: "Categories", href: "/dashboard/categories", icon: Tags, requireStore: true },
    { label: "Store Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const handleClose = () => {
    if (closeMobileMenu) closeMobileMenu();
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-border shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
      <div className="flex h-16 items-center px-6 border-b border-border/60">
        <Link 
          href="/dashboard" 
          className="flex items-center gap-2 text-primary hover:opacity-90 transition-opacity"
          onClick={handleClose}
        >
          <div className="w-8 h-8 flex-shrink-0 bg-primary/10 p-1 rounded-lg border border-primary/20 overflow-hidden flex items-center justify-center">
            {logoUrl ? (
                <img src={logoUrl} alt={store?.name || "Store"} className="w-full h-full object-cover rounded-md" />
              ) : (
                <StoreIcon className="w-5 h-5 text-primary" />
              )}
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
                onClick={handleClose}
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
              onClick={handleClose}
              className="mt-3 flex items-center justify-center gap-1.5 w-full py-2 bg-amber-600 text-white rounded-lg text-xs font-bold hover:bg-amber-700 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Complete Setup
            </Link>
          </div>
        )}
      </div>
      
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
