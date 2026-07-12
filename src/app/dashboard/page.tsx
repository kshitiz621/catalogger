import Link from "next/link";
import { getAppSession } from "@/lib/auth/app-session";
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
  MessageCircle,
} from "lucide-react";
import { MetricChart } from "@/components/analytics/metric-chart";
import { StatCard } from "@/components/analytics/stat-card";
import StoreLinkCard from "./StoreLinkCard";
import OnboardingChecklist from "./OnboardingChecklist";
import { getDashboardMetrics, getOnboardingState } from "@/lib/actions/seller.actions";

export default async function DashboardPage() {
  const session = await getAppSession();
  if (!session?.user?.id) return null;

  let metrics;
  try {
    metrics = await getDashboardMetrics();
  } catch {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-6 py-20 text-center">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl border border-primary/20 bg-primary/8">
          <TrendingUp className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Welcome to Catalogger!
        </h1>
        <p className="mt-2 max-w-xs text-[13px] leading-relaxed text-muted-foreground">
          Create your first store to start showcasing your products online.
        </p>
        <Link
          href="/dashboard/settings"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-[13px] font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
        >
          Setup Store <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const {
    totalProducts,
    totalCategories,
    totalViews,
    totalOrders,
    viewsArePlaceholder,
    ordersArePlaceholder,
    productTrend,
    viewsTrend,
    ordersTrend,
    store,
  } = metrics;

  let onboarding = null;
  try {
    onboarding = await getOnboardingState();
  } catch (error) {
    console.error("Failed to load onboarding state:", error);
  }

  const quickActions = [
    { label: "New Product", href: "/dashboard/products/new", icon: Plus },
    { label: "New Category", href: "/dashboard/categories/new", icon: Plus },
    { label: "Edit Store", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="animate-in fade-in space-y-8 duration-500">
      {onboarding && !onboarding.onboardingCompleted ? (
        <OnboardingChecklist onboarding={JSON.parse(JSON.stringify(onboarding))} />
      ) : null}

      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Welcome back, {session.user.name || session.user.email?.split("@")[0]}
        </h1>
        <p className="mt-1 text-[13px] text-muted-foreground">
          Managing <span className="font-semibold text-foreground">{store.name}</span> catalogue.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Products"
          value={totalProducts}
          icon={Package}
          iconClassName="border-blue-100 bg-blue-50 text-blue-600"
        />
        <StatCard
          label="Categories"
          value={totalCategories}
          icon={Tags}
          iconClassName="border-emerald-100 bg-emerald-50 text-emerald-600"
        />
        <StatCard
          label="Store Views"
          value={totalViews}
          icon={Eye}
          iconClassName="border-purple-100 bg-purple-50 text-purple-600"
          placeholder={viewsArePlaceholder}
        />
        <StatCard
          label="Orders"
          value={totalOrders}
          icon={ShoppingCart}
          iconClassName="border-orange-100 bg-orange-50 text-orange-600"
          placeholder={ordersArePlaceholder}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <MetricChart
          title="Products Added"
          description="New products in the last 14 days"
          data={productTrend}
          colorClassName="bg-blue-500"
        />
        <MetricChart
          title="Store Views"
          description="Daily views (placeholder until tracking is enabled)"
          data={viewsTrend}
          colorClassName="bg-purple-500"
        />
        <MetricChart
          title="Orders"
          description="Daily orders (placeholder until checkout is enabled)"
          data={ordersTrend}
          colorClassName="bg-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-sm">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-[14px] font-semibold text-foreground">Your Store</h2>
              <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[12px] font-medium text-emerald-600">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Online
              </div>
            </div>
            <p className="text-lg font-bold tracking-tight text-foreground">{store.name}</p>
            <p className="mb-4 text-[13px] text-muted-foreground">
              catalogger.com/store/{store.slug}
            </p>

            {store.whatsappNumber ? (
              <div className="mt-2 flex items-center gap-2 text-[13px] text-muted-foreground">
                <MessageCircle className="h-4 w-4 text-emerald-600" />
                +{store.whatsappNumber}
              </div>
            ) : null}
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
            <Link
              href="/dashboard/settings"
              className="text-[13px] font-medium text-primary hover:underline"
            >
              Edit Settings
            </Link>
            <a
              href={`/store/${store.slug}`}
              target="_blank"
              className="group flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-[13px] font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View Store
            </a>
          </div>
        </div>

        <div className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-[14px] font-semibold text-foreground">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-2">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="group flex items-center gap-3 rounded-lg border border-border/70 px-4 py-3 text-[13px] font-medium text-foreground transition-colors hover:border-border hover:bg-secondary"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-md border border-border/60 bg-secondary transition-colors group-hover:border-primary/20 group-hover:bg-primary/8">
                  <action.icon className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-primary" />
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
