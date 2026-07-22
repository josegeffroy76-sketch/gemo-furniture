import type { Metadata } from "next";
import Link from "next/link";
import { BadgeDollarSign, Home as HomeIcon, GraduationCap, Sparkles, Truck, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn why GEMO Furniture offers high-quality, space-saving furniture at prices below traditional retail stores.",
};

const REASONS = [
  { icon: BadgeDollarSign, text: "Prices below traditional retail stores" },
  { icon: HomeIcon, text: "Perfect for apartments and small living spaces" },
  { icon: GraduationCap, text: "Ideal for students, first-time renters, and newly married couples" },
  { icon: Sparkles, text: "Modern, functional, and stylish furniture" },
  { icon: Truck, text: "Fast nationwide shipping across the USA" },
  { icon: Award, text: "Outstanding value without sacrificing quality" },
];

export default function AboutPage() {
  return (
    <div className="container-gemo py-16 md:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <span className="mb-4 inline-flex w-fit items-center rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700">
          Our Story
        </span>
        <h1 className="font-display text-3xl text-ink md:text-4xl">Welcome to GEMO Furniture</h1>
      </div>

      <div className="mx-auto mt-10 max-w-2xl space-y-5 text-base leading-relaxed text-ink-soft">
        <p>
          At GEMO Furniture, we believe everyone deserves a beautiful home without
          paying retail prices.
        </p>
        <p>
          Whether you&apos;re furnishing your first apartment, moving into a small
          space, starting college, or beginning a new chapter as newlyweds, we&apos;re
          here to help you create a comfortable and stylish home on a budget.
        </p>
        <p>
          We specialize in high-quality, space-saving furniture at prices below
          traditional retail stores. Our carefully selected collection is designed for
          modern living, offering smart solutions for apartments, condos, dorms, and
          smaller homes without compromising on style or quality.
        </p>
        <p>
          With fast shipping across the United States, shopping for affordable
          furniture has never been easier.
        </p>
      </div>

      <div className="mx-auto mt-14 max-w-3xl">
        <h2 className="text-center font-display text-2xl text-ink">Why Choose GEMO Furniture?</h2>
        <div className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2">
          {REASONS.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                <Icon className="h-4.5 w-4.5" />
              </span>
              <p className="pt-1.5 text-sm leading-relaxed text-ink-soft">{text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-xl rounded-2xl bg-ink px-8 py-10 text-center">
        <p className="font-display text-xl italic text-cream md:text-2xl">
          Furnish your home for less. Live better with GEMO Furniture.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-cream transition-colors hover:bg-brand-600"
        >
          Shop All Furniture
        </Link>
      </div>
    </div>
  );
}
