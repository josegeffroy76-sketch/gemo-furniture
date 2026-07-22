"use client";

import { create } from "zustand";
import type { Product } from "./types";

interface CatalogClientState {
  products: Product[];
  loaded: boolean;
  setProducts: (products: Product[]) => void;
}

/**
 * Client-safe copy of the catalog, fetched once from /api/catalog (see
 * CatalogLoader). Kept separate from src/lib/products.ts so client bundles
 * (e.g. the cart) never pull in server-only modules like node:fs.
 */
export const useCatalogClientStore = create<CatalogClientState>()((set) => ({
  products: [],
  loaded: false,
  setProducts: (products) => set({ products, loaded: true }),
}));

export function useCatalogProductById(id: string): Product | undefined {
  return useCatalogClientStore((s) => s.products.find((p) => p.id === id));
}
