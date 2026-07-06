"use client";

import Link from "next/link";
import { FloatingTechBubbles } from "@/components/effects/FloatingTechBubbles";
import { LiquidCTA } from "@/components/effects/LiquidCTA";
import { LivingCloudGrid } from "@/components/effects/LivingCloudGrid";
import { Magnetic } from "@/components/effects/Magnetic";
import { HeroChatCard } from "@/components/home/HeroChatCard";
import { HOME_MOBILE_HERO } from "@/data/home-mobile";
import { siteCtas } from "@/lib/cta";

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden border-b border-slate-200 bg-white"
    >
      <LivingCloudGrid />

      <div className="relative z-10 mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-16 lg:px-8 lg:py-28">
        <div>
          <Magnetic strength={6} radius={180} wobble={false}>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF5722] lg:tracking-[0.26em]">
              <span className="lg:hidden">{HOME_MOBILE_HERO.eyebrow}</span>
              <span className="hidden lg:inline">Bouwen. Groeien. Winnen.</span>
            </p>
          </Magnetic>

          <h1
            id="hero-heading"
            className="mt-4 text-[2rem] font-extrabold leading-[1.08] tracking-tighter text-balance text-slate-900 sm:text-5xl sm:leading-[1.06] lg:mt-5 lg:text-6xl lg:leading-[1.02] lg:text-[4.25rem]"
          >
            <span className="lg:hidden">{HOME_MOBILE_HERO.title}</span>
            <span className="hidden lg:inline">Van site tot Google Ads.</span>
            <span className="mt-1.5 block text-[#FF5722] lg:mt-2">
              <span className="lg:hidden">{HOME_MOBILE_HERO.titleAccent}</span>
              <span className="hidden lg:inline">Ik regel het hele online plaatje.</span>
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed tracking-tight text-slate-600 lg:mt-7 lg:text-lg">
            <span className="lg:hidden">{HOME_MOBILE_HERO.body}</span>
            <span className="hidden lg:inline">
              Websites en Shopify-shops from scratch, gebouwd om te scoren. SEO, Google Ads,
              social en e-mail hang ik eraan vast. Jij focust op je bedrijf, ik op alles wat
              online moet scoren.
            </span>
          </p>

          <div className="mt-8 flex flex-col-reverse gap-3 lg:mt-10 lg:flex-row lg:flex-wrap lg:items-center lg:gap-4">
            <LiquidCTA
              href={siteCtas.startIntake.href}
              label="Plan een gesprek"
              className="w-full justify-center lg:w-auto"
            />
            <Magnetic strength={10} radius={160}>
              <Link
                href={siteCtas.projectStarten.href}
                className="group relative inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-300/70 bg-white/60 px-6 py-3.5 text-sm font-bold tracking-tight text-slate-900 backdrop-blur-md transition-[border-color,background-color,box-shadow] duration-300 hover:border-[#FF5722] hover:bg-orange-50/80 hover:text-[#FF5722] lg:w-auto lg:px-7 lg:py-4 lg:text-base"
              >
                <span>{siteCtas.projectStarten.label}</span>
                <svg
                  viewBox="0 0 24 24"
                  className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  aria-hidden
                >
                  <path
                    d="M5 12h14M13 5l7 7-7 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </Magnetic>
          </div>

          <div className="mt-8 lg:hidden">
            <HeroChatCard compact />
          </div>

          <dl className="mt-10 hidden grid-cols-3 gap-2 border-t border-slate-200 pt-8 text-xs tracking-tight sm:grid sm:gap-6 sm:text-sm lg:mt-14">
            <div className="min-w-0">
              <dt className="text-slate-500">Focus</dt>
              <dd className="mt-1 font-bold leading-snug text-slate-900">Snel · schaal</dd>
            </div>
            <div className="min-w-0">
              <dt className="text-slate-500">Stack</dt>
              <dd className="mt-1 font-bold leading-snug text-slate-900">
                Shopify · Next.js
              </dd>
            </div>
            <div className="min-w-0">
              <dt className="text-slate-500">Aanpak</dt>
              <dd className="mt-1 font-bold leading-snug text-slate-900">
                Nuchter · direct
              </dd>
            </div>
          </dl>
        </div>

        <div className="relative hidden items-center justify-center lg:flex lg:justify-end">
          <HeroChatCard />
        </div>
      </div>

      <FloatingTechBubbles count={8} className="opacity-80 lg:hidden" />
      <FloatingTechBubbles count={16} className="hidden lg:block" />
    </section>
  );
}
