"use client";

import { motion, useReducedMotion } from "framer-motion";
import { PillarHubMeneerQuip } from "@/components/pillars/premium/PillarHubMeneerQuip";

export interface FunnelStageVisual {
  readonly href: string;
  readonly label: string;
  readonly emoji: string;
  readonly widthPct: number;
}

interface CampaignFunnelIllustrationProps {
  readonly stages: readonly FunnelStageVisual[];
  readonly activeHref: string | null;
  readonly quip: string;
}

/**
 * Speelse funnel-illustratie: Meneer stuurt budget door de slakkenbuis.
 */
export function CampaignFunnelIllustration({
  stages,
  activeHref,
  quip,
}: CampaignFunnelIllustrationProps) {
  const reduce = useReducedMotion();
  const activeIndex = stages.findIndex((s) => s.href === activeHref);

  return (
    <div className="relative mx-auto w-full max-w-md">
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_30%_20%,rgba(255,87,34,0.12),transparent_55%)]"
        aria-hidden
      />

      <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-gradient-to-b from-slate-50 to-white p-5 shadow-[0_24px_48px_-28px_rgba(15,23,42,0.18)] sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF5722]">
              budget.slakkenbuis
            </p>
            <p className="mt-0.5 text-sm font-extrabold tracking-tight text-slate-900">
              Waar gaat je euro naartoe?
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
            ROAS aan
          </span>
        </div>

        <div className="relative mt-6 flex flex-col items-center gap-1.5">
          {stages.map((stage, index) => {
            const isActive = activeHref === stage.href;
            const isPast = activeIndex >= 0 && index < activeIndex;
            return (
              <motion.div
                key={stage.href}
                animate={
                  reduce
                    ? undefined
                    : {
                        scale: isActive ? 1.03 : 1,
                        y: isActive ? -2 : 0,
                      }
                }
                transition={{ type: "spring", stiffness: 420, damping: 28 }}
                className={[
                  "relative flex h-11 items-center justify-between gap-2 rounded-xl border px-3 transition-colors duration-300 sm:h-12 sm:px-4",
                  isActive
                    ? "border-[#FF5722]/50 bg-[#FF5722]/10 shadow-[0_8px_24px_-12px_rgba(255,87,34,0.45)]"
                    : isPast
                      ? "border-slate-200 bg-white/80 opacity-90"
                      : "border-slate-200/80 bg-white/60 opacity-80",
                ].join(" ")}
                style={{ width: `${stage.widthPct}%` }}
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span className="text-base leading-none" aria-hidden>
                    {stage.emoji}
                  </span>
                  <span
                    className={`truncate text-xs font-extrabold sm:text-[13px] ${
                      isActive ? "text-[#FF5722]" : "text-slate-800"
                    }`}
                  >
                    {stage.label}
                  </span>
                </span>
                {isActive ? (
                  <motion.span
                    layoutId="funnel-dot"
                    className="size-2 shrink-0 rounded-full bg-[#FF5722]"
                    aria-hidden
                  />
                ) : (
                  <span className="size-2 shrink-0 rounded-full bg-slate-200" aria-hidden />
                )}
              </motion.div>
            );
          })}

          <svg
            viewBox="0 0 120 40"
            className="mt-2 h-8 w-24 text-emerald-500"
            aria-hidden
          >
            <path
              d="M10 28 L30 18 L50 24 L70 12 L90 20 L110 8"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="110" cy="8" r="3" fill="currentColor" />
          </svg>
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
            Omzet (hopelijk)
          </p>
        </div>

        <PillarHubMeneerQuip quip={quip} />
      </div>
    </div>
  );
}
