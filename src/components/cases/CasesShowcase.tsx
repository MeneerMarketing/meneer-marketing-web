"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { useState } from "react";
import { CaseLivePreview } from "@/components/cases/CaseLivePreview";
import { CaseSwitcherThumb } from "@/components/cases/CaseSwitcherThumb";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import { CASES_PAGE_STORIES } from "@/data/cases-page";
import { HOME_CASES } from "@/data/home-cases";
import type { HomeCase } from "@/data/home-cases";
import { siteCtas } from "@/lib/cta";

const EASE = [0.22, 1, 0.36, 1] as const;

export function CasesShowcase() {
  const reduce = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [beatIndex, setBeatIndex] = useState(0);

  const caseItem = HOME_CASES[activeIndex]!;
  const story = CASES_PAGE_STORIES[caseItem.scene];
  const activeBeat = story.beats[beatIndex] ?? story.beats[0]!;

  function selectCase(index: number) {
    setActiveIndex(index);
    setBeatIndex(0);
  }

  return (
    <div className="mx-auto w-full min-w-0 max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
      {/* Case-kiezer */}
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {HOME_CASES.map((c, index) => {
          const isActive = activeIndex === index;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => selectCase(index)}
              aria-pressed={isActive}
              className={`relative flex flex-1 items-center gap-3 overflow-hidden rounded-2xl border px-4 py-3.5 text-left transition-all sm:min-w-[180px] ${
                isActive
                  ? "border-[#FF5722]/50 bg-slate-900 text-white shadow-[0_16px_40px_-20px_rgba(255,87,34,0.45)]"
                  : "border-slate-200 bg-white text-slate-900 hover:border-slate-300"
              }`}
            >
              <CaseSwitcherThumb caseItem={c} isActive={isActive} />
              <span className="min-w-0">
                <span
                  className={`block text-[10px] font-bold uppercase tracking-wider ${
                    isActive ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  {c.eyebrow.split("·")[0]?.trim()}
                </span>
                <span className="mt-0.5 block truncate text-sm font-extrabold">{c.client}</span>
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={caseItem.id}
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="mt-8 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_28px_64px_-32px_rgba(15,23,42,0.18)]"
        >
          <div className="grid lg:grid-cols-2 lg:items-stretch">
            {/* Media */}
            <div className="border-b border-slate-100 bg-slate-950 p-5 sm:p-6 lg:border-b-0 lg:border-r">
              <CaseLivePreview caseItem={caseItem} />
              {caseItem.website ? (
                <a
                  href={caseItem.website.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-bold text-white transition hover:border-[#FF5722]/40 hover:bg-white/[0.1]"
                >
                  <span>
                    Bekijk live:{" "}
                    <span className="text-[#FF5722]">{caseItem.website.hostname}</span>
                  </span>
                  <ExternalLink className="size-4 shrink-0 opacity-70" aria-hidden />
                </a>
              ) : null}
            </div>

            {/* Verhaal */}
            <div className="flex flex-col p-5 sm:p-7 lg:p-8">
              <p className="text-pretty text-lg font-extrabold leading-snug tracking-tight text-slate-900 sm:text-xl">
                {story.hook}
              </p>

              <div className="relative mt-5 rounded-2xl rounded-bl-sm border border-[#FF5722]/20 bg-orange-50/80 px-4 py-3.5 pl-12">
                <InteractiveLogo
                  className="absolute left-3 top-3 size-7 shrink-0"
                  interactive={false}
                />
                <p className="text-pretty text-sm font-bold leading-snug text-slate-800">
                  {story.meneerLine}
                </p>
              </div>

              {/* Beat-kiezer */}
              <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Verhaal">
                {story.beats.map((beat, i) => (
                  <button
                    key={beat.label}
                    type="button"
                    role="tab"
                    aria-selected={beatIndex === i}
                    onClick={() => setBeatIndex(i)}
                    className={`rounded-full px-3 py-1.5 text-[11px] font-extrabold tracking-tight transition-all ${
                      beatIndex === i
                        ? "bg-[#FF5722] text-white shadow-[0_8px_20px_-10px_rgba(255,87,34,0.6)]"
                        : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    {beat.label}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`${caseItem.id}-beat-${beatIndex}`}
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="mt-4 flex-1 rounded-2xl border border-slate-100 bg-slate-50/90 p-4 sm:p-5"
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#FF5722]">
                    {activeBeat.label}
                  </p>
                  <p className="mt-2 text-pretty text-sm leading-relaxed text-slate-700 sm:text-[15px]">
                    {activeBeat.text}
                  </p>
                </motion.div>
              </AnimatePresence>

              <CaseMetricBlock caseItem={caseItem} punch={story.punch} />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <p className="mt-6 text-center text-xs font-bold text-slate-500">
        Tik een case. Tik een beat. Zo lees je het verhaal.
      </p>
    </div>
  );
}

function CaseMetricBlock({ caseItem, punch }: { caseItem: HomeCase; punch: string }) {
  return (
    <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-slate-100 pt-5">
      <div>
        <p
          className="text-3xl font-black tracking-tight sm:text-4xl"
          style={{ color: caseItem.palette.accent }}
        >
          {caseItem.metric}
        </p>
        <p className="mt-1 max-w-xs text-sm font-bold text-slate-500">{caseItem.metricHint}</p>
        <p className="mt-3 max-w-sm text-pretty text-sm font-bold leading-snug text-slate-800">
          {punch}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link
          href={caseItem.href}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:border-[#FF5722]/40 hover:text-[#FF5722]"
        >
          Volledige case
          <ArrowUpRight className="size-4" aria-hidden />
        </Link>
        <Link
          href={siteCtas.groeiscan.href}
          className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-[#FF5722]"
        >
          Ik wil dit ook
          <ArrowUpRight className="size-4" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
