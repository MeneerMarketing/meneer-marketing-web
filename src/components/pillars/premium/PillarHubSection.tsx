"use client";

import type { ReactNode } from "react";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";

interface PillarHubSectionProps {
  "aria-labelledby": string;
  children: ReactNode;
}

/**
 * Gedeelde donkere hub-sectie: effen slate-950 met groot mascotte-hoofd
 * half afgesneden rechtsonder. Zelfde basis op alle hoofddienst-pagina's.
 */
export function PillarHubSection({
  "aria-labelledby": labelledBy,
  children,
}: PillarHubSectionProps) {
  return (
    <section
      className="relative overflow-hidden border-b border-slate-800 bg-slate-950"
      aria-labelledby={labelledBy}
    >
      {/* Mascotte: peek rechtsonder, ogen en hoed zichtbaar */}
      <div
        className="pointer-events-none absolute -right-[2%] bottom-0 z-0 translate-x-[8%] translate-y-[18%] select-none sm:translate-x-[6%] sm:translate-y-[14%] lg:translate-y-[12%]"
        aria-hidden
      >
        <div className="relative">
          <div
            className="absolute left-[42%] top-[38%] h-[42%] w-[42%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF5722]/18 blur-3xl"
            aria-hidden
          />
          <InteractiveLogo className="relative h-[min(82vw,560px)] w-[min(82vw,560px)] opacity-[0.19] saturate-[0.9] sm:opacity-[0.22] lg:h-[600px] lg:w-[600px] lg:opacity-[0.24]" />
        </div>
      </div>
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-36 w-72 -translate-x-1/2 rounded-full bg-[#FF5722]/8 blur-3xl"
        aria-hidden
      />
      <div className="relative z-10">{children}</div>
    </section>
  );
}

interface PillarHubCanvasProps {
  barTitle: string;
  barStatus?: string;
  aspectClass?: string;
  children: ReactNode;
}

/**
 * Minimalistisch canvas voor hub-kaarten op donkere secties.
 */
export function PillarHubCanvas({
  barTitle,
  barStatus,
  aspectClass = "aspect-[4/3]",
  children,
}: PillarHubCanvasProps) {
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-900 shadow-[0_24px_48px_-24px_rgba(0,0,0,0.55)]">
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
        <span className="size-2 rounded-full bg-[#FF5722]/75" aria-hidden />
        <span className="size-2 rounded-full bg-amber-400/75" aria-hidden />
        <span className="size-2 rounded-full bg-emerald-400/75" aria-hidden />
        <span className="ml-2 font-mono text-[10px] tracking-wide text-slate-500">
          {barTitle}
        </span>
        {barStatus ? (
          <span className="ml-auto font-mono text-[10px] text-slate-500">{barStatus}</span>
        ) : null}
      </div>
      <div className={`relative w-full ${aspectClass} bg-slate-900`}>{children}</div>
    </div>
  );
}

/** Gedeelde zone-knop stijlen voor hub-canvas */
export function hubZoneClass(isActive: boolean, isDimmed: boolean): string {
  const base =
    "absolute rounded-xl border transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5722]";
  if (isActive) {
    return `${base} z-10 scale-[1.02] border-[#FF5722]/80 bg-white shadow-[0_8px_32px_-12px_rgba(255,87,34,0.35)]`;
  }
  if (isDimmed) {
    return `${base} scale-[0.97] border-white/[0.06] bg-white/[0.02] opacity-20`;
  }
  return `${base} border-white/[0.1] bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.06]`;
}

/** Gedeelde diensten-link stijl in donkere hub-kolom */
export function hubServiceLinkClass(isActive: boolean): string {
  const base =
    "group flex w-full flex-col justify-center gap-1 rounded-2xl border px-4 py-3.5 transition-all duration-300 sm:flex-row sm:items-center sm:gap-3.5";
  if (isActive) {
    return `${base} border-[#FF5722]/40 bg-white/[0.08] shadow-[inset_0_0_0_1px_rgba(255,87,34,0.15)]`;
  }
  return `${base} border-white/[0.08] bg-white/[0.03] hover:border-white/15 hover:bg-white/[0.05]`;
}
