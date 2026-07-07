"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, ArrowRight, MessageSquare } from "lucide-react";

import { Reveal } from "@/components/effects/Reveal";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import { DIENSTEN_CHAOS } from "@/data/diensten-index";

const EASE = [0.22, 1, 0.36, 1] as const;

function BureauBubble({
  label,
  quote,
  problem,
  delay,
}: {
  label: string;
  quote: string;
  problem: string;
  delay: number;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, x: 28, scale: 0.98 }}
      whileInView={{ opacity: 1, x: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay, duration: 0.45, ease: EASE }}
      className="rounded-2xl border border-white/10 bg-slate-900/90 p-4 backdrop-blur-sm sm:p-5"
    >
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-500/15 text-xs font-black text-red-400">
          {label.replace("Bureau ", "")}
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            <MessageSquare className="size-3" aria-hidden />
            {label}
          </p>
          <p className="mt-2 text-sm font-bold italic leading-snug text-slate-200">
            &ldquo;{quote}&rdquo;
          </p>
          <p className="mt-2 flex items-start gap-1.5 text-xs font-semibold text-[#FF5722]">
            <AlertTriangle className="mt-0.5 size-3.5 shrink-0" aria-hidden />
            {problem}
          </p>
        </div>
      </div>
    </motion.li>
  );
}

export function DienstenBureauChaos() {
  const reduce = useReducedMotion();

  return (
    <section
      className="relative overflow-hidden border-b border-slate-800 bg-[#0B1220]"
      aria-labelledby="diensten-chaos-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div
        className="pointer-events-none absolute -right-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-[#FF5722]/15 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="lg:grid lg:grid-cols-2 lg:items-stretch lg:gap-14">
          <Reveal className="flex flex-col justify-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#FF5722]">
              {DIENSTEN_CHAOS.eyebrow}
            </p>
            <h2
              id="diensten-chaos-heading"
              className="mt-4 text-pretty text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
            >
              {DIENSTEN_CHAOS.title}{" "}
              <span className="text-[#FF5722]">{DIENSTEN_CHAOS.titleAccent}</span>
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-400">
              {DIENSTEN_CHAOS.lead}
            </p>

            <div className="relative mt-7 overflow-hidden rounded-2xl bg-white/[0.05] px-4 py-4 ring-1 ring-white/[0.08] sm:px-5 sm:py-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#FF5722]">
                Heet take
              </p>
              <p className="mt-2 text-pretty text-sm font-bold leading-snug text-white/95 sm:text-base">
                {DIENSTEN_CHAOS.punchline}
              </p>
            </div>
          </Reveal>

          <ul className="mt-12 space-y-3 lg:mt-0 lg:flex lg:flex-col lg:justify-center">
            {DIENSTEN_CHAOS.chaosItems.map((item, i) => (
              <BureauBubble
                key={item.label}
                label={item.label}
                quote={item.quote}
                problem={item.problem}
                delay={0.1 * i}
              />
            ))}

            <motion.li
              initial={reduce ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, ease: EASE }}
              className="rounded-2xl border-2 border-[#FF5722]/40 bg-gradient-to-br from-[#FF5722]/20 to-transparent p-5"
            >
              <div className="flex items-center gap-3">
                <InteractiveLogo className="size-10 shrink-0" interactive={false} />
                <div>
                  <p className="text-sm font-extrabold text-white">
                    Eén bureau. Eén lijn. Van strategie tot code tot campagne.
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs font-bold text-[#FF5722]">
                    <ArrowRight className="size-3.5" aria-hidden />
                    Dezelfde stem in je mail, op je site en in je account.
                  </p>
                </div>
              </div>
            </motion.li>
          </ul>
        </div>
      </div>
    </section>
  );
}
