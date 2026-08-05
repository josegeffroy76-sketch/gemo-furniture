"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import ProductPhoto from "./ProductPhoto";
import type { Product, ProductCategory } from "@/lib/types";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { messages } from "@/lib/i18n/messages";

export interface CategoryCardData {
  slug: ProductCategory;
  label: string;
  blurb: string;
  count: number;
  /** First real product in this category, used for the card art. */
  representativeProduct?: Product;
}

export default function Categories({
  categories,
  totalCount,
}: {
  categories: CategoryCardData[];
  totalCount: number;
}) {
  const locale = useLocale();
  const t = messages[locale].categories;

  return (
    <section id="categories" aria-labelledby="categories-heading" className="w-full bg-cream py-16 lg:py-24">
      <div className="container-gemo">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-lg">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-500">
              {t.eyebrow}
            </span>
            <h2
              id="categories-heading"
              className="mt-3 font-display text-[2rem] leading-tight tracking-[-0.015em] text-ink sm:text-[2.6rem]"
              style={{ fontWeight: 400 }}
            >
              {t.heading}
            </h2>
          </div>
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-ink transition-colors hover:text-brand-600"
          >
            {t.viewAll.replace("{count}", String(totalCount))}
            <ArrowUpRight
              size={16}
              strokeWidth={2}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <motion.li
              key={category.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={`/shop?category=${category.slug}`}
                className="group block overflow-hidden rounded-[1.5rem] bg-sand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
              >
                <div className="relative overflow-hidden">
                  {category.representativeProduct ? (
                    <ProductPhoto
                      product={category.representativeProduct}
                      className="h-[280px] w-full transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05] lg:h-[340px]"
                      iconClassName="h-16 w-16"
                    />
                  ) : (
                    <div className="flex h-[280px] w-full items-center justify-center bg-sand-dark text-sm text-ink-muted lg:h-[340px]">
                      {t.comingSoon}
                    </div>
                  )}
                  <span className="absolute right-4 top-4 rounded-full bg-cream/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-soft backdrop-blur">
                    {category.count} {category.count === 1 ? t.piece : t.pieces}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-4 px-5 py-5">
                  <div>
                    <h3 className="font-display text-xl text-ink" style={{ fontWeight: 400 }}>
                      {category.label}
                    </h3>
                    <p className="mt-1.5 text-sm text-ink-soft">{category.blurb}</p>
                  </div>
                  <span
                    className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors group-hover:border-brand-500 group-hover:bg-brand-500 group-hover:text-cream"
                    aria-hidden="true"
                  >
                    <ArrowUpRight size={16} strokeWidth={2} />
                  </span>
                </div>
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
