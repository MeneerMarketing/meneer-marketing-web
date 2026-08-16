"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

import { Reveal } from "@/components/effects/Reveal";

const STEPS = [
  {
    id: "studio",
    packageName: "Clinic Edition",
    priceHint: "€89/m",
    title: "Huidkliniek [jouw stad]",
    body: "De kernzoekterm waar het geld zit. SEO-injectie zit erin, website live binnen vijf werkdagen.",
    bullets: [] as string[],
    pages: ["Homepage", "Huidkliniek [stad]"],
    height: "lg:h-[260px]",
  },
  {
    id: "growth",
    packageName: "Local Growth",
    priceHint: "€179/m",
    title: "Meer zoektermen, meer pagina's",
    body: "Behandelingen, huidverbetering, intake, prijzen en locatie krijgen een eigen pagina. Elke maand bijsturen.",
    bullets: [] as string[],
    pages: ["Behandelingen", "Huidverbetering", "Intake", "Prijzen", "Locatie"],
    height: "lg:h-[340px]",
  },
  {
    id: "partner",
    packageName: "Growth Partner",
    priceHint: "€399/m",
    title: "SEO, Ads én influencers. Hard groeien.",
    body: "Alles van Local Growth, plus de kanalen die écht volume brengen. Organisch blijft lopen, betaald en creators zetten er vaart achter.",
    bullets: [
      "Google Ads-beheer op behandelingen en intakes",
      "Meta Ads waar bereik en retargeting tellen",
      "Campagne-landingspagina's die direct laten boeken",
      "Influencer-matches en collabs die bij jouw kliniek passen",
      "Boosts via creators: content die echt klikt en boekt",
      "Funnel-analyse, CRO en maandelijkse groeianalyse",
    ],
    pages: [
      "Google Ads",
      "Meta Ads",
      "Influencers",
      "Landings",
      "Retargeting",
      "CRO",
    ],
    height: "lg:h-[520px]",
  },
] as const;

export function HuidkliniekGoogleStrategy() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(2);

  return (
    <section
      id="google-strategie"
      className="relative overflow-hidden border-b border-slate-800 bg-slate-900 text-white"
      aria-labelledby="Huidkliniek-google-heading"
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 90% 0%, rgba(255,255,255,0.06), transparent 55%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <Reveal>
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-300">
              Google-strategie
            </p>
            <h2
              id="Huidkliniek-google-heading"
              className="mt-3 text-3xl font-extrabold tracking-tight text-balance sm:text-4xl lg:text-[2.85rem] lg:leading-[1.06]"
            >
              Ik weet hoe Google werkt.
              <span className="text-[#FF5722]"> Daarom mikken we op pagina 1.</span>
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Intentie, structuur, snelheid, content en Maps. Bij Clinic Edition
              injecteer ik SEO op{" "}
              <span className="font-semibold text-white">huidkliniek [jouw stad]</span>
              . Hoe hoger je instapt, hoe breder je zoekdekking wordt.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative mt-14 lg:mt-16 lg:pl-12">
            <p className="pointer-events-none absolute bottom-16 left-0 z-20 hidden origin-bottom-left -rotate-90 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 lg:block">
              Zichtbaarheid
            </p>

            <ol className="relative z-10 grid gap-3 lg:grid-cols-3 lg:items-end lg:gap-4">
              {STEPS.map((step, index) => {
                const selected = active === index;
                return (
                  <li key={step.id}>
                    <motion.button
                      type="button"
                      onClick={() => setActive(index)}
                      onMouseEnter={() => {
                        if (!reduce) setActive(index);
                      }}
                      aria-pressed={selected}
                      className={
                        selected
                          ? `${step.height} relative flex w-full flex-col justify-end overflow-hidden rounded-t-3xl border border-b-0 border-white/20 bg-white/[0.1] p-5 text-left shadow-[0_20px_50px_-28px_rgba(0,0,0,0.55)] transition sm:p-6`
                          : `${step.height} relative flex w-full flex-col justify-end overflow-hidden rounded-t-3xl border border-b-0 border-white/10 bg-white/[0.03] p-5 text-left transition hover:bg-white/[0.06] sm:p-6`
                      }
                      initial={false}
                      animate={reduce ? undefined : { y: selected ? -6 : 0 }}
                      transition={{ type: "spring", stiffness: 260, damping: 22 }}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span
                          className={
                            selected
                              ? "rounded-full bg-[#FF5722] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white"
                              : "rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-300"
                          }
                        >
                          {step.packageName}
                        </span>
                        <span className="text-xs font-bold text-slate-400">
                          {step.priceHint}
                        </span>
                      </div>

                      <h3 className="mt-4 text-lg font-extrabold tracking-tight sm:text-xl">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-300">
                        {step.body}
                      </p>

                      {step.bullets.length > 0 ? (
                        <ul className="mt-3 space-y-1.5">
                          {step.bullets.map((item) => (
                            <li
                              key={item}
                              className="flex gap-2 text-left text-[12px] leading-snug text-slate-200"
                            >
                              <span
                                className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#FF5722]"
                                aria-hidden
                              />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {step.pages.map((page) => (
                          <span
                            key={page}
                            className={
                              selected
                                ? "rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold text-white"
                                : "rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-bold text-slate-400"
                            }
                          >
                            {page}
                          </span>
                        ))}
                      </div>
                    </motion.button>
                  </li>
                );
              })}
            </ol>

            <div className="h-px w-full bg-white/15" />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                Instap
              </p>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                Complete groei
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.16}>
          <div className="mt-10 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
            <p className="max-w-2xl text-sm leading-relaxed text-slate-300">
              <span className="font-extrabold text-white">Eerlijk blijft eerlijk:</span>{" "}
              een gekochte garantie op positie 1 bestaat niet. Wel een aanpak die
              Google beloont, met serieuze kans op topposities voor je
              kernzoekterm.
            </p>
            <a
              href="#pakketten"
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-bold text-slate-900 transition hover:bg-[#FF5722] hover:text-white"
            >
              Bekijk de pakketten
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
