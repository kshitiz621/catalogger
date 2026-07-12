import Link from "next/link";
import { FileQuestion, Home } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

type AppNotFoundScreenProps = {
  title?: string;
  message?: string;
  homeHref?: string;
  homeLabel?: string;
};

export function AppNotFoundScreen({
  title = "Page not found",
  message = "The page you are looking for does not exist or may have moved.",
  homeHref = "/",
  homeLabel = "Back to Home",
}: AppNotFoundScreenProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-20 text-center">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-muted">
        <FileQuestion className="h-7 w-7 text-muted-foreground" aria-hidden="true" />
      </div>

      <h1 className="mb-2 text-xl font-semibold tracking-tight text-foreground">{title}</h1>
      <p className="mb-7 max-w-md text-[13px] leading-relaxed text-muted-foreground">{message}</p>

      <Link href={homeHref} className={cn(buttonVariants())}>
        <Home className="h-4 w-4" />
        {homeLabel}
      </Link>
    </div>
  );
}
