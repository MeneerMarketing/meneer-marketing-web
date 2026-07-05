"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Boxes,
  Layers,
  Play,
  Target,
  Trophy,
  Wallet,
  Waves,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { GroeiscanKrachtBar } from "@/components/groeiscan/GroeiscanKrachtBar";
import { GroeiscanMeneerCoach } from "@/components/groeiscan/GroeiscanMeneerCoach";
import { GroeiscanResultPanel } from "@/components/groeiscan/GroeiscanResultPanel";
import {
  GROEISCAN_BUDGET_TIERS,
  GROEISCAN_FRICTION_LEVELS,
  GROEISCAN_GOALS,
  GROEISCAN_PILLARS,
  GROEISCAN_SITUATIONS,
  GROEISCAN_SUBDIENSTEN,
  WIZARD_STEPS,
  type GroeiscanFrictionId,
  type GroeiscanGoalId,
  type GroeiscanSituationId,
  type WizardStepId,
  computeGroeikrachtBreakdown,
  computeGrowthTier,
  computePillarProgress,
  computePlaygroundInsight,
  computePlaygroundRoute,
  formatBudgetTier,
  formatPlaygroundSummary,
  frictionToHours,
  getMeneerCoachLine,
  getSubdienstenByPillar,
  savePlaygroundSummary,
  situationToMaturity,
} from "@/lib/groeiscan-playground";
import type { PillarSlug } from "@/lib/navigation";

const STATION_ICONS: Record<WizardStepId, typeof Target> = {
  goal: Target,
  situation: Layers,
  budget: Wallet,
  friction: Waves,
  diensten: Boxes,
  route: Trophy,
};

function PlaygroundGrid() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 size-full opacity-[0.45]"
      width="100%"
      height="100%"
    >
      <defs>
        <pattern id="groeiscan-grid" width="28" height="28" patternUnits="userSpaceOnUse">
          <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#CBD5E1" strokeWidth="0.6" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#groeiscan-grid)" />
    </svg>
  );
}

