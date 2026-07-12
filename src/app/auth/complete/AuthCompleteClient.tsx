"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth/client";
import { resolvePostAuthRedirect, syncAuthEmailChange } from "@/components/auth/auth-utils";
import { Loader2, Store } from "lucide-react";

export default function AuthCompleteClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function complete() {
      const oauthError = searchParams.get("error");
      if (oauthError) {
        if (!cancelled) {
          setError("Sign-in was cancelled or failed. Please try again.");
        }
        return;
      }

      await authClient.getSession();
      const { data: session } = await authClient.getSession();
      syncAuthEmailChange(session?.user?.email);

      if (cancelled) return;

      const destination = await resolvePostAuthRedirect();
      window.location.href = destination;
    }

    complete();

    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-background">
          <Store className="h-5 w-5 text-primary" />
        </div>
        {error ? (
          <>
            <p className="text-sm font-medium text-destructive">{error}</p>
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="mt-4 text-sm font-medium text-primary hover:underline"
            >
              Back to login
            </button>
          </>
        ) : (
          <>
            <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
            <p className="mt-3 text-sm text-muted-foreground">Finishing sign-in…</p>
          </>
        )}
      </div>
    </div>
  );
}
