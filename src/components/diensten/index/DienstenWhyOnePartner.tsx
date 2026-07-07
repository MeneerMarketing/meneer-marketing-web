"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Link2, Search, Users } from "lucide-react";

import { Reveal } from "@/components/effects/Reveal";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import { DIENSTEN_WHY } from "@/data/diensten-index";

const ICONS = [Users, Link2, Search] as const;
const EASE = [0.22, 1, 0.36, 1] as const;

export function DienstenWhyOnePartner() {
  const reduce = useReducedMotion();

  return (
    <section
      className="relative overflow-hidden border-b border-slate-800 bg-[#0B1220]"
      aria-labelledby="diensten-why-heading"
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

      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="lg:grid lg:grid-cols-2 lg:gap-14 lg:items-stretch">
          <Reveal className="flex flex-col justify-center">
            <InteractiveLogo className="size-14" interactive={false} />
            <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.22em] text-[#FF5722]">
              Eén partner
            </p>
            <h2
              id="diensten-why-heading"
              className="mt-3 text-pretty text-2xl font-extrabold tracking-tight text-white sm:text-3xl"
            >
              {DIENSTEN_WHY.title}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-400">
              {DIENSTEN_WHY.body}
            </p>
          </Reveal>

          <ul className="mt-10 space-y-4 lg:mt-0 lg:flex lg:flex-col lg:justify-center">
            {DIENSTEN_WHY.points.map((point, i) => {
              const Icon = ICONS[i];
              return (
                <motion.li
                  key={point.title}
                  initial={reduce ? false : { opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: 0.08 * i, duration: 0.45, ease: EASE }}
                  className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#FF5722]/15 text-[#FF5722]">
                    <Icon className="size-5" strokeWidth={1.8} aria-hidden />
                  </span>
                  <span>
                    <p className="text-sm font-extrabold text-white">{point.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-400">
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
