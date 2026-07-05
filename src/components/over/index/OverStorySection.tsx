"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Ban,
  Layers3,
  MessageCircleHeart,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { OVER_STORY } from "@/data/over-index";
import { OverStoryVisual } from "@/components/over/index/OverStoryVisuals";

const TAG_COLORS = ["#FF5722", "#0284c7", "#00BCD4", "#22C55E"] as const;

const CHAPTER_ICONS: LucideIcon[] = [Sparkles, Ban, Layers3, MessageCircleHeart];

export function OverStorySection() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const chapter = OVER_STORY[active]!;

  return (
    <section
      id="verhaal"
      className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-white to-slate-50/80"
      aria-labelledby="over-story-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.025)_1px,transparent_1px)] bg-[size:40px_40px]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
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

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-stretch">
          <div className="relative flex flex-col gap-3">
            <div
              className="pointer-events-none absolute bottom-6 left-[27px] top-6 hidden w-px bg-gradient-to-b from-[#FF5722]/30 via-slate-200 to-emerald-300/40 sm:block"
              aria-hidden
            />

            {OVER_STORY.map((item, index) => {
              const isActive = active === index;
              const isHovered = hovered === index;
              const Icon = CHAPTER_ICONS[index]!;

              return (
                <motion.button
                  key={item.id}
                  type="button"
                  onClick={() => setActive(index)}
                  onMouseEnter={() => setHovered(index)}
                  onMouseLeave={() => setHovered(null)}
                  aria-pressed={isActive}
                  whileHover={reduce ? undefined : { y: -2 }}
                  whileTap={reduce ? undefined : { scale: 0.995 }}
                  className={`relative flex items-start gap-4 overflow-hidden rounded-2xl border px-4 py-4 text-left transition-[border-color,box-shadow,background-color] duration-300 sm:px-5 sm:py-5 ${
                    isActive
                      ? "border-[#FF5722]/35 bg-white shadow-[0_20px_50px_-30px_rgba(255,87,34,0.45)]"
                      : "border-slate-200/90 bg-white/80 hover:border-slate-300 hover:bg-white hover:shadow-md"
                  }`}
                >
                  {isActive ? (
                    <motion.span
                      layoutId="over-story-active"
                      className="absolute inset-y-3 left-0 w-1 rounded-full bg-[#FF5722]"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  ) : null}

                  <span
                    className={`relative z-10 flex size-11 shrink-0 items-center justify-center rounded-xl border transition-colors duration-300 ${
                      isActive
                        ? "border-[#FF5722]/25 bg-[#FF5722]/10 text-[#FF5722]"
                        : "border-slate-200 bg-slate-50 text-slate-500"
                    }`}
                  >
                    <Icon className="size-5" strokeWidth={1.8} aria-hidden />
                    <span
                      className="absolute -right-0.5 -top-0.5 size-2 rounded-full ring-2 ring-white"
                      style={{ backgroundColor: TAG_COLORS[index] }}
                      aria-hidden
                    />
                  </span>

                  <span className="relative z-10 min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-[0.16em] ${
                          isActive ? "text-[#FF5722]" : "text-slate-400"
                        }`}
                      >
                        {item.tag}
                      </span>
                      {isActive ? (
                        <span className="rounded-full border border-[#FF5722]/20 bg-[#FF5722]/5 px-2 py-0.5 text-[9px] font-bold text-[#FF5722]">
                          {item.metric.value}
                        </span>
                      ) : null}
                    </span>

                    <span className="mt-1 block text-base font-extrabold tracking-tight text-slate-900">
                      {item.title}
                    </span>

                    <AnimatePresence initial={false}>
                      {isActive ? (
                        <motion.span
                          key="body"
                          initial={reduce ? false : { opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.28 }}
                          className="block overflow-hidden"
                        >
                          <span className="mt-3 block text-sm leading-relaxed text-slate-600">
                            {item.body}
                          </span>
                          <span className="mt-3 flex flex-wrap gap-1.5">
                            {item.highlights.map((chip) => (
                              <span
                                key={chip}
                                className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-bold text-slate-600"
                              >
                                {chip}
                              </span>
                            ))}
                          </span>
                        </motion.span>
                      ) : (
                        <motion.span
                          key="hint"
                          initial={false}
                          animate={{ opacity: isHovered ? 1 : 0.55 }}
                          className="mt-2 block text-xs text-slate-400"
                        >
                          {item.footnote}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                </motion.button>
              );
            })}
          </div>

          <div className="flex h-full min-h-[480px] flex-col overflow-x-visible overflow-y-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_32px_70px_-40px_rgba(15,23,42,0.28)]">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-red-300" aria-hidden />
                <span className="size-2 rounded-full bg-amber-300" aria-hidden />
                <span className="size-2 rounded-full bg-emerald-300" aria-hidden />
                <span className="ml-2 font-mono text-[10px] text-slate-400">
                  over.meneer / {chapter.id}
                </span>
              </div>
              <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-500">
                {chapter.metric.label}: {chapter.metric.value}
              </span>
            </div>

            <div className="relative flex-1 overflow-x-visible overflow-y-hidden bg-gradient-to-br from-slate-50 via-white to-orange-50/30">
              <div
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.02)_1px,transparent_1px)] bg-[size:24px_24px]"
                aria-hidden
              />

              <AnimatePresence mode="wait">
                <motion.div
                  key={chapter.id}
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28 }}
                  className="relative h-full min-h-[300px]"
                >
                  <OverStoryVisual chapter={chapter} active />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="border-t border-slate-100 bg-white px-5 py-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    {chapter.tag} · {chapter.footnote}
                  </p>
                  <p className="mt-1 text-base font-extrabold tracking-tight text-slate-900">
                    {chapter.title}
                  </p>
                </div>
                <span className="rounded-full border border-[#FF5722]/20 bg-[#FF5722]/5 px-3 py-1 text-[10px] font-bold text-[#FF5722]">
                  {chapter.tag}
                </span>
              </div>
              <p className="mt-3 rounded-2xl border border-[#FF5722]/15 bg-gradient-to-r from-[#FF5722]/5 to-orange-50/50 px-4 py-3 text-sm font-bold leading-snug text-slate-800">
                {chapter.punchline}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
