"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { CaseBrowserFrame } from "@/components/home/cases/CaseBrowserFrame";
import { Reveal } from "@/components/effects/Reveal";
import { DIENSTEN_CASE_PROOF } from "@/data/diensten-index";
import { HOME_CASES } from "@/data/home-cases";

const CASE_IDS = ["skincomplete", "bestrest", "hills-pilates"] as const;

export function DienstenCaseProof() {
  const reduce = useReducedMotion();
  const cases = CASE_IDS.map(
    (id) => HOME_CASES.find((c) => c.id === id)!,
  ).filter(Boolean);

  return (
    <section
      className="relative overflow-hidden border-b border-slate-200 bg-slate-50"
      aria-labelledby="diensten-cases-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,87,34,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,87,34,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF5722]">
            {DIENSTEN_CASE_PROOF.eyebrow}
          </p>
          <h2
            id="diensten-cases-heading"
            className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
          >
            {DIENSTEN_CASE_PROOF.title}
          </h2>
          <p className="mt-2 max-w-lg text-slate-600">
            Geen stockfoto&apos;s. Wel portaal, shop en campagnes die ik echt heb gebouwd en run.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-10 lg:grid-cols-3 lg:gap-6">
          {cases.map((caseItem, index) => {
            const meta = DIENSTEN_CASE_PROOF.cases.find(
              (c) => c.href === caseItem.href,
            );

            return (
              <motion.article
                key={caseItem.id}
                initial={reduce ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
                className="group flex flex-col"
              >
                <Link href={caseItem.href} className="block">
                  <CaseBrowserFrame caseItem={caseItem} />
                </Link>

                <div className="mt-4 flex flex-1 flex-col">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-lg font-extrabold text-slate-900">
                      {caseItem.client}
                    </h3>
                    <p
                      className="shrink-0 text-sm font-black tabular-nums"
                      style={{ color: caseItem.palette.accent }}
                    >
                      {caseItem.metric}
                    </p>
                  </div>
                  <p className="mt-1 text-sm font-medium leading-snug text-slate-600">
                    {meta?.hook ?? caseItem.homeHook}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {(meta?.tags ?? caseItem.tags.slice(0, 3)).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-bold text-slate-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={caseItem.href}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-slate-900 transition group-hover:text-[#FF5722]"
                  >
                    Bekijk case
                    <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
