import Link from "next/link";
import { ArrowUpRight, Quote, Sparkles, Target } from "lucide-react";
import { Reveal } from "@/components/effects/Reveal";
import { DienstFAQ } from "@/components/diensten/DienstFAQ";
import { ApproachPath } from "@/components/diensten/premium/ApproachPath";
import { HeroBuildWindow } from "@/components/diensten/premium/HeroBuildWindow";
import { OutcomeCards } from "@/components/diensten/premium/OutcomeCards";
import { PremiumSidebar } from "@/components/diensten/premium/PremiumSidebar";
import { SignalsScan } from "@/components/diensten/premium/SignalsScan";
import { TickerBand } from "@/components/diensten/premium/TickerBand";
import type { DienstBody } from "@/data/dienst-content";
import type { DienstExtra } from "@/data/dienst-extras";
import {
  STRATEGY_MANIFESTO,
  type DienstStrategicContent,
} from "@/data/dienst-strategic";
import type { DienstDetail } from "@/lib/diensten";
import { ctaNav } from "@/lib/navigation";
import { siteCtas } from "@/lib/cta";

interface ApproachStepData {
  title: string;
  body: string;
}

interface DienstPremiumViewProps {
  dienst: DienstDetail;
  /** Route van de blok-landingspagina, bijv. /bouwen */
  pillarHref: string;
  body: DienstBody;
  extra: DienstExtra | null;
  strategic: DienstStrategicContent & { pillarLens: string };
  related: DienstDetail[];
  /** Hero-onderregel met punch, korter dan de meta-description */
  heroKicker: string;
  /** Onverwacht feitje of harde waarheid als pull-quote */
  funFact: string;
  funFactSource: string;
  approachSteps: ApproachStepData[];
  tickerItems: string[];
  heroStats: { label: string; value: string }[];
}

