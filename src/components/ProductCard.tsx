import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice, percentOff } from "@/lib/format";
import ProductImage from "./ProductImage";

export default function ProductCard({ product }: { product: Product }) {
  const off = percentOff(product.price, product.compareAtPrice);

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white/60 transition-shadow hover:shadow-lg hover:shadow-brand-900/5"
    >
      <div className="relative">
        <ProductImage
          icon={product.icon}
          colorway={product.colorway}
          className="aspect-square w-full transition-transform duration-300 group-hover:scale-[1.03]"
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
        <h3 className="text-sm font-medium leading-snug text-ink">{product.name}</h3>
        <p className="line-clamp-2 text-xs leading-relaxed text-ink-soft">
          {product.shortDescription}
        </p>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-base font-semibold text-ink">{formatPrice(product.price)}</span>
          {product.compareAtPrice && (
            <span className="text-xs text-ink-soft/70 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
