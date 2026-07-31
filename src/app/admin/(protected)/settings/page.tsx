import { getSiteSettings } from "@/lib/site-settings";
import FreeShippingToggle from "@/components/FreeShippingToggle";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="font-display text-2xl text-ink">Settings</h1>
      <p className="mt-1 max-w-2xl text-sm text-ink-soft">
        Store-wide toggles you can flip any time — no code changes or redeploy needed.
      </p>

      <div className="mt-6 max-w-2xl">
        <FreeShippingToggle initialEnabled={settings.freeCheapestShipping} />
      </div>
    </div>
  );
}
