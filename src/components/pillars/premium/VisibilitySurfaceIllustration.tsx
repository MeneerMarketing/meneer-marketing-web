"use client";

import { motion, useReducedMotion } from "framer-motion";
import { PillarHubMeneerQuip } from "@/components/pillars/premium/PillarHubMeneerQuip";

export interface SurfaceStageVisual {
  readonly href: string;
  readonly label: string;
  readonly emoji: string;
  readonly widthPct: number;
}

interface VisibilitySurfaceIllustrationProps {
  readonly stages: readonly SurfaceStageVisual[];
  readonly activeHref: string | null;
  readonly quip: string;
}

/**
 * Speels zoeklandschap: SERP-lagen die syncen met de dienstenlijst.
 */
export function VisibilitySurfaceIllustration({
  stages,
  activeHref,
  quip,
}: VisibilitySurfaceIllustrationProps) {
  const reduce = useReducedMotion();
  const activeIndex = stages.findIndex((s) => s.href === activeHref);

  return (
    <div className="relative mx-auto w-full max-w-md">
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_20%_25%,rgba(16,185,129,0.12),transparent_55%)]"
        aria-hidden
      />

      <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-gradient-to-b from-slate-50 to-white p-5 shadow-[0_24px_48px_-28px_rgba(15,23,42,0.18)] sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF5722]">
              zoeklandschap.live
            </p>
            <p className="mt-0.5 text-sm font-extrabold tracking-tight text-slate-900">
              Waar word jij gevonden?
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
            Organisch aan
          </span>
        </div>

        <div
          className="mt-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm"
          aria-hidden
        >
          <span className="text-sm text-slate-400">🔍</span>
          <span className="h-2 flex-1 rounded-full bg-slate-100" />
          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-500">
            Google
          </span>
        </div>

        <div className="relative mt-5 flex flex-col items-center gap-1.5">
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
                  "relative flex min-h-11 items-center justify-between gap-2 rounded-xl border px-3 transition-colors duration-300 sm:min-h-12 sm:px-4",
                  isActive
                    ? "border-[#FF5722]/50 bg-[#FF5722]/10 shadow-[0_8px_24px_-12px_rgba(255,87,34,0.45)]"
                    : isPast
                      ? "border-emerald-200/80 bg-emerald-50/60 opacity-95"
                      : "border-slate-200/80 bg-white/60 opacity-80",
                ].join(" ")}
                style={{ width: `${stage.widthPct}%` }}
              >
                <span className="flex min-w-0 flex-1 items-center gap-2">
                  <span className="text-base leading-none" aria-hidden>
                    {stage.emoji}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block truncate text-xs font-extrabold sm:text-[13px] ${
                        isActive ? "text-[#FF5722]" : "text-slate-800"
                      }`}
                    >
                      {stage.label}
                    </span>
                    {isActive ? (
                      <StagePreview href={stage.href} />
                    ) : null}
                  </span>
                </span>
                {isActive ? (
                  <motion.span
                    layoutId="surface-dot"
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
            viewBox="0 0 120 36"
            className="mt-2 h-8 w-28 text-emerald-500"
            aria-hidden
          >
            <circle cx="60" cy="18" r="14" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.35" />
            <circle cx="60" cy="18" r="8" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.55" />
            <circle cx="60" cy="18" r="3" fill="currentColor" />
            <path
              d="M60 4 L60 10 M60 26 L60 32 M46 18 L52 18 M68 18 L74 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
            Vindbaar (overal waar het telt)
          </p>
        </div>

        <PillarHubMeneerQuip quip={quip} />
      </div>
    </div>
  );
}

function StagePreview({ href }: { href: string }) {
  switch (href) {
    case "/diensten/seo":
      return (
        <span className="mt-0.5 flex items-center gap-1" aria-hidden>
          <span className="size-1 rounded-full bg-[#FF5722]" />
          <span className="h-1 w-12 rounded-full bg-emerald-300" />
        </span>
      );
    case "/diensten/ai-zoek":
      return (
        <span className="mt-0.5 block truncate text-[9px] font-semibold text-sky-600" aria-hidden>
          AI: jij in het antwoord
        </span>
      );
    case "/diensten/local-seo":
      return (
        <span className="mt-0.5 text-[9px] font-bold text-emerald-600" aria-hidden>
          📍 Maps pack
        </span>
      );
    case "/diensten/content-marketing":
      return (
        <span className="mt-0.5 block h-1 w-10 rounded-full bg-slate-200" aria-hidden />
      );
    case "/diensten/reviews":
      return (
        <span className="mt-0.5 text-[9px] text-amber-500" aria-hidden>
          ★★★★★ 4,9
        </span>
      );
    default:
      return null;
  }
}
