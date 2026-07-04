"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { useHeroTilt } from "@/components/diensten/premium/useHeroTilt";

const EASE = [0.22, 1, 0.36, 1] as const;
const SPRING = { type: "spring" as const, stiffness: 300, damping: 26 };

type Phase = "scatter" | "snap" | "hold";

const PALETTE = ["#FF5722", "#0F172A", "#F5F0EA", "#0284C7"] as const;
const CHANNELS = ["Site", "Google", "Meta", "Mail"] as const;

/** Losse posities in de scatter-fase. */
const SCATTER = {
  logo: { x: -92, y: -78, rotate: -16 },
  bars: [
    { x: 96, y: -62, rotate: 12 },
    { x: -82, y: 14, rotate: -9 },
    { x: 88, y: 38, rotate: 14 },
  ],
  dots: [
    { x: -108, y: 92 },
    { x: -42, y: 112 },
    { x: 44, y: 98 },
    { x: 106, y: 82 },
  ],
  channels: [
    { x: -98, y: -22, rotate: -6 },
    { x: -34, y: -112, rotate: 8 },
    { x: 38, y: -116, rotate: -5 },
    { x: 102, y: -28, rotate: 10 },
  ],
} as const;

/**
 * Gesnapte lockup via flex (perfect uitgelijnd).
 * Scatter-elementen animeren hier naartoe en vervagen; lockup fadet in.
 */
