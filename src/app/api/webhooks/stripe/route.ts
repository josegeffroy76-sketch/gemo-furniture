import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getStripe } from "@/lib/stripe";
import { saveOrder } from "@/lib/orders-store";

/**
 * Stripe webhook endpoint — logs completed orders for the admin dashboard.
 * Configure this URL (https://yourdomain.com/api/webhooks/stripe) in the
 * Stripe Dashboard, and set STRIPE_WEBHOOK_SECRET to the signing secret it
 * gives you. See .env.example.
 */
export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 501 });
  }

  const signature = request.headers.get("stripe-signature");
  const payload = await request.text();

  const stripe = getStripe();
  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature ?? "", webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });
      const metadata = session.metadata ?? {};

      let cartLines: { productId: string; quantity: number }[] = [];
      try {
        cartLines = metadata.cartLines ? JSON.parse(metadata.cartLines) : [];
      } catch (err) {
        console.error("Couldn't parse cartLines metadata:", err);
      }

      // Stripe's own customer_details.address is only populated if
      // billing/shipping address collection is explicitly enabled on the
      // Checkout Session — since the address is collected on our own
      // shipping page instead, read back what we stored in metadata.
      let checkoutAddress: {
        name?: string;
        street1?: string;
        street2?: string;
        city?: string;
        state?: string;
        zip?: string;
        country?: string;
        email?: string;
      } | null = null;
      try {
        checkoutAddress = metadata.shippingAddress ? JSON.parse(metadata.shippingAddress) : null;
      } catch (err) {
        console.error("Couldn't parse shippingAddress metadata:", err);
      }

      await saveOrder({
        id: session.id,
        createdAt: new Date(session.created * 1000).toISOString(),
        customerEmail: session.customer_details?.email ?? checkoutAddress?.email ?? null,
        customerName: session.customer_details?.name ?? checkoutAddress?.name ?? null,
        amountTotal: session.amount_total ?? 0,
        currency: session.currency ?? "usd",
        items: lineItems.data.map((li) => ({
          name: li.description ?? "Item",
          quantity: li.quantity ?? 1,
          amount: li.amount_total ?? 0,
        })),
        lines: cartLines,
        shippingCarrier: metadata.shippingCarrier ?? null,
        shippingServiceLevel: metadata.shippingServiceLevel ?? null,
        shippingAmount: metadata.shippingAmount ? Number(metadata.shippingAmount) : null,
        taxAmount: session.total_details?.amount_tax ?? null,
        shippingAddress: checkoutAddress
          ? {
              line1: checkoutAddress.street1 ?? null,
              line2: checkoutAddress.street2 ?? null,
              city: checkoutAddress.city ?? null,
              state: checkoutAddress.state ?? null,
              postalCode: checkoutAddress.zip ?? null,
              country: checkoutAddress.country ?? null,
            }
          : null,
        status: "paid",
        label: null,
        reviewRequestSentAt: null,
      });

      revalidatePath("/admin/orders");
    } catch (err) {
      console.error("Failed to record order from webhook:", err);
    }
  }

  return NextResponse.json({ received: true });
}
