import Link from "next/link";
import {
  ArrowUpRight,
  Ear,
  MessageCircleQuestion,
  Route,
  Sparkles,
  Waypoints,
} from "lucide-react";
import { Reveal } from "@/components/effects/Reveal";
import { DienstFAQ } from "@/components/diensten/DienstFAQ";
import { ApproachPath } from "@/components/diensten/premium/ApproachPath";
import { HeroBuildWindow } from "@/components/diensten/premium/HeroBuildWindow";
import { OutcomePanels } from "@/components/diensten/premium/OutcomePanels";
import { PremiumSidebar } from "@/components/diensten/premium/PremiumSidebar";
import { SignalsChat } from "@/components/diensten/premium/SignalsChat";
import { StickerStrip } from "@/components/diensten/premium/StickerStrip";
import type { TocItem } from "@/components/diensten/premium/PageTOC";
import type { DienstBody } from "@/data/dienst-content";
import type { DienstExtra } from "@/data/dienst-extras";
import type { DienstPremiumContent } from "@/data/dienst-premium";
import type { DienstStrategicContent } from "@/data/dienst-strategic";
import type { DienstDetail } from "@/lib/diensten";
import { ctaNav } from "@/lib/navigation";
import { siteCtas } from "@/lib/cta";

const PRINCIPLE_ICONS = [Ear, Waypoints, MessageCircleQuestion] as const;

interface DienstPremiumViewProps {
  dienst: DienstDetail;
  /** Route van de blok-landingspagina, bijv. /bouwen */
  pillarHref: string;
  body: DienstBody;
  extra: DienstExtra | null;
  strategic: DienstStrategicContent & { pillarLens: string };
  related: DienstDetail[];
  premium: DienstPremiumContent;
}

