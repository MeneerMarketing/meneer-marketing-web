"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { DIENSTEN_APPROACH } from "@/data/diensten-index";

const TAG_COLORS = ["#FF5722", "#0284c7", "#00BCD4", "#22C55E"] as const;

function ApproachVisual({ index }: { index: number }) {
  if (index === 0) {
    return (
      <div className="flex flex-wrap gap-2 p-4">
        {["Doelen", "Data", "Stack", "Team"].map((l, i) => (
          <motion.span
            key={l}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.08 * i }}
            className="rounded-full border border-dashed border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-600"
          >
            {l}
          </motion.span>
        ))}
      </div>
    );
  }
  if (index === 1) {
    return (
      <div className="flex items-center justify-center gap-2 p-4">
        {["SEO", "Bouwen", "Ads"].map((c, i) => (
          <div
            key={c}
            className={`rounded-xl px-3 py-4 text-center text-[10px] font-bold ${
              i === 0
                ? "bg-[#FF5722] text-white shadow-md"
                : "border border-slate-200 text-slate-400"
            }`}
          >
            {c}
          </div>
        ))}
      </div>
    );
  }
  if (index === 2) {
    return (
      <div className="p-4">
        <div className="rounded-xl border border-slate-200 bg-slate-900 p-3">
          <div className="font-mono text-[9px] text-emerald-400">✓ deploy live</div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-700">
            <motion.div
              className="h-full rounded-full bg-[#FF5722]"
              initial={{ width: "20%" }}
              animate={{ width: "85%" }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-end justify-center gap-2 p-4">
      {[40, 70, 95].map((h, i) => (
        <motion.div
          key={h}
          initial={{ height: 20 }}
          animate={{ height: h }}
          transition={{ delay: 0.1 * i, type: "spring" }}
          className="w-8 rounded-t-lg bg-gradient-to-t from-[#FF5722] to-orange-300"
        />
      ))}
    </div>
  );
}

export function DienstenApproachStrip() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const step = DIENSTEN_APPROACH[active]!;

  return (
    <section
      className="border-b border-slate-200 bg-white"
      aria-labelledby="diensten-approach-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <h2
          id="diensten-approach-heading"
          className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
        >
          Hoe een traject bij mij loopt
        </h2>
        <p className="mt-2 max-w-xl text-slate-600">
          Altijd dezelfde kwaliteit van beslissingen. De invulling verschilt per
          klant. Tik een fase en zie wat er gebeurt. Geen verrassingen in week zes.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:items-stretch">
          <div className="flex flex-col gap-2">
            {DIENSTEN_APPROACH.map((s, index) => {
              const isActive = active === index;
              return (
                <button
                  key={s.tag}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-pressed={isActive}
                  className={`flex items-start gap-4 rounded-2xl border px-4 py-4 text-left transition-all sm:px-5 ${
                    isActive
                      ? "border-[#FF5722]/40 bg-[#FF5722]/[0.04] shadow-sm"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <span
                    className="mt-0.5 size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: TAG_COLORS[index] }}
                    aria-hidden
                  />
                  <span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {s.tag}
                    </span>
                    <span className="mt-0.5 block text-sm font-extrabold text-slate-900">
                      {s.title}
                    </span>
                    <span className="mt-1 block text-xs text-slate-600">{s.body}</span>
                    {isActive ? (
                      <span className="mt-2 block rounded-lg bg-slate-900/5 px-3 py-2 text-xs font-semibold italic text-slate-700">
                        {s.meneerLine}
                      </span>
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-2.5">
              <span className="size-2 rounded-full bg-[#FF5722]/80" />
              <span className="font-mono text-[10px] text-slate-400">traject.fase</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ApproachVisual index={active} />
                <p className="border-t border-slate-200 px-4 py-3 text-center text-sm font-bold text-slate-700">
                  {step.title}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
