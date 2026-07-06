"use client";

import { Code2, Rocket, type LucideIcon } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { AboutMeneerJourneyStep } from "@/data/home-about-meneer";
import { LiveBroadcastMark } from "@/components/icons/LiveBroadcastMark";

const EASE = [0.22, 1, 0.36, 1] as const;

interface StepVisual {
  Icon?: LucideIcon;
  CustomIcon?: React.ComponentType<{ className?: string }>;
  markerClass: string;
  iconClass: string;
  cardClass: string;
  tilt: number;
  pulse?: boolean;
}

const STEP_VISUALS: Record<string, StepVisual> = {
  dev: {
    Icon: Code2,
    markerClass:
      "bg-gradient-to-br from-sky-100 to-sky-50 ring-2 ring-sky-200/90 shadow-[0_8px_20px_-10px_rgba(14,165,233,0.55)]",
    iconClass: "text-sky-600",
    cardClass: "border-sky-100/90 bg-gradient-to-r from-sky-50/80 to-white",
    tilt: -1.5,
  },
  years: {
    Icon: Rocket,
    markerClass:
      "bg-gradient-to-br from-[#FF5722] to-orange-500 shadow-[0_10px_24px_-8px_rgba(255,87,34,0.55)] ring-2 ring-orange-300/50",
    iconClass: "text-white",
    cardClass: "border-orange-100/90 bg-gradient-to-r from-orange-50/90 to-white",
    tilt: 1.2,
  },
  now: {
    CustomIcon: LiveBroadcastMark,
    markerClass:
      "bg-gradient-to-br from-emerald-100 to-emerald-50 ring-2 ring-emerald-200/90 shadow-[0_8px_20px_-10px_rgba(16,185,129,0.45)]",
    iconClass: "text-emerald-600",
    cardClass: "border-emerald-100/90 bg-gradient-to-r from-emerald-50/70 to-white",
    tilt: -0.8,
    pulse: true,
  },
};

function JourneyMarker({
  step,
  visual,
  isLast,
}: {
  step: AboutMeneerJourneyStep;
  visual: StepVisual;
  isLast: boolean;
}) {
  const { Icon, CustomIcon, markerClass, iconClass, pulse } = visual;
  const isYears = step.id === "years";

  return (
    <div className="relative flex flex-col items-center">
      <motion.span
        whileHover={{ scale: 1.06, rotate: visual.tilt * 1.4 }}
        transition={{ type: "spring", stiffness: 420, damping: 18 }}
        className={`relative flex size-12 shrink-0 items-center justify-center rounded-2xl ${markerClass}`}
        aria-hidden
      >
        {isYears ? (
          <>
            <Rocket
              className="absolute -right-1 -top-1 size-3.5 text-white/90"
              strokeWidth={2.5}
              aria-hidden
            />
            <span className="flex flex-col items-center text-white">
            <span className="font-black leading-none tracking-tight [font-size:17px]">
              {step.era}
            </span>
            {step.eraSub ? (
              <span className="mt-0.5 font-bold uppercase leading-none tracking-[0.16em] opacity-90 [font-size:7px]">
                {step.eraSub}
              </span>
            ) : null}
          </span>
          </>
        ) : (
          <>
            {CustomIcon ? (
              <CustomIcon className={`size-5 ${iconClass}`} />
            ) : Icon ? (
              <Icon className={`size-5 ${iconClass}`} strokeWidth={2.4} aria-hidden />
            ) : null}
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-2 py-0.5 font-black uppercase leading-none tracking-[0.12em] text-slate-600 shadow-sm ring-1 ring-slate-200/90 [font-size:8px]">
              {step.era}
            </span>
          </>
        )}
        {pulse ? (
          <span className="absolute -right-0.5 -top-0.5 flex size-3">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex size-3 rounded-full bg-emerald-500 ring-2 ring-white" />
          </span>
        ) : null}
      </motion.span>

      {!isLast ? (
        <span
          className="my-1.5 min-h-[1.25rem] w-px flex-1 bg-gradient-to-b from-[#FF5722]/50 via-[#FF5722]/25 to-transparent"
          aria-hidden
        />
      ) : null}
    </div>
  );
}

interface AboutMeneerJourneyListProps {
  steps: readonly AboutMeneerJourneyStep[];
  showTargetOnLast?: boolean;
}

/** Speelse journey-timeline met iconen, kleur en lichte tilt. */
export function AboutMeneerJourneyList({
  steps,
  showTargetOnLast = false,
}: AboutMeneerJourneyListProps) {
  const reduce = useReducedMotion();

  return (
    <ul className="space-y-0">
      {steps.map((step, i) => {
        const visual = STEP_VISUALS[step.id] ?? STEP_VISUALS.dev!;
        const isLast = i === steps.length - 1;

        return (
          <motion.li
            key={step.id}
            initial={reduce ? false : { opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-8%" }}
            transition={{ delay: i * 0.07, duration: 0.4, ease: EASE }}
            className="flex gap-3"
          >
            <JourneyMarker step={step} visual={visual} isLast={isLast} />

            <motion.article
              whileHover={reduce ? undefined : { y: -2, rotate: 0 }}
              style={{ rotate: reduce ? 0 : visual.tilt }}
              className={`mb-3 min-w-0 flex-1 rounded-2xl border px-4 py-3.5 shadow-sm transition-shadow duration-300 hover:shadow-md ${visual.cardClass}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-extrabold leading-tight tracking-tight text-slate-900">
                    {step.title}
                  </p>
                  <p className="mt-1 text-[13px] leading-snug text-slate-500">{step.detail}</p>
                </div>
                {showTargetOnLast && isLast ? (
                  <span
                    className="mt-1 size-2.5 shrink-0 rounded-full bg-[#FF5722] shadow-[0_0_12px_rgba(255,87,34,0.6)]"
                    aria-hidden
                  />
                ) : null}
              </div>
            </motion.article>
          </motion.li>
        );
      })}
    </ul>
  );
}

/** @deprecated Gebruik AboutMeneerJourneyList — badge zit nu in de timeline-marker. */
export function AboutMeneerJourneyBadge({
  era,
  eraSub,
}: Pick<AboutMeneerJourneyStep, "era" | "eraSub">) {
  return (
    <span
      className="flex size-11 shrink-0 flex-col items-center justify-center rounded-xl bg-slate-950 text-center"
      aria-hidden
    >
      <span className="font-black uppercase leading-none tracking-wide text-[#FF5722] [font-size:11px]">
        {era}
      </span>
      {eraSub ? (
        <span className="mt-1 font-bold uppercase leading-none tracking-[0.14em] text-white/50 [font-size:8px]">
          {eraSub}
        </span>
      ) : null}
    </span>
  );
}
