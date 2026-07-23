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
 * using each product's own real ship dimensions + weight when set. Items
 * that ship in more than one box (product.extraShipBoxes) contribute one
 * additional parcel per extra box, per unit — Shippo shipments already
 * support quoting/purchasing a multi-parcel shipment as a single request,
 * so this only changes what we send in the existing `parcels` array, not
 * how we call Shippo.
 */
function buildParcelsFromCart(items: { product: Product; quantity: number }[]): ShippoParcel[] {
  const parcels: ShippoParcel[] = [];
  for (const { product, quantity } of items) {
    const hasRealDimensions = Boolean(
      product.shipLengthIn && product.shipWidthIn && product.shipHeightIn
    );
    const primaryBox = hasRealDimensions
      ? { length: product.shipLengthIn!, width: product.shipWidthIn!, height: product.shipHeightIn! }
      : FALLBACK_BOX;
    const primaryWeight = Math.max(product.weightLbs || 1, 1);

    const extraBoxes = (product.extraShipBoxes ?? [])
      .filter((b) => b.lengthIn && b.widthIn && b.heightIn)
      .map((b) => ({
        length: b.lengthIn,
        width: b.widthIn,
        height: b.heightIn,
        weight: Math.max(b.weightLbs || 1, 1),
      }));

    const boxesPerUnit = [
      { length: primaryBox.length, width: primaryBox.width, height: primaryBox.height, weight: primaryWeight },
      ...extraBoxes,
    ];

    for (let i = 0; i < quantity; i++) {
      for (const box of boxesPerUnit) {
        if (parcels.length >= MAX_PARCELS_PER_SHIPMENT) break;
        parcels.push({
          massUnit: "lb",
          weight: String(box.weight),
          distanceUnit: "in",
          height: String(box.height),
          length: String(box.length),
          width: String(box.width),
        });
      }
    }
  }
  return parcels;
}

/** Creates a Shippo shipment (live rate request) for a cart + destination. */
async function createShipment(destination: Address, items: { product: Product; quantity: number }[]) {
  const shippo = getShippo();
  const parcels = buildParcelsFromCart(items);

  return shippo.shipments.create({
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

  const shipment = await createShipment(destination, items);

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

export interface PurchasedLabel {
  url: string;
  trackingNumber: string | null;
  trackingUrlProvider: string | null;
  carrier: string;
  serviceLevel: string;
  amount: number; // cents, what the fresh rate actually cost
  matchedExactly: boolean; // false if the original carrier/service was no longer available and we fell back
}

/**
 * Purchases a real shipping label for an already-placed order. Re-quotes a
 * fresh rate rather than reusing the checkout-time one — Shippo only allows
 * purchasing rates less than 7 days old — and tries to match the original
 * carrier + service level the customer paid for. Falls back to the cheapest
 * available rate (any carrier) if that exact combination isn't quotable
 * anymore, flagging the fallback so the admin UI can warn about a possible
 * price mismatch.
 */
export async function createShippingLabel(
  destination: Address,
  items: { product: Product; quantity: number }[],
  desired: { carrier: string | null; serviceLevel: string | null }
): Promise<PurchasedLabel> {
  if (!isShippoConfigured()) {
    throw new Error("Shippo isn't configured (SHIPPO_API_TOKEN missing) — can't purchase a real label.");
  }
  if (items.length === 0) {
    throw new Error("No purchasable items on this order — nothing to build a parcel from.");
  }

  const shipment = await createShipment(destination, items);
  const rates = shipment.rates ?? [];
  if (rates.length === 0) {
    throw new Error("Shippo didn't return any shipping rates for this address right now.");
  }

  const exactMatch = desired.carrier
    ? rates.find(
        (r) =>
          (r.provider ?? "").toLowerCase() === desired.carrier!.toLowerCase() &&
          (r.servicelevel?.name ?? "").toLowerCase() === (desired.serviceLevel ?? "").toLowerCase()
      )
    : undefined;

  const cheapest = [...rates].sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount))[0];
  const chosenRate = exactMatch ?? cheapest;

  const shippo = getShippo();
  const transaction = await shippo.transactions.create({
    rate: chosenRate.objectId ?? "",
    labelFileType: "PDF",
    async: false,
  });

  if (transaction.status !== "SUCCESS" || !transaction.labelUrl) {
    const reason = transaction.messages?.map((m) => m.text).join("; ") || "Unknown error.";
    throw new Error(`Shippo couldn't create the label: ${reason}`);
  }

  return {
    url: transaction.labelUrl,
    trackingNumber: transaction.trackingNumber ?? null,
    trackingUrlProvider: transaction.trackingUrlProvider ?? null,
    carrier: chosenRate.provider ?? "Carrier",
    serviceLevel: chosenRate.servicelevel?.name ?? "Standard",
    amount: Math.round(parseFloat(chosenRate.amount) * 100),
    matchedExactly: Boolean(exactMatch),
  };
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
