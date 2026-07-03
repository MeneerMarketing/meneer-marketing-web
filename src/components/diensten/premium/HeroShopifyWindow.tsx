"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import type { MouseEvent as ReactMouseEvent } from "react";
import { ShoppingBag } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

function buildIn(delay: number, reduce: boolean) {
  if (reduce) return {};
  return {
    initial: { opacity: 0, y: 14, scale: 0.96 },
    whileInView: { opacity: 1, y: 0, scale: 1 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.55, delay, ease: EASE },
  };
}

/**
 * Decoratief Shopify-storefront venster: productgrid bouwt zich op, met
 * zwevende badges (custom theme, SKU's, snelheid). Zelfde tilt als build-hero.
 */
export function HeroShopifyWindow() {
  const reduce = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 120, damping: 16 });
  const rotateY = useSpring(ry, { stiffness: 120, damping: 16 });

  function onMove(e: ReactMouseEvent<HTMLDivElement>) {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rx.set(py * -7);
    ry.set(px * 9);
  }

  function onLeave() {
    rx.set(0);
    ry.set(0);
  }

  return (
    <div
      className="relative mx-auto w-full max-w-[440px] [perspective:1200px]"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div
        className="pointer-events-none absolute -left-10 -top-10 size-48 rounded-full bg-[#96bf48]/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-8 -right-8 size-40 rounded-full bg-[#FF5722]/15 blur-3xl"
        aria-hidden
      />

      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative rounded-2xl border border-slate-200 bg-white shadow-[0_32px_64px_-24px_rgba(15,23,42,0.25)]"
      >
        {/* Storefront-balk */}
        <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
          <span className="size-2.5 rounded-full bg-[#FF5722]/80" aria-hidden />
          <span className="size-2.5 rounded-full bg-amber-300" aria-hidden />
          <span className="size-2.5 rounded-full bg-emerald-400" aria-hidden />
          <span className="ml-2 flex items-center gap-1.5 rounded-full bg-[#96bf48]/15 px-2.5 py-1 text-[10px] font-bold text-[#5a7a2e]">
            <ShoppingBag className="size-3" aria-hidden />
            Shopify
          </span>
          <span className="ml-auto flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-500">
            <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden />
            Live
          </span>
        </div>

        <div className="space-y-4 p-5">
          {/* Nav + cart */}
          <motion.div {...buildIn(0.1, !!reduce)} className="flex items-center gap-3">
            <span className="size-7 rounded-lg bg-slate-900" aria-hidden />
            <span className="h-2 w-14 rounded-full bg-slate-200" aria-hidden />
            <span className="h-2 w-10 rounded-full bg-slate-200" aria-hidden />
            <span className="ml-auto flex items-center gap-1 rounded-full border border-slate-200 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-500">
              Maatwerk
            </span>
            <span className="relative flex size-7 items-center justify-center rounded-full bg-[#FF5722]/10">
              <ShoppingBag className="size-3.5 text-[#FF5722]" aria-hidden />
              <span className="absolute -right-0.5 -top-0.5 flex size-3.5 items-center justify-center rounded-full bg-[#FF5722] text-[8px] font-bold text-white">
                3
              </span>
            </span>
          </motion.div>

          {/* Hero product */}
          <motion.div
            {...buildIn(0.28, !!reduce)}
            className="grid grid-cols-[1fr_1.1fr] gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3"
          >
            <span className="aspect-square rounded-lg bg-gradient-to-br from-slate-200 to-slate-100" aria-hidden />
            <div className="flex flex-col justify-center space-y-2">
              <span className="block h-3 w-4/5 rounded-full bg-slate-900" aria-hidden />
              <span className="block h-2 w-2/3 rounded-full bg-slate-300" aria-hidden />
              <span className="mt-1 block h-4 w-16 rounded-full bg-[#FF5722]" aria-hidden />
              <span className="flex gap-1.5 pt-1">
                <span className="h-5 w-5 rounded-md border border-slate-200 bg-white" aria-hidden />
                <span className="h-5 w-5 rounded-md border border-slate-200 bg-white" aria-hidden />
                <span className="h-5 w-5 rounded-md border-2 border-[#FF5722] bg-[#FF5722]/10" aria-hidden />
              </span>
            </div>
          </motion.div>

          {/* Productgrid */}
          <div className="grid grid-cols-3 gap-2.5">
            {[0.48, 0.62, 0.76].map((delay, i) => (
              <motion.div
                key={delay}
                {...buildIn(delay, !!reduce)}
                className="space-y-2 rounded-xl border border-slate-100 bg-white p-2.5 shadow-sm"
              >
                <span className="block aspect-[4/3] rounded-lg bg-slate-100" aria-hidden />
                <span className="block h-1.5 w-4/5 rounded-full bg-slate-200" aria-hidden />
                <span className="block h-2 w-10 rounded-full bg-slate-900" aria-hidden />
                {i === 1 ? (
                  <span className="inline-block rounded-full bg-[#96bf48]/20 px-1.5 py-0.5 text-[8px] font-bold text-[#5a7a2e]">
                    Bundle
                  </span>
                ) : null}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Zwevende badges */}
        <motion.div
          animate={reduce ? undefined : { y: [-5, 5] }}
          transition={
            reduce
              ? undefined
              : { duration: 2.6, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }
          }
          className="absolute -right-5 top-16 rounded-xl border border-emerald-200 bg-white px-3 py-2 shadow-lg"
          style={{ transform: "translateZ(40px)" }}
        >
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            LCP
          </p>
          <p className="text-sm font-extrabold text-emerald-500">0,9 sec</p>
        </motion.div>

        <motion.div
          animate={reduce ? undefined : { y: [6, -6] }}
          transition={
            reduce
              ? undefined
              : { duration: 3.1, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }
          }
          className="absolute -left-6 bottom-14 rounded-xl border border-slate-200 bg-slate-900 px-3 py-2 shadow-lg"
          style={{ transform: "translateZ(50px)" }}
        >
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            SKU&apos;s
          </p>
          <p className="text-sm font-extrabold text-white">2.400+</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
