import { getAppSession } from "@/lib/auth/app-session";
import { redirect } from "next/navigation";

export default async function PlatformIndexPage() {
  const session = await getAppSession();

  if (session?.user.role === "SUPER_ADMIN") {
    redirect("/platform/dashboard");
  }

  redirect("/platform/login");
}
