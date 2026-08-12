"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

import { Reveal } from "@/components/effects/Reveal";
import { PILATES_VERTICAL } from "@/data/verticals/pilates";

const steps = PILATES_VERTICAL.howItWorks;

const STEP_CHIPS = [
  "Intake",
  "Richting",
  "Bouwen",
  "Live",
  "Groeien",
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;

export function PilatesHowItWorks() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const step = steps[active] ?? steps[0]!;

  return (
    <section
      className="relative overflow-hidden border-b border-slate-200 bg-slate-50"
      aria-labelledby="pilates-how-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-45"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,87,34,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,87,34,0.04) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF5722]">
            Werkwijze
          </p>
          <h2
            id="pilates-how-heading"
            className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl"
          >
            Snel. Persoonlijk. Duidelijk.
          </h2>
          <p className="mt-4 max-w-xl text-base text-slate-600">
            Intake past op één koffie. Daarna bouw ik door. Tik een stap, zie
            wat er gebeurt.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,380px)] lg:items-stretch">
          <Reveal className="h-full">
            <ol className="flex h-full flex-col gap-2.5">
              {steps.map((item, i) => {
                const selected = active === i;
                return (
                  <li key={item.title} className="flex-1">
                    <button
                      type="button"
                      onClick={() => setActive(i)}
                      onMouseEnter={() => setActive(i)}
                      className={
                        selected
                          ? "flex h-full w-full items-start gap-4 rounded-2xl border-2 border-slate-900 bg-slate-900 px-4 py-4 text-left text-white shadow-lg transition sm:px-5"
                          : "flex h-full w-full items-start gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left text-slate-900 transition hover:border-slate-300 sm:px-5"
                      }
                    >
                      <span
                        className={
                          selected
                            ? "mt-0.5 text-sm font-extrabold text-orange-300"
                            : "mt-0.5 text-sm font-extrabold text-[#FF5722]"
                        }
                        aria-hidden
                      >
                        {STEP_CHIPS[i] ?? String.fromCharCode(65 + i)}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-base font-extrabold tracking-tight sm:text-lg">
                          {item.title}
                        </span>
                        <span
                          className={
                            selected
                              ? "mt-1 block text-sm leading-relaxed text-slate-300 lg:hidden"
                              : "mt-1 block text-sm leading-relaxed text-slate-500 lg:hidden"
                          }
                        >
                          {item.body}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </Reveal>

          <Reveal delay={0.08} className="hidden h-full lg:block">
            <div className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_24px_50px_-28px_rgba(15,23,42,0.2)]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, ease: EASE }}
                  className="flex h-full flex-col"
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF5722]">
                    Stap {active + 1} van {steps.length}
                  </p>
                  <h3 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900">
                    {step.title}
                  </h3>
                  <p className="mt-4 flex-1 text-base leading-relaxed text-slate-600">
                    {step.body}
                  </p>
                  <a
                    href="#aanvraag"
                    className="mt-8 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FF5722] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#e64a19]"
                  >
                    Start met een intake
                    <ArrowRight className="size-4" aria-hidden />
                  </a>
                </motion.div>
              </AnimatePresence>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.12}>
          <a
            href="#aanvraag"
            className="mt-8 inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:border-[#FF5722] hover:text-[#FF5722] lg:hidden"
          >
            Start met een intake
            <ArrowRight className="size-4" aria-hidden />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
