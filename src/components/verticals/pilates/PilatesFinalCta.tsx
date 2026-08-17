"use client";

import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/effects/Reveal";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import { PilatesLeadForm } from "@/components/verticals/pilates/PilatesLeadForm";
import type {
  VerticalCampaignPersonalization,
  VerticalInterestId,
} from "@/data/verticals/types";
import { PILATES_VERTICAL } from "@/data/verticals/pilates";
import { trackPilatesEvent } from "@/lib/verticals/analytics";
import { getActiveLaunchPromo } from "@/lib/verticals/format-price";

interface PilatesFinalCtaProps {
  personalization: VerticalCampaignPersonalization | null;
  campaignRef: string | null;
  selectedInterest?: VerticalInterestId;
  onInterestChange?: (interest: VerticalInterestId) => void;
}

const promo = getActiveLaunchPromo(PILATES_VERTICAL.pricing);

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
            "linear-gradient(115deg, rgba(255,87,34,0.14) 0%, transparent 45%), radial-gradient(ellipse 60% 80% at 50% 100%, rgba(14,165,233,0.08), transparent 55%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:pb-28 lg:pt-24">
        <Reveal>
          <div className="text-center">
            <div className="mx-auto flex w-fit items-center gap-2">
              <InteractiveLogo className="size-9" interactive={false} />
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-orange-300">
                Afsluiter
              </p>
              {promo ? (
                <span className="rounded-full bg-[#FF5722] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  {promo.badge}
                </span>
              ) : null}
            </div>

            <h2
              id="pilates-final-heading"
              className="mt-4 text-3xl font-extrabold leading-[1.08] tracking-tight text-balance sm:text-4xl"
            >
              Klaar? Laten we{" "}
              <span className="text-[#FF5722]">jouw studio online zetten.</span>
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Eén formulier. Direct betalen via iDEAL of eerst je vragen stellen.
              Ik lees alles zelf en reageer rechtstreeks.
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
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-bold text-white transition hover:border-[#FF5722]/50 hover:bg-[#FF5722]/10"
              >
                Bekijk jullie ontwerp opnieuw
                <ArrowUpRight className="size-4" aria-hidden />
              </a>
            ) : null}
          </div>
        </Reveal>

        <Reveal delay={0.06} className="mt-10">
          <div className="overflow-hidden rounded-[1.75rem] border border-slate-200/90 bg-white text-slate-900 shadow-[0_40px_90px_-24px_rgba(0,0,0,0.5)]">
            <PilatesLeadForm
              personalization={personalization}
              campaignRef={campaignRef}
              selectedInterest={selectedInterest}
              onInterestChange={onInterestChange}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
