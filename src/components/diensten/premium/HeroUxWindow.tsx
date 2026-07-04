"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import type { MouseEvent as ReactMouseEvent } from "react";
import { useHeroTilt } from "@/components/diensten/premium/useHeroTilt";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Zwevende UI-lagen die op muisbeweging verschuiven: nav, hero, CTA, kaarten.
 * Geen browsermockup.
 */
export function HeroUxWindow() {
  const { reduce, rotateX, rotateY, onMove, onLeave } = useHeroTilt(0.6);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const navX = useTransform(mx, [-0.5, 0.5], [-8, 8]);
  const heroX = useTransform(mx, [-0.5, 0.5], [-14, 14]);
  const heroY = useTransform(my, [-0.5, 0.5], [-6, 6]);
  const ctaX = useTransform(mx, [-0.5, 0.5], [-20, 20]);
  const ctaY = useTransform(my, [-0.5, 0.5], [-10, 10]);
  const cardX = useTransform(mx, [-0.5, 0.5], [-24, 24]);
  const cardY = useTransform(my, [-0.5, 0.5], [8, -8]);

  function handleMove(e: ReactMouseEvent<HTMLDivElement>) {
    onMove(e);
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleLeave() {
    onLeave();
    mx.set(0);
    my.set(0);
  }

  return (
    <div
      className="relative mx-auto h-[400px] w-full max-w-[440px] [perspective:1600px]"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-sky-200/20 blur-3xl"
        aria-hidden
      />

      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative h-full w-full"
      >
        {/* Achtergrond grid */}
        <div
          className="absolute inset-4 rounded-[2rem] border border-dashed border-slate-200/80 bg-slate-50/50"
          aria-hidden
        />

        {/* Nav-laag */}
        <motion.div
          style={{ x: reduce ? 0 : navX, transform: "translateZ(20px)" }}
          initial={reduce ? undefined : { opacity: 0, y: -16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
          className="absolute left-10 right-10 top-10 flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 shadow-sm backdrop-blur"
        >
          <span className="size-7 rounded-xl bg-slate-900" aria-hidden />
          <span className="h-2 w-14 rounded-full bg-slate-200" aria-hidden />
          <span className="h-2 w-10 rounded-full bg-slate-100" aria-hidden />
          <span className="ml-auto h-7 w-16 rounded-full bg-slate-100" aria-hidden />
        </motion.div>

        {/* Hero-tekstlaag */}
        <motion.div
          style={{
            x: reduce ? 0 : heroX,
            y: reduce ? 0 : heroY,
            transform: "translateZ(45px)",
          }}
          initial={reduce ? undefined : { opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.55, ease: EASE }}
          className="absolute left-10 top-28 w-[55%] space-y-2.5 rounded-2xl border border-slate-100 bg-white p-4 shadow-md"
        >
          <span className="block h-3.5 w-full rounded-full bg-slate-900" aria-hidden />
          <span className="block h-3 w-4/5 rounded-full bg-slate-900" aria-hidden />
          <span className="block h-2 w-3/5 rounded-full bg-slate-300" aria-hidden />
        </motion.div>

        {/* Beeldlaag */}
        <motion.div
          style={{
            x: reduce ? 0 : heroX,
            y: reduce ? 0 : heroY,
            transform: "translateZ(35px) rotate(3deg)",
          }}
          initial={reduce ? undefined : { opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.55, ease: EASE }}
          className="absolute right-8 top-24 h-28 w-[38%] rounded-2xl bg-gradient-to-br from-slate-200 to-slate-100 shadow-inner"
          aria-hidden
        />

        {/* CTA-laag (verschuift het meest) */}
        <motion.div
          style={{
            x: reduce ? 0 : ctaX,
            y: reduce ? 0 : ctaY,
            transform: "translateZ(70px)",
          }}
          initial={reduce ? undefined : { opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35, duration: 0.5, ease: EASE }}
          className="absolute left-10 top-[11.5rem] h-10 w-36 rounded-full bg-[#FF5722] shadow-[0_12px_28px_-8px_rgba(255,87,34,0.55)]"
          aria-hidden
        />

        {/* Feature-kaarten */}
        <div className="absolute bottom-10 left-8 right-8 flex gap-3">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              style={{
                x: reduce ? 0 : cardX,
                y: reduce ? 0 : cardY,
                transform: `translateZ(${50 + i * 12}px) rotate(${i === 0 ? -4 : i === 2 ? 4 : 0}deg)`,
              }}
              initial={reduce ? undefined : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + i * 0.08, ease: EASE }}
              className="flex-1 space-y-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg"
            >
              <span className="block h-8 rounded-xl bg-slate-100" aria-hidden />
              <span className="block h-1.5 w-4/5 rounded-full bg-slate-200" aria-hidden />
            </motion.div>
          ))}
        </div>

        <motion.span
          animate={reduce ? undefined : { y: [-4, 4] }}
          transition={{ duration: 2.6, repeat: Infinity, repeatType: "mirror" }}
          className="absolute -right-1 top-20 rounded-xl border border-[#FF5722]/30 bg-white px-3 py-1.5 text-[10px] font-bold text-[#FF5722] shadow-lg"
          style={{ transform: "translateZ(80px)" }}
        >
          Primaire actie
        </motion.span>

        <motion.span
          animate={reduce ? undefined : { y: [4, -4] }}
          transition={{ duration: 3, repeat: Infinity, repeatType: "mirror" }}
          className="absolute -left-2 bottom-24 rounded-xl border border-slate-200 bg-slate-900 px-3 py-1.5 text-[10px] font-bold text-white shadow-lg"
          style={{ transform: "translateZ(75px)" }}
        >
          Verschuift per laag
        </motion.span>
      </motion.div>
    </div>
  );
}
