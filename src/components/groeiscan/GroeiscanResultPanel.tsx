"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Calendar, Sparkles } from "lucide-react";
import Link from "next/link";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import { siteCtas } from "@/lib/cta";
import type {
  GroeikrachtBreakdown,
  GrowthTier,
  PlaygroundInsight,
  RouteStep,
} from "@/lib/groeiscan-playground";

interface GroeiscanResultPanelProps {
  score: number;
  growthTier: GrowthTier;
  breakdown: GroeikrachtBreakdown;
  insight: PlaygroundInsight;
  route: RouteStep[];
  goalLabel: string;
}

export function GroeiscanResultPanel({
  score,
  growthTier,
  breakdown,
  insight,
  route,
  goalLabel,
}: GroeiscanResultPanelProps) {
  const reduce = useReducedMotion() ?? false;

  return (
    <div className="space-y-6">
      {/* Score hero */}
      <motion.div
        initial={reduce ? undefined : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-3xl border border-[#FF5722]/25 bg-gradient-to-br from-[#FF5722]/10 via-white to-orange-50/50 p-6 sm:p-8"
      >
        <div
          className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-[#FF5722]/10 blur-3xl"
          aria-hidden
        />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <InteractiveLogo className="size-14 shrink-0 sm:size-16" />
            <div>
              <p className="inline-flex items-center gap-1.5 rounded-full border border-[#FF5722]/20 bg-white/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#FF5722]">
                <Sparkles className="size-3" aria-hidden />
                Jouw groeikracht
              </p>
              <p className="mt-3 flex items-baseline gap-1">
                <motion.span
                  key={score}
                  initial={reduce ? undefined : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-5xl font-black tabular-nums tracking-tighter text-[#FF5722] sm:text-6xl"
                >
                  {score}
                </motion.span>
                <span className="text-xl font-bold text-slate-400">/100</span>
              </p>
              <p className="mt-1 text-lg font-extrabold text-slate-900">{growthTier.label}</p>
              <p className="mt-1 text-sm text-slate-600">{growthTier.body}</p>
            </div>
          </div>

          <div className="shrink-0 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Jouw doel
            </p>
            <p className="mt-1 text-sm font-extrabold text-slate-900">{goalLabel}</p>
            <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Score opgebouwd uit
            </p>
            <p className="mt-1 font-mono text-xs font-bold text-slate-600">
              +{breakdown.goal} doel · +{breakdown.stand} stand · +{breakdown.budget}{" "}
              budget
            </p>
            <p className="font-mono text-xs font-bold text-slate-600">
              +{breakdown.ritme} ritme · +{breakdown.stack} stack
            </p>
          </div>
        </div>

        <p className="relative mt-5 text-sm font-bold italic text-[#FF5722]">
          &ldquo;{growthTier.quip}&rdquo;
        </p>
      </motion.div>

      {/* Insight */}
      <motion.div
        initial={reduce ? undefined : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        aria-live="polite"
      >
        <p className="text-base font-extrabold text-slate-900">{insight.headline}</p>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{insight.sub}</p>
        <p className="mt-3 text-sm font-bold text-slate-800">{insight.quip}</p>
      </motion.div>

      {/* Route */}
      <div>
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400">
          Jouw route (in deze volgorde)
        </h3>
        <ol className="mt-4 space-y-3">
          {route.map((r, index) => (
            <motion.li
              key={r.href}
              initial={reduce ? undefined : { opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 + index * 0.08 }}
            >
              <Link
                href={r.href}
                className="group relative flex gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-[#FF5722]/35 hover:shadow-md"
              >
                <span
                  className="absolute left-0 top-0 h-full w-1"
                  style={{ backgroundColor: r.accent }}
                  aria-hidden
                />
                <span
                  className="flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-black text-white"
                  style={{ backgroundColor: r.accent }}
                >
                  {index + 1}
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
                <ArrowUpRight className="size-4 shrink-0 self-center text-slate-400 transition group-hover:text-[#FF5722]" />
              </Link>
            </motion.li>
          ))}
        </ol>
      </div>

      {/* CTA */}
      <motion.div
        initial={reduce ? undefined : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="rounded-2xl border border-slate-900 bg-slate-900 p-5 text-white sm:p-6"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-orange-300">
              <Calendar className="size-3.5" aria-hidden />
              Volgende stap
            </p>
            <p className="mt-2 text-lg font-extrabold">
              Plan je Groeiscan-sessie met mij
            </p>
            <p className="mt-1 text-sm text-slate-300">
              Deze scan is je start. In 45 minuten maak ik er een concreet plan van met
              jouw cijfers. Geen verkooppraatje, wel eerlijk advies.
            </p>
          </div>
          <a
            href="#groeiscan-aanvraag"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#FF5722] px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-orange-600"
          >
            Kies een moment
            <ArrowUpRight className="size-4" aria-hidden />
          </a>
        </div>
      </motion.div>

      <p className="text-center text-xs text-slate-500">
        Liever direct bellen?{" "}
        <Link
          href={siteCtas.startIntake.href}
          className="font-bold text-[#FF5722] hover:underline"
        >
          {siteCtas.startIntake.label}
        </Link>
      </p>
    </div>
  );
}
