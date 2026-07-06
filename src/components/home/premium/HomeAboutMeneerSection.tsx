"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { AboutMeneerStrategyChat } from "@/components/home/AboutMeneerStrategyChat";
import { AboutMeneerStrategyOutcome } from "@/components/home/AboutMeneerStrategyOutcome";
import {
  HOME_ABOUT_MENEER,
  HOME_ABOUT_MENEER_STRATEGY_CHAT,
} from "@/data/home-about-meneer";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Desktop: persoonlijk Meneer-verhaal op de homepage. */
export function HomeAboutMeneerSection() {
  const reduce = useReducedMotion();
  const [strategyReady, setStrategyReady] = useState(reduce);

  return (
    <section
      aria-labelledby="home-about-meneer-title"
      className="relative overflow-x-clip border-b border-slate-200 bg-gradient-to-b from-white via-orange-50/30 to-white py-16 lg:py-20"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,87,34,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,87,34,0.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start lg:gap-14">
          <div>
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF5722]">
                {HOME_ABOUT_MENEER.eyebrow}
              </p>
              <h2
                id="home-about-meneer-title"
                className="mt-4 max-w-xl text-pretty text-3xl font-extrabold tracking-tight text-slate-900 lg:text-4xl lg:leading-[1.08]"
              >
                {HOME_ABOUT_MENEER.title}
              </h2>
              <p className="mt-4 max-w-lg text-pretty text-base leading-relaxed text-slate-600">
                {HOME_ABOUT_MENEER.intro}
              </p>
            </motion.div>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ delay: 0.06, duration: 0.45, ease: EASE }}
              className="mt-8"
            >
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Zo klinkt zo&apos;n gesprek
              </p>
              <AboutMeneerStrategyChat
                messages={HOME_ABOUT_MENEER_STRATEGY_CHAT}
                onComplete={() => setStrategyReady(true)}
              />
            </motion.div>
          </div>

          <div className="space-y-5">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ delay: 0.08, duration: 0.45, ease: EASE }}
              className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm"
            >
              <p className="text-lg font-extrabold tracking-tight text-slate-900">
                {HOME_ABOUT_MENEER.collabTitle}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {HOME_ABOUT_MENEER.collabBody}
              </p>
              <p className="mt-4 text-sm font-bold leading-snug text-slate-800">
                Geen kanaal omdat het hip is. Wel omdat het bij jouw fase past.
              </p>
            </motion.div>

            <AboutMeneerStrategyOutcome visible={strategyReady} />

            <motion.div
              initial={reduce ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="rounded-2xl border border-slate-200/90 bg-white px-4 py-3"
            >
              <p className="text-pretty text-sm font-bold leading-snug text-slate-800">
                &ldquo;{HOME_ABOUT_MENEER.quote}&rdquo;
              </p>
            </motion.div>

            <motion.div
              initial={reduce ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.12, duration: 0.4 }}
              className="flex flex-wrap items-center justify-end gap-4"
            >
              <Link
                href={HOME_ABOUT_MENEER.ctaHref}
                className="group inline-flex shrink-0 items-center gap-2 rounded-full border-2 border-slate-900 px-5 py-2.5 text-sm font-bold text-slate-900 transition hover:bg-slate-900 hover:text-white"
              >
                {HOME_ABOUT_MENEER.ctaLabel}
                <ArrowUpRight
                  className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden
                />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
