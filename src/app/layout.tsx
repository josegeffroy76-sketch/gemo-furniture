import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CatalogLoader from "@/components/CatalogLoader";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-cream text-ink">
        <CatalogLoader />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
