"use client"

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={async () => {
        await authClient.signOut();
        router.push("/login");
        router.refresh();
      }}
      aria-label="Sign out"
      title="Sign out"
    >
      <LogOut className="h-4 w-4 text-muted-foreground" />
    </Button>
  );
}
