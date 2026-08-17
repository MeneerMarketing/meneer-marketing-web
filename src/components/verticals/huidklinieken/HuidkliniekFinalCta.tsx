"use client";

import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/effects/Reveal";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import { HuidkliniekLeadForm } from "@/components/verticals/huidklinieken/HuidkliniekLeadForm";
import type {
  VerticalCampaignPersonalization,
  VerticalInterestId,
} from "@/data/verticals/types";
import { HUIDKLINIEKEN_VERTICAL } from "@/data/verticals/huidklinieken";
import { trackHuidkliniekEvent } from "@/lib/verticals/analytics";
import { getActiveLaunchPromo } from "@/lib/verticals/format-price";

interface HuidkliniekFinalCtaProps {
  personalization: VerticalCampaignPersonalization | null;
  campaignRef: string | null;
  selectedInterest?: VerticalInterestId;
  onInterestChange?: (interest: VerticalInterestId) => void;
}

const promo = getActiveLaunchPromo(HUIDKLINIEKEN_VERTICAL.pricing);

export function HuidkliniekFinalCta({
  personalization,
  campaignRef,
  selectedInterest,
  onInterestChange,
}: HuidkliniekFinalCtaProps) {
  return (
    <section
      id="aanvraag"
      className="relative overflow-hidden border-b border-slate-800 bg-[#0c1222] text-white"
      aria-labelledby="huidkliniek-final-heading"
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 10% 0%, rgba(255,87,34,0.22), transparent 55%), radial-gradient(ellipse 45% 40% at 95% 100%, rgba(56,189,248,0.12), transparent 55%)",
        }}
      />

      <div className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:pb-28 lg:pt-24">
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
              id="huidkliniek-final-heading"
              className="mt-4 text-3xl font-extrabold leading-[1.08] tracking-tight text-balance sm:text-4xl"
            >
              De intake begint online.{" "}
              <span className="text-[#FF5722]">Niet pas aan de balie.</span>
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Eén formulier. Direct betalen via iDEAL of eerst je vragen stellen.
              Ik lees alles zelf en reageer rechtstreeks.
            </p>

            <a
              href="#live-design"
              onClick={() =>
                trackHuidkliniekEvent("huidkliniek_demo_click", {
                  location: "final_cta",
                })
              }
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-bold text-white transition hover:border-[#FF5722]/50 hover:bg-[#FF5722]/10"
            >
              Bekijk de richtingen
              <ArrowUpRight className="size-4" aria-hidden />
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.06} className="mt-10">
          <div className="overflow-hidden rounded-[1.75rem] border border-slate-200/90 bg-white text-slate-900 shadow-[0_40px_90px_-24px_rgba(0,0,0,0.5)]">
            <HuidkliniekLeadForm
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
