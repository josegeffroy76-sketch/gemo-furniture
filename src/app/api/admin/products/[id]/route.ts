import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { setOverride, updateCustomProduct, removeCustomProduct } from "@/lib/catalog-store";

const CATEGORY_SLUGS = [
  "sofas-sectionals",
  "sofa-beds",
  "bedroom",
  "storage",
  "dining",
  "home-office",
  "accent-decor",
] as const;

const patchSchema = z.object({
  name: z.string().min(1).optional(),
  category: z.enum(CATEGORY_SLUGS).optional(),
  price: z.number().int().min(0).optional(),
  compareAtPrice: z.number().int().min(0).optional(),
  shortDescription: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  dimensions: z.string().min(1).optional(),
  weightLbs: z.number().min(0).optional(),
  images: z.array(z.string().url()).optional(),
  stock: z.number().int().min(0).optional(),
  hidden: z.boolean().optional(),
});

function revalidateCatalog() {
  // Broad invalidation: product edits are infrequent admin actions, so
  // correctness (customers never see stale price/photos) wins over the
  // marginal cache-hit savings of narrower revalidation.
  revalidatePath("/", "layout");
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const json = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid update." }, { status: 400 });
  }

  if (id.startsWith("custom-")) {
    updateCustomProduct(id, parsed.data);
  } else {
    setOverride(id, parsed.data);
  }

  revalidateCatalog();
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;

  if (id.startsWith("custom-")) {
    removeCustomProduct(id);
  } else {
    // Starter-catalog items are code-defined, so "delete" hides them instead.
    setOverride(id, { hidden: true });
  }

  revalidateCatalog();
  return NextResponse.json({ ok: true });
}
