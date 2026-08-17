"use client";

import { useState } from "react";
import { ArrowUpRight, Store, TrendingUp } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { Reveal } from "@/components/effects/Reveal";

const YOU_BEATS = [
  {
    title: "Studio & merk",
    text: "Reformers, ruimte, licht en het gevoel dat leden meteen herkennen.",
  },
  {
    title: "Instructors",
    text: "Mensen die het verschil maken op de mat.",
  },
  {
    title: "De ervaring",
    text: "Wat er gebeurt zodra iemand binnenloopt.",
  },
] as const;

const ME_BEATS = [
  {
    title: "Website",
    text: "High-end Pilates look die voelt als jouw studio.",
  },
  {
    title: "Lokale Google",
    text: "Gevonden worden op Pilates + jouw stad.",
  },
  {
    title: "Boekingsflow",
    text: "Van klik naar rooster. Zonder WhatsApp-chaos.",
  },
] as const;

export function PilatesStudioExperience() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<"you" | "me" | null>(null);

  return (
    <section
      className="relative overflow-hidden border-b border-slate-200 bg-white"
      aria-labelledby="pilates-experience-heading"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_at_top,_rgba(255,87,34,0.08),_transparent_60%)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF5722]">
              Duidelijke rolverdeling
            </p>
            <h2
              id="pilates-experience-heading"
              className="mt-3 text-3xl font-extrabold tracking-tight text-balance text-slate-900 sm:text-4xl lg:text-[2.85rem] lg:leading-[1.06]"
            >
              Jij runt de studio.
              <span className="text-[#FF5722]"> Ik regel digitaal.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Op de vloer is het al premium. Online moet datzelfde niveau
              landen. Hover over een kant. Dan zie je precies wie wat doet.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div
            className="relative mt-12 overflow-hidden rounded-[1.75rem] border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.08)] lg:mt-14"
            onMouseLeave={() => setActive(null)}
          >
            <div className="grid lg:grid-cols-2">
              {/* JIJ */}
              <motion.article
                className="relative flex min-h-[420px] flex-col bg-[#f7fafc] p-7 sm:p-9 lg:min-h-[480px] lg:p-10"
                onMouseEnter={() => setActive("you")}
                animate={
                  reduce
                    ? undefined
                    : {
                        backgroundColor:
                          active === "you"
                            ? "#ffffff"
                            : active === "me"
                              ? "#f1f5f9"
                              : "#f7fafc",
                      }
                }
                transition={{ duration: 0.35 }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-600">
                      Dit regel jij
                    </p>
                    <h3 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                      De ervaring op de vloer
                    </h3>
                  </div>
                  <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20">
                    <Store className="size-5" aria-hidden />
                  </span>
                </div>

                <ul className="mt-8 flex-1 space-y-4">
                  {YOU_BEATS.map((item, i) => (
                    <motion.li
                      key={item.title}
                      className="rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3.5 backdrop-blur-sm"
                      initial={false}
                      animate={
                        reduce
                          ? undefined
                          : {
                              y: active === "you" ? 0 : 2,
                              opacity: active === "me" ? 0.55 : 1,
                              borderColor:
                                active === "you"
                                  ? "rgba(16,185,129,0.35)"
                                  : "rgba(226,232,240,0.9)",
                            }
                      }
                      transition={{ delay: i * 0.04, duration: 0.3 }}
                    >
                      <p className="text-sm font-extrabold text-slate-900">
                        {item.title}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600">
                        {item.text}
                      </p>
                    </motion.li>
                  ))}
                </ul>

                <p className="mt-8 text-sm font-semibold text-slate-800">
                  Dat is waar jij het verschil maakt.
                </p>
              </motion.article>

              {/* IK */}
              <motion.article
                className="relative flex min-h-[420px] flex-col bg-slate-950 p-7 text-white sm:p-9 lg:min-h-[480px] lg:p-10"
                onMouseEnter={() => setActive("me")}
                animate={
                  reduce
                    ? undefined
                    : {
                        backgroundColor:
                          active === "me" ? "#0c1222" : "#020617",
                      }
                }
                transition={{ duration: 0.35 }}
              >
                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange-300">
                      Dit regel ik
                    </p>
                    <h3 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
                      Van Google naar je rooster
                    </h3>
                  </div>
                  <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#FF5722]/15 text-[#FF5722] ring-1 ring-[#FF5722]/30">
                    <TrendingUp className="size-5" aria-hidden />
                  </span>
                </div>

                <ul className="relative mt-8 flex-1 space-y-4">
                  {ME_BEATS.map((item, i) => (
                    <motion.li
                      key={item.title}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5"
                      initial={false}
                      animate={
                        reduce
                          ? undefined
                          : {
                              y: active === "me" ? 0 : 2,
                              opacity: active === "you" ? 0.45 : 1,
                              borderColor:
                                active === "me"
                                  ? "rgba(255,87,34,0.45)"
                                  : "rgba(255,255,255,0.1)",
                            }
                      }
                      transition={{ delay: i * 0.04, duration: 0.3 }}
                    >
                      <p className="text-sm font-extrabold text-white">
                        {item.title}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-slate-300">
                        {item.text}
                      </p>
                    </motion.li>
                  ))}
                </ul>

                <p className="relative mt-8 text-sm font-semibold text-orange-200">
                  Zodat zoekverkeer ook echt bij jou boekt.
                </p>
              </motion.article>
            </div>

            {/* Center seam badge */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 lg:block">
              <motion.div
                className="flex size-14 items-center justify-center rounded-full border-4 border-white bg-slate-900 text-[10px] font-extrabold uppercase tracking-[0.14em] text-white shadow-xl"
                animate={
                  reduce
                    ? undefined
                    : {
                        scale: active ? 1.08 : 1,
                        backgroundColor: active ? "#FF5722" : "#0f172a",
                      }
                }
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
              >
                {active ? "GO" : "×"}
              </motion.div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.14}>
          <div className="mt-5 flex flex-col items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-[#f3f7fb] px-5 py-4 sm:flex-row sm:items-center sm:px-6 sm:py-5">
            <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
              <span className="font-extrabold text-slate-900">Samen:</span> jij
              de studio, ik het systeem eromheen. Dan voelt boeken logisch.
            </p>
            <a
              href="#aanvraag"
              className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#FF5722]"
            >
              Start met jouw studio
              <ArrowUpRight
                className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden
              />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
