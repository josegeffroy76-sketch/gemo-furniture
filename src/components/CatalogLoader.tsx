"use client";

import { useEffect } from "react";
import { useCatalogClientStore } from "@/lib/catalog-client-store";

/**
 * Fetches the public catalog snapshot once on app load and hydrates the
 * client-side catalog store used by the cart. Rendered once in the root
 * layout; renders nothing.
 */
export default function CatalogLoader() {
  const setProducts = useCatalogClientStore((s) => s.setProducts);

  useEffect(() => {
    let cancelled = false;
    // Intentional one-time fetch-on-mount to hydrate the client catalog cache.
    fetch("/api/catalog")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setProducts(data.products ?? []);
      })
      .catch(() => {
        /* Cart will simply show fewer details until this succeeds on retry/reload. */
      });
    return () => {
      cancelled = true;
    };
  }, [setProducts]);

  return null;
}
