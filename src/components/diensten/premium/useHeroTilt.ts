"use client";

import {
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import type { MouseEvent as ReactMouseEvent } from "react";

/** Subtiele 3D-tilt voor premium dienst-hero's. Respecteert reduced motion. */
export function useHeroTilt(intensity = 1) {
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
    rx.set(py * -7 * intensity);
    ry.set(px * 9 * intensity);
  }

  function onLeave() {
    rx.set(0);
    ry.set(0);
  }

  return { reduce: !!reduce, rotateX, rotateY, onMove, onLeave };
}
