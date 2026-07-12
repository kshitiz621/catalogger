import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import OAuthSessionHandler from "@/components/auth/OAuthSessionHandler";
import { createPageMetadata, SITE_NAME } from "@/lib/seo/metadata";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = createPageMetadata({
  title: SITE_NAME,
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <Suspense fallback={null}>
          <OAuthSessionHandler />
        </Suspense>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "var(--card)",
              color: "var(--foreground)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-scale-lg)",
              fontSize: "13px",
              fontFamily: "Inter, sans-serif",
              fontWeight: "500",
              boxShadow: "var(--shadow-scale-lg)",
            },
          }}
        />
      </body>
    </html>
  );
}
