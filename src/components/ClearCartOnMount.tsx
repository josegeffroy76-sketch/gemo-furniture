"use client";

import { useEffect } from "react";
import { useCartStore } from "@/lib/cart-store";

/** Empties the persisted cart once, after a successful checkout redirect. */
export default function ClearCartOnMount() {
  const clear = useCartStore((s) => s.clear);
  useEffect(() => {
    clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
