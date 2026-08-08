"use client";

import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useHeroTilt } from "@/components/diensten/premium/useHeroTilt";

const EASE = [0.22, 1, 0.36, 1] as const;

const CHANNELS = [
  { id: "leads", label: "Leads", short: "L", mult: 2.1, idle: 28, peak: 86 },
  { id: "conversie", label: "Conversie", short: "C", mult: 2.8, idle: 22, peak: 92 },
  { id: "verkeer", label: "Verkeer", short: "V", mult: 1.9, idle: 34, peak: 78 },
  { id: "ads", label: "Paid", short: "P", mult: 2.4, idle: 26, peak: 88 },
  { id: "auto", label: "Auto", short: "A", mult: 3.1, idle: 18, peak: 94 },
] as const;

type ChannelId = (typeof CHANNELS)[number]["id"];

/**
 * Schaal-op hero: equalizer + multiplier. Equalizer-visual in plaats van hub/spoke.
 * Tik een kanaal: die bar pompt omhoog, de rest zakt, ×-factor springt mee.
 */
export function HeroScaleWindow() {
  const reduce = useReducedMotion() ?? false;
  const { rotateX, rotateY, onMove, onLeave } = useHeroTilt(0.55);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [active, setActive] = useState<ChannelId>("conversie");
  const [pulse, setPulse] = useState(0);

  const current = CHANNELS.find((c) => c.id === active) ?? CHANNELS[1];

  useEffect(() => {
    if (!isInView || reduce) return;
    const id = window.setInterval(() => setPulse((p) => p + 1), 1600);
    return () => window.clearInterval(id);
  }, [isInView, reduce]);

  return (
    <div
      ref={ref}
      className="relative mx-auto h-[420px] w-full max-w-[440px] [perspective:1400px]"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div
        className="pointer-events-none absolute left-[18%] top-[12%] size-40 rounded-full bg-[#FF5722]/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-[10%] right-[8%] size-36 rounded-full bg-slate-300/25 blur-3xl"
        aria-hidden
      />

      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative flex h-full items-center justify-center"
      >
        <motion.div
          initial={reduce ? undefined : { opacity: 0, y: 22 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.55, ease: EASE }}
          className="relative w-full max-w-[360px] overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_24px_50px_-28px_rgba(15,23,42,0.35)]"
          style={{ transform: "translateZ(28px)" }}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Opschaalboard
              </p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={current.id}
                  initial={reduce ? false : { opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduce ? undefined : { opacity: 0, x: 8 }}
                  transition={{ duration: 0.22 }}
                  className="text-sm font-extrabold text-slate-900"
                >
                  Focus: {current.label}
                </motion.p>
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`mult-${current.id}`}
                initial={reduce ? false : { scale: 0.5, rotate: -12, opacity: 0 }}
                animate={{ scale: 1, rotate: -3, opacity: 1 }}
                exit={reduce ? undefined : { scale: 0.7, opacity: 0 }}
                transition={{ type: "spring", stiffness: 420, damping: 16 }}
                className="rounded-2xl border-2 border-slate-900 bg-[#FF5722] px-3 py-1.5 text-white shadow-[3px_3px_0_#0f172a]"
              >
                <p className="text-[9px] font-bold uppercase tracking-wider text-white/80">
                  Schaal
                </p>
                <p className="text-lg font-black leading-none tabular-nums">
                  ×{current.mult.toFixed(1)}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Equalizer stage */}
          <div className="relative px-4 pb-3 pt-5">
            <div
              className="pointer-events-none absolute inset-x-4 top-4 h-[180px] rounded-2xl bg-[linear-gradient(to_right,rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:18px_18px]"
              aria-hidden
            />

            <div className="relative flex h-[180px] items-end justify-between gap-2 px-1">
              {CHANNELS.map((ch, i) => {
                const on = active === ch.id;
                const base = on ? ch.peak : ch.idle;
                const wobble =
                  !reduce && on ? ((pulse + i) % 2 === 0 ? 6 : -4) : 0;
                const height = Math.max(12, Math.min(100, base + wobble));

                return (
                  <button
                    key={ch.id}
                    type="button"
                    aria-pressed={on}
                    aria-label={`Focus op ${ch.label}`}
                    onClick={() => setActive(ch.id)}
                    className="group flex h-full flex-1 flex-col items-center justify-end gap-2"
                  >
                    <div className="relative flex h-[148px] w-full items-end justify-center">
                      {on ? (
                        <motion.span
                          key={`spark-${ch.id}-${pulse}`}
                          initial={reduce ? false : { opacity: 0, y: 10, scale: 0.6 }}
                          animate={{ opacity: [0, 1, 0], y: [-4, -28], scale: 1 }}
                          transition={{ duration: 1.1, ease: EASE }}
                          className="pointer-events-none absolute top-2 rounded-full bg-[#FF5722] px-1.5 py-0.5 text-[9px] font-black text-white"
                        >
                          ↑
                        </motion.span>
                      ) : null}

                      <motion.div
                        layout
                        initial={reduce ? undefined : { height: "12%" }}
                        animate={{ height: `${height}%` }}
                        transition={
                          reduce
                            ? { duration: 0 }
                            : {
                                type: "spring",
                                stiffness: on ? 220 : 160,
                                damping: on ? 14 : 18,
                                delay: isInView ? i * 0.04 : 0,
                              }
                        }
                        className={`relative w-[78%] max-w-[44px] origin-bottom rounded-t-2xl rounded-b-md ${
                          on
                            ? "bg-gradient-to-t from-[#FF5722] to-[#FF8A65] shadow-lg shadow-orange-500/30"
                            : "bg-slate-200 group-hover:bg-slate-300"
                        }`}
                      >
                        {on ? (
                          <motion.div
                            aria-hidden
                            className="absolute inset-x-1 top-2 h-2 rounded-full bg-white/35"
                            animate={
                              reduce
                                ? undefined
                                : { opacity: [0.25, 0.7, 0.25], y: [0, 8, 0] }
                            }
                            transition={{
                              duration: 1.4,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          />
                        ) : null}
                      </motion.div>
                    </div>

                    <span
                      className={`text-[10px] font-bold tracking-tight transition-colors ${
                        on ? "text-[#FF5722]" : "text-slate-500 group-hover:text-slate-800"
                      }`}
                    >
                      <span className="sm:hidden">{ch.short}</span>
                      <span className="hidden sm:inline">{ch.label}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer readout */}
          <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/80 px-4 py-3">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Eén kanaal hard aanzetten
              </p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={`readout-${current.id}`}
                  initial={reduce ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -4 }}
                  className="truncate text-xs font-bold text-slate-800"
                >
                  Rest op onderhoud. Dit kwartaal: {current.label}.
                </motion.p>
              </AnimatePresence>
            </div>
            <motion.div
              key={`dot-${current.id}`}
              initial={reduce ? false : { scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 14 }}
              className="flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-slate-900 bg-white text-[11px] font-black text-slate-900"
              aria-hidden
            >
              1
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      <p className="pointer-events-none absolute inset-x-0 bottom-1 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
        Tik een balk · zie ’m opschalen
      </p>
    </div>
  );
}
