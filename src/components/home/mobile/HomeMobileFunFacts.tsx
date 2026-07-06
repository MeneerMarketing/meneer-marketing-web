"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { MarketingFunFactCard } from "@/components/shared/MarketingFunFactCard";
import {
  ALL_MARKETING_FUN_FACTS,
  MARKETING_FUN_FACTS,
} from "@/data/marketing-fun-facts";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Eén featured weetje als afsluitend merkmoment. */
export function HomeMobileFunFacts() {
  const reduce = useReducedMotion();
  const featured = MARKETING_FUN_FACTS[0]!;

  return (
    <section
      aria-labelledby="mobile-funfacts-heading"
      className="overflow-x-clip border-b border-slate-200 bg-white py-14"
    >
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#FF5722]">
            Wist je dat?
          </p>
          <h2
            id="mobile-funfacts-heading"
            className="mt-4 text-pretty text-[1.65rem] font-extrabold leading-[1.1] tracking-tight text-slate-900"
          >
            Marketing is gekker dan je denkt.
          </h2>
          <p className="mt-3 text-pretty text-sm leading-relaxed text-slate-600">
            Tik om te draaien. Feitjes die je scherper laten adverteren.
          </p>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8%" }}
          transition={{ delay: 0.08, duration: 0.5, ease: EASE }}
          className="mx-auto mt-8 max-w-[320px]"
        >
          <MarketingFunFactCard fact={featured} className="h-[268px]" />
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="mt-6 text-center"
        >
          <Link
            href="/weetjes"
            className="inline-flex items-center gap-1.5 text-sm font-extrabold text-[#FF5722]"
          >
            Bekijk alle {ALL_MARKETING_FUN_FACTS.length} marketing weetjes
            <ArrowUpRight className="size-4" aria-hidden />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
