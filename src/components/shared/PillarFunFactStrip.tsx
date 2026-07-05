"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { MarketingFunFact } from "@/data/marketing-fun-facts";

interface PillarFunFactStripProps {
  fact: MarketingFunFact;
}

/** Inline feitje op pillar-landingspagina's (geen sidebar). */
export function PillarFunFactStrip({ fact }: PillarFunFactStripProps) {
  return (
    <section
      aria-label="Marketing weetje"
      className="border-y border-slate-200 bg-slate-50/90"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#FF5722]">
            Wist je dat?
          </p>
          <p className="mt-2 text-balance text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
            <span style={{ color: fact.accent }}>{fact.stat}</span>{" "}
            {fact.teaser}
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
            {fact.body}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <Link
            href={fact.href}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-800 shadow-sm transition hover:border-[#FF5722]/40 hover:text-[#FF5722]"
          >
            {fact.linkLabel}
            <ArrowUpRight className="size-4" aria-hidden />
          </Link>
          <Link
            href={`/weetjes#${fact.id}`}
            className="inline-flex items-center rounded-full px-4 py-2.5 text-sm font-bold text-slate-500 transition hover:text-[#FF5722]"
          >
            Alle weetjes
          </Link>
        </div>
      </div>
    </section>
  );
}
