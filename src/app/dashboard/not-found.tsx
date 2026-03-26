import Link from "next/link";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";

export default function DashboardNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center mb-8 border border-border shadow-sm">
        <AlertCircle className="w-10 h-10 text-muted-foreground/60" />
      </div>
      
      <h1 className="text-3xl font-extrabold text-foreground mb-4 tracking-tight">Resource Not Found</h1>
      <p className="text-muted-foreground max-w-md mb-10 leading-relaxed font-bold">
        The dashboard resource you are looking for does not exist or has been moved.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/95 hover:scale-[1.02] transition-all"
        >
          <Home className="w-4 h-4" />
          Back to Overview
        </Link>
        <button
          onClick={() => (window as any).history.back()}
          className="inline-flex items-center gap-2 rounded-xl bg-white border border-border px-8 py-3.5 text-sm font-bold text-foreground hover:bg-secondary transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous Page
        </button>
      </div>
    </div>
  );
}
