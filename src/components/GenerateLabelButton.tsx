"use client";

import { useRef, useState } from "react";
import { Loader2, Tag, ExternalLink, Printer, X } from "lucide-react";
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
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  function handlePrint() {
    // Embedding the PDF in an <iframe> (rather than opening the URL in a
    // new tab) sidesteps the browser's "download PDFs instead of opening
    // them" setting, which only applies to top-level navigation — PDFs
    // embedded in a frame always render inline, so the print dialog always
    // has something to print.
    iframeRef.current?.contentWindow?.print();
  }

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
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowPrintPreview(true)}
            className="inline-flex items-center gap-1 font-semibold text-brand-600 hover:text-brand-700"
          >
            <Printer className="h-3 w-3" /> Print label
          </button>
          <a
            href={label.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-ink-soft hover:text-brand-600"
          >
            View <ExternalLink className="h-3 w-3" />
          </a>
        </div>
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

        {showPrintPreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4">
            <div className="flex h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-line px-4 py-3">
                <p className="text-sm font-semibold text-ink">Shipping label</p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-1.5 text-xs font-semibold text-cream hover:bg-ink/90"
                  >
                    <Printer className="h-3.5 w-3.5" /> Print
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPrintPreview(false)}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-ink-soft hover:bg-sand"
                    title="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <iframe ref={iframeRef} src={label.url} title="Shipping label" className="flex-1" />
            </div>
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
