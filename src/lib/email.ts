import { Resend } from "resend";

let resendClient: Resend | null = null;

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

/**
 * Lazily-created Resend client — same pattern as getStripe()/getShippo():
 * throws at call time (not import time) so the app still builds/runs
 * without an email key configured.
 */
function getResend(): Resend {
  if (resendClient) return resendClient;
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error(
      "RESEND_API_KEY is not set. Add it to .env.local (see .env.example) to send emails."
    );
  }
  resendClient = new Resend(key);
  return resendClient;
}

/**
 * "How's your purchase?" review-request email, sent by the
 * /api/cron/review-requests job once an order is old enough that the
 * product has plausibly arrived and been used a bit.
 *
 * Sends from RESEND_FROM_EMAIL if set — otherwise falls back to Resend's
 * shared onboarding@resend.dev sender, which works immediately with no
 * domain setup but looks less professional than a real "you@yourdomain.com"
 * address. Verify your domain in Resend and set RESEND_FROM_EMAIL once
 * you're ready for a proper "from" address.
 */
export async function sendReviewRequestEmail(params: {
  to: string;
  customerName: string | null;
  reviewUrl: string;
}): Promise<void> {
  const resend = getResend();
  const from = process.env.RESEND_FROM_EMAIL || "GEMO Furniture <onboarding@resend.dev>";
  const firstName = params.customerName?.split(" ")[0] || "there";

  await resend.emails.send({
    from,
    to: params.to,
    subject: "How's your new furniture from GEMO?",
    html: `
      <p>Hi ${firstName},</p>
      <p>We hope you're settling in with your new furniture! Would you mind taking a minute to rate it and leave a quick review? It really helps other shoppers.</p>
      <p><a href="${params.reviewUrl}">Rate your purchase</a></p>
      <p>Thanks for shopping with GEMO Furniture.</p>
    `,
  });
}
