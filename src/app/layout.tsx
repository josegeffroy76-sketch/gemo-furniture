import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CatalogLoader from "@/components/CatalogLoader";
import { LocaleProvider } from "@/lib/i18n/LocaleProvider";
import { getLocale } from "@/lib/i18n/get-locale";

// Self-hosted at build time by next/font — no runtime request to Google's
// servers, so page load doesn't depend on a third-party font host.
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display-family",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans-family",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "GEMO Furniture — Affordable, Space-Saving Furniture for Every Home",
    template: "%s | GEMO Furniture",
  },
  description:
    "GEMO Furniture offers high-quality, space-saving furniture at prices below traditional retail. Perfect for apartments, dorms, and small homes, with fast shipping across the USA.",
  keywords: [
    "affordable furniture",
    "small space furniture",
    "apartment furniture",
    "space-saving furniture",
    "GEMO Furniture",
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Admin and API routes render this same root layout but don't use the
  // locale cookie for anything — reading it here is safe and cheap either
  // way (a JSON cookie lookup, not a network call).
  const locale = await getLocale();

  return (
    <html lang={locale} className={`h-full antialiased ${fraunces.variable} ${inter.variable}`}>
      <body className="min-h-full flex flex-col bg-cream text-ink">
        <LocaleProvider locale={locale}>
          <CatalogLoader />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </LocaleProvider>
      </body>
    </html>
  );
}
