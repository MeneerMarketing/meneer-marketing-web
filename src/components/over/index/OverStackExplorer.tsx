"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import { OverStackVisual } from "@/components/over/index/OverStackVisuals";
import { StackBrandIcon } from "@/components/over/index/StackBrandIcon";
import { OVER_STACK, OVER_STACK_SECTION } from "@/data/over-index";

const EASE = [0.22, 1, 0.36, 1] as const;

export function OverStackExplorer() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const item = OVER_STACK[active]!;

  return (
    <section
      className="relative overflow-hidden border-b border-slate-800 bg-slate-950"
      aria-labelledby="over-stack-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div
        className="pointer-events-none absolute -right-16 top-0 size-72 rounded-full bg-[#FF5722]/10 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="lg:grid lg:grid-cols-[1fr_auto] lg:items-start lg:gap-10">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#FF5722]">
              Stack
            </p>
            <h2
              id="over-stack-heading"
              className="mt-3 max-w-2xl text-pretty text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl"
            >
              Waarmee ik werk{" "}
              <span className="text-slate-500">(en waarom het telt)</span>
            </h2>
            <p className="mt-3 max-w-xl text-pretty text-slate-400">
              {OVER_STACK_SECTION.intro}
            </p>
          </div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-6 hidden max-w-xs rounded-2xl border border-white/10 bg-white/[0.04] p-4 lg:mt-0 lg:block"
          >
            <div className="flex items-start gap-3">
              <InteractiveLogo className="size-9 shrink-0" interactive={false} />
              <p className="text-xs font-semibold italic leading-relaxed text-slate-400">
                &ldquo;Ik kies tools op wat ze opleveren, niet op wat in een pitch-deck
                indruk maakt.&rdquo;
              </p>
            </div>
          </motion.div>
        </div>

        <div className="mt-8 flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {OVER_STACK.map((stack, index) => {
            const isActive = active === index;
            return (
              <button
                key={stack.id}
                type="button"
                onClick={() => setActive(index)}
                aria-pressed={isActive}
                className={`flex shrink-0 items-center gap-2.5 rounded-2xl border px-3 py-2.5 text-left transition-all sm:px-4 sm:py-3 ${
                  isActive
                    ? "border-white/20 bg-white/10 text-white shadow-lg"
                    : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-white"
                }`}
                style={
                  isActive
                    ? {
                        boxShadow: `0 12px 32px -12px ${stack.accent}55`,
                        borderColor: `${stack.accent}44`,
                      }
                    : undefined
                }
              >
                <StackBrandIcon id={stack.id} size={22} />
                <span className="whitespace-nowrap text-sm font-bold">{stack.label}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent">
          <div className="grid lg:grid-cols-2 lg:items-stretch">
            <AnimatePresence mode="wait">
              <motion.div
                key={item.id}
                initial={reduce ? false : { opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.28, ease: EASE }}
                className="flex flex-col justify-center border-b border-white/10 p-6 sm:p-8 lg:border-b-0 lg:border-r"
              >
                <div className="flex items-center gap-3">
                  <StackBrandIcon id={item.id} size={36} />
                  <p className="text-xl font-extrabold text-white sm:text-2xl">{item.label}</p>
                </div>

                <p className="mt-4 text-base leading-relaxed text-slate-300 sm:text-lg">
                  {item.body}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {item.chips.map((chip) => (
                    <span
                      key={chip}
                      className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-400"
                    >
                      {chip}
                    </span>
                  ))}
                </div>

                <div className="relative mt-6 overflow-hidden rounded-2xl border border-[#FF5722]/20 bg-[#FF5722]/10 px-4 py-3.5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#FF5722]">
                    Meneer zegt
                  </p>
                  <p className="mt-1.5 text-pretty text-sm font-bold leading-snug text-white/95">
                    {item.quip}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={item.id}
                initial={reduce ? false : { opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.32, ease: EASE }}
                className="relative min-h-[300px] bg-slate-950/50"
              >
                <div
                  className="pointer-events-none absolute right-6 top-6 opacity-[0.07]"
                  aria-hidden
                >
                  <StackBrandIcon id={item.id} size={120} />
                </div>
                <OverStackVisual itemId={item.id} accent={item.accent} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
