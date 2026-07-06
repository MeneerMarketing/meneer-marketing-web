"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { AboutMeneerStrategyChat } from "@/components/home/AboutMeneerStrategyChat";
import { AboutMeneerStrategyOutcome } from "@/components/home/AboutMeneerStrategyOutcome";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import {
  HOME_ABOUT_MENEER,
  HOME_ABOUT_MENEER_STRATEGY_CHAT,
} from "@/data/home-about-meneer";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Persoonlijk Meneer-moment: verhaal, samen kiezen, dopamine. */
export function HomeMobileAboutMeneer() {
  const reduce = useReducedMotion();
  const [strategyReady, setStrategyReady] = useState(reduce);

  return (
    <section
      id="over-meneer"
      aria-labelledby="mobile-about-meneer-title"
      className="relative overflow-x-clip border-b border-slate-200 bg-gradient-to-b from-white to-orange-50/40 py-16"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,87,34,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,87,34,0.06) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative mx-auto w-full min-w-0 max-w-6xl px-4">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.4, ease: EASE }}
          className="flex items-start gap-3"
        >
          <InteractiveLogo className="size-11 shrink-0" interactive={false} />
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#FF5722]">
              {HOME_ABOUT_MENEER.eyebrow}
            </p>
            <h2
              id="mobile-about-meneer-title"
              className="mt-2 text-pretty text-[clamp(1.65rem,7.5vw,2.1rem)] font-extrabold leading-[1.08] tracking-tight text-slate-900"
            >
              {HOME_ABOUT_MENEER.title}
            </h2>
          </div>
        </motion.div>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ delay: 0.05, duration: 0.45, ease: EASE }}
          className="mt-4 text-pretty text-[15px] leading-[1.65] text-slate-600"
        >
          {HOME_ABOUT_MENEER.intro}
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8%" }}
          transition={{ delay: 0.08, duration: 0.45, ease: EASE }}
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

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8%" }}
          transition={{ delay: 0.1, duration: 0.45, ease: EASE }}
          className="mt-8"
        >
          <p className="text-sm font-extrabold tracking-tight text-slate-900">
            {HOME_ABOUT_MENEER.collabTitle}
          </p>
          <p className="mt-2 text-pretty text-[13px] leading-relaxed text-slate-600">
            {HOME_ABOUT_MENEER.collabBody}
          </p>
        </motion.div>

        <div className="mt-6">
          <AboutMeneerStrategyOutcome visible={strategyReady} />
        </div>

        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.12, duration: 0.4 }}
          className="mt-8 rounded-2xl border border-slate-200/90 bg-white px-4 py-3 text-pretty text-sm font-bold leading-snug text-slate-800"
        >
          &ldquo;{HOME_ABOUT_MENEER.quote}&rdquo;
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.16, duration: 0.4, ease: EASE }}
          className="mt-6"
        >
          <Link
            href={HOME_ABOUT_MENEER.ctaHref}
            className="group inline-flex items-center gap-2 text-sm font-extrabold tracking-tight text-[#FF5722]"
          >
            {HOME_ABOUT_MENEER.ctaLabel}
            <ArrowUpRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
