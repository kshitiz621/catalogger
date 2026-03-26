"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

interface StoreLinkCardProps {
  slug: string;
}

export default function StoreLinkCard({ slug }: StoreLinkCardProps) {
  const [copied, setCopied] = useState(false);
  const storeUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/store/${slug}` 
    : `catalogger.com/store/${slug}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(storeUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  return (
    <section className="bg-white rounded-2xl border border-border/60 shadow-sm p-6 space-y-4 flex flex-col justify-center bg-gradient-to-br from-primary/5 to-transparent">
      <h2 className="text-lg font-bold text-foreground">Public Link</h2>
      <p className="text-sm text-muted-foreground leading-relaxed">
        Share your store link with customers to start receiving orders directly on WhatsApp.
      </p>
      
      <div className="flex items-center gap-2 p-3.5 rounded-xl bg-white border border-border shadow-inner font-mono text-[11px] sm:text-xs text-primary font-bold overflow-hidden transition-all group-hover:border-primary/30">
        <span className="truncate flex-1 opacity-80">{storeUrl.replace(/^https?:\/\//, '')}</span>
        <div className="flex items-center gap-1.5 border-l border-border pl-2 ml-1">
          <button 
            onClick={copyToClipboard}
            className="p-2 hover:bg-secondary rounded-lg transition-all text-muted-foreground hover:text-primary active:scale-90"
            title="Copy link"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
          <a 
            href={`/store/${slug}`} 
            target="_blank" 
            className="p-2 hover:bg-secondary rounded-lg transition-all text-muted-foreground hover:text-primary active:scale-90"
            title="Open store"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
