"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Audit error log in development
    if (process.env.NODE_ENV !== "production") {
      console.error(error);
    }
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-6 border border-destructive/20 ring-4 ring-destructive/5">
        <AlertCircle className="w-8 h-8 text-destructive" />
      </div>
      
      <h1 className="text-2xl font-bold text-foreground mb-3">Something went wrong!</h1>
      <p className="text-muted-foreground max-w-sm mb-8 leading-relaxed">
        {error.message || "We encountered an unexpected error while loading your dashboard. Please try again."}
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-md hover:bg-primary/90 transition-all active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          Try Again
        </button>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-xl bg-secondary px-6 py-3 text-sm font-bold text-foreground border border-border/80 hover:bg-muted transition-all active:scale-95"
        >
          <Home className="w-4 h-4" />
          Dashboard Home
        </Link>
      </div>
      
      {error.digest && (
        <p className="mt-10 text-[10px] text-muted-foreground uppercase tracking-widest bg-muted px-3 py-1.5 rounded-full border border-border/50 font-mono">
          Error ID: {error.digest}
        </p>
      )}
    </div>
  );
}
