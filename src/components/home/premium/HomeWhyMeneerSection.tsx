"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import { HOME_WHY_MENEER } from "@/data/home-premium";
import { siteCtas } from "@/lib/cta";

const PILLAR_ANGLES = [-90, -18, 54, 126, 198] as const;
const ORBIT_R = 36;
const ORBIT_C = 50;

function pillarPosition(angleDeg: number): { x: number; y: number } {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: ORBIT_C + ORBIT_R * Math.cos(rad),
    y: ORBIT_C + ORBIT_R * Math.sin(rad),
  };
}

function MeneerPillarVisual({ reduce }: { reduce: boolean }) {
  const pillars = HOME_WHY_MENEER.pillars;

  return (
    <div className="relative mx-auto w-full max-w-[380px]">
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-white/10">
        <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
          >
            <InteractiveLogo className="size-[4.25rem] sm:size-[4.75rem]" />
          </motion.div>
        </div>

        {pillars.map((label, i) => {
          const { x, y } = pillarPosition(PILLAR_ANGLES[i]!);
          const tilt = i % 2 === 0 ? -1.25 : 1.25;
          return (
            <motion.div
              key={label}
              initial={reduce ? false : { opacity: 0, y: 8, rotate: tilt * 1.5 }}
              whileInView={{ opacity: 1, y: 0, rotate: tilt }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 + i * 0.05, type: "spring", stiffness: 300, damping: 22 }}
              whileHover={reduce ? undefined : { y: -2, rotate: 0 }}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <span className="block whitespace-nowrap rounded-2xl rounded-bl-sm bg-white px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-slate-900 shadow-md sm:px-3 sm:py-2 sm:text-[10px]">
                {label}
              </span>
            </motion.div>
          );
        })}

        <p className="absolute inset-x-0 bottom-3 text-center text-[10px] font-bold uppercase tracking-[0.12em] text-white/75">
          {HOME_WHY_MENEER.pillarsCaption}
        </p>
      </div>
    </div>
  );
}

function MeneerQuoteBubble({ text }: { text: string }) {
  return (
    <div className="flex items-end gap-2.5">
      <InteractiveLogo className="size-9 shrink-0" interactive={false} />
      <p className="rounded-2xl rounded-bl-sm bg-slate-950 px-4 py-3 text-sm font-bold leading-snug text-white">
        {text}
      </p>
    </div>
  );
}

export function HomeWhyMeneerSection() {
  const reduce = useReducedMotion();

  return (
    <section
      aria-labelledby="home-why-meneer-heading"
      className="relative overflow-x-clip overflow-hidden bg-[#FF5722]"
    >
      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-12">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/70">
              {HOME_WHY_MENEER.tag}
            </p>
            <h2
              id="home-why-meneer-heading"
              className="mt-4 text-3xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-4xl lg:whitespace-nowrap"
            >
              {HOME_WHY_MENEER.title}
            </h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/85">
              {HOME_WHY_MENEER.body}
            </p>

            <ul className="mt-8 space-y-2.5">
              {HOME_WHY_MENEER.strengths.map((item, i) => (
                <motion.li
                  key={item.label}
                  initial={reduce ? false : { opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.06 * i, duration: 0.35 }}
                >
                  <div className="rounded-2xl rounded-bl-sm bg-white/12 px-4 py-3.5 transition-colors hover:bg-white/18">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/90">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm font-bold leading-snug text-white">
                      {item.detail}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-7"
            >
              <MeneerQuoteBubble text={HOME_WHY_MENEER.quote} />
            </motion.div>

            <Link
              href={siteCtas.startIntake.href}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-slate-900"
            >
              Plan een gesprek
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: 0.06 }}
          >
            <MeneerPillarVisual reduce={!!reduce} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
