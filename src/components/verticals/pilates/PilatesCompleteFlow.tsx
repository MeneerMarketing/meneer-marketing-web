"use client";

import Link from "next/link";
import { ArrowRight, CalendarCheck, MapPin, RefreshCw, Sparkles } from "lucide-react";

import { Reveal } from "@/components/effects/Reveal";

const PHASES = [
  {
    id: "found",
    icon: MapPin,
    kicker: "Gevonden worden",
    title: "Google zoekt. Jij verschijnt.",
    body: 'Lokale zoekvraag zoals "Pilates + jouw stad" en "Reformer Pilates". Structuur, GBP en SEO die daarop gebouwd zijn.',
    example: "Pilates Arnhem → jouw studio",
  },
  {
    id: "trust",
    icon: Sparkles,
    kicker: "Vertrouwen",
    title: "De site overtuigt in één scroll.",
    body: "Art direction, lessen, trainers, prijzen. Alles voelt als jouw studio. Niet als een generieke sportpagina met stockfoto's van yoga-matten.",
    example: 'Van twijfel naar "dit is het"',
  },
  {
    id: "book",
    icon: CalendarCheck,
    kicker: "Boeken",
    title: "Klik wordt een plek in het rooster.",
    body: "Koppeling met je huidige systeem, branded app of maatwerk. Wat past bij budget en proces. Echt boeken, niet eindeloos heen-en-weer appen.",
    example: "Proefles of membership",
  },
  {
    id: "return",
    icon: RefreshCw,
    kicker: "Terugkomen",
    title: "Leden blijven in je systeem.",
    body: "App, herinneringen, memberships. Het pad stopt niet bij de eerste boeking. Dat scheelt eindeloos opnieuw jagen.",
    example: "Retentie i.p.v. steeds opnieuw jagen",
  },
] as const;

export function PilatesCompleteFlow() {
  return (
    <section
      className="relative border-b border-slate-200 bg-white"
      aria-labelledby="pilates-flow-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <Reveal>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF5722]">
                Complete studio flow
              </p>
              <h2
                id="pilates-flow-heading"
                className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-[1.06]"
              >
                Van Google-zoekopdracht tot vaste Pilates-klant.
                <span className="mt-1 block text-[#FF5722]">
                  Dat is het echte product.
                </span>
              </h2>
              <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">
                Een webbureau levert vaak alleen pixels. Ik bouw het pad waar
                je omzet van hangt: gevonden worden, overtuigen, boeken,
                terugkomen. Van{" "}
                <Link
                  href="/diensten/seo"
                  className="font-bold text-slate-900 underline decoration-[#FF5722]/40 underline-offset-2 hover:text-[#FF5722]"
                >
                  SEO
                </Link>{" "}
                tot{" "}
                <Link
                  href="/campagnes"
                  className="font-bold text-slate-900 underline decoration-[#FF5722]/40 underline-offset-2 hover:text-[#FF5722]"
                >
                  campagnes
                </Link>
                .
              </p>
            </div>
            <a
              href="#pakketten"
              className="group inline-flex shrink-0 items-center gap-2 self-start rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#FF5722] lg:self-auto"
            >
              Welk pakket past?
              <ArrowRight
                className="size-4 transition group-hover:translate-x-0.5"
                aria-hidden
              />
            </a>
          </div>
        </Reveal>

        {/* Journey rail */}
        <ol className="relative mt-14 grid gap-4 lg:mt-16 lg:grid-cols-4 lg:gap-3">
          <div
            className="pointer-events-none absolute left-0 right-0 top-[2.15rem] hidden h-px bg-gradient-to-r from-sky-300 via-[#FF5722] to-emerald-400 lg:block"
            aria-hidden
          />

          {PHASES.map((phase, index) => {
            const Icon = phase.icon;
            return (
              <li key={phase.id}>
                <Reveal delay={index * 0.07} className="h-full">
                  <article className="relative flex h-full flex-col rounded-3xl bg-[#f7fafc] p-5 ring-1 ring-slate-200/90 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)] hover:ring-[#FF5722]/35 sm:p-6">
                    <div className="relative z-10 flex size-11 items-center justify-center rounded-2xl bg-white text-[#FF5722] shadow-sm ring-1 ring-slate-200">
                      <Icon className="size-5" aria-hidden />
                    </div>
                    <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#FF5722]">
                      {phase.kicker}
                    </p>
                    <h3 className="mt-2 text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
                      {phase.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                      {phase.body}
                    </p>
                    <p className="mt-5 rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold leading-snug text-orange-200">
                      {phase.example}
                    </p>
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ol>

        <Reveal delay={0.2}>
          <p className="mt-10 max-w-2xl text-sm leading-relaxed text-slate-500">
            Daarom voelt dit anders dan "een website laten maken". Je koopt een
            commercieel systeem rond je rooster. Local Growth en Growth Partner
            pakken vindbaarheid en Google Ads erbij.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
