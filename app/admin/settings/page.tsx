import SettingsForm from "@/components/admin/SettingsForm";
import { getSettings } from "@/lib/settings";

export const metadata = { title: "Settings" };
export default async function AdminSettings() {
  return <><h1 className="mb-2 font-serif text-3xl text-forest">Settings</h1><p className="mb-6 text-sm text-muted">Payment and image-upload keys stay in your environment variables, not here.</p><SettingsForm initial={await getSettings()} /></>;
}
