"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Truck, ChevronLeft } from "lucide-react";
import { useCartDetails } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";
import type { ShippingRateOption } from "@/lib/shippo";
import AddressAutocomplete from "@/components/AddressAutocomplete";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { messages } from "@/lib/i18n/messages";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA",
  "ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK",
  "OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",
];

const emptyAddress = {
  name: "",
  street1: "",
  street2: "",
  city: "",
  state: "",
  zip: "",
  phone: "",
  email: "",
};

export default function ShippingPage() {
  const { items, subtotal } = useCartDetails();
  const [address, setAddress] = useState(emptyAddress);
  const [rates, setRates] = useState<ShippingRateOption[] | null>(null);
  const [selectedRateId, setSelectedRateId] = useState<string | null>(null);
  const [loadingRates, setLoadingRates] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [taxEstimate, setTaxEstimate] = useState<number | null>(null);
  const [loadingTax, setLoadingTax] = useState(false);
  const locale = useLocale();
  const t = messages[locale].checkoutShipping;

  // Live tax preview so customers see the real sales tax breakdown here,
  // instead of only finding out on Stripe's own payment page. Re-runs
  // whenever the chosen shipping rate or the address it was quoted for
  // changes. Non-fatal on failure — checkout still works either way, since
  // Stripe recalculates the authoritative amount at payment time regardless.
  useEffect(() => {
    const selected = rates?.find((r) => r.id === selectedRateId);
    if (!selected) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTaxEstimate(null);
      return;
    }
    let cancelled = false;
    setLoadingTax(true);
    fetch("/api/tax/estimate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lines: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
        address: { ...address, country: "US" },
        shippingAmount: selected.amount,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        setTaxEstimate(typeof data.taxAmount === "number" ? data.taxAmount : null);
      })
      .catch(() => {
        if (!cancelled) setTaxEstimate(null);
      })
      .finally(() => {
        if (!cancelled) setLoadingTax(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRateId, rates, address.street1, address.city, address.state, address.zip]);

  if (items.length === 0) {
    return (
      <div className="container-gemo py-24 text-center">
        <p className="text-sm text-ink-soft">{t.emptyCart}</p>
        <Link href="/shop" className="mt-4 inline-block text-sm font-semibold text-brand-600">
          {t.shopAllFurniture}
        </Link>
      </div>
    );
  }

  const canGetRates =
    address.name && address.street1 && address.city && address.state && address.zip.length >= 5;

  async function handleGetRates() {
    setLoadingRates(true);
    setError(null);
    setRates(null);
    try {
      const res = await fetch("/api/shipping/rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: { ...address, country: "US" },
          lines: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? t.couldntFetchRates);
      setRates(data.rates);
      setSelectedRateId(data.rates[0]?.id ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.somethingWrong);
    } finally {
      setLoadingRates(false);
    }
  }

  async function handleCheckout() {
    const selectedRate = rates?.find((r) => r.id === selectedRateId);
    if (!selectedRate) return;
    setCheckingOut(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
          address: { ...address, country: "US" },
          shippingRate: selectedRate,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? t.couldntStartCheckout);
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : t.somethingWrong);
      setCheckingOut(false);
    }
  }

  const selectedRate = rates?.find((r) => r.id === selectedRateId);
  const total = subtotal + (selectedRate?.amount ?? 0) + (taxEstimate ?? 0);

  return (
    <div className="container-gemo py-10">
      <Link href="/cart" className="inline-flex items-center gap-1 text-xs font-medium text-ink-soft hover:text-brand-600">
        <ChevronLeft className="h-3.5 w-3.5" /> {t.backToCart}
      </Link>
      <h1 className="mt-3 font-display text-3xl text-ink">{t.title}</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="text-sm font-semibold text-ink">{t.shippingAddress}</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <input
              className="col-span-2 rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand-500 sm:col-span-1"
              placeholder={t.fullName}
              value={address.name}
              onChange={(e) => setAddress({ ...address, name: e.target.value })}
            />
            <input
              className="col-span-2 rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand-500 sm:col-span-1"
              placeholder={t.email}
              type="email"
              value={address.email}
              onChange={(e) => setAddress({ ...address, email: e.target.value })}
            />
            {GOOGLE_MAPS_API_KEY ? (
              <div className="col-span-2">
                <AddressAutocomplete
                  apiKey={GOOGLE_MAPS_API_KEY}
                  placeholder={t.addressAutocompletePlaceholder}
                  onSelect={(picked) =>
                    setAddress((prev) => ({
                      ...prev,
                      street1: picked.street1 || prev.street1,
                      city: picked.city || prev.city,
                      state: picked.state || prev.state,
                      zip: picked.zip || prev.zip,
                    }))
                  }
                />
                {/* Kept as a visible, editable fallback — autocomplete fills it, but
                    typos or addresses without a matching suggestion still work. */}
                <input
                  className="mt-2 w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand-500"
                  placeholder={t.streetAddressAutoNote}
                  value={address.street1}
                  onChange={(e) => setAddress({ ...address, street1: e.target.value })}
                />
              </div>
            ) : (
              <input
                className="col-span-2 rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand-500"
                placeholder={t.streetAddress}
                value={address.street1}
                onChange={(e) => setAddress({ ...address, street1: e.target.value })}
              />
            )}
            <input
              className="col-span-2 rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand-500"
              placeholder={t.aptSuite}
              value={address.street2}
              onChange={(e) => setAddress({ ...address, street2: e.target.value })}
            />
            <input
              className="col-span-2 rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand-500 sm:col-span-1"
              placeholder={t.city}
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
            />
            <select
              className="rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand-500"
              value={address.state}
              onChange={(e) => setAddress({ ...address, state: e.target.value })}
            >
              <option value="">{t.statePlaceholder}</option>
              {US_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <input
              className="rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand-500"
              placeholder={t.zip}
              value={address.zip}
              onChange={(e) => setAddress({ ...address, zip: e.target.value })}
            />
            <input
              className="col-span-2 rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand-500 sm:col-span-1"
              placeholder={t.phone}
              value={address.phone}
              onChange={(e) => setAddress({ ...address, phone: e.target.value })}
            />
          </div>

          <button
            type="button"
            onClick={handleGetRates}
            disabled={!canGetRates || loadingRates}
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-ink/15 px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-sand disabled:opacity-50"
          >
            {loadingRates ? <Loader2 className="h-4 w-4 animate-spin" /> : <Truck className="h-4 w-4" />}
            {loadingRates ? t.gettingRates : t.getShippingRates}
          </button>

          {rates && rates.length > 0 && (
            <div className="mt-6 space-y-2.5">
              <h2 className="text-sm font-semibold text-ink">{t.chooseShippingMethod}</h2>
              {rates.map((rate) => (
                <label
                  key={rate.id}
                  className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 text-sm transition-colors ${
                    selectedRateId === rate.id ? "border-brand-500 bg-brand-50" : "border-line hover:bg-sand"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="rate"
                      checked={selectedRateId === rate.id}
                      onChange={() => setSelectedRateId(rate.id)}
                      className="accent-brand-500"
                    />
                    <span>
                      <span className="block font-medium text-ink">{rate.serviceLevel}</span>
                      <span className="block text-xs text-ink-soft">{rate.carrier}</span>
                    </span>
                  </span>
                  <span className="font-semibold text-ink">
                    {rate.originalAmount != null ? (
                      <span className="flex items-center gap-2">
                        <span className="text-xs font-normal text-ink-soft/60 line-through">
                          {formatPrice(rate.originalAmount)}
                        </span>
                        <span className="text-brand-600">{t.free}</span>
                      </span>
                    ) : (
                      formatPrice(rate.amount)
                    )}
                  </span>
                </label>
              ))}
            </div>
          )}

          {error && <p className="mt-4 text-xs text-brand-700">{error}</p>}
        </div>

        <div className="h-fit rounded-2xl border border-line bg-white/60 p-6">
          <h2 className="text-sm font-semibold text-ink">{t.orderSummary}</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-ink-soft">
              <span>{t.subtotal}</span>
              <span className="text-ink">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-ink-soft">
              <span>{t.shipping}</span>
              <span className="text-ink">
                {!selectedRate ? (
                  "—"
                ) : selectedRate.originalAmount != null ? (
                  <span className="flex items-center gap-2">
                    <span className="text-xs text-ink-soft/60 line-through">
                      {formatPrice(selectedRate.originalAmount)}
                    </span>
                    <span className="text-brand-600">{t.free}</span>
                  </span>
                ) : (
                  formatPrice(selectedRate.amount)
                )}
              </span>
            </div>
            <div className="flex justify-between text-ink-soft">
              <span>{t.estimatedTax}</span>
              <span className="text-ink">
                {!selectedRate
                  ? "—"
                  : loadingTax
                    ? "…"
                    : taxEstimate !== null
                      ? formatPrice(taxEstimate)
                      : "—"}
              </span>
            </div>
            <div className="flex justify-between border-t border-line pt-2 font-semibold text-ink">
              <span>{t.total}</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
          {selectedRate && taxEstimate !== null && (
            <p className="mt-2 text-[11px] leading-snug text-ink-soft/70">{t.estimatedNote}</p>
          )}

          <button
            type="button"
            onClick={handleCheckout}
            disabled={!selectedRate || checkingOut}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-cream transition-colors hover:bg-brand-600 disabled:opacity-50"
          >
            {checkingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {checkingOut ? t.redirecting : t.continueToPayment}
          </button>
        </div>
      </div>
    </div>
  );
}
