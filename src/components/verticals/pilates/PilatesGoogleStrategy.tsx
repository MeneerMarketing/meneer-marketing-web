"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

import { Reveal } from "@/components/effects/Reveal";

const EASE = [0.22, 1, 0.36, 1] as const;

const LAYERS = [
  {
    id: "studio",
    packageName: "Studio Edition",
    priceHint: "€89/m",
    title: "Pilates [jouw stad]",
    body: "De kernzoekterm. SEO-injectie zit er al in. Website live binnen 5 werkdagen.",
    pages: ["Homepage", "Pilates [stad]"],
    goal: "Pagina 1 · mikken op top",
  },
  {
    id: "growth",
    packageName: "Local Growth",
    priceHint: "€179/m",
    title: "Meer zoektermen. Meer pagina's.",
    body: "Reformer, Mat, Private, prijzen, locatie. Maandelijks bijsturen tot Google meewerkt.",
    pages: ["Reformer", "Mat", "Private", "Prijzen", "Locatie"],
    goal: "Pagina 1 breed · topkansen",
  },
  {
    id: "partner",
    packageName: "Growth Partner",
    priceHint: "€399/m",
    title: "SEO + Google Ads erbij",
    body: "Alles van Local Growth, plus Ads en extra campagne-landingspagina's. Jij runt de studio.",
    pages: ["SEO-pagina's", "Ads-landings", "Funnel"],
    goal: "Organisch + betaald",
  },
] as const;

export function PilatesGoogleStrategy() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const layer = LAYERS[active]!;

  return (
    <section
      id="google-strategie"
      className="relative overflow-hidden border-b border-slate-200 bg-slate-900 text-white"
      aria-labelledby="pilates-google-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,87,34,0.55) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,87,34,0.55) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 50% 45% at 0% 0%, rgba(255,87,34,0.28), transparent 55%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch lg:gap-10">
          <Reveal className="h-full">
            <div className="flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-300">
                  Google-strategie
                </p>
                <h2
                  id="pilates-google-heading"
                  className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-[2.55rem] lg:leading-[1.08]"
                >
                  Ik weet hoe Google werkt.
                  <span className="mt-1 block text-[#FF5722]">
                    Daarom mikken we op pagina 1.
                  </span>
                </h2>
                <p className="mt-5 text-base leading-relaxed text-slate-300 sm:text-lg">
                  Intentie, structuur, snelheid, content, Maps. Geen trucjes,
                  wel een strategie die Google beloont. Voor{" "}
                  <span className="font-semibold text-white">
                    Pilates [jouw stad]
                  </span>{" "}
                  injecteer ik SEO al bij Studio Edition. Hogere pakketten
                  verbreden dat naar meer zoektermen en landingspagina&apos;s.
                </p>
              </div>

              <ul className="mt-8 space-y-3 border-t border-white/10 pt-6 text-sm text-slate-300">
                {[
                  "Doel: pagina 1 voor de kernzoekterm",
                  "Serieuze kans op topposities, inclusief #1",
                  "Studio Edition: 5 werkdagen + SEO op Pilates [stad]",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span
                      className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#FF5722]"
                      aria-hidden
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.08} className="h-full">
            <div className="flex h-full flex-col rounded-3xl border border-white/10 bg-white p-5 text-slate-900 shadow-[0_28px_70px_rgba(0,0,0,0.35)] sm:p-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                Tik een trede. Zie wat je erbij krijgt.
              </p>

              <div
                className="mt-3 flex flex-wrap gap-2"
                role="tablist"
                aria-label="SEO per pakket"
              >
                {LAYERS.map((item, i) => {
                  const selected = active === i;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => setActive(i)}
                      onMouseEnter={() => {
                        if (!reduce) setActive(i);
                      }}
                      className={
                        selected
                          ? "rounded-full bg-slate-900 px-3.5 py-2 text-xs font-bold text-white"
                          : "rounded-full border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-600 hover:border-slate-300"
                      }
                    >
                      {item.packageName}
                    </button>
                  );
                })}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={layer.id}
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, ease: EASE }}
                  className="mt-5 flex flex-1 flex-col"
                >
                  <div className="rounded-2xl bg-slate-900 p-5 text-white">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-orange-300">
                        {layer.packageName}
                      </p>
                      <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-bold text-slate-200">
                        {layer.priceHint}
                      </span>
                    </div>
                    <h3 className="mt-2 text-xl font-extrabold tracking-tight">
                      {layer.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-300">
                      {layer.body}
                    </p>
                    <p className="mt-4 inline-flex rounded-full bg-[#FF5722] px-3 py-1 text-[11px] font-bold text-white">
                      {layer.goal}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {layer.pages.map((page) => (
                      <span
                        key={page}
                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700"
                      >
                        {page}
                      </span>
                    ))}
                  </div>

                  <p className="mt-auto pt-5 text-xs leading-relaxed text-slate-500">
                    Studio Edition legt de basis op{" "}
                    <span className="font-semibold text-slate-800">
                      Pilates [stad]
                    </span>
                    . Local Growth en Growth Partner bouwen de rest van je
                    lokale zoekdekking erbij.
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
