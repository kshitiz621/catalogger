import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { 
  Package, 
  Tags, 
  ExternalLink, 
  ArrowRight, 
  ArrowUpRight,
  Plus,
  TrendingUp, 
  CheckCircle2,
  Settings
} from "lucide-react";
import StoreLinkCard from "./StoreLinkCard";
import { StoreService } from "@/lib/services/store.service";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) return null;

  // CALL SERVICE (Backend Layer)
  const store = await StoreService.getByUserId(session.user.id);

  if (!store) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-border text-center px-6 shadow-sm animate-in fade-in duration-700">
        <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mb-6 text-primary border border-primary/20 ring-4 ring-primary/[0.02]">
          <TrendingUp className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Welcome to Catalogger!</h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-sm leading-relaxed">
          Create your first store to start showcasing your products online.
        </p>
        <Link 
          href="/dashboard/settings" 
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-md hover:bg-primary/90 hover:scale-[1.02] transition-all"
        >
          Setup Store <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const stats = [
    { label: "Total Products", value: store._count.products, icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Categories", value: store._count.categories, icon: Tags, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Public Status", value: "Online", icon: CheckCircle2, color: "text-primary", bg: "bg-primary/5" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
          Welcome back, {session.user.name || session.user.email?.split('@')[0]}!
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5 font-medium leading-relaxed italic">
          Managing <span className="text-primary font-bold not-italic">{store.name}</span> catalogue.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="group overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-border/60 hover:border-primary/20 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
               <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110 duration-300 shadow-sm border border-black/[0.03]`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-20 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground font-sans tracking-widest uppercase mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-foreground tracking-tight font-mono">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-white rounded-2xl border border-border/60 shadow-sm p-6 space-y-4 shadow-black/[0.01]">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary/60" /> Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
             <Link href="/dashboard/products/new" className="flex items-center gap-3 p-4 rounded-xl border border-border/80 hover:bg-secondary/40 hover:border-primary/20 transition-all font-bold text-xs text-foreground group">
                <Plus className="w-4 h-4 text-primary group-hover:scale-125 transition-transform" /> New Product
             </Link>
             <Link href="/dashboard/categories/new" className="flex items-center gap-3 p-4 rounded-xl border border-border/80 hover:bg-secondary/40 hover:border-primary/20 transition-all font-bold text-xs text-foreground group">
                <Plus className="w-4 h-4 text-primary group-hover:scale-125 transition-transform" /> New Category
             </Link>
             <Link href="/dashboard/settings" className="flex items-center gap-2.5 p-4 rounded-xl border border-border/80 hover:bg-secondary/40 hover:border-primary/20 transition-all font-bold text-xs text-foreground group">
                <Settings className="w-4 h-4 text-primary group-hover:rotate-45 transition-transform" /> Edit Store
             </Link>
             <a href={`/store/${store.slug}`} target="_blank" className="flex items-center gap-2.5 p-4 rounded-xl border border-primary/10 bg-primary/5 hover:bg-primary/10 transition-all font-bold text-xs text-primary group">
                <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" /> Live Store
             </a>
          </div>
        </section>

        {/* Dynamic Client Card for Clipboard Interactions */}
        <StoreLinkCard slug={store.slug} />

      </div>
    </div>
  );
}
