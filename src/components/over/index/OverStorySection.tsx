"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { OVER_STORY } from "@/data/over-index";
import { OverStoryVisual } from "@/components/over/index/OverStoryVisuals";

const TAG_COLORS = ["#FF5722", "#0284c7", "#00BCD4", "#22C55E"] as const;

export function OverStorySection() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const chapter = OVER_STORY[active]!;

  return (
    <section
      id="verhaal"
      className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-50/80"
      aria-labelledby="over-story-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF5722]">
          Het verhaal
        </p>
        <h2
          id="over-story-heading"
          className="mt-3 max-w-2xl text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
        >
          Wie ik ben en hoe ik werk
        </h2>
        <p className="mt-3 max-w-xl text-slate-600">
          Vier hoofdstukken. Tik er eentje en zie wat er achter zit.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:items-stretch">
          <div className="flex flex-col gap-2">
            {OVER_STORY.map((item, index) => {
              const isActive = active === index;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-pressed={isActive}
                  className={`flex items-start gap-4 rounded-2xl border px-4 py-4 text-left transition-all sm:px-5 ${
                    isActive
                      ? "border-[#FF5722]/40 bg-[#FF5722]/[0.04] shadow-sm"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <span
                    className="mt-1 size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: TAG_COLORS[index] }}
                    aria-hidden
                  />
                  <span className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {item.tag}
                    </span>
                    <span className="mt-0.5 block text-sm font-extrabold text-slate-900">
                      {item.title}
                    </span>
                    {isActive ? (
                      <span className="mt-2 block text-xs leading-relaxed text-slate-600">
                        {item.body}
                      </span>
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_56px_-32px_rgba(15,23,42,0.15)]">
            <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-2.5">
              <span className="size-2 rounded-full bg-[#FF5722]/80" />
              <span className="font-mono text-[10px] text-slate-400">over.meneer</span>
            </div>

            <div className="flex-1 bg-gradient-to-b from-slate-50/80 to-white">
              <AnimatePresence mode="wait">
                <motion.div
                  key={chapter.id}
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <OverStoryVisual chapter={chapter} active />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="border-t border-slate-100 px-5 py-4">
              <p className="text-sm font-extrabold text-slate-900">{chapter.title}</p>
              <p className="mt-2 inline-flex rounded-full border border-[#FF5722]/20 bg-[#FF5722]/5 px-3 py-1 text-xs font-bold text-[#FF5722]">
                {chapter.punchline}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