export function DienstPremiumView({
  dienst,
  pillarHref,
  body,
  extra,
  strategic,
  related,
  premium,
}: DienstPremiumViewProps) {
  const tocItems: TocItem[] = [
    { id: "hoe-ik-werk", label: "Hoe ik werk" },
    { id: "verhaal", label: "Het verhaal" },
    { id: "aanpak", label: "Zo pakken we het aan" },
    { id: "intake", label: "Waar ik naar kijk" },
    { id: "resultaten", label: "Resultaten" },
    { id: "situaties", label: "Herken je dit?" },
    ...(extra?.faq.length ? [{ id: "faq", label: "Veelgestelde vragen" }] : []),
  ];

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
              {premium.heroKicker}
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
              {premium.heroStats.map((stat) => (
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

      <StickerStrip items={premium.capabilities} />

      {/* Body */}
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-14">
          <div className="min-w-0">
            <Reveal>
              <p className="max-w-2xl text-balance text-xl leading-relaxed text-slate-800 sm:text-2xl sm:leading-relaxed">
                {body.intro}
              </p>
            </Reveal>

            {/* Feitje met watermerk-cijfer */}
            <Reveal delay={0.05}>
              <figure className="relative mt-12 overflow-hidden rounded-3xl border border-[#FF5722]/25 bg-gradient-to-br from-[#FF5722]/[0.06] via-white to-white p-7 sm:p-9">
                <span
                  className="pointer-events-none absolute -right-3 -top-7 select-none text-[6rem] font-extrabold leading-none tracking-tighter text-transparent [-webkit-text-stroke:2px_rgba(255,87,34,0.18)] sm:text-[8.5rem]"
                  aria-hidden
                >
                  {premium.funFactStat}
                </span>
                <p className="relative inline-flex items-center gap-2 rounded-full bg-[#FF5722] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-white">
                  Wist je dit?
                </p>
                <blockquote className="relative mt-4 max-w-lg text-balance text-xl font-extrabold leading-snug tracking-tight text-slate-900 sm:text-2xl">
                  {premium.funFact}
                </blockquote>
                <figcaption className="relative mt-3 text-xs font-semibold uppercase tracking-[0.15em] text-[#FF5722]">
                  {premium.funFactSource}
                </figcaption>
              </figure>
            </Reveal>

            {/* Hoe ik werk: drie gelijke principes + lens */}
            <section
              id="hoe-ik-werk"
              className="mt-16 scroll-mt-28"
              aria-labelledby="principles-heading"
            >
              <Reveal>
                <h2
                  id="principles-heading"
                  className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
                >
                  Hoe ik werk
                </h2>
                <p className="mt-2 max-w-xl text-slate-600">
                  Drie dingen die je bij mij altijd krijgt. Wat we ook bouwen.
                </p>
              </Reveal>
              <ul className="mt-8 grid gap-4 sm:grid-cols-3 sm:items-stretch">
                {premium.principles.map((principle, index) => {
                  const Icon = PRINCIPLE_ICONS[index % PRINCIPLE_ICONS.length];
                  return (
                    <Reveal key={principle.title} delay={0.07 * index} className="h-full">
                      <li className="group flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#FF5722]/35 hover:shadow-[0_20px_40px_-28px_rgba(255,87,34,0.55)]">
                        <span
                          className="flex size-11 items-center justify-center rounded-2xl bg-slate-900 text-white transition-colors duration-300 group-hover:bg-[#FF5722]"
                          aria-hidden
                        >
                          <Icon className="size-5" strokeWidth={1.8} />
                        </span>
                        <h3 className="mt-4 text-base font-extrabold tracking-tight text-slate-900">
                          {principle.title}
                        </h3>
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                          {principle.body}
                        </p>
                      </li>
                    </Reveal>
                  );
                })}
              </ul>
              <Reveal delay={0.1}>
                <div className="mt-4 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-slate-50/80 p-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:p-7">
                  <p className="max-w-2xl text-[15px] leading-relaxed text-slate-700">
                    <span className="font-extrabold text-slate-900">
                      De lens op {dienst.pillar.toLowerCase()}:{" "}
                    </span>
                    {premium.lens}
                  </p>
                  <Link
                    href={pillarHref}
                    className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-bold text-slate-900 transition-colors hover:text-[#FF5722]"
                  >
                    Alles over {dienst.pillar}
                    <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </Reveal>
            </section>

            {/* Deep dive */}
            <section
              id="verhaal"
              className="mt-16 scroll-mt-28"
              aria-labelledby="deep-dive-heading"
            >
              <Reveal>
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
              </Reveal>
            </section>

            {/* Aanpak als route */}
            <section
              id="aanpak"
              className="mt-16 scroll-mt-28"
              aria-labelledby="approach-heading"
            >
              <Reveal>
                <h2
                  id="approach-heading"
                  className="flex items-center gap-2.5 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
                >
                  <Route className="size-7 text-[#FF5722]" aria-hidden />
                  Zo pakken we het aan
                </h2>
                <p className="mt-2 max-w-xl text-slate-600">
                  Geen black box van maanden. Je ziet elke fase wat er gebeurt
                  en waarom.
                </p>
              </Reveal>
              <ApproachPath steps={premium.approachSteps} />
            </section>

            {/* Intake als chatgesprek */}
            <section
              id="intake"
              className="mt-16 scroll-mt-28"
              aria-labelledby="signals-heading"
            >
              <Reveal>
                <h2
                  id="signals-heading"
                  className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
                >
                  Waar ik bij jou naar kijk
                </h2>
                <p className="mt-2 max-w-xl text-slate-600">
                  Geen trucvragen. Dit is letterlijk hoe ons eerste gesprek
                  eruitziet, en elk antwoord stuurt de route bij.
                </p>
              </Reveal>
              <Reveal delay={0.06}>
                <div className="mt-8">
                  <SignalsChat
                    signals={strategic.signals}
                    ctaHref={ctaNav.href}
                  />
                </div>
              </Reveal>
            </section>

            {/* Resultaten als uitklappanelen */}
            <section
              id="resultaten"
              className="mt-16 scroll-mt-28"
              aria-labelledby="outcomes-heading"
            >
              <Reveal>
                <h2
                  id="outcomes-heading"
                  className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
                >
                  Concrete resultaten waar je op stuurt
                </h2>
                <p className="mt-2 max-w-xl text-slate-600">
                  Beweeg over de panelen. Dit is waar je het straks elke dag
                  aan merkt.
                </p>
              </Reveal>
              <OutcomePanels outcomes={premium.outcomes} />
            </section>

            {/* Scenario's */}
            <section
              id="situaties"
              className="mt-16 scroll-mt-28"
              aria-labelledby="scenarios-heading"
            >
              <Reveal>
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
                          index % 2 === 0 ? "bg-[#FF5722]" : "bg-sky-400"
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
              </Reveal>
            </section>

            <Reveal delay={0.05}>
              <p className="mt-14 max-w-2xl text-lg leading-relaxed text-slate-600">
                {body.closing}
              </p>
            </Reveal>

            {/* FAQ */}
            {extra?.faq.length ? (
              <section
                id="faq"
                className="mt-16 scroll-mt-28"
                aria-labelledby={`faq-${dienst.slug}`}
              >
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
            tocItems={tocItems}
          />
        </div>
      </div>
    </article>
  );
}
