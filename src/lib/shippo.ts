import { Shippo } from "shippo";
import type { Address, Product } from "./types";

const WAREHOUSE_ORIGIN: Address = {
  name: "GEMO Furniture Warehouse",
  street1: process.env.WAREHOUSE_STREET1 ?? "1063 N Glassell St",
  city: process.env.WAREHOUSE_CITY ?? "Orange",
  state: process.env.WAREHOUSE_STATE ?? "CA",
  zip: process.env.WAREHOUSE_ZIP ?? "92867",
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

interface ShippoParcel {
  massUnit: "lb";
  weight: string;
  distanceUnit: "in";
  height: string;
  length: string;
  width: string;
}

// Only used as a last resort for products missing real ship dimensions.
// IMPORTANT: this box is intentionally sized for small accent items, not
// furniture — a big generic box has a huge "dimensional weight" that most
// carriers bill extra for, and oversized packages get rejected outright by
// USPS/FedEx Ground rather than quoted. Set shipLengthIn/shipWidthIn/
// shipHeightIn on a product (via /admin/products) to get an accurate,
// carrier-comparable quote instead of this fallback.
const FALLBACK_BOX = { length: 20, width: 14, height: 14 };
const MAX_PARCELS_PER_SHIPMENT = 20; // safety cap on the Shippo request size

/**
 * Builds one parcel per cart unit (not one shared box for the whole cart),
 * using each product's own real ship dimensions + weight when set.
 */
function buildParcelsFromCart(items: { product: Product; quantity: number }[]): ShippoParcel[] {
  const parcels: ShippoParcel[] = [];
  for (const { product, quantity } of items) {
    const hasRealDimensions = Boolean(
      product.shipLengthIn && product.shipWidthIn && product.shipHeightIn
    );
    const box = hasRealDimensions
      ? { length: product.shipLengthIn!, width: product.shipWidthIn!, height: product.shipHeightIn! }
      : FALLBACK_BOX;
    const perUnitWeight = Math.max(product.weightLbs || 1, 1);

    for (let i = 0; i < quantity && parcels.length < MAX_PARCELS_PER_SHIPMENT; i++) {
      parcels.push({
        massUnit: "lb",
        weight: String(perUnitWeight),
        distanceUnit: "in",
        height: String(box.height),
        length: String(box.length),
        width: String(box.width),
      });
    }
  }
  return parcels;
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
  const parcels = buildParcelsFromCart(items);

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
    parcels,
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
