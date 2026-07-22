import type { ProductCategory } from "./types";

export const CATEGORIES: { slug: ProductCategory; label: string; blurb: string }[] = [
  {
    slug: "sofas-sectionals",
    label: "Sofas & Sectionals",
    blurb: "Compact seating built for apartments and small living rooms.",
  },
  {
    slug: "sofa-beds",
    label: "Sofa Beds & Sleepers",
    blurb: "Comfortable by day, a real bed by night — perfect for guests and studios.",
  },
  {
    slug: "bedroom",
    label: "Beds & Bedroom",
    blurb: "Space-smart bed frames and bedroom storage for dorms and small rooms.",
  },
  {
    slug: "storage",
    label: "Storage & Organization",
    blurb: "Smart storage that makes small homes feel bigger.",
  },
  {
    slug: "dining",
    label: "Small-Space Dining",
    blurb: "Compact and foldable dining sets for apartments and studios.",
  },
  {
    slug: "home-office",
    label: "Home Office",
    blurb: "Desks and seating that fit in a corner, not a spare room.",
  },
  {
    slug: "accent-decor",
    label: "Accent & Occasional",
    blurb: "The finishing pieces that make a first apartment feel like home.",
  },
];

export function getCategoryLabel(slug: ProductCategory): string {
  return CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}