export function DienstPremiumView({
  dienst,
  pillarHref,
  body,
  extra,
  strategic,
  related,
  heroKicker,
  funFact,
  funFactSource,
  approachSteps,
  tickerItems,
  heroStats,
}: DienstPremiumViewProps) {
  return (
    <article>
      {/* Hero */}
      <header className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.035)_1px,transparent_1px)] bg-[size:44px_44px]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent"
          aria-hidden
        />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-14 lg:px-8 lg:py-20">
          <div>
            <nav
              className="text-xs font-semibold text-slate-400"
              aria-label="Broodkruimel"
            >
              <ol className="flex flex-wrap items-center gap-1.5">
                <li>
                  <Link href="/" className="transition-colors hover:text-slate-900">
                    Home
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li>
                  <Link
                    href="/diensten"
                    className="transition-colors hover:text-slate-900"
                  >
                    Diensten
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li className="text-slate-900">{dienst.name}</li>
              </ol>
            </nav>

            <p className="mt-7 inline-flex items-center gap-2 rounded-full border border-[#FF5722]/25 bg-[#FF5722]/5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-[#FF5722]">
              <Sparkles className="size-3.5" aria-hidden />
              {dienst.pillar} · {dienst.pillarSubtitle}
            </p>

            <h1 className="mt-5 text-balance text-4xl font-extrabold leading-[1.05] tracking-tighter text-slate-900 sm:text-5xl lg:text-[3.6rem]">
              {dienst.name}
            </h1>
            <p className="mt-5 max-w-xl text-balance text-xl font-medium leading-relaxed text-slate-600">
              {heroKicker}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href={ctaNav.href}
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-slate-900 px-7 py-4 text-base font-bold tracking-tight text-white transition hover:shadow-lg"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 origin-bottom translate-y-full bg-[#FF5722] transition-transform duration-[550ms] ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:translate-y-0"
                />
                <span className="relative z-10">{ctaNav.label}</span>
                <ArrowUpRight className="relative z-10 size-4" aria-hidden />
              </Link>
              <Link
                href={siteCtas.groeiscan.href}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300/80 bg-white/70 px-7 py-4 text-base font-bold tracking-tight text-slate-900 backdrop-blur transition hover:border-slate-900"
              >
                {siteCtas.groeiscan.label}
              </Link>
            </div>

            <dl className="mt-11 grid max-w-lg grid-cols-3 gap-5 border-t border-slate-200 pt-7 text-sm tracking-tight">
              {heroStats.map((stat) => (
                <div key={stat.label}>
                  <dt className="text-slate-500">{stat.label}</dt>
                  <dd className="mt-1 font-bold text-slate-900">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative hidden lg:block">
            <HeroBuildWindow />
          </div>
        </div>
      </header>

      <TickerBand items={tickerItems} />

      {/* Body */}
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_330px] lg:items-start lg:gap-14">
          <div className="min-w-0">
            <Reveal>
              <p className="max-w-2xl text-balance text-xl leading-relaxed text-slate-800 sm:text-2xl sm:leading-relaxed">
                {body.intro}
              </p>
            </Reveal>

            {/* Fun fact pull-quote */}
            <Reveal delay={0.05}>
              <figure className="relative mt-12 overflow-hidden rounded-3xl bg-slate-900 p-7 text-white sm:p-9">
                <div
                  className="pointer-events-none absolute -right-12 -top-12 size-44 rounded-full bg-[#FF5722]/20 blur-3xl"
                  aria-hidden
                />
                <Quote
                  className="size-8 text-[#FF5722]"
                  aria-hidden
                  strokeWidth={1.5}
                />
                <blockquote className="mt-4 text-balance text-xl font-extrabold leading-snug tracking-tight sm:text-2xl">
                  {funFact}
                </blockquote>
                <figcaption className="mt-4 text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                  {funFactSource}
                </figcaption>
              </figure>
            </Reveal>

            {/* Manifesto + lens naast elkaar in plaats van gestapeld */}
            <div className="mt-14 grid gap-5 md:grid-cols-[1.25fr_1fr] md:items-stretch">
              <Reveal className="h-full">
                <div className="flex h-full flex-col rounded-3xl border border-[#FF5722]/20 bg-gradient-to-br from-[#FF5722]/[0.07] to-transparent p-6 sm:p-8">
                  <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-[#FF5722]">
                    <Sparkles className="size-4" aria-hidden />
                    Hoe ik werk
                  </p>
                  <h2 className="mt-3 text-balance text-2xl font-extrabold tracking-tight text-slate-900">
                    {STRATEGY_MANIFESTO.title}
                  </h2>
                  <div className="mt-4 space-y-3.5 text-[15px] leading-relaxed text-slate-600">
                    {STRATEGY_MANIFESTO.paragraphs.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.07} className="h-full">
                <div className="flex h-full flex-col justify-between rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                      Lens op dit blok
                    </p>
                    <p className="mt-4 text-[15px] leading-relaxed text-slate-700">
                      {strategic.pillarLens}
                    </p>
                  </div>
                  <Link
                    href={pillarHref}
                    className="group mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-slate-900 transition-colors hover:text-[#FF5722]"
                  >
                    Alles over {dienst.pillar}
                    <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </Reveal>
            </div>

            {/* Deep dive */}
            <Reveal delay={0.05}>
              <section className="mt-16" aria-labelledby="deep-dive-heading">
                <h2
                  id="deep-dive-heading"
                  className="text-balance text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
                >
                  {strategic.deepTitle}
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-slate-800">
                  {strategic.deepLead}
                </p>
                <p className="mt-4 text-base leading-relaxed text-slate-600">
                  {strategic.deepExtended}
                </p>
              </section>
            </Reveal>

            {/* Aanpak als route */}
            <Reveal delay={0.05}>
              <section className="mt-16" aria-labelledby="approach-heading">
                <h2
                  id="approach-heading"
                  className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
                >
                  Zo pakken we het aan
                </h2>
                <p className="mt-2 max-w-xl text-slate-600">
                  Geen black box van maanden. Je ziet elke fase wat er gebeurt
                  en waarom.
                </p>
              </section>
            </Reveal>
            <ApproachPath steps={approachSteps} />

            {/* Signalen */}
            <Reveal delay={0.05}>
              <section className="mt-16" aria-labelledby="signals-heading">
                <h2
                  id="signals-heading"
                  className="flex items-center gap-2.5 text-2xl font-extrabold tracking-tight text-slate-900"
                >
                  <Target className="size-7 text-[#FF5722]" aria-hidden />
                  Waar ik bij jou naar kijk
                </h2>
                <p className="mt-2 max-w-xl text-sm text-slate-600">
                  Geen trucvragen. Wel de dingen die bepalen welke route voor{" "}
                  <span className="font-semibold text-slate-900">
                    {dienst.name.toLowerCase()}
                  </span>{" "}
                  het slimst is.
                </p>
              </section>
            </Reveal>
            <SignalsScan signals={strategic.signals} />

            {/* Resultaten */}
            {extra?.outcomes.length ? (
              <>
                <Reveal delay={0.05}>
                  <h2 className="mt-16 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                    Concrete resultaten waar je op stuurt
                  </h2>
                </Reveal>
                <OutcomeCards outcomes={extra.outcomes} />
              </>
            ) : null}

            {/* Scenario's met accentbalk, geen stapel */}
            <Reveal delay={0.05}>
              <section className="mt-16" aria-labelledby="scenarios-heading">
                <h2
                  id="scenarios-heading"
                  className="text-balance text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
                >
                  Typische situaties. Elke uitwerking anders
                </h2>
                <p className="mt-2 max-w-xl text-slate-600">
                  Herken je jezelf hierin? Dan weet je meteen waar we zouden
                  starten.
                </p>
                <ul className="mt-8 space-y-4">
                  {strategic.scenarios.map((sc, index) => (
                    <li
                      key={sc.title}
                      className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white py-5 pl-7 pr-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-24px_rgba(15,23,42,0.35)] sm:flex sm:items-baseline sm:gap-6"
                    >
                      <span
                        className={`absolute inset-y-0 left-0 w-1.5 transition-all duration-300 group-hover:w-2.5 ${
                          index % 2 === 0 ? "bg-[#FF5722]" : "bg-slate-900"
                        }`}
                        aria-hidden
                      />
                      <h3 className="shrink-0 text-base font-extrabold tracking-tight text-slate-900 sm:w-48">
                        {sc.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-slate-600 sm:mt-0">
                        {sc.body}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            </Reveal>

            <Reveal delay={0.05}>
              <p className="mt-14 max-w-2xl text-lg leading-relaxed text-slate-600">
                {body.closing}
              </p>
            </Reveal>

            {/* FAQ */}
            {extra?.faq.length ? (
              <section className="mt-16" aria-labelledby={`faq-${dienst.slug}`}>
                <Reveal>
                  <h2
                    id={`faq-${dienst.slug}`}
                    className="text-2xl font-extrabold tracking-tight text-slate-900"
                  >
                    Veelgestelde vragen
                  </h2>
                  <p className="mt-2 text-slate-600">
                    Korte antwoorden. In een gesprek maken we ze specifiek voor
                    jouw situatie.
                  </p>
                </Reveal>
                <div className="mt-8">
                  <DienstFAQ items={extra.faq} idPrefix={dienst.slug} />
                </div>
              </section>
            ) : null}
          </div>

          <PremiumSidebar
            ctaHref={ctaNav.href}
            ctaLabel={ctaNav.label}
            pillarName={dienst.pillar}
            related={related.map((r) => ({ slug: r.slug, name: r.name }))}
          />
        </div>
      </div>
    </article>
  );
}
