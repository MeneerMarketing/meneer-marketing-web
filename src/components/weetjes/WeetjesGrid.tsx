"use client";

import Link from "next/link";
import { MarketingFunFactCard } from "@/components/shared/MarketingFunFactCard";
import type { MarketingFunFact } from "@/data/marketing-fun-facts";
import { FUN_FACT_CATEGORIES } from "@/data/marketing-fun-facts";

interface WeetjesGridProps {
  facts: MarketingFunFact[];
}

export function WeetjesGrid({ facts }: WeetjesGridProps) {
  const grouped = FUN_FACT_CATEGORIES.map((category) => ({
    category,
    items: facts.filter((f) => f.category === category),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="space-y-16">
      {grouped.map((group) => (
        <section key={group.category} aria-labelledby={`cat-${group.category}`}>
          <h2
            id={`cat-${group.category}`}
            className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF5722]"
          >
            {group.category}
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {group.items.map((fact) => (
              <li key={fact.id} id={fact.id}>
                <MarketingFunFactCard fact={fact} className="h-[260px]" />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

interface WeetjesCtaProps {
  href: string;
  label: string;
}

export function WeetjesInlineLink({ href, label }: WeetjesCtaProps) {
  return (
    <p className="mt-8 text-center text-sm text-slate-600">
      Nog meer?{" "}
      <Link href={href} className="font-bold text-[#FF5722] hover:text-slate-900">
        {label}
      </Link>
    </p>
  );
}
