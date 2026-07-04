"use client";

import { motion } from "framer-motion";
import { Braces, Code2 } from "lucide-react";
import { useHeroTilt } from "@/components/diensten/premium/useHeroTilt";

const EASE = [0.22, 1, 0.36, 1] as const;

const CODE_LINES = [
  { text: "<main>", color: "text-sky-400" },
  { text: "  <Hero />", color: "text-emerald-400" },
  { text: "  <Sections />", color: "text-amber-300" },
  { text: "</main>", color: "text-sky-400" },
] as const;

const BLOCKS = [
  { label: "Hero", rotate: -6, x: 8, y: 0, delay: 0.2 },
  { label: "CTA", rotate: 4, x: -4, y: 72, delay: 0.35 },
  { label: "Grid", rotate: -3, x: 12, y: 148, delay: 0.5 },
] as const;

/**
 * Code-editor + losse layout-blokken die in elkaar klikken. Geen browsermockup.
 */
export function HeroBuildWindow() {
  const { reduce, rotateX, rotateY, onMove, onLeave } = useHeroTilt();

  return (
    <div
      className="relative mx-auto h-[380px] w-full max-w-[440px] [perspective:1400px]"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF5722]/10 blur-3xl"
        aria-hidden
      />

      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative h-full"
      >
        {/* Terminal */}
        <motion.div
          initial={reduce ? undefined : { opacity: 0, x: -24, rotate: -8 }}
          whileInView={{ opacity: 1, x: 0, rotate: -6 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.65, ease: EASE }}
          className="absolute left-0 top-6 w-[52%] rounded-2xl border border-slate-700 bg-slate-900 p-4 shadow-2xl"
          style={{ transform: "translateZ(30px)" }}
        >
          <div className="mb-3 flex items-center gap-2">
            <Code2 className="size-3.5 text-slate-500" aria-hidden />
            <span className="font-mono text-[10px] text-slate-500">page.tsx</span>
          </div>
          <div className="space-y-1.5 font-mono text-[11px] leading-relaxed">
            {CODE_LINES.map((line, i) => (
              <motion.p
                key={line.text}
                initial={reduce ? undefined : { opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + i * 0.08, ease: EASE }}
                className={line.color}
              >
                {line.text}
              </motion.p>
            ))}
          </div>
          <motion.span
            animate={reduce ? undefined : { opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="mt-2 inline-block h-3 w-0.5 bg-emerald-400"
            aria-hidden
          />
        </motion.div>

        {/* Layout-blokken */}
        {BLOCKS.map((block) => (
          <motion.div
            key={block.label}
            initial={reduce ? undefined : { opacity: 0, y: 20, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ delay: block.delay, duration: 0.55, ease: EASE }}
            className="absolute right-0 w-[58%] rounded-2xl border border-slate-200 bg-white p-3 shadow-lg"
            style={{
              top: block.y,
              rotate: block.rotate,
              transform: `translateZ(${40 + block.y * 0.1}px)`,
            }}
          >
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
              {block.label}
            </p>
            {block.label === "Hero" ? (
              <div className="mt-2 space-y-2">
                <span className="block h-3 w-4/5 rounded-full bg-slate-900" aria-hidden />
                <span className="block h-2 w-1/2 rounded-full bg-slate-300" aria-hidden />
                <span className="mt-2 block h-7 w-24 rounded-full bg-[#FF5722]" aria-hidden />
              </div>
            ) : block.label === "CTA" ? (
              <div className="mt-2 flex gap-2">
                <span className="h-8 flex-1 rounded-full bg-[#FF5722]" aria-hidden />
                <span className="h-8 w-20 rounded-full border-2 border-slate-200" aria-hidden />
              </div>
            ) : (
              <div className="mt-2 grid grid-cols-3 gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="aspect-square rounded-lg bg-slate-100"
                    aria-hidden
                  />
                ))}
              </div>
            )}
          </motion.div>
        ))}

        <motion.div
          animate={reduce ? undefined : { y: [-4, 4] }}
          transition={{ duration: 2.8, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
          className="absolute -right-2 top-2 flex items-center gap-1.5 rounded-full border border-emerald-200 bg-white px-3 py-1.5 shadow-lg"
          style={{ transform: "translateZ(60px)" }}
        >
          <Braces className="size-3.5 text-emerald-500" aria-hidden />
          <span className="text-xs font-extrabold text-emerald-600">0 templates</span>
        </motion.div>

        <motion.div
          animate={reduce ? undefined : { y: [5, -5] }}
          transition={{ duration: 3.2, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
          className="absolute -left-3 bottom-8 rounded-2xl border border-slate-200 bg-slate-900 px-3 py-2 shadow-xl"
          style={{ transform: "translateZ(55px) rotate(-4deg)" }}
        >
          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Laadtijd</p>
          <p className="text-sm font-extrabold text-white">0,8 sec</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
