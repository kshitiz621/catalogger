import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import {
  Package,
  Tags,
  CheckCircle2,
  Plus,
  Settings,
  ExternalLink,
  ArrowRight,
  TrendingUp,
  Eye,
  ShoppingCart,
  MessageCircle
} from "lucide-react";
import StoreLinkCard from "./StoreLinkCard";
import { getDashboardMetrics } from "@/lib/actions/seller.actions";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  let metrics;
  try {
    metrics = await getDashboardMetrics();
  } catch (error) {
    // If the seller has no store, they are either a new user or something is wrong
    return (
      <div className="flex flex-col items-center justify-center py-20 rounded-xl border border-dashed border-border bg-card text-center px-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/8 border border-primary/20 mb-5">
          <TrendingUp className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-xl font-semibold text-foreground tracking-tight">
          Welcome to Catalogger!
        </h1>
        <p className="text-[13px] text-muted-foreground mt-2 max-w-xs leading-relaxed">
          Create your first store to start showcasing your products online.
        </p>
        <Link
          href="/dashboard/settings"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-[13px] font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
        >
          Setup Store <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const { totalProducts, totalCategories, totalViews, totalOrders, store } = metrics;

  const stats = [
    {
      label: "Products",
      value: totalProducts,
      icon: Package,
      iconClass: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
      label: "Categories",
      value: totalCategories,
      icon: Tags,
      iconClass: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    {
      label: "Store Views",
      value: totalViews.toLocaleString(),
      icon: Eye,
      iconClass: "text-purple-600 bg-purple-50 border-purple-100",
    },
    {
      label: "Orders",
      value: totalOrders.toLocaleString(),
      icon: ShoppingCart,
      iconClass: "text-orange-600 bg-orange-50 border-orange-100",
    },
  ];

  const quickActions = [
    { label: "New Product", href: "/dashboard/products/new", icon: Plus },
    { label: "New Category", href: "/dashboard/categories/new", icon: Plus },
    { label: "Edit Store", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">
          Welcome back, {session.user.name || session.user.email?.split("@")[0]}
        </h1>
        <p className="text-[13px] text-muted-foreground mt-1">
          Managing{" "}
          <span className="font-semibold text-foreground">{store.name}</span>{" "}
          catalogue.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="group rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg border ${stat.iconClass}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">
              {stat.label}
            </p>
            <p className="text-2xl font-bold text-foreground tabular-nums tracking-tight">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Quick actions + store link */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Store link card */}
        <div className="rounded-xl border border-border bg-card shadow-sm p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-[14px] font-semibold text-foreground">Your Store</h2>
              <div className="flex items-center gap-1 text-[12px] font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Online
              </div>
            </div>
            <p className="text-lg font-bold text-foreground tracking-tight">{store.name}</p>
            <p className="text-[13px] text-muted-foreground mb-4">catalogger.com/store/{store.slug}</p>
            
            {store.whatsappNumber && (
              <div className="flex items-center gap-2 text-[13px] text-muted-foreground mt-2">
                <MessageCircle className="h-4 w-4 text-emerald-600" />
                +{store.whatsappNumber}
              </div>
            )}
          </div>
          
          <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
            <Link href="/dashboard/settings" className="text-[13px] font-medium text-primary hover:underline">
              Edit Settings
            </Link>
            <a
              href={`/store/${store.slug}`}
              target="_blank"
              className="group flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-[13px] font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View Store
            </a>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border border-border bg-card shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[14px] font-semibold text-foreground">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="group flex items-center gap-3 rounded-lg border border-border/70 px-4 py-3 text-[13px] font-medium text-foreground hover:bg-secondary hover:border-border transition-colors"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-secondary border border-border/60 group-hover:bg-primary/8 group-hover:border-primary/20 transition-colors">
                  <action.icon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                {action.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
