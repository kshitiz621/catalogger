"use client";

import { AppErrorScreen } from "@/components/errors/app-error-screen";

export default function StoreError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <AppErrorScreen
      title="Store unavailable"
      message={error.message || "We could not load this store right now."}
      digest={error.digest}
      reset={reset}
      homeHref="/"
      homeLabel="Browse Catalogger"
    />
  );
}
