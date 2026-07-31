import Link from "next/link";
import { Truck, ShieldCheck, BadgeDollarSign } from "lucide-react";
import Logo from "./Logo";
import { CATEGORIES } from "@/lib/categories";

export default function Footer() {
  return (
    <footer className="w-full border-t border-line bg-cream">
      <div className="container-gemo py-16">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-5 text-sm leading-relaxed text-ink-soft">
              High-quality, space-saving furniture at prices below traditional retail — built
              for apartments, dorms, and every first home in between.
            </p>
            <div className="mt-6 flex flex-col gap-2.5 text-xs font-medium text-ink-soft">
              <span className="inline-flex items-center gap-1.5">
                <BadgeDollarSign className="h-4 w-4 text-brand-500" /> Below retail pricing
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-brand-500" /> Fast nationwide shipping
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-brand-500" /> Quality you can trust
              </span>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            <nav aria-label="Shop">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
                Shop
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

            <nav aria-label="Company">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
                Company
              </h2>
              <ul className="mt-5 space-y-3">
                <li>
                  <Link href="/about" className="text-sm text-ink-soft transition-colors hover:text-brand-600">
                    About GEMO
                  </Link>
                </li>
                <li>
                  <Link href="/shop" className="text-sm text-ink-soft transition-colors hover:text-brand-600">
                    Shop All
                  </Link>
                </li>
                <li>
                  <Link href="/cart" className="text-sm text-ink-soft transition-colors hover:text-brand-600">
                    Cart
                  </Link>
                </li>
              </ul>
            </nav>

            <nav aria-label="Legal">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
                Legal
              </h2>
              <ul className="mt-5 space-y-3">
                <li>
                  <Link href="/privacy" className="text-sm text-ink-soft transition-colors hover:text-brand-600">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-sm text-ink-soft transition-colors hover:text-brand-600">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="text-sm text-ink-soft transition-colors hover:text-brand-600">
                    Return Policy
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="text-sm text-ink-soft transition-colors hover:text-brand-600">
                    Shipping Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/payment-policy"
                    className="text-sm text-ink-soft transition-colors hover:text-brand-600"
                  >
                    Payment Policy
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-line pt-7 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} GEMO Furniture. All rights reserved.</p>
          <p>Shipping across the United States.</p>
        </div>
      </div>
    </footer>
  );
}
