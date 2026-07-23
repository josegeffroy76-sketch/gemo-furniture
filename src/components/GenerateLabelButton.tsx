"use client";

import { useState } from "react";
import { Loader2, Tag, ExternalLink } from "lucide-react";
import type { OrderLabel } from "@/lib/orders-store";
import { formatPrice } from "@/lib/format";

async function parseJsonResponse<T>(res: Response): Promise<{ data: T | null; error: string | null }> {
  const text = await res.text();
  if (!text) {
    return {
      data: null,
      error: res.ok ? null : `The server didn't respond as expected (status ${res.status}). Please try again.`,
    };
  }
  try {
    return { data: JSON.parse(text), error: null };
  } catch {
    return { data: null, error: "The server sent back an unexpected response. Please try again." };
  }
}

export default function GenerateLabelButton({ orderId, initialLabel }: { orderId: string; initialLabel: OrderLabel | null }) {
  const [label, setLabel] = useState<OrderLabel | null>(initialLabel);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [priceMismatch, setPriceMismatch] = useState<{ purchasedAmount: number } | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/label`, { method: "POST" });
      const { data, error: parseError } = await parseJsonResponse<{
        label?: OrderLabel;
        error?: string;
        priceMismatch?: { purchasedAmount: number } | null;
      }>(res);
      if (parseError) throw new Error(parseError);
      if (!res.ok || !data?.label) throw new Error(data?.error ?? "Couldn't generate the label.");
      setLabel(data.label);
      setPriceMismatch(data.priceMismatch ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (label) {
    return (
      <div className="text-xs">
        <a
          href={label.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-semibold text-brand-600 hover:text-brand-700"
        >
          View label <ExternalLink className="h-3 w-3" />
        </a>
        {label.trackingNumber && (
          <div className="mt-1 text-ink-soft">
            {label.trackingUrlProvider ? (
              <a href={label.trackingUrlProvider} target="_blank" rel="noopener noreferrer" className="hover:text-brand-600">
                {label.trackingNumber}
              </a>
            ) : (
              label.trackingNumber
            )}
          </div>
        )}
        {priceMismatch && (
          <div className="mt-1 text-[11px] text-amber-700">
            Original service unavailable — purchased at {formatPrice(priceMismatch.purchasedAmount)} instead.
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-sand disabled:opacity-60"
      >
        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Tag className="h-3.5 w-3.5" />}
        {loading ? "Generating…" : "Generate Label"}
      </button>
      {error && <p className="mt-1.5 max-w-xs text-[11px] text-brand-700">{error}</p>}
    </div>
  );
}
