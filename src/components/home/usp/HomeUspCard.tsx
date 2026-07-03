"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import type { PointerEvent } from "react";
import type { HomeUsp } from "@/data/home-usps";
import { UspMiniScene } from "@/components/home/usp/UspMiniScene";

const CARD_TILT = [-2.2, 1.4, -1, 2, -1.6] as const;

interface HomeUspCardProps {
  usp: HomeUsp;
  index: number;
}

export function HomeUspCard({ usp, index }: HomeUspCardProps) {
  const reduce = useReducedMotion();
  const rotateX = useSpring(0, { stiffness: 260, damping: 22 });
  const rotateY = useSpring(0, { stiffness: 260, damping: 22 });
  const spotX = useMotionValue(0);
  const spotY = useMotionValue(0);
  const spotlight = useMotionTemplate`radial-gradient(220px circle at ${spotX}px ${spotY}px, ${usp.accent}22, transparent 55%)`;
  const lift = useTransform(rotateX, (rx) => (reduce ? 0 : Math.abs(rx) * 0.6));

  const baseRotate = CARD_TILT[index % CARD_TILT.length];

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * 14);
    rotateX.set(-py * 12);
    spotX.set(e.clientX - rect.left);
    spotY.set(e.clientY - rect.top);
  }

  function onPointerLeave() {
    rotateX.set(0);
    rotateY.set(0);
    spotX.set(0);
    spotY.set(0);
  }

  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 24, rotate: baseRotate * 2 }}
      whileInView={{ opacity: 1, y: 0, rotate: baseRotate }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        type: "spring",
        stiffness: 240,
        damping: 20,
        delay: 0.07 * index,
      }}
      whileHover={reduce ? undefined : { rotate: 0, y: -6, scale: 1.02 }}
      className="group h-full [perspective:900px]"
    >
      <motion.div
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        style={{
          rotateX: reduce ? 0 : rotateX,
          rotateY: reduce ? 0 : rotateY,
          y: reduce ? 0 : lift,
        }}
        className="relative flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-slate-200/90 bg-white shadow-[0_10px_30px_-18px_rgba(15,23,42,0.22)] transition-[border-color,box-shadow] duration-300 will-change-transform group-hover:border-[#FF5722]/30 group-hover:shadow-[0_22px_44px_-22px_rgba(255,87,34,0.28)]"
      >
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: spotlight }}
        />

        {/* Illustratie-zone */}
        <div
          className="relative overflow-hidden border-b border-slate-100 px-4 pb-3 pt-4"
          style={{
            background: `linear-gradient(145deg, ${usp.accent}12 0%, white 72%)`,
          }}
        >
          <div
            className="pointer-events-none absolute -right-4 -top-4 size-20 rounded-full opacity-40 blur-2xl"
            style={{ backgroundColor: usp.accent }}
            aria-hidden
          />
          <UspMiniScene scene={usp.scene} className="relative z-[1] mx-auto h-[4.5rem] w-full max-w-[7.5rem]" />
          <div
            className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"
            aria-hidden
          />
        </div>

        {/* Tekst met vaste hoogte voor perfecte symmetrie */}
        <div className="relative z-[1] flex flex-1 flex-col px-4 py-4 sm:px-4 sm:py-4">
          <h3 className="text-sm font-extrabold leading-snug tracking-tight text-slate-900 sm:text-[15px]">
            {usp.title}
          </h3>
          <p className="mt-2 min-h-[4.75rem] text-xs leading-[1.55] text-slate-600 sm:min-h-[5rem] sm:text-sm sm:leading-[1.55]">
            {usp.body}
          </p>
        </div>

        {/* Accent-streep onderaan */}
        <div
          className="h-1 w-full origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
          style={{ backgroundColor: usp.accent }}
          aria-hidden
        />
      </motion.div>
    </motion.li>
  );
}
