"use client";

import { useEffect } from "react";
import { AppErrorScreen } from "@/components/errors/app-error-screen";

export default function PlatformError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error(error);
    }
  }, [error]);

  return (
    <AppErrorScreen
      message={error.message || "An unexpected error occurred in the platform console."}
      digest={error.digest}
      reset={reset}
      homeHref="/platform/dashboard"
      homeLabel="Platform Home"
    />
  );
}
