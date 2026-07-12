"use client";

import { AppErrorScreen } from "@/components/errors/app-error-screen";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <AppErrorScreen
          title="Application error"
          message={error.message || "A critical error occurred."}
          digest={error.digest}
          reset={reset}
        />
      </body>
    </html>
  );
}
