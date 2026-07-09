"use client";

import { motion, useReducedMotion } from "framer-motion";
import { PillarHubMeneerQuip } from "@/components/pillars/premium/PillarHubMeneerQuip";

export interface RetentionStageVisual {
  readonly href: string;
  readonly label: string;
  readonly emoji: string;
  readonly widthPct: number;
}

interface RetentionLoopIllustrationProps {
  readonly stages: readonly RetentionStageVisual[];
  readonly activeHref: string | null;
  readonly quip: string;
}

/**
 * Speelse klantmotor: LTV groeit per laag, onderaan de herhaal-loop.
 */
export function RetentionLoopIllustration({
  stages,
  activeHref,
  quip,
}: RetentionLoopIllustrationProps) {
  const reduce = useReducedMotion();
  const activeIndex = stages.findIndex((s) => s.href === activeHref);

  return (
    <div className="relative mx-auto w-full max-w-md">
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_70%_15%,rgba(255,87,34,0.1),transparent_55%)]"
        aria-hidden
      />

      <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-gradient-to-b from-slate-50 to-white p-5 shadow-[0_24px_48px_-28px_rgba(15,23,42,0.18)] sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF5722]">
              klant.motor
            </p>
            <p className="mt-0.5 text-sm font-extrabold tracking-tight text-slate-900">
              Waar lekt je marge na koop één?
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-[10px] font-bold text-violet-700">
            LTV aan
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
                      ? "border-emerald-200/80 bg-emerald-50/60 opacity-95"
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
                    layoutId="retention-dot"
                    className="size-2 shrink-0 rounded-full bg-[#FF5722]"
                    aria-hidden
                  />
                ) : (
                  <span
                    className={`size-2 shrink-0 rounded-full ${
                      isPast ? "bg-emerald-400" : "bg-slate-200"
                    }`}
                    aria-hidden
                  />
                )}
              </motion.div>
            );
          })}

          <svg
            viewBox="0 0 120 48"
            className="mt-2 h-10 w-28 text-[#FF5722]"
            aria-hidden
          >
            <path
              d="M60 8 C36 8 18 22 18 38 C18 42 22 44 26 42 C30 40 32 36 32 32 C32 24 44 16 60 16 C76 16 88 24 88 32 C88 36 90 40 94 42 C98 44 102 42 102 38 C102 22 84 8 60 8 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M94 38 L102 38 L98 32"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#FF5722]">
            Herhaalaankoop (als het goed zit)
          </p>
        </div>

        <PillarHubMeneerQuip quip={quip} />
      </div>
    </div>
  );
}
