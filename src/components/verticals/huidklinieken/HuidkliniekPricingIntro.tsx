"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Globe, Sparkles, Wrench } from "lucide-react";
import { useCallback, useState } from "react";

import type { VerticalInterestId } from "@/data/verticals/types";
import type {
  VerticalLaunchPromo,
  VerticalPackage,
} from "@/data/verticals/types";
import { trackHuidkliniekEvent } from "@/lib/verticals/analytics";

const EASE = [0.22, 1, 0.36, 1] as const;

const TIER_PUNCH: Record<
  "studio-edition" | "local-growth" | "growth-partner",
  { line: string; detail: string }
> = {
  "studio-edition": {
    line: "Salonized erop. Live in 5 werkdagen.",
    detail: "Je kliniek online, intake direct in je agenda.",
  },
  "local-growth": {
    line: "Huidproblemen-landings die intakes binnenhalen.",
    detail: "Acne, pigment, laser: gevonden waar patiënten zoeken.",
  },
  "growth-partner": {
    line: "Shopify shop + Google & Meta Ads.",
    detail: "Retail naast behandeling. Ads die boeken én verkopen.",
  },
};

interface HuidkliniekPricingIntroProps {
  headingId: string;
  packages: readonly VerticalPackage[];
  promo: VerticalLaunchPromo | null;
  termDisclaimer: string;
  includedInfraNote: string;
  includedCareNote: string;
  campaignRecommended?: VerticalInterestId | null;
  activeTier: VerticalInterestId;
  onActiveTierChange: (tier: VerticalInterestId) => void;
}

function getTierPunch(tier: VerticalInterestId) {
  if (tier === "studio-edition" || tier === "growth-partner") {
    return TIER_PUNCH[tier];
  }
  return TIER_PUNCH["local-growth"];
}

function tierAmount(pkg: VerticalPackage): number {
  return pkg.monthly.unit === "eur_cents"
    ? pkg.monthly.amount / 100
    : pkg.monthly.amount;
}

