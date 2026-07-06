import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/effects/Reveal";
import { DienstenHeroFactStack } from "@/components/diensten/index/DienstenHeroFactStack";
import { DIENSTEN_EXPERT_SUMMARY, DIENSTEN_HERO } from "@/data/diensten-index";
import { siteCtas } from "@/lib/cta";

export function DienstenIndexHero() {
  return (
    <header className="relative overflow-hidden border-b border-slate-200 bg-white">
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:48px_48px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-[#FF5722]/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-[#00BCD4]/8 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(300px,360px)] lg:items-stretch lg:gap-12">
          <div className="min-w-0">
            <Reveal>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF5722]">
                {DIENSTEN_HERO.eyebrow}
              </p>
              <h1 className="mt-4 max-w-4xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-[3.25rem] lg:leading-[1.05]">
                {DIENSTEN_HERO.title}{" "}
                <span className="text-[#FF5722]">{DIENSTEN_HERO.titleAccent}</span>
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
                {DIENSTEN_HERO.subtitle}
              </p>

              <p
                id="diensten-expert-summary"
                className="mt-4 max-w-2xl text-sm font-medium leading-relaxed text-slate-500"
              >
                {DIENSTEN_EXPERT_SUMMARY}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href={siteCtas.startIntake.href}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FF5722] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#FF5722]/25 transition hover:bg-orange-600"
                >
                  {siteCtas.startIntake.label}
                  <ArrowUpRight className="size-4" aria-hidden />
                </Link>
                <a
                  href="#vijf-blokken"
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-900 transition hover:border-slate-900"
                >
                  Bekijk de vijf blokken
                  <ArrowUpRight className="size-4" aria-hidden />
                </a>
              </div>

              <dl className="mt-12 grid grid-cols-3 gap-2 border-t border-slate-200 pt-8 text-xs tracking-tight sm:gap-5 sm:text-sm">
                {DIENSTEN_HERO.stats.map((stat) => (
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
            </Reveal>
          </div>

          <Reveal className="mt-10 lg:mt-0 lg:flex lg:h-full lg:flex-col" delay={0.1}>
            <DienstenHeroFactStack />
          </Reveal>
        </div>
      </div>
    </header>
  );
}
