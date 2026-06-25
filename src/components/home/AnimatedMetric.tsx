"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface AnimatedMetricProps {
  children: string;
  className?: string;
}

export function AnimatedMetric({ children, className = "" }: AnimatedMetricProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });

  return (
    <motion.p
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={
        inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }
      }
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
    >
      {children}
    </motion.p>
  );
}
