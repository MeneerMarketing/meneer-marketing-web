"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useMemo, useState } from "react";
import { CaseSwitcherThumb } from "@/components/cases/CaseSwitcherThumb";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import { CASES_PAGE_BUILT } from "@/data/cases-page";
import { HOME_CASES } from "@/data/home-cases";
import type { HomeCase } from "@/data/home-cases";

const EASE = [0.22, 1, 0.36, 1] as const;

type FilterId = "all" | string;

/** Interactief overzicht van deliverables per case. */
export function CasesBuiltBoard() {
  const reduce = useReducedMotion();
  const [filter, setFilter] = useState<FilterId>("all");

  const filteredCases = useMemo(() => {
    if (filter === "all") return HOME_CASES;
    return HOME_CASES.filter((c) => c.id === filter);
  }, [filter]);

  const allServices = useMemo(() => {
    const items: { service: HomeCase["services"][number]; caseItem: HomeCase }[] = [];
    for (const caseItem of filteredCases) {
      for (const service of caseItem.services) {
        items.push({ service, caseItem });
      }
    }
    return items;
  }, [filteredCases]);

  const activeCase = filter === "all" ? null : HOME_CASES.find((c) => c.id === filter);

  return (
    <section
      className="border-b border-slate-200 bg-white"
      aria-labelledby="cases-built-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
        <div className="max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#FF5722]">
            {CASES_PAGE_BUILT.eyebrow}
          </p>
          <h2
            id="cases-built-heading"
            className="mt-3 text-pretty text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
          >
            {CASES_PAGE_BUILT.title}
          </h2>
          <p className="mt-3 text-pretty text-sm leading-relaxed text-slate-600 sm:text-base">
            {CASES_PAGE_BUILT.lead}
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          <FilterChip
            label={CASES_PAGE_BUILT.allLabel}
            active={filter === "all"}
            onClick={() => setFilter("all")}
          />
          {HOME_CASES.map((c) => (
            <FilterChip
              key={c.id}
              label={c.client}
              active={filter === c.id}
              onClick={() => setFilter(c.id)}
              accent={c.palette.accent}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="mt-8"
          >
            {activeCase ? (
              <div className="mb-6 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                <CaseSwitcherThumb caseItem={activeCase} />
                <div className="min-w-0">
                  <p className="text-sm font-extrabold text-slate-900">{activeCase.client}</p>
                  <p className="mt-0.5 text-pretty text-xs text-slate-500">{activeCase.body}</p>
                </div>
                {activeCase.website ? (
                  <a
                    href={activeCase.website.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto hidden shrink-0 items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:border-[#FF5722]/40 hover:text-[#FF5722] sm:inline-flex"
                  >
                    Live
                    <ArrowUpRight className="size-3.5" aria-hidden />
                  </a>
                ) : null}
              </div>
            ) : null}

            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {allServices.map(({ service, caseItem }, i) => (
                <motion.li
                  key={`${caseItem.id}-${service.id}`}
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.35, ease: EASE }}
                  className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-extrabold text-slate-900">{service.label}</p>
                    {filter === "all" ? (
                      <span
                        className="shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white"
                        style={{ backgroundColor: caseItem.palette.accent }}
                      >
                        {caseItem.client.split(" ")[0]}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-pretty text-xs leading-relaxed text-slate-600">
                    {service.blurb}
                  </p>
                  <span
                    className="mt-3 inline-block h-0.5 w-8 rounded-full transition-all group-hover:w-12"
                    style={{ backgroundColor: caseItem.palette.accent }}
                    aria-hidden
                  />
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>

        <div className="relative mt-8 flex items-start gap-3 rounded-2xl rounded-bl-sm border border-[#FF5722]/20 bg-orange-50/70 px-4 py-3.5 pl-12">
          <InteractiveLogo className="absolute left-3 top-3 size-7 shrink-0" interactive={false} />
          <p className="relative text-pretty text-sm font-bold leading-snug text-slate-800">
            Fun fact: ik kan je precies vertellen welk stukje code achter elk blok zit. Geen
            &quot;onze partner heeft dat gebouwd&quot;-verhaal.
          </p>
        </div>
      </div>
    </section>
  );
}

function FilterChip({
  label,
  active,
  onClick,
  accent,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  accent?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
        active
          ? "border-slate-900 bg-slate-900 text-white shadow-md"
          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
      }`}
      style={active && accent ? { backgroundColor: accent, borderColor: accent } : undefined}
    >
      {label}
    </button>
  );
}
