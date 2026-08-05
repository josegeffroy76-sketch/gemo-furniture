import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import ClearCartOnMount from "@/components/ClearCartOnMount";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { formatPrice } from "@/lib/format";
import { getLocale } from "@/lib/i18n/get-locale";
import { messages } from "@/lib/i18n/messages";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const locale = await getLocale();
  const t = messages[locale].checkoutSuccess;

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
      <h1 className="mt-5 font-display text-3xl text-ink">{t.thankYou}</h1>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
        {email ? t.confirmationSent(email) : t.orderPlaced} {t.willEmailTracking}
      </p>
      {total !== null && (
        <p className="mt-4 text-sm font-semibold text-ink">{t.orderTotal} {formatPrice(total)}</p>
      )}

      <p className="mt-6 max-w-md text-xs text-ink-soft/70">{t.reviewInvite}</p>

      <Link
        href="/shop"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-cream hover:bg-brand-600"
      >
        {t.continueShopping}
      </Link>
    </div>
  );
}
