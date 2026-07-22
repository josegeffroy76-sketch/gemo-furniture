"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, ShoppingBag } from "lucide-react";
import ProductPhoto from "@/components/ProductPhoto";
import QuantityInput from "@/components/QuantityInput";
import { useCartStore, useCartDetails } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { items, subtotal } = useCartDetails();
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className="container-gemo flex flex-col items-center justify-center py-24 text-center">
        <ShoppingBag className="h-10 w-10 text-ink-soft/40" />
        <h1 className="mt-4 font-display text-2xl text-ink">Your cart is empty</h1>
        <p className="mt-2 text-sm text-ink-soft">Find something to love for your space.</p>
        <Link
          href="/shop"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-cream hover:bg-brand-600"
        >
          Shop All Furniture
        </Link>
      </div>
    );
  }

  return (
    <div className="container-gemo py-10">
      <h1 className="font-display text-3xl text-ink">Your Cart</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ul className="divide-y divide-line border-y border-line">
            {items.map(({ product, quantity }) => (
              <li key={product.id} className="flex gap-4 py-5">
                <Link href={`/shop/${product.slug}`} className="shrink-0">
                  <ProductPhoto
                    product={product}
                    className="h-24 w-24"
                    iconClassName="h-10 w-10"
                  />
                </Link>
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex justify-between gap-3">
                    <div>
                      <Link
                        href={`/shop/${product.slug}`}
                        className="text-sm font-medium text-ink hover:text-brand-600"
                      >
                        {product.name}
                      </Link>
                      <p className="mt-1 text-sm text-ink-soft">{formatPrice(product.price)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(product.id)}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-soft/60 hover:bg-sand hover:text-brand-600"
                      aria-label={`Remove ${product.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <QuantityInput
                      value={quantity}
                      onChange={(next) => setQuantity(product.id, next)}
                    />
                    <span className="text-sm font-semibold text-ink">
                      {formatPrice(product.price * quantity)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="h-fit rounded-2xl border border-line bg-white/60 p-6">
          <h2 className="text-sm font-semibold text-ink">Order Summary</h2>
          <div className="mt-4 flex justify-between text-sm text-ink-soft">
            <span>Subtotal</span>
            <span className="font-medium text-ink">{formatPrice(subtotal)}</span>
          </div>
          <p className="mt-1 text-xs text-ink-soft/70">
            Shipping and tax calculated at checkout.
          </p>

          <button
            type="button"
            onClick={() => router.push("/checkout/shipping")}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-cream transition-colors hover:bg-brand-600"
          >
            Continue to Shipping
          </button>
          <Link
            href="/shop"
            className="mt-3 block text-center text-xs font-medium text-ink-soft hover:text-brand-600"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
