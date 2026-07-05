"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Repeat2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  FUN_FACT_STAT_CLASS,
  factAccentReadable,
  type MarketingFunFact,
} from "@/data/marketing-fun-facts";

interface MarketingFunFactCardProps {
  fact: MarketingFunFact;
  className?: string;
}

/** Compacte flip-kaart voor één marketingfeitje, te embedden op andere pagina's */
export function MarketingFunFactCard({ fact, className }: MarketingFunFactCardProps) {
  const reduce = useReducedMotion();
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={`group h-[260px] cursor-pointer [perspective:1100px] ${className ?? ""}`}
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
      aria-label={`Feitje: ${fact.stat} ${fact.teaser}`}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 26 }}
        className="relative size-full [transform-style:preserve-3d]"
      >
        <div className="absolute inset-0 flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_32px_-14px_rgba(15,23,42,0.14)] [backface-visibility:hidden]">
          <div className="flex items-start justify-between">
            <span
              className="inline-flex max-w-[90%] rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white"
              style={{ backgroundColor: fact.accent }}
            >
              {fact.badge}
            </span>
            <Repeat2 className="size-4 text-slate-300" aria-hidden />
          </div>
          <div className="min-w-0">
            <p className={FUN_FACT_STAT_CLASS} style={{ color: fact.accent }}>
              {fact.stat}
            </p>
            <p className="mt-2 text-sm font-bold leading-snug text-slate-900">{fact.teaser}</p>
          </div>
          <p className="text-[11px] font-semibold text-slate-400">Draai om voor het verhaal</p>
        </div>
        <div
          className="absolute inset-0 flex flex-col rounded-2xl border border-slate-800 bg-slate-900 p-5 [backface-visibility:hidden] [transform:rotateY(180deg)]"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: factAccentReadable(fact.accent) }}>
            {fact.title}
          </p>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-300">{fact.body}</p>
          <Link
            href={fact.href}
            onClick={(e) => e.stopPropagation()}
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-white hover:text-[#FF5722]"
          >
            {fact.linkLabel}
            <ArrowUpRight className="size-4" aria-hidden />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

interface MarketingFunFactsRowProps {
  facts: MarketingFunFact[];
  title?: string;
  /** inline = geen grijs sectievlak, volle breedte van de ouder (o.a. FAQ) */
  variant?: "section" | "inline";
}

/** Rij met 1–3 feitjes voor werkwijze, over, enz. */
export function MarketingFunFactsRow({
  facts,
  title,
  variant = "section",
}: MarketingFunFactsRowProps) {
  const gridClass =
    facts.length === 1
      ? variant === "inline"
        ? "grid-cols-1"
        : "max-w-sm mx-auto"
      : facts.length === 2
        ? "sm:grid-cols-2"
        : "sm:grid-cols-2 lg:grid-cols-3";

  const content = (
    <>
      {title ? (
        <h2
          id="fun-facts-row-heading"
          className="mb-8 text-center text-xl font-extrabold text-slate-900 sm:text-2xl"
        >
          {title}
        </h2>
      ) : null}
      <ul className={`grid gap-4 ${gridClass}`}>
        {facts.map((fact) => (
          <li key={fact.id} className={variant === "inline" ? "min-w-0" : undefined}>
            <MarketingFunFactCard fact={fact} className={variant === "inline" ? "h-[240px]" : undefined} />
          </li>
        ))}
      </ul>
    </>
  );

  if (variant === "inline") {
    return <div aria-label="Marketing feitje">{content}</div>;
  }

  return (
    <section
      className="border-b border-slate-200 bg-slate-50/80"
      aria-labelledby={title ? "fun-facts-row-heading" : undefined}
    >
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">{content}</div>
    </section>
  );
}
