"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef } from "react";

const LEFT_EYE = { cx: 25.5, cy: 38.5 } as const;
const RIGHT_EYE = { cx: 38.5, cy: 38.5 } as const;
const EYE_R = 5.6;
const PUPIL_R = 2.5;
/** Maximale pupil-uitwijking in SVG-units, blijft binnen de lens */
const MAX_OFFSET = 2.4;
/** Afstand (px) waarop de ogen maximaal uitwijken */
const FULL_LOOK_DISTANCE = 220;

interface InteractiveLogoProps {
  className?: string;
}

/**
 * Het hoofd van Meneer Marketing. De pupillen volgen de cursor over het
 * hele scherm; op touch-apparaten kijken de ogen mee met scrollen.
 */
export function InteractiveLogo({ className }: InteractiveLogoProps) {
  const reduce = useReducedMotion();
  const svgRef = useRef<SVGSVGElement>(null);
  const lastPointerAt = useRef(0);
  const lastScrollY = useRef(0);
  const scrollResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);
  const x = useSpring(targetX, { stiffness: 170, damping: 18, mass: 0.4 });
  const y = useSpring(targetY, { stiffness: 170, damping: 18, mass: 0.4 });

  const leftPupilX = useTransform(x, (v) => LEFT_EYE.cx + v);
  const leftPupilY = useTransform(y, (v) => LEFT_EYE.cy + v);
  const rightPupilX = useTransform(x, (v) => RIGHT_EYE.cx + v);
  const rightPupilY = useTransform(y, (v) => RIGHT_EYE.cy + v);

  useEffect(() => {
    if (reduce) return;

    function lookAt(clientX: number, clientY: number) {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height * 0.6;
      const dx = clientX - cx;
      const dy = clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < 1) return;
      const strength = Math.min(dist / FULL_LOOK_DISTANCE, 1) * MAX_OFFSET;
      targetX.set((dx / dist) * strength);
      targetY.set((dy / dist) * strength);
    }

    function onPointerMove(e: PointerEvent) {
      lastPointerAt.current = Date.now();
      lookAt(e.clientX, e.clientY);
    }

    function onScroll() {
      // Alleen zonder recente cursor/vinger: dan kijken de ogen mee met scroll.
      if (Date.now() - lastPointerAt.current < 1500) return;
      const delta = window.scrollY - lastScrollY.current;
      lastScrollY.current = window.scrollY;
      const clamped = Math.max(
        -MAX_OFFSET,
        Math.min(MAX_OFFSET, delta * 0.12),
      );
      targetX.set(0);
      targetY.set(clamped);
      if (scrollResetTimer.current) clearTimeout(scrollResetTimer.current);
      scrollResetTimer.current = setTimeout(() => targetY.set(0), 280);
    }

    lastScrollY.current = window.scrollY;
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      if (scrollResetTimer.current) clearTimeout(scrollResetTimer.current);
    };
  }, [reduce, targetX, targetY]);

  const blink = reduce
    ? undefined
    : {
        scaleY: [0, 1, 0],
        transition: {
          duration: 0.3,
          times: [0, 0.5, 1],
          repeat: Infinity,
          repeatDelay: 4.2,
          delay: 1.8,
        },
      };

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 64 64"
      className={className ?? "h-9 w-9"}
      aria-hidden
      focusable="false"
    >
      {/* Gezicht */}
      <circle
        cx="32"
        cy="40"
        r="16"
        fill="#fff"
        stroke="#0F172A"
        strokeWidth="2"
      />

      {/* Snor */}
      <path
        d="M24.8 47.4c2.4-2.7 5.5-1.7 7.2.3 1.7-2 4.8-3 7.2-.3-1.3 2.6-4.7 3.2-7.2 1.5-2.5 1.7-5.9 1.1-7.2-1.5z"
        fill="#0F172A"
      />

      {/* Bolhoed */}
      <path d="M19 25a13 12 0 0 1 26 0v.8H19z" fill="#0F172A" />
      <rect x="20" y="20.6" width="24" height="4" fill="#FF5722" />
      <rect x="12" y="24" width="40" height="4.6" rx="2.3" fill="#0F172A" />

      {/* Brilpoten en brug */}
      <line
        x1="19.9"
        y1="38.5"
        x2="16.6"
        y2="37.4"
        stroke="#0F172A"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="44.1"
        y1="38.5"
        x2="47.4"
        y2="37.4"
        stroke="#0F172A"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="31.1"
        y1="38.5"
        x2="32.9"
        y2="38.5"
        stroke="#0F172A"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Linkeroog */}
      <circle
        cx={LEFT_EYE.cx}
        cy={LEFT_EYE.cy}
        r={EYE_R}
        fill="#fff"
        stroke="#0F172A"
        strokeWidth="2"
      />
      <motion.circle
        cx={leftPupilX}
        cy={leftPupilY}
        r={PUPIL_R}
        fill="#0F172A"
      />
      {blink ? (
        <motion.ellipse
          cx={LEFT_EYE.cx}
          cy={LEFT_EYE.cy}
          rx={EYE_R - 0.9}
          ry={EYE_R - 0.9}
          fill="#fff"
          initial={{ scaleY: 0 }}
          animate={blink}
          style={{ transformBox: "fill-box", transformOrigin: "50% 0%" }}
        />
      ) : null}

      {/* Rechteroog */}
      <circle
        cx={RIGHT_EYE.cx}
        cy={RIGHT_EYE.cy}
        r={EYE_R}
        fill="#fff"
        stroke="#0F172A"
        strokeWidth="2"
      />
      <motion.circle
        cx={rightPupilX}
        cy={rightPupilY}
        r={PUPIL_R}
        fill="#0F172A"
      />
      {blink ? (
        <motion.ellipse
          cx={RIGHT_EYE.cx}
          cy={RIGHT_EYE.cy}
          rx={EYE_R - 0.9}
          ry={EYE_R - 0.9}
          fill="#fff"
          initial={{ scaleY: 0 }}
          animate={blink}
          style={{ transformBox: "fill-box", transformOrigin: "50% 0%" }}
        />
      ) : null}
    </svg>
  );
}
