"use client";

import { motion, useReducedMotion } from "framer-motion";
import { PillarHubMeneerQuip } from "@/components/pillars/premium/PillarHubMeneerQuip";

export interface BlueprintStageVisual {
  readonly href: string;
  readonly label: string;
  readonly emoji: string;
  readonly widthPct: number;
}

interface BuildBlueprintIllustrationProps {
  readonly stages: readonly BlueprintStageVisual[];
  readonly activeHref: string | null;
  readonly quip: string;
}

/**
 * Speelse bouwtekening: site-lagen die syncen met de dienstenlijst.
 */
export function BuildBlueprintIllustration({
  stages,
  activeHref,
  quip,
}: BuildBlueprintIllustrationProps) {
  const reduce = useReducedMotion();
  const activeIndex = stages.findIndex((s) => s.href === activeHref);

  return (
    <div className="relative mx-auto w-full max-w-md">
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_80%_18%,rgba(56,189,248,0.12),transparent_55%)]"
        aria-hidden
      />

      <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-gradient-to-b from-slate-50 to-white p-5 shadow-[0_24px_48px_-28px_rgba(15,23,42,0.18)] sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF5722]">
              bouwtekening.plan
            </p>
            <p className="mt-0.5 text-sm font-extrabold tracking-tight text-slate-900">
              Wat zit er in jouw build?
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-[10px] font-bold text-sky-700">
            From scratch
          </span>
        </div>

        <div
          className="mt-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm"
          aria-hidden
        >
          <span className="flex gap-1">
            <span className="size-2 rounded-full bg-rose-300" />
            <span className="size-2 rounded-full bg-amber-300" />
            <span className="size-2 rounded-full bg-emerald-300" />
          </span>
          <span className="h-2 flex-1 rounded-full bg-slate-100" />
          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-500">
            preview
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
                      ? "border-sky-200/80 bg-sky-50/60 opacity-95"
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
                    {isActive ? <StagePreview href={stage.href} /> : null}
                  </span>
                </span>
                {isActive ? (
                  <motion.span
                    layoutId="blueprint-dot"
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
            <rect x="28" y="8" width="64" height="24" rx="4" fill="none" stroke="currentColor" strokeWidth="2.5" />
            <path
              d="M36 28 L48 18 L60 24 L72 14 L84 22"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="text-[10px] font-bold uppercase tracking-wider text-sky-600">
            Klaar om te schalen
          </p>
        </div>

        <PillarHubMeneerQuip quip={quip} />
      </div>
    </div>
  );
}

function StagePreview({ href }: { href: string }) {
  switch (href) {
    case "/diensten/webdevelopment":
      return (
        <span className="mt-0.5 flex items-center gap-1" aria-hidden>
          <span className="size-1.5 rounded bg-slate-700" />
          <span className="h-1 w-10 rounded-full bg-slate-200" />
        </span>
      );
    case "/diensten/shopify-enterprise":
      return (
        <span className="mt-0.5 flex gap-0.5" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span key={i} className="size-2 rounded-sm bg-slate-200" />
          ))}
        </span>
      );
    case "/diensten/web-apps":
      return (
        <span className="mt-0.5 block text-[9px] font-semibold text-slate-500" aria-hidden>
          Portaal & rollen
        </span>
      );
    case "/diensten/optimalisatie":
      return (
        <span className="mt-0.5 text-[9px] font-bold text-emerald-600" aria-hidden>
          0,8s laadtijd
        </span>
      );
    case "/diensten/webdesign":
      return (
        <span className="mt-0.5 inline-block h-1.5 w-12 rounded-full bg-[#FF5722]/70" aria-hidden />
      );
    case "/diensten/branding":
      return (
        <span className="mt-0.5 flex gap-0.5" aria-hidden>
          {["#FF5722", "#38BDF8", "#0F172A"].map((c) => (
            <span
              key={c}
              className="size-2 rounded-full border border-white"
              style={{ backgroundColor: c }}
            />
          ))}
        </span>
      );
    case "/diensten/animaties":
      return (
        <span className="mt-0.5 text-[9px] text-violet-600" aria-hidden>
          ✨ micro-motion
        </span>
      );
    default:
      return null;
  }
}
