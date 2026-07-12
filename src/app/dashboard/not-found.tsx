import Link from "next/link";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

export default function DashboardNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center animate-in fade-in slide-in-from-top-3 duration-400">
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted border border-border mb-6">
        <AlertCircle className="h-7 w-7 text-muted-foreground" />
      </div>

      <h1 className="text-2xl font-semibold text-foreground mb-3 tracking-tight">
        Page not found
      </h1>
      <p className="text-[13px] text-muted-foreground max-w-xs mb-8 leading-relaxed">
        The dashboard resource you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-2.5">
        <Link href="/dashboard" className={cn(buttonVariants())}>
          <Home className="h-4 w-4" />
          Back to Overview
        </Link>
        <Link href="/dashboard" className={cn(buttonVariants({ variant: "outline" }))}>
          <ArrowLeft className="h-4 w-4" />
          Previous Page
        </Link>
      </div>
    </div>
  );
}
