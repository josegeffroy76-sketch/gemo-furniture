"use client";

import { useCallback, useEffect, useState } from "react";
import { Eye, EyeOff, Trash2, Plus, Loader2 } from "lucide-react";
import type { Product, ProductCategory } from "@/lib/types";
import { CATEGORIES } from "@/lib/categories";

const emptyForm = {
  name: "",
  category: "accent-decor" as ProductCategory,
  price: "",
  compareAtPrice: "",
  shortDescription: "",
  description: "",
  dimensions: "",
  weightLbs: "",
  stock: "",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    setProducts(data.products ?? []);
  }, []);

  useEffect(() => {
    // Intentional client-side fetch-on-mount for this admin tool (not a
    // performance-sensitive path) — see rule docs for the general concern.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  async function patchProduct(id: string, patch: Partial<Product>) {
    await fetch(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    load();
  }

  async function deleteProduct(id: string) {
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    load();
  }

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          category: form.category,
          price: Math.round(parseFloat(form.price) * 100),
          compareAtPrice: form.compareAtPrice ? Math.round(parseFloat(form.compareAtPrice) * 100) : undefined,
          shortDescription: form.shortDescription,
          description: form.description || form.shortDescription,
          dimensions: form.dimensions,
          weightLbs: parseFloat(form.weightLbs) || 0,
          stock: parseInt(form.stock, 10) || 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Couldn't add product.");
      setForm(emptyForm);
      setShowForm(false);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  if (!products) {
    return <Loader2 className="h-5 w-5 animate-spin text-ink-soft" />;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-ink">Products</h1>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-full bg-brand-500 px-4 py-2 text-xs font-semibold text-cream hover:bg-brand-600"
        >
          <Plus className="h-3.5 w-3.5" /> Add product
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleAddProduct}
          className="mt-5 grid grid-cols-2 gap-3 rounded-xl border border-line bg-white/60 p-5"
        >
          <input
            required
            placeholder="Product name"
            className="col-span-2 rounded-lg border border-line px-3 py-2 text-sm sm:col-span-1"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <select
            className="rounded-lg border border-line px-3 py-2 text-sm"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value as ProductCategory })}
          >
            {CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.label}
              </option>
            ))}
          </select>
          <input
            required
            type="number"
            step="0.01"
            placeholder="Price (USD)"
            className="rounded-lg border border-line px-3 py-2 text-sm"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Compare-at price (optional)"
            className="rounded-lg border border-line px-3 py-2 text-sm"
            value={form.compareAtPrice}
            onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })}
          />
          <input
            required
            type="number"
            placeholder="Stock"
            className="rounded-lg border border-line px-3 py-2 text-sm"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />
          <input
            placeholder="Dimensions (e.g. 60&quot;W x 30&quot;D x 32&quot;H)"
            className="rounded-lg border border-line px-3 py-2 text-sm"
            value={form.dimensions}
            onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
          />
          <input
            type="number"
            placeholder="Weight (lb)"
            className="rounded-lg border border-line px-3 py-2 text-sm"
            value={form.weightLbs}
            onChange={(e) => setForm({ ...form, weightLbs: e.target.value })}
          />
          <input
            required
            placeholder="Short description"
            className="col-span-2 rounded-lg border border-line px-3 py-2 text-sm"
            value={form.shortDescription}
            onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
          />
          <textarea
            placeholder="Full description (optional — defaults to short description)"
            className="col-span-2 rounded-lg border border-line px-3 py-2 text-sm"
            rows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          {error && <p className="col-span-2 text-xs text-brand-700">{error}</p>}
          <button
            type="submit"
            disabled={saving}
            className="col-span-2 mt-1 flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-cream disabled:opacity-60"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Save product
          </button>
        </form>
      )}

      <div className="mt-6 overflow-x-auto rounded-xl border border-line bg-white/60">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs uppercase tracking-wide text-ink-soft">
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {products.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3 text-ink">{p.name}</td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    step="0.01"
                    defaultValue={(p.price / 100).toFixed(2)}
                    className="w-24 rounded-md border border-line px-2 py-1 text-sm"
                    onBlur={(e) => {
                      const cents = Math.round(parseFloat(e.target.value) * 100);
                      if (!Number.isNaN(cents) && cents !== p.price) patchProduct(p.id, { price: cents });
                    }}
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    defaultValue={p.stock}
                    className="w-20 rounded-md border border-line px-2 py-1 text-sm"
                    onBlur={(e) => {
                      const stock = parseInt(e.target.value, 10);
                      if (!Number.isNaN(stock) && stock !== p.stock) patchProduct(p.id, { stock });
                    }}
                  />
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      p.stock > 0 ? "bg-brand-50 text-brand-700" : "bg-sand text-ink-soft"
                    }`}
                  >
                    {p.stock > 0 ? "In stock" : "Out of stock"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => patchProduct(p.id, { hidden: true })}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft hover:bg-sand"
                      title="Hide from storefront"
                    >
                      <EyeOff className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteProduct(p.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft hover:bg-sand hover:text-brand-600"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-ink-soft/70">
        <Eye className="h-3.5 w-3.5" /> Only products currently visible on the storefront are listed here.
      </p>
    </div>
  );
}
