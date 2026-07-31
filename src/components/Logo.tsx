/**
 * Placeholder recreation of the GEMO Furniture mark (terracotta roundel +
 * wordmark). Swap the <svg> below for the real logo file (SVG preferred)
 * once it's added to /public — see README.
 */
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-500">
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-cream"
          aria-hidden="true"
        >
          <path d="M4 11V8.5A1.5 1.5 0 0 1 5.5 7h13A1.5 1.5 0 0 1 20 8.5V11" />
          <path d="M3 11h18v5H3z" />
          <path d="M5 16v2M19 16v2" />
        </svg>
      </span>
      <span
        className="font-display text-xl tracking-tight text-ink"
        style={{ fontWeight: 500, letterSpacing: "0.02em" }}
      >
        GEMO
      </span>
    </span>
  );
}
