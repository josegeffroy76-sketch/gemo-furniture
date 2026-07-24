import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/orders-store";
import { getProductById } from "@/lib/products";
import { hasReviewed } from "@/lib/reviews-store";
import ReviewForm from "@/components/ReviewForm";
import type { Product } from "@/lib/types";

/**
 * Reached via the "rate your purchase" email (see
 * /api/cron/review-requests) — intentionally NOT linked from the checkout
 * success page, since a customer can't judge product quality the moment
 * they've just paid, before it's even shipped.
 */
export default async function ReviewOrderPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order = await getOrderById(orderId);
  if (!order || order.status !== "paid") notFound();

  const items = await Promise.all(
    order.lines.map(async (line) => ({
      product: await getProductById(line.productId),
      alreadyReviewed: await hasReviewed(orderId, line.productId),
    }))
  );
  const reviewable = items.filter(
    (i): i is { product: Product; alreadyReviewed: boolean } => Boolean(i.product)
  );

  return (
    <div className="container-gemo max-w-lg py-16 text-center">
      <h1 className="font-display text-2xl text-ink">Rate your purchase</h1>
      <p className="mt-2 text-sm text-ink-soft">
        Thanks for shopping with GEMO Furniture! Let us know what you thought of each item below.
      </p>

      {reviewable.length === 0 ? (
        <p className="mt-8 text-sm text-ink-soft">
          We couldn&apos;t find any reviewable products for this order.
        </p>
      ) : (
        <div className="mt-8 flex flex-col gap-3 text-left">
          {reviewable.map(({ product, alreadyReviewed }) => (
            <ReviewForm
              key={product.id}
              orderId={orderId}
              productId={product.id}
              productName={product.name}
              defaultName={order.customerName ?? ""}
              initiallySubmitted={alreadyReviewed}
            />
          ))}
        </div>
      )}
    </div>
  );
}
