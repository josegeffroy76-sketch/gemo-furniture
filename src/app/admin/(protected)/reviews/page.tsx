import { getReviews, getAllReviewSummaries, PUBLIC_REVIEW_THRESHOLD } from "@/lib/reviews-store";
import { getAllProducts } from "@/lib/products";
import ReviewStars from "@/components/ReviewStars";
import DeleteReviewButton from "@/components/DeleteReviewButton";

export default async function AdminReviewsPage() {
  const [reviews, summaries, products] = await Promise.all([
    getReviews(),
    getAllReviewSummaries(),
    getAllProducts(),
  ]);
  const productById = new Map(products.map((p) => [p.id, p]));

  const summaryRows = Object.entries(summaries)
    .map(([productId, summary]) => ({ productId, product: productById.get(productId), ...summary }))
    .sort((a, b) => b.count - a.count);

  return (
    <div>
      <h1 className="font-display text-2xl text-ink">Reviews</h1>
      <p className="mt-1 max-w-2xl text-sm text-ink-soft">
        Customers can rate and review each product from their order confirmation page after checkout. A
        product&apos;s star rating and reviews only appear on its storefront page once it has at least{" "}
        {PUBLIC_REVIEW_THRESHOLD} reviews — you can see every review here as soon as it comes in, before that.
      </p>

      {summaryRows.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-xl border border-line bg-white/60">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wide text-ink-soft">
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Rating</th>
                <th className="px-4 py-3 font-medium">Reviews</th>
                <th className="px-4 py-3 font-medium">Public on storefront?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {summaryRows.map((row) => (
                <tr key={row.productId}>
                  <td className="px-4 py-3 text-ink">{row.product?.name ?? row.productId}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <ReviewStars rating={row.average} size={14} />
                      <span className="text-ink-soft">{row.average.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{row.count}</td>
                  <td className="px-4 py-3">
                    {row.visible ? (
                      <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-700">
                        Yes
                      </span>
                    ) : (
                      <span className="rounded-full bg-sand px-2.5 py-1 text-[11px] font-semibold text-ink-soft">
                        {PUBLIC_REVIEW_THRESHOLD - row.count} more needed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2 className="mt-10 font-display text-lg text-ink">All reviews</h2>
      {reviews.length === 0 ? (
        <p className="mt-4 text-sm text-ink-soft">No reviews yet.</p>
      ) : (
        <div className="mt-4 flex flex-col gap-3">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-xl border border-line bg-white/60 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-ink">
                    {productById.get(r.productId)?.name ?? r.productId}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <ReviewStars rating={r.rating} size={14} />
                    <span className="text-[11px] text-ink-soft/70">
                      {r.customerName} · {new Date(r.createdAt).toLocaleDateString("en-US")}
                    </span>
                  </div>
                </div>
                <DeleteReviewButton reviewId={r.id} />
              </div>
              {r.reviewText && <p className="mt-2 text-sm text-ink-soft">{r.reviewText}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
