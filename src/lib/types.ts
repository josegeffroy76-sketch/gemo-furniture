export type ProductCategory =
  | "sofas-sectionals"
  | "sofa-beds"
  | "bedroom"
  | "storage"
  | "dining"
  | "home-office"
  | "accent-decor";

export type ProductIcon =
  | "sofa"
  | "armchair"
  | "bed-double"
  | "bed-single"
  | "table-2"
  | "lamp"
  | "package"
  | "box";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  price: number; // in cents (USD)
  compareAtPrice?: number; // in cents (USD) — original retail price for "below retail" messaging
  shortDescription: string;
  description: string;
  features: string[];
  dimensions: string;
  weightLbs: number;
  // Real packed-box dimensions (inches) used for live Shippo rate quotes.
  // Optional — products without these fall back to a generic shared-box
  // estimate (see buildParcelFromCart in src/lib/shippo.ts), which is what
  // was causing inflated, UPS-only quotes for large items: a big one-size
  // box has a huge "dimensional weight" that most carriers charge extra
  // for, and some carriers (USPS, FedEx Ground) reject oversized packages
  // outright rather than quote them.
  shipLengthIn?: number;
  shipWidthIn?: number;
  shipHeightIn?: number;
  // Extra boxes for items that ship in more than one package (e.g. a
  // sectional sofa with a separate chaise box, or a bed frame with a
  // separate headboard box). Box 1 is always the fields above (weightLbs +
  // shipLengthIn/Width/Height); each entry here is an additional box quoted
  // as its own parcel in the same Shippo shipment request — see
  // buildParcelsFromCart in src/lib/shippo.ts.
  extraShipBoxes?: ShipBox[];
  icon: ProductIcon;
  colorway: string; // hex used for the placeholder art tint
  images?: string[]; // uploaded product photo URLs (Vercel Blob) — falls back to the icon placeholder when empty
  stock: number;
  bestseller?: boolean;
  newArrival?: boolean;
  hidden?: boolean;
}

export interface ShipBox {
  weightLbs: number;
  lengthIn: number;
  widthIn: number;
  heightIn: number;
}

export interface CartLine {
  productId: string;
  quantity: number;
}

export interface ProductReview {
  id: string;
  productId: string;
  orderId: string; // Stripe Checkout Session ID — ties the review to a verified purchase
  customerName: string;
  rating: number; // 1-5
  reviewText: string;
  createdAt: string; // ISO timestamp
}

export interface Address {
  name: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  country: string; // ISO 2-letter, "US" for launch
  phone?: string;
  email?: string;
}
