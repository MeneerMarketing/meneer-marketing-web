"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { WERKWIJZE_PHASES } from "@/data/werkwijze-index";
import {
  PHASE_ICONS,
  WerkwijzePhaseScenes,
} from "@/components/werkwijze/WerkwijzePhaseScenes";

const TAG_COLORS = ["#FF5722", "#0284c7", "#45382C", "#0D9488"] as const;

export function WerkwijzeProcessSection() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const phase = WERKWIJZE_PHASES[active]!;

  return (
    <section
      id="proces"
      className="relative overflow-hidden border-b border-slate-200 bg-white"
      aria-labelledby="werkwijze-process-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.025)_1px,transparent_1px)] bg-[size:40px_40px]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF5722]">
          Het proces
        </p>
        <h2
          id="werkwijze-process-heading"
          className="mt-3 max-w-2xl text-2xl font-extrabold tracking-tighter text-slate-900 sm:text-3xl"
        >
          Vier fases. Tik er één open en speel mee.
        </h2>
        <p className="mt-3 max-w-xl text-slate-600">
          Chat-intake, routekaart, deploy-knop, budget-slider: per fase een mini-demo.
          De volgorde verschilt per klant. De scherpte niet.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:items-stretch lg:gap-8">
          {/* Compacte fase-rail */}
          <div className="relative flex flex-col gap-2">
            <div
              className="pointer-events-none absolute bottom-4 left-[23px] top-4 hidden w-px bg-gradient-to-b from-[#FF5722]/30 via-slate-200 to-emerald-300/40 lg:block"
              aria-hidden
            />

            {WERKWIJZE_PHASES.map((item, index) => {
              const isActive = active === index;
              const Icon = PHASE_ICONS[index]!;

              return (
                <motion.button
                  key={item.id}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-pressed={isActive}
                  whileHover={reduce ? undefined : { y: -1 }}
                  whileTap={reduce ? undefined : { scale: 0.995 }}
                  className={`relative flex items-center gap-3 rounded-2xl border px-3 py-3 text-left transition-[border-color,box-shadow,background-color] duration-300 sm:px-4 sm:py-3.5 ${
                    isActive
                      ? "border-[#FF5722]/35 bg-white shadow-[0_16px_40px_-24px_rgba(255,87,34,0.45)]"
                      : "border-slate-200/90 bg-white/80 hover:border-slate-300 hover:bg-white hover:shadow-sm"
                  }`}
                >
                  {isActive ? (
                    <motion.span
                      layoutId="werkwijze-phase-active"
                      className="pointer-events-none absolute inset-y-2.5 left-0 w-1 rounded-full"
                      style={{ backgroundColor: TAG_COLORS[index] }}
                      aria-hidden
                    />
                  ) : null}

                  <span
                    className={`relative z-10 flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                      isActive ? "text-white" : "bg-slate-100 text-slate-500"
                    }`}
                    style={isActive ? { backgroundColor: TAG_COLORS[index] } : undefined}
                  >
                    <Icon className="size-4" strokeWidth={2} aria-hidden />
                  </span>

                  <span className="relative z-10 min-w-0 flex-1">
                    <span
                      className="text-[10px] font-bold uppercase tracking-[0.14em]"
                      style={{ color: isActive ? TAG_COLORS[index] : "#94a3b8" }}
                    >
                      {item.tag}
                    </span>
                    <span className="mt-0.5 block text-sm font-extrabold leading-snug text-slate-900">
                      {item.title}
                    </span>
                    {!isActive ? (
                      <span className="mt-0.5 block truncate text-xs text-slate-400">
                        {item.headline}
                      </span>
                    ) : null}
                  </span>

                  <span
                    className={`relative z-10 hidden shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider sm:block ${
                      isActive
                        ? "bg-slate-900 text-white"
                        : "border border-slate-200 text-slate-400"
                    }`}
                  >
                    {item.metric.value}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Rijk detailpaneel + interactie */}
          <div className="flex min-h-[520px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_32px_70px_-40px_rgba(15,23,42,0.28)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={phase.id}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.28 }}
                className="flex h-full flex-col"
              >
                <div className="border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white px-5 py-5 sm:px-6 sm:py-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p
                        className="text-[10px] font-bold uppercase tracking-[0.16em]"
                        style={{ color: TAG_COLORS[active] }}
                      >
                        {phase.tag}
                      </p>
                      <h3 className="mt-1 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                        {phase.headline}
                      </h3>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-right">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        {phase.metric.label}
                      </p>
                      <p className="text-base font-extrabold text-slate-900">
                        {phase.metric.value}
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-slate-600">
                    {phase.body}
                  </p>
                  <p className="mt-3 text-sm font-bold italic text-slate-500">
                    {phase.punchline}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {phase.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-[10px] font-semibold text-slate-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-center bg-slate-50/50 p-4 sm:p-5">
                  <WerkwijzePhaseScenes phase={phase} />
                  <p className="mt-3 text-center text-[11px] font-medium text-slate-500">
                    Tik of klik mee in de preview hierboven.
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
