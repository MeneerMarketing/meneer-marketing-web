"use client";

import { CalendarX2, Globe2, LayoutTemplate } from "lucide-react";

import { Reveal } from "@/components/effects/Reveal";

const pains = [
  {
    icon: CalendarX2,
    title: "De agenda vult zich met de verkeerde vragen",
    body: "Telefoon en mail lopen vol met “hoeveel kost het?” terwijl de behandelkamer tijd verdient aan serieuze intakes. Digitaal mist het filter: helder aanbod, tariefkaders en een knop die meteen boekt.",
  },
  {
    icon: Globe2,
    title: "Google laat je concurrent zien, niet jouw kliniek",
    body: "Wie “huidkliniek” of een behandeling + stad typt, ziet vaak Maps en drie anderen. Jouw Google Business Profile en landingspagina’s zijn dan de echte voordeur, niet je Instagram-bio.",
  },
  {
    icon: LayoutTemplate,
    title: "De site voelt als salon-template, niet als kliniek",
    body: "Stockfoto’s, vage beloftes, geen rust. Bezoekers die rust en precisie zoeken voor hun huid, klikken weg voordat ze een intake plannen.",
  },
] as const;

export function HuidkliniekFriction() {
  return (
    <section
      className="border-b border-stone-200 bg-white"
      aria-labelledby="huidkliniek-friction-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF5722]">
            Herkenbaar
          </p>
          <h2
            id="huidkliniek-friction-heading"
            className="mt-3 max-w-3xl text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl"
          >
            Waarom klinieken digitaal vastlopen
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
            Niet omdat je slecht bent in je vak. Omdat de digitale voordeur niet
            op kliniekniveau staat.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 lg:grid-cols-3 lg:gap-5">
          {pains.map((pain, index) => {
            const Icon = pain.icon;
            return (
              <Reveal key={pain.title} delay={0.05 * index}>
                <article className="flex h-full flex-col border-l-2 border-[#FF5722] bg-slate-50 px-5 py-6 sm:px-6">
                  <Icon className="size-5 text-[#FF5722]" aria-hidden />
                  <h3 className="mt-4 text-lg font-extrabold tracking-tight text-slate-950">
                    {pain.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {pain.body}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
