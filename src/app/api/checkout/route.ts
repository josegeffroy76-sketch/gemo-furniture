import { NextResponse } from "next/server";
import type Stripe from "stripe";
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
  shippingRate: z.object({
    id: z.string(),
    carrier: z.string(),
    serviceLevel: z.string(),
    amount: z.number().int().min(0),
  }),
});

/** Stripe metadata values are capped at 500 characters. */
function safeCartLinesMetadata(lines: { productId: string; quantity: number }[]): string {
  const json = JSON.stringify(lines);
  if (json.length <= 480) return json;
  console.warn(`Cart too large to fit in Stripe metadata (${json.length} chars) — omitting cartLines.`);
  return "[]";
}

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      {
        error:
          "Stripe isn't configured yet. Add STRIPE_SECRET_KEY to .env.local to enable checkout (see .env.example).",
      },
      { status: 501 }
    );
  }

  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid checkout request." }, { status: 400 });
  }

  const { lines, address, shippingRate } = parsed.data;

  // Re-derive every price server-side from the catalog — never trust client-sent prices.
  const resolvedLines = await Promise.all(
    lines.map(async (line): Promise<Stripe.Checkout.SessionCreateParams.LineItem | null> => {
      const product = await getProductById(line.productId);
      if (!product || product.stock < 1) return null;
      return {
        quantity: line.quantity,
        price_data: {
          currency: "usd",
          unit_amount: product.price,
          product_data: {
            name: product.name,
            metadata: { productId: product.id },
          },
        },
      };
    })
  );
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = resolvedLines.filter(
    (x): x is NonNullable<typeof x> => x !== null
  );

  if (lineItems.length === 0) {
    return NextResponse.json({ error: "No valid items to check out." }, { status: 400 });
  }

  lineItems.push({
    quantity: 1,
    price_data: {
      currency: "usd",
      unit_amount: shippingRate.amount,
      product_data: {
        name: `Shipping — ${shippingRate.serviceLevel} (${shippingRate.carrier})`,
        metadata: { shippingRateId: shippingRate.id },
      },
    },
  });

  const origin =
    request.headers.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      customer_email: address.email || undefined,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
      payment_intent_data: {
        shipping: {
          name: address.name,
          address: {
            line1: address.street1,
            line2: address.street2,
            city: address.city,
            state: address.state,
            postal_code: address.zip,
            country: address.country || "US",
          },
          phone: address.phone,
        },
      },
      metadata: {
        shippingRateId: shippingRate.id,
        shippingCarrier: shippingRate.carrier,
        shippingServiceLevel: shippingRate.serviceLevel,
        shippingAmount: String(shippingRate.amount),
        // Stripe metadata values are capped at 500 characters — stored so the
        // webhook can rebuild real per-product parcels when an admin
        // generates a shipping label later (the checkout-time Shippo rate
        // itself expires after a few days). Falls back to an empty array
        // for unusually large carts rather than erroring the checkout.
        cartLines: safeCartLinesMetadata(lines),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout session error:", err);
    return NextResponse.json(
      { error: "Couldn't start Stripe checkout. Please try again." },
      { status: 502 }
    );
  }
}
