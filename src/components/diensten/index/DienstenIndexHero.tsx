"use client";

import { ArrowUpRight } from "lucide-react";
import { FloatingTechBubbles } from "@/components/effects/FloatingTechBubbles";
import { LiquidCTA } from "@/components/effects/LiquidCTA";
import { LivingCloudGrid } from "@/components/effects/LivingCloudGrid";
import { Magnetic } from "@/components/effects/Magnetic";
import { DienstenServiceChat } from "@/components/diensten/index/DienstenServiceChat";
import {
  DIENSTEN_EXPERT_SUMMARY,
  DIENSTEN_HUB_HERO,
} from "@/data/diensten-hub";
import { siteCtas } from "@/lib/cta";

export function DienstenIndexHero() {
  return (
    <header className="relative isolate overflow-hidden border-b border-slate-200 bg-white">
      <LivingCloudGrid />

      <div className="relative z-10 mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-14 lg:px-8 lg:py-24">
        <div>
          <Magnetic strength={6} radius={180} wobble={false}>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF5722] lg:tracking-[0.26em]">
              {DIENSTEN_HUB_HERO.eyebrow}
            </p>
          </Magnetic>

          <h1 className="mt-4 text-[2rem] font-extrabold leading-[1.08] tracking-tighter text-balance text-slate-900 sm:text-5xl lg:text-[3.5rem] lg:leading-[1.04]">
            {DIENSTEN_HUB_HERO.title}
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed tracking-tight text-slate-600 lg:mt-6 lg:text-lg">
            {DIENSTEN_HUB_HERO.subtitle}
          </p>

          <p
            id="diensten-expert-summary"
            className="mt-4 max-w-xl text-sm font-medium leading-relaxed text-slate-500"
          >
            {DIENSTEN_EXPERT_SUMMARY}
          </p>

          <div className="mt-8 flex flex-col-reverse gap-3 lg:mt-10 lg:flex-row lg:flex-wrap lg:items-center lg:gap-4">
            <LiquidCTA href={siteCtas.startIntake.href} label={siteCtas.startIntake.label} />
            <Magnetic strength={10} radius={160}>
              <a
                href="#diensten-vijf"
                className="group relative inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-300/70 bg-white/60 px-6 py-3.5 text-sm font-bold tracking-tight text-slate-900 backdrop-blur-md transition hover:border-[#FF5722] hover:bg-orange-50/80 hover:text-[#FF5722] lg:w-auto lg:px-7 lg:py-4"
              >
                Scroll het aanbod
                <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
              </a>
            </Magnetic>
          </div>

          <div className="mt-8 lg:hidden">
            <DienstenServiceChat />
          </div>

          <dl className="mt-10 grid grid-cols-3 gap-2 border-t border-slate-200 pt-8 text-xs tracking-tight sm:gap-5 sm:text-sm lg:mt-14">
            {DIENSTEN_HUB_HERO.stats.map((stat) => (
              <div key={stat.label} className="min-w-0">
                <dt className="font-bold uppercase tracking-wider text-slate-500">
                  {stat.label}
                </dt>
                <dd className="mt-1 font-extrabold leading-snug text-slate-900 sm:text-base">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative hidden items-center justify-center lg:flex lg:justify-end">
          <DienstenServiceChat />
        </div>
      </div>

      <FloatingTechBubbles count={8} className="opacity-70 lg:hidden" />
      <FloatingTechBubbles count={14} className="hidden opacity-80 lg:block" />
    </header>
  );
}
