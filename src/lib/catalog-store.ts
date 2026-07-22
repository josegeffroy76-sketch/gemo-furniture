import type { Product } from "./types";
import { readJsonFile, writeJsonFile } from "./json-file-store";

type ProductOverride = Partial<Product> & { hidden?: boolean };
type OverridesMap = Record<string, ProductOverride>;

const OVERRIDES_FILE = "product-overrides.json";
const CUSTOM_PRODUCTS_FILE = "custom-products.json";

export function getOverrides(): OverridesMap {
  return readJsonFile<OverridesMap>(OVERRIDES_FILE, {});
}

export function setOverride(productId: string, patch: ProductOverride): void {
  const overrides = getOverrides();
  overrides[productId] = { ...overrides[productId], ...patch };
  writeJsonFile(OVERRIDES_FILE, overrides);
}

export function getCustomProducts(): Product[] {
  return readJsonFile<Product[]>(CUSTOM_PRODUCTS_FILE, []);
}

export function addCustomProduct(product: Product): void {
  const products = getCustomProducts();
  products.push(product);
  writeJsonFile(CUSTOM_PRODUCTS_FILE, products);
}

export function updateCustomProduct(productId: string, patch: Partial<Product>): void {
  const products = getCustomProducts();
  const next = products.map((p) => (p.id === productId ? { ...p, ...patch } : p));
  writeJsonFile(CUSTOM_PRODUCTS_FILE, next);
}

export function removeCustomProduct(productId: string): void {
  const products = getCustomProducts().filter((p) => p.id !== productId);
  writeJsonFile(CUSTOM_PRODUCTS_FILE, products);
}
