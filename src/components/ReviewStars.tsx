import { Star } from "lucide-react";

/** Read-only star display — rounds to the nearest whole star for simplicity. */
export default function ReviewStars({
  rating,
  size = 16,
}: {
  rating: number;
  size?: number;
}) {
  const rounded = Math.round(rating);
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          width={size}
          height={size}
          className={n <= rounded ? "fill-brand-500 text-brand-500" : "fill-none text-line"}
        />
      ))}
    </span>
  );
}
