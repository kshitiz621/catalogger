import { getPlatformSettings } from "@/lib/actions/platform.actions";
import SettingsForm from "./settings-form";

export default async function PlatformSettingsPage() {
  const settings = await getPlatformSettings();

  return <SettingsForm settings={settings} />;
}
