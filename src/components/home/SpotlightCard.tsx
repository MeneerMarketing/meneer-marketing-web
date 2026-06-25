"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import type { PointerEvent, ReactNode } from "react";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  revealDelay?: number;
}

export function SpotlightCard({
  children,
  className = "",
  revealDelay = 0,
}: SpotlightCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const spotlight = useMotionTemplate`radial-gradient(380px circle at ${x}px ${y}px, rgba(14,165,233,0.14), transparent 45%)`;

  function onPointerMove(e: PointerEvent<HTMLLIElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - r.left);
    y.set(e.clientY - r.top);
  }

  return (
    <motion.li
      className={`group relative list-none overflow-hidden rounded-2xl border border-mm-border bg-mm-surface-elevated shadow-sm ${className}`}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        delay: revealDelay,
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -4 }}
      onPointerMove={onPointerMove}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: spotlight }}
      />
      <div className="relative z-[1] p-6">{children}</div>
      <div className="pointer-events-none absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-mm-accent-subtle/60 opacity-0 blur-2xl transition duration-500 group-hover:opacity-100" />
    </motion.li>
  );
}
