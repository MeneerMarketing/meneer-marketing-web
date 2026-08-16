"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check, MapPin, Search, Star } from "lucide-react";

const COMPETITOR_ROWS = [
  { title: "78%", meta: "54%" },
  { title: "62%", meta: "44%" },
] as const;

/**
 * Het moment waarop een studio een lid wint of verliest: de lokale zoekopdracht.
 * Speelt eenmalig af bij mount, staat stil bij prefers-reduced-motion.
 */
export function PilatesHeroSearchStory() {
  const reduce = useReducedMotion() ?? false;
  const step = (delay: number) =>
    reduce
      ? { initial: false as const, animate: { opacity: 1, y: 0 } }
      : {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <div className="relative mx-auto w-full max-w-[430px]">
      <div
        className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-[#FF5722]/25 blur-3xl"
        aria-hidden
      />

      <div className="relative overflow-hidden rounded-[1.5rem] bg-white shadow-[0_40px_90px_-30px_rgba(0,0,0,0.65)] ring-1 ring-white/10">
        <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3.5">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-slate-100">
            <Search className="size-3.5 text-slate-500" aria-hidden />
          </span>
          <div className="flex min-w-0 flex-1 items-center gap-1">
            <motion.span
              className="truncate text-[13px] font-semibold text-slate-800"
              initial={reduce ? false : { clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            >
              pilates in de buurt
            </motion.span>
            {reduce ? null : (
              <motion.span
                className="h-4 w-px shrink-0 bg-[#FF5722]"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.2 }}
                aria-hidden
              />
            )}
          </div>
        </div>

        <div className="space-y-2.5 bg-slate-50/80 px-4 py-4">
          <motion.article
            {...step(0.85)}
            className="relative rounded-2xl bg-white p-3.5 shadow-[0_14px_34px_-22px_rgba(15,23,42,0.5)] ring-2 ring-[#FF5722]"
          >
            <span className="absolute -top-2 left-3.5 rounded-full bg-[#FF5722] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
              Jouw studio
            </span>

            <div className="flex items-start justify-between gap-3 pt-1">
              <div className="min-w-0">
                <p className="truncate text-[15px] font-extrabold tracking-tight text-slate-900">
                  Pilates studio
                </p>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="flex gap-0.5" aria-hidden>
                    {[0, 1, 2, 3, 4].map((i) => (
                      <Star
                        key={i}
                        className="size-3 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </span>
                  <span className="text-[11px] font-bold text-slate-700">4,9</span>
                </div>
                <p className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-slate-500">
                  <MapPin className="size-3 shrink-0" aria-hidden />
                  Vlakbij, plek vrij deze week
                </p>
              </div>

              <span className="shrink-0 rounded-xl bg-[#FF5722] px-3 py-2 text-[11px] font-bold text-white">
                Proefles
              </span>
            </div>
          </motion.article>

          {COMPETITOR_ROWS.map((row, i) => (
            <motion.div
              key={row.title}
              {...step(1.15 + i * 0.15)}
              className="rounded-2xl bg-white/70 p-3.5 ring-1 ring-slate-200/80"
              aria-hidden
            >
              <div
                className="h-2.5 rounded-full bg-slate-200"
                style={{ width: row.title }}
              />
              <div
                className="mt-2 h-2 rounded-full bg-slate-100"
                style={{ width: row.meta }}
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          {...step(1.75)}
          className="flex items-center gap-2.5 border-t border-slate-100 bg-white px-4 py-3.5"
        >
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-500">
            <Check className="size-4 text-white" strokeWidth={3} aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-[12px] font-extrabold tracking-tight text-slate-900">
              Proefles geboekt
            </p>
            <p className="text-[11px] font-medium text-slate-500">
              Donderdag 19:00, zonder telefoontje
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
