import { readJsonFile, writeJsonFile } from "./json-file-store";
import type { ProductReview } from "./types";

const REVIEWS_FILE = "reviews.json";

/**
 * A product's star rating + written reviews only appear on the storefront
 * once it has at least this many reviews — a lone 5-star (or 1-star) review
 * isn't a meaningful signal yet, and a product with just one or two reviews
 * can look sparse/unfinished rather than trustworthy. Admins can see every
 * review as soon as it comes in, regardless of this threshold — see
 * /admin/reviews.
 */
export const PUBLIC_REVIEW_THRESHOLD = 5;

export interface ReviewSummary {
  average: number; // 0 when there are no reviews yet
  count: number;
  visible: boolean; // true once count >= PUBLIC_REVIEW_THRESHOLD
}

export async function getReviews(): Promise<ProductReview[]> {
  return readJsonFile<ProductReview[]>(REVIEWS_FILE, []);
}

export async function getReviewsForProduct(productId: string): Promise<ProductReview[]> {
  const reviews = await getReviews();
  return reviews.filter((r) => r.productId === productId);
}

export async function getReviewSummary(productId: string): Promise<ReviewSummary> {
  const reviews = await getReviewsForProduct(productId);
  const count = reviews.length;
  const average = count > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / count : 0;
  return { average, count, visible: count >= PUBLIC_REVIEW_THRESHOLD };
}

/** Returns every product's review summary at once, keyed by productId — used on the admin dashboard. */
export async function getAllReviewSummaries(): Promise<Record<string, ReviewSummary>> {
  const reviews = await getReviews();
  const byProduct = new Map<string, ProductReview[]>();
  for (const r of reviews) {
    const list = byProduct.get(r.productId) ?? [];
    list.push(r);
    byProduct.set(r.productId, list);
  }
  const summaries: Record<string, ReviewSummary> = {};
  for (const [productId, list] of byProduct) {
    const count = list.length;
    const average = list.reduce((sum, r) => sum + r.rating, 0) / count;
    summaries[productId] = { average, count, visible: count >= PUBLIC_REVIEW_THRESHOLD };
  }
  return summaries;
}

export async function hasReviewed(orderId: string, productId: string): Promise<boolean> {
  const reviews = await getReviews();
  return reviews.some((r) => r.orderId === orderId && r.productId === productId);
}

/** Idempotent on (orderId, productId) — a customer can't review the same product twice for the same order. */
export async function addReview(review: ProductReview): Promise<void> {
  const reviews = await getReviews();
  if (reviews.some((r) => r.orderId === review.orderId && r.productId === review.productId)) return;
  reviews.unshift(review);
  await writeJsonFile(REVIEWS_FILE, reviews);
}

export async function deleteReview(id: string): Promise<void> {
  const reviews = await getReviews();
  await writeJsonFile(REVIEWS_FILE, reviews.filter((r) => r.id !== id));
}