export function HuidkliniekPricingIntro({
  headingId,
  packages,
  promo,
  termDisclaimer,
  includedInfraNote,
  includedCareNote,
  campaignRecommended = null,
  activeTier,
  onActiveTierChange,
}: HuidkliniekPricingIntroProps) {
  const reduce = useReducedMotion();
  const [hoverTier, setHoverTier] = useState<VerticalInterestId | null>(null);
  const displayTier = hoverTier ?? activeTier;
  const punch = getTierPunch(displayTier);

  const focusTier = useCallback(
    (tier: VerticalInterestId) => {
      onActiveTierChange(tier);
      trackHuidkliniekEvent("huidkliniek_package_select", {
        location: "pricing_intro_ladder",
        package: tier,
      });
      document
        .getElementById(`pakket-${tier}`)
        ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest" });
    },
    [onActiveTierChange, reduce],
  );

  return (
    <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-10 lg:gap-y-0 xl:gap-x-14">
      <div className="lg:col-span-7">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF5722]">
            Pakketten
          </p>
          {promo ? (
            <span className="rounded-full bg-[#FF5722] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
              {promo.badge}
            </span>
          ) : null}
        </div>

        <h2
          id={headingId}
          className="mt-4 text-[clamp(1.65rem,3.6vw,2.85rem)] font-extrabold leading-[1.1] tracking-tight text-slate-900"
        >
          <span className="inline">Drie treden.</span>{" "}
          <span className="inline text-slate-400">Één partner</span>{" "}
          <span className="inline text-[#FF5722]">die meegroeit.</span>
        </h2>

        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-slate-600 sm:text-lg">
          Jij kiest het tempo. Ik bouw de site, koppel Salonized, schrijf je SEO
          en schaal ads als jij klaar bent.
          {campaignRecommended
            ? " Op basis van jullie site ligt één pakket het dichtst bij."
            : " Local Growth is waar de meeste klinieken landen, omdat daar de intakes binnenkomen."}
        </p>

        <div
          className="mt-6 flex flex-wrap items-stretch gap-2 sm:mt-7"
          role="tablist"
          aria-label="Kies een trede"
        >
          {packages.map((pkg, i) => {
            const selected = displayTier === pkg.id;
            const recommended = campaignRecommended
              ? campaignRecommended === pkg.id
              : Boolean(pkg.recommended);

            return (
              <div key={pkg.id} className="flex items-center gap-2">
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTier === pkg.id}
                  aria-controls={`pakket-${pkg.id}`}
                  onMouseEnter={() => setHoverTier(pkg.id)}
                  onMouseLeave={() => setHoverTier(null)}
                  onFocus={() => setHoverTier(pkg.id)}
                  onBlur={() => setHoverTier(null)}
                  onClick={() => focusTier(pkg.id)}
                  className={
                    selected
                      ? "relative inline-flex min-h-[3.25rem] flex-col justify-center rounded-2xl border-2 border-[#FF5722] bg-white px-3.5 py-2.5 text-left shadow-[0_14px_36px_-18px_rgba(255,87,34,0.55)] transition sm:px-4"
                      : "relative inline-flex min-h-[3.25rem] flex-col justify-center rounded-2xl border border-slate-200 bg-white/90 px-3.5 py-2.5 text-left transition hover:border-slate-300 hover:bg-white sm:px-4"
                  }
                >
                  {recommended ? (
                    <span className="pointer-events-none absolute -top-2 left-3 rounded-full bg-slate-900 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide text-white">
                      {campaignRecommended ? "Voor jullie" : "Populair"}
                    </span>
                  ) : null}
                  <span
                    className={
                      selected
                        ? "text-[11px] font-bold uppercase tracking-[0.14em] text-[#FF5722]"
                        : "text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400"
                    }
                  >
                    {pkg.ladderLabel}
                  </span>
                  <span className="mt-0.5 text-sm font-extrabold tracking-tight text-slate-900">
                    €{tierAmount(pkg)}
                    <span className="text-[11px] font-semibold text-slate-400">
                      /m
                    </span>
                  </span>
                </button>
                {i < packages.length - 1 ? (
                  <ArrowRight
                    className="hidden size-3.5 shrink-0 text-slate-300 sm:block"
                    aria-hidden
                  />
                ) : null}
              </div>
            );
          })}
        </div>

        <div
          className="mt-4 min-h-[4.5rem] rounded-2xl border border-slate-200/90 bg-white/80 px-4 py-3.5 shadow-[0_10px_30px_-22px_rgba(15,23,42,0.35)] sm:px-5 sm:py-4"
          aria-live="polite"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={displayTier}
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: EASE }}
            >
              <p className="text-base font-extrabold tracking-tight text-slate-900 sm:text-lg">
                {punch.line}
              </p>
              <p className="mt-1 text-sm leading-snug text-slate-500">
                {punch.detail}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <aside className="mt-8 lg:col-span-5 lg:mt-0 lg:pt-8">
        <div className="rounded-3xl border border-slate-200/90 bg-white p-4 shadow-[0_20px_50px_-32px_rgba(15,23,42,0.35)] sm:p-5">
          {promo ? (
            <div className="flex gap-3 rounded-2xl border border-[#FF5722]/15 bg-gradient-to-br from-[#FF5722]/[0.07] to-[#fff8f5] px-4 py-3.5">
              <Sparkles
                className="mt-0.5 size-4 shrink-0 text-[#FF5722]"
                aria-hidden
              />
              <div className="min-w-0">
                <p className="text-sm font-bold leading-snug text-slate-900">
                  {promo.note}
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                  {termDisclaimer}
                </p>
              </div>
            </div>
          ) : (
            <p className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-500">
              {termDisclaimer}
            </p>
          )}

          <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
            <div className="flex h-full gap-2.5 rounded-xl border border-slate-100 bg-slate-50/80 px-3.5 py-3">
              <Globe
                className="mt-0.5 size-4 shrink-0 text-[#FF5722]/70"
                aria-hidden
              />
              <p className="text-[12px] leading-snug text-slate-700 sm:text-[13px]">
                {includedInfraNote}
              </p>
            </div>
            <div className="flex h-full gap-2.5 rounded-xl border border-slate-100 bg-slate-50/80 px-3.5 py-3">
              <Wrench
                className="mt-0.5 size-4 shrink-0 text-[#FF5722]/70"
                aria-hidden
              />
              <p className="text-[12px] leading-snug text-slate-600 sm:text-[13px]">
                {includedCareNote}
              </p>
            </div>
          </div>

          <p className="mt-3 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            Tik een trede · scroll naar het pakket
          </p>
        </div>
      </aside>
    </div>
  );
}
