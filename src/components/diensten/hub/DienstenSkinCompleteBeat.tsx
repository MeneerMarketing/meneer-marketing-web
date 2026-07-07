"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/effects/Reveal";
import { DIENSTEN_SKINCOMPLETE_BEAT } from "@/data/diensten-hub";

const EASE = [0.22, 1, 0.36, 1] as const;

export function DienstenSkinCompleteBeat() {
  const reduce = useReducedMotion();

  return (
    <section
      className="border-b border-slate-200 bg-white"
      aria-labelledby="diensten-skincomplete-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-orange-50/80 via-white to-cyan-50/50">
          <div className="grid lg:grid-cols-2 lg:items-stretch">
            <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12">
              <Reveal>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF5722]">
                  {DIENSTEN_SKINCOMPLETE_BEAT.eyebrow}
                </p>
                <h2
                  id="diensten-skincomplete-heading"
                  className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
                >
                  {DIENSTEN_SKINCOMPLETE_BEAT.title}{" "}
                  <span className="text-[#FF5722]">
                    {DIENSTEN_SKINCOMPLETE_BEAT.titleAccent}
                  </span>
                </h2>
                <p className="mt-4 text-base leading-relaxed text-slate-600">
                  {DIENSTEN_SKINCOMPLETE_BEAT.body}
                </p>
                <Link
                  href={DIENSTEN_SKINCOMPLETE_BEAT.cta.href}
                  className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-slate-900 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800"
                >
                  {DIENSTEN_SKINCOMPLETE_BEAT.cta.label}
                  <ArrowUpRight className="size-4" aria-hidden />
                </Link>
              </Reveal>
            </div>

            <div className="flex flex-col justify-center border-t border-slate-200/80 bg-slate-900 p-8 lg:border-l lg:border-t-0 lg:p-10">
              <ol className="space-y-4">
                {DIENSTEN_SKINCOMPLETE_BEAT.steps.map((step, i) => (
                  <motion.li
                    key={step.label}
                    initial={reduce ? false : { opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.12 * i, ease: EASE }}
                    className={`rounded-2xl border px-5 py-4 ${
                      i === DIENSTEN_SKINCOMPLETE_BEAT.steps.length - 1
                        ? "border-[#FF5722]/40 bg-[#FF5722]/15"
                        : "border-white/10 bg-white/5"
                    }`}
                  >
                    <p
                      className={`text-sm font-extrabold ${
                        i === DIENSTEN_SKINCOMPLETE_BEAT.steps.length - 1
                          ? "text-[#FF5722]"
                          : "text-white"
                      }`}
                    >
                      {step.label}
                    </p>
                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      {step.note}
                    </p>
                  </motion.li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
