"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
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
  /** Volledige titel. Gebruik `{accent: "..."}` voor gradient highlight */
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
  tone = "sky",
  stats,
  badges,
  anchorId = "formulier",
  primaryCtaLabel = "Vul het formulier",
  secondary,
}: ConversionHeroProps) {
  const reduce = useReducedMotion();

  return (
    <header className="relative isolate overflow-hidden border-b border-mm-border bg-mm-bg">
      <ConversionBackdrop tone={tone} />

      <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pb-24 sm:pt-20 lg:px-8 lg:pb-32 lg:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-3"
        >
          <span className="relative flex h-2 w-2">
            <span
              className={
                "absolute inline-flex h-full w-full rounded-full opacity-75 " +
                (reduce ? "" : "animate-ping ") +
                "bg-mm-sky"
              }
            />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-mm-sky-deep" />
          </span>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-mm-sky-deep">
            {eyebrow}
          </p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-4xl text-balance text-[2.6rem] font-extrabold leading-[1.02] tracking-tight text-mm-text sm:text-[3.4rem] lg:text-[4.2rem]"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-2xl text-lg leading-relaxed text-mm-muted sm:text-xl"
        >
          {intro}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <a
            href={`#${anchorId}`}
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-mm-text px-7 py-4 text-sm font-bold text-white shadow-[0_12px_40px_-8px_rgba(15,23,42,0.55)] transition hover:bg-mm-sky-deep"
          >
            <span className="relative z-[1]">{primaryCtaLabel}</span>
            <svg
              className="relative z-[1] size-4 transition-transform duration-300 group-hover:translate-x-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 -left-[30%] w-[40%] -skew-x-12 bg-gradient-to-r from-transparent via-white/35 to-transparent opacity-0 transition-all duration-700 group-hover:left-[110%] group-hover:opacity-100"
            />
          </a>
          {secondary}
        </motion.div>

        {badges && badges.length > 0 ? (
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-wrap gap-2"
          >
            {badges.map((b) => (
              <li
                key={b.label}
                className="inline-flex items-center gap-2 rounded-full border border-mm-border/80 bg-white/70 px-4 py-2 text-xs font-semibold text-mm-text shadow-[0_1px_0_rgba(255,255,255,0.7)_inset] backdrop-blur"
              >
                <span
                  aria-hidden
                  className="inline-flex size-3.5 items-center justify-center text-mm-sky-deep"
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
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.35 }}
            className="mt-12 grid max-w-2xl grid-cols-3 gap-4 rounded-2xl border border-mm-border/70 bg-white/60 p-4 shadow-mm-card backdrop-blur-md sm:p-6"
          >
            {stats.map((s) => (
              <div key={s.label} className="min-w-0">
                <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-mm-muted">
                  {s.label}
                </dt>
                <dd className="mt-1 truncate text-2xl font-black text-mm-text sm:text-3xl">
                  {s.value}
                </dd>
              </div>
            ))}
          </motion.dl>
        ) : null}
      </div>

      {/* Edge fade into next section */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-mm-bg"
      />
    </header>
  );
}
