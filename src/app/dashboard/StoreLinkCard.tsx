"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink, Link2 } from "lucide-react";
import toast from "react-hot-toast";

interface StoreLinkCardProps {
  slug: string;
}

export default function StoreLinkCard({ slug }: StoreLinkCardProps) {
  const [copied, setCopied] = useState(false);
  const storeUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/store/${slug}`
      : `catalogger.com/store/${slug}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(storeUrl);
      setCopied(true);
      toast.success("Link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm p-5 flex flex-col justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Link2 className="h-4 w-4 text-primary" />
          <h2 className="text-[14px] font-semibold text-foreground">Public Link</h2>
        </div>
        <p className="text-[12.5px] text-muted-foreground leading-relaxed">
          Share your store with customers to receive orders on WhatsApp.
        </p>
      </div>

      <div className="flex items-center gap-0 rounded-lg border border-border bg-secondary/30 overflow-hidden">
        <span className="flex-1 truncate px-3 py-2.5 text-[12px] font-mono text-muted-foreground">
          {storeUrl.replace(/^https?:\/\//, "")}
        </span>
        <div className="flex shrink-0 items-center border-l border-border">
          <button
            onClick={copyToClipboard}
            className="flex h-full items-center gap-1.5 px-3 py-2.5 text-[12px] font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            title="Copy link"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-success" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
          <a
            href={`/store/${slug}`}
            target="_blank"
            className="flex h-full items-center px-3 py-2.5 border-l border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            title="Open store"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
