"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import Link from "next/link";
import { ChevronDown, Receipt, Sparkles } from "lucide-react";
import { useRef, useState, type PointerEvent } from "react";

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
  const cardRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [quipIndex, setQuipIndex] = useState(0);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [4, -4]), {
    stiffness: 180,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-5, 5]), {
    stiffness: 180,
    damping: 22,
  });

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    if (reduce || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function handlePointerLeave() {
    pointerX.set(0);
    pointerY.set(0);
  }

  function cycleQuip() {
    setQuipIndex((i) => (i + 1) % PRICE_QUIPS.length);
  }

  return (
    <div className="relative mt-8 overflow-visible">
      <motion.article
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        initial={reduce ? false : { opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: EASE }}
        style={
          reduce
            ? undefined
            : {
                rotateX,
                rotateY,
                transformPerspective: 900,
                willChange: "transform",
              }
        }
        className="relative overflow-visible rounded-[1.35rem] border-2 border-[#FF5722]/25 bg-[#141a28] p-5 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.7)] sm:p-6"
      >
        {launchPromo ? (
          <motion.button
            type="button"
            onClick={cycleQuip}
            initial={reduce ? false : { scale: 0.92, rotate: -3 }}
            animate={{ scale: 1, rotate: -2 }}
            whileHover={reduce ? undefined : { rotate: 0, scale: 1.03 }}
            className="absolute right-1 top-2 z-20 cursor-pointer rounded-full bg-[#FF5722] px-3.5 py-2 text-left shadow-[0_8px_24px_-6px_rgba(255,87,34,0.8)] ring-2 ring-white/20 sm:right-2 sm:top-1"
            aria-label="Launch actie: start nu zonder eenmalige fee"
          >
            <span className="block text-[9px] font-bold uppercase tracking-[0.14em] text-orange-100">
              Even gratis starten
            </span>
            <span className="mt-0.5 block font-mono text-[11px] leading-none text-white">
              <span className="text-orange-200/80 line-through">
                {formatVerticalMoney(launchPromo.was)}
              </span>{" "}
              <span className="text-base font-black">€0</span>
            </span>
          </motion.button>
        ) : null}

        <div className="relative flex items-start gap-3">
          <InteractiveLogo className="size-10 shrink-0" interactive={false} />
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold leading-snug text-white">
              {PRICE_QUIPS[quipIndex]}
            </p>
            <p className="mt-1 text-[11px] text-slate-400">
              Tik op het oranje badge voor de volgende. Ja, echt.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="group relative mt-5 w-full text-left"
          aria-expanded={open}
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-300/90">
                Alles-in-één · per maand
              </p>
              <p className="mt-1 flex items-baseline gap-1 font-black tracking-[-0.04em] text-white">
                <span className="text-[3.5rem] leading-none text-[#FF5722] sm:text-[4.25rem]">
                  €89
                </span>
                <span className="text-lg font-bold text-slate-400">/m</span>
              </p>
              <p className="mt-1 text-xs font-semibold text-slate-400">
                ex. btw · maandelijks opzegbaar
              </p>
            </div>

            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-[11px] font-bold text-slate-200 transition group-hover:border-[#FF5722]/40 group-hover:text-white">
              <Receipt className="size-3.5 text-[#FF5722]" aria-hidden />
              Wat zit erin?
              <motion.span
                animate={{ rotate: open ? 180 : 0 }}
                transition={{ duration: 0.25 }}
              >
                <ChevronDown className="size-3.5" aria-hidden />
              </motion.span>
            </span>
          </div>
        </button>

        <AnimatePresence initial={false}>
          {open ? (
            <motion.ul
              initial={reduce ? false : { height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={reduce ? undefined : { height: 0, opacity: 0 }}
              transition={{ duration: 0.32, ease: EASE }}
              className="relative mt-4 overflow-hidden border-t border-dashed border-white/15 pt-4"
            >
              {DEAL_LINES.map((line, i) => (
                <motion.li
                  key={line.label}
                  initial={reduce ? false : { opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i, duration: 0.28 }}
                  className="mb-3 flex items-start gap-3 last:mb-0"
                >
                  <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-lg bg-[#FF5722]/15 text-[#FF5722]">
                    <Sparkles className="size-3" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-white">
                      {line.label}
                    </span>
                    <span className="block text-[11px] text-slate-400">
                      {line.hint}
                    </span>
                  </span>
                  <span className="ml-auto shrink-0 font-mono text-[10px] font-bold text-emerald-400">
                    INCL.
                  </span>
                </motion.li>
              ))}
              <li className="mt-3 flex items-center justify-between rounded-xl bg-emerald-500/10 px-3 py-2 text-[11px] font-bold text-emerald-300">
                Maandelijks opzegbaar
                <span className="font-mono text-emerald-200/80">Echt.</span>
              </li>
            </motion.ul>
          ) : null}
        </AnimatePresence>

        <p className="relative mt-4 text-xs leading-relaxed text-slate-400">
          {PILATES_VERTICAL.pricing.includedInfraNote} Onderhoud en kleine
          wijzigingen zitten erin.{" "}
          <Link
            href="#eerlijk-prijs"
            className="font-bold text-orange-200 underline decoration-orange-200/35 underline-offset-2 hover:text-white"
          >
            Het volledige bonnetje staat hier
          </Link>
          .
        </p>
      </motion.article>
    </div>
  );
}
