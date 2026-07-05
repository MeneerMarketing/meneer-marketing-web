"use client";

import Link from "next/link";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { HOME_MOBILE_ROUTE } from "@/data/home-mobile";
import { siteCtas } from "@/lib/cta";

/** Verticale routekaart: één stap open, geen horizontale scroll. */
export function HomeMobileRoute() {
  const reduce = useReducedMotion();
  const [openId, setOpenId] = useState<string>(HOME_MOBILE_ROUTE[0]!.id);

  return (
    <section
      aria-labelledby="mobile-route-heading"
      className="border-b border-slate-200 bg-white py-12"
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
          Geen losse projecten. Eén lijn van plan tot campagnes en behoud.
        </p>

        <ol className="mt-6 space-y-2">
          {HOME_MOBILE_ROUTE.map((step, index) => {
            const isOpen = openId === step.id;
            const Icon = step.icon;
            return (
              <motion.li
                key={step.id}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.03 }}
              >
                <button
                  type="button"
                  onClick={() => setOpenId(step.id)}
                  aria-expanded={isOpen}
                  className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition ${
                    isOpen
                      ? "border-slate-300 bg-slate-50 shadow-sm"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <span
                    className="flex size-9 shrink-0 items-center justify-center rounded-xl text-sm font-black text-white"
                    style={{ backgroundColor: step.accent }}
                  >
                    {index + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
                      <Icon className="size-4 shrink-0 opacity-70" aria-hidden />
                      {step.label}
                    </span>
                  </span>
                  <ChevronDown
                    className={`size-4 shrink-0 text-slate-400 transition ${isOpen ? "rotate-180" : ""}`}
                    aria-hidden
                  />
                </button>

                {isOpen ? (
                  <div className="mt-2 rounded-2xl border border-slate-200 bg-white px-4 py-3.5">
                    <p className="text-sm leading-relaxed text-slate-600">{step.hook}</p>
                    <Link
                      href={step.href}
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-[#FF5722]"
                    >
                      Meer over {step.label.toLowerCase()}
                      <ArrowUpRight className="size-3.5" aria-hidden />
                    </Link>
                  </div>
                ) : null}
              </motion.li>
            );
          })}
        </ol>

        <Link
          href={siteCtas.startIntake.href}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-bold text-white transition active:scale-[0.98]"
        >
          Start met een gesprek
          <ArrowUpRight className="size-4" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
