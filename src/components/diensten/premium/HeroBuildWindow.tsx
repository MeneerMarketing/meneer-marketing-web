"use client";

import { motion } from "framer-motion";
import { Braces, Code2 } from "lucide-react";
import { useHeroTilt } from "@/components/diensten/premium/useHeroTilt";

const EASE = [0.22, 1, 0.36, 1] as const;

const CODE_LINES = [
  { text: "<main>", color: "text-sky-400" },
  { text: "  <Hero />", color: "text-emerald-400" },
  { text: "  <Sections />", color: "text-amber-300" },
  { text: "  <Footer />", color: "text-violet-400" },
  { text: "</main>", color: "text-sky-400" },
] as const;

const BLOCKS = [
  { label: "Hero", rotate: -6, x: 8, y: 0, delay: 0.2 },
  { label: "CTA", rotate: 4, x: -4, y: 72, delay: 0.35 },
  { label: "Grid", rotate: -3, x: 12, y: 148, delay: 0.5 },
] as const;

const BUILD_LOG = [
  { text: "✓ Compiled in 847ms", color: "text-emerald-400" },
  { text: "✓ 12 routes · SSG", color: "text-slate-400" },
] as const;

const STACK_CHIPS = ["Next.js", "React", "TypeScript", "Tailwind"] as const;

/**
 * Code-editor + losse layout-blokken die in elkaar klikken. Geen browsermockup.
 */
export function HeroBuildWindow() {
  const { reduce, rotateX, rotateY, onMove, onLeave } = useHeroTilt();

  return (
    <div
      className="relative mx-auto h-[420px] w-full max-w-[440px] [perspective:1400px]"
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

        {/* Build output onder terminal */}
        <motion.div
          initial={reduce ? undefined : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ delay: 0.55, duration: 0.5, ease: EASE }}
          className="absolute left-0 top-[11.5rem] w-[48%] rounded-xl border border-slate-700/80 bg-slate-800/95 px-3 py-2.5 shadow-xl"
          style={{ transform: "translateZ(25px) rotate(-5deg)" }}
        >
          <p className="font-mono text-[9px] font-bold uppercase tracking-wider text-slate-500">
            Build
          </p>
          <div className="mt-1.5 space-y-1 font-mono text-[10px]">
            {BUILD_LOG.map((line, i) => (
              <motion.p
                key={line.text}
                initial={reduce ? undefined : { opacity: 0, x: -6 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.65 + i * 0.1, ease: EASE }}
                className={line.color}
              >
                {line.text}
              </motion.p>
            ))}
          </div>
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

        {/* Footer-blok onder grid */}
        <motion.div
          initial={reduce ? undefined : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ delay: 0.62, duration: 0.5, ease: EASE }}
          className="absolute right-2 top-[15.5rem] w-[52%] rounded-2xl border border-slate-200 bg-white p-3 shadow-md"
          style={{ transform: "translateZ(35px) rotate(2deg)" }}
        >
          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
            Footer
          </p>
          <div className="mt-2 flex items-center justify-between gap-2 border-t border-slate-100 pt-2">
            <span className="h-2 w-8 rounded-full bg-slate-200" aria-hidden />
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="size-2 rounded-full bg-slate-200"
                  aria-hidden
                />
              ))}
            </div>
            <span className="h-2 w-10 rounded-full bg-slate-100" aria-hidden />
          </div>
        </motion.div>

        {/* Stack-chips onderaan, gecentreerd */}
        <motion.div
          initial={reduce ? undefined : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.72, duration: 0.45, ease: EASE }}
          className="absolute inset-x-3 bottom-14 flex flex-wrap justify-center gap-2"
          style={{ transform: "translateZ(45px)" }}
        >
          {STACK_CHIPS.map((chip, i) => (
            <motion.span
              key={chip}
              animate={reduce ? undefined : { y: [0, i % 2 === 0 ? -2 : 2, 0] }}
              transition={{
                duration: 2.6 + i * 0.25,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              }}
              className="rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-[10px] font-semibold tracking-tight text-slate-600 shadow-sm backdrop-blur"
            >
              {chip}
            </motion.span>
          ))}
        </motion.div>

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
          className="absolute -left-3 bottom-4 rounded-2xl border border-slate-200 bg-slate-900 px-3 py-2 shadow-xl"
          style={{ transform: "translateZ(55px) rotate(-4deg)" }}
        >
          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Laadtijd</p>
          <p className="text-sm font-extrabold text-white">0,8 sec</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
