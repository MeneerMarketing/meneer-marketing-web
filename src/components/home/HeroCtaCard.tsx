"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Calendar, Sparkles } from "lucide-react";
import { Magnetic } from "@/components/effects/Magnetic";
import { siteCtas } from "@/lib/cta";

const TECH_TAGS = ["Shopify", "Maatwerk", "Next.js", "n8n", "Klaviyo"];

export function HeroCtaCard() {
  const reduce = useReducedMotion();

  return (
    <div className="relative w-full max-w-[480px]">
      <motion.div
        animate={
          reduce
            ? undefined
            : {
                y: [0, -6, 0, 4, 0],
              }
        }
        transition={
          reduce
            ? undefined
            : { duration: 11, repeat: Infinity, ease: "easeInOut" }
        }
        className="relative isolate overflow-hidden rounded-[28px] bg-[#FF5722] p-7 text-white shadow-[0_30px_80px_-24px_rgba(255,87,34,0.55)] sm:p-9"
      >
        <DotGridPattern />
        <CornerArc />
        <FloatingTechRibbon reduce={reduce ?? false} />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 backdrop-blur-md">
            <span className="relative flex size-2">
              {!reduce ? (
                <motion.span
                  className="absolute inset-0 rounded-full bg-white"
                  animate={{ scale: [1, 2.6, 1], opacity: [0.7, 0, 0.7] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                />
              ) : null}
              <span className="relative size-2 rounded-full bg-white" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[0.18em]">
              3 plekken vrij in Q2
            </span>
          </div>

          <h2 className="mt-7 text-[2.5rem] font-extrabold leading-[1.02] tracking-tighter sm:text-[2.85rem]">
            Klaar om te
            <span className="block">bouwen?</span>
          </h2>

          <p className="mt-5 max-w-[360px] text-[15px] leading-relaxed tracking-tight text-white/90">
            Plan een gratis kennismaking van 30 minuten. We kijken samen waar
            de winst zit en wat we voor je kunnen bouwen.
          </p>

          <div className="mt-8 space-y-3">
            <Magnetic strength={10} radius={160} wobble={false}>
              <Link
                href={siteCtas.startIntake.href}
                className="group relative flex w-full items-center justify-between gap-3 overflow-hidden rounded-2xl bg-white px-5 py-4 text-left text-base font-bold tracking-tight text-slate-900 shadow-[0_12px_36px_-12px_rgba(15,23,42,0.45)] transition-shadow hover:shadow-[0_18px_44px_-12px_rgba(15,23,42,0.55)]"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 -z-0 origin-left scale-x-0 bg-slate-900 transition-transform duration-500 ease-out group-hover:scale-x-100"
                />
                <span className="relative z-10 flex items-center gap-3 group-hover:text-white">
                  <span className="flex size-9 items-center justify-center rounded-xl bg-[#FF5722]/10 text-[#FF5722] transition-colors duration-500 group-hover:bg-white/15 group-hover:text-white">
                    <Calendar className="size-4" strokeWidth={2.4} />
                  </span>
                  <span className="flex flex-col">
                    <span>Plan een gesprek</span>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 group-hover:text-white/70">
                      30 min · gratis
                    </span>
                  </span>
                </span>
                <ArrowUpRight
                  className="relative z-10 size-5 text-slate-900 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white"
                  aria-hidden
                />
              </Link>
            </Magnetic>

            <Link
              href={siteCtas.groeiscan.href}
              className="group inline-flex items-center gap-2 rounded-xl px-2 py-1 text-sm font-bold tracking-tight text-white/85 transition-colors hover:text-white"
            >
              <Sparkles className="size-4" strokeWidth={2.4} aria-hidden />
              Of doe eerst de Groeiscan
              <ArrowUpRight
                className="size-4 opacity-70 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                aria-hidden
              />
            </Link>
          </div>

          <div className="mt-8 flex items-center gap-3 border-t border-white/20 pt-5 text-[12px] font-semibold tracking-tight text-white/85">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-white" aria-hidden />
              Reactie binnen 24 uur
            </span>
            <span className="size-1 rounded-full bg-white/40" aria-hidden />
            <span>Geen verkooppraat</span>
          </div>
        </div>
      </motion.div>

      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-6 -right-6 -z-10 size-32 rounded-full bg-[#00BCD4]/30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-8 -left-6 -z-10 size-28 rounded-full bg-[#FF5722]/35 blur-3xl"
      />
    </div>
  );
}

function DotGridPattern() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 size-full opacity-25 mix-blend-overlay"
      width="100%"
      height="100%"
    >
      <defs>
        <pattern
          id="hero-cta-dots"
          x="0"
          y="0"
          width="22"
          height="22"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1" cy="1" r="1" fill="white" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hero-cta-dots)" />
    </svg>
  );
}

function CornerArc() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 240 240"
      className="pointer-events-none absolute -right-12 -top-12 size-72 opacity-30"
    >
      <circle
        cx="120"
        cy="120"
        r="100"
        fill="none"
        stroke="white"
        strokeWidth="1"
      />
      <circle
        cx="120"
        cy="120"
        r="70"
        fill="none"
        stroke="white"
        strokeWidth="1"
        strokeDasharray="2 6"
      />
      <circle
        cx="120"
        cy="120"
        r="44"
        fill="none"
        stroke="white"
        strokeWidth="1"
      />
    </svg>
  );
}

function FloatingTechRibbon({ reduce }: { reduce: boolean }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-3 z-0 overflow-hidden"
    >
      <motion.div
        className="flex w-max gap-3 whitespace-nowrap pl-7 text-[10px] font-bold uppercase tracking-[0.22em] text-white/40"
        animate={reduce ? undefined : { x: ["0%", "-50%"] }}
        transition={
          reduce
            ? undefined
            : {
                duration: 28,
                repeat: Infinity,
                ease: "linear",
              }
        }
      >
        {[...TECH_TAGS, ...TECH_TAGS, ...TECH_TAGS].map((t, i) => (
          <span
            key={`${t}-${i}`}
            className="inline-flex items-center gap-2 rounded-full border border-white/25 px-3 py-1"
          >
            <span className="size-1 rounded-full bg-white/60" />
            {t}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
