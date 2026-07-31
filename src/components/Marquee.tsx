/**
 * Scrolling strip of store benefits under the hero. Items are passed in by
 * the caller (see src/app/page.tsx) rather than hardcoded here, so this
 * never ships a marketing claim GEMO hasn't actually confirmed — e.g. the
 * "free shipping" item only appears when the /admin/settings toggle for it
 * is actually on.
 */
export default function Marquee({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  const looped = [...items, ...items];

  return (
    <section aria-label="Store benefits" className="w-full overflow-hidden border-y border-line bg-sand/70 py-3.5">
      <div className="flex w-max animate-marquee">
        {looped.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex items-center whitespace-nowrap px-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-soft"
          >
            <span className="mr-6 inline-block h-1 w-1 rounded-full bg-brand-500" aria-hidden="true" />
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
