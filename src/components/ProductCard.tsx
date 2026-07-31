import Link from "next/link";
import { Truck } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPrice, percentOff } from "@/lib/format";
import ProductPhoto from "./ProductPhoto";

export default function ProductCard({
  product,
  freeShipping = false,
}: {
  product: Product;
  /** Mirrors the admin "Free shipping on cheapest option" toggle (see /admin/settings). */
  freeShipping?: boolean;
}) {
  const off = percentOff(product.price, product.compareAtPrice);

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-[1.25rem] border border-line bg-white/60 transition-shadow duration-300 hover:shadow-lg hover:shadow-brand-900/5"
    >
      <div className="relative overflow-hidden">
        <ProductPhoto
          product={product}
          className="aspect-square w-full transition-transform duration-[600ms] ease-out group-hover:scale-[1.04]"
          iconClassName="h-20 w-20"
        />
        {(product.bestseller || product.newArrival || off) && (
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {product.bestseller && (
              <span className="rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-cream">
                Bestseller
              </span>
            )}
            {product.newArrival && (
              <span className="rounded-full bg-brand-600 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-cream">
                New
              </span>
            )}
            {off && (
              <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-brand-700 shadow-sm">
                {off}% below retail
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <h3 className="font-display text-base leading-snug text-ink" style={{ fontWeight: 400 }}>
          {product.name}
        </h3>
        <p className="line-clamp-2 text-xs leading-relaxed text-ink-soft">
          {product.shortDescription}
        </p>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-base font-semibold text-ink">{formatPrice(product.price)}</span>
          {product.compareAtPrice && (
            <span className="text-xs text-ink-muted line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
        {freeShipping && (
          <span className="mt-0.5 inline-flex w-fit items-center gap-1 text-[11px] font-semibold text-brand-600">
            <Truck className="h-3 w-3" /> Free shipping
          </span>
        )}
      </div>
    </Link>
  );
}
