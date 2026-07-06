"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import { CASES_PAGE_WERKWIJZE } from "@/data/cases-page";
import { WERKWIJZE_PHASES } from "@/data/werkwijze-index";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Interactieve werkwijze-teaser met link naar /werkwijze. */
export function CasesWerkwijzeTeaser() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const phase = WERKWIJZE_PHASES[active]!;
  const quip = CASES_PAGE_WERKWIJZE.quips[phase.id as keyof typeof CASES_PAGE_WERKWIJZE.quips];

  return (
    <section
      className="relative overflow-hidden border-b border-orange-600/30 bg-[#FF5722]"
      aria-labelledby="cases-werkwijze-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:36px_36px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 top-0 size-56 rounded-full bg-white/10 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">
          {CASES_PAGE_WERKWIJZE.eyebrow}
        </p>
        <h2
          id="cases-werkwijze-heading"
          className="mt-3 max-w-2xl text-pretty text-2xl font-extrabold tracking-tight text-white sm:text-3xl"
        >
          {CASES_PAGE_WERKWIJZE.title}
        </h2>
        <p className="mt-3 max-w-xl text-pretty text-white/85 sm:text-base">
          {CASES_PAGE_WERKWIJZE.lead}
        </p>

        <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Werkwijze fases">
          {WERKWIJZE_PHASES.map((p, i) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={active === i}
              onClick={() => setActive(i)}
              className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
                active === i
                  ? "border-white bg-white text-slate-900 shadow-lg"
                  : "border-white/30 bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {p.tag}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.article
            key={phase.id}
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: 0.32, ease: EASE }}
            className="mt-8 overflow-hidden rounded-2xl bg-white shadow-xl shadow-black/15"
          >
            <div className="grid lg:grid-cols-[1fr_280px] lg:items-stretch">
              <div className="p-6 sm:p-8">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  {phase.title}
                </p>
                <h3 className="mt-2 text-xl font-extrabold text-slate-900 sm:text-2xl">
                  {phase.headline}
                </h3>
                <p className="mt-3 text-pretty text-sm leading-relaxed text-slate-600 sm:text-base">
                  {phase.body}
                </p>
                <p className="mt-4 text-pretty text-sm font-extrabold text-[#FF5722]">
                  {phase.punchline}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {phase.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold text-slate-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col justify-between border-t border-slate-100 bg-slate-50 p-6 lg:border-l lg:border-t-0">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    {phase.metric.label}
                  </p>
                  <p className="mt-1 text-3xl font-black tracking-tight text-slate-900">
                    {phase.metric.value}
                  </p>
                </div>
                <div className="mt-6 flex items-start gap-3 rounded-xl border border-[#FF5722]/15 bg-orange-50/80 p-3">
                  <InteractiveLogo className="size-8 shrink-0" interactive={false} />
                  <p className="text-pretty text-xs font-bold leading-snug text-slate-800 sm:text-sm">
                    {quip}
                  </p>
                </div>
              </div>
            </div>
          </motion.article>
        </AnimatePresence>

        <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-md text-pretty text-sm font-bold text-white/90">
            Wil je het hele traject zien? Intake, routekaart, bouwen en sturen. Met echte voorbeelden
            en geen agency-slides.
          </p>
          <Link
            href={CASES_PAGE_WERKWIJZE.ctaHref}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-slate-900 px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-slate-800"
          >
            {CASES_PAGE_WERKWIJZE.ctaLabel}
            <ArrowUpRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
