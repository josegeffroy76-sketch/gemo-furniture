"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { Eye, EyeOff, Trash2, Plus, Loader2, Pencil, X, Upload } from "lucide-react";
import type { Product, ProductCategory } from "@/lib/types";
import { CATEGORIES } from "@/lib/categories";
import { formatPrice } from "@/lib/format";

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

type EditableFields = {
  name: string;
  category: ProductCategory;
  price: string;
  compareAtPrice: string;
  shortDescription: string;
  description: string;
  dimensions: string;
  weightLbs: string;
  stock: string;
};

/**
 * Safely reads a fetch Response as JSON. Serverless functions can
 * occasionally return an empty/non-JSON body (a platform timeout or a
 * request-size rejection before our route code even runs), which makes
 * `res.json()` throw a cryptic "unexpected end of data" error. This turns
 * that into a friendly message instead of crashing the UI.
 */
async function parseJsonResponse<T>(res: Response): Promise<{ data: T | null; error: string | null }> {
  const text = await res.text();
  if (!text) {
    return {
      data: null,
      error: res.ok
        ? null
        : `The server didn't respond as expected (status ${res.status}). Please try again — if uploading a photo, try a smaller image.`,
    };
  }
  try {
    return { data: JSON.parse(text), error: null };
  } catch {
    return {
      data: null,
      error: "The server sent back an unexpected response. Please try again in a moment.",
    };
  }
}

function toEditableFields(p: Product): EditableFields {
  return {
    name: p.name,
    category: p.category,
    price: (p.price / 100).toFixed(2),
    compareAtPrice: p.compareAtPrice ? (p.compareAtPrice / 100).toFixed(2) : "",
    shortDescription: p.shortDescription,
    description: p.description,
    dimensions: p.dimensions,
    weightLbs: String(p.weightLbs),
    stock: String(p.stock),
  };
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/products");
    const { data } = await parseJsonResponse<{ products: Product[] }>(res);
    setProducts(data?.products ?? []);
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
      const { data, error: parseError } = await parseJsonResponse<{ error?: string }>(res);
      if (parseError) throw new Error(parseError);
      if (!res.ok) throw new Error(data?.error ?? "Couldn't add product.");
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
              <Fragment key={p.id}>
                <tr>
                  <td className="px-4 py-3 text-ink">
                    <div className="flex items-center gap-2">
                      {p.images?.[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.images[0]} alt="" className="h-8 w-8 rounded object-cover" />
                      ) : (
                        <span className="h-8 w-8 rounded bg-sand" />
                      )}
                      {p.name}
                    </div>
                  </td>
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
                        onClick={() => setEditingId(editingId === p.id ? null : p.id)}
                        className={`flex h-8 w-8 items-center justify-center rounded-full hover:bg-sand ${
                          editingId === p.id ? "bg-sand text-brand-600" : "text-ink-soft"
                        }`}
                        title="Edit details & photos"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
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
                {editingId === p.id && (
                  <tr>
                    <td colSpan={5} className="bg-sand/40 px-4 py-5">
                      <EditProductPanel
                        product={p}
                        onClose={() => setEditingId(null)}
                        onSaved={load}
                      />
                    </td>
                  </tr>
                )}
              </Fragment>
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

