import { NextResponse } from "next/server";
import { z } from "zod";
import { getProductById } from "@/lib/products";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

const bodySchema = z.object({
  lines: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().min(1).max(99),
      })
    )
    .min(1),
  address: z.object({
    street1: z.string().min(1),
    street2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(1),
    zip: z.string().min(3),
    country: z.string().default("US"),
  }),
  shippingAmount: z.number().int().min(0),
});

/**
 * Live tax preview shown on our own Shipping page, so customers see the real
 * sales tax breakdown before they ever reach Stripe's hosted checkout page
 * (which otherwise only reveals it after they type a billing address there).
 *
 * This calls Stripe's standalone Tax Calculation API — a read-only preview
 * that does NOT create a billable tax transaction. Only the Checkout Session
 * created in /api/checkout (once the customer actually pays) is a real,
 * recorded transaction. Calling this as often as the address changes is safe
 * and free.
 */
export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ taxAmount: null, reason: "not_configured" }, { status: 200 });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid tax estimate request." }, { status: 400 });
  }
  const { lines, address, shippingAmount } = parsed.data;

  // Re-derive prices server-side from the catalog, exactly like /api/checkout —
  // never trust client-sent prices, even for a preview.
  const resolvedLines = (
    await Promise.all(
      lines.map(async (line) => {
        const product = await getProductById(line.productId);
        if (!product || product.stock < 1) return null;
        return {
          amount: product.price * line.quantity,
          quantity: line.quantity,
          reference: product.id,
        };
      })
    )
  ).filter((x): x is NonNullable<typeof x> => x !== null);

  if (resolvedLines.length === 0) {
    return NextResponse.json({ error: "No valid items to estimate tax for." }, { status: 400 });
  }

  try {
    const stripe = getStripe();
    const calculation = await stripe.tax.calculations.create({
      currency: "usd",
      line_items: resolvedLines,
      customer_details: {
        address: {
          line1: address.street1,
          line2: address.street2,
          city: address.city,
          state: address.state,
          postal_code: address.zip,
          country: address.country || "US",
        },
        // We only ever collect one address on this page (used for both
        // shipping and billing), so "shipping" is the accurate source here.
        address_source: "shipping",
      },
      shipping_cost: {
        amount: shippingAmount,
        tax_code: "txcd_92010001",
      },
    });

    return NextResponse.json({
      taxAmount: calculation.tax_amount_exclusive,
      amountTotal: calculation.amount_total,
    });
  } catch (err) {
    console.error("Stripe tax calculation error:", err);
    // Non-fatal — the Shipping page just falls back to hiding the estimate;
    // the real tax still gets calculated correctly on Stripe's own checkout
    // page moments later.
    // TEMPORARY debugMessage for live diagnosis — revert once resolved.
    const debugMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { taxAmount: null, reason: "calculation_failed", debugMessage },
      { status: 200 }
    );
  }
}
