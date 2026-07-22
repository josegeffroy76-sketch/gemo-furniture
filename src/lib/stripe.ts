import Stripe from "stripe";

let stripeClient: Stripe | null = null;

/**
 * Lazily-created Stripe server client.
 * Throws a clear error at call time (not import time) if STRIPE_SECRET_KEY
 * hasn't been configured yet, so the rest of the app can still build/run
 * without keys during development.
 */
export function getStripe(): Stripe {
  if (stripeClient) return stripeClient;

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Add it to .env.local (see .env.example) to enable checkout."
    );
  }

  stripeClient = new Stripe(key);
  return stripeClient;
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}
