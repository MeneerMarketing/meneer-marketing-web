"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CalendarCheck,
  MapPin,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

import { Reveal } from "@/components/effects/Reveal";

const PHASES = [
  {
    id: "found",
    icon: MapPin,
    kicker: "Gevonden",
    title: "Google zoekt. Jij verschijnt.",
    body: "Lokale zoekvraag, structuur en Maps die samenwerken.",
    pill: "Zoeken → jouw kliniek",
  },
  {
    id: "trust",
    icon: Sparkles,
    kicker: "Vertrouwen",
    title: "De site overtuigt in één scroll.",
    body: "Art direction, behandelingen, team en tarieven die kloppen.",
    pill: "Twijfel → dit is het",
  },
  {
    id: "book",
    icon: CalendarCheck,
    kicker: "Afspraak",
    title: "Klik wordt een intake in je agenda.",
    body: "Jouw systeem, branded app of maatwerk. Echt boeken.",
    pill: "Klik → intake",
  },
  {
    id: "return",
    icon: RefreshCw,
    kicker: "Terugkeer",
    title: "Patiënten blijven in je systeem.",
    body: "Reminder, nazorgpad en herhaalafspraak houden het warm.",
    pill: "Consult → terugkeer",
  },
] as const;

type PhaseIndex = 0 | 1 | 2 | 3;

