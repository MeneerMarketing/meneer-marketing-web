"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

import { Reveal } from "@/components/effects/Reveal";
import { HUIDKLINIEKEN_VERTICAL } from "@/data/verticals/huidklinieken";

const steps = HUIDKLINIEKEN_VERTICAL.howItWorks;

export function HuidkliniekHowItWorks() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  return (
    <section
      className="relative overflow-hidden border-b border-slate-200 bg-slate-50"
      aria-labelledby="Huidkliniek-how-heading"
    >
      <div className="relative mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF5722]">
            Werkwijze
          </p>
          <h2
            id="Huidkliniek-how-heading"
            className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl"
          >
            Snel. Persoonlijk. Duidelijk.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Intake past op één koffie. Daarna bouw ik door en weet jij steeds
            waar je aan toe bent.
          </p>
        </Reveal>

        <ol className="relative mt-10 pl-8 sm:pl-10">
          <div
            className="absolute left-[11px] top-2 bottom-8 w-px bg-slate-200 sm:left-[15px]"
            aria-hidden
          />
          <motion.div
            className="absolute left-[11px] top-2 w-px bg-[#FF5722] sm:left-[15px]"
            aria-hidden
            initial={false}
            animate={{
              height: `${((active + 1) / steps.length) * 88}%`,
            }}
            transition={
              reduce ? { duration: 0 } : { duration: 0.35, ease: [0.22, 1, 0.36, 1] }
            }
          />

          {steps.map((step, i) => {
            const selected = active === i;
            return (
              <li key={step.title} className="relative">
                <Reveal delay={i * 0.04}>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    onMouseEnter={() => {
                      if (!reduce) setActive(i);
                    }}
                    aria-pressed={selected}
                    className={
                      selected
                        ? "mb-2 block w-full rounded-2xl border border-[#FF5722]/30 bg-white px-5 py-4 text-left shadow-[0_16px_36px_-26px_rgba(15,23,42,0.35)] transition"
                        : "mb-2 block w-full rounded-2xl border border-transparent px-5 py-4 text-left transition hover:bg-white/70"
                    }
                  >
                    <span
                      className={
                        selected
                          ? "absolute -left-8 top-6 flex size-6 items-center justify-center rounded-full bg-[#FF5722] ring-4 ring-slate-50 sm:-left-10"
                          : "absolute -left-8 top-6 flex size-6 items-center justify-center rounded-full bg-white ring-4 ring-slate-50 sm:-left-10"
                      }
                      aria-hidden
                    >
                      <span
                        className={
                          selected
                            ? "size-2 rounded-full bg-white"
                            : "size-2 rounded-full bg-slate-300"
                        }
                      />
                    </span>

                    <span className="block text-lg font-extrabold tracking-tight text-slate-900">
                      {step.title}
                    </span>
                    <span
                      className={
                        selected
                          ? "mt-1.5 block text-sm leading-relaxed text-slate-600 sm:text-base"
                          : "mt-1.5 block text-sm leading-relaxed text-slate-500"
                      }
                    >
                      {step.body}
                    </span>
                  </button>
                </Reveal>
              </li>
            );
          })}
        </ol>

        <Reveal delay={0.12}>
          <a
            href="#aanvraag"
            className="group mt-6 inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#FF5722]"
          >
            Start met een intake
            <ArrowRight
              className="size-4 transition group-hover:translate-x-0.5"
              aria-hidden
            />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
