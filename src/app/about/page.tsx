import type { Metadata } from "next";
import Link from "next/link";
import { BadgeDollarSign, Home as HomeIcon, GraduationCap, Sparkles, Truck, Award } from "lucide-react";
import { getLocale } from "@/lib/i18n/get-locale";
import { messages } from "@/lib/i18n/messages";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn why GEMO Furniture offers high-quality, space-saving furniture at prices below traditional retail stores.",
};

export default async function AboutPage() {
  const locale = await getLocale();
  const t = messages[locale].about;

  const REASONS = [
    { icon: BadgeDollarSign, text: t.reason1 },
    { icon: HomeIcon, text: t.reason2 },
    { icon: GraduationCap, text: t.reason3 },
    { icon: Sparkles, text: t.reason4 },
    { icon: Truck, text: t.reason5 },
    { icon: Award, text: t.reason6 },
  ];

  return (
    <div className="container-gemo py-16 md:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <span className="mb-4 inline-flex w-fit items-center rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700">
          {t.eyebrow}
        </span>
        <h1 className="font-display text-3xl text-ink md:text-4xl">{t.heading}</h1>
      </div>

      <div className="mx-auto mt-10 max-w-2xl space-y-5 text-base leading-relaxed text-ink-soft">
        <p>{t.p1}</p>
        <p>{t.p2}</p>
        <p>{t.p3}</p>
        <p>{t.p4}</p>
      </div>

      <div className="mx-auto mt-14 max-w-3xl">
        <h2 className="text-center font-display text-2xl text-ink">{t.whyHeading}</h2>
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
        <p className="font-display text-xl italic text-cream md:text-2xl">{t.ctaQuote}</p>
        <Link
          href="/shop"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-cream transition-colors hover:bg-brand-600"
        >
          {t.ctaShop}
        </Link>
      </div>
    </div>
  );
}
