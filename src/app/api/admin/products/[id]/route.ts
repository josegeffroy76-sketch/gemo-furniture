import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { setOverride, updateCustomProduct, removeCustomProduct } from "@/lib/catalog-store";

const patchSchema = z.object({
  name: z.string().min(1).optional(),
  price: z.number().int().min(0).optional(),
  compareAtPrice: z.number().int().min(0).optional(),
  stock: z.number().int().min(0).optional(),
  hidden: z.boolean().optional(),
});

function revalidateCatalog() {
  revalidatePath("/shop");
  revalidatePath("/");
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
