"use client";

import { ArrowLeft } from "lucide-react";

import type { VerticalCampaignPersonalization } from "@/data/verticals/types";
import { packageKeyLabel } from "@/lib/lge/package-map";

interface HuidkliniekCampaignBarProps {
  personalization: VerticalCampaignPersonalization;
}

function reservationCopy(
  city: string | undefined,
  status: string | undefined,
): string | null {
  if (!city || !status) return null;
  if (status === "RESERVED") {
    return `Voor dit traject houden we ${city} momenteel voor jullie gereserveerd.`;
  }
  if (status === "EXCLUSIVE") {
    return `${city} valt binnen jullie exclusieve Huidkliniek-traject.`;
  }
  return null;
}

export function HuidkliniekCampaignBar({ personalization }: HuidkliniekCampaignBarProps) {
  const name = personalization.businessName?.trim();
  const city = personalization.city?.trim();
  if (!name) return null;

  const eyebrow = city
    ? `Voor ${name} · ${city}`
    : `Voor ${name}`;
  const reservation = reservationCopy(city, personalization.cityStatus);
  const recommended = personalization.recommendedPackage
    ? packageKeyLabel(personalization.recommendedPackage)
    : null;

  return (
    <aside
      className="relative z-20 border-b border-orange-500/25 bg-[#0c1222] text-white"
      aria-label="Persoonlijk concept"
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "linear-gradient(90deg, rgba(255,87,34,0.18) 0%, transparent 55%)",
        }}
      />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5 lg:px-8">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-orange-300 sm:text-[11px]">
            {eyebrow}
          </p>
          <p className="mt-1.5 text-sm font-semibold tracking-tight text-white sm:text-base">
            Jullie persoonlijke concept staat klaar.
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-300">
            {recommended ? (
              <span>
                Voor jullie adviseren we{" "}
                <span className="font-semibold text-white">{recommended}</span>.
              </span>
            ) : null}
            {reservation ? (
              <span className="text-sky-200/90">{reservation}</span>
            ) : null}
          </div>
        </div>

        {personalization.previewHref ? (
          <a
            href={personalization.previewHref}
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-2xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-bold text-white transition hover:border-orange-300/50 hover:bg-white/10 sm:self-center"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Terug naar jullie ontwerp
          </a>
        ) : null}
      </div>
    </aside>
  );
}
