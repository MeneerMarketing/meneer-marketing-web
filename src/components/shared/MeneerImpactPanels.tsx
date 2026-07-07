"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import {
  CasesImpactExperienceVisual,
  CasesImpactFocusVisual,
  CasesImpactIntakeVisual,
} from "@/components/cases/CasesImpactVisuals";
import type { MeneerImpactContent, MeneerImpactVisual } from "@/data/meneer-impact-panels";

const EASE = [0.22, 1, 0.36, 1] as const;

const VISUALS: Record<
  MeneerImpactVisual,
  typeof CasesImpactExperienceVisual
> = {
  experience: CasesImpactExperienceVisual,
  intake: CasesImpactIntakeVisual,
  focus: CasesImpactFocusVisual,
};

export function MeneerImpactPanels({ content }: { content: MeneerImpactContent }) {
  const reduce = useReducedMotion();

  return (
    <section
      className="relative overflow-hidden border-y border-slate-800 bg-slate-950"
      aria-labelledby={content.headingId}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div
        className="pointer-events-none absolute -left-24 top-1/2 size-64 -translate-y-1/2 rounded-full bg-[#FF5722]/12 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        <p className="text-center text-[11px] font-bold uppercase tracking-[0.2em] text-[#FF5722]">
          {content.eyebrow}
        </p>
        <h2
          id={content.headingId}
          className="mt-3 text-center text-pretty text-2xl font-extrabold tracking-tight text-white sm:text-3xl"
        >
          {content.title}{" "}
          <span className="text-[#FF5722]">{content.titleAccent}</span>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-pretty text-sm leading-relaxed text-slate-400 sm:text-base">
          {content.lead}
        </p>

        <ul className="mt-10 grid gap-5 lg:grid-cols-3">
          {content.items.map((item, i) => {
            const Visual = VISUALS[item.visual];
            return (
              <motion.li
                key={item.id}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8%" }}
                transition={{ delay: i * 0.1, duration: 0.45, ease: EASE }}
              >
                <Link
                  href={item.href}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition hover:border-[#FF5722]/35 hover:bg-white/[0.06]"
                >
                  <div className="p-3 pb-0">
                    <Visual />
                  </div>
                  <div className="flex flex-1 flex-col p-5 pt-4">
                    <p className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.14em] text-[#FF5722]">
                      {item.label}
                    </p>
                    <p className="mt-2 whitespace-nowrap text-pretty text-base font-extrabold leading-snug text-white">
                      {item.headline}
                    </p>
                    <p className="mt-2 flex-1 text-pretty text-xs leading-relaxed text-slate-400">
                      {item.body}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#FF5722] transition group-hover:gap-1.5">
                      {item.linkLabel}
                      <ArrowUpRight className="size-3.5" aria-hidden />
                    </span>
                  </div>
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
