import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getProductById } from "@/lib/products";
import { getOrderById } from "@/lib/orders-store";
import { addReview, hasReviewed } from "@/lib/reviews-store";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

const reviewSchema = z.object({
  orderId: z.string().min(1),
  productId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  reviewText: z.string().max(2000).optional().default(""),
  customerName: z.string().min(1).max(80),
});

/**
 * Confirms the product was actually part of a paid order before letting a
 * review through. Checks our own order log first; if the Stripe webhook
 * hasn't landed yet (a customer can reach the success page and submit a
 * review within seconds of paying), falls back to asking Stripe directly.
 */
async function wasProductPurchased(orderId: string, productId: string): Promise<boolean> {
  const order = await getOrderById(orderId);
  if (order) {
    return order.status === "paid" && order.lines.some((l) => l.productId === productId);
  }

  if (!isStripeConfigured()) return false;
  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(orderId);
    if (session.payment_status !== "paid") return false;
    const cartLines: { productId: string; quantity: number }[] = session.metadata?.cartLines
      ? JSON.parse(session.metadata.cartLines)
      : [];
    return cartLines.some((l) => l.productId === productId);
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = reviewSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid review." }, { status: 400 });
  }
  const { orderId, productId, rating, reviewText, customerName } = parsed.data;

  if (!(await wasProductPurchased(orderId, productId))) {
    return NextResponse.json(
      { error: "We couldn't verify this product was part of that order." },
      { status: 403 }
    );
  }

  if (await hasReviewed(orderId, productId)) {
    return NextResponse.json(
      { error: "You've already submitted a review for this product from this order." },
      { status: 409 }
    );
  }

  const product = await getProductById(productId);
  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  await addReview({
    id: `${orderId}-${productId}`,
    productId,
    orderId,
    customerName,
    rating,
    reviewText,
    createdAt: new Date().toISOString(),
  });

  revalidatePath(`/shop/${product.slug}`);
  revalidatePath("/admin/reviews");

  return NextResponse.json({ ok: true }, { status: 201 });
}
