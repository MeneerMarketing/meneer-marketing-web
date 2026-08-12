"use client";

import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/effects/Reveal";
import { PilatesLeadForm } from "@/components/verticals/pilates/PilatesLeadForm";
import type { VerticalCampaignPersonalization } from "@/data/verticals/types";
import { PILATES_VERTICAL } from "@/data/verticals/pilates";
import { trackPilatesEvent } from "@/lib/verticals/analytics";

interface PilatesFinalCtaProps {
  personalization: VerticalCampaignPersonalization | null;
  campaignRef: string | null;
}

export function PilatesFinalCta({
  personalization,
  campaignRef,
}: PilatesFinalCtaProps) {
  return (
    <section
      id="aanvraag"
      className="relative overflow-hidden border-b border-slate-200 bg-slate-900 text-white"
      aria-labelledby="pilates-final-heading"
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 50% 60% at 0% 50%, rgba(255,87,34,0.28), transparent 55%), radial-gradient(ellipse 40% 40% at 100% 100%, rgba(14,165,233,0.12), transparent 50%)",
        }}
      />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1fr_1fr] lg:items-start lg:gap-16 lg:px-8 lg:py-24">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-300">
            Klaar voor de volgende stap?
          </p>
          <h2
            id="pilates-final-heading"
            className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-[2.7rem] lg:leading-[1.06]"
          >
            Je studio staat al.
            <span className="mt-1 block text-[#FF5722]">
              Nu je online fundament nog.
            </span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-slate-300 sm:text-lg">
            Stuur je studio door. Ik kijk mee wat past: Studio Edition, Local
            Growth, Growth Partner of Signature Custom. Kort, eerlijk,
            rechtstreeks.
          </p>

          <a
            href={PILATES_VERTICAL.demo.primaryHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackPilatesEvent("pilates_demo_click", { location: "final_cta" })
            }
            className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-orange-300 transition hover:text-orange-200"
          >
            Eerst de live demo bekijken
            <ArrowUpRight className="size-4" aria-hidden />
          </a>

          <ul className="mt-10 space-y-3 text-sm text-slate-300">
            {[
              "Rechtstreeks contact met mij",
              "Eén aanspreekpunt voor site, SEO en ads",
              "Één Pilates partner per stad",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span
                  className="size-1.5 shrink-0 rounded-full bg-[#FF5722]"
                  aria-hidden
                />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="border border-white/10 bg-white p-6 text-slate-900 shadow-[0_24px_60px_rgba(0,0,0,0.35)] sm:p-8">
            <h3 className="text-lg font-extrabold tracking-tight">
              Stuur mijn studio door
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Duurt een minuut. Ik reageer persoonlijk.
            </p>
            <div className="mt-6">
              <PilatesLeadForm
                personalization={personalization}
                campaignRef={campaignRef}
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
