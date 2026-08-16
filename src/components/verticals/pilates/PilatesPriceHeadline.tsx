"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

import { PILATES_VERTICAL } from "@/data/verticals/pilates";
import type { VerticalPackageId } from "@/data/verticals/types";
import { getPilatesPackageMonthlyAmount } from "@/lib/verticals/pilates-receipt";
import { trackPilatesEvent } from "@/lib/verticals/analytics";
import { PRICE_EXCL_BTW_LABEL } from "@/lib/verticals/vat";

const ROTATING = ["betaalt", "krijgt", "snapt"] as const;
const LONGEST = ROTATING.reduce((a, b) => (b.length > a.length ? b : a));

const TICKER = [
  "Website in jouw branding",
  "Lokale SEO",
  "Hosting inbegrepen",
  "Domeinnaam inbegrepen",
  "Klein onderhoud",
  "6 dagen per week remote",
  "Maandelijks opzegbaar",
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;
const PACKAGES = PILATES_VERTICAL.pricing.packages;

interface PilatesPriceHeadlineProps {
  headingId: string;
  selectedPackage: VerticalPackageId;
  onPackageChange: (packageId: VerticalPackageId) => void;
}

export function PilatesPriceHeadline({
  headingId,
  selectedPackage,
  onPackageChange,
}: PilatesPriceHeadlineProps) {
  const reduce = useReducedMotion();
  const [wordIndex, setWordIndex] = useState(0);
  const amount = getPilatesPackageMonthlyAmount(selectedPackage);
  const digits = String(amount).split("");

  useEffect(() => {
    if (reduce) return;
    const timer = window.setInterval(() => {
      setWordIndex((i) => (i + 1) % ROTATING.length);
    }, 2800);
    return () => window.clearInterval(timer);
  }, [reduce]);

  function pickPackage(packageId: VerticalPackageId) {
    if (packageId === selectedPackage) return;
    onPackageChange(packageId);
    sessionStorage.setItem("lge-interest", packageId);
    trackPilatesEvent("pilates_package_select", {
      location: "why_price_headline",
      package: packageId,
    });
  }

  return (
    <div className="relative overflow-visible pr-1 sm:pr-2">
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF5722]">
          Eerlijk over de prijs
        </p>
        <span className="h-px flex-1 bg-gradient-to-r from-[#FF5722]/40 to-transparent" />
      </div>

      <div
        className="mt-5 flex flex-wrap gap-2"
        role="radiogroup"
        aria-label="Kies je pakket"
      >
        {PACKAGES.map((pkg) => {
          const selected = pkg.id === selectedPackage;
          const pkgAmount =
            pkg.monthly.unit === "eur_cents"
              ? pkg.monthly.amount / 100
              : pkg.monthly.amount;

          return (
            <button
              key={pkg.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => pickPackage(pkg.id)}
              className={
                selected
                  ? "relative inline-flex flex-col items-start rounded-2xl border-2 border-[#FF5722] bg-white px-4 py-3 text-left shadow-[0_12px_32px_-20px_rgba(255,87,34,0.55)] ring-1 ring-[#FF5722]/20 transition"
                  : "relative inline-flex flex-col items-start rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-left transition hover:border-slate-300 hover:bg-white"
              }
            >
              {pkg.recommended ? (
                <span className="mb-1 rounded-full bg-[#FF5722] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                  Meest gekozen
                </span>
              ) : null}
              <span
                className={
                  selected
                    ? "text-sm font-extrabold tracking-tight text-slate-900"
                    : "text-sm font-bold tracking-tight text-slate-800"
                }
              >
                {pkg.name}
              </span>
              <span
                className={
                  selected
                    ? "mt-0.5 font-mono text-base font-black text-[#FF5722]"
                    : "mt-0.5 font-mono text-sm font-bold text-slate-600"
                }
              >
                €{pkgAmount}
                <span className="text-[11px] font-semibold text-slate-400">
                  /m {PRICE_EXCL_BTW_LABEL}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <h2 id={headingId} className="mt-8 overflow-visible">
        <span className="sr-only">
          {amount} euro per maand excl. btw, alles inbegrepen. Wat je ziet is
          wat je betaalt.
        </span>

        <span
          className="flex flex-wrap items-end gap-x-5 gap-y-3 overflow-visible"
          aria-hidden
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={amount}
              className="inline-flex items-end overflow-visible pr-2 text-[4.75rem] font-black leading-none tracking-[-0.03em] text-slate-950 sm:pr-3 sm:text-[7rem] lg:text-[8.5rem]"
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -14 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <span className="mr-1 self-start translate-y-1 text-[0.36em] leading-none text-[#FF5722] sm:translate-y-2">
                €
              </span>

              {digits.map((digit, i) => (
                <span
                  key={`${amount}-${digit}-${i}`}
                  className="inline-block min-w-[0.52em] overflow-visible text-center leading-none"
                >
                  {digit}
                </span>
              ))}
            </motion.span>
          </AnimatePresence>

          <span className="mb-2 flex flex-col sm:mb-3">
            <span className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-2xl">
              per maand
            </span>
            <span className="mt-1.5 h-1.5 w-full rounded-full bg-[#FF5722]" />
            <span className="mt-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Alles inbegrepen · {PRICE_EXCL_BTW_LABEL}
            </span>
          </span>
        </span>

        <span
          className="mt-5 block text-[1.45rem] font-extrabold leading-tight tracking-tight text-slate-900 sm:text-[2rem]"
          aria-hidden
        >
          Wat je ziet is wat je{" "}
          <span className="relative inline-grid align-baseline">
            <span className="invisible col-start-1 row-start-1">{LONGEST}</span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={ROTATING[wordIndex]}
                className="col-start-1 row-start-1 text-left text-[#FF5722]"
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                {ROTATING[wordIndex]}
              </motion.span>
            </AnimatePresence>
          </span>
        </span>
      </h2>

      <div
        className="relative mt-8 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/70 py-3 backdrop-blur-sm"
        aria-hidden
      >
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-white/90 to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-white/90 to-transparent"
          aria-hidden
        />
        <motion.div
          className="flex w-max gap-8 whitespace-nowrap"
          animate={reduce ? undefined : { x: ["0%", "-50%"] }}
          transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
          style={{ willChange: "transform" }}
        >
          {[...TICKER, ...TICKER].map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500"
            >
              <span className="size-1.5 rounded-full bg-[#FF5722]" aria-hidden />
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
