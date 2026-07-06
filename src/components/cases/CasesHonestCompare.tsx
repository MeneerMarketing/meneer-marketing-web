"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check, X } from "lucide-react";
import Link from "next/link";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import { CASES_PAGE_HONEST } from "@/data/cases-page";
import { siteCtas } from "@/lib/cta";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Speelse vergelijking: agency vs Meneer Marketing. */
export function CasesHonestCompare() {
  const reduce = useReducedMotion();

  return (
    <section
      className="border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white"
      aria-labelledby="cases-honest-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#FF5722]">
            {CASES_PAGE_HONEST.eyebrow}
          </p>
          <h2
            id="cases-honest-heading"
            className="mt-3 text-pretty text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
          >
            {CASES_PAGE_HONEST.title}
          </h2>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-2 lg:gap-6">
          <motion.div
            initial={reduce ? false : { opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-8%" }}
            transition={{ duration: 0.45, ease: EASE }}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
              {CASES_PAGE_HONEST.notTitle}
            </p>
            <ul className="mt-5 space-y-3">
              {CASES_PAGE_HONEST.notItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                    <X className="size-3" strokeWidth={2.5} aria-hidden />
                  </span>
                  <span className="text-pretty text-sm leading-snug text-slate-500 line-through decoration-slate-300">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, x: 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-8%" }}
            transition={{ duration: 0.45, ease: EASE }}
            className="relative overflow-hidden rounded-2xl border border-[#FF5722]/25 bg-slate-900 p-6 shadow-[0_20px_48px_-24px_rgba(255,87,34,0.45)] sm:p-7"
          >
            <div
              className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-[#FF5722]/20 blur-2xl"
              aria-hidden
            />
            <p className="relative text-[10px] font-bold uppercase tracking-[0.16em] text-[#FF5722]">
              {CASES_PAGE_HONEST.welTitle}
            </p>
            <ul className="relative mt-5 space-y-3">
              {CASES_PAGE_HONEST.welItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#FF5722]/20 text-[#FF5722]">
                    <Check className="size-3" strokeWidth={2.5} aria-hidden />
                  </span>
                  <span className="text-pretty text-sm font-bold leading-snug text-slate-200">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.4, ease: EASE }}
          className="relative mx-auto mt-10 max-w-2xl rounded-2xl rounded-bl-sm border border-slate-200 bg-white p-5 pl-14 shadow-sm"
        >
          <InteractiveLogo className="absolute left-4 top-4 size-8 shrink-0" interactive={false} />
          <p className="text-pretty text-sm font-bold leading-snug text-slate-800">
            {CASES_PAGE_HONEST.meneerLine}
          </p>
          <Link
            href={siteCtas.contact.href}
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-[#FF5722] hover:underline"
          >
            Eerst praten
            <ArrowUpRight className="size-4" aria-hidden />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
