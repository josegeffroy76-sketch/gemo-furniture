import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getCategories, SEED_CATEGORIES } from "@/lib/categories";
import { setCategoryOverride, updateCustomCategory, removeCustomCategory } from "@/lib/categories-store";
import { getAllProducts } from "@/lib/products";

const patchSchema = z.object({
  label: z.string().trim().min(1).max(60).optional(),
  blurb: z.string().trim().max(160).optional(),
});

function revalidateCatalog() {
  revalidatePath("/", "layout");
}

export async function PATCH(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { slug } = await params;
  const json = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid update." }, { status: 400 });
  }

  const isSeed = SEED_CATEGORIES.some((c) => c.slug === slug);
  if (isSeed) {
    // Starter categories are code-defined, so a "rename" is stored as an
    // override rather than mutating the seed list itself.
    await setCategoryOverride(slug, parsed.data);
  } else {
    const exists = (await getCategories()).some((c) => c.slug === slug);
    if (!exists) {
      return NextResponse.json({ error: "Category not found." }, { status: 404 });
    }
    await updateCustomCategory(slug, parsed.data);
  }

  revalidateCatalog();
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { slug } = await params;

  if (SEED_CATEGORIES.some((c) => c.slug === slug)) {
    return NextResponse.json(
      { error: "Starter categories can be renamed but not deleted." },
      { status: 400 }
    );
  }

  const inUse = (await getAllProducts()).some((p) => p.category === slug);
  if (inUse) {
    return NextResponse.json(
      { error: "This category still has products in it — move or remove those first." },
      { status: 400 }
    );
  }

  await removeCustomCategory(slug);
  revalidateCatalog();
  return NextResponse.json({ ok: true });
}
