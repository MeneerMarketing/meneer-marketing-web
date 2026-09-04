"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { MATCHA_FLAVOURS, MILK_OPTIONS } from "@/lib/menu-data";

export function MatchaFlavourPicker() {
  const [activeId, setActiveId] = useState("strawberry");
  const [milkId, setMilkId] = useState("haver");
  const reduceMotion = useReducedMotion();
  const active =
    MATCHA_FLAVOURS.find((f) => f.id === activeId) ?? MATCHA_FLAVOURS[0];
  const milk =
    MILK_OPTIONS.find((m) => m.id === milkId) ?? MILK_OPTIONS[0];

  return (
    <div className="rounded-[2rem] border border-ink/10 bg-cream p-5 shadow-[0_32px_80px_-40px_rgba(68,57,43,0.4)] md:p-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft">
            Smakenpicker
          </p>
          <h3 className="mt-1 font-display text-2xl font-semibold tracking-[-0.04em] text-ink md:text-3xl">
            Bouw jouw cup
          </h3>
        </div>
        <p className="rounded-full bg-beige-mist px-4 py-2 font-display text-lg font-bold text-beige-deep">
          €{active.price}
        </p>
      </div>

      <ul className="mt-6 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {MATCHA_FLAVOURS.map((flavour) => {
          const isActive = flavour.id === activeId;
          return (
            <li key={flavour.id} className="shrink-0">
              <button
                type="button"
                onClick={() => setActiveId(flavour.id)}
                aria-pressed={isActive}
                className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition-all duration-300 will-change-transform active:scale-[0.97] ${
                  isActive
                    ? "border-matcha bg-matcha text-cream shadow-[0_10px_24px_-12px_rgba(111,3,19,0.8)]"
                    : "border-ink/15 bg-parchment/60 text-ink hover:border-matcha hover:text-matcha-deep"
                }`}
              >
                {flavour.shortName}
                {flavour.highlight ? (
                  <span className="ml-1.5 text-[10px] uppercase tracking-wider opacity-80">
                    viral
                  </span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 min-h-[140px] rounded-2xl bg-beige-mist/80 p-5 md:min-h-[120px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active.id}
            initial={reduceMotion ? false : { y: 12, opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduceMotion ? undefined : { y: -8, opacity: 0.4 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-matcha-deep">
              {active.vibe}
            </p>
            <p className="mt-2 font-display text-2xl font-bold tracking-tight text-ink">
              {active.name}
            </p>
            <p className="mt-2 text-base leading-relaxed text-ink-soft">
              {active.blurb}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft">
          Melk erbij
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {MILK_OPTIONS.map((option) => {
            const isActive = option.id === milkId;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setMilkId(option.id)}
                aria-pressed={isActive}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-300 will-change-transform active:scale-[0.97] ${
                  isActive
                    ? "border-ink bg-ink text-cream"
                    : "border-ink/15 text-ink-soft hover:border-ink/40 hover:text-ink"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-7 flex flex-col gap-3 border-t border-ink/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-ink-soft">
          Jouw combo:{" "}
          <span className="font-semibold text-ink">
            {active.shortName} · {milk.label}
          </span>
        </p>
        <Link
          href="/bestellen"
          className="inline-flex items-center justify-center rounded-full bg-matcha px-6 py-3.5 text-[12px] font-bold uppercase tracking-[0.12em] text-cream transition-all duration-300 hover:bg-matcha-deep active:scale-[0.98]"
        >
          Dit wil ik bestellen
        </Link>
      </div>
    </div>
  );
}
