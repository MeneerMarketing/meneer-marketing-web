"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { CaseBrowserFrame } from "@/components/home/cases/CaseBrowserFrame";
import { HOME_PROOF_CASES } from "@/data/home-cases";
import { HOME_PROOF } from "@/data/home-premium";

/** Case met browser-frame illustratie op mobiel. */
export function HomeMobileProof() {
  const reduce = useReducedMotion();
  const featured = HOME_PROOF_CASES[0]!;

  return (
    <section
      aria-labelledby="mobile-proof-heading"
      className="overflow-x-clip border-b border-slate-200 bg-slate-50 py-12"
    >
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#FF5722]">
          {HOME_PROOF.tag}
        </p>
        <h2
          id="mobile-proof-heading"
          className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900"
        >
          Bewijs, geen praatjes.
        </h2>

        <motion.article
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mt-6"
        >
          <Link href={featured.href} className="group block">
            <CaseBrowserFrame caseItem={featured} />
          </Link>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                  {featured.eyebrow}
                </p>
                <h3 className="mt-1 text-lg font-extrabold text-slate-900">{featured.client}</h3>
              </div>
              <p
                className="shrink-0 text-2xl font-black tabular-nums tracking-tighter"
                style={{ color: featured.palette.accent }}
              >
                {featured.metric}
              </p>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{featured.homeHook}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {featured.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600"
                >
                  {tag}
                </span>
              ))}
            </div>
            <Link
              href={featured.href}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-slate-900 group-hover:text-[#FF5722]"
            >
              Case bekijken
              <ArrowUpRight className="size-3.5" aria-hidden />
            </Link>
          </div>
        </motion.article>

        <Link
          href={HOME_PROOF.featuredHref}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-[#FF5722]"
        >
          {HOME_PROOF.featuredLabel}
          <ArrowUpRight className="size-4" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
