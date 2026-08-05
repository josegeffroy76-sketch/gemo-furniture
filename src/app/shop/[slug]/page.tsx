import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import ProductPhoto from "@/components/ProductPhoto";
import ProductCard from "@/components/ProductCard";
import AddToCartButton from "@/components/AddToCartButton";
import ReviewStars from "@/components/ReviewStars";
import { getAllProducts, getProductBySlug, getProductsByCategory } from "@/lib/products";
import { getCategoryLabel } from "@/lib/categories";
import { getReviewSummary, getReviewsForProduct } from "@/lib/reviews-store";
import { getSiteSettings } from "@/lib/site-settings";
import { formatPrice, percentOff } from "@/lib/format";
import { getLocale } from "@/lib/i18n/get-locale";
import { localizeCategory } from "@/lib/i18n/category-translations";
import { localizeProduct } from "@/lib/i18n/product-translations";
import { messages } from "@/lib/i18n/messages";

export async function generateStaticParams() {
  return (await getAllProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
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
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const locale = await getLocale();
  const t = messages[locale].product;
  const localizedProduct = localizeProduct(product, locale);

  const off = percentOff(product.price, product.compareAtPrice);
  const related = (await getProductsByCategory(product.category))
    .filter((p) => p.id !== product.id)
    .slice(0, 4);
  const categoryLabel = localizeCategory(
    { slug: product.category, label: await getCategoryLabel(product.category), blurb: "" },
    locale
  ).label;

  const reviewSummary = await getReviewSummary(product.id);
  const reviews = reviewSummary.visible ? await getReviewsForProduct(product.id) : [];
  const settings = await getSiteSettings();
  const freeShipping = settings.freeCheapestShipping;

  return (
    <div className="container-gemo py-10">
      <nav className="flex items-center gap-1.5 text-xs text-ink-soft">
        <Link href="/shop" className="hover:text-brand-600">
          {t.shop}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/shop?category=${product.category}`} className="hover:text-brand-600">
          {categoryLabel}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-ink">{localizedProduct.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <ProductPhoto
          product={product}
          className="aspect-square w-full"
          iconClassName="h-32 w-32"
        />

        <div>
          {product.bestseller && (
            <span className="mb-3 inline-flex rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-cream">
              {t.bestseller}
            </span>
          )}
          <h1 className="font-display text-2xl text-ink md:text-3xl">{localizedProduct.name}</h1>
          {reviewSummary.visible && (
            <div className="mt-2 flex items-center gap-2">
              <ReviewStars rating={reviewSummary.average} />
              <span className="text-xs text-ink-soft">
                {reviewSummary.average.toFixed(1)} · {reviewSummary.count}{" "}
                {reviewSummary.count === 1 ? t.review : t.reviews}
              </span>
            </div>
          )}
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">{localizedProduct.shortDescription}</p>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-2xl font-semibold text-ink">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <>
                <span className="text-base text-ink-soft/70 line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
                {off && (
                  <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
                    {t.save.replace("{percent}", String(off))}
                  </span>
                )}
              </>
            )}
          </div>
          {freeShipping && (
            <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600">
              <Truck className="h-4 w-4" /> {t.freeShippingItem}
            </p>
          )}

          <div className="mt-7">
            <AddToCartButton productId={product.id} className="w-full sm:w-auto" />
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-4 border-y border-line py-6 text-sm">
            <div>
              <dt className="text-ink-soft">{t.dimensions}</dt>
              <dd className="mt-1 font-medium text-ink">{product.dimensions}</dd>
            </div>
            <div>
              <dt className="text-ink-soft">{t.weight}</dt>
              <dd className="mt-1 font-medium text-ink">{product.weightLbs} {t.lb}</dd>
            </div>
          </dl>

          <ul className="mt-6 space-y-2">
            {localizedProduct.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-ink-soft">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-500" />
                {f}
              </li>
            ))}
          </ul>

          <p className="mt-6 text-sm leading-relaxed text-ink-soft">{localizedProduct.description}</p>

          <div className="mt-8 flex flex-col gap-3 text-xs text-ink-soft sm:flex-row sm:gap-6">
            <span className="inline-flex items-center gap-1.5">
              <Truck className="h-4 w-4 text-brand-500" /> {t.fastShippingUSA}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-brand-500" /> {t.qualityChecked}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <RotateCcw className="h-4 w-4 text-brand-500" /> {t.returns30}
            </span>
          </div>
        </div>
      </div>

      {reviewSummary.visible && (
        <section className="mt-16 border-t border-line pt-10">
          <h2 className="font-display text-xl text-ink">{t.customerReviews}</h2>
          <div className="mt-2 flex items-center gap-2">
            <ReviewStars rating={reviewSummary.average} size={18} />
            <span className="text-sm text-ink-soft">
              {reviewSummary.average.toFixed(1)} {t.outOf5} · {reviewSummary.count} {t.reviews}
            </span>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {reviews.map((r) => (
              <div key={r.id} className="rounded-xl border border-line bg-white/60 p-4">
                <div className="flex items-center justify-between">
                  <ReviewStars rating={r.rating} size={14} />
                  <span className="text-[11px] text-ink-soft/70">
                    {new Date(r.createdAt).toLocaleDateString(locale === "es" ? "es-US" : "en-US")}
                  </span>
                </div>
                {r.reviewText && <p className="mt-2 text-sm text-ink-soft">{r.reviewText}</p>}
                <p className="mt-2 text-xs font-medium text-ink">{r.customerName}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-xl text-ink">{t.youMayAlsoLike}</h2>
          <div className="mt-6 grid grid-cols-2 gap-5 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} freeShipping={freeShipping} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
