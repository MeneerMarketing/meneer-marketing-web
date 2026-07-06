"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { HomeMobileCampagnesVisual } from "@/components/home/mobile/HomeMobileCampagnesVisual";
import { HomeMobilePillarScene } from "@/components/home/mobile/HomeMobilePillarScene";
import { HomeMobileVindbaarheidVisual } from "@/components/home/mobile/HomeMobileVindbaarheidVisual";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import type { MobileChapter } from "@/data/home-mobile-editorial";

const EASE = [0.22, 1, 0.36, 1] as const;

const THEME_STYLES = {
  dark: {
    section: "bg-slate-950 border-slate-800",
    eyebrow: "text-[#FF5722]",
    title: "text-white",
    body: "text-slate-400",
    proof: "text-slate-500",
    illoWrap: "border-white/10 bg-white/[0.04] shadow-[0_24px_60px_-28px_rgba(0,0,0,0.65)]",
    hotTake: "relative overflow-hidden bg-white/[0.06] text-white/95 ring-1 ring-white/[0.08]",
    hotTakeLabel: "text-[#FF5722]",
    link: "text-[#FF5722]",
  },
  light: {
    section: "bg-white border-slate-200",
    eyebrow: "text-[#FF5722]",
    title: "text-slate-900",
    body: "text-slate-600",
    proof: "text-slate-500",
    illoWrap:
      "border-slate-200/90 bg-gradient-to-b from-slate-50 to-white shadow-[0_20px_50px_-24px_rgba(15,23,42,0.14)]",
    hotTake: "relative overflow-hidden bg-orange-50/80 text-slate-800 ring-1 ring-orange-100",
    hotTakeLabel: "text-[#FF5722]",
    link: "text-[#FF5722]",
  },
  midnight: {
    section: "bg-[#0B1220] border-slate-800",
    eyebrow: "text-[#FF5722]",
    title: "text-white",
    body: "text-slate-400",
    proof: "text-slate-500",
    illoWrap: "border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent shadow-[0_24px_56px_-26px_rgba(0,0,0,0.55)]",
    hotTake: "relative overflow-hidden bg-white/[0.05] text-white/95 ring-1 ring-white/[0.08]",
    hotTakeLabel: "text-[#FF5722]",
    link: "text-[#FF5722]",
  },
} as const;

interface HomeMobileChapterProps {
  chapter: MobileChapter;
}

/** Editorial themahoofdstuk: typografie, illustratie, heet take, inline proof. */
export function HomeMobileChapter({ chapter }: HomeMobileChapterProps) {
  const reduce = useReducedMotion();
  const t = THEME_STYLES[chapter.theme];

  return (
    <section
      id={chapter.id}
      aria-labelledby={`chapter-${chapter.id}-title`}
      className={`overflow-x-clip border-b py-14 ${t.section}`}
    >
      <div className="mx-auto w-full min-w-0 max-w-6xl px-4">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.4, ease: EASE }}
          className={`text-[11px] font-bold uppercase tracking-[0.22em] ${t.eyebrow}`}
        >
          {chapter.eyebrow}
        </motion.p>

        <motion.h2
          id={`chapter-${chapter.id}-title`}
          initial={reduce ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ delay: 0.05, duration: 0.45, ease: EASE }}
          className={`mt-4 text-pretty text-[1.65rem] font-extrabold leading-[1.1] tracking-tight ${t.title}`}
        >
          {chapter.title}
        </motion.h2>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ delay: 0.1, duration: 0.45, ease: EASE }}
          className={`mt-4 text-pretty text-[15px] leading-[1.65] tracking-tight ${t.body}`}
        >
          {chapter.body}
        </motion.p>

        {/* Illustratie: zelfde kolombreedte als copy */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8%" }}
          transition={{ delay: 0.12, duration: 0.45, ease: EASE }}
          className={`mt-6 w-full min-w-0 ${
            chapter.visual === "vindbaarheid-dual" || chapter.visual === "campagnes-dual"
              ? ""
              : `flex h-[11.5rem] max-w-[17.5rem] items-center justify-center rounded-[1.35rem] border ${t.illoWrap}`
          }`}
        >
          {chapter.visual === "vindbaarheid-dual" ? (
            <HomeMobileVindbaarheidVisual />
          ) : chapter.visual === "campagnes-dual" ? (
            <HomeMobileCampagnesVisual />
          ) : (
            <motion.div
              animate={reduce ? undefined : { y: [0, -4, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              className="flex w-full items-center justify-center px-6"
            >
              <HomeMobilePillarScene
                pillarId={chapter.pillarId}
                className="h-[5.25rem] w-full max-w-[160px]"
              />
            </motion.div>
          )}
        </motion.div>

        {/* Heet take met Meneer-mini */}
        <motion.div
          initial={reduce ? false : { opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-8%" }}
          transition={{ delay: 0.15, duration: 0.45, ease: EASE }}
          className={`mt-6 rounded-2xl px-4 py-4 pt-5 ${t.hotTake}`}
        >
          <div
            className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-[#FF5722]/70 to-transparent"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute left-1/2 top-0 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF5722] shadow-[0_0_14px_rgba(255,87,34,0.65)]"
            aria-hidden
          />
          <div className="flex items-start gap-3">
            <InteractiveLogo className="mt-0.5 size-8 shrink-0" interactive={false} />
            <div className="min-w-0 flex-1">
              <p className={`text-[10px] font-bold uppercase tracking-[0.16em] ${t.hotTakeLabel}`}>
                Heet take
              </p>
              <p className="mt-1.5 text-pretty text-sm font-bold leading-snug tracking-tight">
                {chapter.hotTake}
              </p>
            </div>
          </div>
        </motion.div>

        {chapter.inlineProof ? (
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className={`mt-4 text-xs leading-relaxed ${t.proof}`}
          >
            <span className="font-bold text-inherit opacity-80">In de praktijk: </span>
            {chapter.inlineProof}
          </motion.p>
        ) : null}

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.22, duration: 0.4, ease: EASE }}
          className="mt-6"
        >
          <Link
            href={chapter.href}
            className={`group inline-flex items-center gap-2 text-sm font-extrabold tracking-tight ${t.link}`}
          >
            {chapter.linkLabel}
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
