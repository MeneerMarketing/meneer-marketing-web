"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Globe, Sparkles, Wrench } from "lucide-react";
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
  string
> = {
  "studio-edition": "Salonized erop · live in 5 werkdagen",
  "local-growth": "Huidproblemen-landings die intakes binnenhalen",
  "growth-partner": "Shopify shop + Google & Meta Ads",
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

function getTierPunch(tier: VerticalInterestId): string {
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

function shortLadderLabel(label: string): string {
  return label
    .replace("Website + ", "")
    .replace("Complete groei + shop", "Shop + groei");
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
    <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-8 xl:gap-x-10">
      <div className="lg:col-span-7">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF5722]">
            Pakketten
          </p>
          {promo ? (
            <span className="rounded-full bg-[#FF5722] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
              {promo.badge}
            </span>
          ) : null}
        </div>

        <h2
          id={headingId}
          className="mt-2.5 text-[clamp(1.5rem,3.2vw,2.45rem)] font-extrabold leading-[1.08] tracking-tight text-slate-900"
        >
          Drie treden.{" "}
          <span className="text-slate-400">Één partner</span>{" "}
          <span className="text-[#FF5722]">die meegroeit.</span>
        </h2>

        <p className="mt-2.5 max-w-xl text-sm leading-snug text-slate-600 sm:text-[15px]">
          Jij kiest het tempo.
          {campaignRecommended
            ? " Op basis van jullie site ligt één pakket het dichtst bij."
            : " Local Growth is waar de meeste klinieken landen."}
        </p>

        <div className="mt-4" role="tablist" aria-label="Kies een trede">
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
            {packages.map((pkg) => {
              const selected = displayTier === pkg.id;
              const recommended = campaignRecommended
                ? campaignRecommended === pkg.id
                : Boolean(pkg.recommended);

              return (
                <button
                  key={pkg.id}
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
                      ? "relative rounded-xl border-2 border-[#FF5722] bg-white px-2 py-2.5 text-left shadow-[0_10px_28px_-16px_rgba(255,87,34,0.5)] transition sm:px-3 sm:py-3"
                      : "relative rounded-xl border border-slate-200 bg-white/90 px-2 py-2.5 text-left transition hover:border-slate-300 sm:px-3 sm:py-3"
                  }
                >
                  {recommended ? (
                    <span className="pointer-events-none absolute -top-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-slate-900 px-1.5 py-px text-[7px] font-bold uppercase tracking-wide text-white sm:text-[8px]">
                      {campaignRecommended ? "Voor jullie" : "Populair"}
                    </span>
                  ) : null}
                  <span
                    className={
                      selected
                        ? "block text-[9px] font-bold uppercase leading-tight tracking-[0.12em] text-[#FF5722] sm:text-[10px]"
                        : "block text-[9px] font-bold uppercase leading-tight tracking-[0.12em] text-slate-400 sm:text-[10px]"
                    }
                  >
                    {shortLadderLabel(pkg.ladderLabel)}
                  </span>
                  <span className="mt-1 block text-base font-extrabold leading-none tracking-tight text-slate-900 sm:text-lg">
                    €{tierAmount(pkg)}
                    <span className="text-[10px] font-semibold text-slate-400">/m</span>
                  </span>
                </button>
              );
            })}
          </div>

          <p
            className="mt-2 flex min-h-[1.25rem] items-center gap-2 text-xs font-semibold text-slate-500 sm:text-[13px]"
            aria-live="polite"
          >
            <span className="size-1.5 shrink-0 rounded-full bg-[#FF5722]" aria-hidden />
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={displayTier}
                initial={reduce ? false : { opacity: 0, x: 4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduce ? undefined : { opacity: 0, x: -4 }}
                transition={{ duration: 0.18, ease: EASE }}
                className="text-pretty text-slate-700"
              >
                {punch}
              </motion.span>
            </AnimatePresence>
          </p>
        </div>
      </div>

      <aside className="mt-5 lg:col-span-5 lg:mt-0">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-[0_12px_36px_-28px_rgba(15,23,42,0.35)] sm:p-4">
          {promo ? (
            <div className="flex gap-2.5 rounded-xl border border-[#FF5722]/15 bg-gradient-to-r from-[#FF5722]/[0.06] to-white px-3 py-2.5">
              <Sparkles className="mt-0.5 size-3.5 shrink-0 text-[#FF5722]" aria-hidden />
              <div className="min-w-0">
                <p className="text-[13px] font-bold leading-snug text-slate-900">
                  {promo.note}
                </p>
                <p className="mt-0.5 text-[11px] leading-snug text-slate-500">
                  {termDisclaimer}
                </p>
              </div>
            </div>
          ) : (
            <p className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-[11px] leading-snug text-slate-500">
              {termDisclaimer}
            </p>
          )}

          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <div className="flex gap-2 rounded-lg border border-slate-100 bg-slate-50/80 px-2.5 py-2">
              <Globe className="mt-0.5 size-3.5 shrink-0 text-[#FF5722]/70" aria-hidden />
              <p className="text-[11px] leading-snug text-slate-700">{includedInfraNote}</p>
            </div>
            <div className="flex gap-2 rounded-lg border border-slate-100 bg-slate-50/80 px-2.5 py-2">
              <Wrench className="mt-0.5 size-3.5 shrink-0 text-[#FF5722]/70" aria-hidden />
              <p className="text-[11px] leading-snug text-slate-600">{includedCareNote}</p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
