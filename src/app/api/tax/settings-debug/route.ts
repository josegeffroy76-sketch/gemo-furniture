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
    const settings = await stripe.tax.settings.retrieve();
    return NextResponse.json(settings);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 200 }
    );
  }
}

export async function POST() {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "not_configured" }, { status: 200 });
  }
  try {
    const stripe = getStripe();
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
