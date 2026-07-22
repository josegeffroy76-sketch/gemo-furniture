import { getOrders } from "@/lib/orders-store";
import { formatPrice } from "@/lib/format";

export default function AdminOrdersPage() {
  const orders = getOrders();

  return (
    <div>
      <h1 className="font-display text-2xl text-ink">Orders</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Populated automatically from the Stripe webhook once it&apos;s configured. See{" "}
        <code>.env.example</code> for <code>STRIPE_WEBHOOK_SECRET</code>.
      </p>

      {orders.length === 0 ? (
        <p className="mt-10 text-sm text-ink-soft">No orders yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-line bg-white/60">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wide text-ink-soft">
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Items</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-3 text-ink-soft">
                    {new Date(order.createdAt).toLocaleDateString("en-US")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-ink">{order.customerName ?? "—"}</div>
                    <div className="text-xs text-ink-soft">{order.customerEmail ?? ""}</div>
                  </td>
                  <td className="px-4 py-3 text-ink-soft">
                    {order.items.map((i) => `${i.quantity}× ${i.name}`).join(", ")}
                  </td>
                  <td className="px-4 py-3 font-medium text-ink">{formatPrice(order.amountTotal)}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-700">
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
