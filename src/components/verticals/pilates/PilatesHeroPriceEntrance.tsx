"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

import { PILATES_VERTICAL } from "@/data/verticals/pilates";
import {
  formatVerticalMoney,
  getActiveLaunchPromo,
} from "@/lib/verticals/format-price";

const EASE = [0.22, 1, 0.36, 1] as const;
const monthly = formatVerticalMoney(PILATES_VERTICAL.pricing.packages[0]!.monthly);
const launchPromo = getActiveLaunchPromo(PILATES_VERTICAL.pricing);

export function PilatesHeroPriceEntrance() {
  const reduce = useReducedMotion();

  return (
    <div className="relative mt-7 overflow-visible">
      <div className="flex flex-wrap items-end gap-3 sm:gap-4">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16, rotate: -2 }}
          animate={{ opacity: 1, y: 0, rotate: -0.8 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="relative"
        >
          <span
            className="pointer-events-none absolute -right-2 -top-3 rotate-6 rounded-sm border border-[#FF5722]/35 bg-[#FF5722]/15 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-orange-200"
            aria-hidden
          >
            Studio edition
          </span>
          <p className="text-[3.25rem] font-black leading-[0.9] tracking-[-0.04em] text-white sm:text-[4rem]">
            <span className="text-[#FF5722]">€</span>89
            <span className="ml-1 text-base font-bold text-slate-400 sm:text-lg">
              /m
            </span>
          </p>
          <p className="mt-1 text-[11px] font-semibold text-slate-400">
            Alles erin. Wat je ziet is wat je betaalt. Prijs ex. btw.
          </p>
        </motion.div>

        {launchPromo ? (
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.92, rotate: 4 }}
            animate={{ opacity: 1, scale: 1, rotate: 2.2 }}
            transition={{ duration: 0.45, delay: 0.08, ease: EASE }}
            className="rounded-sm border-2 border-dashed border-orange-400/35 bg-orange-500/10 px-3 py-2 font-mono text-[11px] leading-tight text-orange-100"
          >
            <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-orange-300/90">
              Launch
            </span>
            <span className="text-slate-500 line-through">
              {formatVerticalMoney(launchPromo.was)}
            </span>{" "}
            <span className="font-bold text-[#FF5722]">€0</span>
          </motion.div>
        ) : null}

        <motion.p
          initial={reduce ? false : { opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.12, ease: EASE }}
          className="mb-1 rotate-[-1deg] text-[11px] font-extrabold uppercase tracking-[0.12em] text-emerald-300"
        >
          Maandelijks opzegbaar
        </motion.p>
      </div>

      <motion.p
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.16, ease: EASE }}
        className="mt-4 max-w-lg text-sm leading-relaxed text-slate-400"
      >
        {PILATES_VERTICAL.pricing.includedInfraNote}{" "}
        Onderhoud, kleine wijzigingen en 6 dagen per week remote bereikbaar.{" "}
        <Link
          href="#eerlijk-prijs"
          className="font-bold text-orange-200 underline decoration-orange-200/30 underline-offset-2 hover:text-white"
        >
          Het bonnetje staat hier →
        </Link>
      </motion.p>

      <ul className="mt-4 flex flex-wrap gap-2">
        {[
          "Website in jouw branding",
          "Lokale SEO",
          "Hosting + domein",
          "Direct contact met mij",
        ].map((pill, i) => (
          <motion.li
            key={pill}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 + i * 0.04, ease: EASE }}
            className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-300"
          >
            {pill}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
