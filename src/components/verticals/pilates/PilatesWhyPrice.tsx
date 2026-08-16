"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";

import { Reveal } from "@/components/effects/Reveal";
import { formatVerticalMoney } from "@/lib/verticals/format-price";
import { PILATES_VERTICAL } from "@/data/verticals/pilates";

const studio = PILATES_VERTICAL.pricing.packages[0]!;
const monthly = formatVerticalMoney(studio.monthly);
const sigFrom = formatVerticalMoney({
  ...PILATES_VERTICAL.pricing.signatureCustom.fromPrice,
  prefix: undefined,
});

const EASE = [0.22, 1, 0.36, 1] as const;

const SEGMENTS = [
  {
    id: "foundation",
    label: "Foundation",
    weight: "lg:flex-[1.15]",
    tone: "bg-slate-900 text-white",
    dot: "bg-orange-300",
    detail:
      "De Pilates-fundering, UX en design systems staan al. Die uren zijn ooit gemaakt en betaal jij niet opnieuw.",
  },
  {
    id: "branding",
    label: "Jouw branding",
    weight: "lg:flex-[1]",
    tone: "bg-[#FF5722] text-white",
    dot: "bg-white",
    detail:
      "Logo, kleuren, fotografie, lessen, trainers en tarieven. Hier gaat mijn tijd heen, want dit maakt het jouw studio.",
  },
  {
    id: "seo",
    label: "Lokale SEO",
    weight: "lg:flex-[0.85]",
    tone: "bg-slate-200 text-slate-900",
    dot: "bg-[#FF5722]",
    detail:
      "Structuur, schema, snelheid en de injectie op Pilates [jouw stad], zodat zoekverkeer je überhaupt vindt.",
  },
  {
    id: "care",
    label: "Hosting & zorg",
    weight: "lg:flex-[0.7]",
    tone: "bg-white text-slate-900 ring-1 ring-slate-200",
    dot: "bg-slate-400",
    detail:
      "Hosting, beveiliging, updates en kleine wijzigingen. Jij mailt mij, ik regel het. Elke maand opnieuw.",
  },
] as const;

export function PilatesWhyPrice() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const segment = SEGMENTS[active]!;

  return (
    <section
      className="relative overflow-hidden border-b border-slate-200 bg-slate-50"
      aria-labelledby="pilates-why-price-heading"
    >
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        {/* Editorial statement */}
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-7">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF5722]">
              Eerlijk over de prijs
            </p>
            <h2
              id="pilates-why-price-heading"
              className="mt-4 text-[2.6rem] font-extrabold leading-[0.95] tracking-tight text-slate-900 sm:text-[3.6rem] lg:text-[4.6rem]"
            >
              {monthly}
              <span className="block text-slate-400">per maand.</span>
              <span className="mt-2 block text-[1.6rem] leading-tight text-[#FF5722] sm:text-[2rem] lg:text-[2.3rem]">
                Hoe kan dat, zo premium?
              </span>
            </h2>
          </Reveal>

          <Reveal delay={0.08} className="lg:col-span-5 lg:pt-24">
            <p className="text-base leading-relaxed text-slate-600 sm:text-lg">
              Omdat ik niet iedere keer op een blanco canvas begin. De
              Pilates-fundering staat, dus de uren gaan naar jouw studio in
              plaats van naar het opnieuw uitvinden van een menu.
            </p>
            <p className="mt-4 text-sm font-semibold text-slate-900">
              Slim hergebruik van een specialistische foundation. Premium
              resultaat, eerlijke instap.
            </p>
          </Reveal>
        </div>

        {/* Interactive allocation bar */}
        <Reveal delay={0.12}>
          <div className="mt-12 lg:mt-16">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Waar de uren heen gaan
            </p>

            <div
              className="mt-3 flex flex-col gap-2 lg:flex-row lg:gap-2.5"
              role="tablist"
              aria-label="Kostenverdeling"
            >
              {SEGMENTS.map((item, i) => {
                const selected = active === i;
                return (
                  <motion.button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setActive(i)}
                    onMouseEnter={() => {
                      if (!reduce) setActive(i);
                    }}
                    className={`${item.tone} ${item.weight} group relative overflow-hidden rounded-2xl px-4 py-4 text-left transition sm:px-5`}
                    initial={false}
                    animate={
                      reduce
                        ? undefined
                        : { y: selected ? -4 : 0, opacity: selected ? 1 : 0.82 }
                    }
                    transition={{ duration: 0.25, ease: EASE }}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={`size-1.5 rounded-full ${item.dot}`}
                        aria-hidden
                      />
                      <span className="text-sm font-extrabold tracking-tight">
                        {item.label}
                      </span>
                    </span>
                    <span
                      className={
                        selected
                          ? "mt-3 block h-0.5 w-full rounded-full bg-current opacity-70"
                          : "mt-3 block h-0.5 w-8 rounded-full bg-current opacity-30"
                      }
                      aria-hidden
                    />
                  </motion.button>
                );
              })}
            </div>

            <div className="mt-4 min-h-[5.5rem] rounded-2xl border border-slate-200 bg-white px-5 py-4 sm:px-6 sm:py-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={segment.id}
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.2, ease: EASE }}
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#FF5722]">
                    {segment.label}
                  </p>
                  <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-700 sm:text-base">
                    {segment.detail}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>

        {/* Slim Signature Custom strip */}
        <Reveal delay={0.16}>
          <a
            href="#signature-custom"
            className="group mt-5 flex flex-col gap-3 rounded-2xl bg-slate-900 px-5 py-4 text-white transition hover:bg-slate-800 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5"
          >
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-orange-300">
                Liever alles vanaf nul
              </p>
              <p className="mt-1.5 text-sm font-semibold text-slate-200 sm:text-base">
                Signature Custom bouwt from scratch. Eigen art direction, UX en
                architectuur. Vanaf {sigFrom} eenmalig.
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#FF5722] px-4 py-2 text-sm font-bold">
              Bekijk Signature
              <ArrowUpRight
                className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden
              />
            </span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
