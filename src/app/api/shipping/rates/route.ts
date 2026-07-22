import { NextResponse } from "next/server";
import { z } from "zod";
import { getProductById } from "@/lib/products";
import { getShippingRates } from "@/lib/shippo";

const bodySchema = z.object({
  address: z.object({
    name: z.string().min(1),
    street1: z.string().min(1),
    street2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(1),
    zip: z.string().min(3),
    country: z.string().default("US"),
    phone: z.string().optional(),
    email: z.string().optional(),
  }),
  lines: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().min(1),
      })
    )
    .min(1),
});

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const resolvedItems = await Promise.all(
    parsed.data.lines.map(async (line) => {
      const product = await getProductById(line.productId);
      return product ? { product, quantity: line.quantity } : null;
    })
  );
  const items = resolvedItems.filter(
    (x): x is { product: NonNullable<Awaited<ReturnType<typeof getProductById>>>; quantity: number } => x !== null
  );

  if (items.length === 0) {
    return NextResponse.json({ error: "No valid items in cart." }, { status: 400 });
  }

  try {
    const rates = await getShippingRates(parsed.data.address, items);
    return NextResponse.json({ rates });
  } catch (err) {
    console.error("Shipping rate error:", err);
    return NextResponse.json(
      { error: "Couldn't fetch shipping rates. Please try again." },
      { status: 502 }
    );
  }
}
