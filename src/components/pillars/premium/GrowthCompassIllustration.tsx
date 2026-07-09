"use client";

import { motion, useReducedMotion } from "framer-motion";
import { PillarHubMeneerQuip } from "@/components/pillars/premium/PillarHubMeneerQuip";

export interface CompassStageVisual {
  readonly href: string;
  readonly label: string;
  readonly emoji: string;
  readonly widthPct: number;
}

interface GrowthCompassIllustrationProps {
  readonly stages: readonly CompassStageVisual[];
  readonly activeHref: string | null;
  readonly quip: string;
}

/**
 * Speels groeikompas: plan bovenaan, data als fundament, Meneer-quip onderaan.
 */
export function GrowthCompassIllustration({
  stages,
  activeHref,
  quip,
}: GrowthCompassIllustrationProps) {
  const reduce = useReducedMotion();
  const activeIndex = stages.findIndex((s) => s.href === activeHref);

  return (
    <div className="relative mx-auto w-full max-w-md">
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_75%_20%,rgba(56,189,248,0.12),transparent_55%)]"
        aria-hidden
      />

      <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-gradient-to-b from-slate-50 to-white p-5 shadow-[0_24px_48px_-28px_rgba(15,23,42,0.18)] sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF5722]">
              groeikompas.map
            </p>
            <p className="mt-0.5 text-sm font-extrabold tracking-tight text-slate-900">
              Waar zit jouw volgende euro?
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-[10px] font-bold text-sky-700">
            Plan aan
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
                      ? "border-sky-200/80 bg-sky-50/60 opacity-95"
                      : "border-slate-200/80 bg-white/60 opacity-80",
                ].join(" ")}
                style={{ width: `${stage.widthPct}%` }}
              >
                <span className="flex min-w-0 items-center gap-2">
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
                    layoutId="compass-dot"
                    className="size-2 shrink-0 rounded-full bg-[#FF5722]"
                    aria-hidden
                  />
                ) : (
                  <span
                    className={`size-2 shrink-0 rounded-full ${
                      isPast ? "bg-sky-400" : "bg-slate-200"
                    }`}
                    aria-hidden
                  />
                )}
              </motion.div>
            );
          })}

          <svg
            viewBox="0 0 120 40"
            className="mt-2 h-8 w-24 text-sky-500"
            aria-hidden
          >
            <path
              d="M60 6 L72 34 L60 28 L48 34 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <circle cx="60" cy="22" r="3" fill="currentColor" />
          </svg>
          <p className="text-[10px] font-bold uppercase tracking-wider text-sky-600">
            Groei (meetbaar bijgestuurd)
          </p>
        </div>

        <PillarHubMeneerQuip quip={quip} />
      </div>
    </div>
  );
}
