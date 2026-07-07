"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { LiquidCTA } from "@/components/effects/LiquidCTA";
import { Reveal } from "@/components/effects/Reveal";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import { DIENSTEN_HUB_CTA } from "@/data/diensten-hub";
import { siteCtas } from "@/lib/cta";

export function DienstenIndexCta() {
  return (
    <section className="relative overflow-hidden bg-slate-950">
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,87,34,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,87,34,0.04)_1px,transparent_1px)] bg-[size:32px_32px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-48 w-96 -translate-x-1/2 rounded-full bg-[#FF5722]/15 blur-3xl"
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <Reveal>
          <InteractiveLogo className="mx-auto h-16 w-16" />
          <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.22em] text-[#FF5722]">
            {DIENSTEN_HUB_CTA.eyebrow}
          </p>
          <h2 className="mt-3 text-balance text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">
            {DIENSTEN_HUB_CTA.title}{" "}
            <span className="text-[#FF5722]">{DIENSTEN_HUB_CTA.titleAccent}</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-slate-300">
            {DIENSTEN_HUB_CTA.body}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
            <LiquidCTA href={siteCtas.startIntake.href} label={siteCtas.startIntake.label} />
            <Link
              href="/werkwijze"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-7 py-4 text-sm font-bold text-white transition hover:border-white/30 hover:bg-white/5"
            >
              Zo werk ik
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
