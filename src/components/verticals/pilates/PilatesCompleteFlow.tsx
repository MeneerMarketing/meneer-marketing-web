"use client";

import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
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
    body: 'Lokale zoekvraag zoals "Pilates + jouw stad". Structuur, Maps en SEO die daarop meewerken.',
    pill: "Zoeken → jouw studio",
  },
  {
    id: "trust",
    icon: Sparkles,
    kicker: "Vertrouwen",
    title: "De site overtuigt in één scroll.",
    body: "Art direction, lessen, trainers, prijzen. Voelt als jouw studio, niet als stockfoto-sportschool.",
    pill: "Twijfel → dit is het",
  },
  {
    id: "book",
    icon: CalendarCheck,
    kicker: "Boeken",
    title: "Klik wordt een plek in het rooster.",
    body: "Koppeling met je systeem, branded app of maatwerk. Echt boeken, niet eindeloos heen-en-weer appen.",
    pill: "Klik → roosterplek",
  },
  {
    id: "return",
    icon: RefreshCw,
    kicker: "Terugkomen",
    title: "Leden blijven in je systeem.",
    body: "App, herinneringen, memberships. Het pad stopt niet bij de eerste boeking. Dat is retentie.",
    pill: "Les → vast lid",
  },
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;

export function PilatesCompleteFlow() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const phase = PHASES[active]!;
  const ActiveIcon = phase.icon;

  return (
    <section
      className="relative overflow-hidden border-b border-slate-200 bg-slate-50"
      aria-labelledby="pilates-flow-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-45"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,87,34,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,87,34,0.045) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <Reveal>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF5722]">
                Complete studio flow
              </p>
              <h2
                id="pilates-flow-heading"
                className="mt-3 text-3xl font-extrabold tracking-tight text-balance text-slate-900 sm:text-4xl lg:text-[2.75rem] lg:leading-[1.06]"
              >
                Van Google-zoekopdracht tot vaste Pilates-klant.
                <span className="mt-1 block text-[#FF5722]">
                  Dat is het echte product.
                </span>
              </h2>
              <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">
                Tik een stap. Zo werkt het pad waar je omzet van hangt: gevonden
                worden, overtuigen, boeken, terugkomen. Van{" "}
                <Link
                  href="/diensten/seo"
                  className="font-bold text-slate-900 underline decoration-[#FF5722]/40 underline-offset-2 hover:text-[#FF5722]"
                >
                  SEO
                </Link>{" "}
                tot{" "}
                <Link
                  href="/campagnes"
                  className="font-bold text-slate-900 underline decoration-[#FF5722]/40 underline-offset-2 hover:text-[#FF5722]"
                >
                  campagnes
                </Link>
                .
              </p>
            </div>
            <a
              href="#pakketten"
              className="group inline-flex shrink-0 items-center gap-2 self-start rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#FF5722] lg:self-auto"
            >
              Welk pakket past?
              <ArrowRight
                className="size-4 transition group-hover:translate-x-0.5"
                aria-hidden
              />
            </a>
          </div>
        </Reveal>

        {/* Interactive journey */}
        <div className="mt-12 grid gap-6 lg:mt-14 lg:grid-cols-[minmax(0,1fr)_minmax(280px,340px)] lg:items-stretch lg:gap-8">
          <Reveal className="h-full">
            <div className="flex h-full flex-col rounded-3xl border border-slate-200/90 bg-white p-5 shadow-[0_20px_50px_-28px_rgba(15,23,42,0.18)] sm:p-6">
              {/* Progress rail */}
              <div className="mb-5 flex items-center gap-1.5" aria-hidden>
                {PHASES.map((p, i) => (
                  <div key={p.id} className="flex flex-1 items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setActive(i)}
                      className={
                        i <= active
                          ? "size-2.5 rounded-full bg-[#FF5722] transition"
                          : "size-2.5 rounded-full bg-slate-200 transition"
                      }
                      aria-label={`Stap ${i + 1}: ${p.kicker}`}
                    />
                    {i < PHASES.length - 1 ? (
                      <div
                        className={
                          i < active
                            ? "h-0.5 flex-1 rounded-full bg-[#FF5722]/70"
                            : "h-0.5 flex-1 rounded-full bg-slate-200"
                        }
                      />
                    ) : null}
                  </div>
                ))}
              </div>

              <ol
                className="grid flex-1 gap-3 sm:grid-cols-2"
                role="tablist"
                aria-label="Studio flow stappen"
              >
                {PHASES.map((item, index) => {
                  const Icon = item.icon;
                  const selected = active === index;
                  return (
                    <li key={item.id} className="h-full">
                      <button
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        onClick={() => setActive(index)}
                        onMouseEnter={() => {
                          if (!reduce) setActive(index);
                        }}
                        className={
                          selected
                            ? "flex h-full w-full flex-col rounded-2xl border-2 border-slate-900 bg-slate-900 p-4 text-left text-white transition sm:p-5"
                            : "flex h-full w-full flex-col rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left text-slate-900 transition hover:border-slate-300 hover:bg-white sm:p-5"
                        }
                      >
                        <span className="flex items-center justify-between gap-2">
                          <span
                            className={
                              selected
                                ? "flex size-9 items-center justify-center rounded-xl bg-[#FF5722] text-white"
                                : "flex size-9 items-center justify-center rounded-xl bg-white text-[#FF5722] ring-1 ring-slate-200"
                            }
                          >
                            <Icon className="size-4" aria-hidden />
                          </span>
                          <span
                            className={
                              selected
                                ? "text-[10px] font-bold uppercase tracking-[0.16em] text-orange-300"
                                : "text-[10px] font-bold uppercase tracking-[0.16em] text-[#FF5722]"
                            }
                          >
                            {item.kicker}
                          </span>
                        </span>
                        <span className="mt-3 text-sm font-extrabold leading-snug tracking-tight sm:text-[0.95rem]">
                          {item.title}
                        </span>
                        <span
                          className={
                            selected
                              ? "mt-auto pt-4 text-[11px] font-bold text-orange-200"
                              : "mt-auto pt-4 text-[11px] font-bold text-slate-500"
                          }
                        >
                          {item.pill}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          </Reveal>

          <Reveal delay={0.08} className="h-full">
            <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-[0_24px_50px_-28px_rgba(15,23,42,0.2)]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={phase.id}
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="flex h-full flex-col"
                >
                  <div className="bg-slate-900 p-6 text-white sm:p-7">
                    <div className="flex items-center gap-3">
                      <span className="flex size-11 items-center justify-center rounded-2xl bg-[#FF5722]">
                        <ActiveIcon className="size-5" aria-hidden />
                      </span>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange-300">
                          Stap {active + 1} van {PHASES.length}
                        </p>
                        <p className="mt-0.5 text-sm font-semibold text-slate-300">
                          {phase.kicker}
                        </p>
                      </div>
                    </div>
                    <h3 className="mt-5 text-xl font-extrabold tracking-tight sm:text-2xl">
                      {phase.title}
                    </h3>
                  </div>

                  <div className="flex flex-1 flex-col p-6 sm:p-7">
                    <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
                      {phase.body}
                    </p>
                    <p className="mt-5 inline-flex w-fit whitespace-nowrap rounded-full bg-slate-900 px-3.5 py-2 text-xs font-bold text-orange-200">
                      {phase.pill}
                    </p>
                    <p className="mt-auto pt-8 text-xs leading-relaxed text-slate-500">
                      Je koopt geen losse website. Je koopt een commercieel
                      systeem rond je rooster. Local Growth en Growth Partner
                      pakken vindbaarheid en Google Ads erbij.
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
