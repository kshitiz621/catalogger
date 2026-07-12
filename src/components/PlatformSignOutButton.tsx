"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { authClient } from "@/lib/auth/client";

export default function PlatformSignOutButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={async () => {
        await authClient.signOut();
        router.push("/platform/login");
        router.refresh();
      }}
      className="flex w-full items-center justify-start rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
    >
      <LogOut className="mr-2 h-4 w-4" />
      Sign out
    </button>
  );
}
