import Link from "next/link";
import { Truck, ShieldCheck, BadgeDollarSign } from "lucide-react";
import Logo from "./Logo";
import { CATEGORIES } from "@/lib/categories";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-sand">
      <div className="container-gemo grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-soft">
            High-quality, space-saving furniture at prices below traditional retail —
            built for apartments, dorms, and every first home in between. Furnish your
            home for less. Live better with GEMO Furniture.
          </p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-ink-soft">
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

        <div>
          <h3 className="text-sm font-semibold text-ink">Shop</h3>
          <ul className="mt-4 space-y-2.5">
            {CATEGORIES.slice(0, 5).map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/shop?category=${c.slug}`}
                  className="text-sm text-ink-soft hover:text-brand-600"
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-ink">Company</h3>
          <ul className="mt-4 space-y-2.5">
            <li>
              <Link href="/about" className="text-sm text-ink-soft hover:text-brand-600">
                About GEMO
              </Link>
            </li>
            <li>
              <Link href="/shop" className="text-sm text-ink-soft hover:text-brand-600">
                Shop All
              </Link>
            </li>
            <li>
              <Link href="/cart" className="text-sm text-ink-soft hover:text-brand-600">
                Cart
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line/70">
        <div className="container-gemo flex flex-col gap-2 py-5 text-xs text-ink-soft/80 md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} GEMO Furniture. All rights reserved.</p>
          <p>Shipping across the United States.</p>
        </div>
      </div>
    </footer>
  );
}
