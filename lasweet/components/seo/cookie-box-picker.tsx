"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { BOX_SIZES, COOKIE_FLAVOURS } from "@/lib/menu-data";

export function CookieBoxPicker() {
  const [selected, setSelected] = useState<Record<string, number>>({
    "kinder-bueno": 2,
    "red-velvet": 1,
    "choco-crumble": 1,
  });
  const [boxSize, setBoxSize] = useState<(typeof BOX_SIZES)[number]>(4);
  const reduceMotion = useReducedMotion();

  const total = useMemo(
    () => Object.values(selected).reduce((sum, n) => sum + n, 0),
    [selected],
  );

  const remaining = boxSize - total;

  const bump = (id: string, delta: number) => {
    setSelected((prev) => {
      const current = prev[id] ?? 0;
      const next = Math.max(0, current + delta);
      if (delta > 0 && total >= boxSize) return prev;
      return { ...prev, [id]: next };
    });
  };

  const picks = COOKIE_FLAVOURS.filter((f) => (selected[f.id] ?? 0) > 0);

  return (
    <>
      <div className="rounded-[2rem] border border-ink/10 bg-cream p-5 shadow-[0_32px_80px_-40px_rgba(68,57,43,0.4)] md:p-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft">
              Cookie box teaser
            </p>
            <h3 className="mt-1 font-display text-2xl font-semibold tracking-[-0.04em] text-ink md:text-3xl">
              Vul jouw box
            </h3>
          </div>
          <div className="flex gap-2">
            {BOX_SIZES.map((size) => {
              const isActive = size === boxSize;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => {
                    setBoxSize(size);
                    setSelected((prev) => {
                      let sum = 0;
                      const next: Record<string, number> = {};
                      for (const [id, count] of Object.entries(prev)) {
                        if (sum >= size) break;
                        const take = Math.min(count, size - sum);
                        if (take > 0) {
                          next[id] = take;
                          sum += take;
                        }
                      }
                      return next;
                    });
                  }}
                  aria-pressed={isActive}
                  className={`rounded-full border px-4 py-2 text-sm font-bold transition-all duration-300 active:scale-[0.97] ${
                    isActive
                      ? "border-matcha bg-matcha text-cream"
                      : "border-ink/15 text-ink-soft hover:border-matcha hover:text-matcha-deep"
                  }`}
                >
                  {size} stuks
                </button>
              );
            })}
          </div>
        </div>

        <ul className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
          {COOKIE_FLAVOURS.map((flavour) => {
            const count = selected[flavour.id] ?? 0;
            return (
              <li
                key={flavour.id}
                className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <button
                  type="button"
                  onClick={() => {
                    if (count === 0 && remaining > 0) bump(flavour.id, 1);
                  }}
                  className="min-w-0 flex-1 text-left"
                >
                  <span className="flex flex-wrap items-center gap-2">
                    <span
                      className={`font-display text-xl font-bold tracking-tight transition-colors duration-300 md:text-2xl ${
                        count > 0 ? "font-semibold text-matcha-deep" : "text-ink"
                      }`}
                    >
                      {flavour.name}
                    </span>
                    <span className="rounded-full border border-ink/15 px-3 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-ink-soft">
                      {flavour.tag}
                    </span>
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-ink-soft">
                    {flavour.blurb}
                  </span>
                </button>

                <div className="flex shrink-0 items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    aria-label={`Minder ${flavour.name}`}
                    onClick={() => bump(flavour.id, -1)}
                    disabled={count === 0}
                    className="flex size-10 items-center justify-center rounded-full border border-ink/15 font-display text-xl text-ink transition-all duration-300 hover:border-matcha disabled:opacity-30 active:scale-[0.96]"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-display text-xl font-bold text-ink">
                    {count}
                  </span>
                  <button
                    type="button"
                    aria-label={`Meer ${flavour.name}`}
                    onClick={() => bump(flavour.id, 1)}
                    disabled={remaining <= 0}
                    className="flex size-10 items-center justify-center rounded-full border border-ink/15 font-display text-xl text-ink transition-all duration-300 hover:border-matcha disabled:opacity-30 active:scale-[0.96]"
                  >
                    +
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 min-h-[72px] rounded-2xl bg-parchment/80 p-4" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={`${boxSize}-${total}-${picks.map((p) => p.id).join("-")}`}
              initial={reduceMotion ? false : { y: 8, opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              exit={reduceMotion ? undefined : { y: -6, opacity: 0.3 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-sm leading-relaxed text-ink-soft"
            >
              {total === 0 ? (
                <>Tik + om smaken in je box van {boxSize} te zetten.</>
              ) : remaining > 0 ? (
                <>
                  Je hebt{" "}
                  <span className="font-semibold text-ink">
                    {total} van {boxSize}
                  </span>
                  . Nog {remaining} te gaan
                  {picks.length > 0
                    ? `: ${picks.map((p) => `${selected[p.id]}× ${p.name}`).join(", ")}`
                    : "."}
                </>
              ) : (
                <>
                  Box vol:{" "}
                  <span className="font-semibold text-ink">
                    {picks.map((p) => `${selected[p.id]}× ${p.name}`).join(", ")}
                  </span>
                  . Klaar om te DM&apos;en.
                </>
              )}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="mt-6 hidden sm:block">
          <Link
            href="/bestellen"
            className="inline-flex w-full items-center justify-center rounded-full bg-matcha px-7 py-4 text-[13px] font-bold uppercase tracking-[0.12em] text-cream transition-all duration-300 hover:bg-matcha-deep active:scale-[0.98] md:w-auto"
          >
            Bestel deze box
          </Link>
        </div>
      </div>

      {/* Sticky mobile order bar */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 p-3 sm:hidden">
        <div className="pointer-events-auto mx-auto flex max-w-lg items-center justify-between gap-3 rounded-full border border-ink/10 bg-cream/95 px-3 py-2 shadow-[0_16px_40px_-16px_rgba(68,57,43,0.55)] backdrop-blur-md">
          <div className="min-w-0 pl-2">
            <p className="truncate text-[11px] font-bold uppercase tracking-[0.12em] text-ink-soft">
              Jouw box
            </p>
            <p className="truncate font-display text-sm font-bold text-ink">
              {total}/{boxSize} cookies
            </p>
          </div>
          <Link
            href="/bestellen"
            className="shrink-0 rounded-full bg-matcha px-5 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-cream transition-transform active:scale-[0.97]"
          >
            Bestellen
          </Link>
        </div>
      </div>
    </>
  );
}
