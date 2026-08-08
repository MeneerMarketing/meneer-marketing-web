"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ChevronRight, Repeat2 } from "lucide-react";
import { useState } from "react";
import {
  ALL_MARKETING_FUN_FACTS,
  FUN_FACT_STAT_CLASS,
  MARKETING_FUN_FACTS,
  factAccentReadable,
  type MarketingFunFact,
} from "@/data/marketing-fun-facts";

function FactCard({ fact, index }: { fact: MarketingFunFact; index: number }) {
  const reduce = useReducedMotion();
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      initial={reduce ? undefined : { opacity: 0, y: 28, rotate: index % 2 === 0 ? -2 : 2 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        type: "spring",
        stiffness: 190,
        damping: 20,
        delay: index * 0.07,
      }}
      className="min-w-[80%] snap-center sm:min-w-0"
    >
      <div
        className="group h-[280px] cursor-pointer [perspective:1100px]"
        onClick={() => setFlipped((f) => !f)}
        onMouseEnter={() => setFlipped(true)}
        onMouseLeave={() => setFlipped(false)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setFlipped((f) => !f);
          }
        }}
        aria-label={`Feitje: ${fact.stat} ${fact.teaser}. Activeer om de uitleg te lezen.`}
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={
            reduce
              ? { duration: 0 }
              : { type: "spring", stiffness: 260, damping: 26 }
          }
          className="relative size-full [transform-style:preserve-3d]"
          style={{ willChange: "transform" }}
        >
          {/* Voorkant */}
          <div className="absolute inset-0 flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_36px_-14px_rgba(15,23,42,0.16)] [backface-visibility:hidden]">
            <div className="flex min-h-[2.75rem] shrink-0 items-start justify-between">
              <span
                className="inline-flex max-w-[85%] rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white"
                style={{ backgroundColor: fact.accent }}
              >
                {fact.badge}
              </span>
              <Repeat2
                className="size-4 shrink-0 text-slate-300 transition group-hover:rotate-180 group-hover:text-slate-500"
                aria-hidden
              />
            </div>
            <p
              className={`${FUN_FACT_STAT_CLASS} shrink-0`}
              style={{ color: fact.accent }}
            >
              {fact.stat}
            </p>
            <p className="mt-3 min-h-[2.75rem] shrink-0 text-base font-bold leading-snug text-slate-900">
              {fact.teaser}
            </p>
            <p className="mt-auto shrink-0 pt-4 text-xs font-semibold text-slate-400">
              Draai me om voor het hele verhaal
            </p>
          </div>

          {/* Achterkant */}
          <div
            className="absolute inset-0 flex flex-col rounded-3xl border p-6 text-white shadow-[0_16px_44px_-16px_rgba(15,23,42,0.4)] [backface-visibility:hidden] [transform:rotateY(180deg)]"
            style={{ backgroundColor: "#0F172A", borderColor: "#1e293b" }}
          >
            <p
              className="text-xs font-bold uppercase tracking-[0.16em]"
              style={{ color: factAccentReadable(fact.accent) }}
            >
              {fact.title}
            </p>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-300">
              {fact.body}
            </p>
            <Link
              href={fact.href}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-white underline-offset-4 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {fact.linkLabel}
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/**
 * Sectie met flip-kaarten vol niet-standaard marketingfeitjes. Op desktop
 * draaien de kaarten bij hover, op mobiel swipe je erdoorheen en tik je
 * om te draaien.
 */
export function FunFactsSection() {
  return (
    <section
      aria-labelledby="funfacts-heading"
      className="relative overflow-hidden border-b border-mm-border bg-white py-16 sm:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(rgba(15,23,42,0.05) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF5722]">
            Wist je dat?
          </p>
          <h2
            id="funfacts-heading"
            className="mt-3 text-balance text-4xl font-extrabold tracking-tighter text-slate-900 sm:text-5xl"
          >
            Feitjes voor op verjaardagen.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Allemaal echt, allemaal onderbouwd. En stiekem verklaren ze precies
            waarom ik marketing aanpak zoals ik het aanpak.
          </p>
        </div>

        <div className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-4 lg:gap-5">
          {MARKETING_FUN_FACTS.map((fact, i) => (
            <FactCard key={fact.id} fact={fact} index={i} />
          ))}
        </div>

        <p className="mt-8 text-center">
          <Link
            href="/weetjes"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#FF5722] transition hover:text-slate-900"
          >
            Bekijk alle {ALL_MARKETING_FUN_FACTS.length} marketing weetjes
            <ArrowUpRight className="size-4" aria-hidden />
          </Link>
        </p>

        <p className="mt-4 flex items-center justify-center gap-1 text-xs font-semibold text-slate-400 sm:hidden">
          Swipe voor meer feitjes
          <ChevronRight className="size-3.5" aria-hidden />
        </p>
      </div>
    </section>
  );
}
