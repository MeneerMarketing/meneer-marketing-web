"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ChevronRight, X } from "lucide-react";
import { useState } from "react";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import { MarketingFunFactCard } from "@/components/shared/MarketingFunFactCard";
import { HOME_MOBILE_MYTHS, HOME_MOBILE_MYTH_SECTION } from "@/data/home-mobile-editorial";
import {
  ALL_MARKETING_FUN_FACTS,
  getFunFactById,
} from "@/data/marketing-fun-facts";

const EASE = [0.22, 1, 0.36, 1] as const;
const FEATURED_FACT_ID = "google-revenue-min";

const MYTH_TAB_LABELS: Record<string, string> = {
  viral: "Viral = klaar",
  "more-budget": "Meer budget",
  template: "Templates",
  "ai-replaces-seo": "SEO dood?",
  "daily-posts": "Post dagelijks",
};

/** Desktop: Even rechtzetten + featured feitje + link naar weetjes. */
export function HomeEvenRechtzettenSection() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const myth = HOME_MOBILE_MYTHS[active] ?? HOME_MOBILE_MYTHS[0]!;
  const featuredFact = getFunFactById(FEATURED_FACT_ID);
  const eyebrow = myth.eyebrow ?? HOME_MOBILE_MYTH_SECTION.eyebrow;

  return (
    <section
      aria-labelledby="even-rechtzetten-heading"
      className="relative overflow-hidden border-b border-slate-200 bg-slate-50 py-16 sm:py-20"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,87,34,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,87,34,0.04) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.p
              key={eyebrow}
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -4 }}
              transition={{ duration: 0.22, ease: EASE }}
              className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF5722]"
            >
              {eyebrow}
            </motion.p>
          </AnimatePresence>
          <h2
            id="even-rechtzetten-heading"
            className="mt-3 text-pretty text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl"
          >
            {HOME_MOBILE_MYTH_SECTION.title}
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-slate-600">
            {HOME_MOBILE_MYTH_SECTION.subtitle}
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,340px)] lg:grid-rows-[auto_280px] lg:items-end lg:gap-x-10 lg:gap-y-4">
          <div
            className="flex flex-wrap gap-2 lg:col-start-1 lg:row-start-1 lg:self-end"
            role="tablist"
            aria-label="Marketing mythes"
          >
            {HOME_MOBILE_MYTHS.map((item, i) => {
              const isActive = active === i;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(i)}
                  className={`rounded-full border px-3.5 py-2 text-xs font-bold transition-all sm:px-4 sm:text-sm ${
                    isActive
                      ? "border-slate-900 bg-slate-900 text-white shadow-md"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
                  }`}
                >
                  {MYTH_TAB_LABELS[item.id] ?? item.myth.slice(0, 20)}
                </button>
              );
            })}
          </div>

          {featuredFact ? (
            <div className="min-w-0 lg:col-start-2 lg:row-start-1 lg:self-end">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Wist je dat?
              </p>
              <p className="mt-0.5 text-pretty text-xs font-bold leading-snug text-slate-700 sm:text-sm">
                Google verdient per minuut meer dan jij per jaar aan ads uitgeeft. Waarschijnlijk.
              </p>
            </div>
          ) : null}

          <div className="h-[280px] lg:col-start-1 lg:row-start-2">
            <AnimatePresence mode="wait">
              <motion.article
                key={myth.id}
                initial={reduce ? false : { opacity: 0, y: 14, rotate: -0.5 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -10, rotate: 0.5 }}
                transition={{ duration: 0.32, ease: EASE }}
                className="h-full overflow-hidden rounded-[1.35rem] border border-slate-200/90 bg-white shadow-[0_24px_56px_-28px_rgba(15,23,42,0.14)]"
              >
              <div className="grid h-full sm:grid-cols-2 sm:items-stretch">
                <div className="flex border-b border-slate-100 bg-gradient-to-br from-slate-100 to-slate-50 p-5 sm:border-b-0 sm:border-r">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                      <X className="size-4" strokeWidth={2.5} aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                        {HOME_MOBILE_MYTH_SECTION.mythLabel}
                      </p>
                      <p className="mt-2 text-pretty text-base font-bold leading-snug text-slate-700 line-through decoration-red-400/80 decoration-2">
                        {myth.myth}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex h-full flex-col p-5">
                  <div className="flex items-start gap-3">
                    <InteractiveLogo className="size-10 shrink-0" interactive={false} />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#FF5722]">
                        {HOME_MOBILE_MYTH_SECTION.meneerLabel}
                      </p>
                      <p className="mt-2 text-pretty text-base font-bold leading-[1.55] text-slate-900">
                        {myth.meneer}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={myth.href}
                    className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-extrabold text-[#FF5722] transition hover:gap-2"
                  >
                    {myth.linkLabel}
                    <ArrowUpRight className="size-4" aria-hidden />
                  </Link>
                </div>
              </div>
              </motion.article>
            </AnimatePresence>
          </div>

          {featuredFact ? (
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ duration: 0.45, ease: EASE }}
              className="min-w-0 lg:col-start-2 lg:row-start-2"
            >
              <MarketingFunFactCard fact={featuredFact} className="h-[280px]" />
            </motion.div>
          ) : null}
        </div>

        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-400 lg:mt-5">
          <ChevronRight className="size-3.5 rotate-180 opacity-60" aria-hidden />
          Tik een mythe. Meneer zet het recht.
          <ChevronRight className="size-3.5 opacity-60" aria-hidden />
        </p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08, duration: 0.4, ease: EASE }}
          className="mt-10 flex flex-col items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-900 p-5 sm:flex-row sm:items-center sm:p-6"
        >
          <div className="flex items-start gap-3">
            <InteractiveLogo className="size-9 shrink-0" interactive={false} />
            <div>
              <p className="text-sm font-extrabold text-white">
                Nog {ALL_MARKETING_FUN_FACTS.length - 1} feitjes die je scherper laten adverteren.
              </p>
              <p className="mt-1 text-pretty text-xs text-slate-400">
                Cijfers die je route bepalen. Praktisch, niet theoretisch.
              </p>
            </div>
          </div>
          <Link
            href="/weetjes"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#FF5722] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#FF5722]/25 transition hover:bg-orange-600"
          >
            Alle marketing weetjes
            <ArrowUpRight className="size-4" aria-hidden />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
