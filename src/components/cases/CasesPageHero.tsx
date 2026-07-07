"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { CasesHeroDesk } from "@/components/cases/CasesHeroDesk";
import { FloatingTechBubbles } from "@/components/effects/FloatingTechBubbles";
import { LiquidCTA } from "@/components/effects/LiquidCTA";
import { Magnetic } from "@/components/effects/Magnetic";
import { CASES_PAGE_HERO } from "@/data/cases-page";
import { siteCtas } from "@/lib/cta";

const EASE = [0.22, 1, 0.36, 1] as const;

export function CasesPageHero() {
  const reduce = useReducedMotion();

  return (
    <header className="relative overflow-x-clip border-b border-slate-800 bg-slate-950">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div
        className="pointer-events-none absolute -right-20 top-0 size-72 rounded-full bg-[#FF5722]/15 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12 lg:py-20">
        <div>
          <Magnetic strength={5} radius={160} wobble={false}>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#FF5722]">
              {CASES_PAGE_HERO.eyebrow}
            </p>
          </Magnetic>

          <h1 className="mt-4 max-w-3xl text-pretty text-[clamp(2rem,8vw,3.25rem)] font-extrabold leading-[1.05] tracking-tight text-white">
            {CASES_PAGE_HERO.title}{" "}
            <span className="text-[#FF5722]">{CASES_PAGE_HERO.titleAccent}</span>
          </h1>

          <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-slate-400">
            {CASES_PAGE_HERO.lead}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <LiquidCTA
              href={siteCtas.groeiscan.href}
              label={siteCtas.groeiscan.label}
              className="w-full justify-center sm:w-auto"
            />
            <Link
              href="/werkwijze"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/15 px-6 py-3.5 text-sm font-bold text-white transition hover:border-white/30 hover:bg-white/5 sm:w-auto"
            >
              Zo werk ik
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EASE }}
          className="mt-10 lg:mt-0"
        >
          <CasesHeroDesk />
        </motion.div>
      </div>

      <FloatingTechBubbles count={10} className="opacity-45" bareLogos />
    </header>
  );
}
