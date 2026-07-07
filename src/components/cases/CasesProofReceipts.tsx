"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import { CASES_PAGE_PROOF, CASES_PAGE_STORIES } from "@/data/cases-page";
import { HOME_CASES } from "@/data/home-cases";

const EASE = [0.22, 1, 0.36, 1] as const;
const TILTS = [-2, 1.5, -1] as const;

export function CasesProofReceipts() {
  const reduce = useReducedMotion();

  return (
    <section
      className="border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white"
      aria-labelledby="cases-proof-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
        <div className="max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#FF5722]">
            {CASES_PAGE_PROOF.eyebrow}
          </p>
          <h2
            id="cases-proof-heading"
            className="mt-3 text-pretty text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
          >
            {CASES_PAGE_PROOF.title}{" "}
            <span className="text-[#FF5722]">{CASES_PAGE_PROOF.titleAccent}</span>
          </h2>
          <p className="mt-3 text-pretty text-sm leading-relaxed text-slate-600 sm:text-base">
            {CASES_PAGE_PROOF.lead}
          </p>
        </div>

        <ul className="mt-10 grid gap-6 lg:grid-cols-3 lg:gap-5">
          {HOME_CASES.map((caseItem, i) => {
            const story = CASES_PAGE_STORIES[caseItem.scene];
            const tilt = TILTS[i] ?? 0;

            return (
              <motion.li
                key={caseItem.id}
                initial={reduce ? false : { opacity: 0, y: 20, rotate: tilt }}
                whileInView={{ opacity: 1, y: 0, rotate: tilt }}
                viewport={{ once: true, margin: "-8%" }}
                transition={{ delay: i * 0.08, duration: 0.45, ease: EASE }}
                whileHover={reduce ? undefined : { y: -6, rotate: 0, scale: 1.02 }}
                className="flex"
              >
                <article className="flex w-full flex-col overflow-hidden rounded-sm border border-slate-200 bg-[#FEFCFC] shadow-[0_20px_50px_-28px_rgba(15,23,42,0.2)]">
                  <div
                    className="h-2 bg-[repeating-linear-gradient(90deg,#e2e8f0_0,#e2e8f0_6px,transparent_6px,transparent_12px)]"
                    aria-hidden
                  />

                  <div className="border-b border-dashed border-slate-200 px-5 py-4">
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                      {CASES_PAGE_PROOF.receiptLabel} · {String(i + 1).padStart(3, "0")}
                    </p>
                    <p className="mt-2 text-xl font-black tracking-tight text-slate-900">
                      {caseItem.client}
                    </p>
                    <p className="mt-1 font-mono text-[11px] text-slate-500">
                      {new Date().getFullYear()} · meneer marketing
                    </p>
                  </div>

                  <div className="flex flex-1 flex-col px-5 py-4">
                    <div className="flex items-baseline justify-between gap-2 border-b border-dashed border-slate-200 pb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Resultaat
                      </span>
                      <span
                        className="text-right text-lg font-black tabular-nums"
                        style={{ color: caseItem.palette.accent }}
                      >
                        {caseItem.metric}
                      </span>
                    </div>
                    <p className="mt-3 text-pretty text-sm font-semibold leading-snug text-slate-800">
                      {caseItem.metricHint}
                    </p>
                    <p className="mt-3 flex-1 text-pretty text-xs leading-relaxed text-slate-600">
                      {story.punch}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {caseItem.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-bold text-slate-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 border-t border-dashed border-slate-200 bg-slate-50/80 px-5 py-4">
                    {caseItem.website ? (
                      <a
                        href={caseItem.website.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-900 transition hover:border-[#FF5722]/40 hover:text-[#FF5722]"
                      >
                        {CASES_PAGE_PROOF.liveLabel}
                        <span className="font-mono text-xs text-slate-500">
                          {caseItem.website.hostname}
                        </span>
                        <ExternalLink className="size-3.5 shrink-0" aria-hidden />
                      </a>
                    ) : null}
                    <Link
                      href={caseItem.href}
                      className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-[#FF5722] transition hover:gap-2"
                    >
                      {CASES_PAGE_PROOF.caseLabel}
                      <ArrowUpRight className="size-3.5" aria-hidden />
                    </Link>
                  </div>
                </article>
              </motion.li>
            );
          })}
        </ul>

        <div className="relative mt-8 flex items-start gap-3 rounded-2xl rounded-bl-sm border border-[#FF5722]/20 bg-orange-50/70 px-4 py-3.5 pl-12">
          <InteractiveLogo className="absolute left-3 top-3 size-7 shrink-0" interactive={false} />
          <p className="relative text-pretty text-sm font-bold leading-snug text-slate-800">
            {CASES_PAGE_PROOF.meneerQuip}
          </p>
        </div>
      </div>
    </section>
  );
}
