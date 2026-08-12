"use client";

import { Reveal } from "@/components/effects/Reveal";
import type { VerticalCampaignPersonalization } from "@/data/verticals/types";
import { PILATES_VERTICAL } from "@/data/verticals/pilates";

interface PilatesExclusivityProps {
  personalization: VerticalCampaignPersonalization | null;
}

export function PilatesExclusivity({ personalization }: PilatesExclusivityProps) {
  const { exclusivity } = PILATES_VERTICAL;
  const engineCities = exclusivity.cities.filter(
    (c) => c.statusSource === "engine",
  );

  return (
    <section
      className="relative overflow-hidden border-b border-slate-200 bg-slate-900 text-white"
      aria-labelledby="pilates-exclusivity-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 55% 50% at 100% 0%, rgba(255,87,34,0.28), transparent 50%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-300">
            {exclusivity.lead}
          </p>
          <h2
            id="pilates-exclusivity-heading"
            className="mt-5 max-w-4xl text-[2.4rem] font-extrabold leading-[1.02] tracking-tight sm:text-5xl lg:text-[3.4rem]"
          >
            <span className="block text-white">Één studio.</span>
            <span className="block text-white/90">Één stad.</span>
            <span className="block text-[#FF5722]">Één team dat voor jou werkt.</span>
          </h2>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            {exclusivity.body}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            {
              title: "Jouw stad",
              text: "Ik help niet tegelijk jouw directe Pilates-concurrent.",
            },
            {
              title: "Jouw positie",
              text: "Lokale SEO die voor jou werkt, niet tegen jezelf.",
            },
            {
              title: "Jouw partner",
              text: "Rechtstreeks contact. Jij mailt mij, niet een ticketwachtrij.",
            },
          ].map((card, i) => (
            <Reveal key={card.title} delay={0.06 * i}>
              <article className="h-full border border-white/12 bg-white/[0.04] p-5 backdrop-blur-sm sm:p-6">
                <h3 className="text-lg font-extrabold tracking-tight">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  {card.text}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        {personalization?.city && personalization.cityAvailable !== undefined ? (
          <Reveal delay={0.12}>
            <p className="mt-8 inline-flex border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-medium text-white">
              {personalization.cityAvailable
                ? `${personalization.city} is voor dit traject momenteel beschikbaar.`
                : `${personalization.city} heeft momenteel een actieve Pilates-partner in dit programma.`}
            </p>
          </Reveal>
        ) : null}

        {engineCities.length > 0 ? (
          <Reveal delay={0.14}>
            <ul className="mt-10 grid gap-3 sm:grid-cols-3">
              {engineCities.map((slot) => (
                <li
                  key={slot.city}
                  className="flex items-center justify-between border border-white/15 bg-white/[0.04] px-4 py-3.5"
                >
                  <span className="font-bold tracking-tight">{slot.city}</span>
                  <span
                    className={
                      slot.status === "available"
                        ? "text-xs font-bold uppercase tracking-wider text-emerald-300"
                        : "text-xs font-bold uppercase tracking-wider text-amber-200"
                    }
                  >
                    {slot.status === "available"
                      ? "Beschikbaar"
                      : slot.status === "partner_active"
                        ? "Partner actief"
                        : "Gereserveerd"}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        ) : (
          <Reveal delay={0.14}>
            <p className="mt-8 max-w-xl text-sm leading-relaxed text-slate-400">
              Beschikbaarheid per stad check ik in het gesprek. Alleen echte
              data uit de Local Growth Engine verschijnt hier als status.
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
