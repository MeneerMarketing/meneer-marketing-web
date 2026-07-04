"use client";

import Link from "next/link";
import { FloatingTechBubbles } from "@/components/effects/FloatingTechBubbles";
import { LiquidCTA } from "@/components/effects/LiquidCTA";
import { LivingCloudGrid } from "@/components/effects/LivingCloudGrid";
import { Magnetic } from "@/components/effects/Magnetic";
import { HeroCtaCard } from "@/components/home/HeroCtaCard";
import { GoogleWordmark } from "@/components/icons/GoogleWordmark";
import { siteCtas } from "@/lib/cta";

const HERO_SECONDARY = { label: "Bekijk de blauwdrukken", href: "/cases" };

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden border-b border-slate-200 bg-white"
    >
      <LivingCloudGrid />

      <div className="relative z-10 mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-16 lg:px-8 lg:py-28">
        <div>
          <Magnetic strength={6} radius={180} wobble={false}>
            <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#FF5722]">
              Bouwen. Groeien. Winnen.
            </p>
          </Magnetic>

          <h1
            id="hero-heading"
            className="mt-5 text-5xl font-extrabold leading-[1.06] tracking-tighter text-balance text-slate-900 sm:text-6xl sm:leading-[1.02] lg:text-[4.25rem]"
          >
            Van site tot <GoogleWordmark /> Ads.
            <span className="mt-2 block text-[#FF5722]">Ik regel het hele online plaatje.</span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-relaxed tracking-tight text-slate-600">
            Websites en Shopify-shops from scratch, gebouwd om te scoren.
            SEO, Google Ads, social en e-mail hangen we eraan vast. Zo groeit
            je bedrijf online zonder losse eindjes.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <LiquidCTA href={siteCtas.startIntake.href} label="Plan een gesprek" />
            <Magnetic strength={10} radius={160}>
              <Link
                href={HERO_SECONDARY.href}
                className="group relative inline-flex items-center gap-2 rounded-full border border-slate-300/70 bg-white/60 px-7 py-4 text-base font-bold tracking-tight text-slate-900 backdrop-blur-md transition-[border-color,background-color,box-shadow] duration-300 hover:border-slate-900 hover:bg-white"
              >
                <span>{HERO_SECONDARY.label}</span>
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

          <dl className="mt-14 grid grid-cols-3 gap-2 border-t border-slate-200 pt-8 text-xs tracking-tight sm:gap-6 sm:text-sm">
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

        <div className="relative flex items-center justify-center lg:justify-end">
          <HeroCtaCard />
        </div>
      </div>

      <FloatingTechBubbles count={14} />
    </section>
  );
}
