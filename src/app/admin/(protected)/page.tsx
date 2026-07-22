import Link from "next/link";
import { getAllProducts } from "@/lib/products";
import { getOrders } from "@/lib/orders-store";
import { formatPrice } from "@/lib/format";
import { isStripeConfigured } from "@/lib/stripe";
import { isShippoConfigured } from "@/lib/shippo";

export default async function AdminDashboardPage() {
  const [products, orders] = await Promise.all([getAllProducts(), getOrders()]);
  const revenue = orders.reduce((sum, o) => sum + o.amountTotal, 0);
  const lowStock = products.filter((p) => p.stock <= 5);

  const stats = [
    { label: "Products live", value: products.length },
    { label: "Orders received", value: orders.length },
    { label: "Total revenue", value: formatPrice(revenue) },
    { label: "Low stock (≤5)", value: lowStock.length },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl text-ink">Dashboard</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-line bg-white/60 p-5">
            <p className="text-2xl font-semibold text-ink">{s.value}</p>
            <p className="mt-1 text-xs text-ink-soft">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-line bg-white/60 p-5">
        <h2 className="text-sm font-semibold text-ink">Integration status</h2>
        <ul className="mt-3 space-y-2 text-sm">
          <li className="flex items-center justify-between">
            <span className="text-ink-soft">Stripe payments</span>
            <StatusBadge ok={isStripeConfigured()} />
          </li>
          <li className="flex items-center justify-between">
            <span className="text-ink-soft">Shippo live shipping rates</span>
            <StatusBadge ok={isShippoConfigured()} />
          </li>
        </ul>
        {!isStripeConfigured() || !isShippoConfigured() ? (
          <p className="mt-3 text-xs text-ink-soft/70">
            Add the missing API keys to <code>.env.local</code> — see <code>.env.example</code>.
          </p>
        ) : null}
      </div>

      {lowStock.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-semibold text-ink">Low stock</h2>
          <ul className="mt-3 divide-y divide-line rounded-xl border border-line bg-white/60">
            {lowStock.map((p) => (
              <li key={p.id} className="flex items-center justify-between px-4 py-3 text-sm">
                <Link href={`/shop/${p.slug}`} className="text-ink hover:text-brand-600">
                  {p.name}
                </Link>
                <span className="text-ink-soft">{p.stock} left</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ ok }: { ok: boolean }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        ok ? "bg-brand-50 text-brand-700" : "bg-sand text-ink-soft"
      }`}
    >
      {ok ? "Connected" : "Not configured"}
    </span>
  );
}
