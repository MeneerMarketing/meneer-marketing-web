"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { HOME_WERKWIJZE_STEPS, type WerkwijzeStep } from "@/data/home-werkwijze";

type WerkwijzeStepsFlowProps = {
  className?: string;
  variant?: "figma" | "opus";
};

const STEP_TAGS = ["Eerst", "Daarna", "Tot slot"] as const;

function StepNode({
  index,
  active,
  total,
  onSelect,
}: {
  index: number;
  active: boolean;
  total: number;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onSelect}
      className="group relative z-10 flex shrink-0 flex-col items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--g-400)]"
    >
      <span className="relative flex h-11 w-11 items-center justify-center">
        {active ? (
          <>
            <span className="werkwijze-glow absolute inset-0 rounded-full bg-[var(--g-400)]/35" />
            <span className="werkwijze-glow-ring absolute inset-1 rounded-full border border-[var(--on-dark-accent)]/60" />
          </>
        ) : (
          <span className="absolute inset-2 rounded-full bg-[var(--g-050)] transition group-hover:bg-[var(--g-100)]" />
        )}
        <span
          className={`relative rounded-full transition-all duration-500 ${
            active
              ? "h-3.5 w-3.5 bg-[var(--g-400)] shadow-[0_0_14px_rgba(107,173,106,.75)]"
              : "h-2.5 w-2.5 bg-[var(--g-300)] group-hover:h-3 group-hover:w-3 group-hover:bg-[var(--g-400)]"
          }`}
        />
      </span>
      <span
        className={`mt-2 text-[8px] font-semibold uppercase tracking-[.14em] transition-colors duration-300 ${
          active ? "text-[var(--g-500)]" : "text-[var(--g-300)] group-hover:text-[var(--g-400)]"
        }`}
      >
        {STEP_TAGS[index] ?? `Stap ${index + 1}`}
      </span>
      <span className="sr-only">
        Stap {index + 1} van {total}
      </span>
    </button>
  );
}

export default function WerkwijzeStepsFlow({
  className = "",
  variant = "figma",
}: WerkwijzeStepsFlowProps) {
  const steps = HOME_WERKWIJZE_STEPS;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const advance = useCallback(() => {
    setActive((prev) => (prev + 1) % steps.length);
  }, [steps.length]);

  useEffect(() => {
    if (paused) return undefined;
    timerRef.current = setInterval(advance, 4200);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [advance, paused]);

  const progressPct = steps.length <= 1 ? 0 : (active / (steps.length - 1)) * 100;

  const cardBase =
    variant === "figma"
      ? "h-full rounded-[1.75rem] border p-6 text-left transition-all duration-500 sm:p-7"
      : "h-full rounded-[var(--radius-lg)] border p-[var(--space-5)] text-left transition-all duration-500 md:p-[var(--space-6)]";

  const cardActive =
    variant === "figma"
      ? "border-[var(--g-300)] bg-white shadow-[0_12px_40px_rgba(40,105,67,.1)] -translate-y-0.5"
      : "border-[var(--diba-green-300)] bg-[var(--white)] shadow-[0_12px_40px_rgba(40,105,67,.1)]";

  const cardIdle =
    variant === "figma"
      ? "border-[var(--g-100)] bg-[var(--g-025)] hover:border-[var(--g-200)] hover:bg-[var(--g-050)]"
      : "border-[var(--diba-green-200)]/50 bg-[var(--diba-cream-50)] hover:border-[var(--diba-green-200)] hover:bg-[var(--diba-cream-100)]";

  return (
    <div
      className={className}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
      }}
    >
      {/* Desktop: timeline + kaarten in één grid */}
      <div className="hidden sm:grid sm:grid-cols-3 sm:gap-4">
        <div className="relative col-span-3 h-[4.5rem]">
          <div className="absolute inset-x-0 top-[22px] h-px bg-[var(--g-100)]" aria-hidden />
          <div
            className="absolute left-0 top-[22px] h-px origin-left bg-gradient-to-r from-[var(--g-400)] via-[var(--g-400)] to-[var(--on-dark-accent)] transition-[width] duration-700 ease-out"
            style={{ width: `${progressPct}%` }}
            aria-hidden
          />
          <div
            className="werkwijze-pulse-travel absolute top-[18px] h-2 w-2 -translate-x-1/2 rounded-full bg-[var(--on-dark-btn)] shadow-[0_0_10px_rgba(184,227,157,.9)]"
            style={{ left: `${progressPct}%` }}
            aria-hidden
          />
          <div className="grid h-full grid-cols-3">
            {steps.map((_, i) => (
              <div key={steps[i].id} className="flex justify-center">
                <StepNode
                  index={i}
                  active={active === i}
                  total={steps.length}
                  onSelect={() => setActive(i)}
                />
              </div>
            ))}
          </div>
        </div>

        {steps.map((step, i) => (
          <StepCard
            key={step.id}
            step={step}
            active={active === i}
            onSelect={() => setActive(i)}
            className={`${cardBase} ${active === i ? cardActive : cardIdle}`}
            variant={variant}
          />
        ))}
      </div>

      {/* Mobiel */}
      <div className="grid gap-3 sm:hidden">
        <div className="relative pl-14">
          <div className="absolute bottom-6 left-[22px] top-6 w-px bg-[var(--g-100)]">
            <div
              className="w-full origin-top bg-gradient-to-b from-[var(--g-400)] to-[var(--on-dark-accent)] transition-[height] duration-700 ease-out"
              style={{ height: `${progressPct}%` }}
              aria-hidden
            />
          </div>
          {steps.map((step, i) => (
            <div key={step.id} className="relative mb-3 last:mb-0">
              <div className="absolute left-0 top-7">
                <StepNode
                  index={i}
                  active={active === i}
                  total={steps.length}
                  onSelect={() => setActive(i)}
                />
              </div>
              <StepCard
                step={step}
                active={active === i}
                onSelect={() => setActive(i)}
                className={`${cardBase} ml-14 ${active === i ? cardActive : cardIdle}`}
                variant={variant}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepCard({
  step,
  active,
  onSelect,
  className,
  variant,
}: {
  step: WerkwijzeStep;
  active: boolean;
  onSelect: () => void;
  className: string;
  variant: "figma" | "opus";
}) {
  const titleClass =
    variant === "figma"
      ? "text-2xl tracking-[-.05em] text-[var(--t-strong)]"
      : "diba-hp-step-title";

  const bodyClass =
    variant === "figma"
      ? "mt-4 text-sm leading-6 text-[var(--t-body)]"
      : "diba-hp-step-body mt-[var(--space-3)]";

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`${className} w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-400)] ${
        active ? "cursor-default" : "cursor-pointer"
      }`}
      aria-pressed={active}
    >
      <h3 className={`${titleClass} ${active ? "text-[var(--g-700)]" : "text-[var(--t-strong)]"}`}>
        {step.title}
      </h3>
      <p className={`${bodyClass} ${active ? "text-[var(--t-body)]" : ""}`}>{step.body}</p>
    </button>
  );
}
