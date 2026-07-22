import Link from "next/link";
import { XCircle } from "lucide-react";

export default function CheckoutCancelPage() {
  return (
    <div className="container-gemo flex flex-col items-center py-24 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sand text-ink-soft">
        <XCircle className="h-7 w-7" />
      </span>
      <h1 className="mt-5 font-display text-3xl text-ink">Checkout canceled</h1>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
        No charge was made. Your cart is still saved whenever you&apos;re ready to finish.
      </p>
      <Link
        href="/cart"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-cream hover:bg-brand-600"
      >
        Return to Cart
      </Link>
    </div>
  );
}
