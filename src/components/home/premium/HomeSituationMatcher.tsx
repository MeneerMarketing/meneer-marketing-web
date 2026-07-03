"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Hammer, Heart, Megaphone, Rocket, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { PillarSlug } from "@/lib/navigation";

interface Situation {
  id: string;
  icon: typeof Rocket;
  label: string;
  title: string;
  pillar: PillarSlug;
  pillarHref: string;
  pillarLabel: string;
  steps: string[];
  outcome: string;
}

const SITUATIONS: Situation[] = [
  {
    id: "start",
    icon: Rocket,
    label: "Net begonnen",
    title: "Ik weet niet waar ik moet beginnen",
    pillar: "strategie",
    pillarHref: "/strategie",
    pillarLabel: "Strategie & groei",
    steps: ["Groeiplan", "Prioriteit", "Eerste quick wins"],
    outcome: "Eerst weten waar je groei zit. Dan pas bouwen of adverteren.",
  },
  {
    id: "site",
    icon: Hammer,
    label: "Site of shop",
    title: "Mijn website houdt me tegen",
    pillar: "bouwen",
    pillarHref: "/bouwen",
    pillarLabel: "Bouwen from scratch",
    steps: ["Custom build", "Snelheid", "Conversie"],
    outcome: "From scratch, geen templates. Klaar voor marketing en groei.",
  },
  {
    id: "find",
    icon: Search,
    label: "Niet gevonden",
    title: "Klanten vinden me niet",
    pillar: "vindbaarheid",
    pillarHref: "/vindbaarheid",
    pillarLabel: "Vindbaarheid & content",
    steps: ["SEO", "Content", "AI-zoek"],
    outcome: "Bovenaan in Google én zichtbaar in ChatGPT, Gemini en Claude.",
  },
  {
    id: "ads",
    icon: Megaphone,
    label: "Ads zonder winst",
    title: "Ik adverteer maar het levert te weinig op",
    pillar: "campagnes",
    pillarHref: "/campagnes",
    pillarLabel: "Acquisitie & creators",
    steps: ["Google Ads", "Meta Ads", "Creators"],
    outcome: "Klein testen, meten en opschalen wat echt terugverdient.",
  },
  {
    id: "retain",
    icon: Heart,
    label: "Geen herhaal",
    title: "Klanten komen niet terug",
    pillar: "behoud",
    pillarHref: "/behoud",
    pillarLabel: "Behoud & koppelingen",
    steps: ["E-mailflows", "Retentie", "Automatisering"],
    outcome: "Klanten die terugkomen kosten vijf keer minder dan nieuwe werven.",
  },
];

export function HomeSituationMatcher() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState("start");
  const situation = SITUATIONS.find((s) => s.id === active) ?? SITUATIONS[0];
  const Icon = situation.icon;

  return (
    <section
      className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-50/80"
      aria-labelledby="home-situation-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <p className="inline-flex items-center gap-2 rounded-full border border-[#FF5722]/25 bg-[#FF5722]/5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-[#FF5722]">
          Waar zit jij nu?
        </p>
        <h2
          id="home-situation-heading"
          className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
        >
          Herken je dit? Zie je meteen de route.
        </h2>
        <p className="mt-2 max-w-xl text-slate-600">
          Tik op je situatie. Je ziet welk hoofdblok het meest logisch is en
          waar we mee beginnen.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {SITUATIONS.map((s) => {
            const SIcon = s.icon;
            const isActive = active === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setActive(s.id)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-bold transition-all ${
                  isActive
                    ? "border-[#FF5722] bg-[#FF5722] text-white shadow-lg shadow-[#FF5722]/25"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                <SIcon className="size-4" strokeWidth={1.8} />
                {s.label}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="mt-8 grid gap-6 lg:grid-cols-2 lg:items-stretch"
          >
            <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-start gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#FF5722]/10 text-[#FF5722]">
                  <Icon className="size-6" strokeWidth={1.8} />
                </span>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">{situation.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{situation.outcome}</p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {situation.steps.map((step, i) => (
                  <span
                    key={step}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700"
                  >
                    {step}
                  </span>
                ))}
              </div>
              <Link
                href={situation.pillarHref}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-[#FF5722]"
              >
                Naar {situation.pillarLabel}
                <ArrowUpRight className="size-4" />
              </Link>
            </div>

            <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 shadow-[0_24px_48px_-24px_rgba(0,0,0,0.5)]">
              <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
                <span className="size-2 rounded-full bg-[#FF5722]/80" />
                <span className="font-mono text-[10px] text-slate-500">route-preview</span>
              </div>
              <div className="flex flex-1 flex-col justify-center p-6 sm:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#FF5722]">
                  Start hier
                </p>
                <p className="mt-2 text-2xl font-extrabold text-white">{situation.pillarLabel}</p>
                <div className="mt-6 space-y-3">
                  {situation.steps.map((step) => (
                    <div key={step} className="flex items-center gap-3">
                      <span className="size-2 shrink-0 rounded-full bg-[#FF5722]" aria-hidden />
                      <span className="text-sm font-medium text-slate-300">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
