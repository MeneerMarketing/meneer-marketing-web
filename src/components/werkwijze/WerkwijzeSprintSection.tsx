"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { LivingCloudGrid } from "@/components/effects/LivingCloudGrid";
import { WerkwijzeSprintTimeline } from "@/components/werkwijze/WerkwijzeSprintTimeline";
import { WERKWIJZE_SPRINTS } from "@/data/werkwijze-index";

export function WerkwijzeSprintSection() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const card = WERKWIJZE_SPRINTS.cards[active]!;

  return (
    <section
      className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white"
      aria-labelledby="werkwijze-sprint-heading"
    >
      <LivingCloudGrid />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF5722]">
          Ritme
        </p>
        <h2
          id="werkwijze-sprint-heading"
          className="mt-3 max-w-2xl text-2xl font-extrabold tracking-tighter text-slate-900 sm:text-3xl"
        >
          {WERKWIJZE_SPRINTS.title}
        </h2>
        <p className="mt-3 max-w-xl text-slate-600">{WERKWIJZE_SPRINTS.subtitle}</p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,300px)_minmax(0,1fr)] lg:items-center lg:gap-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {WERKWIJZE_SPRINTS.cards.map((item, i) => {
              const isActive = active === i;
              return (
                <motion.button
                  key={item.id}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-pressed={isActive}
                  whileHover={reduce ? undefined : { y: -2 }}
                  className={`flex h-full flex-col rounded-2xl border p-5 text-left transition ${
                    isActive
                      ? "border-[#FF5722]/40 bg-white shadow-[0_16px_40px_-20px_rgba(255,87,34,0.45)]"
                      : "border-slate-200 bg-white/80 hover:border-slate-300 hover:shadow-md"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-lg" aria-hidden>
                      {item.emoji}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-[0.14em] ${
                        isActive ? "text-[#FF5722]" : "text-slate-400"
                      }`}
                    >
                      {item.label}
                    </span>
                  </span>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.body}</p>
                  {isActive ? (
                    <span className="mt-auto flex items-center gap-1 pt-4 text-xs font-bold text-[#FF5722]">
                      Bekijk oplevering
                      <ChevronRight className="size-3.5" aria-hidden />
                    </span>
                  ) : null}
                </motion.button>
              );
            })}
          </div>

          <WerkwijzeSprintTimeline
            activeIndex={active}
            labels={WERKWIJZE_SPRINTS.cards.map((c) => c.label)}
            emojis={WERKWIJZE_SPRINTS.cards.map((c) => c.emoji)}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={card.id}
              initial={reduce ? false : { opacity: 0, scale: 0.96, x: 12 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={reduce ? undefined : { opacity: 0, scale: 0.98, x: -8 }}
              transition={{ duration: 0.28 }}
              className="flex flex-col justify-center rounded-2xl border border-slate-200 bg-slate-950 p-6 text-white shadow-xl sm:p-8"
            >
              <span className="text-3xl" aria-hidden>
                {card.emoji}
              </span>
              <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Oplevering
              </p>
              <p className="mt-2 text-2xl font-extrabold tracking-tight">{card.deliverable}</p>
              <p className="mt-4 text-sm leading-relaxed text-slate-400">{card.body}</p>
              <p className="mt-4 rounded-xl border border-[#FF5722]/25 bg-[#FF5722]/10 px-3 py-2 text-xs font-bold leading-snug text-orange-200">
                {card.quip}
              </p>
              <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-white/10">
                <motion.span
                  className="block h-full rounded-full bg-gradient-to-r from-[#FF5722] to-amber-400"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: reduce ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
