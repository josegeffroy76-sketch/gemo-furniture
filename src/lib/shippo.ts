import { Shippo } from "shippo";
import type { Address, Product } from "./types";

const WAREHOUSE_ORIGIN: Address = {
  name: "GEMO Furniture Warehouse",
  street1: process.env.WAREHOUSE_STREET1 ?? "1201 Freight Way",
  city: process.env.WAREHOUSE_CITY ?? "Ontario",
  state: process.env.WAREHOUSE_STATE ?? "CA",
  zip: process.env.WAREHOUSE_ZIP ?? "91761",
  country: "US",
};

export interface ShippingRateOption {
  id: string;
  carrier: string;
  serviceLevel: string;
  amount: number; // cents
  estimatedDays: number | null;
}

export function isShippoConfigured(): boolean {
  return Boolean(process.env.SHIPPO_API_TOKEN);
}

let shippoClient: Shippo | null = null;

function getShippo(): Shippo {
  if (shippoClient) return shippoClient;
  const apiKeyHeader = process.env.SHIPPO_API_TOKEN;
  if (!apiKeyHeader) {
    throw new Error(
      "SHIPPO_API_TOKEN is not set. Add it to .env.local (see .env.example) to enable live shipping rates."
    );
  }
  shippoClient = new Shippo({ apiKeyHeader });
  return shippoClient;
}

/** Combines cart line items into a single parcel using simple box-packing math. */
function buildParcelFromCart(items: { product: Product; quantity: number }[]) {
  const totalWeightLbs = items.reduce((sum, i) => sum + i.product.weightLbs * i.quantity, 0);
  // Conservative flat-rate freight box estimate for small-space furniture.
  // Swap this for real per-product package dimensions once the catalog is finalized.
  return {
    massUnit: "lb" as const,
    weightUnit: "lb" as const,
    weight: String(Math.max(totalWeightLbs, 1)),
    distanceUnit: "in" as const,
    height: "24",
    length: "40",
    width: "24",
  };
}

/**
 * Fetches live shipping rates from Shippo for a cart + destination address.
 * Falls back to a transparent flat estimate if Shippo isn't configured yet,
 * so checkout keeps working during development.
 */
export async function getShippingRates(
  destination: Address,
  items: { product: Product; quantity: number }[]
): Promise<ShippingRateOption[]> {
  if (!isShippoConfigured()) {
    return getFallbackEstimate(items);
  }

  const shippo = getShippo();
  const parcel = buildParcelFromCart(items);

  const shipment = await shippo.shipments.create({
    addressFrom: {
      name: WAREHOUSE_ORIGIN.name,
      street1: WAREHOUSE_ORIGIN.street1,
      city: WAREHOUSE_ORIGIN.city,
      state: WAREHOUSE_ORIGIN.state,
      zip: WAREHOUSE_ORIGIN.zip,
      country: WAREHOUSE_ORIGIN.country,
    },
    addressTo: {
      name: destination.name,
      street1: destination.street1,
      street2: destination.street2,
      city: destination.city,
      state: destination.state,
      zip: destination.zip,
      country: destination.country || "US",
      phone: destination.phone,
      email: destination.email,
    },
    parcels: [
      {
        massUnit: parcel.massUnit,
        weight: parcel.weight,
        distanceUnit: parcel.distanceUnit,
        height: parcel.height,
        length: parcel.length,
        width: parcel.width,
      },
    ],
    async: false,
  });

  return shipment.rates
    .map((rate) => ({
      id: rate.objectId ?? `${rate.provider}-${rate.servicelevel?.token ?? "rate"}`,
      carrier: rate.provider ?? "Carrier",
      serviceLevel: rate.servicelevel?.name ?? "Standard",
      amount: Math.round(parseFloat(rate.amount) * 100),
      estimatedDays: rate.estimatedDays ?? null,
    }))
    .sort((a, b) => a.amount - b.amount);
}

/**
 * Flat-rate placeholder used until SHIPPO_API_TOKEN is configured, so the
 * checkout flow is fully testable end-to-end without a live account.
 */
function getFallbackEstimate(items: { product: Product; quantity: number }[]): ShippingRateOption[] {
  const totalWeightLbs = items.reduce((sum, i) => sum + i.product.weightLbs * i.quantity, 0);
  const base = 1999;
  const perLb = 45; // cents per lb, rough nationwide furniture-freight estimate
  const standard = base + Math.round(totalWeightLbs * perLb);
  const expedited = Math.round(standard * 1.6);

  return [
    {
      id: "estimate-standard",
      carrier: "Estimated (configure Shippo for live rates)",
      serviceLevel: "Standard Ground (5–8 business days)",
      amount: standard,
      estimatedDays: 7,
    },
    {
      id: "estimate-expedited",
      carrier: "Estimated (configure Shippo for live rates)",
      serviceLevel: "Expedited (2–4 business days)",
      amount: expedited,
      estimatedDays: 3,
    },
  ];
}
