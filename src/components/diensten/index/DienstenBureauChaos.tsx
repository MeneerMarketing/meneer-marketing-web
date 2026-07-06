"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, ArrowRight, Users } from "lucide-react";

import { Reveal } from "@/components/effects/Reveal";
import { DIENSTEN_CHAOS } from "@/data/diensten-index";

export function DienstenBureauChaos() {
  const reduce = useReducedMotion();

  return (
    <section
      className="relative overflow-hidden border-b border-slate-200 bg-slate-950"
      aria-labelledby="diensten-chaos-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div
        className="pointer-events-none absolute -right-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-[#FF5722]/20 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="lg:grid lg:grid-cols-2 lg:items-stretch lg:gap-14">
          <Reveal className="flex flex-col justify-center">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF5722]">
              {DIENSTEN_CHAOS.eyebrow}
            </p>
            <h2
              id="diensten-chaos-heading"
              className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
            >
              {DIENSTEN_CHAOS.title}{" "}
              <span className="text-[#FF5722]">{DIENSTEN_CHAOS.titleAccent}</span>
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-400">
              {DIENSTEN_CHAOS.lead}
            </p>
            <p className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-semibold leading-relaxed text-slate-200">
              {DIENSTEN_CHAOS.punchline}
            </p>
          </Reveal>

          <ul className="mt-12 space-y-4 lg:mt-0 lg:flex lg:flex-col lg:justify-center">
            {DIENSTEN_CHAOS.chaosItems.map((item, i) => (
              <motion.li
                key={item.label}
                initial={reduce ? false : { opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: 0.1 * i, type: "spring", stiffness: 200 }}
                className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 backdrop-blur-sm"
              >
                <div className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-500/15 text-red-400">
                    <Users className="size-5" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm font-bold italic text-slate-300">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                    <p className="mt-2 flex items-start gap-1.5 text-xs font-semibold text-[#FF5722]">
                      <AlertTriangle className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                      {item.problem}
                    </p>
                  </div>
                </div>
              </motion.li>
            ))}

            <motion.li
              initial={reduce ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35 }}
              className="rounded-2xl border-2 border-[#FF5722]/40 bg-gradient-to-br from-[#FF5722]/15 to-transparent p-5"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-[#FF5722] text-white">
                  <ArrowRight className="size-5" aria-hidden />
                </span>
                <p className="text-sm font-extrabold text-white">
                  Eén bureau. Eén lijn. Van strategie tot code tot campagne.
                </p>
              </div>
            </motion.li>
          </ul>
        </div>
      </div>
    </section>
  );
}
