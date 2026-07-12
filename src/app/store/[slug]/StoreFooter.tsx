import Link from "next/link";
import { Instagram, Facebook, Globe, Youtube } from "lucide-react";
import type { StoreSocialLinks } from "@/types/storefront";

interface StoreFooterProps {
  storeName: string;
  slug: string;
  socialLinks?: StoreSocialLinks;
}

function SocialIcon({ platform }: { platform: string }) {
  switch (platform) {
    case "instagram":
      return <Instagram className="h-4 w-4" />;
    case "facebook":
      return <Facebook className="h-4 w-4" />;
    case "youtube":
      return <Youtube className="h-4 w-4" />;
    default:
      return <Globe className="h-4 w-4" />;
  }
}

export default function StoreFooter({
  storeName,
  slug,
  socialLinks = {},
}: StoreFooterProps) {
  const year = new Date().getFullYear();

  const links = (
    [
      ["instagram", socialLinks.instagram],
      ["facebook", socialLinks.facebook],
      ["twitter", socialLinks.twitter],
      ["youtube", socialLinks.youtube],
      ["tiktok", socialLinks.tiktok],
      ["website", socialLinks.website],
    ] as const
  ).filter(([, url]) => !!url);

  return (
    <footer className="w-full border-t border-border/60 bg-card/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 sm:py-8">
          <div className="flex items-center gap-2">
            <Link
              href={`/store/${slug}`}
              className="text-sm font-bold text-foreground hover:text-primary transition-colors"
            >
              {storeName}
            </Link>
            <span className="text-muted-foreground text-xs">&copy; {year}</span>
          </div>

          <nav className="flex items-center gap-4 sm:gap-6">
            <Link
              href={`/store/${slug}`}
              className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Products
            </Link>
            <Link
              href={`/store/${slug}/cart`}
              className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Cart
            </Link>
            {links.map(([platform, url]) => (
              <a
                key={platform}
                href={url!}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label={platform}
              >
                <SocialIcon platform={platform} />
              </a>
            ))}
          </nav>

          <p className="text-xs text-muted-foreground">
            Powered by{" "}
            <span className="font-semibold text-foreground">Catalogger</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
