"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import {
  CAMPAGNES_CHANNEL_BUBBLES,
  HomeCampagnesVisual,
} from "@/components/home/shared/HomeCampagnesVisual";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import { HOME_MOBILE_CHAPTER_CAMPAGNES } from "@/data/home-mobile-editorial";
import { siteCtas } from "@/lib/cta";

const EASE = [0.22, 1, 0.36, 1] as const;
const chapter = HOME_MOBILE_CHAPTER_CAMPAGNES;

type Channel = keyof typeof CAMPAGNES_CHANNEL_BUBBLES;

/** Desktop: campagnes-sectie met Google/Meta toggle (zelfde stijl als mobiel). */
export function HomeWhyMeneerSection() {
  const reduce = useReducedMotion();
  const [channel, setChannel] = useState<Channel>("google");

  return (
    <section
      aria-labelledby="home-why-meneer-heading"
      className="relative overflow-x-clip border-b border-slate-800 bg-[#0B1220]"
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
        className="pointer-events-none absolute -right-20 top-0 size-72 rounded-full bg-[#FF5722]/10 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-stretch lg:gap-14">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.45, ease: EASE }}
            className="flex flex-col"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#FF5722]">
              {chapter.eyebrow}
            </p>
            <h2
              id="home-why-meneer-heading"
              className="mt-4 text-pretty text-3xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-4xl"
            >
              {chapter.title}
            </h2>
            <p className="mt-5 max-w-lg text-pretty text-base leading-relaxed text-slate-400">
              {chapter.body}
            </p>

            <div className="relative mt-7 overflow-hidden rounded-2xl bg-white/[0.05] px-4 py-4 ring-1 ring-white/[0.08] sm:px-5 sm:py-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#FF5722]">
                Heet take
              </p>
              <p className="mt-2 text-pretty text-sm font-bold leading-snug text-white/95 sm:text-base">
                {chapter.hotTake}
              </p>
            </div>

            {chapter.inlineProof ? (
              <p className="mt-5 text-pretty text-sm text-slate-500">{chapter.inlineProof}</p>
            ) : null}

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href={chapter.href}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[#FF5722] transition hover:gap-2"
              >
                {chapter.linkLabel}
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
              <Link
                href={siteCtas.startIntake.href}
                className="inline-flex items-center gap-2 rounded-full bg-[#FF5722] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#FF5722]/25 transition hover:bg-orange-600"
              >
                Plan een gesprek
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={channel}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.28, ease: EASE }}
                className="mt-8 flex items-start gap-2.5 lg:mt-auto lg:pt-8"
              >
                <InteractiveLogo className="size-9 shrink-0" interactive={false} />
                <p className="rounded-2xl rounded-bl-sm bg-white/[0.08] px-4 py-3 text-sm font-bold leading-snug text-white/90">
                  {CAMPAGNES_CHANNEL_BUBBLES[channel]}
                </p>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8%" }}
            transition={{ duration: 0.45, delay: 0.06, ease: EASE }}
            className="self-center rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-5 shadow-[0_24px_56px_-26px_rgba(0,0,0,0.55)] sm:p-6 lg:self-start lg:p-6"
          >
            <HomeCampagnesVisual
              size="desktop"
              bubblePlacement="external"
              channel={channel}
              onChannelChange={setChannel}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
