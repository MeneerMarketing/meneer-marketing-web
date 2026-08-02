"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { ConversionBackdrop, type BackdropTone } from "./ConversionBackdrop";

interface HeroStat {
  readonly value: string;
  readonly label: string;
}

interface HeroBadge {
  /** Pre-rendered JSX node (bijv. `<Sparkles className="size-3.5" />`). Voorkomt RSC serialisatie van component-refs. */
  readonly icon: ReactNode;
  readonly label: string;
}

export interface ConversionHeroProps {
  readonly eyebrow: string;
  readonly title: ReactNode;
  readonly intro: ReactNode;
  readonly tone?: BackdropTone;
  readonly stats?: readonly HeroStat[];
  readonly badges?: readonly HeroBadge[];
  readonly anchorId?: string;
  readonly primaryCtaLabel?: string;
  readonly secondary?: ReactNode;
}

export function ConversionHero({
  eyebrow,
  title,
  intro,
  tone = "accent",
  stats,
  badges,
  anchorId = "formulier",
  primaryCtaLabel = "Vul het formulier",
  secondary,
}: ConversionHeroProps) {
  const reduce = useReducedMotion();

  return (
    <header className="relative isolate overflow-hidden border-b border-slate-200 bg-white">
      <ConversionBackdrop tone={tone} />

      <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pb-24 sm:pt-20 lg:px-8 lg:pb-28 lg:pt-24">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF5722]">
            {eyebrow}
          </p>
        </motion.div>

        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 max-w-4xl text-pretty text-4xl font-extrabold leading-[1.05] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-slate-600"
        >
          {intro}
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <a
            href={`#${anchorId}`}
            className="inline-flex items-center gap-2 rounded-full bg-[#FF5722] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-600"
          >
            {primaryCtaLabel}
            <ArrowUpRight className="size-4" aria-hidden />
          </a>
          {secondary}
        </motion.div>

        {badges && badges.length > 0 ? (
          <motion.ul
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.22 }}
            className="mt-10 flex flex-wrap gap-2"
          >
            {badges.map((b) => (
              <li
                key={b.label}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700"
              >
                <span
                  aria-hidden
                  className="inline-flex size-3.5 items-center justify-center text-[#FF5722]"
                >
                  {b.icon}
                </span>
                {b.label}
              </li>
            ))}
          </motion.ul>
        ) : null}

        {stats && stats.length > 0 ? (
          <motion.dl
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.28 }}
            className="mt-12 grid max-w-2xl grid-cols-3 gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
          >
            {stats.map((s) => (
              <div key={s.label} className="min-w-0">
                <dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  {s.label}
                </dt>
                <dd className="mt-1 truncate text-2xl font-black text-slate-900 sm:text-3xl">
                  {s.value}
                </dd>
              </div>
            ))}
          </motion.dl>
        ) : null}
      </div>
    </header>
  );
}
