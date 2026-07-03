"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FileText, Search, Shield, Star } from "lucide-react";
import { useCallback, useState } from "react";
import type { BuildStage } from "@/components/pillars/premium/BuildStagesScroll";

const STAGE_ICONS = [Search, Shield, FileText, Star] as const;
const STAGE_TAGS = ["Onderzoek", "Techniek", "Content", "Autoriteit"] as const;

function StageResearch() {
  return (
    <div className="space-y-2 p-5">
      {[
        "shopify expert nederland",
        "beste seo bureau",
        "vindbaar in chatgpt",
      ].map((q, i) => (
        <motion.div
          key={q}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 * i }}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
        >
          <Search className="size-3.5 shrink-0 text-slate-400" aria-hidden />
          <span className="truncate text-[11px] font-semibold text-slate-700">{q}</span>
        </motion.div>
      ))}
    </div>
  );
}

function StageTech() {
  return (
    <div className="grid grid-cols-2 gap-2 p-5">
      {[
        { label: "CWV", value: "Groen", ok: true },
        { label: "Schema", value: "Actief", ok: true },
        { label: "Sitemap", value: "OK", ok: true },
        { label: "Index", value: "98%", ok: true },
      ].map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.08 * i }}
          className="rounded-xl border border-emerald-200 bg-emerald-50/80 px-3 py-2"
        >
          <p className="text-[8px] font-bold uppercase text-slate-400">{item.label}</p>
          <p className="text-sm font-extrabold text-emerald-600">{item.value}</p>
        </motion.div>
      ))}
    </div>
  );
}

function StageContent() {
  return (
    <div className="space-y-2 p-5">
      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <p className="text-[10px] font-bold text-[#FF5722]">meneermarketing.nl</p>
        <p className="mt-1 text-xs font-extrabold text-slate-900">
          SEO & vindbaarheid in AI-zoek
        </p>
        <p className="mt-1 line-clamp-2 text-[10px] text-slate-500">
          Gevonden worden in Google, ChatGPT en Maps. Content die antwoord geeft...
        </p>
      </div>
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-1 flex-1 rounded-full bg-slate-200" aria-hidden />
        ))}
      </div>
    </div>
  );
}

function StageAuthority() {
  return (
    <div className="space-y-2 p-5">
      <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50/80 px-3 py-2">
        <span className="text-amber-500" aria-hidden>
          ★★★★★
        </span>
        <span className="text-xs font-extrabold text-slate-800">4,9 · 47 reviews</span>
      </div>
      {[
        { label: "Positie gem.", value: "Top 5" },
        { label: "Organisch/mnd", value: "+34%" },
      ].map((row, i) => (
        <motion.div
          key={row.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * i }}
          className="flex justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2"
        >
          <span className="text-[10px] font-bold uppercase text-slate-400">{row.label}</span>
          <span className="text-xs font-extrabold text-emerald-600">{row.value}</span>
        </motion.div>
      ))}
    </div>
  );
}

interface VindbaarheidStagesScrollProps {
  title: string;
  stages: BuildStage[];
}

export function VindbaarheidStagesScroll({
  title,
  stages,
}: VindbaarheidStagesScrollProps) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const selectStage = useCallback((index: number) => setActive(index), []);

  const visuals = [
    <StageResearch key="research" />,
    <StageTech key="tech" />,
    <StageContent key="content" />,
    <StageAuthority key="authority" />,
  ];

  return (
    <section className="border-b border-slate-200 bg-white" aria-labelledby="vindbaarheid-stages-heading">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <h2
          id="vindbaarheid-stages-heading"
          className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
        >
          {title}
        </h2>
        <p className="mt-2 max-w-xl text-slate-600">
          Klik een fase en zie hoe vindbaarheid van zoekgedrag naar autoriteit groeit.
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
                <span className="size-2.5 rounded-full bg-amber-300" aria-hidden />
                <span className="size-2.5 rounded-full bg-emerald-400" aria-hidden />
                <span className="ml-3 flex-1 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold text-slate-400">
                  google.nl · preview
                </span>
                <span className="rounded-full bg-slate-900 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white">
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
