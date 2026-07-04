"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BarChart3, GitBranch, Mail, Route } from "lucide-react";
import { useCallback, useState } from "react";
import type { BuildStage } from "@/components/pillars/premium/BuildStagesScroll";

const STAGE_ICONS = [Route, Mail, GitBranch, BarChart3] as const;
const STAGE_TAGS = ["Kaart", "Automatisering", "Koppelen", "Meten"] as const;

function StageJourney() {
  return (
    <div className="space-y-2 p-5">
      {[
        { step: "Aankoop", gap: false },
        { step: "Welkom", gap: true },
        { step: "Opvolging", gap: true },
        { step: "Herhaal", gap: false },
      ].map((row, i) => (
        <motion.div
          key={row.step}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.08 * i }}
          className={`flex items-center justify-between rounded-xl border px-3 py-2 ${
            row.gap
              ? "border-amber-200 bg-amber-50"
              : "border-emerald-100 bg-emerald-50/80"
          }`}
        >
          <span className="text-xs font-bold text-slate-700">{row.step}</span>
          <span
            className={`text-[10px] font-black uppercase ${
              row.gap ? "text-amber-600" : "text-emerald-600"
            }`}
          >
            {row.gap ? "Gat" : "OK"}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

function StageFlows() {
  return (
    <div className="space-y-2 p-5">
      {[
        { name: "Welkom", open: "68%", rev: "€ 12" },
        { name: "Opvolging", open: "42%", rev: "€ 34" },
        { name: "Win-back", open: "31%", rev: "€ 28" },
      ].map((flow, i) => (
        <motion.div
          key={flow.name}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * i }}
          className="rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">{flow.name}</span>
            <span className="text-[10px] font-bold text-[#FF5722]">{flow.rev}</span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-200">
            <span
              className="block h-full rounded-full bg-[#FF5722]/70"
              style={{ width: flow.open }}
              aria-hidden
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function StageSync() {
  const nodes = ["Shopify", "Klaviyo", "Factuur"];
  return (
    <div className="p-5">
      <div className="flex items-center justify-center gap-2">
        {nodes.map((node, i) => (
          <motion.div
            key={node}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.12 * i }}
            className="flex items-center gap-2"
          >
            <span className="flex size-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-[10px] font-bold text-slate-700 shadow-sm">
              {node}
            </span>
            {i < nodes.length - 1 ? (
              <span className="text-sm text-slate-300" aria-hidden>
                →
              </span>
            ) : null}
          </motion.div>
        ))}
      </div>
      <p className="mt-6 text-center text-[10px] text-slate-400">
        Alles in sync, geen gekopieer
      </p>
    </div>
  );
}

function StageMetrics() {
  return (
    <div className="space-y-2 p-5">
      {[
        { label: "Herhaal", value: "+38%", tone: "text-emerald-500" },
        { label: "Omzet/flow", value: "€ 74", tone: "text-[#FF5722]" },
        { label: "Churn", value: "-12%", tone: "text-emerald-500" },
      ].map((row, i) => (
        <motion.div
          key={row.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * i }}
          className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2.5"
        >
          <span className="text-[10px] font-bold uppercase text-slate-400">
            {row.label}
          </span>
          <span className={`text-xs font-extrabold ${row.tone}`}>{row.value}</span>
        </motion.div>
      ))}
    </div>
  );
}

interface BehoudStagesScrollProps {
  title: string;
  stages: BuildStage[];
}

export function BehoudStagesScroll({ title, stages }: BehoudStagesScrollProps) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const selectStage = useCallback((index: number) => setActive(index), []);

  const visuals = [
    <StageJourney key="journey" />,
    <StageFlows key="flows" />,
    <StageSync key="sync" />,
    <StageMetrics key="metrics" />,
  ];

  return (
    <section
      className="border-b border-slate-200 bg-white"
      aria-labelledby="behoud-stages-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <h2
          id="behoud-stages-heading"
          className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
        >
          {title}
        </h2>
        <p className="mt-2 max-w-xl text-slate-600">
          Klik een fase en zie hoe behoud van klantreis naar stille omzet gaat.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:items-stretch lg:gap-10">
          <div className="flex flex-col gap-2">
            {stages.map((stage, index) => {
              const Icon = STAGE_ICONS[index % STAGE_ICONS.length];
              const isActive = active === index;
              return (
                <button
                  key={stage.title}
                  type="button"
                  onClick={() => selectStage(index)}
                  aria-pressed={isActive}
                  className={`flex flex-1 items-start gap-4 rounded-2xl border px-4 py-4 text-left transition-all sm:px-5 ${
                    isActive
                      ? "border-[#FF5722]/40 bg-[#FF5722]/5 shadow-[0_12px_32px_-20px_rgba(255,87,34,0.35)]"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <span
                    className={`flex size-10 shrink-0 items-center justify-center rounded-xl border ${
                      isActive
                        ? "border-[#FF5722] bg-[#FF5722] text-white"
                        : "border-slate-200 bg-slate-50 text-slate-500"
                    }`}
                    aria-hidden
                  >
                    <Icon className="size-5" strokeWidth={1.8} />
                  </span>
                  <span className="min-w-0">
                    <p
                      className={`text-[10px] font-black uppercase tracking-[0.16em] ${
                        isActive ? "text-[#FF5722]" : "text-slate-400"
                      }`}
                    >
                      {STAGE_TAGS[index % STAGE_TAGS.length]}
                    </p>
                    <h3 className="mt-0.5 text-base font-extrabold text-slate-900">
                      {stage.title}
                    </h3>
                    <p
                      className={`mt-1 text-sm leading-snug text-slate-600 ${
                        isActive ? "line-clamp-none" : "line-clamp-2"
                      }`}
                    >
                      {stage.body}
                    </p>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col">
            <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_48px_-28px_rgba(15,23,42,0.2)] lg:sticky lg:top-28">
              <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
                <span className="size-2.5 rounded-full bg-[#FF5722]/80" aria-hidden />
                <span className="size-2.5 rounded-full bg-emerald-400" aria-hidden />
                <span className="size-2.5 rounded-full bg-amber-300" aria-hidden />
                <span className="ml-3 flex-1 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold text-slate-400">
                  behoud.meneer
                </span>
                <span className="rounded-full bg-[#FF5722] px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white">
                  {STAGE_TAGS[active % STAGE_TAGS.length]}
                </span>
              </div>
              <div className="relative flex min-h-[260px] flex-1 flex-col justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={reduce ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                  >
                    {visuals[active]}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
            <div className="mt-4 flex justify-center gap-2">
              {stages.map((stage, i) => (
                <button
                  key={stage.title}
                  type="button"
                  onClick={() => selectStage(i)}
                  aria-label={stage.title}
                  className={`h-1.5 rounded-full transition-all ${
                    i === active ? "w-8 bg-[#FF5722]" : "w-3 bg-slate-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
