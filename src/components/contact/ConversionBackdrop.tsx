"use client";

import { motion, useReducedMotion } from "framer-motion";

/** Warme MM-achtergrond: oranje sfeer + speelse vlakken. Geen grid, geen paarse blobs. */
export type BackdropTone = "sky" | "accent" | "dual" | "violet";

interface ConversionBackdropProps {
  readonly tone?: BackdropTone;
  readonly className?: string;
}

export function ConversionBackdrop({
  className = "",
}: ConversionBackdropProps) {
  const reduce = useReducedMotion() ?? false;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {/* Basis: warm crème → wit */}
      <div className="absolute inset-0 bg-[linear-gradient(165deg,#FFF7F2_0%,#FFFFFF_42%,#FFF4EC_100%)]" />

      {/* Grote oranje soft-spot (merk, geen neon-mesh) */}
      <motion.div
        className="absolute -right-24 -top-28 h-[28rem] w-[28rem] rounded-full bg-[#FF5722]/[0.14] blur-3xl"
        animate={reduce ? undefined : { scale: [1, 1.06, 1], x: [0, -12, 0] }}
        transition={{ duration: 14, ease: "easeInOut", repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-32 -left-20 h-[22rem] w-[22rem] rounded-full bg-[#FF8A65]/[0.18] blur-3xl"
        animate={reduce ? undefined : { scale: [1, 1.08, 1], y: [0, -16, 0] }}
        transition={{ duration: 16, ease: "easeInOut", repeat: Infinity }}
      />

      {/* Speelse harde vormen (MM-karakter) */}
      <motion.div
        className="absolute right-[8%] top-[18%] size-16 rounded-2xl bg-[#FF5722]/90 shadow-lg shadow-orange-500/30 sm:size-20"
        style={{ rotate: 12 }}
        animate={reduce ? undefined : { y: [0, -10, 0], rotate: [12, 18, 12] }}
        transition={{ duration: 7, ease: "easeInOut", repeat: Infinity }}
      />
      <motion.div
        className="absolute right-[18%] top-[42%] size-10 rounded-full border-[5px] border-[#FF5722]/55 bg-white/40 sm:size-12"
        animate={reduce ? undefined : { y: [0, 12, 0] }}
        transition={{ duration: 9, ease: "easeInOut", repeat: Infinity }}
      />
      <div
        className="absolute bottom-[22%] right-[28%] hidden h-3 w-24 rounded-full bg-slate-900/90 sm:block"
        style={{ rotate: -8 }}
      />
      <div className="absolute left-[6%] top-[58%] size-3 rounded-full bg-[#FF5722]" />
      <div className="absolute left-[12%] top-[64%] size-2 rounded-full bg-slate-900/80" />
    </div>
  );
}
