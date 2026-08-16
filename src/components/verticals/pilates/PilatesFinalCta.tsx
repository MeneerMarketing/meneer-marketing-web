"use client";

import { ArrowUpRight, Clock, MapPin, Sparkles, Zap } from "lucide-react";

import { Reveal } from "@/components/effects/Reveal";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import { PilatesLeadForm } from "@/components/verticals/pilates/PilatesLeadForm";
import type {
  VerticalCampaignPersonalization,
  VerticalInterestId,
} from "@/data/verticals/types";
import { PILATES_VERTICAL } from "@/data/verticals/pilates";
import { trackPilatesEvent } from "@/lib/verticals/analytics";
import {
  formatVerticalMoney,
  getActiveLaunchPromo,
} from "@/lib/verticals/format-price";

interface PilatesFinalCtaProps {
  personalization: VerticalCampaignPersonalization | null;
  campaignRef: string | null;
  selectedInterest?: VerticalInterestId;
  onInterestChange?: (interest: VerticalInterestId) => void;
}

const promo = getActiveLaunchPromo(PILATES_VERTICAL.pricing);
const fromMonthly = formatVerticalMoney(
  PILATES_VERTICAL.pricing.packages[0]!.monthly,
);

const CLOSER_BEATS = [
  {
    icon: Zap,
    title: "Ik reageer zelf",
    text: "Alles komt rechtstreeks bij mij. Meestal dezelfde dag, altijd zonder sales-script.",
  },
  {
    icon: Clock,
    title: "Snel live",
    text: "Via iDEAL betaald? Dan plannen we meteen. Studio Edition staat binnen 5 werkdagen.",
  },
  {
    icon: MapPin,
    title: "Pilates per stad",
    text: "Eén partner per plaats. Jij wint lokaal, ik focus vol op jouw studio.",
  },
] as const;

export function PilatesFinalCta({
  personalization,
  campaignRef,
  selectedInterest,
  onInterestChange,
}: PilatesFinalCtaProps) {
  return (
    <section
      id="aanvraag"
      className="relative overflow-hidden border-t border-slate-800 bg-[#0c1222] text-white"
      aria-labelledby="pilates-final-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,87,34,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,87,34,0.07) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "linear-gradient(115deg, rgba(255,87,34,0.14) 0%, transparent 45%), radial-gradient(ellipse 50% 70% at 0% 100%, rgba(14,165,233,0.1), transparent 55%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:pb-28 lg:pt-24">
        <Reveal>
          <p className="text-center text-[11px] font-bold uppercase tracking-[0.24em] text-orange-300/90">
            Afsluiter · jouw move
          </p>
        </Reveal>

        <div className="mt-10 grid items-stretch gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-10">
          <Reveal className="flex h-full flex-col">
            <div className="flex flex-wrap items-center gap-3">
              <InteractiveLogo className="size-10 shrink-0" interactive={false} />
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-orange-300">
                  Klaar om te starten?
                </p>
                {promo ? (
                  <span className="rounded-full bg-[#FF5722] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                    {promo.badge}
                  </span>
                ) : null}
              </div>
            </div>

            <h2
              id="pilates-final-heading"
              className="mt-5 text-3xl font-extrabold leading-[1.08] tracking-tight text-balance sm:text-4xl lg:text-[2.65rem]"
            >
              Je reformer wacht niet.
              <span className="mt-1 block text-[#FF5722]">
                Waarom zou je site dat wel doen?
              </span>
            </h2>

            <p className="mt-5 max-w-md text-base leading-relaxed text-slate-300 sm:text-lg">
              Twee routes, één aanspreekpunt. Snel betalen en plannen, of eerst
              je vragen dumpen in het formulier. Vanaf {fromMonthly}
              {promo ? ", launch tijdelijk €0" : ""}. Jij kiest het tempo.
            </p>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 backdrop-blur-sm">
              <p className="text-sm font-semibold leading-relaxed text-slate-200">
                <Sparkles
                  className="mb-0.5 mr-1.5 inline size-4 text-[#FF5722]"
                  aria-hidden
                />
                Fun fact: veel studio&apos;s wachten maanden met een betere site.
                Jij kunt vandaag al klikken. Ik fix de rest.
              </p>
            </div>

            {personalization?.previewHref ? (
              <a
                href={personalization.previewHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackPilatesEvent("pilates_demo_click", {
                    location: "final_cta",
                  })
                }
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-bold text-white transition hover:border-[#FF5722]/50 hover:bg-[#FF5722]/10"
              >
                Bekijk jullie ontwerp opnieuw
                <ArrowUpRight className="size-4" aria-hidden />
              </a>
            ) : null}

            <ul className="mt-8 flex flex-1 flex-col gap-3 lg:mt-10">
              {CLOSER_BEATS.map(({ icon: Icon, title, text }) => (
                <li
                  key={title}
                  className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm"
                >
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#FF5722]/15 text-[#FF5722] ring-1 ring-[#FF5722]/25">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-sm font-extrabold tracking-tight text-white">
                      {title}
                    </span>
                    <span className="mt-1 block text-[13px] leading-relaxed text-slate-400">
                      {text}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.06} className="h-full">
            <div className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-slate-200/90 bg-white text-slate-900 shadow-[0_32px_80px_-20px_rgba(0,0,0,0.45)]">
              <div className="border-b border-slate-100 bg-slate-50 px-5 py-4 sm:px-6 sm:py-5">
                <h3 className="text-lg font-extrabold tracking-tight sm:text-xl">
                  Kies je route
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">
                  Links in je hoofd: iDEAL en snel online. Rechts in je hoofd:
                  eerst even sparren. Beide mag.
                </p>
              </div>
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <PilatesLeadForm
                  personalization={personalization}
                  campaignRef={campaignRef}
                  selectedInterest={selectedInterest}
                  onInterestChange={onInterestChange}
                />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
