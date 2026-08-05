import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getCategories } from "@/lib/categories";
import { addCustomCategory } from "@/lib/categories-store";
import type { CategoryRecord } from "@/lib/types";

const newCategorySchema = z.object({
  label: z.string().trim().min(1).max(60),
  blurb: z.string().trim().max(160).optional(),
});

/** Same slugify rule used for custom-product slugs elsewhere in the admin API. */
function slugify(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  return NextResponse.json({ categories: await getCategories() });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const json = await request.json().catch(() => null);
  const parsed = newCategorySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid category data." }, { status: 400 });
  }

  const baseSlug = slugify(parsed.data.label);
  if (!baseSlug) {
    return NextResponse.json(
      { error: "Category name must include at least one letter or number." },
      { status: 400 }
    );
  }

  // Disambiguate if the new label happens to slugify to an existing one
  // (e.g. "Home Office" already taken) rather than silently overwriting it.
  const existing = await getCategories();
  let slug = baseSlug;
  let suffix = 2;
  while (existing.some((c) => c.slug === slug)) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  const category: CategoryRecord = {
    slug,
    label: parsed.data.label,
    blurb: parsed.data.blurb ?? "",
  };

  await addCustomCategory(category);
  revalidatePath("/", "layout");

  return NextResponse.json({ category }, { status: 201 });
}
