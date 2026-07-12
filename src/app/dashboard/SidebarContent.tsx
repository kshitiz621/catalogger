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
  Plus,
  AlertTriangle,
  User,
  ShieldCheck,
} from "lucide-react";
import LogoutButton from "@/components/LogoutButton";
import { cn } from "@/lib/utils";

interface SidebarProps {
  store: { name: string; slug: string; logoUrl?: string | null } | null;
  userName: string;
  userEmail: string;
  closeMobileMenu?: () => void;
  logoUrl?: string | null;
  isSuperAdmin?: boolean;
}

export default function SidebarContent({ store, userName, userEmail, closeMobileMenu, logoUrl, isSuperAdmin = false }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { label: "Overview", href: "/dashboard", icon: Home },
    { label: "Products", href: "/dashboard/products", icon: Package, requireStore: true },
    { label: "Categories", href: "/dashboard/categories", icon: Tags, requireStore: true },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
    { label: "Profile", href: "/dashboard/profile", icon: User },
  ];

  const adminItems = isSuperAdmin
    ? [{ label: "Platform Admin", href: "/platform/dashboard", icon: ShieldCheck }]
    : [];

  const handleClose = () => {
    if (closeMobileMenu) closeMobileMenu();
  };

  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      {/* Brand / Logo */}
      <div className="flex h-14 shrink-0 items-center px-5 border-b border-border">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 group"
          onClick={handleClose}
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 overflow-hidden">
            {logoUrl ? (
              <img src={logoUrl} alt={store?.name || "Store"} className="h-full w-full object-cover" />
            ) : (
              <StoreIcon className="h-4 w-4 text-primary" />
            )}
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
            Catalogger
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto scrollbar-none px-3 py-4 space-y-5">
        {/* Main nav */}
        <nav className="space-y-0.5">
          <p className="px-2 pb-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
            Menu
          </p>
          {navItems.map((item) => {
            if (item.requireStore && !store) return null;
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleClose}
                className={cn(
                  "group flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors duration-150",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <item.icon className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                )} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {adminItems.length > 0 && (
          <nav className="space-y-0.5">
            <p className="px-2 pb-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
              Admin
            </p>
            {adminItems.map((item) => {
              const isActive = pathname.startsWith("/platform");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleClose}
                  className={cn(
                    "group flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors duration-150",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Live store link */}
        {store && (
          <div className="space-y-0.5">
            <p className="px-2 pb-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
              Public Store
            </p>
            <a
              href={`/store/${store.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-primary bg-primary/8 border border-primary/15 hover:bg-primary/12 transition-colors"
            >
              <ExternalLink className="h-4 w-4 shrink-0" />
              View Live Store
            </a>
          </div>
        )}

        {/* Setup warning for no store */}
        {!store && (
          <div className="rounded-lg border border-warning-border bg-warning-bg p-3 space-y-2">
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-warning" />
              <p className="text-[11px] font-semibold text-warning-foreground">Store not set up</p>
            </div>
            <p className="text-[11px] text-warning-foreground/80 leading-relaxed">
              Configure your store to start adding products.
            </p>
            <Link
              href="/dashboard/settings"
              onClick={handleClose}
              className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-md bg-warning text-warning-foreground/90 text-[11px] font-semibold hover:opacity-90 transition-opacity"
            >
              <Plus className="h-3 w-3" />
              Complete Setup
            </Link>
          </div>
        )}
      </div>

      {/* User section */}
      <div className="shrink-0 border-t border-border bg-muted/20 px-3 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-[12px] font-bold text-primary select-none">
            {(userName.charAt(0) || userEmail.charAt(0) || "U").toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-foreground truncate leading-none mb-0.5">
              {userName || "Store Owner"}
            </p>
            <p className="text-[11px] text-muted-foreground truncate leading-none">
              {userEmail}
            </p>
          </div>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
