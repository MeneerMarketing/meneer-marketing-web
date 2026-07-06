"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { MarketingFunFactCard } from "@/components/shared/MarketingFunFactCard";
import {
  ALL_MARKETING_FUN_FACTS,
  MARKETING_FUN_FACTS,
} from "@/data/marketing-fun-facts";

const EASE = [0.22, 1, 0.36, 1] as const;
const CARD_GAP = 12;

/** Swipe-carousel met flip-kaartjes. */
export function HomeMobileFunFacts() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const facts = MARKETING_FUN_FACTS;

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
            Swipe voor het volgende feit. Tik om te draaien.
          </p>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8%" }}
          transition={{ delay: 0.08, duration: 0.5, ease: EASE }}
          className="-mx-4 mt-8"
        >
          <div className="flex items-center justify-between gap-3 px-4 pb-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
              Swipe →
            </span>
            <span className="text-[10px] font-bold tabular-nums text-slate-400">
              {active + 1}/{facts.length}
            </span>
          </div>

          <ul
            className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-4 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            onScroll={(e) => {
              const el = e.currentTarget;
              const card = el.querySelector("li");
              if (!card) return;
              const idx = Math.round(el.scrollLeft / (card.clientWidth + CARD_GAP));
              setActive(Math.min(idx, facts.length - 1));
            }}
          >
            {facts.map((fact, index) => (
              <motion.li
                key={fact.id}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8%" }}
                transition={{ delay: index * 0.05, duration: 0.4, ease: EASE }}
                className="w-[min(88vw,320px)] shrink-0 snap-center"
              >
                <MarketingFunFactCard fact={fact} className="h-[268px]" />
              </motion.li>
            ))}
          </ul>

          <div className="mt-4 flex items-center justify-center gap-2" aria-hidden>
            {facts.map((fact, i) => (
              <span
                key={fact.id}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === active ? "w-6 bg-[#FF5722]" : "w-1.5 bg-slate-300"
                }`}
              />
            ))}
          </div>
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
