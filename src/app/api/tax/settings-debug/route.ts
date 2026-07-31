import { NextResponse } from "next/server";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

/**
 * TEMPORARY diagnostic-only route — not linked from anywhere in the app.
 * Lets us inspect (GET) and fix (POST) Stripe Tax Settings directly via the
 * API instead of the dashboard UI, which has been unreliable to automate.
 * Delete this file once the test-mode tax estimate feature is confirmed
 * working end to end.
 */
export async function GET() {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "not_configured" }, { status: 200 });
  }
  try {
    const stripe = getStripe();
    const [settings, registrations] = await Promise.all([
      stripe.tax.settings.retrieve(),
      stripe.tax.registrations.list({ limit: 10 }),
    ]);
    return NextResponse.json({ settings, registrations: registrations.data });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 200 }
    );
  }
}

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "not_configured" }, { status: 200 });
  }
  const action = new URL(request.url).searchParams.get("action") || "head_office";
  try {
    const stripe = getStripe();
    if (action === "registration") {
      const registration = await stripe.tax.registrations.create({
        active_from: "now",
        country: "US",
        country_options: {
          us: {
            state: "CA",
            type: "state_sales_tax",
          },
        },
      });
      return NextResponse.json(registration);
    }
    if (action === "codes") {
      const code = await stripe.taxCodes.retrieve("txcd_10000000");
      return NextResponse.json(code);
    }
    if (action === "calc") {
      const calculation = await stripe.tax.calculations.create({
        currency: "usd",
        line_items: [{ amount: 24800, quantity: 1, reference: "p002", tax_code: "txcd_10000000" }],
        customer_details: {
          address: {
            line1: "123 Main St",
            city: "Los Angeles",
            state: "CA",
            postal_code: "90001",
            country: "US",
          },
          address_source: "shipping",
        },
        shipping_cost: { amount: 1097, tax_code: "txcd_92010001" },
      });
      return NextResponse.json(calculation);
    }
    const settings = await stripe.tax.settings.update({
      head_office: {
        address: {
          line1: "1063 North Glassell Street",
          city: "Orange",
          state: "CA",
          postal_code: "92865",
          country: "US",
        },
      },
    });
    return NextResponse.json(settings);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 200 }
    );
  }
}
