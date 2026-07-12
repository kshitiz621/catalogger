import { redirect } from "next/navigation";
import { PlatformGuardService } from "@/lib/security/platform-guard";

export default async function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [registrationEnabled, maintenanceActive] = await Promise.all([
    PlatformGuardService.isRegistrationEnabled(),
    PlatformGuardService.isMaintenanceActive(),
  ]);

  if (maintenanceActive) {
    redirect("/maintenance");
  }

  if (!registrationEnabled) {
    redirect("/login?registration=closed");
  }

  return children;
}
