"use client";

import { Ruler, Wallet, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { messages } from "@/lib/i18n/messages";

export default function StorySection({ imageUrl }: { imageUrl?: string }) {
  const locale = useLocale();
  const t = messages[locale].story;

  const pillars = [
    { icon: Ruler, title: t.pillar1Title, body: t.pillar1Body },
    { icon: Wallet, title: t.pillar2Title, body: t.pillar2Body },
    { icon: ShieldCheck, title: t.pillar3Title, body: t.pillar3Body },
  ];

  return (
    <section id="story" aria-labelledby="story-heading" className="w-full bg-cream py-16 lg:py-24">
      <div className="container-gemo grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden rounded-[1.75rem] bg-sand"
        >
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt="Tidy, sunlit small-apartment corner styled with space-saving GEMO furniture"
              className="h-[320px] w-full object-cover lg:h-[420px]"
            />
          ) : (
            <div className="grid h-[320px] grid-cols-2 gap-4 p-4 lg:h-[420px]">
              <div className="col-span-2 rounded-2xl bg-brand-300/70" />
              <div className="rounded-2xl bg-brand-500/80" />
              <div className="rounded-2xl bg-brand-600/70" />
            </div>
          )}
        </motion.div>

        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-500">
            {t.eyebrow}
          </span>
          <h2
            id="story-heading"
            className="mt-3 text-balance font-display text-[2rem] leading-tight tracking-[-0.015em] text-ink sm:text-[2.6rem]"
            style={{ fontWeight: 400 }}
          >
            {t.heading}
          </h2>
          <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-ink-soft">{t.body}</p>

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