export function HuidkliniekCompleteFlow() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<PhaseIndex>(0);

  return (
    <section
      className="relative overflow-hidden border-b border-slate-800 bg-[#0c1222] text-white"
      aria-labelledby="Huidkliniek-flow-heading"
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 10% 0%, rgba(255,87,34,0.22), transparent 55%), radial-gradient(ellipse 45% 40% at 95% 100%, rgba(56,189,248,0.12), transparent 55%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <Reveal>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-300">
                Complete kliniek-flow
              </p>
              <h2
                id="Huidkliniek-flow-heading"
                className="mt-3 text-3xl font-extrabold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-[1.06]"
              >
                Van Google-zoekopdracht tot vaste huidkliniek-klant.
                <span className="mt-1 block text-[#FF5722]">
                  Dat is het echte product.
                </span>
              </h2>
              <p className="mt-5 text-base leading-relaxed text-slate-300 sm:text-lg">
                Volg de route. Gevonden worden, overtuigen, afspraak, terugkeer.
                Van{" "}
                <Link
                  href="/diensten/seo"
                  className="font-bold text-white underline decoration-[#FF5722]/50 underline-offset-2 hover:text-[#FF5722]"
                >
                  SEO
                </Link>{" "}
                tot{" "}
                <Link
                  href="/campagnes"
                  className="font-bold text-white underline decoration-[#FF5722]/50 underline-offset-2 hover:text-[#FF5722]"
                >
                  campagnes
                </Link>
                .
              </p>
            </div>
            <a
              href="#pakketten"
              className="group inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:bg-[#FF5722] hover:text-white lg:self-auto"
            >
              Welk pakket past?
              <ArrowRight
                className="size-4 transition group-hover:translate-x-0.5"
                aria-hidden
              />
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative mt-16 hidden lg:block">
            <div
              className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-white/12"
              aria-hidden
            />
            <motion.div
              className="absolute left-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-sky-400 via-[#FF5722] to-orange-300"
              aria-hidden
              initial={false}
              animate={{
                width: `${((active + 1) / PHASES.length) * 100}%`,
              }}
              transition={
                reduce ? { duration: 0 } : { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
              }
            />

            <ol className="relative grid grid-cols-4">
              {PHASES.map((phase, index) => {
                const Icon = phase.icon;
                const isActive = active === index;
                const above = index % 2 === 0;
                const reached = index <= active;

                const card = (
                  <motion.div
                    className={
                      isActive
                        ? "w-full rounded-2xl border border-white/20 bg-white/[0.1] p-4 shadow-[0_16px_40px_-24px_rgba(0,0,0,0.55)] backdrop-blur-sm"
                        : "w-full rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                    }
                    initial={false}
                    animate={
                      reduce
                        ? undefined
                        : { y: isActive ? -4 : 0, opacity: isActive ? 1 : 0.72 }
                    }
                    transition={{ duration: 0.28 }}
                  >
                    <p
                      className={
                        isActive
                          ? "text-[10px] font-bold uppercase tracking-[0.18em] text-orange-300"
                          : "text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400"
                      }
                    >
                      {phase.kicker}
                    </p>
                    <p className="mt-2 text-base font-extrabold leading-snug tracking-tight">
                      {phase.title}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-300">
                      {phase.body}
                    </p>
                    <p
                      className={
                        isActive
                          ? "mt-3 inline-flex whitespace-nowrap rounded-full bg-[#FF5722] px-3 py-1 text-[11px] font-bold text-white"
                          : "mt-3 inline-flex whitespace-nowrap rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold text-slate-300"
                      }
                    >
                      {phase.pill}
                    </p>
                  </motion.div>
                );

                const stem = (
                  <span
                    className={
                      reached
                        ? "block h-8 w-px bg-[#FF5722]/60"
                        : "block h-8 w-px bg-white/15"
                    }
                    aria-hidden
                  />
                );

                return (
                  <li key={phase.id} className="px-2">
                    <button
                      type="button"
                      onClick={() => setActive(index as PhaseIndex)}
                      onMouseEnter={() => setActive(index as PhaseIndex)}
                      className="flex w-full flex-col items-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5722] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c1222]"
                      aria-pressed={isActive}
                    >
                      <div className="flex h-[220px] w-full flex-col justify-end">
                        {above ? (
                          <>
                            {card}
                            <div className="flex justify-center">{stem}</div>
                          </>
                        ) : null}
                      </div>

                      <motion.div
                        className={
                          isActive
                            ? "z-10 flex size-14 items-center justify-center rounded-2xl bg-[#FF5722] text-white shadow-[0_12px_30px_rgba(255,87,34,0.45)]"
                            : reached
                              ? "z-10 flex size-14 items-center justify-center rounded-2xl bg-white/12 text-white ring-1 ring-white/25"
                              : "z-10 flex size-14 items-center justify-center rounded-2xl bg-[#0c1222] text-slate-400 ring-1 ring-white/15"
                        }
                        initial={false}
                        animate={reduce ? undefined : { scale: isActive ? 1.06 : 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <Icon className="size-6" aria-hidden />
                      </motion.div>

                      <div className="flex h-[220px] w-full flex-col justify-start">
                        {above ? null : (
                          <>
                            <div className="flex justify-center">{stem}</div>
                            {card}
                          </>
                        )}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </Reveal>

        <ol className="relative mt-10 space-y-3 lg:hidden">
          {PHASES.map((phase, index) => {
            const Icon = phase.icon;
            return (
              <li key={phase.id}>
                <Reveal delay={index * 0.05}>
                  <article className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#FF5722]/15 text-[#FF5722] ring-1 ring-[#FF5722]/30">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange-300">
                        {phase.kicker}
                      </p>
                      <p className="mt-1.5 text-base font-extrabold leading-snug tracking-tight">
                        {phase.title}
                      </p>
                      <p className="mt-1.5 text-sm leading-relaxed text-slate-300">
                        {phase.body}
                      </p>
                      <p className="mt-3 inline-flex whitespace-nowrap rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold text-orange-200">
                        {phase.pill}
                      </p>
                    </div>
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ol>

        <Reveal delay={0.16}>
          <p className="mx-auto mt-12 max-w-2xl text-center text-sm leading-relaxed text-slate-400 lg:mt-16">
            Je koopt geen losse website. Je koopt een commercieel systeem rond
            je agenda. Local Growth en Growth Partner pakken vindbaarheid en
            Google Ads erbij.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
