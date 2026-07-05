"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { HOME_PROOF_CASES } from "@/data/home-cases";
import { HOME_PROOF } from "@/data/home-premium";

/** Eén sterke case op mobiel. Sneller vertrouwen, minder scroll. */
export function HomeMobileProof() {
  const reduce = useReducedMotion();
  const featured = HOME_PROOF_CASES[0]!;

  return (
    <section
      aria-labelledby="mobile-proof-heading"
      className="border-b border-slate-200 bg-slate-50 py-12"
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
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
          className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div
            className="px-5 py-4"
            style={{ backgroundColor: featured.palette.surface }}
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
              {featured.eyebrow}
            </p>
            <p
              className="mt-2 text-3xl font-black tabular-nums tracking-tighter"
              style={{ color: featured.palette.accent }}
            >
              {featured.metric}
            </p>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              {featured.metricHint}
            </p>
          </div>
          <div className="p-5">
            <h3 className="text-lg font-extrabold text-slate-900">{featured.client}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {featured.homeHook}
            </p>
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
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-slate-900"
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
