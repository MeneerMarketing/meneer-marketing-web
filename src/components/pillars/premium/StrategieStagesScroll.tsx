"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BarChart3, Layers, LineChart, RefreshCw } from "lucide-react";
import { useCallback, useState } from "react";
import type { BuildStage } from "@/components/pillars/premium/BuildStagesScroll";

const STAGE_ICONS = [BarChart3, Layers, LineChart, RefreshCw] as const;
const STAGE_TAGS = ["Analyseren", "Kiezen", "Plannen", "Bijsturen"] as const;

function StageData() {
  return (
    <div className="space-y-2 p-5">
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Omzet", value: "€ 48k" },
          { label: "CAC", value: "€ 67" },
          { label: "Conv.", value: "2,1%" },
        ].map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 * i }}
            className="rounded-xl border border-slate-100 bg-slate-50 px-2.5 py-2"
          >
            <p className="text-[8px] font-bold uppercase text-slate-400">{m.label}</p>
            <p className="text-sm font-extrabold text-slate-900">{m.value}</p>
          </motion.div>
        ))}
      </div>
      <div className="flex items-end gap-1 pt-2">
        {[35, 55, 42, 70, 58, 82].map((h, i) => (
          <span
            key={i}
            className="flex-1 rounded-t bg-violet-400/40"
            style={{ height: `${h}px` }}
            aria-hidden
          />
        ))}
      </div>
    </div>
  );
}

function StageChannels() {
  const channels = [
    { name: "SEO", on: true },
    { name: "Ads", on: false },
    { name: "E-mail", on: true },
    { name: "Social", on: false },
  ];
  return (
    <div className="space-y-2 p-5">
      {channels.map((ch, i) => (
        <motion.div
          key={ch.name}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 * i }}
          className={`flex items-center justify-between rounded-xl border px-3 py-2 ${
            ch.on
              ? "border-[#FF5722]/30 bg-[#FF5722]/5"
              : "border-slate-100 bg-slate-50/80 opacity-50"
          }`}
        >
          <span className="text-xs font-bold text-slate-700">{ch.name}</span>
          <span
            className={`text-[10px] font-black uppercase ${
              ch.on ? "text-[#FF5722]" : "text-slate-400"
            }`}
          >
            {ch.on ? "Actief" : "Later"}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

function StagePlan() {
  return (
    <div className="p-5">
      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <p className="text-[10px] font-black uppercase tracking-wider text-violet-600">
          Groeiplan Q2
        </p>
        {[
          "CRO landingspagina's",
          "Tracking audit",
          "Google Ads fase 2",
        ].map((item, i) => (
          <motion.div
            key={item}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.12 * i }}
            className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2 first:mt-3 first:border-0 first:pt-0"
          >
            <span className="text-[11px] font-semibold text-slate-700">{item}</span>
            <span className="text-[10px] font-bold text-slate-400">
              {["€ 4.2k", "€ 1.8k", "€ 6k"][i]}
            </span>
          </motion.div>
        ))}
        <div className="mt-3 flex justify-between border-t border-slate-200 pt-2 text-xs font-extrabold">
          <span className="text-slate-500">Totaal</span>
          <span className="text-slate-900">€ 12k</span>
        </div>
      </div>
    </div>
  );
}

function StageReview() {
  return (
    <div className="space-y-2 p-5">
      {[
        { label: "Werkt", value: "+22% leads", tone: "text-emerald-500" },
        { label: "Pauze", value: "Social ads", tone: "text-amber-500" },
        { label: "Opschalen", value: "SEO content", tone: "text-[#FF5722]" },
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

interface StrategieStagesScrollProps {
  title: string;
  stages: BuildStage[];
}

export function StrategieStagesScroll({ title, stages }: StrategieStagesScrollProps) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const selectStage = useCallback((index: number) => setActive(index), []);

  const visuals = [
    <StageData key="data" />,
    <StageChannels key="channels" />,
    <StagePlan key="plan" />,
    <StageReview key="review" />,
  ];

  return (
    <section className="border-b border-slate-200 bg-white" aria-labelledby="strategie-stages-heading">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <h2
          id="strategie-stages-heading"
          className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
        >
          {title}
        </h2>
        <p className="mt-2 max-w-xl text-slate-600">
          Klik een fase en zie hoe je groeiplan van data naar actie gaat.
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
                      ? "border-violet-400/40 bg-violet-50/80 shadow-[0_12px_32px_-20px_rgba(109,40,217,0.35)]"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <span
                    className={`flex size-10 shrink-0 items-center justify-center rounded-xl border ${
                      isActive
                        ? "border-violet-600 bg-violet-600 text-white"
                        : "border-slate-200 bg-slate-50 text-slate-500"
                    }`}
                    aria-hidden
                  >
                    <Icon className="size-5" strokeWidth={1.8} />
                  </span>
                  <span className="min-w-0">
                    <p
                      className={`text-[10px] font-black uppercase tracking-[0.16em] ${
                        isActive ? "text-violet-600" : "text-slate-400"
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
                <span className="size-2.5 rounded-full bg-amber-300" aria-hidden />
                <span className="size-2.5 rounded-full bg-emerald-400" aria-hidden />
                <span className="ml-3 flex-1 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold text-slate-400">
                  groeiplan.meneer
                </span>
                <span className="rounded-full bg-violet-600 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white">
                  {STAGE_TAGS[active % STAGE_TAGS.length]}
                </span>
              </div>
              <div className="flex min-h-[260px] flex-1 flex-col justify-center">
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
                    i === active ? "w-8 bg-violet-600" : "w-3 bg-slate-200"
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
