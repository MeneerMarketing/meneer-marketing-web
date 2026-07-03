"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

interface PillarProofPanelProps {
  title: string;
  body: string;
  metrics: { label: string; value: string }[];
  featuredHref: string;
  featuredLabel: string;
}

export function PillarProofPanel({
  title,
  body,
  metrics,
  featuredHref,
  featuredLabel,
}: PillarProofPanelProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_24px_56px_-32px_rgba(15,23,42,0.2)] sm:p-10"
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-[#FF5722]/10 blur-3xl"
        aria-hidden
      />
      <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            {title}
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
            {body}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={featuredHref}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#FF5722]"
            >
              {featuredLabel}
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
            <Link
              href="/cases"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-800 transition hover:border-[#FF5722]/40 hover:text-[#FF5722]"
            >
              Naar cases
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>

        <ul className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 lg:gap-4">
          {metrics.map((metric, index) => (
            <motion.li
              key={metric.label}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.12 * index }}
              className="rounded-2xl border border-slate-100 bg-slate-50/80 px-5 py-4"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                {metric.label}
              </p>
              <p className="mt-1 text-xl font-extrabold tracking-tight text-[#FF5722]">
                {metric.value}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}
