"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Sparkles, Timer } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { siteCtas } from "@/lib/cta";
import {
  GROEISCAN_CHANNELS,
  GROEISCAN_GOALS,
  type GroeiscanGoalId,
  computePlaygroundInsight,
  computePlaygroundScore,
  formatBudgetTier,
} from "@/lib/groeiscan-playground";

export function GroeiscanInteractive() {
  const [goal, setGoal] = useState<GroeiscanGoalId>("revenue");
  const [budgetTier, setBudgetTier] = useState(2);
  const [maturity, setMaturity] = useState(5);
  const [frictionHours, setFrictionHours] = useState(12);
  const [channels, setChannels] = useState<Set<string>>(
    () => new Set(["seo", "ads"]),
  );

  const toggleChannel = (id: string) => {
    setChannels((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const input = useMemo(
    () => ({
      goal,
      budgetTier,
      maturity,
      frictionHours,
      channelIds: channels,
    }),
    [goal, budgetTier, maturity, frictionHours, channels],
  );

  const score = useMemo(() => computePlaygroundScore(input), [input]);
  const { headline, sub } = useMemo(
    () => computePlaygroundInsight(input),
    [input],
  );

  const selectedGoal = GROEISCAN_GOALS.find((x) => x.id === goal)!;

  return (
    <div className="w-full min-w-0 overflow-hidden rounded-3xl border border-mm-border bg-white shadow-xl">
      <div className="flex min-w-0 flex-col xl:flex-row xl:items-stretch">
        <div className="min-w-0 flex-1 space-y-8 border-mm-border p-6 sm:p-8 xl:border-r xl:pb-10 xl:pt-10">
          <fieldset>
            <legend className="text-sm font-bold text-mm-text">
              Waar wil je de komende 12 maanden het meeste uit halen?
            </legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {GROEISCAN_GOALS.map((g) => {
                const Icon = g.icon;
                const active = goal === g.id;
                return (
                  <motion.button
                    key={g.id}
                    type="button"
                    onClick={() => setGoal(g.id)}
                    aria-pressed={active}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex min-w-0 gap-3 rounded-2xl border-2 p-4 text-left transition-colors ${
                      active
                        ? "border-mm-sky bg-mm-sky-subtle/60 shadow-md"
                        : "border-mm-border bg-mm-bg hover:border-mm-sky/40"
                    }`}
                  >
                    <span
                      className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
                        active
                          ? "bg-mm-sky text-white"
                          : "bg-mm-surface text-mm-sky-deep"
                      }`}
                    >
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-bold text-mm-text">
                        {g.label}
                      </span>
                      <span className="mt-0.5 block text-xs text-mm-muted">
                        {g.hint}
                      </span>
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </fieldset>

          <div className="min-w-0">
            <div className="flex flex-wrap items-end justify-between gap-2 gap-y-1">
              <label
                htmlFor="groeiscan-budget"
                className="text-sm font-bold text-mm-text"
              >
                Marketing- & groei-ambitie (indicatie)
              </label>
              <output
                htmlFor="groeiscan-budget"
                className="shrink-0 text-sm font-bold text-mm-sky-deep"
              >
                {formatBudgetTier(budgetTier)}
              </output>
            </div>
            <input
              id="groeiscan-budget"
              type="range"
              min={0}
              max={4}
              step={1}
              value={budgetTier}
              onChange={(e) => setBudgetTier(Number(e.target.value))}
              className="mt-3 h-2 w-full min-w-0 cursor-pointer appearance-none rounded-full bg-mm-border accent-mm-sky"
            />
            <div className="mt-1 flex justify-between text-[10px] font-medium uppercase tracking-wider text-mm-muted">
              <span>Start</span>
              <span>Scale-up</span>
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <label
                htmlFor="groeiscan-maturity"
                className="text-sm font-bold text-mm-text"
              >
                Digitale volwassenheid (stack, data, team)
              </label>
              <output
                htmlFor="groeiscan-maturity"
                className="tabular-nums text-sm font-bold text-mm-sky-deep"
              >
                {maturity} / 10
              </output>
            </div>
            <input
              id="groeiscan-maturity"
              type="range"
              min={1}
              max={10}
              step={1}
              value={maturity}
              onChange={(e) => setMaturity(Number(e.target.value))}
              className="mt-3 h-2 w-full min-w-0 cursor-pointer appearance-none rounded-full bg-mm-border accent-mm-sky"
            />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <label
                htmlFor="groeiscan-friction"
                className="flex min-w-0 items-center gap-2 text-sm font-bold text-mm-text"
              >
                <Timer className="size-4 shrink-0 text-mm-accent" aria-hidden />
                <span className="leading-snug">
                  Uren / week kwijt aan herhaalwerk &amp; copy-paste
                </span>
              </label>
              <output
                htmlFor="groeiscan-friction"
                className="shrink-0 tabular-nums text-sm font-bold text-mm-accent"
              >
                {frictionHours} u
              </output>
            </div>
            <input
              id="groeiscan-friction"
              type="range"
              min={0}
              max={40}
              step={1}
              value={frictionHours}
              onChange={(e) => setFrictionHours(Number(e.target.value))}
              className="mt-3 h-2 w-full min-w-0 cursor-pointer appearance-none rounded-full bg-mm-border accent-mm-accent"
            />
          </div>

          <fieldset>
            <legend className="text-sm font-bold text-mm-text">
              Waar zit je marketing vandaag? (meerdere opties)
            </legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {GROEISCAN_CHANNELS.map((ch) => {
                const on = channels.has(ch.id);
                return (
                  <motion.button
                    key={ch.id}
                    type="button"
                    onClick={() => toggleChannel(ch.id)}
                    aria-pressed={on}
                    whileTap={{ scale: 0.95 }}
                    className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                      on
                        ? "bg-mm-text text-white shadow-md"
                        : "border border-mm-border bg-mm-bg text-mm-muted hover:border-mm-sky/40"
                    }`}
                  >
                    {ch.label}
                  </motion.button>
                );
              })}
            </div>
          </fieldset>

          <p className="text-xs leading-relaxed text-mm-muted">
            <strong className="text-mm-text">Spelelement:</strong> dit is een
            indicatie om te laten zien hoe we denken. Geen offerte of garantie.
            De echte Groeiscan doen we persoonlijk.
          </p>
        </div>

        <aside className="flex min-w-0 w-full shrink-0 flex-col justify-between gap-8 border-t border-mm-border bg-mm-sky-subtle p-6 sm:p-8 xl:w-[min(100%,400px)] xl:border-l xl:border-t-0 xl:pb-10 xl:pt-10">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-mm-sky-deep">
              <Sparkles className="size-4 shrink-0" aria-hidden />
              Live groei-index
            </p>
            <div
              className="mt-6 space-y-4"
              aria-live="polite"
              aria-atomic="true"
            >
              <div className="flex flex-wrap items-end justify-between gap-2">
                <span className="text-sm font-bold text-mm-text">
                  Groei-index (speels)
                </span>
                <motion.span
                  key={score}
                  initial={{ opacity: 0.6, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                  className="text-5xl font-black tabular-nums leading-none tracking-tight text-mm-text"
                >
                  {score}
                  <span className="text-lg font-bold text-mm-muted">/100</span>
                </motion.span>
              </div>
              <div className="h-4 overflow-hidden rounded-full bg-white/80">
                <motion.div
                  className="h-full rounded-full bg-mm-accent"
                  initial={false}
                  animate={{ width: `${score}%` }}
                  transition={{ type: "spring", stiffness: 70, damping: 16 }}
                />
              </div>
            </div>
            <p className="mt-4 text-center text-xs font-medium leading-relaxed text-mm-muted">
              Gebaseerd op: {selectedGoal.label.toLowerCase()}, ambitie,
              volwassenheid, frictie &amp; kanalen
            </p>
          </div>

          <div className="min-h-[100px] min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${goal}-${budgetTier}-${maturity}-${frictionHours}-${[...channels].sort().join(",")}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="rounded-xl border border-white/70 bg-white p-4 shadow-sm"
              >
                <p className="text-sm font-bold text-mm-text">{headline}</p>
                <p className="mt-2 text-sm leading-relaxed text-mm-muted">
                  {sub}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex flex-col gap-2">
            <Link
              href={siteCtas.groeiscan.href}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-mm-accent px-5 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-mm-accent-hover"
            >
              Vastleggen in echte Groeiscan
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
            <Link
              href={siteCtas.startIntake.href}
              className="text-center text-sm font-semibold text-mm-sky-deep underline-offset-4 hover:underline"
            >
              Liever direct start intake →
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
