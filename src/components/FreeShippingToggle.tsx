"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function FreeShippingToggle({ initialEnabled }: { initialEnabled: boolean }) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  async function handleToggle() {
    const next = !enabled;
    setEnabled(next); // optimistic
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ freeCheapestShipping: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Couldn't save this setting.");
      setSavedAt(Date.now());
    } catch (err) {
      setEnabled(!next); // revert on failure
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't save this setting. If this keeps happening, make sure a Redis/KV store is connected in Vercel."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl border border-line bg-white/60 p-6">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h3 className="text-sm font-semibold text-ink">Free shipping on cheapest option</h3>
          <p className="mt-1.5 max-w-md text-sm leading-relaxed text-ink-soft">
            When on, the cheapest shipping rate quoted at checkout shows as{" "}
            <strong>FREE</strong> for every order. Faster options (like expedited) still cost
            their real quoted price. Turn this on any time — for a promotion like Black Friday,
            or as your everyday policy — and off again whenever you want, no code changes needed.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={handleToggle}
          disabled={saving}
          className={`relative h-7 w-12 shrink-0 rounded-full transition-colors disabled:opacity-60 ${
            enabled ? "bg-brand-500" : "bg-ink/15"
          }`}
        >
          <span
            className={`absolute top-1 left-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${
              enabled ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs">
        {saving && (
          <span className="inline-flex items-center gap-1.5 text-ink-soft">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…
          </span>
        )}
        {!saving && error && <span className="text-brand-700">{error}</span>}
        {!saving && !error && savedAt && (
          <span className="text-ink-soft">
            Saved — {enabled ? "free shipping is on." : "free shipping is off."}
          </span>
        )}
        {!saving && !error && !savedAt && (
          <span className="text-ink-soft">
            Currently {enabled ? "on" : "off"} for all customers right now.
          </span>
        )}
      </div>
    </div>
  );
}
