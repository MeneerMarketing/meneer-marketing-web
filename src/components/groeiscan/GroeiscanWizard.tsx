"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Layers,
  Scissors,
  Sparkles,
  Sprout,
  Sun,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { GroeiscanGardenVisual } from "@/components/groeiscan/GroeiscanGardenVisual";
import { GroeiscanMeneerCoach } from "@/components/groeiscan/GroeiscanMeneerCoach";
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
  type WizardStepId,
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

const STATION_ICONS: Record<WizardStepId, typeof Sprout> = {
  goal: Sprout,
  situation: Layers,
  friction: Scissors,
  channels: Sun,
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
    <nav aria-label="Groeituin stations" className="mb-8">
      <ol className="flex items-start justify-between gap-1">
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
                className={`group mx-auto flex w-full max-w-[72px] flex-col items-center gap-1.5 disabled:cursor-default`}
                aria-current={active ? "step" : undefined}
              >
                <span
                  className={`flex size-10 items-center justify-center rounded-2xl border-2 transition-all sm:size-11 ${
                    active
                      ? "border-[#FF5722] bg-[#FF5722] text-white shadow-lg shadow-[#FF5722]/30"
                      : done
                        ? "border-[#FF5722]/40 bg-orange-50 text-[#FF5722]"
                        : reachable
                          ? "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                          : "border-slate-100 bg-slate-50 text-slate-300"
                  }`}
                >
                  <Icon className="size-4" strokeWidth={2} aria-hidden />
                </span>
                <span
                  className={`truncate text-[9px] font-bold uppercase tracking-wide sm:text-[10px] ${
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

function HarvestConfetti({ show }: { show: boolean }) {
  const reduce = useReducedMotion();
  if (!show || reduce) return null;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {Array.from({ length: 14 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute size-2 rounded-sm"
          style={{
            left: `${10 + (i * 6) % 80}%`,
            top: "20%",
            backgroundColor: i % 3 === 0 ? "#FF5722" : i % 3 === 1 ? "#22C55E" : "#FBBF24",
          }}
          initial={{ opacity: 0, y: 0, rotate: 0 }}
          animate={{ opacity: [0, 1, 0], y: 120, rotate: 180 + i * 30 }}
          transition={{ duration: 1.2, delay: i * 0.06, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

export function GroeiscanWizard() {
  const reduce = useReducedMotion();
  const [stepIndex, setStepIndex] = useState(0);
  const [maxVisited, setMaxVisited] = useState(0);
  const [waterPulse, setWaterPulse] = useState(0);
  const [goal, setGoal] = useState<GroeiscanGoalId>("revenue");
  const [situation, setSituation] = useState<GroeiscanSituationId>("messy");
  const [budgetTier, setBudgetTier] = useState(2);
  const [friction, setFriction] = useState<GroeiscanFrictionId>("some");
  const [channels, setChannels] = useState<Set<string>>(() => new Set(["seo"]));

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
    if (stepIndex >= WIZARD_STEPS.length - 1) return;
    const next = stepIndex + 1;
    setStepIndex(next);
    setMaxVisited((m) => Math.max(m, next));
    setWaterPulse((p) => p + 1);
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
      <HarvestConfetti show={isResultStep} />

      <div className="relative flex items-center gap-2 border-b border-slate-100 px-4 py-3 sm:px-6">
        <span className="size-2 rounded-full bg-[#FF5722]" aria-hidden />
        <span className="size-2 rounded-full bg-emerald-400" aria-hidden />
        <span className="size-2 rounded-full bg-sky-400" aria-hidden />
        <span className="ml-2 font-mono text-[10px] text-slate-400">groeituin.playground</span>
        <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-700">
          <Sparkles className="size-3" aria-hidden />
          Live groeien
        </span>
      </div>

      <div className="relative grid lg:grid-cols-[minmax(0,1fr)_minmax(260px,300px)] lg:items-stretch">
        <div className="border-b border-slate-100 p-5 sm:p-8 lg:border-b-0 lg:border-r">
          <StationPath
            current={stepIndex}
            maxVisited={maxVisited}
            onJump={jumpTo}
          />

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
                    Welk zaad plant je voor de komende 12 maanden?
                  </legend>
                  <p className="mt-2 text-sm text-slate-600">
                    Kies één richting. Meerdere zaadjes tegelijk is chaos in je tuin.
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
                            className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
                              active ? "bg-[#FF5722] text-white" : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            <Icon className="size-5" aria-hidden />
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
                <div className="space-y-8">
                  <fieldset>
                    <legend className="text-lg font-extrabold text-slate-900 sm:text-xl">
                      Hoe vruchtbaar is je grond vandaag?
                    </legend>
                    <p className="mt-2 text-sm text-slate-600">
                      Geen oordeel. Alleen zodat we weten hoeveel water en zon je nodig hebt.
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
                                ? "border-[#FF5722] bg-orange-50 ring-2 ring-[#FF5722]/15"
                                : "border-slate-200 bg-white hover:border-slate-300"
                            }`}
                          >
                            <span className="block text-sm font-extrabold text-slate-900">
                              {s.label}
                            </span>
                            <span className="mt-1 block text-xs text-slate-500">{s.body}</span>
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>

                  <div className="rounded-2xl border border-sky-100 bg-sky-50/60 p-5">
                    <div className="flex flex-wrap items-end justify-between gap-2">
                      <label htmlFor="groeiscan-budget" className="text-sm font-bold text-slate-900">
                        Hoeveel groeivoeding per maand?
                      </label>
                      <output
                        htmlFor="groeiscan-budget"
                        className="text-sm font-extrabold text-[#FF5722]"
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
                      className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-sky-100 accent-[#FF5722]"
                    />
                    <p className="mt-2 text-xs text-slate-600">
                      {GROEISCAN_BUDGET_TIERS[budgetTier]?.hint}
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide text-sky-700">
                      <span className="size-2 rounded-full bg-sky-400" aria-hidden />
                      Gieter vult · plant reageert rechts
                    </div>
                  </div>
                </div>
              ) : null}

              {currentStep.id === "friction" ? (
                <fieldset>
                  <legend className="text-lg font-extrabold text-slate-900 sm:text-xl">
                    Hoeveel onkruid (handwerk) groeit er mee?
                  </legend>
                  <p className="mt-2 text-sm text-slate-600">
                    Copy-paste tussen mail, Excel, shop en CRM. Meer onkruid = minder groei.
                  </p>
                  <div className="mt-5 grid gap-2 sm:grid-cols-2">
                    {GROEISCAN_FRICTION_LEVELS.map((f) => {
                      const active = friction === f.id;
                      const weedIcons = Math.min(4, Math.ceil(f.hours / 7));
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
                          <span className="flex items-center justify-between gap-2">
                            <span className="text-sm font-extrabold text-slate-900">
                              {f.label}
                            </span>
                            <span className="flex gap-0.5" aria-hidden>
                              {Array.from({ length: weedIcons }).map((_, i) => (
                                <span
                                  key={i}
                                  className={`size-1.5 rounded-full ${active ? "bg-slate-500" : "bg-slate-300"}`}
                                />
                              ))}
                            </span>
                          </span>
                          <span className="mt-1 block text-xs text-slate-500">{f.body}</span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              ) : null}

              {currentStep.id === "channels" ? (
                <fieldset>
                  <legend className="text-lg font-extrabold text-slate-900 sm:text-xl">
                    Welk zonlicht schijnt er al op je plant?
                  </legend>
                  <p className="mt-2 text-sm text-slate-600">
                    Meerdere kanalen mag. Geen enkele ook, dan weten we waar de eerste straal vandaan komt.
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
                              ? "border-amber-400 bg-amber-50 shadow-sm ring-2 ring-amber-200/60"
                              : "border-slate-200 bg-white hover:border-slate-300"
                          }`}
                        >
                          <span
                            className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${
                              on ? "bg-amber-400 text-white" : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            <Icon className="size-4" aria-hidden />
                          </span>
                          <span>
                            <span className="block text-sm font-extrabold text-slate-900">
                              {ch.label}
                            </span>
                            <span className="mt-0.5 block text-xs text-slate-500">{ch.hint}</span>
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
                    <h2 className="text-lg font-extrabold text-slate-900 sm:text-xl">
                      Oogst: jouw groeiroute
                    </h2>
                    <p className="mt-2 text-sm text-slate-600">
                      Dit is een slimme volgorde op basis van jouw antwoorden. Geen offerte,
                      wel richting die klopt.
                    </p>
                  </div>

                  <div
                    className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4"
                    aria-live="polite"
                  >
                    <p className="text-sm font-extrabold text-slate-900">{insight.headline}</p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{insight.sub}</p>
                    <p className="mt-3 text-sm font-bold text-[#FF5722]">{insight.quip}</p>
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
                          className="group flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-[#FF5722]/40 hover:shadow-md"
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
                            <span className="mt-0.5 block text-sm font-extrabold text-slate-900 group-hover:text-[#FF5722]">
                              {r.title}
                            </span>
                            <span className="mt-1 block text-xs text-slate-500">{r.body}</span>
                          </span>
                          <ArrowUpRight className="size-4 shrink-0 text-slate-400 transition group-hover:text-[#FF5722]" />
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
                      className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-900 transition hover:border-slate-900"
                    >
                      Direct intake
                    </Link>
                  </div>

                  <p className="text-xs text-slate-500">
                    Spelelement om groei voelbaar te maken. De echte Groeiscan doen we persoonlijk
                    met jouw cijfers.
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
                {stepIndex === WIZARD_STEPS.length - 2 ? "Oogst bekijken" : "Volgende station"}
                <ArrowRight className="size-4" aria-hidden />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setStepIndex(0);
                setMaxVisited(0);
              }}
              className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-[#FF5722]"
            >
              <ArrowLeft className="size-4" aria-hidden />
              Opnieuw planten
            </button>
          )}
        </div>

        <aside className="relative flex flex-col gap-4 border-t border-slate-100 bg-gradient-to-b from-slate-50/80 to-white p-5 sm:p-6 lg:border-t-0 lg:p-8">
          <GroeiscanGardenVisual
            activeFloors={activeFloors}
            score={score}
            growthLabel={growthTier.label}
            frictionHours={input.frictionHours}
            channelIds={channels}
            waterPulse={waterPulse}
          />
          <GroeiscanMeneerCoach message={coachLine} theme="light" />
        </aside>
      </div>
    </div>
  );
}
