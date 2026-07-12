import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
import { getAppSession } from "@/lib/auth/app-session";
import LandingPage from "@/components/landing/landing-page";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Catalogger — Beautiful Product Catalogues for Your Business",
  description:
    "Create stunning online product catalogues in minutes. Share anywhere, let customers order via WhatsApp. Free to start, no coding required.",
  keywords: [
    "product catalogue",
    "online store",
    "WhatsApp orders",
    "small business",
    "e-commerce India",
    "catalogue maker",
    "sell online",
  ],
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Catalogger",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "INR",
  },
  description:
    "Create beautiful product catalogues and let customers order via WhatsApp.",
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ neon_auth_session_verifier?: string }>;
}) {
  const params = await searchParams;

  if (params.neon_auth_session_verifier) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <p className="text-sm text-muted-foreground">Finishing sign-in…</p>
      </div>
    );
  }

  const { data: neonSession } = await auth.getSession();

  if (neonSession?.user) {
    const appSession = await getAppSession();

    if (appSession?.user.role === "SUPER_ADMIN") {
      redirect("/platform/dashboard");
    }

    if (appSession) {
      redirect("/dashboard");
    }

    redirect("/signup");
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingPage />
    </>
  );
}
