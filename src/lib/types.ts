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
  icon: ProductIcon;
  colorway: string; // hex used for the placeholder art tint
  images?: string[]; // uploaded product photo URLs (Vercel Blob) — falls back to the icon placeholder when empty
  stock: number;
  bestseller?: boolean;
  newArrival?: boolean;
  hidden?: boolean;
}

export interface CartLine {
  productId: string;
  quantity: number;
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
