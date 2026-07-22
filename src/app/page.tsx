import Link from "next/link";
import { ArrowRight, BadgeDollarSign, Home as HomeIcon, GraduationCap, Heart, Truck, ShieldCheck } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import ProductImage from "@/components/ProductImage";
import { getBestsellers, getNewArrivals } from "@/lib/products";
import { CATEGORIES } from "@/lib/categories";

const WHY_GEMO = [
  { icon: BadgeDollarSign, text: "Prices below traditional retail stores" },
  { icon: HomeIcon, text: "Perfect for apartments and small living spaces" },
  { icon: GraduationCap, text: "Ideal for students, first-time renters, and newly married couples" },
  { icon: Heart, text: "Modern, functional, and stylish furniture" },
  { icon: Truck, text: "Fast nationwide shipping across the USA" },
  { icon: ShieldCheck, text: "Outstanding value without sacrificing quality" },
];

export default function HomePage() {
  const bestsellers = getBestsellers(4);
  const newArrivals = getNewArrivals(4);
  const featured = bestsellers.length ? bestsellers : newArrivals;

  return (
    <>
      {/* Hero */}
      <section className="border-b border-line bg-sand">
        <div className="container-gemo grid gap-10 py-16 md:grid-cols-2 md:py-24">
          <div className="flex flex-col justify-center">
            <span className="mb-4 inline-flex w-fit items-center rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700">
              Furnish your home for less
            </span>
            <h1 className="font-display text-4xl leading-[1.1] text-ink md:text-5xl">
              Beautiful, space-saving furniture — without the retail price tag.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-ink-soft">
              Whether you&apos;re furnishing your first apartment, moving into a small
              space, starting college, or beginning a new chapter as newlyweds, GEMO
              Furniture helps you build a comfortable, stylish home on a budget — with
              fast shipping across the United States.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-cream transition-colors hover:bg-brand-600"
              >
                Shop All Furniture <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-white"
              >
                Our Story
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 self-center">
            <ProductImage
              icon="sofa"
              colorway="#BF4E30"
              className="col-span-2 aspect-[16/10] w-full"
              iconClassName="h-20 w-20"
            />
            <ProductImage icon="bed-double" colorway="#A43F26" className="aspect-square w-full" iconClassName="h-14 w-14" />
            <ProductImage icon="box" colorway="#CC6947" className="aspect-square w-full" iconClassName="h-14 w-14" />
          </div>
        </div>
      </section>

      {/* Why choose GEMO */}
      <section className="container-gemo py-16">
        <h2 className="font-display text-2xl text-ink md:text-3xl">Why Choose GEMO Furniture?</h2>
        <div className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_GEMO.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                <Icon className="h-4.5 w-4.5" />
              </span>
              <p className="pt-1.5 text-sm leading-relaxed text-ink-soft">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Shop by category */}
      <section className="border-y border-line bg-sand/60 py-16">
        <div className="container-gemo">
          <h2 className="font-display text-2xl text-ink md:text-3xl">Shop by Category</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/shop?category=${cat.slug}`}
                className="group rounded-2xl border border-line bg-white/70 p-5 transition-shadow hover:shadow-md"
              >
                <h3 className="text-sm font-semibold text-ink group-hover:text-brand-600">
                  {cat.label}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">{cat.blurb}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      {featured.length > 0 && (
        <section className="container-gemo py-16">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-2xl text-ink md:text-3xl">Customer Favorites</h2>
            <Link href="/shop" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
              View all →
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Closing statement */}
      <section className="bg-ink py-14">
        <div className="container-gemo text-center">
          <p className="font-display text-2xl italic text-cream md:text-3xl">
            &ldquo;Furnish your home for less. Live better with GEMO Furniture.&rdquo;
          </p>
        </div>
      </section>
    </>
  );
}
