import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import ClearCartOnMount from "@/components/ClearCartOnMount";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { formatPrice } from "@/lib/format";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  let email: string | null = null;
  let total: number | null = null;

  if (session_id && isStripeConfigured()) {
    try {
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.retrieve(session_id);
      email = session.customer_details?.email ?? null;
      total = session.amount_total;
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

      <p className="mt-6 max-w-md text-xs text-ink-soft/70">
        Once your order has had some time to arrive and settle in, we&apos;ll email you asking how it
        went and inviting you to rate and review what you bought.
      </p>

      <Link
        href="/shop"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-cream hover:bg-brand-600"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
