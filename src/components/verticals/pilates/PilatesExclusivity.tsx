"use client";

import { useState } from "react";

import { Reveal } from "@/components/effects/Reveal";
import type { VerticalCampaignPersonalization } from "@/data/verticals/types";
import { PILATES_VERTICAL } from "@/data/verticals/pilates";

interface PilatesExclusivityProps {
  personalization: VerticalCampaignPersonalization | null;
}

const PILLARS = [
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
] as const;

export function PilatesExclusivity({ personalization }: PilatesExclusivityProps) {
  const { exclusivity } = PILATES_VERTICAL;
  const engineCities = exclusivity.cities.filter(
    (c) => c.statusSource === "engine",
  );
  const [hoverCity, setHoverCity] = useState<string | null>(null);

  return (
    <section
      className="relative overflow-hidden border-b border-slate-200 bg-slate-900 text-white"
      aria-labelledby="pilates-exclusivity-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,87,34,0.55) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,87,34,0.55) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 55% 50% at 100% 0%, rgba(255,87,34,0.28), transparent 50%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-300">
            {exclusivity.lead.replace(/Één/g, "Eén")}
          </p>
          <h2
            id="pilates-exclusivity-heading"
            className="mt-5 max-w-4xl text-[2.4rem] font-extrabold leading-[1.02] tracking-tight sm:text-5xl lg:text-[3.4rem]"
          >
            <span className="block text-white">Eén studio.</span>
            <span className="block text-white/90">Eén stad.</span>
            <span className="block text-[#FF5722]">Eén team dat voor jou werkt.</span>
          </h2>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            {exclusivity.body}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-3 sm:items-stretch">
          {PILLARS.map((card, i) => (
            <Reveal key={card.title} delay={0.06 * i} className="h-full">
              <article className="group h-full rounded-3xl border border-white/12 bg-white/[0.05] p-5 backdrop-blur-sm transition hover:border-[#FF5722]/40 hover:bg-white/[0.08] sm:p-6">
                <div className="mb-3 size-2 rounded-full bg-[#FF5722] transition group-hover:scale-125" />
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

        {personalization?.city &&
        (personalization.cityStatus === "RESERVED" ||
          personalization.cityStatus === "EXCLUSIVE" ||
          personalization.cityStatus === "AVAILABLE") ? (
          <Reveal delay={0.12}>
            <p className="mt-8 inline-flex rounded-2xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-medium text-white">
              {personalization.cityStatus === "RESERVED"
                ? `Voor dit traject houden we ${personalization.city} momenteel voor jullie gereserveerd.`
                : personalization.cityStatus === "EXCLUSIVE"
                  ? `${personalization.city} valt binnen jullie exclusieve Pilates-traject.`
                  : `${personalization.city} is voor dit traject momenteel beschikbaar.`}
            </p>
          </Reveal>
        ) : null}

        {engineCities.length > 0 ? (
          <Reveal delay={0.14}>
            <div className="mt-10">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                Live steden uit de Local Growth Engine
              </p>
              <ul className="grid gap-3 sm:grid-cols-3">
                {engineCities.map((slot) => {
                  const hot = hoverCity === slot.city;
                  const available = slot.status === "available";
                  return (
                    <li key={slot.city}>
                      <button
                        type="button"
                        onMouseEnter={() => setHoverCity(slot.city)}
                        onMouseLeave={() => setHoverCity(null)}
                        onFocus={() => setHoverCity(slot.city)}
                        onBlur={() => setHoverCity(null)}
                        className={
                          hot
                            ? "flex w-full items-center justify-between rounded-2xl border border-[#FF5722]/50 bg-white/10 px-4 py-3.5 text-left transition"
                            : "flex w-full items-center justify-between rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3.5 text-left transition hover:border-white/30"
                        }
                      >
                        <span className="font-bold tracking-tight">
                          {slot.city}
                        </span>
                        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                          <span
                            className={
                              available
                                ? `size-2 rounded-full bg-emerald-400 ${hot ? "animate-pulse" : ""}`
                                : "size-2 rounded-full bg-amber-300"
                            }
                            aria-hidden
                          />
                          <span
                            className={
                              available ? "text-emerald-300" : "text-amber-200"
                            }
                          >
                            {available
                              ? "Beschikbaar"
                              : slot.status === "partner_active"
                                ? "Partner actief"
                                : "Gereserveerd"}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={0.14}>
            <div className="mt-10 max-w-xl rounded-2xl border border-white/12 bg-white/[0.04] p-5">
              <p className="text-sm font-extrabold text-white">
                Jouw stad checken we in het gesprek.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Alleen echte data uit de Local Growth Engine verschijnt hier als
                status. Echte beschikbaarheid, niks verzonnen.
              </p>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
