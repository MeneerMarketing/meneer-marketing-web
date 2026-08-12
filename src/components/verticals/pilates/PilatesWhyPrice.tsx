"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
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

type Track = "foundation" | "custom";

const TRACKS: Record<
  Track,
  {
    label: string;
    eyebrow: string;
    title: string;
    body: string;
    bullets: string[];
    priceLine: string;
  }
> = {
  foundation: {
    label: "Studio Edition",
    eyebrow: "Pilates foundation",
    title: "High-end basis. Jouw studio erin.",
    body: "Logo, kleuren, foto's, lessen, stad, booking. Alles personaliseer ik. De technische basis hoeft niet opnieuw uitgevonden.",
    bullets: [
      "Gespecialiseerde Pilates art direction",
      "Aangepast tot het van jou voelt",
      "SEO-basis + hosting + onderhoud",
      "Sneller live, scherper geprijsd",
    ],
    priceLine: `${monthly}/m · slimme foundation`,
  },
  custom: {
    label: "Signature Custom",
    eyebrow: "From scratch",
    title: "Alles op maat, vanaf nul.",
    body: "Eigen art direction, UX en architectuur. Als Hills Pilates: uniek, geen foundation-pad.",
    bullets: [
      "Volledig unieke art direction",
      "Custom UX en componentarchitectuur",
      "Bijzondere koppelingen en funnels",
      "Past bij multi-location of complexe studio's",
    ],
    priceLine: `Vanaf ${sigFrom} · eenmalig`,
  },
};

export function PilatesWhyPrice() {
  const reduce = useReducedMotion();
  const [track, setTrack] = useState<Track>("foundation");
  const current = TRACKS[track];

  return (
    <section
      className="relative overflow-hidden border-b border-slate-200 bg-white"
      aria-labelledby="pilates-why-price-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-35"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,87,34,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,87,34,0.04) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch lg:gap-10">
          <Reveal className="h-full">
            <div className="flex h-full flex-col rounded-3xl border border-slate-200/90 bg-slate-50 p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF5722]">
                Eerlijk over de prijs
              </p>
              <h2
                id="pilates-why-price-heading"
                className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.6rem] lg:leading-[1.08]"
              >
                {monthly} per maand.
                <span className="mt-1 block text-slate-500">
                  Hoe dan, als het er zo premium uitziet?
                </span>
              </h2>
              <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">
                Omdat de Pilates-fundering, UX en design systems al staan. Ik
                begin niet iedere keer vanaf een blanco canvas. De uren gaan naar
                jouw branding, lessen, lokale SEO, booking en afwerking.
              </p>
              <p className="mt-4 text-sm font-semibold text-slate-900">
                Slim hergebruik van een specialistische foundation. Premium
                resultaat, eerlijke instap.
              </p>

              <div className="mt-auto pt-8">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Kies je pad
                </p>
                <div
                  className="mt-2.5 flex flex-wrap gap-2"
                  role="tablist"
                  aria-label="Prijsroutes"
                >
                  {(Object.keys(TRACKS) as Track[]).map((key) => {
                    const selected = track === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        onClick={() => setTrack(key)}
                        className={
                          selected
                            ? "rounded-full bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-md"
                            : "rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:border-slate-300"
                        }
                      >
                        {TRACKS[key].label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08} className="h-full">
            <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_50px_-28px_rgba(15,23,42,0.2)]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={track}
                  initial={reduce ? false : { opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduce ? undefined : { opacity: 0, x: -10 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="flex h-full flex-col"
                >
                  <div
                    className={
                      track === "foundation"
                        ? "bg-slate-900 p-6 text-white sm:p-8"
                        : "bg-gradient-to-br from-[#FF5722] to-[#e64a19] p-6 text-white sm:p-8"
                    }
                  >
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-200">
                      {current.eyebrow}
                    </p>
                    <h3 className="mt-2 text-xl font-extrabold tracking-tight sm:text-2xl">
                      {current.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/80">
                      {current.body}
                    </p>
                    <p className="mt-5 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
                      {current.priceLine}
                    </p>
                  </div>

                  <ul className="flex flex-1 flex-col gap-3 p-6 sm:p-8">
                    {current.bullets.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-3.5 py-3 text-sm font-semibold text-slate-800"
                      >
                        <span
                          className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#FF5722]"
                          aria-hidden
                        />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="border-t border-slate-100 px-6 py-4 sm:px-8">
                    {track === "foundation" ? (
                      <p className="text-sm text-slate-500">
                        Liever alles vanaf nul?{" "}
                        <button
                          type="button"
                          onClick={() => setTrack("custom")}
                          className="font-bold text-slate-900 underline decoration-[#FF5722]/40 underline-offset-2 hover:text-[#FF5722]"
                        >
                          Bekijk Signature Custom
                        </button>
                      </p>
                    ) : (
                      <p className="text-sm text-slate-500">
                        Of spring naar{" "}
                        <a
                          href="#signature-custom"
                          className="font-bold text-slate-900 underline decoration-[#FF5722]/40 underline-offset-2 hover:text-[#FF5722]"
                        >
                          Signature Custom
                        </a>{" "}
                        en vraag het aan.
                      </p>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
