"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { CaseSceneIllustration } from "@/components/home/cases/CaseSceneIllustration";
import { HOME_CASES, type HomeCase } from "@/data/home-cases";
import { siteCtas } from "@/lib/cta";

const SLIDE_MS = 5500;

function CaseDetailPanel({ caseItem, reduce }: { caseItem: HomeCase; reduce: boolean }) {
  return (
    <motion.div
      key={caseItem.id}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr]"
    >
      {[
        { label: "De uitdaging", text: caseItem.challenge },
        { label: "Onze move", text: caseItem.move },
        { label: "Het resultaat", text: caseItem.result },
      ].map((block, i) => (
        <motion.div
          key={block.label}
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 * i }}
          className="rounded-2xl border border-slate-200/90 bg-white/90 p-4 shadow-sm backdrop-blur-sm"
        >
          <p
            className="text-[10px] font-bold uppercase tracking-[0.14em]"
            style={{ color: caseItem.accent }}
          >
            {block.label}
          </p>
          <p className="mt-2 min-h-[4.5rem] text-sm leading-relaxed text-slate-600">
            {block.text}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
}

export function CaseSpotlight() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const caseItem = HOME_CASES[active]!;

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
      {/* Case selector tabs */}
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
              <span
                className={`flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-black ${
                  isActive ? "text-white" : "bg-slate-100 text-slate-600"
                }`}
                style={isActive ? { backgroundColor: c.accent } : undefined}
              >
                {c.client.charAt(0)}
              </span>
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
                  style={{ backgroundColor: c.accent, width: "100%" }}
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

      {/* Spotlight stage */}
      <div className="relative mt-6 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-orange-50/30 shadow-[0_24px_56px_-32px_rgba(15,23,42,0.2)]">
        <div
          className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full blur-3xl"
          style={{ backgroundColor: `${caseItem.accent}22` }}
          aria-hidden
        />

        <div className="grid lg:grid-cols-[1.05fr_1fr] lg:items-stretch">
          <AnimatePresence mode="wait">
            <motion.div
              key={caseItem.id}
              initial={reduce ? false : { opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col justify-center p-6 sm:p-8 lg:p-10"
            >
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                {caseItem.eyebrow}
              </p>
              <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                {caseItem.title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-slate-600">
                {caseItem.body}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {caseItem.tags.map((tag, i) => (
                  <motion.span
                    key={tag}
                    initial={reduce ? false : { opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.05 * i }}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-700"
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap items-end gap-4">
                <div>
                  <motion.p
                    key={caseItem.metric}
                    initial={reduce ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl font-black tracking-tighter"
                    style={{ color: caseItem.accent }}
                  >
                    {caseItem.metric}
                  </motion.p>
                  <p className="mt-1 text-sm font-bold text-slate-500">
                    {caseItem.metricHint}
                  </p>
                </div>
                <Link
                  href={caseItem.href}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-[#FF5722]"
                >
                  Lees het verhaal
                  <ArrowUpRight className="size-4" aria-hidden />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="relative min-h-[220px] border-t border-slate-200/80 bg-slate-900/5 lg:min-h-[340px] lg:border-l lg:border-t-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={caseItem.scene}
                initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 flex items-center justify-center p-4 sm:p-6"
              >
                <CaseSceneIllustration
                  scene={caseItem.scene}
                  accent={caseItem.accent}
                  className="h-full w-full max-h-[280px] max-w-[400px]"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Detail strips */}
      <div className="mt-6">
        <AnimatePresence mode="wait">
          <CaseDetailPanel caseItem={caseItem} reduce={!!reduce} />
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
          Geen stockfoto&apos;s van handen schudden. Wel SkinComplete en BestRest:
          echte keuzes, echte volgorde en resultaat dat je kunt uitleggen.
        </p>
      </div>
      <div className="flex flex-col gap-2 self-start sm:flex-row sm:items-center lg:self-auto">
        <Link
          href={siteCtas.samenwerken.href}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#FF5722]"
        >
          {siteCtas.samenwerken.label}
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
