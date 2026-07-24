import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import ClearCartOnMount from "@/components/ClearCartOnMount";
import ReviewForm from "@/components/ReviewForm";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { getProductById } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  let email: string | null = null;
  let total: number | null = null;
  let reviewableProducts: Product[] = [];
  let defaultReviewerName = "";

  if (session_id && isStripeConfigured()) {
    try {
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.retrieve(session_id);
      email = session.customer_details?.email ?? null;
      total = session.amount_total;

      const metadata = session.metadata ?? {};
      try {
        const cartLines: { productId: string; quantity: number }[] = metadata.cartLines
          ? JSON.parse(metadata.cartLines)
          : [];
        const products = await Promise.all(cartLines.map((l) => getProductById(l.productId)));
        reviewableProducts = products.filter((p): p is Product => Boolean(p));
      } catch {
        // Cart too large to fit in metadata (or malformed) — skip the review prompt rather than error the page.
      }
      try {
        const shippingAddress = metadata.shippingAddress ? JSON.parse(metadata.shippingAddress) : null;
        defaultReviewerName = shippingAddress?.name ?? "";
      } catch {
        // Ignore — the name field just starts blank.
      }
    } catch {
      // Session lookup failed (e.g. test data) — still show a generic confirmation.
    }
  }

  return (
    <div className="container-gemo flex flex-col items-center py-24 text-center">
      <ClearCartOnMount />
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600">
        <CheckCircle2 className="h-7 w-7" />
      </span>
      <h1 className="mt-5 font-display text-3xl text-ink">Thank you for your order!</h1>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
        {email
          ? `A confirmation has been sent to ${email}.`
          : "Your order has been placed."}{" "}
        We&apos;ll email you tracking details as soon as it ships.
      </p>
      {total !== null && (
        <p className="mt-4 text-sm font-semibold text-ink">Order total: {formatPrice(total)}</p>
      )}

      {reviewableProducts.length > 0 && session_id && (
        <section className="mt-14 w-full max-w-lg text-left">
          <h2 className="text-center font-display text-lg text-ink">Rate what you bought</h2>
          <p className="mt-1 text-center text-xs text-ink-soft">
            Your reviews help other shoppers — and once a product has a few, they show up on its page.
          </p>
          <div className="mt-5 flex flex-col gap-3">
            {reviewableProducts.map((p) => (
              <ReviewForm
                key={p.id}
                orderId={session_id}
                productId={p.id}
                productName={p.name}
                defaultName={defaultReviewerName}
              />
            ))}
          </div>
        </section>
      )}

      <Link
        href="/shop"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-cream hover:bg-brand-600"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
