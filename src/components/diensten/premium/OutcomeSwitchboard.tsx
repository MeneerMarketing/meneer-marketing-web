"use client";

import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { CheckCircle2, Clock, KeyRound, Lock, LockOpen } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import type { DienstPremiumOutcome } from "@/data/dienst-premium";

/* ------------------------------------------------------------------ */
/* Meter 1: snelheidsmeter die van rood naar groen zwiept             */
/* ------------------------------------------------------------------ */

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, r: number, from: number, to: number) {
  const start = polar(cx, cy, r, from);
  const end = polar(cx, cy, r, to);
  const large = to - from > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y}`;
}

function SpeedReadout({ on }: { on: boolean }) {
  const reduce = useReducedMotion();

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <svg viewBox="0 0 120 74" className="w-full max-w-[150px]" aria-hidden>
        <path
          d={arcPath(60, 62, 44, -78, -28)}
          fill="none"
          stroke="#fca5a5"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d={arcPath(60, 62, 44, -22, 22)}
          fill="none"
          stroke="#fcd34d"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d={arcPath(60, 62, 44, 28, 78)}
          fill="none"
          stroke="#6ee7b7"
          strokeWidth="7"
          strokeLinecap="round"
        />
        {/* Naald */}
        <motion.g
          animate={{ rotate: on ? 56 : -56 }}
          transition={
            reduce
              ? { duration: 0 }
              : { type: "spring", stiffness: 60, damping: 10 }
          }
          style={{ transformBox: "view-box", transformOrigin: "60px 62px" }}
        >
          <line
            x1="60"
            y1="62"
            x2="60"
            y2="26"
            stroke="#0F172A"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </motion.g>
        <circle cx="60" cy="62" r="5" fill="#0F172A" />
        <circle cx="60" cy="62" r="1.8" fill="#fff" />
      </svg>
      <AnimatePresence mode="wait">
        <motion.p
          key={on ? "fast" : "slow"}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className={`-mt-1 text-sm font-black tracking-tight ${
            on ? "text-emerald-500" : "text-red-400"
          }`}
        >
          {on ? "0,8 sec" : "4,2 sec…"}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Meter 2: wachten op de bouwer vs. zelf gedaan                      */
/* ------------------------------------------------------------------ */

const TASKS = ["Tekst aangepast", "Foto vervangen", "Pagina live"] as const;

function SelfServeReadout({ on }: { on: boolean }) {
  const reduce = useReducedMotion();

  return (
    <div className="flex h-full flex-col items-center justify-center px-2">
      <AnimatePresence mode="wait">
        {on ? (
          <motion.ul
            key="done"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-[190px] space-y-1.5"
          >
            {TASKS.map((task, i) => (
              <motion.li
                key={task}
                initial={reduce ? { opacity: 0 } : { opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 320,
                  damping: 22,
                  delay: reduce ? 0 : 0.1 + i * 0.14,
                }}
                className="flex items-center gap-2 rounded-lg border border-emerald-200/80 bg-emerald-50/70 px-2.5 py-1.5 text-[11px] font-bold text-slate-800"
              >
                <CheckCircle2 className="size-3.5 shrink-0 text-emerald-500" aria-hidden />
                {task}
                <span className="ml-auto text-[9px] font-black uppercase tracking-wider text-emerald-500">
                  zelf
                </span>
              </motion.li>
            ))}
          </motion.ul>
        ) : (
          <motion.div
            key="waiting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-[190px]"
          >
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-[11px] font-bold text-slate-500">
              <Clock className="size-3.5 shrink-0" aria-hidden />
              <span>
                Mailtje naar de bouwer
                {[0, 1, 2].map((d) => (
                  <motion.span
                    key={d}
                    animate={reduce ? undefined : { opacity: [0.2, 1, 0.2] }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      delay: d * 0.2,
                    }}
                  >
                    .
                  </motion.span>
                ))}
              </span>
            </div>
            <p className="mt-2 text-center text-[10px] font-semibold text-slate-400">
              nog geen reactie (dag 3)
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Meter 3: de sleutel schuift van de bouwer naar jou                 */
/* ------------------------------------------------------------------ */

function OwnershipReadout({ on }: { on: boolean }) {
  const reduce = useReducedMotion();

  return (
    <div className="flex h-full flex-col items-center justify-center px-3">
      <div className="w-full max-w-[190px]">
        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider">
          <span className={on ? "text-slate-300" : "text-slate-600"}>
            bouwer
          </span>
          <span className={on ? "text-[#FF5722]" : "text-slate-300"}>jij</span>
        </div>
        <div className="relative mt-2 h-9">
          {/* Rail */}
          <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-slate-200" />
          <motion.div
            className="absolute left-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-[#FF5722]"
            animate={{ width: on ? "100%" : "8%" }}
            transition={
              reduce
                ? { duration: 0 }
                : { type: "spring", stiffness: 90, damping: 16 }
            }
          />
          {/* De sleutel */}
          <motion.div
            className={`absolute top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border-2 bg-white shadow-md ${
              on ? "border-[#FF5722] text-[#FF5722]" : "border-slate-300 text-slate-400"
            }`}
            animate={{
              left: on ? "calc(100% - 36px)" : "0px",
              rotate: on ? 360 : 0,
            }}
            transition={
              reduce
                ? { duration: 0 }
                : { type: "spring", stiffness: 80, damping: 15 }
            }
          >
            <KeyRound className="size-4" aria-hidden />
          </motion.div>
        </div>
        <div className="mt-2 flex items-center justify-center gap-1.5 text-[10px] font-bold text-slate-500">
          <AnimatePresence mode="wait">
            <motion.span
              key={on ? "open" : "locked"}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="inline-flex items-center gap-1.5"
            >
              {on ? (
                <>
                  <LockOpen className="size-3 text-emerald-500" aria-hidden />
                  code, content en toegangen: 100% van jou
                </>
              ) : (
                <>
                  <Lock className="size-3 text-slate-400" aria-hidden />
                  alles staat op naam van de bouwer
                </>
              )}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Het schakelbord                                                     */
/* ------------------------------------------------------------------ */

const READOUTS = [SpeedReadout, SelfServeReadout, OwnershipReadout] as const;

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onClick}
      className={`flex h-7 w-[52px] shrink-0 cursor-pointer rounded-full p-1 transition-colors duration-300 ${
        on ? "justify-end bg-[#FF5722]" : "justify-start bg-slate-300"
      }`}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 550, damping: 32 }}
        className="size-5 rounded-full bg-white shadow-[0_1px_3px_rgba(15,23,42,0.35)]"
      />
      <span className="sr-only">{on ? "Zet uit" : "Zet aan"}</span>
    </button>
  );
}

/**
 * Resultaten als speels schakelbord: per resultaat een schakelaar die het
 * verschil toont tussen zonder (traag, wachten, vendor lock-in) en met.
 * De schakelaars klikken zichzelf om zodra het bord in beeld komt; daarna
 * mag jij spelen.
 */
export function OutcomeSwitchboard({
  outcomes,
}: {
  outcomes: DienstPremiumOutcome[];
}) {
  const reduce = useReducedMotion();
  const boardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(boardRef, { once: true, margin: "-120px" });
  const [states, setStates] = useState<boolean[]>(() =>
    outcomes.map(() => false),
  );
  const touched = useRef(false);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setStates(outcomes.map(() => true));
      return;
    }
    const timers = outcomes.map((_, i) =>
      window.setTimeout(
        () => {
          if (!touched.current) {
            setStates((prev) => prev.map((v, j) => (j === i ? true : v)));
          }
        },
        700 + i * 550,
      ),
    );
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [inView, reduce, outcomes]);

  function toggle(index: number) {
    touched.current = true;
    setStates((prev) => prev.map((v, i) => (i === index ? !v : v)));
  }

  return (
    <div
      ref={boardRef}
      className="relative mt-7 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_56px_-32px_rgba(15,23,42,0.28)]"
    >
      {/* Subtiel raster + gloed */}
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(rgba(15,23,42,0.05) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-[#FF5722]/10 blur-3xl"
        aria-hidden
      />

      {/* Kop van het bord */}
      <div className="relative flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-3.5 sm:px-7">
        <div className="flex items-center gap-2.5">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-70" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
            Resultatenmonitor
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <p className="hidden text-[11px] font-bold text-slate-400 sm:block">
            Zet de schakelaars gerust zelf om
          </p>
          <InteractiveLogo className="h-8 w-8" />
        </div>
      </div>

      {/* De drie modules */}
      <div className="relative grid divide-y divide-slate-100 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
        {outcomes.map((outcome, index) => {
          const Readout = READOUTS[index % READOUTS.length];
          const on = states[index];
          return (
            <motion.div
              key={outcome.title}
              initial={reduce ? undefined : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col p-5 sm:p-6"
            >
              {/* Meterkast */}
              <div
                className={`h-[130px] rounded-2xl border transition-colors duration-500 ${
                  on
                    ? "border-[#FF5722]/25 bg-gradient-to-b from-[#FF5722]/[0.05] to-white"
                    : "border-slate-100 bg-slate-50/70"
                }`}
              >
                <Readout on={on} />
              </div>

              {/* Schakelaar + zonder/met */}
              <div className="mt-4 flex items-center gap-3">
                <Toggle on={on} onClick={() => toggle(index)} />
                <span
                  className={`text-[10px] font-black uppercase tracking-[0.14em] transition-colors ${
                    on ? "text-[#FF5722]" : "text-slate-400"
                  }`}
                >
                  {on ? "Met Meneer" : "Zonder"}
                </span>
              </div>

              <h3 className="mt-3 text-base font-extrabold tracking-tight text-slate-900">
                {outcome.title}
              </h3>
              <p className="mt-1.5 flex-1 text-sm leading-relaxed text-slate-600">
                {outcome.detail}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
