"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { CaseBrowserFrame } from "@/components/home/cases/CaseBrowserFrame";
import { HOME_PROOF_CASES } from "@/data/home-cases";
import { HOME_PROOF } from "@/data/home-premium";

export function HomeProofSection() {
  const reduce = useReducedMotion();

  return (
    <section
      className="relative overflow-hidden border-b border-slate-200 bg-white"
      aria-labelledby="home-proof-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,87,34,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,87,34,0.035)_1px,transparent_1px)] bg-[size:40px_40px]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#FF5722]">
              {HOME_PROOF.tag}
            </p>
            <h2
              id="home-proof-heading"
              className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
            >
              {HOME_PROOF.title}
            </h2>
            <p className="mt-2 max-w-lg text-sm text-slate-600 sm:text-base">{HOME_PROOF.body}</p>
          </div>
          <Link
            href={HOME_PROOF.featuredHref}
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-slate-300 px-5 py-2.5 text-sm font-bold text-slate-900 transition hover:border-[#FF5722] hover:text-[#FF5722]"
          >
            {HOME_PROOF.featuredLabel}
            <ArrowUpRight className="size-4" aria-hidden />
          </Link>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-8">
          {HOME_PROOF_CASES.map((caseItem, index) => (
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
                  <h3 className="text-lg font-extrabold text-slate-900">{caseItem.client}</h3>
                  <p
                    className="shrink-0 text-sm font-black tabular-nums"
                    style={{ color: caseItem.palette.accent }}
                  >
                    {caseItem.metric}
                  </p>
                </div>
                <p className="mt-1 text-sm font-medium leading-snug text-slate-600">
                  {caseItem.homeHook}
                </p>
                <p className="mt-1 text-[11px] font-bold text-slate-400">{caseItem.metricHint}</p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {caseItem.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <Link
                  href={caseItem.href}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-slate-900 transition group-hover:text-[#FF5722]"
                >
                  Case bekijken
                  <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
