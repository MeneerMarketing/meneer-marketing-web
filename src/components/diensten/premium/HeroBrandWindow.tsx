"use client";

import { motion } from "framer-motion";
import { Palette, Type } from "lucide-react";
import { useHeroTilt } from "@/components/diensten/premium/useHeroTilt";

const EASE = [0.22, 1, 0.36, 1] as const;

const SWATCHES = [
  { color: "#FF5722", label: "Accent", rotate: -18, x: -70, y: -40, delay: 0.1 },
  { color: "#0F172A", label: "Primair", rotate: 8, x: 55, y: -55, delay: 0.2 },
  { color: "#F5F0EA", label: "Basis", rotate: -5, x: -85, y: 35, delay: 0.3, border: true },
  { color: "#0284c7", label: "Trust", rotate: 14, x: 75, y: 20, delay: 0.4 },
] as const;

const CHANNELS = ["Site", "Ads", "Mail", "Social"] as const;

/**
 * Moodboard: kleurstaaltjes, typo-kaart en kanaal-stickers als fysiek bord.
 */
export function HeroBrandWindow() {
  const { reduce, rotateX, rotateY, onMove, onLeave } = useHeroTilt(0.85);

  return (
    <div
      className="relative mx-auto h-[400px] w-full max-w-[440px] [perspective:1400px]"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-amber-200/15 blur-3xl"
        aria-hidden
      />

      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative flex h-full items-center justify-center"
      >
        {/* Moodboard achtergrond */}
        <motion.div
          initial={reduce ? undefined : { opacity: 0, rotate: -4, scale: 0.95 }}
          whileInView={{ opacity: 1, rotate: -2, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: EASE }}
          className="absolute size-64 rounded-[2rem] border border-slate-200/80 bg-[#FEFCFC] shadow-[0_24px_48px_-20px_rgba(15,23,42,0.2)]"
          style={{ transform: "translateZ(10px)" }}
        />

        {/* Logo-mark */}
        <motion.div
          initial={reduce ? undefined : { opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, ease: EASE }}
          className="absolute z-10 flex size-16 items-center justify-center rounded-2xl bg-[#FF5722] shadow-lg"
          style={{ transform: "translateZ(55px) rotate(-6deg)" }}
        >
          <span className="text-2xl font-extrabold text-white">M</span>
        </motion.div>

        {/* Kleurstaaltjes */}
        {SWATCHES.map((swatch) => (
          <motion.div
            key={swatch.label}
            initial={reduce ? undefined : { opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: swatch.delay, ease: EASE }}
            style={{
              x: swatch.x,
              y: swatch.y,
              rotate: swatch.rotate,
              transform: "translateZ(45px)",
            }}
            className="absolute flex flex-col items-center gap-1"
          >
            <span
              className={`size-12 rounded-full shadow-md ${"border" in swatch && swatch.border ? "border-2 border-slate-200" : ""}`}
              style={{ backgroundColor: swatch.color }}
              aria-hidden
            />
            <span className="rounded-full bg-white px-2 py-0.5 text-[8px] font-bold text-slate-600 shadow-sm">
              {swatch.label}
            </span>
          </motion.div>
        ))}

        {/* Typo-kaart */}
        <motion.div
          initial={reduce ? undefined : { opacity: 0, y: 20, rotate: 6 }}
          whileInView={{ opacity: 1, y: 0, rotate: 5 }}
          viewport={{ once: true }}
          transition={{ delay: 0.45, ease: EASE }}
          className="absolute bottom-16 right-4 w-32 rounded-xl border border-slate-200 bg-white p-3 shadow-lg"
          style={{ transform: "translateZ(60px)" }}
        >
          <Type className="size-3.5 text-slate-400" aria-hidden />
          <p className="mt-1 text-2xl font-extrabold leading-none tracking-tighter text-slate-900">
            Aa
          </p>
          <p className="mt-1 text-[9px] font-semibold text-slate-500">Display · Body</p>
        </motion.div>

        {/* Kanaal-stickers */}
        <motion.div
          initial={reduce ? undefined : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.55, ease: EASE }}
          className="absolute -bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5"
          style={{ transform: "translateZ(50px)" }}
        >
          {CHANNELS.map((ch, i) => (
            <motion.span
              key={ch}
              animate={reduce ? undefined : { y: [0, i % 2 === 0 ? -3 : 3, 0] }}
              transition={{ duration: 2 + i * 0.2, repeat: Infinity, ease: "easeInOut" }}
              className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[9px] font-bold text-slate-700 shadow-sm"
              style={{ rotate: i === 0 ? -6 : i === 3 ? 6 : 0 }}
            >
              {ch}
            </motion.span>
          ))}
        </motion.div>

        <motion.div
          animate={reduce ? undefined : { y: [-4, 4] }}
          transition={{ duration: 2.7, repeat: Infinity, repeatType: "mirror" }}
          className="absolute -right-1 top-6 flex items-center gap-1.5 rounded-2xl border border-amber-200 bg-white px-3 py-2 shadow-lg"
          style={{ transform: "translateZ(65px)" }}
        >
          <Palette className="size-3.5 text-[#FF5722]" aria-hidden />
          <span className="text-[10px] font-bold text-slate-800">Overal hetzelfde</span>
        </motion.div>

        <motion.div
          animate={reduce ? undefined : { y: [4, -4] }}
          transition={{ duration: 3.1, repeat: Infinity, repeatType: "mirror" }}
          className="absolute -left-3 top-1/2 rounded-2xl border border-slate-800 bg-slate-900 px-3 py-2 shadow-xl"
          style={{ transform: "translateZ(58px) rotate(-3deg)" }}
        >
          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Positionering</p>
          <p className="text-xs font-extrabold text-white">Herkenbaar</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
