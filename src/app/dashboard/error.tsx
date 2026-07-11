"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error(error);
    }
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-destructive/8 border border-destructive/20 mb-5">
        <AlertCircle className="h-7 w-7 text-destructive" />
      </div>

      <h1 className="text-xl font-semibold text-foreground mb-2 tracking-tight">
        Something went wrong
      </h1>
      <p className="text-[13px] text-muted-foreground max-w-sm mb-7 leading-relaxed">
        {error.message ||
          "An unexpected error occurred while loading your dashboard."}
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-2.5">
        <Button onClick={() => reset()}>
          <RotateCcw className="h-4 w-4" />
          Try Again
        </Button>
        <Link
          href="/dashboard"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          <Home className="h-4 w-4" />
          Dashboard Home
        </Link>
      </div>

      {error.digest && (
        <p className="mt-10 rounded-full border border-border bg-muted px-3 py-1.5 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
          Error ID: {error.digest}
        </p>
      )}
    </div>
  );
}
