import type { CategoryRecord } from "./types";
import { getCategoryOverrides, getCustomCategories } from "./categories-store";

/**
 * Starter category set, shipped in code. These 7 slugs can be renamed
 * (label/blurb) by an admin — see getCategories() below — but the slugs
 * themselves are baked into this file and can't be deleted, since removing
 * one here is a code change, not an admin action.
 */
export const SEED_CATEGORIES: CategoryRecord[] = [
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

/**
 * Merges the starter category set above with any admin-panel renames
 * (label/blurb overrides) and admin-added custom categories, in that order.
 * This is the single read path every page uses — see
 * src/app/api/admin/categories for how admins add/edit/remove these.
 */
export async function getCategories(): Promise<CategoryRecord[]> {
  const [overrides, custom] = await Promise.all([getCategoryOverrides(), getCustomCategories()]);
  const seeded = SEED_CATEGORIES.map((c) => ({ ...c, ...overrides[c.slug] }));
  return [...seeded, ...custom];
}

export async function getCategoryLabel(slug: string): Promise<string> {
  return (await getCategories()).find((c) => c.slug === slug)?.label ?? slug;
}
