"use client";

import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/effects/Reveal";
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

export function PilatesFinalCta({
  personalization,
  campaignRef,
  selectedInterest,
  onInterestChange,
}: PilatesFinalCtaProps) {
  return (
    <section
      id="aanvraag"
      className="relative overflow-hidden border-b border-slate-800 bg-[#0c1222] text-white"
      aria-labelledby="pilates-final-heading"
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 10% 0%, rgba(255,87,34,0.22), transparent 55%), radial-gradient(ellipse 45% 40% at 95% 100%, rgba(56,189,248,0.12), transparent 55%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:pb-24 lg:pt-20">
        <div className="grid items-stretch gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10">
          <Reveal className="flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.03] p-7 sm:p-9">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-300">
                  Aanvraag
                </p>
                {promo ? (
                  <span className="rounded-full bg-[#FF5722] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                    {promo.badge}
                  </span>
                ) : null}
              </div>

              <h2
                id="pilates-final-heading"
                className="mt-4 text-3xl font-extrabold tracking-tight text-balance sm:text-4xl lg:text-[2.55rem] lg:leading-[1.08]"
              >
                Je studio staat al.
                <span className="mt-1 block text-[#FF5722]">Nu digitaal.</span>
              </h2>

              <p className="mt-5 max-w-md text-base leading-relaxed text-slate-300 sm:text-lg">
                Stuur je studio door. Ik kijk welk pakket past en reageer
                rechtstreeks. Vanaf {fromMonthly}
                {promo ? ", launch tijdelijk €0" : ""}.
              </p>

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
                  className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-bold text-white transition hover:border-[#FF5722]/50 hover:bg-[#FF5722]/10"
                >
                  Bekijk jullie ontwerp opnieuw
                  <ArrowUpRight className="size-4" aria-hidden />
                </a>
              ) : null}
            </div>

            <ul className="mt-10 space-y-3 border-t border-white/10 pt-6 text-sm text-slate-300">
              {[
                "Rechtstreeks contact",
                "Site, SEO en ads onder één dak",
                "Live in circa 5 werkdagen",
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

          <Reveal delay={0.06} className="h-full">
            <div className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-5 text-slate-900 shadow-[0_28px_70px_rgba(0,0,0,0.35)] sm:p-6">
              <h3 className="text-lg font-extrabold tracking-tight">
                Start direct of stuur je studio door
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Kies je pakket, vul studio + e-mail in. Betalen via iDEAL of
                eerst contact opnemen.
              </p>
              <div className="mt-4 flex-1">
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
