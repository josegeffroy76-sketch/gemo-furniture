import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import ProductImage from "@/components/ProductImage";
import ProductCard from "@/components/ProductCard";
import AddToCartButton from "@/components/AddToCartButton";
import { getAllProducts, getProductBySlug, getProductsByCategory } from "@/lib/products";
import { getCategoryLabel } from "@/lib/categories";
import { formatPrice, percentOff } from "@/lib/format";

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.shortDescription,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const off = percentOff(product.price, product.compareAtPrice);
  const related = getProductsByCategory(product.category)
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="container-gemo py-10">
      <nav className="flex items-center gap-1.5 text-xs text-ink-soft">
        <Link href="/shop" className="hover:text-brand-600">
          Shop
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/shop?category=${product.category}`} className="hover:text-brand-600">
          {getCategoryLabel(product.category)}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <ProductImage
          icon={product.icon}
          colorway={product.colorway}
          className="aspect-square w-full"
          iconClassName="h-32 w-32"
        />

        <div>
          {product.bestseller && (
            <span className="mb-3 inline-flex rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-cream">
              Bestseller
            </span>
          )}
          <h1 className="font-display text-2xl text-ink md:text-3xl">{product.name}</h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">{product.shortDescription}</p>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-2xl font-semibold text-ink">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <>
                <span className="text-base text-ink-soft/70 line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
                {off && (
                  <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
                    Save {off}%
                  </span>
                )}
              </>
            )}
          </div>

          <div className="mt-7">
            <AddToCartButton productId={product.id} className="w-full sm:w-auto" />
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-4 border-y border-line py-6 text-sm">
            <div>
              <dt className="text-ink-soft">Dimensions</dt>
              <dd className="mt-1 font-medium text-ink">{product.dimensions}</dd>
            </div>
            <div>
              <dt className="text-ink-soft">Weight</dt>
              <dd className="mt-1 font-medium text-ink">{product.weightLbs} lb</dd>
            </div>
          </dl>

          <ul className="mt-6 space-y-2">
            {product.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-ink-soft">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-500" />
                {f}
              </li>
            ))}
          </ul>

          <p className="mt-6 text-sm leading-relaxed text-ink-soft">{product.description}</p>

          <div className="mt-8 flex flex-col gap-3 text-xs text-ink-soft sm:flex-row sm:gap-6">
            <span className="inline-flex items-center gap-1.5">
              <Truck className="h-4 w-4 text-brand-500" /> Fast shipping across the USA
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-brand-500" /> Quality checked before it ships
            </span>
            <span className="inline-flex items-center gap-1.5">
              <RotateCcw className="h-4 w-4 text-brand-500" /> 30-day returns
            </span>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-xl text-ink">You may also like</h2>
          <div className="mt-6 grid grid-cols-2 gap-5 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
