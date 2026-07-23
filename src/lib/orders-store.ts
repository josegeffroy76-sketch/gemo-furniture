import { readJsonFile, writeJsonFile } from "./json-file-store";

export interface OrderLabel {
  url: string;
  trackingNumber: string | null;
  trackingUrlProvider: string | null;
  carrier: string | null;
  serviceLevel: string | null;
  createdAt: string; // ISO timestamp
}

export interface OrderRecord {
  id: string; // Stripe Checkout Session ID
  createdAt: string; // ISO timestamp
  customerEmail: string | null;
  customerName: string | null;
  amountTotal: number; // cents
  currency: string;
  items: { name: string; quantity: number; amount: number }[];
  // Cart line items (productId + quantity) as sold — used to rebuild real
  // per-product parcels when generating a shipping label later, since the
  // original checkout-time Shippo rate typically expires within days.
  lines: { productId: string; quantity: number }[];
  shippingCarrier: string | null;
  shippingServiceLevel: string | null;
  shippingAmount: number | null; // cents, what the customer paid for shipping
  taxAmount: number | null; // cents, sales tax collected via Stripe Tax (0/null if not applicable)
  shippingAddress: {
    line1?: string | null;
    line2?: string | null;
    city?: string | null;
    state?: string | null;
    postalCode?: string | null;
    country?: string | null;
  } | null;
  status: "paid" | "pending" | "refunded";
  label?: OrderLabel | null;
}

const ORDERS_FILE = "orders.json";

export async function getOrders(): Promise<OrderRecord[]> {
  return readJsonFile<OrderRecord[]>(ORDERS_FILE, []);
}

export async function getOrderById(id: string): Promise<OrderRecord | null> {
  const orders = await getOrders();
  return orders.find((o) => o.id === id) ?? null;
}

export async function saveOrder(order: OrderRecord): Promise<void> {
  const orders = await getOrders();
  if (orders.some((o) => o.id === order.id)) return; // idempotent on webhook retries
  orders.unshift(order);
  await writeJsonFile(ORDERS_FILE, orders);
}

export async function updateOrder(id: string, patch: Partial<OrderRecord>): Promise<void> {
  const orders = await getOrders();
  const next = orders.map((o) => (o.id === id ? { ...o, ...patch } : o));
  await writeJsonFile(ORDERS_FILE, next);
}
