"use client";

import { useState } from "react";
import { Star, Loader2, CheckCircle2 } from "lucide-react";

/**
 * Rating + review form for one purchased product, shown on the checkout
 * success page. orderId is the Stripe Checkout Session ID — the API route
 * verifies the product actually belongs to that order before saving.
 */
export default function ReviewForm({
  orderId,
  productId,
  productName,
  defaultName,
}: {
  orderId: string;
  productId: string;
  productName: string;
  defaultName: string;
}) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [customerName, setCustomerName] = useState(defaultName);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating < 1) {
      setError("Please select a star rating first.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          productId,
          rating,
          reviewText,
          customerName: customerName.trim() || "Anonymous",
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error ?? "Couldn't submit your review.");
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-line bg-white/60 px-4 py-3 text-sm text-ink-soft">
        <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-600" />
        Thanks for reviewing {productName}!
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-line bg-white/60 p-4">
      <p className="text-sm font-medium text-ink">{productName}</p>
      <div className="mt-2 flex items-center gap-1" onMouseLeave={() => setHoverRating(0)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            onMouseEnter={() => setHoverRating(n)}
            className="p-0.5"
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
          >
            <Star
              className={`h-6 w-6 ${
                n <= (hoverRating || rating) ? "fill-brand-500 text-brand-500" : "fill-none text-line"
              }`}
            />
          </button>
        ))}
      </div>
      <textarea
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        placeholder="What did you think of this product? (optional)"
        rows={2}
        className="mt-2 w-full rounded-lg border border-line px-3 py-2 text-sm"
      />
      <input
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
        placeholder="Your name (shown with your review)"
        className="mt-2 w-full rounded-lg border border-line px-3 py-2 text-sm sm:w-64"
      />
      {error && <p className="mt-1.5 text-xs text-brand-700">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="mt-3 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs font-semibold text-cream disabled:opacity-60"
      >
        {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
        Submit review
      </button>
    </form>
  );
}
