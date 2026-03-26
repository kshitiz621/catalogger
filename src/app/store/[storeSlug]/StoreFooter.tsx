import Link from "next/link";

interface StoreFooterProps {
  storeName: string;
  storeSlug: string;
}

export default function StoreFooter({ storeName, storeSlug }: StoreFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border/60 bg-card/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-8">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <Link
              href={`/store/${storeSlug}`}
              className="text-sm font-bold text-foreground hover:text-primary transition-colors"
            >
              {storeName}
            </Link>
            <span className="text-muted-foreground text-xs">
              &copy; {year}
            </span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6">
            <Link
              href={`/store/${storeSlug}`}
              className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Products
            </Link>
            <Link
              href={`/store/${storeSlug}/cart`}
              className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Cart
            </Link>
          </nav>

          {/* Powered By */}
          <p className="text-xs text-muted-foreground">
            Powered by{" "}
            <span className="font-semibold text-foreground">Catalogger</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
