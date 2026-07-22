import { readJsonFile, writeJsonFile } from "./json-file-store";

export interface OrderRecord {
  id: string; // Stripe Checkout Session ID
  createdAt: string; // ISO timestamp
  customerEmail: string | null;
  customerName: string | null;
  amountTotal: number; // cents
  currency: string;
  items: { name: string; quantity: number; amount: number }[];
  shippingAddress: {
    line1?: string | null;
    line2?: string | null;
    city?: string | null;
    state?: string | null;
    postalCode?: string | null;
    country?: string | null;
  } | null;
  status: "paid" | "pending" | "refunded";
}

const ORDERS_FILE = "orders.json";

export function getOrders(): OrderRecord[] {
  return readJsonFile<OrderRecord[]>(ORDERS_FILE, []);
}

export function saveOrder(order: OrderRecord): void {
  const orders = getOrders();
  if (orders.some((o) => o.id === order.id)) return; // idempotent on webhook retries
  orders.unshift(order);
  writeJsonFile(ORDERS_FILE, orders);
}
