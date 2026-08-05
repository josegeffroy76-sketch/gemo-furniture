import Link from "next/link";
import { XCircle } from "lucide-react";
import { getLocale } from "@/lib/i18n/get-locale";
import { messages } from "@/lib/i18n/messages";

export default async function CheckoutCancelPage() {
  const locale = await getLocale();
  const t = messages[locale].checkoutCancel;

  return (
    <div className="container-gemo flex flex-col items-center py-24 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sand text-ink-soft">
        <XCircle className="h-7 w-7" />
      </span>
      <h1 className="mt-5 font-display text-3xl text-ink">{t.title}</h1>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-soft">{t.body}</p>
      <Link
        href="/cart"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-cream hover:bg-brand-600"
      >
        {t.returnToCart}
      </Link>
    </div>
  );
}
