"use client";

import Link from "next/link";
import { ArrowRight, Star, Truck } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export default function Hero({
  imageUrl,
  featuredProduct,
}: {
  /** Falls back to the existing icon-placeholder look when not set. */
  imageUrl?: string;
  featuredProduct?: Product;
}) {
  return (
    <section className="relative w-full overflow-hidden bg-cream" aria-labelledby="hero-heading">
      <div className="container-gemo grid items-center gap-12 pb-16 pt-10 lg:grid-cols-[1fr_1.05fr] lg:gap-16 lg:pb-24 lg:pt-14">
        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.09, delayChildren: 0.05 }}
          className="max-w-xl"
        >
          <motion.span
            variants={fadeUp}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-sand/60 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-500"
          >
            Furnish your home for less
          </motion.span>

          <motion.h1
            id="hero-heading"
            variants={fadeUp}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 text-balance font-display text-[2.5rem] leading-[1.08] tracking-[-0.02em] text-ink sm:text-6xl lg:text-[3.9rem]"
            style={{ fontWeight: 400 }}
          >
            Beautiful, space-saving furniture
            <span className="italic text-brand-500"> without the retail price tag.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-lg text-[17px] leading-relaxed text-ink-soft"
          >
            Whether you&apos;re furnishing your first apartment, moving into a small space,
            starting college, or beginning a new chapter as newlyweds, GEMO Furniture helps
            you build a comfortable, stylish home on a budget — with fast shipping across
            the United States.
          </motion.p>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2.5 rounded-full bg-brand-500 px-7 py-3.5 text-sm font-semibold text-cream transition-colors hover:bg-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
            >
              Shop all furniture
              <ArrowRight
                size={17}
                strokeWidth={2}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center rounded-full border border-ink/15 px-7 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-ink/40 hover:bg-sand/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
            >
              Our story
            </Link>
          </motion.div>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-5 border-t border-line pt-8"
          >
            <div className="flex items-center gap-2">
              <span className="flex" aria-hidden="true">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} size={14} className="fill-brand-500 text-brand-500" />
                ))}
              </span>
              <span className="text-sm text-ink-soft">
                <strong className="font-semibold text-ink">4.8</strong> average rating
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-ink-soft">
              <Truck size={16} strokeWidth={1.7} className="text-brand-500" />
              Fast nationwide shipping
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="overflow-hidden rounded-[1.75rem] bg-sand">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt="Sunlit small apartment living room styled with space-saving GEMO furniture"
                className="h-[380px] w-full object-cover sm:h-[480px] lg:h-[560px]"
                loading="eager"
              />
            ) : (
              <div className="grid h-[380px] grid-cols-2 gap-4 p-4 sm:h-[480px] lg:h-[560px]">
                <div className="col-span-2 rounded-2xl bg-brand-500/90" />
                <div className="rounded-2xl bg-brand-600/80" />
                <div className="rounded-2xl bg-brand-300/80" />
              </div>
            )}
          </div>

          {featuredProduct && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -bottom-5 left-4 rounded-2xl border border-line bg-cream p-4 shadow-[0_18px_40px_-24px_rgba(34,31,28,0.5)] sm:left-6"
            >
              <p className="font-display text-sm text-ink">{featuredProduct.name}</p>
              <p className="mt-1 flex items-baseline gap-2 text-sm">
                <span className="font-semibold text-brand-500">
                  {formatPrice(featuredProduct.price)}
                </span>
                {featuredProduct.compareAtPrice && (
                  <span className="text-xs text-ink-muted line-through">
                    {formatPrice(featuredProduct.compareAtPrice)}
                  </span>
                )}
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
