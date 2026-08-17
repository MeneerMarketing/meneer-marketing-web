"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { HUIDKLINIEKEN_VERTICAL } from "@/data/verticals/huidklinieken";
import type { VerticalPackageId } from "@/data/verticals/types";
import {
  formatVerticalMoney,
  getActiveLaunchPromo,
} from "@/lib/verticals/format-price";
import {
  getHuidkliniekPackageById,
  getHuidkliniekReceiptLines,
} from "@/lib/verticals/huidkliniek-receipt";

const EASE = [0.22, 1, 0.36, 1] as const;

interface HuidkliniekClinicReceiptProps {
  packageId: VerticalPackageId;
}

function ReceiptTearEdge({ flip }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 420 14"
      preserveAspectRatio="none"
      className={`block h-3.5 w-full text-[#f3f0e8] ${flip ? "rotate-180" : ""}`}
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M0,7 Q5,0 10,7 T20,7 T30,7 T40,7 T50,7 T60,7 T70,7 T80,7 T90,7 T100,7 T110,7 T120,7 T130,7 T140,7 T150,7 T160,7 T170,7 T180,7 T190,7 T200,7 T210,7 T220,7 T230,7 T240,7 T250,7 T260,7 T270,7 T280,7 T290,7 T300,7 T310,7 T320,7 T330,7 T340,7 T350,7 T360,7 T370,7 T380,7 T390,7 T400,7 T410,7 L420,14 L0,14 Z"
      />
    </svg>
  );
}

function FakeBarcode() {
  const bars = [
    2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 1, 4, 2, 1, 3, 2,
    1, 2, 4, 1, 3, 1, 2, 1, 3, 2, 4, 1, 2, 1, 3, 1, 2, 3, 1, 4, 2, 1,
  ];

  return (
    <div className="mt-5 flex flex-col items-center gap-2" aria-hidden>
      <div className="flex h-10 items-end justify-center gap-[2px] opacity-80">
        {bars.map((w, i) => (
          <span
            key={i}
            className="block bg-slate-800"
            style={{ width: `${w}px`, height: i % 5 === 0 ? "100%" : "78%" }}
          />
        ))}
      </div>
      <p className="font-mono text-[9px] tracking-[0.35em] text-slate-500">
        MM · CLINIC · 089 · NL
      </p>
    </div>
  );
}

