"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { Check, TrendingUp } from "lucide-react";
import { useRef, useState } from "react";
import {
  HOME_MOBILE_GOOGLE_ERAS,
  HOME_MOBILE_GOOGLE_EXPERT,
} from "@/data/home-mobile-google-expert";
import { GoogleLogoMark } from "@/components/icons/GoogleLogoMark";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Google-expert demo: tik door 12+ jaar SEO-ervaring, SERP klimt mee.
 */
export function HomeMobileVindbaarheidVisual() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  useInView(ref, { once: true, margin: "-12%" });
  const [eraIdx, setEraIdx] = useState(HOME_MOBILE_GOOGLE_ERAS.length - 1);

  const era = HOME_MOBILE_GOOGLE_ERAS[eraIdx]!;
  const isWinner = era.rank === 1;

  return (
    <div ref={ref} className="w-full min-w-0">
      {/* Stats + Meneer */}
      <div className="mb-3 flex items-start gap-2.5 rounded-2xl border border-slate-200/90 bg-gradient-to-br from-slate-50 to-white p-3 shadow-sm">
        <InteractiveLogo className="size-8 shrink-0" interactive={false} />
        <div className="min-w-0 flex-1">
          <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#FF5722]">
            {HOME_MOBILE_GOOGLE_EXPERT.statLabel}
          </p>
          <p className="mt-0.5 text-lg font-extrabold leading-none tracking-tight text-slate-900">
            {HOME_MOBILE_GOOGLE_EXPERT.statValue}
          </p>
          <p className="mt-1 text-[10px] font-medium leading-snug text-slate-500">
            {HOME_MOBILE_GOOGLE_EXPERT.statSub}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end">
          <TrendingUp className="size-4 text-emerald-500" aria-hidden />
          <span className="mt-0.5 text-[8px] font-bold text-emerald-600">#1 haalbaar</span>
        </div>
      </div>

      {/* Era-kiezer */}
      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
        Tik door mijn Google-tijdlijn
      </p>
      <div className="mb-3 grid grid-cols-4 gap-1 rounded-2xl border border-slate-200/90 bg-slate-100/80 p-1">
        {HOME_MOBILE_GOOGLE_ERAS.map((item, i) => {
          const active = eraIdx === i;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setEraIdx(i)}
              className={`rounded-xl px-1 py-2 text-center transition-all duration-300 ${
                active
                  ? "bg-white text-slate-900 shadow-sm ring-1 ring-[#FF5722]/25"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <span className="block text-[8px] font-bold uppercase tracking-wide text-[#FF5722]">
                {item.year}
              </span>
              <span className="mt-0.5 block text-[9px] font-extrabold leading-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={era.id}
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.28, ease: EASE }}
          className="mb-3 rounded-2xl border border-[#FF5722]/20 bg-orange-50/60 px-3.5 py-3"
        >
          <p className="text-[11px] font-extrabold leading-snug text-slate-900">{era.headline}</p>
          <p className="mt-1.5 text-pretty text-[11px] font-semibold leading-relaxed text-slate-700">
            {era.meneer}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Google SERP mock */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_16px_40px_-22px_rgba(15,23,42,0.14)]">
        <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2.5">
          <GoogleLogoMark className="size-4 shrink-0" />
          <div className="flex min-w-0 flex-1 items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1">
            <span className="truncate text-[10px] font-medium text-slate-600">
              {HOME_MOBILE_GOOGLE_EXPERT.searchQuery}
            </span>
          </div>
        </div>

        <div className="space-y-2 px-3 py-2.5">
          <AnimatePresence mode="wait">
            <motion.div
              key={`rank-${era.rank}`}
              initial={reduce ? false : { opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: EASE }}
              className={`flex gap-2 rounded-xl border-2 p-2.5 ${
                isWinner
                  ? "border-[#FF5722]/35 bg-orange-50/80"
                  : "border-slate-200 bg-slate-50/80"
              }`}
            >
              <motion.span
                key={era.rank}
                initial={reduce ? false : { scale: 0.8 }}
                animate={{ scale: 1 }}
                className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[9px] font-black text-white ${
                  isWinner ? "bg-[#FF5722]" : "bg-slate-400"
                }`}
              >
                {era.rank}
              </motion.span>
              <div className="min-w-0 flex-1">
                <p
                  className={`text-[9px] font-bold uppercase tracking-wider ${
                    isWinner ? "text-[#FF5722]" : "text-slate-400"
                  }`}
                >
                  Jouw merk
                </p>
                <p
                  className={`mt-0.5 text-[10px] font-extrabold leading-snug ${
                    isWinner ? "text-[#1a0dab]" : "text-slate-600"
                  }`}
                >
                  {era.searchSnippet}
                </p>
                {isWinner ? (
                  <div className="mt-1 flex items-center gap-1">
                    <InteractiveLogo className="size-3.5 shrink-0" interactive={false} />
                    <span className="text-[8px] font-bold text-slate-500">
                      Meneer Marketing · SEO from scratch
                    </span>
                  </div>
                ) : null}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="rounded-lg px-1 py-0.5 opacity-45">
            <p className="text-[9px] font-bold text-slate-400">Concurrent.nl · #{era.rank + 2}</p>
            <p className="truncate text-[9px] text-slate-400">
              {HOME_MOBILE_GOOGLE_EXPERT.competitorSnippet}
            </p>
          </div>
        </div>

        <div
          className={`border-t px-3 py-2 ${
            isWinner ? "border-emerald-100 bg-emerald-50/80" : "border-slate-100 bg-slate-50/80"
          }`}
        >
          <p
            className={`flex items-center gap-1.5 text-[9px] font-bold ${
              isWinner ? "text-emerald-600" : "text-slate-500"
            }`}
          >
            {isWinner ? (
              <Check className="size-3 shrink-0" strokeWidth={3} aria-hidden />
            ) : (
              <span className="size-1.5 shrink-0 rounded-full bg-slate-300" aria-hidden />
            )}
            {isWinner
              ? "Positie 1 · organisch · gratis kliks"
              : `Positie ${era.rank} · tik 'Nu' voor de winst`}
          </p>
        </div>
      </div>
    </div>
  );
}
