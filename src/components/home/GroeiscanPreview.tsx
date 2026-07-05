"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Play } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { GroeiscanKrachtBar } from "@/components/groeiscan/GroeiscanKrachtBar";
import { GroeiscanMeneerCoach } from "@/components/groeiscan/GroeiscanMeneerCoach";
import { siteCtas } from "@/lib/cta";
import {
  GROEISCAN_GOALS,
  GROEISCAN_SUBDIENSTEN,
  type GroeiscanGoalId,
  computeGroeikrachtBreakdown,
  computeGrowthTier,
  computePillarProgress,
  computePlaygroundInsight,
  getMeneerCoachLine,
} from "@/lib/groeiscan-playground";

/** Compacte Groeiscan-teaser voor de homepage. */
export function GroeiscanPreview() {
  const reduce = useReducedMotion();
  const [goal, setGoal] = useState<GroeiscanGoalId>("revenue");
  const [dienstIds, setDienstIds] = useState<Set<string>>(
    () => new Set(["seo", "strategie", "webdevelopment"]),
  );

  const input = useMemo(
    () => ({
      goal,
      budgetTier: 2,
      maturity: 5,
      friction: "some" as const,
      frictionHours: 6,
      dienstIds,
    }),
    [goal, dienstIds],
  );

  const breakdown = useMemo(() => computeGroeikrachtBreakdown(input), [input]);
  const score = breakdown.total;
  const growthTier = useMemo(() => computeGrowthTier(score), [score]);
  const insight = useMemo(() => computePlaygroundInsight(input), [input]);
  const pillarProgress = useMemo(() => computePillarProgress(dienstIds), [dienstIds]);
  const coachLine = getMeneerCoachLine("goal", { goal });

  const toggleDienst = (id: string) => {
    setDienstIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const quickPicks = GROEISCAN_SUBDIENSTEN.filter((d) =>
    ["seo", "google-ads", "webdevelopment", "email", "strategie", "automatisering"].includes(
      d.id,
    ),
  );

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
        <span className="ml-2 font-mono text-[10px] text-slate-400">groeiscan.live</span>
        <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#FF5722]">
          <Play className="size-3" aria-hidden />
          Live
        </span>
      </div>

      <div className="relative space-y-4 p-5 sm:p-6">
        <GroeiscanKrachtBar
          score={score}
          growthLabel={growthTier.label}
          breakdown={breakdown}
          pillarProgress={pillarProgress}
          compact
          showPillarDetail={false}
        />

        <fieldset>
          <legend className="text-center text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Hoofddoel
          </legend>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {GROEISCAN_GOALS.map((g) => {
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
                    className={`flex size-8 shrink-0 items-center justify-center rounded-lg text-sm ${
                      active ? "bg-[#FF5722] text-white" : "bg-slate-100"
                    }`}
                  >
                    {g.emoji}
                  </span>
                  <span className="min-w-0 text-[11px] font-bold leading-tight text-slate-900">
                    {g.label}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <div>
          <p className="text-center text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Stack togglen
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {quickPicks.map((d) => {
              const on = dienstIds.has(d.id);
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => toggleDienst(d.id)}
                  aria-pressed={on}
                  className={`rounded-lg border px-2 py-1 text-[10px] font-bold transition ${
                    on
                      ? "border-[#FF5722] bg-[#FF5722] text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {d.label}
                </button>
              );
            })}
          </div>
        </div>

        <GroeiscanMeneerCoach message={coachLine} compact theme="light" />

        <AnimatePresence mode="wait">
          <motion.div
            key={`${goal}-${score}-${insight.headline}`}
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
          Open volledige Groeiscan
          <ArrowUpRight className="size-4" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
