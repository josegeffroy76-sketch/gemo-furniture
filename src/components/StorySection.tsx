"use client";

import { Ruler, Wallet, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const pillars = [
  {
    icon: Ruler,
    title: "Designed for small spaces",
    body: "Every piece is chosen and sized for real apartments, dorms, and first homes — not showrooms.",
  },
  {
    icon: Wallet,
    title: "Priced without the retail markup",
    body: "We keep our catalog tight and pass the savings on, so quality furniture doesn't come with a retail price tag.",
  },
  {
    icon: ShieldCheck,
    title: "Quality checked before it ships",
    body: "Every order is checked before it leaves the warehouse, and backed by 30-day returns if something isn't right.",
  },
];

export default function StorySection() {
  return (
    <section id="story" aria-labelledby="story-heading" className="w-full bg-cream py-16 lg:py-24">
      <div className="container-gemo grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-2 gap-4 overflow-hidden rounded-[1.75rem] bg-sand p-4 lg:h-[420px]"
        >
          <div className="col-span-2 rounded-2xl bg-brand-300/70" />
          <div className="rounded-2xl bg-brand-500/80" />
          <div className="rounded-2xl bg-brand-600/70" />
        </motion.div>

        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-500">
            Our story
          </span>
          <h2
            id="story-heading"
            className="mt-3 text-balance font-display text-[2rem] leading-tight tracking-[-0.015em] text-ink sm:text-[2.6rem]"
            style={{ fontWeight: 400 }}
          >
            Good furniture shouldn&apos;t be a luxury
          </h2>
          <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-ink-soft">
            GEMO started with a simple frustration: furniture that fits a small budget
            usually looks and feels like it. We keep our catalog tight and focused on
            what actually fits small spaces, so you don&apos;t have to compromise.
          </p>

          <ul className="mt-10 space-y-7">
            {pillars.map((pillar, index) => (
              <motion.li
                key={pillar.title}
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: index * 0.09, ease: [0.22, 1, 0.36, 1] }}
                className="flex gap-4"
              >
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-sand/60 text-brand-500">
                  <pillar.icon size={18} strokeWidth={1.7} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-display text-lg text-ink" style={{ fontWeight: 400 }}>
                    {pillar.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">{pillar.body}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
