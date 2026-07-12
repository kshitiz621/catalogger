"use client";

import { useEffect } from "react";
import { AppErrorScreen } from "@/components/errors/app-error-screen";
import { logger } from "@/lib/monitoring/logger";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("Root error boundary triggered", {
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  return (
    <AppErrorScreen
      message={error.message || "An unexpected error occurred."}
      digest={error.digest}
      reset={reset}
    />
  );
}
