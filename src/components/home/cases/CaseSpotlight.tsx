"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ExternalLink, Pause, Play } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { CaseSceneIllustration } from "@/components/home/cases/CaseSceneIllustration";
import { CaseSwitcherThumb } from "@/components/cases/CaseSwitcherThumb";
import { CaseServiceGrid } from "@/components/home/cases/CaseServiceGrid";
import { CaseStoryRail } from "@/components/home/cases/CaseStoryRail";
import { HOME_CASES } from "@/data/home-cases";

const SLIDE_MS = 5500;

export function CaseSpotlight() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const caseItem = HOME_CASES[active]!;
  const { palette } = caseItem;

  const stopSlideshow = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setPlaying(false);
  }, []);

  const startSlideshow = useCallback(() => {
    stopSlideshow();
    setPlaying(true);
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % HOME_CASES.length);
    }, SLIDE_MS);
  }, [stopSlideshow]);

  useEffect(() => () => stopSlideshow(), [stopSlideshow]);

  function selectCase(index: number) {
    stopSlideshow();
    setActive(index);
  }

  return (
    <div className="mt-12">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {HOME_CASES.map((c, index) => {
          const isActive = active === index;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => selectCase(index)}
              aria-pressed={isActive}
              className={`group relative flex flex-1 items-center gap-3 overflow-hidden rounded-2xl border px-4 py-3.5 text-left transition-all sm:min-w-[200px] ${
                isActive
                  ? "border-slate-900 bg-slate-900 text-white shadow-lg"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <CaseSwitcherThumb caseItem={c} isActive={isActive} />
              <span className="min-w-0">
                <span
                  className={`block text-[10px] font-bold uppercase tracking-wider ${
                    isActive ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  {c.eyebrow}
                </span>
                <span className="mt-0.5 block truncate text-sm font-extrabold">
                  {c.client}
                </span>
              </span>
              {isActive ? (
                <motion.span
                  layoutId="case-active-dot"
                  className="absolute bottom-0 left-0 h-1 rounded-full"
                  style={{ backgroundColor: c.palette.accent, width: "100%" }}
                />
              ) : null}
            </button>
          );
        })}

        <button
          type="button"
          onClick={playing ? stopSlideshow : startSlideshow}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3.5 text-sm font-bold text-slate-600 transition hover:border-[#FF5722]/40 hover:text-[#FF5722] sm:self-stretch"
        >
          {playing ? (
            <>
              <Pause className="size-4" aria-hidden />
              Pauze
            </>
          ) : (
            <>
              <Play className="size-4" aria-hidden />
              Auto-play
            </>
          )}
        </button>
      </div>

      <div className="relative mt-6 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_24px_56px_-32px_rgba(15,23,42,0.2)]">
        <div
          className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full blur-3xl"
          style={{ backgroundColor: `${palette.accent}18` }}
          aria-hidden
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={caseItem.id}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid lg:grid-cols-2 lg:items-stretch"
          >
            {/* Links: illustratie + diensten */}
            <div className="flex min-h-[420px] flex-col border-b border-slate-200/80 lg:min-h-[560px] lg:border-b-0 lg:border-r">
              <div
                className="relative flex flex-1 items-center justify-center p-6 sm:p-8"
                style={{ backgroundColor: palette.surface }}
              >
                <CaseSceneIllustration
                  scene={caseItem.scene}
                  accent={palette.accent}
                  deep={palette.deep}
                  className="h-full w-full max-h-[240px] max-w-[420px] sm:max-h-[280px]"
                />
              </div>

              <CaseServiceGrid services={caseItem.services} palette={palette} />

              {caseItem.website ? (
                <a
                  href={caseItem.website.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 border-t border-slate-200/80 px-5 py-4 text-sm font-bold transition hover:bg-slate-50"
                  style={{ color: palette.deep }}
                >
                  <span>
                    Bekijk live:{" "}
                    <span style={{ color: palette.accent }}>
                      {caseItem.website.hostname}
                    </span>
                  </span>
                  <ExternalLink className="size-4 shrink-0 opacity-60" aria-hidden />
                </a>
              ) : null}
            </div>

            {/* Rechts: verhaal */}
            <div className="flex flex-col p-6 sm:p-8 lg:p-10">
              <span
                className="inline-flex w-fit rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider"
                style={{
                  backgroundColor: palette.accent,
                  color: palette.onAccent,
                }}
              >
                {caseItem.eyebrow}
              </span>
              <h3 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                {caseItem.client}: {caseItem.title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-slate-600">
                {caseItem.body}
              </p>

              <CaseStoryRail caseItem={caseItem} palette={palette} />

              <ul className="mt-6 flex flex-wrap gap-2">
                {caseItem.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-700"
                  >
                    {tag}
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex flex-wrap items-end justify-between gap-4 border-t border-slate-100 pt-6">
                <div>
                  <p
                    className="text-4xl font-black tracking-tighter sm:text-5xl"
                    style={{ color: palette.accent }}
                  >
                    {caseItem.metric}
                  </p>
                  <p className="mt-1 max-w-xs text-sm font-bold text-slate-500">
                    {caseItem.metricHint}
                  </p>
                </div>
                <Link
                  href={caseItem.href}
                  className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white transition hover:opacity-90"
                  style={{ backgroundColor: palette.deep }}
                >
                  Lees het verhaal
                  <ArrowUpRight className="size-4" aria-hidden />
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export function CasesPreviewHeader() {
  return (
    <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
      <div className="max-w-2xl">
        <p className="inline-flex items-center gap-2 rounded-full border border-[#FF5722]/25 bg-[#FF5722]/5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-[#FF5722]">
          Cases
        </p>
        <h2
          id="cases-heading"
          className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl"
        >
          Bewijs, geen praatjes.{" "}
          <span className="text-[#FF5722]">Echte trajecten.</span>
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-slate-600">
          Geen stockfoto&apos;s van handen schudden. Wel SkinComplete, BestRest en
          Hills Pilates: echte keuzes, echte volgorde en resultaat dat je kunt uitleggen.
        </p>
      </div>
      <div className="flex flex-col gap-2 self-start sm:flex-row sm:items-center lg:self-auto">
        <Link
          href="/samenwerken"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#FF5722]"
        >
          Samenwerken
          <ArrowUpRight className="size-4" aria-hidden />
        </Link>
        <Link
          href="/cases"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-900 transition hover:border-slate-400"
        >
          Alle cases
          <ArrowUpRight className="size-4" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
