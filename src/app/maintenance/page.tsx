import { AppNotFoundScreen } from "@/components/errors/app-not-found-screen";

export default function MaintenancePage() {
  return (
    <AppNotFoundScreen
      title="We'll be right back"
      message="Catalogger is undergoing scheduled maintenance. Please check again soon."
      homeHref="/"
      homeLabel="Refresh"
    />
  );
}
