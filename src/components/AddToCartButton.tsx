"use client";

import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { messages } from "@/lib/i18n/messages";

export default function AddToCartButton({
  productId,
  quantity = 1,
  className = "",
}: {
  productId: string;
  quantity?: number;
  className?: string;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const [justAdded, setJustAdded] = useState(false);
  const locale = useLocale();
  const t = messages[locale].product;

  return (
    <button
      type="button"
      onClick={() => {
        addItem(productId, quantity);
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 1600);
      }}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-cream transition-colors hover:bg-brand-600 disabled:opacity-60 ${className}`}
    >
      {justAdded ? (
        <>
          <Check className="h-4 w-4" /> {t.addedToCart}
        </>
      ) : (
        <>
          <ShoppingBag className="h-4 w-4" /> {t.addToCart}
        </>
      )}
    </button>
  );
}
