"use client";

import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

interface MagneticProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  radius?: number;
  wobble?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
}

export const Magnetic = forwardRef<HTMLDivElement, MagneticProps>(
  function Magnetic(
    {
      children,
      strength = 15,
      radius = 140,
      wobble = true,
      className,
      onClick,
      ariaLabel,
    },
    forwardedRef,
  ) {
    const localRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(forwardedRef, () => localRef.current as HTMLDivElement);

    const reduce = useReducedMotion();
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rot = useMotionValue(0);
    const sx = useSpring(x, { stiffness: 220, damping: 14, mass: 0.35 });
    const sy = useSpring(y, { stiffness: 220, damping: 14, mass: 0.35 });
    const sr = useSpring(rot, { stiffness: 160, damping: 10, mass: 0.25 });

    const onMove = useCallback(
      (event: ReactPointerEvent<HTMLDivElement>) => {
        if (reduce || !localRef.current) return;
        const rect = localRef.current.getBoundingClientRect();
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        const dist = Math.hypot(dx, dy);
        if (dist > radius) {
          x.set(0);
          y.set(0);
          rot.set(0);
          return;
        }
        const pull = 1 - dist / radius;
        const nx = dist < 0.0001 ? 0 : (dx / dist) * pull * strength;
        const ny = dist < 0.0001 ? 0 : (dy / dist) * pull * strength;
        x.set(nx);
        y.set(ny);
        if (wobble) rot.set((nx / strength) * 2.2);
      },
      [radius, reduce, rot, strength, wobble, x, y],
    );

    const onLeave = useCallback(() => {
      x.set(0);
      y.set(0);
      rot.set(0);
    }, [rot, x, y]);

    return (
      <motion.div
        ref={localRef}
        className={className}
        style={{ x: sx, y: sy, rotate: sr, display: "inline-flex" }}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        onClick={onClick}
        aria-label={ariaLabel}
      >
        {children}
      </motion.div>
    );
  },
);