function BrandLockup({ pulse }: { pulse: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.45, ease: EASE }}
      className="absolute inset-0 flex flex-col items-center justify-center gap-4"
    >
      {/* Logo + wordmark */}
      <div className="flex items-center gap-2.5">
        <motion.div
          animate={pulse ? { scale: [1, 1.05, 1] } : { scale: 1 }}
          transition={{ duration: 1.8, repeat: pulse ? Infinity : 0, ease: "easeInOut" }}
          className="flex size-[3.25rem] shrink-0 items-center justify-center rounded-2xl bg-[#FF5722] shadow-[0_12px_28px_-8px_rgba(255,87,34,0.65)]"
        >
          <span className="text-2xl font-extrabold text-white">M</span>
        </motion.div>
        <div className="flex flex-col gap-1.5">
          <span className="block h-2.5 w-[4.5rem] rounded-full bg-slate-900" aria-hidden />
          <span className="block h-2 w-[3.25rem] rounded-full bg-slate-900" aria-hidden />
          <span className="block h-1.5 w-[2.5rem] rounded-full bg-slate-900" aria-hidden />
        </div>
      </div>

      {/* Kleuren */}
      <div className="flex items-center gap-3">
        {PALETTE.map((hex) => (
          <span
            key={hex}
            className="size-5 shrink-0 rounded-full border border-white/80 shadow-sm"
            style={{
              backgroundColor: hex,
              boxShadow:
                hex === "#F5F0EA"
                  ? "inset 0 0 0 1px rgba(15,23,42,0.12)"
                  : undefined,
            }}
            aria-hidden
          />
        ))}
      </div>

      {/* Kanalen: vaste breedte zodat pills nooit overlappen */}
      <div className="flex items-center gap-1.5">
        {CHANNELS.map((label) => (
          <span
            key={label}
            className="inline-flex w-10 shrink-0 items-center justify-center rounded-full border border-[#FF5722]/45 bg-white/95 px-0 py-0.5 text-[8px] font-bold uppercase tracking-wide text-slate-900 shadow-sm"
          >
            {label}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

/**
 * Merk-magnet: losse stukken zweven, klikken in één flex-lockup.
 */
export function HeroBrandWindow() {
  const reduce = useReducedMotion() ?? false;
  const { rotateX, rotateY, onMove, onLeave } = useHeroTilt(0.55);
  const [phase, setPhase] = useState<Phase>(reduce ? "hold" : "scatter");

  useEffect(() => {
    if (reduce) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = (current: Phase) => {
      if (cancelled) return;
      const upcoming: Phase =
        current === "scatter"
          ? "snap"
          : current === "snap"
            ? "hold"
            : current === "hold"
              ? "scatter"
              : "scatter";

      timer = setTimeout(() => {
        if (cancelled) return;
        setPhase(upcoming);
        tick(upcoming);
      }, current === "scatter" ? 2400 : current === "snap" ? 650 : current === "hold" ? 2200 : 400);
    };

    tick("scatter");
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [reduce]);

  const locked = phase === "snap" || phase === "hold";
  const showScatter = phase === "scatter" || phase === "snap";

  return (
    <div
      className="relative mx-auto flex h-[420px] w-full max-w-[440px] flex-col items-center justify-center [perspective:1500px]"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative flex w-full flex-col items-center"
      >
        <p className="mb-4 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
          Merk-magnet
        </p>

        <motion.div
          initial={reduce ? undefined : { opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="relative flex size-[300px] items-center justify-center"
          style={{ transform: "translateZ(32px)" }}
        >
          <motion.div
            animate={
              reduce
                ? undefined
                : locked
                  ? { scale: [1, 1.02, 1], opacity: [0.88, 1, 0.88] }
                  : { scale: 1, opacity: 0.78 }
            }
            transition={
              locked
                ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
                : { duration: 0.4 }
            }
            className="absolute inset-0 rounded-[42%] bg-gradient-to-br from-[#FF5722]/[0.12] via-slate-100/80 to-slate-900/[0.06]"
            aria-hidden
          />
          <div
            className="absolute inset-[10%] rounded-[38%] border border-dashed border-slate-300/50"
            aria-hidden
          />

          <motion.div
            animate={
              reduce || !locked
                ? { opacity: 0, scale: 0.6 }
                : { opacity: [0, 0.32, 0], scale: [0.65, 1.12, 1.3] }
            }
            transition={{ duration: 0.85, ease: EASE }}
            className="absolute inset-[18%] rounded-full border-2 border-[#FF5722]/30"
            aria-hidden
          />

          {/* Perfecte lockup (flex) */}
          <AnimatePresence>
            {locked || reduce ? (
              <BrandLockup key="lockup" pulse={locked && !reduce} />
            ) : null}
          </AnimatePresence>

          {/* Scatter-stukken */}
          <AnimatePresence>
            {showScatter && !reduce ? (
              <motion.div
                key="scatter-layer"
                initial={{ opacity: 1 }}
                animate={{ opacity: phase === "snap" ? 0 : 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="absolute inset-0"
              >
                <motion.div
                  animate={{
                    x: SCATTER.logo.x,
                    y: SCATTER.logo.y,
                    rotate: SCATTER.logo.rotate,
                  }}
                  transition={SPRING}
                  className="absolute left-1/2 top-1/2 z-20 flex size-[3.25rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-[#FF5722] opacity-90 shadow-[0_12px_28px_-8px_rgba(255,87,34,0.55)]"
                >
                  <span className="text-2xl font-extrabold text-white">M</span>
                </motion.div>

                {(
                  [
                    { w: "w-[4.5rem]", h: "h-2.5", ...SCATTER.bars[0] },
                    { w: "w-[3.25rem]", h: "h-2", ...SCATTER.bars[1] },
                    { w: "w-[2.5rem]", h: "h-1.5", ...SCATTER.bars[2] },
                  ] as const
                ).map((bar, i) => (
                  <motion.span
                    key={i}
                    animate={{ x: bar.x, y: bar.y, rotate: bar.rotate }}
                    transition={SPRING}
                    className={`absolute left-1/2 top-1/2 block ${bar.w} ${bar.h} -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-900 opacity-50`}
                    aria-hidden
                  />
                ))}

                {PALETTE.map((hex, i) => (
                  <motion.span
                    key={hex}
                    animate={{ x: SCATTER.dots[i].x, y: SCATTER.dots[i].y }}
                    transition={SPRING}
                    className="absolute left-1/2 top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/80 opacity-80 shadow-sm"
                    style={{ backgroundColor: hex }}
                    aria-hidden
                  />
                ))}

                {CHANNELS.map((label, i) => (
                  <motion.span
                    key={label}
                    animate={{
                      x: SCATTER.channels[i].x,
                      y: SCATTER.channels[i].y,
                      rotate: SCATTER.channels[i].rotate,
                    }}
                    transition={SPRING}
                    className="absolute left-1/2 top-1/2 inline-flex w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200/90 bg-slate-50/80 py-0.5 text-[8px] font-bold uppercase tracking-wide text-slate-400"
                  >
                    {label}
                  </motion.span>
                ))}
              </motion.div>
            ) : null}
          </AnimatePresence>

          {phase === "snap" && !reduce ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: [0, 0.45, 0], scale: [0.85, 1.15, 1.35] }}
              transition={{ duration: 0.55, ease: EASE }}
              className="pointer-events-none absolute inset-[22%] rounded-full bg-[#FF5722]/15"
              aria-hidden
            />
          ) : null}
        </motion.div>

        <motion.p
          animate={{ opacity: locked || reduce ? 1 : 0.65 }}
          transition={{ duration: 0.35 }}
          className="mt-2 whitespace-nowrap text-center text-[10px] font-medium text-slate-500"
        >
          {locked || reduce
            ? "Eén merk. Overal herkenbaar."
            : "Losse onderdelen. Nog geen systeem."}
        </motion.p>
      </motion.div>
    </div>
  );
}
