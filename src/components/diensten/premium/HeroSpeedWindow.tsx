"use client";

import { motion } from "framer-motion";
import { useHeroTilt } from "@/components/diensten/premium/useHeroTilt";

const EASE = [0.22, 1, 0.36, 1] as const;

const METRICS = [
  { label: "LCP", value: "0,9s", angle: -55 },
  { label: "INP", value: "98ms", angle: 0 },
  { label: "CLS", value: "0,02", angle: 55 },
] as const;

/**
 * Halve speedometer met naald en orbiterende metric-labels. Geen dashboard-blok.
 */
export function HeroSpeedWindow() {
  const { reduce, rotateX, rotateY, onMove, onLeave } = useHeroTilt(0.8);

  return (
    <div
      className="relative mx-auto h-[380px] w-full max-w-[440px] [perspective:1400px]"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 size-56 -translate-x-1/2 rounded-full bg-emerald-400/15 blur-3xl"
        aria-hidden
      />

      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative flex h-full flex-col items-center justify-center"
      >
        {/* Ping-ringen */}
        {[1, 2, 3].map((ring) => (
          <motion.span
            key={ring}
            animate={reduce ? undefined : { scale: [0.6, 1.4], opacity: [0.5, 0] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: ring * 0.6,
              ease: "easeOut",
            }}
            className="pointer-events-none absolute size-40 rounded-full border border-emerald-400/30"
            aria-hidden
          />
        ))}

        {/* Gauge SVG */}
        <motion.div
          initial={reduce ? undefined : { opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="relative"
          style={{ transform: "translateZ(40px)" }}
        >
          <svg width="260" height="150" viewBox="0 0 260 150" aria-hidden>
            <path
              d="M 30 130 A 100 100 0 0 1 230 130"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <motion.path
              d="M 30 130 A 100 100 0 0 1 230 130"
              fill="none"
              stroke="url(#speedGrad)"
              strokeWidth="14"
              strokeLinecap="round"
              initial={reduce ? undefined : { pathLength: 0 }}
              whileInView={{ pathLength: 0.88 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: EASE, delay: 0.2 }}
            />
            <defs>
              <linearGradient id="speedGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
            <motion.g
              initial={reduce ? undefined : { rotate: -90 }}
              whileInView={{ rotate: 12 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: EASE, delay: 0.4 }}
              style={{ transformOrigin: "130px 130px" }}
            >
              <line
                x1="130"
                y1="130"
                x2="130"
                y2="48"
                stroke="#0f172a"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="130" cy="130" r="8" fill="#0f172a" />
            </motion.g>
          </svg>

          <div className="absolute inset-x-0 bottom-2 text-center">
            <p className="text-4xl font-extrabold tracking-tighter text-emerald-500">94</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              PageSpeed
            </p>
          </div>
        </motion.div>

        {/* Metric-orbit labels */}
        <div className="relative mt-2 flex w-full max-w-xs justify-between px-4">
          {METRICS.map((m, i) => (
            <motion.div
              key={m.label}
              initial={reduce ? undefined : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + i * 0.1, ease: EASE }}
              className="rounded-2xl border border-emerald-200/80 bg-white px-3 py-2 text-center shadow-md"
              style={{ transform: `translateZ(${20 + i * 8}px) rotate(${m.angle * 0.05}deg)` }}
            >
              <motion.p
                animate={reduce ? undefined : { y: [0, i === 1 ? -4 : 4, 0] }}
                transition={{ duration: 2 + i * 0.3, repeat: Infinity, ease: "easeInOut" }}
                className="text-[9px] font-bold uppercase tracking-wider text-slate-400"
              >
                {m.label}
              </motion.p>
              <p className="text-sm font-extrabold text-emerald-600">{m.value}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          animate={reduce ? undefined : { y: [-3, 3] }}
          transition={{ duration: 2.8, repeat: Infinity, repeatType: "mirror" }}
          className="absolute right-2 top-12 rounded-2xl border border-[#FF5722]/25 bg-white px-3 py-2 shadow-lg"
          style={{ transform: "translateZ(50px)" }}
        >
          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Prioriteit</p>
          <p className="text-xs font-extrabold text-[#FF5722]">Omzet-pagina</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
