import { NextResponse } from "next/server";
import { getOrders, updateOrder } from "@/lib/orders-store";
import { isEmailConfigured, sendReviewRequestEmail } from "@/lib/email";

// How many days after purchase to ask for a review — long enough that a
// piece of furniture has plausibly arrived and been used a bit. Tune with
// REVIEW_REQUEST_DELAY_DAYS if your typical delivery + settle-in time is
// meaningfully shorter or longer than 14 days.
const REVIEW_REQUEST_DELAY_DAYS = Number(process.env.REVIEW_REQUEST_DELAY_DAYS ?? 14);

/**
 * Runs once a day via Vercel Cron (see vercel.json). Sends the "rate your
 * purchase" email for any paid order that's old enough and hasn't already
 * gotten one — idempotent via reviewRequestSentAt, so re-running (or a
 * duplicate/overlapping cron fire) is harmless.
 */
export async function GET(request: Request) {
  // Vercel adds this header automatically for scheduled invocations; also
  // accept a manual "Authorization: Bearer <CRON_SECRET>" call for testing.
  if (process.env.CRON_SECRET) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
  }

  if (!isEmailConfigured()) {
    return NextResponse.json({ skipped: "RESEND_API_KEY not set — no review-request emails to send." });
  }

  const orders = await getOrders();
  const cutoff = Date.now() - REVIEW_REQUEST_DELAY_DAYS * 24 * 60 * 60 * 1000;
  const due = orders.filter(
    (o) =>
      o.status === "paid" &&
      !o.reviewRequestSentAt &&
      o.customerEmail &&
      new Date(o.createdAt).getTime() <= cutoff
  );

  const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  let sent = 0;
  const errors: string[] = [];

  for (const order of due) {
    try {
      await sendReviewRequestEmail({
        to: order.customerEmail!,
        customerName: order.customerName,
        reviewUrl: `${origin}/review/${order.id}`,
      });
      await updateOrder(order.id, { reviewRequestSentAt: new Date().toISOString() });
      sent++;
    } catch (err) {
      console.error(`Failed to send review request for order ${order.id}:`, err);
      errors.push(order.id);
    }
  }

  return NextResponse.json({ checked: orders.length, due: due.length, sent, errors });
}
