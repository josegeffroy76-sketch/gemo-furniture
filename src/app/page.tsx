import Link from "next/link";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Categories from "@/components/Categories";
import ProductCard from "@/components/ProductCard";
import StorySection from "@/components/StorySection";
import { getAllProducts, getBestsellers, getNewArrivals, getProductsByCategory } from "@/lib/products";
import { getSiteSettings } from "@/lib/site-settings";
import { getCategories } from "@/lib/categories";

// Temporary: hotlinked from Higgsfield generations used to preview this
// design. Replace with permanently-hosted copies (e.g. uploaded to
// /public or Vercel Blob) before relying on these long-term — these URLs
// are not under our control and aren't guaranteed to stay available.
const HERO_IMAGE_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_3HHkKYRPCpTEvsAdSvMT9b9SKEx/hf_20260731_213404_2f1c5281-65f4-4519-a7f9-c87825fb80db.png";
const STORY_IMAGE_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_3HHkKYRPCpTEvsAdSvMT9b9SKEx/hf_20260731_222532_5875e6b3-31f2-41a9-99a0-79b26340bbd3.png";
// Self-hosted (uploaded to /public) — the animated version of the hero
// image the user generated and provided directly.
const HERO_VIDEO_URL = "/videos/hero.mp4";

export default async function HomePage() {
  const categoryList = await getCategories();
  const [allProducts, bestsellers, newArrivals, settings, categoryProductLists] = await Promise.all([
    getAllProducts(),
    getBestsellers(4),
    getNewArrivals(4),
    getSiteSettings(),
    Promise.all(categoryList.map((c) => getProductsByCategory(c.slug))),
  ]);

  const featured = bestsellers.length ? bestsellers : newArrivals;

  const categories = categoryList.map((c, i) => ({
    slug: c.slug,
    label: c.label,
    blurb: c.blurb,
    count: categoryProductLists[i].length,
    representativeProduct: categoryProductLists[i][0],
  }));

  // Only real, already-established claims — nothing invented for this strip.
  // The free-shipping item mirrors the actual /admin/settings toggle, so it
  // never advertises a promo that isn't currently live.
  const marqueeItems = [
    "Prices below traditional retail",
    "Fast shipping across the USA",
    "30-day returns",
    "Quality checked before it ships",
    ...(settings.freeCheapestShipping ? ["Free shipping on our lowest-cost option"] : []),
  ];

  return (
    <>
      <Hero imageUrl={HERO_IMAGE_URL} videoUrl={HERO_VIDEO_URL} featuredProduct={featured[0]} />
      <Marquee items={marqueeItems} />
      <Categories categories={categories} totalCount={allProducts.length} />

      {featured.length > 0 && (
        <section id="featured" aria-labelledby="featured-heading" className="w-full bg-sand/40 py-16 lg:py-24">
          <div className="container-gemo">
            <div className="flex items-end justify-between gap-6">
              <div className="max-w-xl">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-500">
                  Customer favorites
                </span>
                <h2
                  id="featured-heading"
                  className="mt-3 font-display text-[2rem] leading-tight tracking-[-0.015em] text-ink sm:text-[2.6rem]"
                  style={{ fontWeight: 400 }}
                >
                  The pieces our customers keep coming back for
                </h2>
              </div>
              <Link
                href="/shop"
                className="hidden text-sm font-semibold text-brand-600 hover:text-brand-700 sm:inline-flex"
              >
                View all →
              </Link>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-4">
              {featured.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  freeShipping={settings.freeCheapestShipping}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <StorySection imageUrl={STORY_IMAGE_URL} />
    </>
  );
}
