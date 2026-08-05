import Link from "next/link";
import { Truck, ShieldCheck, BadgeDollarSign } from "lucide-react";
import Logo from "./Logo";
import { getCategories } from "@/lib/categories";
import { getLocale } from "@/lib/i18n/get-locale";
import { localizeCategories } from "@/lib/i18n/category-translations";
import { messages } from "@/lib/i18n/messages";

export default async function Footer() {
  const [rawCategories, locale] = await Promise.all([getCategories(), getLocale()]);
  const CATEGORIES = localizeCategories(rawCategories, locale);
  const t = messages[locale].footer;

  return (
    <footer className="w-full border-t border-line bg-cream">
      <div className="container-gemo py-16">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-5 text-sm leading-relaxed text-ink-soft">{t.tagline}</p>
            <div className="mt-6 flex flex-col gap-2.5 text-xs font-medium text-ink-soft">
              <span className="inline-flex items-center gap-1.5">
                <BadgeDollarSign className="h-4 w-4 text-brand-500" /> {t.belowRetail}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-brand-500" /> {t.fastShipping}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-brand-500" /> {t.qualityTrust}
              </span>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            <nav aria-label={t.shopHeading}>
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
                {t.shopHeading}
              </h2>
              <ul className="mt-5 space-y-3">
                {CATEGORIES.slice(0, 5).map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/shop?category=${c.slug}`}
                      className="text-sm text-ink-soft transition-colors hover:text-brand-600"
                    >
                      {c.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label={t.companyHeading}>
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
                {t.companyHeading}
              </h2>
              <ul className="mt-5 space-y-3">
                <li>
                  <Link href="/about" className="text-sm text-ink-soft transition-colors hover:text-brand-600">
                    {t.aboutGemo}
                  </Link>
                </li>
                <li>
                  <Link href="/shop" className="text-sm text-ink-soft transition-colors hover:text-brand-600">
                    {t.shopAllLink}
                  </Link>
                </li>
                <li>
                  <Link href="/cart" className="text-sm text-ink-soft transition-colors hover:text-brand-600">
                    {t.cartLink}
                  </Link>
                </li>
              </ul>
            </nav>

            <nav aria-label={t.legalHeading}>
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
                {t.legalHeading}
              </h2>
              <ul className="mt-5 space-y-3">
                <li>
                  <Link href="/privacy" className="text-sm text-ink-soft transition-colors hover:text-brand-600">
                    {t.privacy}
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-sm text-ink-soft transition-colors hover:text-brand-600">
                    {t.terms}
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="text-sm text-ink-soft transition-colors hover:text-brand-600">
                    {t.returns}
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="text-sm text-ink-soft transition-colors hover:text-brand-600">
                    {t.shipping}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/payment-policy"
                    className="text-sm text-ink-soft transition-colors hover:text-brand-600"
                  >
                    {t.payment}
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-line pt-7 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} {t.rightsReserved}</p>
          <p>{t.shippingAcrossUS}</p>
        </div>
      </div>
    </footer>
  );
}
