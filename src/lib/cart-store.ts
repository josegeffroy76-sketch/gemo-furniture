"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine, Product } from "./types";
import { useCatalogClientStore } from "./catalog-client-store";

interface CartState {
  lines: CartLine[];
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      addItem: (productId, quantity = 1) =>
        set((state) => {
          const existing = state.lines.find((l) => l.productId === productId);
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.productId === productId ? { ...l, quantity: l.quantity + quantity } : l
              ),
            };
          }
          return { lines: [...state.lines, { productId, quantity }] };
        }),
      removeItem: (productId) =>
        set((state) => ({ lines: state.lines.filter((l) => l.productId !== productId) })),
      setQuantity: (productId, quantity) =>
        set((state) => ({
          lines:
            quantity <= 0
              ? state.lines.filter((l) => l.productId !== productId)
              : state.lines.map((l) => (l.productId === productId ? { ...l, quantity } : l)),
        })),
      clear: () => set({ lines: [] }),
    }),
    { name: "gemo-cart" }
  )
);

/** Derived helper: total quantity of items in the cart. */
export function useCartCount(): number {
  return useCartStore((s) => s.lines.reduce((sum, l) => sum + l.quantity, 0));
}

/**
 * Derived helper: cart lines joined with live product data + subtotal in
 * cents. Product data comes from the client-side catalog cache (see
 * CatalogLoader) rather than lib/products.ts directly, since that module
 * reads the admin JSON store via node:fs and must never enter a client
 * bundle.
 */
export function useCartDetails() {
  const lines = useCartStore((s) => s.lines);
  const catalog = useCatalogClientStore((s) => s.products);

  const items: { product: Product; quantity: number }[] = lines
    .map((line) => {
      const product = catalog.find((p) => p.id === line.productId);
      if (!product) return null;
      return { product, quantity: line.quantity };
    })
    .filter((x): x is { product: Product; quantity: number } => x !== null);

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  return { items, subtotal };
}
