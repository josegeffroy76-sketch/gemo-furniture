import type { CategoryRecord } from "./types";
import { readJsonFile, writeJsonFile } from "./json-file-store";

/**
 * Persisted category data, mirroring the pattern in catalog-store.ts:
 * - Overrides let an admin rename/re-describe one of the 7 starter
 *   categories (defined in src/lib/categories.ts) without touching code.
 * - Custom categories are entirely admin-added, on top of the starter set.
 */
type CategoryOverride = Partial<Pick<CategoryRecord, "label" | "blurb">>;
type OverridesMap = Record<string, CategoryOverride>;

const OVERRIDES_FILE = "category-overrides.json";
const CUSTOM_CATEGORIES_FILE = "custom-categories.json";

export async function getCategoryOverrides(): Promise<OverridesMap> {
  return readJsonFile<OverridesMap>(OVERRIDES_FILE, {});
}

export async function setCategoryOverride(slug: string, patch: CategoryOverride): Promise<void> {
  const overrides = await getCategoryOverrides();
  overrides[slug] = { ...overrides[slug], ...patch };
  await writeJsonFile(OVERRIDES_FILE, overrides);
}

export async function getCustomCategories(): Promise<CategoryRecord[]> {
  return readJsonFile<CategoryRecord[]>(CUSTOM_CATEGORIES_FILE, []);
}

export async function addCustomCategory(category: CategoryRecord): Promise<void> {
  const categories = await getCustomCategories();
  categories.push(category);
  await writeJsonFile(CUSTOM_CATEGORIES_FILE, categories);
}

export async function updateCustomCategory(slug: string, patch: CategoryOverride): Promise<void> {
  const categories = await getCustomCategories();
  const next = categories.map((c) => (c.slug === slug ? { ...c, ...patch } : c));
  await writeJsonFile(CUSTOM_CATEGORIES_FILE, next);
}

export async function removeCustomCategory(slug: string): Promise<void> {
  const next = (await getCustomCategories()).filter((c) => c.slug !== slug);
  await writeJsonFile(CUSTOM_CATEGORIES_FILE, next);
}
