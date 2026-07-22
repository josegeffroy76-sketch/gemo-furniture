import { NextResponse } from "next/server";
import { getAllProducts } from "@/lib/products";

/** Public, read-only catalog snapshot used by client components (cart, etc.) */
export async function GET() {
  return NextResponse.json({ products: getAllProducts() });
}
