import { AppNotFoundScreen } from "@/components/errors/app-not-found-screen";

export default function PlatformNotFound() {
  return (
    <AppNotFoundScreen
      homeHref="/platform/dashboard"
      homeLabel="Platform Home"
    />
  );
}
