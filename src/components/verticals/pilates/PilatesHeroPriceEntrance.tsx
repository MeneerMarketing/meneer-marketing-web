"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ChevronDown, Receipt } from "lucide-react";
import { useState } from "react";

import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import { PILATES_VERTICAL } from "@/data/verticals/pilates";
import {
  formatVerticalMoney,
  getActiveLaunchPromo,
} from "@/lib/verticals/format-price";

const EASE = [0.22, 1, 0.36, 1] as const;
const launchPromo = getActiveLaunchPromo(PILATES_VERTICAL.pricing);

const DEAL_LINES = [
  { label: "Website in jouw branding", hint: "From scratch, op maat voor jou" },
  { label: "Lokale SEO", hint: "Pilates + jouw stad" },
  { label: "Hosting + domein", hint: "t.w.v. €25/m, zit erin" },
  { label: "Direct bij mij", hint: "6 dagen per week remote" },
] as const;

const PRICE_QUIPS = [
  "Goedkoper dan één gemiste proefles.",
  "Minder dan één lege reformer per maand.",
  "Wat je ziet is wat je betaalt. Echt.",
] as const;

export function PilatesHeroPriceEntrance() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [quipIndex, setQuipIndex] = useState(0);

  function cycleQuip() {
    setQuipIndex((i) => (i + 1) % PRICE_QUIPS.length);
  }

  return (
    <div className="relative mt-8">
      <article className="overflow-hidden rounded-[1.35rem] border border-slate-200 bg-white shadow-[0_28px_70px_-36px_rgba(15,23,42,0.22)] ring-1 ring-slate-900/[0.04]">
        {launchPromo ? (
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-orange-100 bg-gradient-to-r from-orange-50 to-white px-4 py-3 sm:px-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#C2410C]">
              Launch actie · start zonder eenmalige fee
            </p>
            <button
              type="button"
              onClick={cycleQuip}
              className="inline-flex items-center gap-2 rounded-full bg-[#FF5722] px-3.5 py-1.5 text-left shadow-[0_8px_20px_-8px_rgba(255,87,34,0.65)] transition hover:bg-orange-600"
              aria-label="Launch actie en volgende prijsvergelijking"
            >
              <span className="text-[10px] font-bold uppercase tracking-wide text-orange-50">
                Even gratis starten
              </span>
              <span className="font-mono text-[11px] font-bold text-white">
                <span className="text-orange-100/80 line-through">
                  {formatVerticalMoney(launchPromo.was)}
                </span>{" "}
                €0
              </span>
            </button>
          </div>
        ) : null}

        <button
          type="button"
          onClick={cycleQuip}
          className="flex w-full items-start gap-3 border-b border-dashed border-slate-200 px-4 py-4 text-left transition hover:bg-slate-50/80 sm:px-5"
          aria-label="Volgende prijsvergelijking"
        >
          <InteractiveLogo className="size-10 shrink-0" interactive={false} />
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-bold leading-snug text-slate-900">
              {PRICE_QUIPS[quipIndex]}
            </span>
            <span className="mt-1 block text-[11px] font-semibold text-slate-500">
              Tik voor de volgende. Ja, echt.
            </span>
          </span>
        </button>

        <div className="relative bg-[#FF5722] px-4 py-5 sm:px-5 sm:py-6">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            aria-hidden
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.35) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
          <div className="relative flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-orange-100">
                Alles-in-één · per maand
              </p>
              <p className="mt-1 flex items-baseline gap-1.5 font-black tracking-[-0.04em] text-white">
                <span className="text-[3.25rem] leading-none sm:text-[3.75rem]">
                  €89
                </span>
                <span className="text-xl font-bold text-orange-100">/m</span>
              </p>
              <p className="mt-1 text-xs font-semibold text-orange-100/90">
                ex. btw · maandelijks opzegbaar
              </p>
            </div>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3.5 py-2 text-[11px] font-bold text-white backdrop-blur-sm transition hover:bg-white/25"
              aria-expanded={open}
            >
              <Receipt className="size-3.5" aria-hidden />
              Wat zit erin?
              <motion.span
                animate={{ rotate: open ? 180 : 0 }}
                transition={{ duration: 0.25 }}
              >
                <ChevronDown className="size-3.5" aria-hidden />
              </motion.span>
            </button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {open ? (
            <motion.ul
              initial={reduce ? false : { height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={reduce ? undefined : { height: 0, opacity: 0 }}
              transition={{ duration: 0.32, ease: EASE }}
              className="overflow-hidden border-b border-slate-100 bg-slate-50/80 px-4 py-4 sm:px-5"
            >
              {DEAL_LINES.map((line, i) => (
                <motion.li
                  key={line.label}
                  initial={reduce ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 * i, duration: 0.28 }}
                  className="flex items-start gap-3 border-b border-slate-200/80 py-3 last:border-0 last:pb-0"
                >
                  <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-md bg-[#FF5722] text-[10px] font-black text-white">
                    ✓
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-slate-900">
                      {line.label}
                    </span>
                    <span className="block text-[11px] text-slate-500">
                      {line.hint}
                    </span>
                  </span>
                </motion.li>
              ))}
            </motion.ul>
          ) : null}
        </AnimatePresence>

        <p className="px-4 py-4 text-xs leading-relaxed text-slate-500 sm:px-5">
          {PILATES_VERTICAL.pricing.includedInfraNote} Onderhoud en kleine
          wijzigingen zitten erin.{" "}
          <Link
            href="#eerlijk-prijs"
            className="font-bold text-[#FF5722] underline decoration-[#FF5722]/30 underline-offset-2 hover:text-orange-600"
          >
            Het volledige bonnetje staat hier
          </Link>
          .
        </p>
      </article>
    </div>
  );
}
