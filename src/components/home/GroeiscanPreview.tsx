"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { GroeiscanGardenVisual } from "@/components/groeiscan/GroeiscanGardenVisual";
import { GroeiscanMeneerCoach } from "@/components/groeiscan/GroeiscanMeneerCoach";
import { siteCtas } from "@/lib/cta";
import {
  GROEISCAN_GOALS,
  type GroeiscanGoalId,
  computeActiveFloors,
  computeGrowthTier,
  computePlaygroundInsight,
  computePlaygroundScore,
  formatBudgetTier,
  getMeneerCoachLine,
} from "@/lib/groeiscan-playground";

/**
 * Compacte Groeiscan-teaser voor de homepage.
 */
export function GroeiscanPreview() {
  const reduce = useReducedMotion();
  const [goal, setGoal] = useState<GroeiscanGoalId>("revenue");
  const [budgetTier, setBudgetTier] = useState(2);

  const input = useMemo(
    () => ({
      goal,
      budgetTier,
      maturity: 5,
      frictionHours: 6,
      channelIds: new Set<string>(["seo"]),
    }),
    [goal, budgetTier],
  );

  const score = useMemo(() => computePlaygroundScore(input), [input]);
  const growthTier = useMemo(() => computeGrowthTier(score), [score]);
  const insight = useMemo(() => computePlaygroundInsight(input), [input]);
  const activeFloors = useMemo(() => computeActiveFloors(input), [input]);
  const coachLine = getMeneerCoachLine("goal", { goal });

  return (
    <div className="relative overflow-hidden rounded-[1.35rem] border border-slate-200 bg-white shadow-[0_28px_56px_-28px_rgba(15,23,42,0.15)]">
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full opacity-40"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern id="preview-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#CBD5E1" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#preview-grid)" />
      </svg>

      <div className="relative flex items-center gap-2 border-b border-slate-100 px-4 py-3">
        <span className="size-2 rounded-full bg-[#FF5722]" aria-hidden />
        <span className="size-2 rounded-full bg-emerald-400" aria-hidden />
        <span className="size-2 rounded-full bg-sky-400" aria-hidden />
        <span className="ml-2 font-mono text-[10px] text-slate-400">groeituin.scan</span>
        <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-700">
          <Sparkles className="size-3" aria-hidden />
          Live
        </span>
      </div>

      <div className="relative space-y-4 p-5 sm:p-6">
        <GroeiscanGardenVisual
          activeFloors={activeFloors}
          score={score}
          growthLabel={growthTier.label}
          frictionHours={input.frictionHours}
          channelIds={input.channelIds}
          compact
        />

        <fieldset>
          <legend className="text-center text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Kies je zaad
          </legend>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {GROEISCAN_GOALS.map((g) => {
              const Icon = g.icon;
              const active = goal === g.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setGoal(g.id)}
                  aria-pressed={active}
                  className={`flex items-center gap-2 rounded-xl border px-2.5 py-2.5 text-left transition-all ${
                    active
                      ? "border-[#FF5722] bg-orange-50 ring-1 ring-[#FF5722]/20"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <span
                    className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
                      active ? "bg-[#FF5722] text-white" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <Icon className="size-4" strokeWidth={1.8} aria-hidden />
                  </span>
                  <span className="min-w-0 text-[11px] font-bold leading-tight text-slate-900">
                    {g.label}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="rounded-xl border border-sky-100 bg-sky-50/50 p-3">
          <div className="flex items-center justify-between gap-2 text-xs">
            <label htmlFor="groeiscan-preview-budget" className="font-bold text-slate-700">
              Groeivoeding
            </label>
            <output htmlFor="groeiscan-preview-budget" className="font-bold text-[#FF5722]">
              {formatBudgetTier(budgetTier)}
            </output>
          </div>
          <input
            id="groeiscan-preview-budget"
            type="range"
            min={0}
            max={4}
            step={1}
            value={budgetTier}
            onChange={(e) => setBudgetTier(Number(e.target.value))}
            className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-sky-100 accent-[#FF5722]"
          />
        </div>

        <GroeiscanMeneerCoach message={coachLine} compact theme="light" />

        <AnimatePresence mode="wait">
          <motion.div
            key={`${goal}-${budgetTier}-${insight.headline}`}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
            className="rounded-xl border border-slate-200 bg-slate-50 p-3.5"
          >
            <p className="text-sm font-extrabold text-slate-900">{insight.headline}</p>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{insight.sub}</p>
          </motion.div>
        </AnimatePresence>

        <Link
          href={siteCtas.groeiscan.href}
          className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-900 transition hover:border-[#FF5722] hover:text-[#FF5722]"
        >
          Open volledige groeituin
          <ArrowUpRight className="size-4" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
