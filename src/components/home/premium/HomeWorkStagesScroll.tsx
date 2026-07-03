"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Compass, LineChart, Rocket, Search } from "lucide-react";
import { useCallback, useState } from "react";
import { HOME_WORK_STAGES } from "@/data/home-premium";

const STAGE_ICONS = [Search, Compass, Rocket, LineChart] as const;
const STAGE_TAGS = ["Begrijpen", "Route", "Bouwen", "Opschalen"] as const;

function StageVisual({ index }: { index: number }) {
  if (index === 0) {
    return (
      <div className="space-y-2 p-5">
        {["Doelen?", "Data?", "Stack?"].map((q, i) => (
          <motion.div
            key={q}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 * i }}
            className="flex items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-3 py-2"
          >
            <span className="text-[11px] font-bold text-slate-600">{q}</span>
          </motion.div>
        ))}
      </div>
    );
  }
  if (index === 1) {
    return (
      <div className="p-5">
        <div className="flex gap-2">
          {["SEO", "Ads", "E-mail"].map((c, i) => (
            <div
              key={c}
              className={`flex-1 rounded-xl border px-2 py-3 text-center text-[10px] font-bold ${
                i === 0 ? "border-[#FF5722] bg-[#FF5722]/10 text-[#FF5722]" : "border-slate-200 text-slate-400"
              }`}
            >
              {c}
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-[10px] font-bold text-slate-400">volgorde bepaald</p>
      </div>
    );
  }
  if (index === 2) {
    return (
      <div className="p-5">
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="h-2 w-full rounded-full bg-slate-900" />
          <div className="mt-2 grid grid-cols-3 gap-1">
            {[0, 1, 2].map((i) => (
              <span key={i} className="block h-8 rounded bg-slate-100" />
            ))}
          </div>
          <p className="mt-2 text-[9px] font-bold text-emerald-600">● live + meetpunten</p>
        </div>
      </div>
    );
  }
  return (
    <div className="p-5">
      <div className="flex items-end gap-2">
        {[
          { h: 40, label: "Test" },
          { h: 64, label: "Werkt" },
          { h: 88, label: "Schaal" },
        ].map((bar) => (
          <div key={bar.label} className="flex flex-1 flex-col items-center gap-1">
            <div
              className="w-full rounded-t-lg bg-gradient-to-t from-[#FF5722] to-orange-300"
              style={{ height: bar.h }}
            />
            <span className="text-[9px] font-bold text-slate-500">{bar.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HomeWorkStagesScroll() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const selectStage = useCallback((index: number) => setActive(index), []);

  return (
    <section className="border-b border-slate-200 bg-white" aria-labelledby="home-stages-heading">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <h2
          id="home-stages-heading"
          className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
        >
          Zo werkt een traject samen
        </h2>
        <p className="mt-2 max-w-xl text-slate-600">
          Klik een fase en zie rechts hoe we van intake naar opschalen gaan.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:items-stretch lg:gap-10">
          <div className="flex flex-col gap-2">
            {HOME_WORK_STAGES.map((stage, index) => {
              const Icon = STAGE_ICONS[index];
              const isActive = active === index;
              return (
                <button
                  key={stage.title}
                  type="button"
                  onClick={() => selectStage(index)}
                  aria-pressed={isActive}
                  className={`flex flex-1 items-start gap-4 rounded-2xl border px-4 py-4 text-left transition-all sm:px-5 ${
                    isActive
                      ? "border-[#FF5722]/40 bg-[#FF5722]/[0.04] shadow-[0_12px_32px_-20px_rgba(255,87,34,0.45)]"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <span
                    className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
                      isActive ? "bg-[#FF5722] text-white" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <Icon className="size-5" strokeWidth={1.8} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {STAGE_TAGS[index]}
                    </span>
                    <span className="mt-0.5 block text-sm font-extrabold text-slate-900">
                      {stage.title}
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-slate-600">
                      {stage.body}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_48px_-28px_rgba(15,23,42,0.18)]">
            <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-2.5">
              <span className="size-2 rounded-full bg-[#FF5722]/80" />
              <span className="size-2 rounded-full bg-amber-400/80" />
              <span className="size-2 rounded-full bg-emerald-400/80" />
              <span className="ml-2 font-mono text-[10px] text-slate-400">traject-preview</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="flex flex-1 flex-col"
              >
                <StageVisual index={active} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
