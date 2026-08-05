"use client";

import { Minus, Plus } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { messages } from "@/lib/i18n/messages";

export default function QuantityInput({
  value,
  onChange,
  min = 1,
  max = 99,
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
}) {
  const locale = useLocale();
  const t = messages[locale].product;

  return (
    <div className="inline-flex items-center rounded-full border border-line">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft hover:bg-sand"
        aria-label={t.decreaseQuantity}
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="w-8 text-center text-sm font-medium text-ink">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft hover:bg-sand"
        aria-label={t.increaseQuantity}
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
