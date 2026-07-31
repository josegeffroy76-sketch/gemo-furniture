import type { ReactNode } from "react";
import Link from "next/link";

/**
 * Shared shell for the site's legal/policy pages (Privacy, Terms, Returns,
 * Shipping, Payment). Keeps typography and spacing consistent with the rest
 * of the site (see src/app/about/page.tsx for the same container/heading
 * conventions) without pulling in a typography plugin.
 */
export function LegalDocument({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}) {
  return (
    <div className="container-gemo py-16 md:py-20">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm text-ink-soft hover:text-brand-600">
          &larr; Back to GEMO Furniture
        </Link>
        <h1 className="mt-4 font-display text-3xl text-ink md:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-ink-soft">Last updated: {lastUpdated}</p>

        <div className="mt-10 space-y-8">{children}</div>

        <p className="mt-14 border-t border-line pt-6 text-xs leading-relaxed text-ink-soft/80">
          This document is a general template provided for convenience and does not
          constitute legal advice. Laws vary by state and country and change over time —
          please have this policy reviewed by a licensed attorney to confirm it meets the
          requirements that apply to your business before relying on it.
        </p>
      </div>
    </div>
  );
}

export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="font-display text-xl text-ink">{heading}</h2>
      <div className="mt-3 space-y-3 text-base leading-relaxed text-ink-soft">{children}</div>
    </section>
  );
}
