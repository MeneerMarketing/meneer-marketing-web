"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef } from "react";

const LEFT_EYE = { cx: 25, cy: 37.5 } as const;
const RIGHT_EYE = { cx: 39, cy: 37.5 } as const;
const EYE_R = 7;
const PUPIL_R = 3.1;
/** Maximale pupil-uitwijking in SVG-units, blijft binnen het oog */
const MAX_OFFSET = 3.2;
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
      {/* Oren */}
      <circle cx="14.5" cy="42" r="3.4" fill="#F6C09A" stroke="#0F172A" strokeWidth="1.8" />
      <circle cx="49.5" cy="42" r="3.4" fill="#F6C09A" stroke="#0F172A" strokeWidth="1.8" />

      {/* Gezicht */}
      <circle
        cx="32"
        cy="41"
        r="17"
        fill="#F8CBA3"
        stroke="#0F172A"
        strokeWidth="2"
      />

      {/* Blosjes */}
      <ellipse cx="20" cy="46.5" rx="2.8" ry="1.7" fill="#F2A075" opacity="0.65" />
      <ellipse cx="44" cy="46.5" rx="2.8" ry="1.7" fill="#F2A075" opacity="0.65" />

      {/* Snor */}
      <path
        d="M22.6 49.8c3-3.4 7-2.1 9.4.4 2.4-2.5 6.4-3.8 9.4-.4-1.6 3.3-6 4-9.4 1.9-3.4 2.1-7.8 1.4-9.4-1.9z"
        fill="#0F172A"
      />

      {/* Glimlach onder de snor */}
      <path
        d="M28 54.6c2.5 1.8 5.5 1.8 8 0"
        fill="none"
        stroke="#0F172A"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Bolhoed */}
      <path d="M18.5 24.5a13.5 12.5 0 0 1 27 0v1h-27z" fill="#0F172A" />
      <rect x="19.5" y="20.4" width="25" height="4.2" fill="#FF5722" />
      <rect x="11" y="23.6" width="42" height="4.8" rx="2.4" fill="#0F172A" />

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

      {/* Neus (vóór de ogen, cartoon-stijl) */}
      <circle cx="32" cy="44.6" r="2.6" fill="#F0A878" stroke="#0F172A" strokeWidth="1.6" />
    </svg>
  );
}
