import { getPlatformAnalytics } from "@/lib/actions/analytics.actions";
import { getSellers } from "@/lib/actions/platform.actions";
import { MetricChart } from "@/components/analytics/metric-chart";
import { StatCard } from "@/components/analytics/stat-card";
import { Badge } from "@/components/ui/badge";
import { Users, Store, AlertTriangle, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function PlatformDashboard() {
  const analytics = await getPlatformAnalytics();
  const recentSellers = await getSellers();
  const recent = recentSellers.slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Dashboard</h1>
        <p className="text-sm text-zinc-500">Platform overview, growth, and recent activity.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Seller Count"
          value={analytics.totalSellers}
          icon={Users}
          iconClassName="border-blue-100 bg-blue-50 text-blue-600"
        />
        <StatCard
          label="Active Stores"
          value={analytics.activeSellers}
          icon={Store}
          iconClassName="border-emerald-100 bg-emerald-50 text-emerald-600"
        />
        <StatCard
          label="New Sellers (7d)"
          value={analytics.newSellers7d}
          icon={TrendingUp}
          iconClassName="border-purple-100 bg-purple-50 text-purple-600"
          changePercent={analytics.growth7d.changePercent}
          changeLabel={analytics.growth7d.periodLabel}
        />
        <StatCard
          label="Suspended"
          value={analytics.suspendedSellers}
          icon={AlertTriangle}
          iconClassName="border-orange-100 bg-orange-50 text-orange-600"
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <MetricChart
          title="Seller Growth"
          description="Cumulative sellers over the last 14 days"
          data={analytics.sellerTrend}
          colorClassName="bg-blue-500"
        />
        <MetricChart
          title="New Sellers"
          description="Daily signups over the last 14 days"
          data={analytics.newSellerTrend}
          colorClassName="bg-emerald-500"
        />
      </div>

      <div className="rounded-xl border bg-white shadow-sm">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h3 className="font-semibold text-zinc-900">Recent Signups</h3>
            <p className="text-[12px] text-zinc-500">
              {analytics.newSellers30d} new sellers in the last 30 days
              {analytics.growth30d.changePercent !== 0 ? (
                <span className="ml-1">
                  ({analytics.growth30d.changePercent > 0 ? "+" : ""}
                  {analytics.growth30d.changePercent}% {analytics.growth30d.periodLabel})
                </span>
              ) : null}
            </p>
          </div>
          <Link
            href="/platform/sellers"
            className="inline-flex h-8 items-center justify-center rounded-md px-3 text-sm font-medium hover:bg-zinc-100"
          >
            View all <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
        <div className="divide-y">
          {recent.length === 0 ? (
            <div className="p-8 text-center text-sm text-zinc-500">No sellers found.</div>
          ) : (
            recent.map((seller) => (
              <div key={seller.id} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 font-semibold text-zinc-600">
                    {seller.name?.charAt(0).toUpperCase() || seller.email.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-zinc-900">{seller.name || "Unknown"}</p>
                    <p className="text-sm text-zinc-500">{seller.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-zinc-900">{seller.store?.name}</span>
                  <Badge variant={seller.status === "ACTIVE" ? "default" : "destructive"}>
                    {seller.status}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
