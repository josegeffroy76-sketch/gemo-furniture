import { Sofa, Armchair, BedDouble, BedSingle, Table2, Lamp, Package, Box } from "lucide-react";
import type { ProductIcon } from "@/lib/types";

const ICONS: Record<ProductIcon, typeof Sofa> = {
  sofa: Sofa,
  armchair: Armchair,
  "bed-double": BedDouble,
  "bed-single": BedSingle,
  "table-2": Table2,
  lamp: Lamp,
  package: Package,
  box: Box,
};

/**
 * Placeholder product art: a soft brand-tinted panel with a category icon.
 * Swap for real product photography by rendering <Image src={product.images[0]} />
 * once the real catalog assets are provided — see README "Adding real products".
 */
export default function ProductImage({
  icon,
  colorway,
  className = "",
  iconClassName = "h-16 w-16",
}: {
  icon: ProductIcon;
  colorway: string;
  className?: string;
  iconClassName?: string;
}) {
  const Icon = ICONS[icon];
  return (
    <div
      className={`flex items-center justify-center overflow-hidden rounded-xl ${className}`}
      style={{
        background: `linear-gradient(155deg, ${colorway}1a 0%, ${colorway}33 100%)`,
      }}
    >
      <Icon className={iconClassName} style={{ color: colorway }} strokeWidth={1.4} />
    </div>
  );
}
