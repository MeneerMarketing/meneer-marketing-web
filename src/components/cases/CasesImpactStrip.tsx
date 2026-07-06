"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { CASES_PAGE_IMPACT } from "@/data/cases-page";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Donkere strip: over Meneer + werkwijze (niet per case). */
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
          {CASES_PAGE_IMPACT.items.map((item, i) => (
            <motion.li
              key={item.id}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ delay: i * 0.08, duration: 0.45, ease: EASE }}
            >
              <Link
                href={item.href}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-[#FF5722]/35 hover:bg-white/[0.07]"
              >
                <div
                  className="absolute -right-6 -top-6 size-24 rounded-full bg-[#FF5722]/20 opacity-20 blur-2xl transition group-hover:opacity-40"
                  aria-hidden
                />
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                  {item.label}
                </p>
                <p className="mt-2 text-4xl font-black tracking-tight text-[#FF5722] sm:text-[2.75rem]">
                  {item.stat}
                </p>
                <p className="mt-2 text-pretty text-sm font-bold leading-snug text-slate-300">
                  {item.headline}
                </p>
                <p className="mt-3 flex-1 text-pretty text-xs leading-relaxed text-slate-500">
                  {item.body}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#FF5722] transition group-hover:gap-1.5">
                  {item.linkLabel}
                  <ArrowUpRight className="size-3.5" aria-hidden />
                </span>
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
