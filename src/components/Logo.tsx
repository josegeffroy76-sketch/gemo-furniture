import { Sofa } from "lucide-react";

/**
 * Placeholder recreation of the GEMO Furniture mark (terracotta roundel +
 * wordmark) built from the reference logo image. Swap the <svg> below for the
 * real logo file (SVG preferred) once it's added to /public — see README.
 */
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-500">
        <Sofa className="h-[18px] w-[18px] text-cream" strokeWidth={2.25} />
      </span>
      <span className="font-display text-xl font-semibold tracking-wide text-ink">GEMO</span>
    </span>
  );
}
