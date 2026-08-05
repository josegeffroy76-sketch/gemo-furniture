import type { Metadata } from "next";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getAllProducts } from "@/lib/products";
import { getSiteSettings } from "@/lib/site-settings";
import { getCategories } from "@/lib/categories";
import { getLocale } from "@/lib/i18n/get-locale";
import { localizeCategories } from "@/lib/i18n/category-translations";
import { messages } from "@/lib/i18n/messages";

export const metadata: Metadata = {
  title: "Shop All Furniture",
  description:
    "Browse GEMO Furniture's full collection of space-saving, affordable furniture — sofas, beds, storage, dining, and more.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [allProducts, settings, rawCategories, locale] = await Promise.all([
    getAllProducts(),
    getSiteSettings(),
    getCategories(),
    getLocale(),
  ]);
  const t = messages[locale].shop;
  const CATEGORIES = localizeCategories(rawCategories, locale);
  const activeCategory = CATEGORIES.some((c) => c.slug === category) ? category : undefined;
  const products = allProducts.filter((p) => (activeCategory ? p.category === activeCategory : true));

  return (
    <div className="container-gemo py-12">
      <div className="flex flex-col gap-1.5">
        <h1 className="font-display text-3xl text-ink">
          {activeCategory ? CATEGORIES.find((c) => c.slug === activeCategory)?.label : t.titleAll}
        </h1>
        <p className="text-sm text-ink-soft">
          {products.length} {products.length === 1 ? t.product : t.products}
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <Link
          href="/shop"
          className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
            !activeCategory
              ? "border-brand-500 bg-brand-500 text-cream"
              : "border-line text-ink-soft hover:bg-sand"
          }`}
        >
          {t.all}
        </Link>
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/shop?category=${cat.slug}`}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              activeCategory === cat.slug
                ? "border-brand-500 bg-brand-500 text-cream"
                : "border-line text-ink-soft hover:bg-sand"
            }`}
          >
            {cat.label}
          </Link>
        ))}
      </div>

      {products.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              freeShipping={settings.freeCheapestShipping}
            />
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center text-sm text-ink-soft">{t.emptyState}</p>
      )}
    </div>
  );
}
