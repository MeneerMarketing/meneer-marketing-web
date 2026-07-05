"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { OFFICE_PILLARS } from "@/data/services-office";
import { HOME_MOBILE_ROUTE } from "@/data/home-mobile";

const PILLAR_ICON = Object.fromEntries(
  HOME_MOBILE_ROUTE.filter((s) => s.id !== "succes").map((s) => [s.id, s.icon]),
) as Record<string, (typeof HOME_MOBILE_ROUTE)[0]["icon"]>;

/** Vervangt het kantoor-scene op mobiel: snelle tap-to-pillar lijst. */
export function HomeMobileServices() {
  const reduce = useReducedMotion();

  return (
    <section
      id="services"
      aria-labelledby="mobile-services-heading"
      className="border-b border-slate-200 bg-slate-950 py-12"
    >
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF5722]">
          Diensten
        </p>
        <h2
          id="mobile-services-heading"
          className="mt-3 text-2xl font-extrabold tracking-tight text-white"
        >
          Vijf specialismen. Eén aanspreekpunt.
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          Tik door naar wat je nodig hebt. Direct naar de inhoud.
        </p>

        <ul className="mt-6 space-y-2.5">
          {OFFICE_PILLARS.map((pillar, index) => {
            const Icon = PILLAR_ICON[pillar.id]!;
            return (
              <motion.li
                key={pillar.id}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ delay: index * 0.04, duration: 0.3 }}
              >
                <Link
                  href={pillar.pillarHref}
                  className="group flex items-center gap-3.5 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 transition active:scale-[0.99] active:bg-white/[0.08]"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#FF5722]/15 text-[#FF5722]">
                    <Icon className="size-5" strokeWidth={2.2} aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-extrabold text-white">
                      {pillar.label}
                    </span>
                    <span className="mt-0.5 block text-xs leading-snug text-slate-400">
                      {pillar.title}
                    </span>
                  </span>
                  <ArrowUpRight
                    className="size-4 shrink-0 text-slate-500 transition group-active:text-[#FF5722]"
                    aria-hidden
                  />
                </Link>
              </motion.li>
            );
          })}
        </ul>

        <Link
          href="/diensten"
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-[#FF5722]"
        >
          Alle diensten bekijken
          <ArrowUpRight className="size-4" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
