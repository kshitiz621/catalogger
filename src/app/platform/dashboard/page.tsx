import { getPlatformStats, getSellers } from "@/lib/actions/platform.actions";
import { Users, Store, AlertTriangle, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function PlatformDashboard() {
  const stats = await getPlatformStats();
  // Fetch a small list for recent sellers
  const recentSellers = await getSellers();
  const recent = recentSellers.slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Dashboard</h1>
        <p className="text-sm text-zinc-500">Platform overview and recent activity.</p>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">Total Sellers</p>
              <h3 className="text-2xl font-bold text-zinc-900">{stats.totalSellers}</h3>
            </div>
          </div>
        </div>
        
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
              <Store className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">Active Stores</p>
              <h3 className="text-2xl font-bold text-zinc-900">{stats.activeSellers}</h3>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">Suspended</p>
              <h3 className="text-2xl font-bold text-zinc-900">{stats.suspendedSellers}</h3>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-50">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">New (7d)</p>
              <h3 className="text-2xl font-bold text-zinc-900">{stats.newSellers}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl border bg-white shadow-sm">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 className="font-semibold text-zinc-900">Recent Signups</h3>
          <Link href="/platform/sellers" className="inline-flex h-8 px-3 items-center justify-center rounded-md text-sm font-medium hover:bg-zinc-100">
            View all <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
        <div className="divide-y">
          {recent.length === 0 ? (
            <div className="p-8 text-center text-sm text-zinc-500">
              No sellers found.
            </div>
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
                  <span className="text-sm font-medium text-zinc-900">
                    {seller.store?.name}
                  </span>
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
