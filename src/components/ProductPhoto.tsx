import ProductImage from "./ProductImage";
import type { Product } from "@/lib/types";

/**
 * Renders a product's real uploaded photo when available, falling back to
 * the icon placeholder otherwise. Using a plain <img> (not next/image) here
 * keeps this working with any image host (Vercel Blob, etc.) with zero
 * config — swap for next/image + remotePatterns later if you want
 * automatic resizing/optimization.
 */
export default function ProductPhoto({
  product,
  className = "",
  iconClassName = "h-16 w-16",
}: {
  product: Pick<Product, "images" | "icon" | "colorway" | "name">;
  className?: string;
  iconClassName?: string;
}) {
  const photo = product.images?.[0];

  if (photo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photo}
        alt={product.name}
        className={`rounded-xl object-cover ${className}`}
      />
    );
  }

  return (
    <ProductImage
      icon={product.icon}
      colorway={product.colorway}
      className={className}
      iconClassName={iconClassName}
    />
  );
}
