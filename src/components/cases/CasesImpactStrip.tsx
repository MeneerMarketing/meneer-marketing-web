"use client";

import { motion, useReducedMotion } from "framer-motion";
import { HOME_CASES } from "@/data/home-cases";
import { CASES_PAGE_IMPACT } from "@/data/cases-page";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Donkere impact-strip met metrics per case. */
export function CasesImpactStrip() {
  const reduce = useReducedMotion();

  return (
    <section
      className="relative overflow-hidden border-y border-slate-800 bg-slate-950"
      aria-labelledby="cases-impact-heading"
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
        className="pointer-events-none absolute -left-24 top-1/2 size-64 -translate-y-1/2 rounded-full bg-[#FF5722]/12 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        <p className="text-center text-[11px] font-bold uppercase tracking-[0.2em] text-[#FF5722]">
          {CASES_PAGE_IMPACT.eyebrow}
        </p>
        <h2
          id="cases-impact-heading"
          className="mt-3 text-center text-pretty text-2xl font-extrabold tracking-tight text-white sm:text-3xl"
        >
          {CASES_PAGE_IMPACT.title}
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-center text-pretty text-sm leading-relaxed text-slate-400 sm:text-base">
          {CASES_PAGE_IMPACT.lead}
        </p>

        <ul className="mt-10 grid gap-4 sm:grid-cols-3">
          {HOME_CASES.map((c, i) => (
            <motion.li
              key={c.id}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ delay: i * 0.08, duration: 0.45, ease: EASE }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-white/20 hover:bg-white/[0.07]"
            >
              <div
                className="absolute -right-6 -top-6 size-24 rounded-full opacity-20 blur-2xl transition group-hover:opacity-35"
                style={{ backgroundColor: c.palette.accent }}
                aria-hidden
              />
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                {c.client}
              </p>
              <p
                className="mt-2 text-4xl font-black tracking-tight sm:text-[2.75rem]"
                style={{ color: c.palette.accent }}
              >
                {c.metric}
              </p>
              <p className="mt-2 text-pretty text-sm font-bold leading-snug text-slate-300">
                {c.metricHint}
              </p>
              <p className="mt-3 text-pretty text-xs leading-relaxed text-slate-500">
                {c.homeHook}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
