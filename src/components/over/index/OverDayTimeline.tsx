"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  BarChart3,
  Coffee,
  MessageCircle,
  Rocket,
  Terminal,
} from "lucide-react";
import { useState } from "react";
import { OVER_DAY } from "@/data/over-index";

const MOOD_ICONS = {
  coffee: Coffee,
  code: Terminal,
  chart: BarChart3,
  call: MessageCircle,
  deploy: Rocket,
} as const;

function DayMoodVisual({ mood, active }: { mood: keyof typeof MOOD_ICONS; active: boolean }) {
  const reduce = useReducedMotion();
  const Icon = MOOD_ICONS[mood];

  return (
    <motion.div
      animate={active || reduce ? { scale: 1, rotate: 0 } : { scale: 0.9, rotate: -3 }}
      className="flex h-32 flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4"
    >
      <span className="flex size-14 items-center justify-center rounded-2xl bg-[#FF5722]/10 text-[#FF5722]">
        <Icon className="size-7" strokeWidth={1.6} aria-hidden />
      </span>
      {mood === "deploy" && active ? (
        <motion.span
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700"
        >
          shipped ✓
        </motion.span>
      ) : null}
    </motion.div>
  );
}

export function OverDayTimeline() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const moment = OVER_DAY[active]!;

  return (
    <section
      className="border-b border-slate-200 bg-white"
      aria-labelledby="over-day-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF5722]">
          Een dag met Meneer
        </p>
        <h2
          id="over-day-heading"
          className="mt-3 max-w-2xl text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
        >
          Zo ziet een werkdag eruit
        </h2>
        <p className="mt-3 max-w-xl text-slate-600">
          Geen mystiek. Wel ritme. Scroll door de dag en zie waar je geld en tijd
          naartoe gaan.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-stretch">
          <div className="relative flex flex-col gap-0">
            {OVER_DAY.map((item, index) => {
              const isActive = active === index;
              const isLast = index === OVER_DAY.length - 1;
              return (
                <div key={item.id} className="relative flex gap-4">
                  {!isLast ? (
                    <span
                      className="absolute left-[1.125rem] top-10 bottom-0 w-px bg-slate-200"
                      aria-hidden
                    />
                  ) : null}
                  <button
                    type="button"
                    onClick={() => setActive(index)}
                    aria-pressed={isActive}
                    className="group relative z-10 flex w-full gap-4 pb-6 text-left"
                  >
                    <span
                      className={`mt-1 flex size-9 shrink-0 items-center justify-center rounded-full border-2 text-[10px] font-black transition ${
                        isActive
                          ? "border-[#FF5722] bg-[#FF5722] text-white"
                          : "border-slate-200 bg-white text-slate-400 group-hover:border-slate-300"
                      }`}
                    >
                      {item.time.slice(0, 2)}
                    </span>
                    <span className="min-w-0 flex-1 pt-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {item.time}
                      </span>
                      <span
                        className={`mt-0.5 block text-sm font-extrabold ${
                          isActive ? "text-[#FF5722]" : "text-slate-900"
                        }`}
                      >
                        {item.title}
                      </span>
                    </span>
                  </button>
                </div>
              );
            })}
          </div>

          <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
            <AnimatePresence mode="wait">
              <motion.div
                key={moment.id}
                initial={reduce ? false : { opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                className="flex h-full flex-col"
              >
                <DayMoodVisual mood={moment.mood} active />
                <p className="mt-4 text-lg font-extrabold text-slate-900">{moment.title}</p>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                  {moment.body}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
