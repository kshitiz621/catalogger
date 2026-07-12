import { Suspense } from "react";
import AuthCompleteClient from "./AuthCompleteClient";

export default function AuthCompletePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
          <p className="text-sm text-muted-foreground">Finishing sign-in…</p>
        </div>
      }
    >
      <AuthCompleteClient />
    </Suspense>
  );
}
