"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { OverStackVisual } from "@/components/over/index/OverStackVisuals";
import { OVER_STACK } from "@/data/over-index";

export function OverStackExplorer() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const item = OVER_STACK[active]!;

  return (
    <section
      className="border-b border-slate-800 bg-slate-950"
      aria-labelledby="over-stack-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF5722]">Stack</p>
        <h2
          id="over-stack-heading"
          className="mt-3 max-w-2xl text-2xl font-extrabold tracking-tight text-white sm:text-3xl"
        >
          Waarmee ik werk (en waarom)
        </h2>
        <p className="mt-3 max-w-xl text-slate-400">
          Geen buzzword-bingo. Tik een blok en zie wat het in de praktijk betekent.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {OVER_STACK.map((stack, index) => {
            const isActive = active === index;
            return (
              <button
                key={stack.id}
                type="button"
                onClick={() => setActive(index)}
                aria-pressed={isActive}
                className={`rounded-full border px-4 py-2 text-sm font-bold transition-all ${
                  isActive
                    ? "border-transparent text-white shadow-lg"
                    : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-white"
                }`}
                style={
                  isActive
                    ? {
                        backgroundColor: stack.accent,
                        boxShadow: `0 8px 24px -8px ${stack.accent}66`,
                      }
                    : undefined
                }
              >
                {stack.label}
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:items-stretch">
          <AnimatePresence mode="wait">
            <motion.div
              key={item.id}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28 }}
              className="flex flex-col justify-center"
            >
              <p className="text-lg font-extrabold text-white">{item.label}</p>
              <p className="mt-3 text-base leading-relaxed text-slate-300">{item.body}</p>
              <p className="mt-4 inline-flex w-fit rounded-full border border-[#FF5722]/25 bg-[#FF5722]/10 px-3 py-1 text-xs font-bold text-[#FF5722]">
                {item.quip}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent">
            <AnimatePresence mode="wait">
              <motion.div
                key={item.id}
                initial={reduce ? false : { opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
              >
                <OverStackVisual itemId={item.id} accent={item.accent} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
