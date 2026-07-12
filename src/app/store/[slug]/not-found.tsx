import Link from "next/link";
import { buttonVariants } from "@/components/ui/button-variants";
import { Store } from "lucide-react";

export default function StoreNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background py-12 px-4 animate-in fade-in duration-500">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-muted border border-border">
          <Store className="h-10 w-10 text-muted-foreground" />
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Store Not Found
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            The store you&apos;re looking for doesn&apos;t exist or may have been removed.
          </p>
        </div>
        <Link href="/" className={buttonVariants({ size: "lg" })}>
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}
