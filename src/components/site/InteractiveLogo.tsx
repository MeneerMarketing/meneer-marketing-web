"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef } from "react";

/**
 * Family Guy-achtige bouw: twee grote ovale ogen die elkaar in het midden
 * raken, kleine pupillen, neus die over de onderkant van de ogen valt en
 * dunne, consistente lijnen.
 */
const LEFT_EYE = { cx: 26.4, cy: 36.4 } as const;
const RIGHT_EYE = { cx: 37.6, cy: 36.4 } as const;
const EYE_RX = 5.8;
const EYE_RY = 7.4;
const PUPIL_R = 2.2;
/** Maximale pupil-uitwijking per as, volgt de ovale oogvorm */
const MAX_OFFSET_X = 2.6;
const MAX_OFFSET_Y = 4.2;
/** Afstand (px) waarop de ogen maximaal uitwijken */
const FULL_LOOK_DISTANCE = 220;

const INK = "#1F2430";
const LINE = 1.3;

interface InteractiveLogoProps {
  className?: string;
  /** Pupillen volgen cursor. Uit in compacte UI zoals hero-chat. */
  interactive?: boolean;
}

/**
 * Het hoofd van Meneer Marketing. De pupillen volgen de cursor over het
 * hele scherm; op touch-apparaten kijken de ogen mee met scrollen.
 */
export function InteractiveLogo({
  className,
  interactive = true,
}: InteractiveLogoProps) {
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
    if (reduce || !interactive) return;

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
      const strength = Math.min(dist / FULL_LOOK_DISTANCE, 1);
      targetX.set((dx / dist) * strength * MAX_OFFSET_X);
      targetY.set((dy / dist) * strength * MAX_OFFSET_Y);
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
        -MAX_OFFSET_Y,
        Math.min(MAX_OFFSET_Y, delta * 0.12),
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
  }, [reduce, interactive, targetX, targetY]);

  const blink =
    reduce || !interactive
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
      <ellipse
        cx="14.7"
        cy="42"
        rx="2.9"
        ry="3.4"
        fill="#F6C09A"
        stroke={INK}
        strokeWidth={LINE}
      />
      <ellipse
        cx="49.3"
        cy="42"
        rx="2.9"
        ry="3.4"
        fill="#F6C09A"
        stroke={INK}
        strokeWidth={LINE}
      />

      {/* Gezicht */}
      <ellipse
        cx="32"
        cy="41"
        rx="17"
        ry="16.6"
        fill="#F8CBA3"
        stroke={INK}
        strokeWidth={LINE + 0.2}
      />

      {/* Blosjes */}
      <ellipse cx="20.6" cy="47" rx="2.5" ry="1.5" fill="#F2A075" opacity="0.5" />
      <ellipse cx="43.4" cy="47" rx="2.5" ry="1.5" fill="#F2A075" opacity="0.5" />

      {/* Linkeroog: ovaal, raakt het rechteroog in het midden */}
      <ellipse
        cx={LEFT_EYE.cx}
        cy={LEFT_EYE.cy}
        rx={EYE_RX}
        ry={EYE_RY}
        fill="#fff"
        stroke={INK}
        strokeWidth={LINE}
      />
      <motion.circle
        cx={interactive ? leftPupilX : LEFT_EYE.cx}
        cy={interactive ? leftPupilY : LEFT_EYE.cy}
        r={PUPIL_R}
        fill={INK}
      />
      {blink ? (
        <motion.ellipse
          cx={LEFT_EYE.cx}
          cy={LEFT_EYE.cy}
          rx={EYE_RX - 0.7}
          ry={EYE_RY - 0.7}
          fill="#fff"
          initial={{ scaleY: 0 }}
          animate={blink}
          style={{ transformBox: "fill-box", transformOrigin: "50% 0%" }}
        />
      ) : null}

      {/* Rechteroog */}
      <ellipse
        cx={RIGHT_EYE.cx}
        cy={RIGHT_EYE.cy}
        rx={EYE_RX}
        ry={EYE_RY}
        fill="#fff"
        stroke={INK}
        strokeWidth={LINE}
      />
      <motion.circle
        cx={interactive ? rightPupilX : RIGHT_EYE.cx}
        cy={interactive ? rightPupilY : RIGHT_EYE.cy}
        r={PUPIL_R}
        fill={INK}
      />
      {blink ? (
        <motion.ellipse
          cx={RIGHT_EYE.cx}
          cy={RIGHT_EYE.cy}
          rx={EYE_RX - 0.7}
          ry={EYE_RY - 0.7}
          fill="#fff"
          initial={{ scaleY: 0 }}
          animate={blink}
          style={{ transformBox: "fill-box", transformOrigin: "50% 0%" }}
        />
      ) : null}

      {/* Neus: valt over de binnenste onderkant van de ogen */}
      <ellipse
        cx="32"
        cy="43.6"
        rx="3.3"
        ry="2.3"
        fill="#F2B285"
        stroke={INK}
        strokeWidth={LINE - 0.1}
      />

      {/* Snor: volle walrus-snor met vloeiende curves */}
      <path
        d="M23.2 48.6
           C25.4 45.6 29.6 45.9 32 47.9
           C34.4 45.9 38.6 45.6 40.8 48.6
           C40 51.3 36.1 52.2 32 50.3
           C27.9 52.2 24 51.3 23.2 48.6 Z"
        fill={INK}
      />

      {/* Glimlach onder de snor */}
      <path
        d="M28.4 54.2c2.3 1.5 4.9 1.5 7.2 0"
        fill="none"
        stroke={INK}
        strokeWidth={LINE}
        strokeLinecap="round"
      />

      {/* Bolhoed */}
      <path
        d="M19 24.6a13 12.2 0 0 1 26 0v0.9h-26z"
        fill={INK}
      />
      <rect x="19.8" y="20.7" width="24.4" height="4" fill="#FF5722" />
      <rect x="11.5" y="23.8" width="41" height="4.4" rx="2.2" fill={INK} />
    </svg>
  );
}
