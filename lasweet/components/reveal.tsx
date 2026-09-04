"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

/**
 * Scroll-reveal zonder opacity:0.
 * Op iPhone Safari blijft whileInView + opacity:0 vaak permanent wit/onzichtbaar.
 * Daarom alleen een lichte slide; content is altijd zichtbaar.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 1, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05, margin: "80px 0px" }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