function StationPath({
  current,
  maxVisited,
  onJump,
}: {
  current: number;
  maxVisited: number;
  onJump: (index: number) => void;
}) {
  return (
    <nav aria-label="Groeiscan stappen" className="mb-8">
      <ol className="flex items-start justify-between gap-0.5 sm:gap-1">
        {WIZARD_STEPS.map((step, index) => {
          const Icon = STATION_ICONS[step.id];
          const done = index < current;
          const active = index === current;
          const reachable = index <= maxVisited;
          return (
            <li key={step.id} className="relative min-w-0 flex-1">
              {index < WIZARD_STEPS.length - 1 ? (
                <div
                  className={`absolute left-[calc(50%+14px)] top-5 hidden h-0.5 w-[calc(100%-28px)] sm:block ${
                    done ? "bg-[#FF5722]/40" : "bg-slate-200"
                  }`}
                  aria-hidden
                />
              ) : null}
              <button
                type="button"
                disabled={!reachable}
                onClick={() => reachable && onJump(index)}
                className="group mx-auto flex w-full max-w-[64px] flex-col items-center gap-1 disabled:cursor-default sm:max-w-[72px]"
                aria-current={active ? "step" : undefined}
                title={step.hint}
              >
                <span
                  className={`flex size-9 items-center justify-center rounded-2xl border-2 transition-all sm:size-11 ${
                    active
                      ? "border-[#FF5722] bg-[#FF5722] text-white shadow-lg shadow-[#FF5722]/30"
                      : done
                        ? "border-[#FF5722]/40 bg-orange-50 text-[#FF5722]"
                        : reachable
                          ? "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                          : "border-slate-100 bg-slate-50 text-slate-300"
                  }`}
                >
                  <Icon className="size-3.5 sm:size-4" strokeWidth={2} aria-hidden />
                </span>
                <span
                  className={`truncate text-[8px] font-bold uppercase tracking-wide sm:text-[10px] ${
                    active ? "text-[#FF5722]" : done ? "text-slate-600" : "text-slate-400"
                  }`}
                >
                  {step.label}
                </span>
              </button>
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
  const [maxVisited, setMaxVisited] = useState(0);
  const [goal, setGoal] = useState<GroeiscanGoalId>("revenue");
  const [situation, setSituation] = useState<GroeiscanSituationId>("messy");
  const [budgetTier, setBudgetTier] = useState(2);
  const [friction, setFriction] = useState<GroeiscanFrictionId>("some");
  const [dienstIds, setDienstIds] = useState<Set<string>>(() => new Set());

  const currentStep = WIZARD_STEPS[stepIndex]!;
  const isResultStep = currentStep.id === "route";

  const input = useMemo(
    () => ({
      goal,
      budgetTier,
      maturity: situationToMaturity(situation),
      friction,
      frictionHours: frictionToHours(friction),
      dienstIds,
    }),
    [goal, budgetTier, situation, friction, dienstIds],
  );

  const breakdown = useMemo(() => computeGroeikrachtBreakdown(input), [input]);
  const score = breakdown.total;
  const growthTier = useMemo(() => computeGrowthTier(score), [score]);
  const insight = useMemo(() => computePlaygroundInsight(input), [input]);
  const route = useMemo(() => computePlaygroundRoute(input), [input]);
  const pillarProgress = useMemo(() => computePillarProgress(dienstIds), [dienstIds]);

  const goalLabel = GROEISCAN_GOALS.find((g) => g.id === goal)?.label ?? goal;
  const situationLabel = GROEISCAN_SITUATIONS.find((s) => s.id === situation)?.label;
  const frictionLabel = GROEISCAN_FRICTION_LEVELS.find((f) => f.id === friction)?.label;

  const coachLine = getMeneerCoachLine(currentStep.id, {
    goal,
    situation,
    friction,
    budgetTier,
  });

  useEffect(() => {
    if (!isResultStep) return;
    savePlaygroundSummary(
      formatPlaygroundSummary(input, score, insight, route, situationLabel, frictionLabel),
    );
  }, [isResultStep, input, score, insight, route, situationLabel, frictionLabel]);

  const toggleDienst = (id: string) => {
    setDienstIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const togglePillar = (pillarSlug: PillarSlug, selectAll: boolean) => {
    const ids = getSubdienstenByPillar(pillarSlug).map((d) => d.id);
    setDienstIds((prev) => {
      const next = new Set(prev);
      for (const id of ids) {
        if (selectAll) next.add(id);
        else next.delete(id);
      }
      return next;
    });
  };

  const selectFullStack = () => {
    setDienstIds(new Set(GROEISCAN_SUBDIENSTEN.map((d) => d.id)));
  };

  function goNext() {
    if (stepIndex >= WIZARD_STEPS.length - 1) return;
    const next = stepIndex + 1;
    setStepIndex(next);
    setMaxVisited((m) => Math.max(m, next));
  }

  function goBack() {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  }

  function jumpTo(index: number) {
    setStepIndex(index);
  }

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_32px_80px_-28px_rgba(15,23,42,0.18)]">
      <PlaygroundGrid />

      <div className="relative flex items-center gap-2 border-b border-slate-100 px-4 py-3 sm:px-6">
        <span className="size-2 rounded-full bg-[#FF5722]" aria-hidden />
        <span className="size-2 rounded-full bg-emerald-400" aria-hidden />
        <span className="size-2 rounded-full bg-sky-400" aria-hidden />
        <span className="ml-2 font-mono text-[10px] text-slate-400">groeiscan.live</span>
        <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#FF5722]">
          <Play className="size-3" aria-hidden />
          Live score
        </span>
      </div>

      <div className="relative grid lg:grid-cols-[minmax(0,1fr)_minmax(260px,300px)] lg:items-stretch">
        <div className="border-b border-slate-100 p-5 sm:p-8 lg:border-b-0 lg:border-r">
          <StationPath current={stepIndex} maxVisited={maxVisited} onJump={jumpTo} />

          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#FF5722]">
            {currentStep.hint}
          </p>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.id}
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28 }}
              className="mt-4"
            >
              {currentStep.id === "goal" ? (
                <fieldset>
                  <legend className="text-lg font-extrabold text-slate-900 sm:text-xl">
                    Wat wil je het liefst bereiken?
                  </legend>
                  <p className="mt-2 text-sm text-slate-600">
                    Eén droom, geen waslijst. Zo weet je straks waar je score naartoe wijst.
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
                              ? "border-[#FF5722] bg-orange-50 shadow-md shadow-[#FF5722]/10 ring-2 ring-[#FF5722]/15"
                              : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                          }`}
                        >
                          <span
                            className={`flex size-10 shrink-0 items-center justify-center rounded-xl text-lg ${
                              active ? "bg-[#FF5722] text-white" : "bg-slate-100"
                            }`}
                          >
                            {active ? (
                              <Icon className="size-5 text-white" aria-hidden />
                            ) : (
                              <span aria-hidden>{g.emoji}</span>
                            )}
                          </span>
                          <span>
                            <span className="block text-sm font-extrabold text-slate-900">
                              {g.label}
                            </span>
                            <span className="mt-0.5 block text-xs text-slate-500">{g.hint}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              ) : null}

              {currentStep.id === "situation" ? (
                <fieldset>
                  <legend className="text-lg font-extrabold text-slate-900 sm:text-xl">
                    Waar sta je nu met je online groei?
                  </legend>
                  <p className="mt-2 text-sm text-slate-600">
                    Geen examen. Alleen eerlijk. Hoe verder je staat, hoe meer punten op je stand.
                  </p>
                  <div className="mt-5 grid gap-2 sm:grid-cols-2">
                    {GROEISCAN_SITUATIONS.map((s) => {
                      const active = situation === s.id;
                      const standPts = Math.round((s.maturity / 10) * 18);
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setSituation(s.id)}
                          aria-pressed={active}
                          className={`rounded-2xl border p-4 text-left transition-all ${
                            active
                              ? "border-[#FF5722] bg-orange-50 ring-2 ring-[#FF5722]/15"
                              : "border-slate-200 bg-white hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="block text-sm font-extrabold text-slate-900">
                              {s.label}
                            </span>
                            <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-500">
                              +{standPts}
                            </span>
                          </div>
                          <span className="mt-1 block text-xs text-slate-500">{s.body}</span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              ) : null}

              {currentStep.id === "budget" ? (
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 sm:text-xl">
                    Wat kun je maandelijks investeren in groei?
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">
                    Geen verplichting. Wel realistisch. Meer budget = meer ruimte in je score en
                    route.
                  </p>

                  <div className="mt-6 rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50/80 to-white p-5">
                    <div className="flex flex-wrap items-end justify-between gap-2">
                      <label htmlFor="groeiscan-budget" className="text-sm font-bold text-slate-900">
                        Jouw bandbreedte
                      </label>
                      <output
                        htmlFor="groeiscan-budget"
                        className="text-base font-extrabold text-[#FF5722]"
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
                      className="mt-4 h-2.5 w-full cursor-pointer appearance-none rounded-full bg-orange-100 accent-[#FF5722]"
                    />
                    <p className="mt-2 text-xs text-slate-600">
                      {GROEISCAN_BUDGET_TIERS[budgetTier]?.hint}
                    </p>
                    <p className="mt-3 font-mono text-[11px] font-bold text-[#FF5722]">
                      +{Math.round((budgetTier / 4) * 14)} punten op je groeikracht
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {GROEISCAN_BUDGET_TIERS.map((tier) => (
                      <button
                        key={tier.tier}
                        type="button"
                        onClick={() => setBudgetTier(tier.tier)}
                        aria-pressed={budgetTier === tier.tier}
                        className={`rounded-full border px-3 py-1.5 text-[10px] font-bold transition ${
                          budgetTier === tier.tier
                            ? "border-[#FF5722] bg-[#FF5722] text-white"
                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        {tier.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {currentStep.id === "friction" ? (
                <fieldset>
                  <legend className="text-lg font-extrabold text-slate-900 sm:text-xl">
                    Hoe soepel loopt het online?
                  </legend>
                  <p className="mt-2 text-sm text-slate-600">
                    Mail, shop, opvolging, facturen. Loopt het vanzelf of vecht je elke week?
                  </p>
                  <div className="mt-5 grid gap-2 sm:grid-cols-2">
                    {GROEISCAN_FRICTION_LEVELS.map((f) => {
                      const active = friction === f.id;
                      const ritmePts =
                        f.id === "none"
                          ? 15
                          : f.id === "some"
                            ? 11
                            : f.id === "lots"
                              ? 6
                              : 2;
                      return (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setFriction(f.id)}
                          aria-pressed={active}
                          className={`rounded-2xl border p-4 text-left transition-all ${
                            active
                              ? "border-[#FF5722] bg-orange-50 ring-2 ring-[#FF5722]/15"
                              : "border-slate-200 bg-white hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="block text-sm font-extrabold text-slate-900">
                              {f.label}
                            </span>
                            <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-500">
                              +{ritmePts}
                            </span>
                          </div>
                          <span className="mt-1 block text-xs text-slate-500">{f.body}</span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              ) : null}

              {currentStep.id === "diensten" ? (
                <fieldset>
                  <legend className="text-lg font-extrabold text-slate-900 sm:text-xl">
                    Wat heb je al staan?
                  </legend>
                  <p className="mt-2 text-sm text-slate-600">
                    Vink aan wat je herkent. Geen vaktaal nodig. Meer stack = meer punten (max +45).
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={selectFullStack}
                      className="rounded-full border border-[#FF5722]/30 bg-[#FF5722]/5 px-3 py-1.5 text-[11px] font-bold text-[#FF5722] transition hover:bg-[#FF5722]/10"
                    >
                      Alles aan (+45 stack)
                    </button>
                    <button
                      type="button"
                      onClick={() => setDienstIds(new Set())}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-600 transition hover:border-slate-300"
                    >
                      Nog niets
                    </button>
                  </div>

                  <div className="mt-6 space-y-6">
                    {GROEISCAN_PILLARS.map((pillar) => {
                      const items = getSubdienstenByPillar(pillar.slug);
                      const activeInPillar = items.filter((d) => dienstIds.has(d.id)).length;
                      const allOn = activeInPillar === items.length;

                      return (
                        <div
                          key={pillar.slug}
                          className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4"
                        >
                          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <p
                                className="text-[10px] font-bold uppercase tracking-wider"
                                style={{ color: pillar.accent }}
                              >
                                {pillar.label}
                              </p>
                              <p className="text-xs text-slate-500">{pillar.subtitle}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => togglePillar(pillar.slug, !allOn)}
                              className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-bold text-slate-600 transition hover:border-slate-300"
                            >
                              {allOn ? "Blok uit" : "Heel blok aan"}
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {items.map((d) => {
                              const on = dienstIds.has(d.id);
                              return (
                                <button
                                  key={d.id}
                                  type="button"
                                  onClick={() => toggleDienst(d.id)}
                                  aria-pressed={on}
                                  className={`rounded-lg border px-2.5 py-1.5 text-left text-[11px] font-bold transition ${
                                    on
                                      ? "border-transparent text-white shadow-sm"
                                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                                  }`}
                                  style={
                                    on ? { backgroundColor: pillar.accent } : undefined
                                  }
                                >
                                  {d.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </fieldset>
              ) : null}

              {currentStep.id === "route" ? (
                <GroeiscanResultPanel
                  score={score}
                  growthTier={growthTier}
                  breakdown={breakdown}
                  insight={insight}
                  route={route}
                  goalLabel={goalLabel}
                />
              ) : null}
            </motion.div>
          </AnimatePresence>

          {!isResultStep ? (
            <div className="mt-8 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={goBack}
                disabled={stepIndex === 0}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ArrowLeft className="size-4" aria-hidden />
                Terug
              </button>
              <button
                type="button"
                onClick={goNext}
                className="inline-flex items-center gap-2 rounded-full bg-[#FF5722] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#FF5722]/20 transition hover:bg-orange-600"
              >
                {stepIndex === WIZARD_STEPS.length - 2 ? "Bekijk mijn score" : "Volgende stap"}
                <ArrowRight className="size-4" aria-hidden />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setStepIndex(0);
                setMaxVisited(0);
                setDienstIds(new Set());
              }}
              className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-[#FF5722]"
            >
              <ArrowLeft className="size-4" aria-hidden />
              Opnieuw starten
            </button>
          )}
        </div>

        <aside className="relative flex flex-col gap-4 border-t border-slate-100 bg-gradient-to-b from-slate-50/80 to-white p-5 sm:p-6 lg:border-t-0 lg:p-8">
          <GroeiscanKrachtBar
            score={score}
            growthLabel={growthTier.label}
            breakdown={breakdown}
            pillarProgress={pillarProgress}
          />
          <GroeiscanMeneerCoach message={coachLine} theme="light" />
        </aside>
      </div>
    </div>
  );
}
