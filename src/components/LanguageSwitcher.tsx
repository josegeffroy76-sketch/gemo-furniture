"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { LOCALE_COOKIE, type Locale } from "@/lib/i18n/config";

/**
 * EN/ES toggle. Sets a cookie and asks Next.js to re-render server
 * components with the new locale — the URL never changes, so this doesn't
 * touch routing, Stripe redirect URLs, SEO, or any existing links.
 */
export default function LanguageSwitcher({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const router = useRouter();

  function setLocale(next: Locale) {
    if (next === locale) return;
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; SameSite=Lax`;
    router.refresh();
  }

  return (
    <div
      className={`inline-flex items-center overflow-hidden rounded-full border border-line text-[11px] font-semibold ${className}`}
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        onClick={() => setLocale("en")}
        aria-pressed={locale === "en"}
        className={`px-2.5 py-1.5 transition-colors ${
          locale === "en" ? "bg-ink text-cream" : "text-ink-soft hover:bg-sand"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLocale("es")}
        aria-pressed={locale === "es"}
        className={`px-2.5 py-1.5 transition-colors ${
          locale === "es" ? "bg-ink text-cream" : "text-ink-soft hover:bg-sand"
        }`}
      >
        ES
      </button>
    </div>
  );
}
