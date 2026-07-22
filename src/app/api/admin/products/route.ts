import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAllProducts } from "@/lib/products";
import { addCustomProduct } from "@/lib/catalog-store";
import type { Product } from "@/lib/types";

const CATEGORY_SLUGS = [
  "sofas-sectionals",
  "sofa-beds",
  "bedroom",
  "storage",
  "dining",
  "home-office",
  "accent-decor",
] as const;

const newProductSchema = z.object({
  name: z.string().min(1),
  category: z.enum(CATEGORY_SLUGS),
  price: z.number().int().min(0),
  compareAtPrice: z.number().int().min(0).optional(),
  shortDescription: z.string().min(1),
  description: z.string().min(1),
  dimensions: z.string().min(1),
  weightLbs: z.number().min(0),
  images: z.array(z.string().url()).optional(),
  stock: z.number().int().min(0),
});

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  return NextResponse.json({ products: await getAllProducts() });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const json = await request.json().catch(() => null);
  const parsed = newProductSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid product data." }, { status: 400 });
  }

  const id = `custom-${Date.now()}`;
  const slug = parsed.data.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const product: Product = {
    id,
    slug: `${slug}-${id.slice(-5)}`,
    icon: "package",
    colorway: "#BF4E30",
    features: [],
    ...parsed.data,
  };

  await addCustomProduct(product);
  revalidatePath("/", "layout");

  return NextResponse.json({ product }, { status: 201 });
}
