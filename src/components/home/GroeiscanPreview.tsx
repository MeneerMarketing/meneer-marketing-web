"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { siteCtas } from "@/lib/cta";
import {
  GROEISCAN_GOALS,
  type GroeiscanGoalId,
  computePlaygroundInsight,
  computePlaygroundScore,
  formatBudgetTier,
} from "@/lib/groeiscan-playground";

/**
 * Compacte teaser voor de homepage. Zelfde rekenlogica als de volledige playground,
 * beperkt tot doel + ambitie-slider zodat het in de sectie past.
 */
export function GroeiscanPreview() {
  const [goal, setGoal] = useState<GroeiscanGoalId>("revenue");
  const [budgetTier, setBudgetTier] = useState(2);

  const input = useMemo(
    () => ({
      goal,
      budgetTier,
      maturity: 5,
      frictionHours: 12,
      channelIds: new Set<string>(["seo", "ads"]),
    }),
    [goal, budgetTier],
  );

  const score = useMemo(() => computePlaygroundScore(input), [input]);
  const { headline, sub } = useMemo(
    () => computePlaygroundInsight(input),
    [input],
  );

  return (
    <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-mm-border bg-white shadow-lg">
      <div className="border-b border-mm-border bg-mm-sky-subtle/50 px-4 py-3 sm:px-5">
        <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-mm-sky-deep">
          <Sparkles className="size-3.5 shrink-0" aria-hidden />
          Voorproefje. Live index
        </p>
        <div className="mt-2 flex items-end justify-between gap-3">
          <span className="text-xs font-bold text-mm-muted">Groei-index</span>
          <motion.span
            key={score}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            className="text-3xl font-black tabular-nums leading-none text-mm-text"
          >
            {score}
            <span className="text-sm font-bold text-mm-muted">/100</span>
          </motion.span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/90">
          <motion.div
            className="h-full rounded-full bg-mm-accent"
            initial={false}
            animate={{ width: `${score}%` }}
            transition={{ type: "spring", stiffness: 80, damping: 18 }}
          />
        </div>
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <fieldset>
          <legend className="text-xs font-bold text-mm-text">
            Hoofddoel (12 maanden)
          </legend>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {GROEISCAN_GOALS.map((g) => {
              const active = goal === g.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setGoal(g.id)}
                  aria-pressed={active}
                  className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                    active
                      ? "bg-mm-sky text-white shadow-sm"
                      : "border border-mm-border bg-mm-bg text-mm-muted hover:border-mm-sky/40"
                  }`}
                >
                  {g.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <label
              htmlFor="groeiscan-preview-budget"
              className="font-bold text-mm-text"
            >
              Ambitie (indicatie)
            </label>
            <output
              htmlFor="groeiscan-preview-budget"
              className="font-bold text-mm-sky-deep"
            >
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
            className="mt-2 h-1.5 w-full min-w-0 cursor-pointer appearance-none rounded-full bg-mm-border accent-mm-sky"
          />
        </div>

        <p className="line-clamp-2 text-xs leading-relaxed text-mm-muted">
          <span className="font-bold text-mm-text">{headline}</span>{" "}
          <span>{sub}</span>
        </p>

        <Link
          href={siteCtas.groeiscan.href}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-mm-accent py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-mm-accent-hover sm:text-sm"
        >
          Volledige Groeiscan (alle schuivers)
          <ArrowUpRight className="size-4 shrink-0" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
