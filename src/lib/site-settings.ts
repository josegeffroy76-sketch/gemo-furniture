import { readJsonFile, writeJsonFile } from "./json-file-store";

/**
 * Store-wide toggles the admin can flip from /admin/settings without a
 * redeploy — e.g. turning a shipping promotion on for Black Friday and back
 * off afterward. Backed by the same Redis/KV (or local JSON fallback) store
 * used for products and orders — see json-file-store.ts.
 */
export interface SiteSettings {
  /**
   * When true, the cheapest shipping rate quoted at checkout is shown as
   * free ($0) for every order; any pricier option (e.g. expedited) still
   * costs its real quoted amount. The business is expected to have already
   * built the average shipping cost into product pricing — this only
   * controls what's *displayed and charged* at checkout, it doesn't change
   * what GEMO actually pays Shippo/the carrier for the label.
   */
  freeCheapestShipping: boolean;
}

const SETTINGS_KEY = "site-settings.json";

const DEFAULT_SETTINGS: SiteSettings = {
  freeCheapestShipping: false,
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const stored = await readJsonFile<Partial<SiteSettings>>(SETTINGS_KEY, {});
  return { ...DEFAULT_SETTINGS, ...stored };
}

export async function updateSiteSettings(patch: Partial<SiteSettings>): Promise<SiteSettings> {
  const current = await getSiteSettings();
  const next: SiteSettings = { ...current, ...patch };
  await writeJsonFile(SETTINGS_KEY, next);
  return next;
}
