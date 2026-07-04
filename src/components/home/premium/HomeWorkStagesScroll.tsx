"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Coffee, Gauge, Hammer, Map } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { HomeTrajectoryScenes } from "@/components/home/premium/HomeTrajectoryScenes";
import { HOME_TRAJECTORY_STAGES } from "@/data/home-premium";
import { siteCtas } from "@/lib/cta";

const STAGE_ICONS = [Coffee, Map, Hammer, Gauge] as const;
const TOUR_MS = 5200;

export function HomeWorkStagesScroll() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [touring, setTouring] = useState(false);
  const tourRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stage = HOME_TRAJECTORY_STAGES[active]!;

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
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,87,34,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,87,34,0.04)_1px,transparent_1px)] bg-[size:40px_40px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-64 w-[32rem] -translate-x-1/2 rounded-full bg-[#FF5722]/10 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-[#FF5722]">
              Samenwerken
            </p>
            <h2
              id="home-stages-heading"
              className="mt-4 text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl"
            >
              Zo pak ik het aan.{" "}
              <span className="text-[#FF5722]">Jij ziet alles.</span>
            </h2>
            <p className="mt-3 max-w-xl text-slate-400">
              Klik een fase links en speel mee rechts. Zo weet je precies wat er
              gebeurt als we starten, zonder verrassingen halverwege.
            </p>
          </div>

          <button
            type="button"
            onClick={touring ? stopTour : startTour}
            className={`inline-flex shrink-0 items-center gap-2 self-start rounded-full border px-4 py-2.5 text-sm font-bold transition lg:self-auto ${
              touring
                ? "border-[#FF5722] bg-[#FF5722] text-white shadow-lg shadow-[#FF5722]/25"
                : "border-white/15 bg-white/5 text-white hover:border-[#FF5722]/40 hover:bg-[#FF5722]/10"
            }`}
          >
            {touring ? "Pauzeer rondleiding" : "Laat zien hoe het loopt"}
          </button>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:items-stretch lg:gap-10">
          <div className="flex flex-col gap-2">
            {HOME_TRAJECTORY_STAGES.map((item, index) => {
              const Icon = STAGE_ICONS[index % STAGE_ICONS.length];
              const isActive = active === index;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectStage(index)}
                  aria-pressed={isActive}
                  className={`flex flex-1 items-start gap-4 rounded-2xl border px-4 py-4 text-left transition-all duration-300 sm:px-5 ${
                    isActive
                      ? "border-[#FF5722]/40 bg-[#FF5722]/10 shadow-[0_12px_32px_-20px_rgba(255,87,34,0.5)]"
                      : "border-white/[0.08] bg-white/[0.03] hover:border-white/15 hover:bg-white/[0.05]"
                  }`}
                >
                  <span
                    className={`flex size-10 shrink-0 items-center justify-center rounded-xl border transition-all duration-300 ${
                      isActive
                        ? "border-[#FF5722] bg-[#FF5722] text-white"
                        : "border-white/10 bg-white/5 text-slate-400"
                    }`}
                    aria-hidden
                  >
                    <Icon className="size-5" strokeWidth={1.8} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <p
                      className={`text-[10px] font-black uppercase tracking-[0.16em] ${
                        isActive ? "text-[#FF5722]" : "text-slate-500"
                      }`}
                    >
                      {item.short}
                    </p>
                    <h3 className="mt-0.5 text-base font-extrabold tracking-tight text-white">
                      {item.title}
                    </h3>
                    <AnimatePresence initial={false}>
                      {isActive ? (
                        <motion.div
                          key="detail"
                          initial={reduce ? false : { opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={reduce ? undefined : { opacity: 0, height: 0 }}
                          transition={{ duration: 0.28 }}
                          className="overflow-hidden"
                        >
                          <p className="mt-2 text-sm font-extrabold leading-snug text-white">
                            {item.headline}
                          </p>
                          <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                            {item.body}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {item.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-bold text-slate-300"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      ) : (
                        <motion.p
                          key="preview"
                          initial={false}
                          className="mt-1 line-clamp-2 text-sm leading-snug text-slate-500"
                        >
                          {item.headline}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col">
            <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-white shadow-[0_24px_48px_-24px_rgba(0,0,0,0.55)] lg:sticky lg:top-28">
              <BrowserChrome tag={stage.short} touring={touring} reduce={!!reduce} />
              <HomeTrajectoryScenes stage={stage} />
            </div>

            <div className="mt-4 flex items-center justify-center gap-2">
              {HOME_TRAJECTORY_STAGES.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectStage(i)}
                  aria-label={item.title}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === active ? "w-8 bg-[#FF5722]" : "w-3 bg-slate-700 hover:bg-slate-600"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 rounded-2xl border border-[#FF5722]/20 bg-gradient-to-r from-[#FF5722]/10 via-white/[0.03] to-transparent p-6 sm:flex-row sm:items-center sm:p-8">
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
        </div>
      </div>
    </section>
  );
}

function BrowserChrome({
  tag,
  touring,
  reduce,
}: {
  tag: string;
  touring: boolean;
  reduce: boolean;
}) {
  return (
    <div className="relative flex items-center gap-2 border-b border-slate-100 px-4 py-3">
      <span className="size-2.5 rounded-full bg-[#FF5722]/80" aria-hidden />
      <span className="size-2.5 rounded-full bg-amber-300" aria-hidden />
      <span className="size-2.5 rounded-full bg-emerald-400" aria-hidden />
      <span className="ml-3 flex-1 rounded-full bg-slate-100 px-3 py-1 font-mono text-[10px] font-semibold text-slate-400">
        traject.meneermarketing.nl
      </span>
      <span className="rounded-full bg-slate-900 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-white">
        {tag}
      </span>
      {touring && !reduce ? (
        <motion.span
          className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-[#FF5722] to-transparent"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          aria-hidden
        />
      ) : null}
    </div>
  );
}
