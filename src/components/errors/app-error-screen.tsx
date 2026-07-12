import Link from "next/link";
import { AlertCircle, Home, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

type AppErrorScreenProps = {
  title?: string;
  message?: string;
  digest?: string;
  reset?: () => void;
  homeHref?: string;
  homeLabel?: string;
};

export function AppErrorScreen({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  digest,
  reset,
  homeHref = "/",
  homeLabel = "Go Home",
}: AppErrorScreenProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-20 text-center">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl border border-destructive/20 bg-destructive/8">
        <AlertCircle className="h-7 w-7 text-destructive" aria-hidden="true" />
      </div>

      <h1 className="mb-2 text-xl font-semibold tracking-tight text-foreground">{title}</h1>
      <p className="mb-7 max-w-md text-[13px] leading-relaxed text-muted-foreground">{message}</p>

      <div className="flex flex-col items-center gap-2.5 sm:flex-row">
        {reset ? (
          <Button onClick={() => reset()}>
            <RotateCcw className="h-4 w-4" />
            Try Again
          </Button>
        ) : null}
        <Link href={homeHref} className={cn(buttonVariants({ variant: "outline" }))}>
          <Home className="h-4 w-4" />
          {homeLabel}
        </Link>
      </div>

      {digest ? (
        <p className="mt-10 rounded-full border border-border bg-muted px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Error ID: {digest}
        </p>
      ) : null}
    </div>
  );
}
