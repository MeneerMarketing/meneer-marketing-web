"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Compass,
  LineChart,
  Pause,
  Play,
  Rocket,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { TrajectoryStageVisuals } from "@/components/home/premium/TrajectoryStageVisuals";
import { HOME_TRAJECTORY_STAGES } from "@/data/home-premium";
import { siteCtas } from "@/lib/cta";

const STAGE_ICONS = [Search, Compass, Rocket, LineChart] as const;
const TOUR_MS = 4500;

export function HomeWorkStagesScroll() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [touring, setTouring] = useState(false);
  const tourRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stage = HOME_TRAJECTORY_STAGES[active]!;
  const progress = ((active + 1) / HOME_TRAJECTORY_STAGES.length) * 100;

  const stopTour = useCallback(() => {
    if (tourRef.current) clearInterval(tourRef.current);
    tourRef.current = null;
    setTouring(false);
  }, []);

  const startTour = useCallback(() => {
    stopTour();
    setTouring(true);
    tourRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % HOME_TRAJECTORY_STAGES.length);
    }, TOUR_MS);
  }, [stopTour]);

  useEffect(() => () => stopTour(), [stopTour]);

  function selectStage(index: number) {
    stopTour();
    setActive(index);
  }

  return (
    <section
      className="relative overflow-hidden border-b border-slate-800 bg-slate-950"
      aria-labelledby="home-stages-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,87,34,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,87,34,0.04)_1px,transparent_1px)] bg-[size:36px_36px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-64 w-[32rem] -translate-x-1/2 rounded-full bg-[#FF5722]/10 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-[#FF5722]">
              Samenwerken
            </p>
            <h2
              id="home-stages-heading"
              className="mt-4 text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl"
            >
              Zo ziet een traject eruit.{" "}
              <span className="text-slate-400">Geen black box.</span>
            </h2>
            <p className="mt-3 max-w-xl text-slate-400">
              Van eerste gesprek tot opschalen. Klik een fase of start de rondleiding
              en zie wat je krijgt, wat we doen en hoe het eruitziet als het draait.
            </p>
          </div>

          <button
            type="button"
            onClick={touring ? stopTour : startTour}
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-bold text-white transition hover:border-[#FF5722]/40 hover:bg-[#FF5722]/10 lg:self-auto"
          >
            {touring ? (
              <>
                <Pause className="size-4" aria-hidden />
                Pauzeer rondleiding
              </>
            ) : (
              <>
                <Play className="size-4" aria-hidden />
                Start rondleiding
              </>
            )}
          </button>
        </div>

        {/* Faseknoppen */}
        <div className="relative mt-10">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
            {HOME_TRAJECTORY_STAGES.map((s, index) => {
              const Icon = STAGE_ICONS[index];
              const isActive = active === index;
              const isPast = index < active;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => selectStage(index)}
                  aria-pressed={isActive}
                  className={`group relative flex flex-col items-center gap-2 rounded-2xl border px-2 py-3 text-center transition-all sm:px-3 sm:py-4 ${
                    isActive
                      ? "border-[#FF5722]/50 bg-[#FF5722]/10 shadow-[0_0_32px_rgba(255,87,34,0.2)]"
                      : isPast
                        ? "border-white/10 bg-white/[0.04]"
                        : "border-white/[0.06] bg-white/[0.02] hover:border-white/15"
                  }`}
                >
                  <span
                    className={`relative z-[1] flex size-10 items-center justify-center rounded-xl transition-colors ${
                      isActive
                        ? "bg-[#FF5722] text-white"
                        : isPast
                          ? "bg-white/15 text-[#FF5722]"
                          : "bg-white/10 text-slate-400 group-hover:text-white"
                    }`}
                  >
                    <Icon className="size-5" strokeWidth={1.8} aria-hidden />
                  </span>
                  <span className="relative z-[1]">
                    <span
                      className={`block text-[9px] font-bold uppercase tracking-wider ${
                        isActive ? "text-[#FF5722]" : "text-slate-500"
                      }`}
                    >
                      {s.tag}
                    </span>
                    <span
                      className={`mt-0.5 block text-xs font-extrabold sm:text-sm ${
                        isActive ? "text-white" : "text-slate-300"
                      }`}
                    >
                      {s.title}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/10" aria-hidden>
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#FF5722] to-orange-300"
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 90, damping: 18 }}
            />
          </div>
        </div>

        {/* Hoofdpaneel */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-stretch lg:gap-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={stage.id}
              initial={reduce ? false : { opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.32 }}
              className="flex flex-col rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 sm:p-8"
            >
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#FF5722]">
                {stage.tag}
              </p>
              <h3 className="mt-2 text-xl font-extrabold text-white sm:text-2xl">
                {stage.headline}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">
                {stage.body}
              </p>

              <div className="mt-6 rounded-xl border border-white/[0.06] bg-slate-900/50 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Wat je krijgt
                </p>
                <ul className="mt-3 space-y-2">
                  {stage.deliverables.map((item, i) => (
                    <motion.li
                      key={item}
                      initial={reduce ? false : { opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.06 * i }}
                      className="flex items-center gap-2 text-sm font-bold text-slate-200"
                    >
                      <span className="size-1.5 shrink-0 rounded-full bg-[#FF5722]" aria-hidden />
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>

              <p className="mt-5 text-sm font-bold italic text-slate-300">
                &ldquo;{stage.punchline}&rdquo;
              </p>
            </motion.div>
          </AnimatePresence>

          <TrajectoryStageVisuals stage={stage} />
        </div>

        {/* Afsluiter */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-[#FF5722]/20 bg-gradient-to-r from-[#FF5722]/10 via-transparent to-[#FF5722]/5 p-6 sm:flex-row sm:p-8"
        >
          <div>
            <p className="text-lg font-extrabold text-white">
              Klaar om dit traject voor jouw bedrijf te starten?
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Plan direct een intake. Geen verplichtingen.
            </p>
          </div>
          <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row">
            <Link
              href={siteCtas.startIntake.href}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FF5722] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#FF5722]/25 transition hover:bg-orange-600"
            >
              {siteCtas.startIntake.label}
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
            <Link
              href="/project-starten"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3.5 text-sm font-bold text-white transition hover:border-white/30"
            >
              Project starten
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
