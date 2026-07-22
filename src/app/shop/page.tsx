import type { Metadata } from "next";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getAllProducts } from "@/lib/products";
import { CATEGORIES } from "@/lib/categories";
import type { ProductCategory } from "@/lib/types";

export const metadata: Metadata = {
  title: "Shop All Furniture",
  description:
    "Browse GEMO Furniture's full collection of space-saving, affordable furniture — sofas, beds, storage, dining, and more.",
};

function isValidCategory(value: string | undefined): value is ProductCategory {
  return CATEGORIES.some((c) => c.slug === value);
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const activeCategory = isValidCategory(category) ? category : undefined;

  const products = (await getAllProducts()).filter((p) =>
    activeCategory ? p.category === activeCategory : true
  );

  return (
    <div className="container-gemo py-12">
      <div className="flex flex-col gap-1.5">
        <h1 className="font-display text-3xl text-ink">
          {activeCategory ? CATEGORIES.find((c) => c.slug === activeCategory)?.label : "Shop All Furniture"}
        </h1>
        <p className="text-sm text-ink-soft">
          {products.length} {products.length === 1 ? "product" : "products"}
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
          All
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
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center text-sm text-ink-soft">
          No products in this category yet — check back soon.
        </p>
      )}
    </div>
  );
}
