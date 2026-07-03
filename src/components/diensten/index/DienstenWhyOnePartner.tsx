"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Users, Link2, Search } from "lucide-react";
import { DIENSTEN_WHY } from "@/data/diensten-index";

const ICONS = [Users, Link2, Search] as const;

export function DienstenWhyOnePartner() {
  const reduce = useReducedMotion();

  return (
    <section
      className="border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white"
      aria-labelledby="diensten-why-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="lg:grid lg:grid-cols-2 lg:gap-14 lg:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF5722]">
              Eén partner
            </p>
            <h2
              id="diensten-why-heading"
              className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
            >
              {DIENSTEN_WHY.title}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              {DIENSTEN_WHY.body}
            </p>
          </div>

          <ul className="mt-10 space-y-4 lg:mt-0">
            {DIENSTEN_WHY.points.map((point, i) => {
              const Icon = ICONS[i];
              return (
                <motion.li
                  key={point.title}
                  initial={reduce ? false : { opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: 0.08 * i }}
                  className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#FF5722]/10 text-[#FF5722]">
                    <Icon className="size-5" strokeWidth={1.8} aria-hidden />
                  </span>
                  <span>
                    <p className="text-sm font-extrabold text-slate-900">{point.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">
                      {point.body}
                    </p>
                  </span>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
