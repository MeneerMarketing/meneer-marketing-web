"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { GroeiscanMeneerCoach } from "@/components/groeiscan/GroeiscanMeneerCoach";
import { GroeiscanTowerVisual } from "@/components/groeiscan/GroeiscanTowerVisual";
import { siteCtas } from "@/lib/cta";
import {
  GROEISCAN_BUDGET_TIERS,
  GROEISCAN_CHANNELS,
  GROEISCAN_FRICTION_LEVELS,
  GROEISCAN_GOALS,
  GROEISCAN_SITUATIONS,
  WIZARD_STEPS,
  type GroeiscanFrictionId,
  type GroeiscanGoalId,
  type GroeiscanSituationId,
  computeActiveFloors,
  computeGrowthTier,
  computePlaygroundInsight,
  computePlaygroundRoute,
  computePlaygroundScore,
  formatBudgetTier,
  formatPlaygroundSummary,
  frictionToHours,
  getMeneerCoachLine,
  savePlaygroundSummary,
  situationToMaturity,
} from "@/lib/groeiscan-playground";

function StepProgress({ current }: { current: number }) {
  return (
    <nav aria-label="Groeiscan stappen" className="mb-8">
      <ol className="flex gap-1 sm:gap-2">
        {WIZARD_STEPS.map((step, index) => {
          const done = index < current;
          const active = index === current;
          return (
            <li key={step.id} className="min-w-0 flex-1">
              <div
                className={`h-1.5 rounded-full transition-colors ${
                  done || active ? "bg-[#FF5722]" : "bg-slate-700"
                }`}
                aria-hidden
              />
              <p
                className={`mt-2 truncate text-[9px] font-bold uppercase tracking-wider sm:text-[10px] ${
                  active ? "text-[#FF5722]" : done ? "text-slate-400" : "text-slate-600"
                }`}
              >
                {step.label}
              </p>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function GroeiscanWizard() {
  const reduce = useReducedMotion();
  const [stepIndex, setStepIndex] = useState(0);
  const [goal, setGoal] = useState<GroeiscanGoalId>("revenue");
  const [situation, setSituation] = useState<GroeiscanSituationId>("messy");
  const [budgetTier, setBudgetTier] = useState(2);
  const [friction, setFriction] = useState<GroeiscanFrictionId>("some");
  const [channels, setChannels] = useState<Set<string>>(
    () => new Set(["seo"]),
  );

  const currentStep = WIZARD_STEPS[stepIndex]!;
  const isResultStep = currentStep.id === "route";

  const input = useMemo(
    () => ({
      goal,
      budgetTier,
      maturity: situationToMaturity(situation),
      frictionHours: frictionToHours(friction),
      channelIds: channels,
    }),
    [goal, budgetTier, situation, friction, channels],
  );

  const score = useMemo(() => computePlaygroundScore(input), [input]);
  const growthTier = useMemo(() => computeGrowthTier(score), [score]);
  const insight = useMemo(() => computePlaygroundInsight(input), [input]);
  const route = useMemo(() => computePlaygroundRoute(input), [input]);
  const activeFloors = useMemo(() => computeActiveFloors(input), [input]);

  const situationLabel = GROEISCAN_SITUATIONS.find((s) => s.id === situation)?.label;
  const frictionLabel = GROEISCAN_FRICTION_LEVELS.find((f) => f.id === friction)?.label;

  const coachLine = getMeneerCoachLine(currentStep.id, {
    goal,
    situation,
    friction,
  });

  useEffect(() => {
    if (!isResultStep) return;
    savePlaygroundSummary(
      formatPlaygroundSummary(input, score, insight, route, situationLabel, frictionLabel),
    );
  }, [isResultStep, input, score, insight, route, situationLabel, frictionLabel]);

  const toggleChannel = (id: string) => {
    setChannels((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  function goNext() {
    if (stepIndex < WIZARD_STEPS.length - 1) setStepIndex((i) => i + 1);
  }

  function goBack() {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 shadow-[0_32px_64px_-32px_rgba(0,0,0,0.6)]">
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3 sm:px-6">
        <span className="size-2 rounded-full bg-[#FF5722]" aria-hidden />
        <span className="size-2 rounded-full bg-amber-400/80" aria-hidden />
        <span className="size-2 rounded-full bg-emerald-400/80" aria-hidden />
        <span className="ml-2 font-mono text-[10px] text-slate-500">groeiscan.playground</span>
        <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-[#FF5722]/15 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#FF5722]">
          <Sparkles className="size-3" aria-hidden />
          Live
        </span>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(260px,300px)] lg:items-stretch">
        <div className="border-b border-white/[0.06] p-5 sm:p-8 lg:border-b-0 lg:border-r">
          <StepProgress current={stepIndex} />

          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#FF5722]">
            {currentStep.hint}
          </p>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.id}
              initial={reduce ? false : { opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.28 }}
              className="mt-4"
            >
              {currentStep.id === "goal" ? (
                <fieldset>
                  <legend className="text-lg font-extrabold text-white sm:text-xl">
                    Waar wil je de komende 12 maanden het meeste uit halen?
                  </legend>
                  <p className="mt-2 text-sm text-slate-400">
                    Kies één richting. Scherp is fijner dan alles tegelijk.
                  </p>
                  <div className="mt-5 grid gap-2 sm:grid-cols-2">
                    {GROEISCAN_GOALS.map((g) => {
                      const Icon = g.icon;
                      const active = goal === g.id;
                      return (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => setGoal(g.id)}
                          aria-pressed={active}
                          className={`flex gap-3 rounded-2xl border p-4 text-left transition-all ${
                            active
                              ? "border-[#FF5722]/50 bg-[#FF5722]/10 shadow-[0_0_0_1px_rgba(255,87,34,0.25)]"
                              : "border-white/[0.08] bg-white/[0.02] hover:border-white/15"
                          }`}
                        >
                          <span
                            className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
                              active ? "bg-[#FF5722] text-white" : "bg-white/10 text-slate-400"
                            }`}
                          >
                            <Icon className="size-5" aria-hidden />
                          </span>
                          <span>
                            <span className="block text-sm font-extrabold text-white">
                              {g.label}
                            </span>
                            <span className="mt-0.5 block text-xs text-slate-400">{g.hint}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              ) : null}

              {currentStep.id === "situation" ? (
                <div className="space-y-8">
                  <fieldset>
                    <legend className="text-lg font-extrabold text-white sm:text-xl">
                      Hoe zit je online vandaag?
                    </legend>
                    <p className="mt-2 text-sm text-slate-400">
                      Geen oordeel. Alleen zodat de route klopt.
                    </p>
                    <div className="mt-5 grid gap-2 sm:grid-cols-2">
                      {GROEISCAN_SITUATIONS.map((s) => {
                        const active = situation === s.id;
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => setSituation(s.id)}
                            aria-pressed={active}
                            className={`rounded-2xl border p-4 text-left transition-all ${
                              active
                                ? "border-[#FF5722]/50 bg-[#FF5722]/10"
                                : "border-white/[0.08] bg-white/[0.02] hover:border-white/15"
                            }`}
                          >
                            <span className="block text-sm font-extrabold text-white">
                              {s.label}
                            </span>
                            <span className="mt-1 block text-xs text-slate-400">{s.body}</span>
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>

                  <div>
                    <div className="flex flex-wrap items-end justify-between gap-2">
                      <label
                        htmlFor="groeiscan-budget"
                        className="text-sm font-bold text-white"
                      >
                        Hoeveel wil je ongeveer per maand investeren in groei?
                      </label>
                      <output
                        htmlFor="groeiscan-budget"
                        className="text-sm font-bold text-[#FF5722]"
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
                      className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-800 accent-[#FF5722]"
                    />
                    <p className="mt-2 text-xs text-slate-500">
                      {GROEISCAN_BUDGET_TIERS[budgetTier]?.hint}
                    </p>
                  </div>
                </div>
              ) : null}

              {currentStep.id === "friction" ? (
                <fieldset>
                  <legend className="text-lg font-extrabold text-white sm:text-xl">
                    Hoeveel tijd verlies je aan handwerk?
                  </legend>
                  <p className="mt-2 text-sm text-slate-400">
                    Copy-paste tussen mail, Excel, shop en CRM. Wees eerlijk.
                  </p>
                  <div className="mt-5 grid gap-2 sm:grid-cols-2">
                    {GROEISCAN_FRICTION_LEVELS.map((f) => {
                      const active = friction === f.id;
                      return (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setFriction(f.id)}
                          aria-pressed={active}
                          className={`rounded-2xl border p-4 text-left transition-all ${
                            active
                              ? "border-[#FF5722]/50 bg-[#FF5722]/10"
                              : "border-white/[0.08] bg-white/[0.02] hover:border-white/15"
                          }`}
                        >
                          <span className="block text-sm font-extrabold text-white">
                            {f.label}
                          </span>
                          <span className="mt-1 block text-xs text-slate-400">{f.body}</span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              ) : null}

              {currentStep.id === "channels" ? (
                <fieldset>
                  <legend className="text-lg font-extrabold text-white sm:text-xl">
                    Waar zit je marketing nu al?
                  </legend>
                  <p className="mt-2 text-sm text-slate-400">
                    Meerdere opties mag. Geen enkele ook, dan weten we waar we beginnen.
                  </p>
                  <div className="mt-5 grid gap-2 sm:grid-cols-2">
                    {GROEISCAN_CHANNELS.map((ch) => {
                      const Icon = ch.icon;
                      const on = channels.has(ch.id);
                      return (
                        <button
                          key={ch.id}
                          type="button"
                          onClick={() => toggleChannel(ch.id)}
                          aria-pressed={on}
                          className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition-all ${
                            on
                              ? "border-[#FF5722]/50 bg-[#FF5722]/10"
                              : "border-white/[0.08] bg-white/[0.02] hover:border-white/15"
                          }`}
                        >
                          <span
                            className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${
                              on ? "bg-[#FF5722] text-white" : "bg-white/10 text-slate-400"
                            }`}
                          >
                            <Icon className="size-4" aria-hidden />
                          </span>
                          <span>
                            <span className="block text-sm font-extrabold text-white">
                              {ch.label}
                            </span>
                            <span className="mt-0.5 block text-xs text-slate-400">{ch.hint}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              ) : null}

              {currentStep.id === "route" ? (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-extrabold text-white sm:text-xl">
                      Jouw groeiroute
                    </h2>
                    <p className="mt-2 text-sm text-slate-400">
                      Dit is een slimme volgorde op basis van jouw antwoorden. Geen offerte,
                      wel richting.
                    </p>
                  </div>

                  <div
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                    aria-live="polite"
                  >
                    <p className="text-sm font-extrabold text-white">{insight.headline}</p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">{insight.sub}</p>
                    <p className="mt-3 text-sm font-bold italic text-[#FF5722]">
                      {insight.quip}
                    </p>
                  </div>

                  <ol className="space-y-3">
                    {route.map((r, index) => (
                      <motion.li
                        key={r.href}
                        initial={reduce ? false : { opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.08 * index }}
                      >
                        <Link
                          href={r.href}
                          className="group flex gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 transition hover:border-[#FF5722]/30 hover:bg-[#FF5722]/5"
                        >
                          <span
                            className="flex size-10 shrink-0 items-center justify-center rounded-xl text-[10px] font-black uppercase text-white"
                            style={{ backgroundColor: r.accent }}
                          >
                            {r.pillar.slice(0, 2)}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span
                              className="text-[10px] font-bold uppercase tracking-wider"
                              style={{ color: r.accent }}
                            >
                              {r.pillar}
                            </span>
                            <span className="mt-0.5 block text-sm font-extrabold text-white group-hover:text-[#FF5722]">
                              {r.title}
                            </span>
                            <span className="mt-1 block text-xs text-slate-400">{r.body}</span>
                          </span>
                          <ArrowUpRight className="size-4 shrink-0 text-slate-600 transition group-hover:text-[#FF5722]" />
                        </Link>
                      </motion.li>
                    ))}
                  </ol>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <a
                      href="#groeiscan-aanvraag"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FF5722] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#FF5722]/25 transition hover:bg-orange-600"
                    >
                      Leg vast in echte Groeiscan
                      <ArrowUpRight className="size-4" aria-hidden />
                    </a>
                    <Link
                      href={siteCtas.startIntake.href}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3.5 text-sm font-bold text-white transition hover:border-white/30"
                    >
                      Direct intake
                    </Link>
                  </div>

                  <p className="text-xs text-slate-500">
                    Spelelement: indicatie om strategie voelbaar te maken. De echte Groeiscan
                    doen we persoonlijk met jouw cijfers.
                  </p>
                </div>
              ) : null}
            </motion.div>
          </AnimatePresence>

          {!isResultStep ? (
            <div className="mt-8 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={goBack}
                disabled={stepIndex === 0}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-sm font-bold text-slate-300 transition hover:border-white/20 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ArrowLeft className="size-4" aria-hidden />
                Terug
              </button>
              <button
                type="button"
                onClick={goNext}
                className="inline-flex items-center gap-2 rounded-full bg-[#FF5722] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#FF5722]/20 transition hover:bg-orange-600"
              >
                Volgende
                <ArrowRight className="size-4" aria-hidden />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setStepIndex(0)}
              className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-slate-400 transition hover:text-white"
            >
              <ArrowLeft className="size-4" aria-hidden />
              Opnieuw spelen
            </button>
          )}
        </div>

        <aside className="flex flex-col gap-5 bg-slate-900/50 p-5 sm:p-6 lg:p-8">
          <GroeiscanTowerVisual
            activeFloors={activeFloors}
            score={score}
            growthLabel={growthTier.label}
          />
          <GroeiscanMeneerCoach message={coachLine} />
        </aside>
      </div>
    </div>
  );
}
