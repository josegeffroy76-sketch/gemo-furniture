import type { Product } from "./types";
import { readJsonFile, writeJsonFile } from "./json-file-store";

type ProductOverride = Partial<Product> & { hidden?: boolean };
type OverridesMap = Record<string, ProductOverride>;

const OVERRIDES_FILE = "product-overrides.json";
const CUSTOM_PRODUCTS_FILE = "custom-products.json";

export async function getOverrides(): Promise<OverridesMap> {
  return readJsonFile<OverridesMap>(OVERRIDES_FILE, {});
}

export async function setOverride(productId: string, patch: ProductOverride): Promise<void> {
  const overrides = await getOverrides();
  overrides[productId] = { ...overrides[productId], ...patch };
  await writeJsonFile(OVERRIDES_FILE, overrides);
}

export async function getCustomProducts(): Promise<Product[]> {
  return readJsonFile<Product[]>(CUSTOM_PRODUCTS_FILE, []);
}

export async function addCustomProduct(product: Product): Promise<void> {
  const products = await getCustomProducts();
  products.push(product);
  await writeJsonFile(CUSTOM_PRODUCTS_FILE, products);
}

export async function updateCustomProduct(productId: string, patch: Partial<Product>): Promise<void> {
  const products = await getCustomProducts();
  const next = products.map((p) => (p.id === productId ? { ...p, ...patch } : p));
  await writeJsonFile(CUSTOM_PRODUCTS_FILE, next);
}

export async function removeCustomProduct(productId: string): Promise<void> {
  const products = (await getCustomProducts()).filter((p) => p.id !== productId);
  await writeJsonFile(CUSTOM_PRODUCTS_FILE, products);
}
