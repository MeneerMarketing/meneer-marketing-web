"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BarChart3, FlaskConical, Megaphone, Radio } from "lucide-react";
import { useCallback, useState } from "react";
import type { BuildStage } from "@/components/pillars/premium/BuildStagesScroll";

const STAGE_ICONS = [Radio, Megaphone, FlaskConical, BarChart3] as const;
const STAGE_TAGS = ["Meten", "Kanaal", "Testen", "Schalen"] as const;

function StageTracking() {
  return (
    <div className="space-y-2 p-5">
      {[
        { event: "purchase", status: "OK" },
        { event: "add_to_cart", status: "OK" },
        { event: "page_view", status: "OK" },
      ].map((row, i) => (
        <motion.div
          key={row.event}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.08 * i }}
          className="flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50/80 px-3 py-2"
        >
          <span className="font-mono text-[10px] font-semibold text-slate-700">
            {row.event}
          </span>
          <span className="text-[10px] font-black text-emerald-600">{row.status}</span>
        </motion.div>
      ))}
      <p className="pt-2 text-center text-[10px] text-slate-400">
        GTM · server-side · geen ruis
      </p>
    </div>
  );
}

function StageChannels() {
  return (
    <div className="space-y-2 p-5">
      {[
        { name: "Google Search", hook: "Intent · hoog", on: true },
        { name: "Meta Reels", hook: "Awareness · UGC", on: true },
        { name: "Shopping", hook: "Productfeed", on: false },
      ].map((ch, i) => (
        <motion.div
          key={ch.name}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * i }}
          className={`rounded-xl border px-3 py-2.5 ${
            ch.on
              ? "border-[#FF5722]/30 bg-[#FF5722]/5"
              : "border-slate-100 bg-slate-50/80 opacity-50"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">{ch.name}</span>
            <span
              className={`text-[9px] font-black uppercase ${
                ch.on ? "text-[#FF5722]" : "text-slate-400"
              }`}
            >
              {ch.on ? "Live" : "Later"}
            </span>
          </div>
          <p className="mt-0.5 text-[10px] text-slate-500">{ch.hook}</p>
        </motion.div>
      ))}
    </div>
  );
}

function StageTest() {
  return (
    <div className="p-5">
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "Creative A", roas: "2,1×", win: false },
          { label: "Creative B", roas: "4,6×", win: true },
        ].map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * i }}
            className={`rounded-xl border p-3 ${
              c.win
                ? "border-[#FF5722] bg-[#FF5722]/5 ring-2 ring-[#FF5722]/20"
                : "border-slate-100 bg-slate-50/80"
            }`}
          >
            <p className="text-[10px] font-bold text-slate-500">{c.label}</p>
            <p
              className={`mt-1 text-lg font-extrabold ${
                c.win ? "text-[#FF5722]" : "text-slate-400"
              }`}
            >
              {c.roas}
            </p>
            {c.win ? (
              <span className="mt-1 inline-block text-[9px] font-bold text-emerald-600">
                Winnaar
              </span>
            ) : null}
          </motion.div>
        ))}
      </div>
      <p className="mt-3 text-center text-[10px] text-slate-400">
        Klein budget · snel leren
      </p>
    </div>
  );
}

function StageScale() {
  return (
    <div className="space-y-2 p-5">
      <div className="flex items-end gap-1.5 pt-2">
        {[30, 45, 55, 72, 88, 95].map((h, i) => (
          <motion.span
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${h}px` }}
            transition={{ delay: 0.08 * i }}
            className="flex-1 rounded-t bg-[#FF5722]/50"
            aria-hidden
          />
        ))}
      </div>
      <div className="flex justify-between text-[10px] font-bold">
        <span className="text-slate-400">Budget</span>
        <span className="text-emerald-500">ROAS 4,8×</span>
      </div>
      <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
        <p className="text-[10px] text-slate-500">Winnaar krijgt +40% budget</p>
        <p className="text-xs font-extrabold text-slate-900">Verliezer gaat uit</p>
      </div>
    </div>
  );
}

interface CampagnesStagesScrollProps {
  title: string;
  stages: BuildStage[];
}

export function CampagnesStagesScroll({ title, stages }: CampagnesStagesScrollProps) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const selectStage = useCallback((index: number) => setActive(index), []);

  const visuals = [
    <StageTracking key="track" />,
    <StageChannels key="channels" />,
    <StageTest key="test" />,
    <StageScale key="scale" />,
  ];

  return (
    <section
      className="border-b border-slate-200 bg-white"
      aria-labelledby="campagnes-stages-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <h2
          id="campagnes-stages-heading"
          className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
        >
          {title}
        </h2>
        <p className="mt-2 max-w-xl text-slate-600">
          Klik een fase en zie hoe je campagne van meting naar schaal gaat.
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
                <span className="size-2.5 rounded-full bg-[#4285F4]/80" aria-hidden />
                <span className="size-2.5 rounded-full bg-[#E1306C]/80" aria-hidden />
                <span className="size-2.5 rounded-full bg-[#FF5722]/80" aria-hidden />
                <span className="ml-3 flex-1 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold text-slate-400">
                  ads.meneer
                </span>
                <span className="rounded-full bg-[#FF5722] px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white">
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
