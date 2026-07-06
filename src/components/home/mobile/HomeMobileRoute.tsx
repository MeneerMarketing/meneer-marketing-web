"use client";

import Link from "next/link";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import { HOME_MOBILE_ROUTE } from "@/data/home-mobile";
import { siteCtas } from "@/lib/cta";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Verticale routekaart met timeline, Meneer-marker en geanimeerde panels. */
export function HomeMobileRoute() {
  const reduce = useReducedMotion();
  const [openId, setOpenId] = useState<string>(HOME_MOBILE_ROUTE[0]!.id);

  const openIndex = useMemo(
    () => HOME_MOBILE_ROUTE.findIndex((s) => s.id === openId),
    [openId],
  );

  const progressPct =
    openIndex >= 0
      ? ((openIndex + 1) / HOME_MOBILE_ROUTE.length) * 100
      : 0;

  return (
    <section
      aria-labelledby="mobile-route-heading"
      className="overflow-x-clip border-b border-slate-200 bg-white py-12"
    >
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#FF5722]">
          De ideale route
        </p>
        <h2
          id="mobile-route-heading"
          className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900"
        >
          Zo groei je online, in volgorde.
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Tik op een stop. Meneer laat zien waar je zit op de route.
        </p>

        <div className="relative mt-8 pl-2">
          <div
            className="pointer-events-none absolute bottom-4 left-[1.35rem] top-4 w-0.5 overflow-hidden rounded-full bg-slate-200"
            aria-hidden
          >
            <motion.div
              className="h-full w-full origin-top bg-gradient-to-b from-[#FF5722] to-[#FF5722]/35"
              initial={false}
              animate={{ scaleY: progressPct / 100 }}
              transition={{ type: "spring", stiffness: 220, damping: 28 }}
            />
          </div>

          <ol className="relative space-y-3">
            {HOME_MOBILE_ROUTE.map((step, index) => {
              const isOpen = openId === step.id;
              const Icon = step.icon;
              return (
                <motion.li
                  key={step.id}
                  layout={!reduce}
                  initial={reduce ? false : { opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.04, duration: 0.35 }}
                  className="relative pl-10"
                >
                  <div className="absolute left-0 top-3.5 z-10">
                    {isOpen ? (
                      <motion.div
                        layoutId={reduce ? undefined : "mobile-route-meneer"}
                        className="relative -ml-1.5"
                        transition={{ type: "spring", stiffness: 380, damping: 28 }}
                      >
                        <InteractiveLogo className="size-9 drop-shadow-md" />
                      </motion.div>
                    ) : (
                      <motion.span
                        className="flex size-9 items-center justify-center rounded-xl text-sm font-black text-white shadow-sm"
                        style={{ backgroundColor: step.accent }}
                        animate={
                          reduce
                            ? undefined
                            : isOpen
                              ? { scale: [1, 1.06, 1] }
                              : undefined
                        }
                        transition={{ duration: 0.35 }}
                      >
                        {index + 1}
                      </motion.span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setOpenId(step.id)}
                    aria-expanded={isOpen}
                    className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition ${
                      isOpen
                        ? "border-[#FF5722]/30 bg-orange-50/50 shadow-sm"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
                        <Icon className="size-4 shrink-0 opacity-70" aria-hidden />
                        {step.label}
                      </span>
                    </span>
                    <ChevronDown
                      className={`size-4 shrink-0 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                      aria-hidden
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        key={`panel-${step.id}`}
                        initial={reduce ? false : { opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                        exit={reduce ? undefined : { opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.28, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3.5">
                          <p className="text-sm leading-relaxed text-slate-600">{step.hook}</p>
                          <Link
                            href={step.href}
                            className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-[#FF5722]"
                          >
                            Meer over {step.label.toLowerCase()}
                            <ArrowUpRight className="size-3.5" aria-hidden />
                          </Link>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </motion.li>
              );
            })}
          </ol>
        </div>

        <motion.div whileTap={reduce ? undefined : { scale: 0.98 }}>
          <Link
            href={siteCtas.startIntake.href}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-bold text-white shadow-lg"
          >
            Start met een gesprek
            <ArrowUpRight className="size-4" aria-hidden />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
