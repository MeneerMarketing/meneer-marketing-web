"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MarketingFunFactCard } from "@/components/shared/MarketingFunFactCard";
import {
  ALL_MARKETING_FUN_FACTS,
  MARKETING_FUN_FACTS,
} from "@/data/marketing-fun-facts";

/** Max 2 feitjes op mobiel homepage. Rest op /weetjes. */
export function HomeMobileFunFacts() {
  const picks = MARKETING_FUN_FACTS.slice(0, 2);

  return (
    <section
      aria-labelledby="mobile-funfacts-heading"
      className="border-b border-slate-200 bg-white py-12"
    >
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#FF5722]">
          Wist je dat?
        </p>
        <h2
          id="mobile-funfacts-heading"
          className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900"
        >
          Eén feitje. Direct scherp.
        </h2>

        <ul className="mt-6 grid gap-4">
          {picks.map((fact) => (
            <li key={fact.id}>
              <MarketingFunFactCard fact={fact} className="h-[240px]" />
            </li>
          ))}
        </ul>

        <Link
          href="/weetjes"
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-[#FF5722]"
        >
          Bekijk alle {ALL_MARKETING_FUN_FACTS.length} marketing weetjes
          <ArrowUpRight className="size-4" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
