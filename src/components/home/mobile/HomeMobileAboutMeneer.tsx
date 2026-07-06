"use client";

import Link from "next/link";
import { ArrowUpRight, TrendingUp } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { AboutMeneerJourneyList } from "@/components/home/AboutMeneerJourneyList";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import {
  HOME_ABOUT_MENEER,
  type AboutMeneerChannelChoice,
} from "@/data/home-about-meneer";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Persoonlijk Meneer-moment: verhaal, samen kiezen, dopamine. */
export function HomeMobileAboutMeneer() {
  const reduce = useReducedMotion();
  const [channel, setChannel] = useState<AboutMeneerChannelChoice | null>(null);

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
          <AboutMeneerJourneyList steps={HOME_ABOUT_MENEER.journey} showTargetOnLast />
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
          <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
            {HOME_ABOUT_MENEER.channelHint}
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            {HOME_ABOUT_MENEER.channelChoices.map((c) => {
              const active = channel?.id === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setChannel(active ? null : c)}
                  className={`rounded-full border px-3 py-1.5 text-[11px] font-extrabold tracking-tight transition-all duration-300 ${
                    active
                      ? "border-[#FF5722] bg-[#FF5722] text-white shadow-md shadow-[#FF5722]/25"
                      : "border-slate-200 bg-white text-slate-700 hover:border-[#FF5722]/40"
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {channel ? (
              <motion.div
                key={channel.id}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="mt-3 rounded-2xl border border-[#FF5722]/25 bg-orange-50/80 px-4 py-3"
              >
                <div className="flex items-start gap-2.5">
                  <InteractiveLogo className="size-7 shrink-0" interactive={false} />
                  <p className="text-pretty text-sm font-bold leading-snug text-slate-800">
                    {channel.meneer}
                  </p>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8%" }}
          transition={{ delay: 0.12, duration: 0.45, ease: EASE }}
          className="relative mt-8 overflow-hidden rounded-2xl border border-slate-900/10 bg-slate-950 px-4 py-4 text-white"
        >
          <div
            className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-[#FF5722]/25 blur-2xl"
            aria-hidden
          />
          <div className="relative flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#FF5722]/20 text-[#FF5722]">
              <TrendingUp className="size-5" strokeWidth={2.5} aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#FF5722]">
                {HOME_ABOUT_MENEER.dopamine.label}
              </p>
              <p className="mt-1 text-pretty text-sm font-extrabold leading-snug">
                {HOME_ABOUT_MENEER.dopamine.body}
              </p>
              <p className="mt-2 text-pretty text-[12px] font-medium leading-relaxed text-white/55">
                {HOME_ABOUT_MENEER.dopamine.punchline}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.14, duration: 0.4 }}
          className="mt-6 rounded-2xl border border-slate-200/90 bg-white px-4 py-3 text-pretty text-sm font-bold leading-snug text-slate-800"
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
