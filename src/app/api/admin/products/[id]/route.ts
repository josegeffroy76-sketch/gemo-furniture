import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { setOverride, updateCustomProduct, removeCustomProduct } from "@/lib/catalog-store";
import { getCategories } from "@/lib/categories";

// Categories are admin-defined now (see src/app/api/admin/categories) — the
// handler below checks a submitted category slug against getCategories()
// at request time instead of a fixed enum.
const patchSchema = z.object({
  name: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  price: z.number().int().min(0).optional(),
  compareAtPrice: z.number().int().min(0).optional(),
  shortDescription: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  dimensions: z.string().min(1).optional(),
  weightLbs: z.number().min(0).optional(),
  shipLengthIn: z.number().min(0).optional(),
  shipWidthIn: z.number().min(0).optional(),
  shipHeightIn: z.number().min(0).optional(),
  extraShipBoxes: z
    .array(
      z.object({
        weightLbs: z.number().min(0),
        lengthIn: z.number().min(0),
        widthIn: z.number().min(0),
        heightIn: z.number().min(0),
      })
    )
    .optional(),
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

  if (parsed.data.category) {
    const categories = await getCategories();
    if (!categories.some((c) => c.slug === parsed.data.category)) {
      return NextResponse.json({ error: "Unknown category." }, { status: 400 });
    }
  }

  if (id.startsWith("custom-")) {
    await updateCustomProduct(id, parsed.data);
  } else {
    await setOverride(id, parsed.data);
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
    await removeCustomProduct(id);
  } else {
    // Starter-catalog items are code-defined, so "delete" hides them instead.
    await setOverride(id, { hidden: true });
  }

  revalidateCatalog();
  return NextResponse.json({ ok: true });
}
