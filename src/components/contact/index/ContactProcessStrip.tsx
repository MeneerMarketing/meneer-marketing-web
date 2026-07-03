"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { CONTACT_PROCESS } from "@/data/contact-index";

const TAG_COLORS = ["#FF5722", "#0284c7", "#00BCD4", "#22C55E"] as const;

function ProcessVisual({ index }: { index: number }) {
  if (index === 0) {
    return (
      <div className="flex items-center justify-center gap-3 p-6">
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-center shadow-sm">
          <p className="text-[10px] font-bold text-slate-400">jouw mail</p>
          <p className="mt-1 text-xs font-bold text-slate-800">ingelezen ✓</p>
        </div>
      </div>
    );
  }
  if (index === 1) {
    return (
      <div className="flex justify-center gap-2 p-6">
        {["Context", "Route", "Eerlijk"].map((l, i) => (
          <motion.div
            key={l}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] font-bold text-slate-700"
          >
            {l}
          </motion.div>
        ))}
      </div>
    );
  }
  if (index === 2) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="flex items-center gap-2 rounded-2xl border border-[#FF5722]/30 bg-[#FF5722]/10 px-4 py-3">
          <span className="size-2 rounded-full bg-emerald-500" aria-hidden />
          <span className="text-xs font-bold text-slate-800">Gesprek gepland</span>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-end justify-center gap-2 p-6">
      {[35, 55, 80].map((h, i) => (
        <motion.div
          key={h}
          initial={{ height: 16 }}
          animate={{ height: h }}
          transition={{ delay: 0.08 * i, type: "spring" }}
          className="w-10 rounded-t-lg bg-gradient-to-t from-[#FF5722] to-orange-300"
        />
      ))}
    </div>
  );
}

export function ContactProcessStrip() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const step = CONTACT_PROCESS[active]!;

  return (
    <section
      className="border-b border-slate-800 bg-slate-950"
      aria-labelledby="contact-process-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF5722]">
          Daarna
        </p>
        <h2
          id="contact-process-heading"
          className="mt-3 max-w-2xl text-2xl font-extrabold tracking-tight text-white sm:text-3xl"
        >
          Wat gebeurt er na je bericht?
        </h2>
        <p className="mt-3 max-w-xl text-slate-400">
          Geen black box. Tik een fase en zie hoe we schakelen.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:items-stretch">
          <div className="flex flex-col gap-2">
            {CONTACT_PROCESS.map((s, index) => {
              const isActive = active === index;
              return (
                <button
                  key={s.tag}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-pressed={isActive}
                  className={`flex items-start gap-4 rounded-2xl border px-4 py-4 text-left transition-all sm:px-5 ${
                    isActive
                      ? "border-[#FF5722]/40 bg-[#FF5722]/10"
                      : "border-white/10 bg-white/[0.02] hover:border-white/20"
                  }`}
                >
                  <span
                    className="mt-0.5 size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: TAG_COLORS[index] }}
                    aria-hidden
                  />
                  <span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {s.tag}
                    </span>
                    <span className="mt-0.5 block text-sm font-extrabold text-white">
                      {s.title}
                    </span>
                    <span className="mt-1 block text-xs text-slate-400">{s.body}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
              <span className="size-2 rounded-full bg-[#FF5722]/80" />
              <span className="font-mono text-[10px] text-slate-500">contact.flow</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ProcessVisual index={active} />
                <p className="border-t border-white/10 px-4 py-3 text-center text-sm font-bold text-slate-300">
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
