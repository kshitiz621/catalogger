"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth/client";
import { resolvePostAuthRedirect, syncAuthEmailChange } from "@/components/auth/auth-utils";
import { Loader2 } from "lucide-react";

const VERIFIER_PARAM = "neon_auth_session_verifier";

export default function OAuthSessionHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const verifier = searchParams.get(VERIFIER_PARAM);

  useEffect(() => {
    if (!verifier) return;

    let cancelled = false;

    async function complete() {
      await authClient.getSession();
      const { data: session } = await authClient.getSession();
      syncAuthEmailChange(session?.user?.email);

      if (cancelled) return;

      const destination = await resolvePostAuthRedirect();
      window.location.href = destination;
    }

    complete().catch(() => {
      if (!cancelled) {
        router.replace("/login");
      }
    });

    return () => {
      cancelled = true;
    };
  }, [verifier, router]);

  if (!verifier) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-background/90">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Finishing sign-in…</p>
    </div>
  );
}
