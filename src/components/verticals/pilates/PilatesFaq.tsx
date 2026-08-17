"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";

import { Reveal } from "@/components/effects/Reveal";
import { GroeiscanMeneerCoach } from "@/components/groeiscan/GroeiscanMeneerCoach";
import { PILATES_VERTICAL } from "@/data/verticals/pilates";

const SIDE_FACTS = [
  {
    title: "From scratch",
    body: "Jouw naam, logo, lessen en stad. Custom build, niet jouw foto op een template.",
  },
  {
    title: "Live binnen 5 werkdagen",
    body: "Studio Edition mik ik op oplevering binnen een werkweek, inclusief lokale SEO-basis.",
  },
  {
    title: "Maandelijks opzegbaar",
    body: "Per maand betalen, per maand opzegbaar via mij.",
  },
] as const;

/**
 * Native <details>: alle antwoorden in de SSR-HTML (schema + crawl match).
 */
export function PilatesFaq() {
  const faqs = PILATES_VERTICAL.faq;

  return (
    <section
      id="faq"
      className="border-b border-slate-200 bg-slate-50/70"
      aria-labelledby="pilates-faq-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start lg:gap-14">
          <Reveal className="lg:sticky lg:top-24">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF5722]">
              FAQ
            </p>
            <h2
              id="pilates-faq-heading"
              className="mt-3 text-3xl font-extrabold tracking-tighter text-slate-900 sm:text-4xl"
            >
              Vragen die studio-eigenaren écht stellen
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-slate-600">
              Liever de korte versie? Rechts staan de zeven vragen die ik het vaakst krijg.
              Antwoord open, zonder salespraat eromheen.
            </p>

            <ul className="mt-8 space-y-3">
              {SIDE_FACTS.map((fact) => (
                <li
                  key={fact.title}
                  className="rounded-2xl border border-slate-200/90 bg-white px-4 py-3.5 shadow-sm"
                >
                  <p className="text-sm font-extrabold tracking-tight text-slate-900">
                    {fact.title}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{fact.body}</p>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <GroeiscanMeneerCoach
                theme="light"
                message="Twijfel je tussen Studio Edition en Growth Partner? Stuur je situatie. Ik zeg eerlijk welk pakket past."
              />
            </div>

            <Link
              href="#aanvraag"
              className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#FF5722]"
            >
              Naar aanvraag
              <span aria-hidden>↓</span>
            </Link>
          </Reveal>

          <div className="relative">
            <div
              className="pointer-events-none absolute bottom-2 left-3 top-2 hidden w-px bg-slate-200 lg:block"
              aria-hidden
            />

            <div className="space-y-2">
              {faqs.map((item, i) => (
                <Reveal key={item.question} delay={Math.min(i, 6) * 0.04}>
                  <details
                    className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm open:border-slate-300 open:shadow-[0_16px_40px_-28px_rgba(15,23,42,0.35)] lg:pl-5"
                    open={i === 0}
                  >
                    <span
                      className="absolute left-0 top-4 hidden h-[calc(100%-2rem)] w-1 rounded-full bg-slate-900 opacity-0 transition group-open:opacity-100 lg:block"
                      aria-hidden
                    />

                    <summary className="flex cursor-pointer list-none items-start justify-between gap-4 px-5 py-4 text-left marker:hidden [&::-webkit-details-marker]:hidden">
                      <span className="text-base font-bold tracking-tight text-slate-900 sm:text-[1.05rem]">
                        {item.question}
                      </span>
                      <span
                        className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition group-open:rotate-180 group-open:border-slate-300 group-open:bg-slate-100"
                        aria-hidden
                      >
                        <ChevronDown className="size-4" strokeWidth={2.5} />
                      </span>
                    </summary>
                    <p className="border-t border-slate-100 px-5 pb-5 pt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                      {item.answer}
                    </p>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