export function HuidkliniekClinicReceipt({
  packageId,
}: HuidkliniekClinicReceiptProps) {
  const reduce = useReducedMotion();
  const pkg = getHuidkliniekPackageById(packageId);
  const items = getHuidkliniekReceiptLines(packageId);
  const monthlyExcl = formatVerticalMoney(pkg.monthly);
  const launchPromo = getActiveLaunchPromo(HUIDKLINIEKEN_VERTICAL.pricing);
  const receiptId = `MM-CLINIC-${getHuidkliniekPackageMonthlyAmountSuffix(packageId)}`;
  const today = new Date().toLocaleDateString("nl-NL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className="relative mx-auto w-full max-w-md">
      <motion.div
        layout
        initial={reduce ? false : { opacity: 0, y: 28, rotate: 1.1 }}
        animate={{ opacity: 1, y: 0, rotate: 0.55 }}
        transition={{ duration: 0.55, ease: EASE }}
        className="relative"
      >
        <div
          className="pointer-events-none absolute -left-3 top-8 z-20 hidden -rotate-3 sm:block"
          aria-hidden
        >
          <div className="rounded-sm border-2 border-[#FF5722]/40 bg-[#FF5722]/10 px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-widest text-[#FF5722] shadow-sm backdrop-blur-sm">
            Betaald
            <span className="mt-0.5 block text-[8px] font-semibold tracking-[0.2em] text-[#FF5722]/70">
              met vertrouwen
            </span>
          </div>
        </div>

        <motion.article
          layout
          className="relative overflow-visible rounded-sm bg-[#fffef9] shadow-[0_22px_50px_-28px_rgba(15,23,42,0.35),0_8px_0_0_rgba(15,23,42,0.04)] ring-1 ring-slate-900/5"
          aria-label={`${pkg.name} bonnetje, ${monthlyExcl} ex. btw per maand`}
        >
          <ReceiptTearEdge />

          <div
            className="border-b border-dashed border-slate-300/80 px-6 py-5 text-center"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(15,23,42,0.015) 3px, rgba(15,23,42,0.015) 4px)",
            }}
          >
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-slate-500">
              Meneer Marketing
            </p>
            <AnimatePresence mode="wait">
              <motion.p
                key={pkg.name}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: EASE }}
                className="mt-2 text-lg font-extrabold uppercase tracking-[0.12em] text-slate-900"
              >
                {pkg.name}
              </motion.p>
            </AnimatePresence>
            <p className="mt-1 font-mono text-[10px] text-slate-500">
              #{receiptId} · {today}
            </p>
            <p className="mt-3 text-xs leading-relaxed text-slate-600">
              Fiscaal verantwoord
              <span className="text-slate-400">*</span>
              <br />
              <span className="text-[11px] text-slate-400">
                * omdat alles op het bonnetje staat. Revolutie, ik weet het.
              </span>
            </p>
          </div>

          <motion.div layout className="space-y-0 px-5 py-4 sm:px-6">
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.div
                  key={item.name}
                  layout
                  initial={reduce ? false : { opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={reduce ? undefined : { opacity: 0, height: 0 }}
                  transition={{ duration: 0.28, ease: EASE }}
                  className="overflow-hidden border-b border-dotted border-slate-300/90 py-3 last:border-b-0"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-bold tracking-tight text-slate-900">
                        {item.name}
                      </p>
                      <p className="mt-0.5 text-[11px] leading-snug text-slate-500">
                        {item.detail}
                      </p>
                    </div>
                    <div className="shrink-0 text-right font-mono text-xs">
                      {item.was ? (
                        <span className="block text-[10px] text-slate-400 line-through">
                          {item.was}
                        </span>
                      ) : null}
                      <span className="font-bold text-emerald-700">INCL.</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <div className="border-b border-dotted border-slate-300/90 py-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold text-slate-500">
                  Verrassingen achteraf
                </p>
                <p className="font-mono text-sm font-bold text-slate-400">
                  € 0,00
                </p>
              </div>
              <p className="mt-0.5 text-[10px] italic text-slate-400">
                (ik haat kleine lettertjes ook)
              </p>
            </div>

            {launchPromo ? (
              <div className="border-b border-dotted border-slate-300/90 py-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold text-slate-600">
                    Launch eenmalig
                  </p>
                  <p className="font-mono text-sm">
                    <span className="text-slate-400 line-through">
                      {formatVerticalMoney(launchPromo.was)}
                    </span>{" "}
                    <span className="font-bold text-[#FF5722]">€ 0</span>
                  </p>
                </div>
              </div>
            ) : null}

            <div className="border-b border-dashed border-slate-400 py-4">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                    Totaal / maand
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    ex. btw · maandelijks opzegbaar
                  </p>
                </div>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={monthlyExcl}
                    initial={reduce ? false : { opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reduce ? undefined : { opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.25, ease: EASE }}
                    className="font-mono text-4xl font-black tracking-tight text-[#FF5722]"
                  >
                    {monthlyExcl}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          <div className="px-6 pb-5 pt-1 text-center">
            <p className="text-xs leading-relaxed text-slate-600">
              Bedankt voor je vertrouwen.
              <span className="mt-1 block text-[11px] text-slate-400">
                Niet geldig bij behandelingen op rekening of dubbele espresso&apos;s.
              </span>
            </p>
            <FakeBarcode />
          </div>

          <ReceiptTearEdge flip />
        </motion.article>

        <p
          className="pointer-events-none absolute -bottom-2 left-1/2 h-4 w-[92%] -translate-x-1/2 rounded-[100%] bg-slate-900/10 blur-md"
          aria-hidden
        />
      </motion.div>

      <p className="mt-6 text-center text-xs text-slate-500">
        Tik een pakket hierboven. De bon groeit mee. Alle bedragen ex. btw.
      </p>
    </div>
  );
}

function getHuidkliniekPackageMonthlyAmountSuffix(
  packageId: VerticalPackageId,
): string {
  switch (packageId) {
    case "local-growth":
      return "179";
    case "growth-partner":
      return "399";
    default:
      return "089";
  }
}