function EditProductPanel({
  product,
  onClose,
  onSaved,
}: {
  product: Product;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [fields, setFields] = useState<EditableFields>(() => toEditableFields(product));
  const [images, setImages] = useState<string[]>(product.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function persistImages(next: string[]) {
    setImages(next);
    await fetch(`/api/admin/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ images: next }),
    });
  }

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const { data, error: parseError } = await parseJsonResponse<{ url: string; error?: string }>(res);
      if (parseError) throw new Error(parseError);
      if (!res.ok || !data) throw new Error(data?.error ?? "Upload failed.");
      await persistImages([...images, data.url]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function handleRemoveImage(url: string) {
    await persistImages(images.filter((i) => i !== url));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fields.name,
          category: fields.category,
          price: Math.round(parseFloat(fields.price) * 100),
          compareAtPrice: fields.compareAtPrice
            ? Math.round(parseFloat(fields.compareAtPrice) * 100)
            : undefined,
          shortDescription: fields.shortDescription,
          description: fields.description,
          dimensions: fields.dimensions,
          weightLbs: parseFloat(fields.weightLbs) || 0,
          stock: parseInt(fields.stock, 10) || 0,
        }),
      });
      const { data, error: parseError } = await parseJsonResponse<{ error?: string }>(res);
      if (parseError) throw new Error(parseError);
      if (!res.ok) throw new Error(data?.error ?? "Couldn't save changes.");
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-5 md:grid-cols-[220px_1fr]">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-soft">Photos</p>
        <div className="flex flex-wrap gap-2">
          {images.map((url) => (
            <div key={url} className="relative h-20 w-20 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-20 w-20 rounded-lg object-cover" />
              <button
                type="button"
                onClick={() => handleRemoveImage(url)}
                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-cream"
                title="Remove photo"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-line text-ink-soft hover:bg-white disabled:opacity-60"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            <span className="text-[10px]">{uploading ? "Uploading…" : "Add photo"}</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="hidden"
            onChange={handleFileSelected}
          />
        </div>
        <p className="mt-2 text-[11px] text-ink-soft/70">JPEG, PNG, WEBP, or AVIF — up to 4MB.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <input
          className="col-span-2 rounded-lg border border-line px-3 py-2 text-sm sm:col-span-1"
          value={fields.name}
          onChange={(e) => setFields({ ...fields, name: e.target.value })}
          placeholder="Product name"
        />
        <select
          className="rounded-lg border border-line px-3 py-2 text-sm"
          value={fields.category}
          onChange={(e) => setFields({ ...fields, category: e.target.value as ProductCategory })}
        >
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.label}
            </option>
          ))}
        </select>
        <input
          type="number"
          step="0.01"
          className="rounded-lg border border-line px-3 py-2 text-sm"
          value={fields.price}
          onChange={(e) => setFields({ ...fields, price: e.target.value })}
          placeholder="Price (USD)"
        />
        <input
          type="number"
          step="0.01"
          className="rounded-lg border border-line px-3 py-2 text-sm"
          value={fields.compareAtPrice}
          onChange={(e) => setFields({ ...fields, compareAtPrice: e.target.value })}
          placeholder="Compare-at price (optional)"
        />
        <input
          type="number"
          className="rounded-lg border border-line px-3 py-2 text-sm"
          value={fields.stock}
          onChange={(e) => setFields({ ...fields, stock: e.target.value })}
          placeholder="Stock"
        />
        <input
          className="rounded-lg border border-line px-3 py-2 text-sm"
          value={fields.dimensions}
          onChange={(e) => setFields({ ...fields, dimensions: e.target.value })}
          placeholder="Dimensions"
        />
        <input
          type="number"
          className="rounded-lg border border-line px-3 py-2 text-sm"
          value={fields.weightLbs}
          onChange={(e) => setFields({ ...fields, weightLbs: e.target.value })}
          placeholder="Weight (lb)"
        />
        <input
          className="col-span-2 rounded-lg border border-line px-3 py-2 text-sm"
          value={fields.shortDescription}
          onChange={(e) => setFields({ ...fields, shortDescription: e.target.value })}
          placeholder="Short description"
        />
        <textarea
          className="col-span-2 rounded-lg border border-line px-3 py-2 text-sm"
          rows={3}
          value={fields.description}
          onChange={(e) => setFields({ ...fields, description: e.target.value })}
          placeholder="Full description"
        />

        {error && <p className="col-span-2 text-xs text-brand-700">{error}</p>}

        <div className="col-span-2 flex items-center gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-2 text-sm font-semibold text-cream disabled:opacity-60"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Save changes
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-line px-5 py-2 text-sm font-medium text-ink-soft hover:bg-white"
          >
            Cancel
          </button>
          <span className="ml-auto text-xs text-ink-soft/70">
            Current price: {formatPrice(product.price)}
          </span>
        </div>
      </div>
    </div>
  );
}
