"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";
import { getOfficePillar } from "@/data/services-office";
import type { PillarSlug } from "@/lib/navigation";

const INK = "#1F2430";

/** Middelpunt van het hoofd als fractie van de scène */
const HEAD = { x: 0.484, y: 0.461 } as const;

/** Ooggeometrie, zelfde bouw als InteractiveLogo (64x64 viewBox) */
const LEFT_EYE = { cx: 26.4, cy: 36.4 } as const;
const RIGHT_EYE = { cx: 37.6, cy: 36.4 } as const;
const EYE_RX = 5.8;
const EYE_RY = 7.4;
const PUPIL_R = 2.2;
const MAX_OFFSET_X = 2.6;
const MAX_OFFSET_Y = 4.2;
const FULL_LOOK_DISTANCE = 380;

const STARS = [
  { x: 1062, y: 150, r: 2.2, d: 0 },
  { x: 1210, y: 128, r: 1.7, d: 0.8 },
  { x: 1298, y: 172, r: 2.4, d: 1.6 },
  { x: 1388, y: 136, r: 1.8, d: 0.4 },
  { x: 1445, y: 210, r: 2.1, d: 2.1 },
  { x: 1330, y: 246, r: 1.5, d: 1.1 },
  { x: 1170, y: 262, r: 1.6, d: 2.6 },
  { x: 1430, y: 300, r: 1.4, d: 0.2 },
] as const;

interface ClickablePillarProps {
  id: PillarSlug;
  active: PillarSlug | null;
  hovered: PillarSlug | null;
  interactive: boolean;
  reduce: boolean;
  /** Vertraging van de ademende glow-hint, zodat objecten om de beurt oplichten */
  hintDelay?: number;
  onSelect: (id: PillarSlug) => void;
  onHover: (id: PillarSlug | null) => void;
  children: ReactNode;
}

/**
 * Klikbaar object: zachte ademende glow als hint (geen kaders), sterkere
 * glow plus lift en zwevend naamlabel bij hover.
 */
function ClickablePillar({
  id,
  active,
  hovered,
  interactive,
  reduce,
  hintDelay = 0,
  onSelect,
  onHover,
  children,
}: ClickablePillarProps) {
  const pillar = getOfficePillar(id);
  const { hitBox } = pillar;
  const cx = hitBox.x + hitBox.w / 2;
  const cy = hitBox.y + hitBox.h / 2;
  const isHot = hovered === id;
  const dimmed = active !== null && active !== id;

  const labelWidth = pillar.label.length * 8.2 + 34;
  const labelY = hitBox.y - 44;

  return (
    <g
      opacity={dimmed ? 0.38 : 1}
      style={{ transition: "opacity 0.35s ease" }}
      onClick={(e) => {
        e.stopPropagation();
        if (interactive) {
          onSelect(id);
          (e.currentTarget as unknown as HTMLElement).blur?.();
        }
      }}
      onMouseEnter={() => interactive && onHover(id)}
      onMouseLeave={() => interactive && onHover(null)}
      onFocus={() => interactive && onHover(id)}
      onBlur={() => interactive && onHover(null)}
      className={interactive ? "office-hotspot cursor-pointer" : undefined}
      role="button"
      tabIndex={interactive ? 0 : -1}
      aria-label={`${pillar.objectLabel}: ${pillar.label}`}
      aria-expanded={active === id}
      onKeyDown={(e) => {
        if (!interactive) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(id);
        }
      }}
    >
      {interactive && active === null ? (
        reduce ? (
          <ellipse
            cx={cx}
            cy={cy}
            rx={hitBox.w * 0.62}
            ry={hitBox.h * 0.62}
            fill="url(#office-hint)"
            opacity={0.35}
            pointerEvents="none"
          />
        ) : (
          <motion.ellipse
            cx={cx}
            cy={cy}
            rx={hitBox.w * 0.62}
            ry={hitBox.h * 0.62}
            fill="url(#office-hint)"
            initial={{ opacity: 0 }}
            animate={isHot ? { opacity: 0.95 } : { opacity: [0.16, 0.42, 0.16] }}
            transition={
              isHot
                ? { duration: 0.25 }
                : {
                    duration: 3.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: hintDelay,
                  }
            }
            pointerEvents="none"
          />
        )
      ) : null}
      <rect
        x={hitBox.x}
        y={hitBox.y}
        width={hitBox.w}
        height={hitBox.h}
        fill="transparent"
      />
      <motion.g
        animate={
          isHot && interactive && !reduce
            ? { scale: 1.03, y: -4 }
            : { scale: 1, y: 0 }
        }
        transition={{ type: "spring", stiffness: 380, damping: 24 }}
        style={{ transformOrigin: `${cx}px ${cy}px`, transformBox: "fill-box" as const }}
      >
        {children}
      </motion.g>
      {isHot && interactive ? (
        <motion.g
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          pointerEvents="none"
        >
          <rect
            x={cx - labelWidth / 2}
            y={labelY}
            width={labelWidth}
            height={30}
            rx={15}
            fill="#0B1220"
            fillOpacity={0.94}
            stroke="#FFFFFF"
            strokeOpacity={0.16}
            strokeWidth={1.5}
          />
          <text
            x={cx}
            y={labelY + 20}
            textAnchor="middle"
            fontSize="14"
            fontWeight="700"
            fill="#FEFCFC"
          >
            {pillar.label}
          </text>
        </motion.g>
      ) : null}
    </g>
  );
}

interface OfficeSceneProps {
  active: PillarSlug | null;
  hovered: PillarSlug | null;
  interactive: boolean;
  onSelect: (id: PillarSlug) => void;
  onHover: (id: PillarSlug | null) => void;
  className?: string;
}

/**
 * Het kantoor van Meneer Marketing, v3.
 *
 * Lichtplan: één warme hoofdbron (de hanglamp) en één koele tegenbron
 * (maanlicht door het raam). Elk object heeft een gradient-vulling, een
 * highlight aan de lampzijde en een contactschaduw.
 *
 * Fysica-regels van deze versie:
 *  - alles wat op het bureau staat, stáát ergens op: de laptop op zijn
 *    voet (deksel naar Meneer Marketing gericht, logo naar de bezoeker),
 *    het vergrootglas gedockt in een messing bureaustandaard, de megafoon
 *    stabiel op zijn bel;
 *  - gezichtsschaduwen zijn geclipt binnen de hoofdvorm zodat er niets
 *    buiten het silhouet uitsteekt;
 *  - klokwijzers en de mot draaien met SVG animateTransform rond een
 *    expliciet middelpunt.
 */
export function OfficeScene({
  active,
  hovered,
  interactive,
  onSelect,
  onHover,
  className,
}: OfficeSceneProps) {
  const reduce = useReducedMotion();
  const svgRef = useRef<SVGSVGElement>(null);
  const activeRef = useRef<PillarSlug | null>(active);
  activeRef.current = active;

  // Pupillen (in lokale 64x64 head-coördinaten)
  const eyeTargetX = useMotionValue(0);
  const eyeTargetY = useMotionValue(0);
  const eyeX = useSpring(eyeTargetX, { stiffness: 170, damping: 18, mass: 0.4 });
  const eyeY = useSpring(eyeTargetY, { stiffness: 170, damping: 18, mass: 0.4 });
  const leftPupilX = useTransform(eyeX, (v) => LEFT_EYE.cx + v);
  const leftPupilY = useTransform(eyeY, (v) => LEFT_EYE.cy + v);
  const rightPupilX = useTransform(eyeX, (v) => RIGHT_EYE.cx + v);
  const rightPupilY = useTransform(eyeY, (v) => RIGHT_EYE.cy + v);
  // Glinstering beweegt mee met de pupil voor een glazen, bolle oogindruk
  const leftGlintX = useTransform(eyeX, (v) => LEFT_EYE.cx + v - 0.8);
  const leftGlintY = useTransform(eyeY, (v) => LEFT_EYE.cy + v - 0.9);
  const rightGlintX = useTransform(eyeX, (v) => RIGHT_EYE.cx + v - 0.8);
  const rightGlintY = useTransform(eyeY, (v) => RIGHT_EYE.cy + v - 0.9);

  // Parallax (-1..1 genormaliseerd t.o.v. scène-midden)
  const panTargetX = useMotionValue(0);
  const panTargetY = useMotionValue(0);
  const panX = useSpring(panTargetX, { stiffness: 60, damping: 20, mass: 0.6 });
  const panY = useSpring(panTargetY, { stiffness: 60, damping: 20, mass: 0.6 });
  const backX = useTransform(panX, (v) => v * -6);
  const backY = useTransform(panY, (v) => v * -3);
  const midX = useTransform(panX, (v) => v * -11);
  const midY = useTransform(panY, (v) => v * -5);
  const deskX = useTransform(panX, (v) => v * -17);
  const deskY = useTransform(panY, (v) => v * -8);
  const frontX = useTransform(panX, (v) => v * -28);
  const frontY = useTransform(panY, (v) => v * -13);

  useEffect(() => {
    if (reduce) return;

    function onPointerMove(e: PointerEvent) {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      if (rect.width === 0) return;

      const nx = Math.max(-1, Math.min(1, ((e.clientX - rect.left) / rect.width) * 2 - 1));
      const ny = Math.max(-1, Math.min(1, ((e.clientY - rect.top) / rect.height) * 2 - 1));
      panTargetX.set(nx);
      panTargetY.set(ny);

      // Bij een actieve dienst kijkt het hoofd naar het object, niet de cursor
      if (activeRef.current) return;

      const headCx = rect.left + HEAD.x * rect.width;
      const headCy = rect.top + HEAD.y * rect.height;
      const dx = e.clientX - headCx;
      const dy = e.clientY - headCy;
      const dist = Math.hypot(dx, dy);
      if (dist < 1) return;
      const strength = Math.min(dist / FULL_LOOK_DISTANCE, 1);
      eyeTargetX.set((dx / dist) * strength * MAX_OFFSET_X);
      eyeTargetY.set((dy / dist) * strength * MAX_OFFSET_Y);
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [reduce, panTargetX, panTargetY, eyeTargetX, eyeTargetY]);

  useEffect(() => {
    if (!active) return;
    const pillar = getOfficePillar(active);
    const dx = pillar.x - HEAD.x;
    const dy = pillar.y - HEAD.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 0.001) return;
    eyeTargetX.set((dx / dist) * MAX_OFFSET_X);
    eyeTargetY.set((dy / dist) * MAX_OFFSET_Y * 0.6);
  }, [active, eyeTargetX, eyeTargetY]);

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

  const idle = !reduce;

  const clickProps = {
    active,
    hovered,
    interactive,
    reduce: !!reduce,
    onSelect,
    onHover,
  };

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 1600 900"
      className={className ?? "block h-auto w-full"}
      role="img"
      aria-label="Het kantoor van Meneer Marketing met vijf interactieve objecten voor de vijf hoofddiensten"
    >
      <defs>
        {/* ===== Omgeving ===== */}
        <linearGradient id="office-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#313849" />
          <stop offset="55%" stopColor="#272D3C" />
          <stop offset="100%" stopColor="#1E242F" />
        </linearGradient>
        <linearGradient id="office-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#222938" />
          <stop offset="100%" stopColor="#141924" />
        </linearGradient>
        <radialGradient id="office-rug" cx="50%" cy="42%" r="70%">
          <stop offset="0%" stopColor="#2B3450" />
          <stop offset="100%" stopColor="#1E2537" />
        </radialGradient>
        <linearGradient id="office-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1B2436" />
          <stop offset="100%" stopColor="#0D1220" />
        </linearGradient>
        <radialGradient id="office-moon-halo">
          <stop offset="0%" stopColor="#F2ECDA" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#F2ECDA" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="office-lamp-pool" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF5722" stopOpacity="0.09" />
          <stop offset="100%" stopColor="#FF5722" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="office-lamp-cone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF5722" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#FF5722" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="office-bulb">
          <stop offset="0%" stopColor="#FFD180" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FFD180" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="office-hint">
          <stop offset="0%" stopColor="#FF5722" stopOpacity="0.4" />
          <stop offset="55%" stopColor="#FF5722" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#FF5722" stopOpacity="0" />
        </radialGradient>

        {/* ===== Hout en messing ===== */}
        <linearGradient id="office-wood-top" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B37E51" />
          <stop offset="100%" stopColor="#8C5A36" />
        </linearGradient>
        <linearGradient id="office-wood-front" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7A4E2C" />
          <stop offset="100%" stopColor="#59371D" />
        </linearGradient>
        <linearGradient id="office-wood-drawer" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8E5C37" />
          <stop offset="100%" stopColor="#6B4224" />
        </linearGradient>
        <linearGradient id="office-brass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F0D28A" />
          <stop offset="100%" stopColor="#C9973C" />
        </linearGradient>

        {/* ===== Mascotte ===== */}
        <radialGradient id="office-skin" cx="46%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#FCDAB4" />
          <stop offset="62%" stopColor="#F8CBA3" />
          <stop offset="100%" stopColor="#EDAF80" />
        </radialGradient>
        <radialGradient id="office-eye" cx="45%" cy="35%" r="80%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E9E3D8" />
        </radialGradient>
        <linearGradient id="office-suit" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3C4661" />
          <stop offset="100%" stopColor="#252D3F" />
        </linearGradient>
        <linearGradient id="office-hat" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#333B52" />
          <stop offset="100%" stopColor="#161B27" />
        </linearGradient>
        <linearGradient id="office-chair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4C587A" />
          <stop offset="100%" stopColor="#313B56" />
        </linearGradient>
        <linearGradient id="office-column" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7C8AA6" />
          <stop offset="50%" stopColor="#4B5670" />
          <stop offset="100%" stopColor="#38415A" />
        </linearGradient>
        {/* Clip zodat gezichtsschaduwen nooit buiten het hoofd uitsteken */}
        <clipPath id="office-head-clip">
          <ellipse cx="32" cy="41" rx="16.4" ry="16" />
        </clipPath>

        {/* ===== Objecten ===== */}
        <linearGradient id="office-laptop-shell" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#242E40" />
          <stop offset="100%" stopColor="#0C111B" />
        </linearGradient>
        <linearGradient id="office-laptop-deck" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#43526C" />
          <stop offset="100%" stopColor="#242C3D" />
        </linearGradient>
        <radialGradient id="office-lens" cx="36%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#F4FBFF" stopOpacity="0.85" />
          <stop offset="45%" stopColor="#CFE8FB" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#9CC2E8" stopOpacity="0.35" />
        </radialGradient>
        <linearGradient id="office-metal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F0F4F9" />
          <stop offset="50%" stopColor="#C1CBD9" />
          <stop offset="100%" stopColor="#96A2B5" />
        </linearGradient>
        <linearGradient id="office-mega-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF7C46" />
          <stop offset="55%" stopColor="#FF5722" />
          <stop offset="100%" stopColor="#D6420E" />
        </linearGradient>
        <linearGradient id="office-mega-bell" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFE2A4" />
          <stop offset="100%" stopColor="#EFB04A" />
        </linearGradient>
        <linearGradient id="office-mug" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E0DBD0" />
        </linearGradient>
        <linearGradient id="office-cream" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F8F3EA" />
          <stop offset="100%" stopColor="#DFD5C2" />
        </linearGradient>
        <radialGradient id="office-btn" cx="38%" cy="32%" r="80%">
          <stop offset="0%" stopColor="#FF8A57" />
          <stop offset="100%" stopColor="#D6420E" />
        </radialGradient>
        <linearGradient id="office-pot" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#CE5A32" />
          <stop offset="100%" stopColor="#9C3D1D" />
        </linearGradient>
        <linearGradient id="office-bin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3E4A66" />
          <stop offset="100%" stopColor="#272F44" />
        </linearGradient>
        <linearGradient id="office-board" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#EEF1F6" />
        </linearGradient>
        <linearGradient id="office-frame" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FBFCFE" />
          <stop offset="100%" stopColor="#E2E6ED" />
        </linearGradient>
        <radialGradient id="office-clock-face" cx="42%" cy="35%" r="80%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E7EBF1" />
        </radialGradient>
        <linearGradient id="office-cavity-top" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#05080E" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#05080E" stopOpacity="0" />
        </linearGradient>

        {/* Zachte slagschaduw voor muurobjecten en meubels */}
        <filter id="office-soft" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <filter id="office-soft-sm" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3.5" />
        </filter>
      </defs>

      {/* ============ ACHTERGROND: muur, raam, nacht ============ */}
      <motion.g style={reduce ? undefined : { x: backX, y: backY }}>
        <rect x="-40" y="-30" width="1680" height="672" fill="url(#office-wall)" />

        {/* Warme lichtvlek van de hanglamp op de muur */}
        <ellipse cx="790" cy="330" rx="330" ry="270" fill="url(#office-lamp-pool)" />

        {/* Plint met highlight, vloer met plankvoegen */}
        <rect x="-40" y="632" width="1680" height="12" fill="#141824" />
        <rect x="-40" y="631" width="1680" height="1.5" fill="#3B4356" opacity="0.7" />
        <rect x="-40" y="642" width="1680" height="290" fill="url(#office-floor)" />
        <g stroke="#0F131C" strokeWidth="2" opacity="0.55">
          <line x1="-40" y1="702" x2="1640" y2="702" />
          <line x1="-40" y1="766" x2="1640" y2="766" />
          <line x1="-40" y1="834" x2="1640" y2="834" />
        </g>
        {/* Koel maanlicht valt door het raam op de vloer */}
        <path d="M1030 642 L1490 642 L1568 860 L1130 860 Z" fill="#8FB4DC" opacity="0.045" />

        {/* Dartbord: drie pijltjes, allemaal (bijna) raak */}
        <g>
          <circle cx="691" cy="250" r="30" fill="#070A11" opacity="0.45" filter="url(#office-soft-sm)" />
          <circle cx="688" cy="246" r="30" fill={INK} />
          <circle cx="688" cy="246" r="26" fill="#EDE7DE" stroke={INK} strokeWidth="2.5" />
          <g stroke={INK} strokeWidth="1.4" opacity="0.25">
            <line x1="662" y1="246" x2="714" y2="246" />
            <line x1="688" y1="220" x2="688" y2="272" />
            <line x1="670" y1="228" x2="706" y2="264" />
            <line x1="706" y1="228" x2="670" y2="264" />
          </g>
          <circle cx="688" cy="246" r="17" fill="#39435A" />
          <circle cx="688" cy="246" r="10" fill="#EDE7DE" />
          <circle cx="688" cy="246" r="4.5" fill="#FF5722" stroke={INK} strokeWidth="1.8" />
          {/* Twee darts in de roos, eentje nét niet */}
          <g strokeLinecap="round">
            <line x1="712" y1="221" x2="690" y2="244" stroke={INK} strokeWidth="2.6" />
            <path d="M712 221 L720 210 L716 224 Z" fill="#FF5722" stroke={INK} strokeWidth="1.4" strokeLinejoin="round" />
            <line x1="665" y1="222" x2="686" y2="243" stroke={INK} strokeWidth="2.6" />
            <path d="M665 222 L656 212 L661 226 Z" fill="#FF5722" stroke={INK} strokeWidth="1.4" strokeLinejoin="round" />
            <line x1="716" y1="274" x2="700" y2="258" stroke={INK} strokeWidth="2.6" />
            <path d="M716 274 L725 283 L719 270 Z" fill="#FFD54F" stroke={INK} strokeWidth="1.4" strokeLinejoin="round" />
          </g>
        </g>

        {/* Raam met nachtlucht */}
        <g>
          <rect x="1022" y="102" width="482" height="446" rx="18" fill="#070A11" opacity="0.5" filter="url(#office-soft)" />
          <rect x="1014" y="94" width="482" height="446" rx="18" fill="#11151E" />
          <rect x="1030" y="110" width="450" height="414" rx="10" fill="url(#office-sky)" />

          <circle cx="1120" cy="196" r="58" fill="url(#office-moon-halo)" />
          <circle cx="1120" cy="196" r="33" fill="#F2ECDA" />
          <circle cx="1108" cy="188" r="6" fill="#E3DCC4" opacity="0.7" />
          <circle cx="1131" cy="205" r="4.5" fill="#E3DCC4" opacity="0.6" />

          {STARS.map((s) => (
            <motion.circle
              key={`${s.x}-${s.y}`}
              cx={s.x}
              cy={s.y}
              r={s.r}
              fill="#E8EDF6"
              initial={{ opacity: 0.35 }}
              animate={idle ? { opacity: [0.25, 0.9, 0.25] } : undefined}
              transition={{ duration: 2.6, repeat: Infinity, delay: s.d, ease: "easeInOut" }}
            />
          ))}

          {/* Af en toe een vallende ster */}
          {idle ? (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 1, 0], x: [0, 0, -70, -112], y: [0, 0, 34, 54] }}
              transition={{ duration: 11, times: [0, 0.86, 0.93, 1], repeat: Infinity, ease: "easeOut" }}
            >
              <line x1="1408" y1="142" x2="1438" y2="127" stroke="#E8EDF6" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="1408" cy="142" r="2.2" fill="#FFFFFF" />
            </motion.g>
          ) : null}

          {/* Skyline met verlichte raampjes */}
          <g>
            <rect x="1040" y="428" width="62" height="96" fill="#171E2C" />
            <rect x="1106" y="392" width="56" height="132" fill="#141A27" />
            <rect x="1166" y="452" width="72" height="72" fill="#171E2C" />
            <rect x="1242" y="408" width="60" height="116" fill="#141A27" />
            <rect x="1306" y="446" width="52" height="78" fill="#171E2C" />
            <rect x="1362" y="404" width="64" height="120" fill="#141A27" />
            <rect x="1430" y="460" width="50" height="64" fill="#171E2C" />
            {[
              [1052, 444], [1074, 466], [1118, 410], [1140, 438], [1118, 470],
              [1254, 424], [1276, 452], [1318, 462], [1374, 420], [1398, 448],
              [1374, 478], [1442, 474],
            ].map(([wx, wy]) => (
              <rect key={`${wx}-${wy}`} x={wx} y={wy} width="9" height="11" rx="1.5" fill="#FFB74D" opacity="0.85" />
            ))}
          </g>

          {/* Raamstijlen plus schuine glasreflectie */}
          <rect x="1250" y="110" width="10" height="414" fill="#11151E" />
          <rect x="1030" y="308" width="450" height="10" fill="#11151E" />
          <path d="M1332 110 L1396 110 L1258 524 L1204 524 Z" fill="#DCEBFF" opacity="0.045" />
          <rect x="1004" y="530" width="502" height="16" rx="5" fill="#11151E" />
          <rect x="1004" y="530" width="502" height="3" rx="1.5" fill="#39435A" opacity="0.8" />
        </g>

        {/* Slapende kat op de vensterbank, met randje maanlicht op de rug */}
        <g>
          <motion.path
            d="M1310 512 C1290 512 1284 494 1293 480"
            fill="none"
            stroke="#14181F"
            strokeWidth="8"
            strokeLinecap="round"
            animate={idle ? { rotate: [0, 16, 0] } : undefined}
            transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformBox: "fill-box", transformOrigin: "100% 100%" }}
          />
          <ellipse cx="1338" cy="514" rx="30" ry="15" fill="#14181F" />
          <path d="M1312 508 Q1338 494 1364 502" fill="none" stroke="#5E7397" strokeWidth="2.5" strokeLinecap="round" opacity="0.55" />
          <circle cx="1368" cy="504" r="12" fill="#14181F" />
          <path d="M1360 495 L1363 485 L1368 494 Z" fill="#14181F" />
          <path d="M1370 494 L1375 484 L1378 494 Z" fill="#14181F" />
          <path d="M1362 505 q3 2 6 0" fill="none" stroke="#F3C65B" strokeWidth="1.4" strokeLinecap="round" opacity="0.9" />
          <path d="M1371 505 q3 2 6 0" fill="none" stroke="#F3C65B" strokeWidth="1.4" strokeLinecap="round" opacity="0.9" />
        </g>

        {/* Klok: wijzers draaien met SVG animateTransform exact rond (585,185) */}
        <g>
          <circle cx="588" cy="191" r="27" fill="#070A11" opacity="0.45" filter="url(#office-soft-sm)" />
          <circle cx="585" cy="185" r="27" fill="url(#office-clock-face)" stroke={INK} strokeWidth="4" />
          <path d="M566 168 a27 27 0 0 1 20 -9" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
          <line x1="585" y1="163" x2="585" y2="168" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="607" y1="185" x2="602" y2="185" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="585" y1="207" x2="585" y2="202" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="563" y1="185" x2="568" y2="185" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />

          {/* Minutenwijzer */}
          <line
            x1="585" y1="188" x2="585" y2="166"
            stroke={INK} strokeWidth="3" strokeLinecap="round"
            transform="rotate(120 585 185)"
          >
            {idle ? (
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="120 585 185"
                to="480 585 185"
                dur="24s"
                repeatCount="indefinite"
              />
            ) : null}
          </line>
          {/* Urenwijzer */}
          <line
            x1="585" y1="188" x2="585" y2="172"
            stroke={INK} strokeWidth="3.5" strokeLinecap="round"
            transform="rotate(45 585 185)"
          >
            {idle ? (
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="45 585 185"
                to="405 585 185"
                dur="288s"
                repeatCount="indefinite"
              />
            ) : null}
          </line>
          {/* Secondewijzer in merk-oranje */}
          <line
            x1="585" y1="190" x2="585" y2="164"
            stroke="#FF5722" strokeWidth="1.6" strokeLinecap="round"
            transform="rotate(210 585 185)"
          >
            {idle ? (
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="210 585 185"
                to="570 585 185"
                dur="8s"
                repeatCount="indefinite"
              />
            ) : null}
          </line>
          <circle cx="585" cy="185" r="2.8" fill={INK} />
          <circle cx="584.2" cy="184.2" r="0.9" fill="#5B6478" />
        </g>

        {/* Ingelijst portret: de kantoorkat, medewerker van de maand */}
        <g>
          <rect x="874" y="170" width="118" height="146" rx="6" fill="#070A11" opacity="0.45" filter="url(#office-soft-sm)" />
          <rect x="868" y="162" width="118" height="146" rx="6" fill="#C9A227" stroke={INK} strokeWidth="4" />
          <rect x="871" y="165" width="112" height="4" rx="2" fill="#E5C25A" opacity="0.9" />
          <rect x="878" y="172" width="98" height="124" rx="4" fill="#F5EDE0" stroke={INK} strokeWidth="2.5" />

          {/* Oren boven het gezicht */}
          <path d="M902 210 L909 194 L918 208 Z" fill="#E8A04A" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M936 208 L945 194 L952 210 Z" fill="#E8A04A" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
          <ellipse cx="927" cy="232" rx="33" ry="29" fill="#E8A04A" stroke={INK} strokeWidth="3" />
          <ellipse cx="919" cy="222" rx="14" ry="9" fill="#F5C078" opacity="0.55" />

          {/* Ogen, neus */}
          <ellipse cx="915" cy="226" rx="5" ry="6.5" fill="url(#office-eye)" stroke={INK} strokeWidth="2" />
          <ellipse cx="939" cy="226" rx="5" ry="6.5" fill="url(#office-eye)" stroke={INK} strokeWidth="2" />
          <circle cx="916" cy="227" r="2.2" fill={INK} />
          <circle cx="940" cy="227" r="2.2" fill={INK} />
          <circle cx="915.3" cy="226.2" r="0.7" fill="#FFFFFF" />
          <circle cx="939.3" cy="226.2" r="0.7" fill="#FFFFFF" />
          <path d="M923 238 L931 238 L927 243 Z" fill="#F2B285" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />

          {/* Whiskers, symmetrisch */}
          <path d="M896 232 L910 234 M896 242 L910 240" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
          <path d="M958 232 L944 234 M958 242 L944 240" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />

          {/* Snorretje net als de baas, gecentreerd op 927 */}
          <path
            d="M916 250 C919 246.5 924 246.8 927 249.2 C930 246.8 935 246.5 938 250 C937 252.8 933 253.8 927 252.2 C921 253.8 917 252.8 916 250 Z"
            fill={INK}
          />
          <path d="M921 256.5 C924 258.5 930 258.5 933 256.5" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />

          {/* Mini-bolhoed */}
          <path d="M913 194 a14 12 0 0 1 28 0 v1 h-28 z" fill="url(#office-hat)" />
          <rect x="914" y="190" width="26" height="4" fill="#FF5722" />
          <rect x="906" y="193.4" width="42" height="4.6" rx="2.3" fill={INK} />

          {/* Naamplaatje en glans over het glas */}
          <rect x="884" y="280" width="86" height="12" rx="3" fill="#EDE7DE" stroke={INK} strokeWidth="1.5" />
          <text x="927" y="289" textAnchor="middle" fontSize="7.5" fontWeight="700" fill={INK} letterSpacing="0.06em">
            KAT VAN DE MAAND
          </text>
          <path d="M886 172 L912 172 L890 296 L880 296 Z" fill="#FFFFFF" opacity="0.06" />
        </g>
      </motion.g>

      {/* ============ MIDDENLAAG: whiteboard en lamp ============ */}
      <motion.g style={reduce ? undefined : { x: midX, y: midY }}>
        {/* Strategiebord */}
        <ClickablePillar id="strategie" hintDelay={0} {...clickProps}>
          <g>
            <rect x="138" y="150" width="322" height="252" rx="14" fill="#070A11" opacity="0.5" filter="url(#office-soft)" />
            <rect x="130" y="140" width="322" height="252" rx="14" fill="url(#office-frame)" stroke={INK} strokeWidth="5" />
            <rect x="142" y="152" width="298" height="228" rx="8" fill="url(#office-board)" />
            {/* Schroefjes in het frame */}
            <circle cx="150" cy="160" r="3" fill="#AAB4C4" stroke={INK} strokeWidth="1.4" />
            <circle cx="432" cy="160" r="3" fill="#AAB4C4" stroke={INK} strokeWidth="1.4" />
            <circle cx="150" cy="372" r="3" fill="#AAB4C4" stroke={INK} strokeWidth="1.4" />
            <circle cx="432" cy="372" r="3" fill="#AAB4C4" stroke={INK} strokeWidth="1.4" />

            {/* Stiftbakje met stift plus dop */}
            <rect x="200" y="392" width="182" height="12" rx="5" fill="#C9CFDA" stroke={INK} strokeWidth="2.5" />
            <rect x="200" y="392" width="182" height="3.5" rx="1.75" fill="#EDF0F5" opacity="0.9" />
            <rect x="222" y="386" width="34" height="8" rx="4" fill="#FF5722" stroke={INK} strokeWidth="2" />
            <rect x="250" y="386" width="7" height="8" rx="3" fill={INK} />

            <rect x="162" y="162" width="82" height="8" rx="4" fill="#C7CEDA" />
            <rect x="162" y="177" width="52" height="7" rx="3.5" fill="#DDE2EA" />

            {/* Post-its met omgekruld hoekje en eigen schaduwtje */}
            <g transform="rotate(6 385 182)">
              <rect x="368" y="166" width="40" height="40" rx="3" fill="#0B0F17" opacity="0.14" />
              <rect x="365" y="162" width="40" height="40" rx="3" fill="#FFD54F" stroke={INK} strokeWidth="2" />
              <path d="M405 192 L405 202 L395 202 Z" fill="#E3B32F" />
              <path d="M373 176 h24 M373 185 h18" stroke={INK} strokeWidth="1.8" strokeLinecap="round" opacity="0.55" />
            </g>
            <g transform="rotate(-8 336 176)">
              <rect x="321" y="162" width="36" height="36" rx="3" fill="#0B0F17" opacity="0.14" />
              <rect x="318" y="158" width="36" height="36" rx="3" fill="#7EDCE2" stroke={INK} strokeWidth="2" />
              <path d="M354 184 L354 194 L344 194 Z" fill="#5BBFC6" />
              <path d="M325 170 h22 M325 178 h15" stroke={INK} strokeWidth="1.8" strokeLinecap="round" opacity="0.55" />
            </g>

            {/* Grafiek met raster */}
            <g stroke="#E3E8F0" strokeWidth="1.5">
              <line x1="172" y1="238" x2="420" y2="238" />
              <line x1="172" y1="278" x2="420" y2="278" />
              <line x1="172" y1="318" x2="420" y2="318" />
            </g>
            <path d="M172 358 V196 M172 358 H420" stroke="#94A3B8" strokeWidth="3.5" strokeLinecap="round" />
            <motion.path
              d="M182 344 L236 318 L276 332 L330 272 L360 284 L408 218"
              fill="none"
              stroke="#FF5722"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 1 }}
              animate={idle ? { pathLength: [0, 1, 1] } : undefined}
              transition={{ duration: 3.2, times: [0, 0.7, 1], repeat: Infinity, repeatDelay: 2.6, ease: "easeInOut" }}
            />
            <path d="M408 218 L390 220 M408 218 L404 235" stroke="#FF5722" strokeWidth="6" strokeLinecap="round" />
          </g>
        </ClickablePillar>

        {/* Hanglamp met plafondbevestiging, gloeiende peer en lichtkegel */}
        <g>
          <rect x="782" y="-12" width="16" height="8" rx="3" fill={INK} />
          <line x1="790" y1="-10" x2="790" y2="142" stroke={INK} strokeWidth="4" />
          <motion.path
            d="M752 186 L828 186 L960 585 L622 585 Z"
            fill="url(#office-lamp-cone)"
            initial={{ opacity: 0.3 }}
            animate={idle ? { opacity: [0.26, 0.4, 0.26] } : undefined}
            transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
          />
          <path d="M762 142 L818 142 L836 186 L744 186 Z" fill="url(#office-mega-body)" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
          <path d="M766 148 L778 148 L770 180 L758 180 Z" fill="#FFB74D" opacity="0.35" />
          <circle cx="790" cy="192" r="26" fill="url(#office-bulb)" />
          <ellipse cx="790" cy="188" rx="26" ry="7" fill="#FFD180" opacity="0.95" />
          <ellipse cx="790" cy="187" rx="12" ry="4" fill="#FFEDC2" />
        </g>

        {/* Een motje cirkelt om het lamplicht */}
        <g>
          <g transform="translate(834 204)">
            <ellipse cx="-2.5" cy="0" rx="3" ry="5" fill="#E4DBC2" opacity="0.9" transform="rotate(-24 -2.5 0)" />
            <ellipse cx="2.5" cy="0" rx="3" ry="5" fill="#E4DBC2" opacity="0.9" transform="rotate(24 2.5 0)" />
            <line x1="0" y1="-3.5" x2="0" y2="3.5" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
          </g>
          {idle ? (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 790 204"
              to="360 790 204"
              dur="9s"
              repeatCount="indefinite"
            />
          ) : null}
        </g>
      </motion.g>

      {/* ============ BUREAULAAG: mascotte, bureau en objecten ============ */}
      <motion.g style={reduce ? undefined : { x: deskX, y: deskY }}>
        {/* Vloerkleed met dubbele rand */}
        <ellipse cx="800" cy="745" rx="432" ry="58" fill="url(#office-rug)" />
        <ellipse
          cx="800"
          cy="745"
          rx="378"
          ry="44"
          fill="none"
          stroke="#FF5722"
          strokeOpacity="0.25"
          strokeWidth="3"
          strokeDasharray="14 10"
        />
        <ellipse cx="800" cy="745" rx="302" ry="33" fill="none" stroke="#39435F" strokeWidth="2" opacity="0.8" />

        {/* Donkere holte onder het bureau, zodat er echt ruimte achter zit */}
        <rect x="582" y="598" width="634" height="152" fill="#0A0E16" opacity="0.55" />

        {/* Bureaustoel-onderstel: gasveer, stervoet en wieltjes */}
        <g>
          <rect x="767" y="606" width="16" height="106" rx="4" fill="url(#office-column)" stroke={INK} strokeWidth="2" />
          <rect x="759" y="648" width="32" height="9" rx="4" fill="#333D58" stroke={INK} strokeWidth="2" />
          <g strokeLinecap="round">
            <path d="M775 712 L707 738 M775 712 L775 746 M775 712 L843 738" stroke={INK} strokeWidth="15" />
            <path d="M775 712 L707 738 M775 712 L775 746 M775 712 L843 738" stroke="#333D58" strokeWidth="10" />
          </g>
          {[
            [707, 740],
            [775, 748],
            [843, 740],
          ].map(([wx, wy]) => (
            <g key={`${wx}-${wy}`}>
              <circle cx={wx} cy={wy} r="8" fill="#11151E" stroke={INK} strokeWidth="2.5" />
              <circle cx={wx - 2.2} cy={wy - 2.2} r="2" fill="#4A5568" />
            </g>
          ))}
        </g>

        {/* Zittende benen: onderbenen gevouwen richting de stoel, voeten
            naast de gasveer — plus oranje sokken boven nette schoenen */}
        <g>
          <path d="M747 612 Q750 652 752 684" fill="none" stroke="#242C3E" strokeWidth="26" strokeLinecap="round" />
          <path d="M803 612 Q800 652 798 684" fill="none" stroke="#242C3E" strokeWidth="26" strokeLinecap="round" />
          <path d="M740 630 Q742 658 744 680" fill="none" stroke="#303A50" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
          <path d="M810 630 Q808 658 806 680" fill="none" stroke="#1B2230" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
          {/* Sokken */}
          <rect x="742" y="678" width="21" height="11" rx="5.5" fill="#FF5722" stroke={INK} strokeWidth="2" />
          <rect x="787" y="678" width="21" height="11" rx="5.5" fill="#FF5722" stroke={INK} strokeWidth="2" />
          <path d="M745 683.5 h15 M790 683.5 h15" stroke="#FFE8D6" strokeWidth="2" strokeLinecap="round" />
          {/* Schoenen, tenen naar buiten, plat op het kleed */}
          <g transform="rotate(-4 744 699)">
            <ellipse cx="742" cy="699" rx="18" ry="7.5" fill="#171B26" stroke={INK} strokeWidth="2.5" />
            <ellipse cx="733" cy="696.5" rx="6" ry="2.4" fill="#39435A" opacity="0.9" />
          </g>
          <g transform="rotate(4 806 699)">
            <ellipse cx="808" cy="699" rx="18" ry="7.5" fill="#171B26" stroke={INK} strokeWidth="2.5" />
            <ellipse cx="817" cy="696.5" rx="6" ry="2.4" fill="#39435A" opacity="0.9" />
          </g>
        </g>

        {/* Schaduw die het bureaublad in de holte werpt */}
        <rect x="582" y="598" width="634" height="48" fill="url(#office-cavity-top)" />

        {/* Bureaustoel met hoofdsteun en stiksels */}
        <rect x="682" y="378" width="186" height="212" rx="26" fill="url(#office-chair)" stroke={INK} strokeWidth="3.5" />
        <rect x="694" y="392" width="162" height="8" rx="4" fill="#5A678C" opacity="0.7" />
        <path d="M700 430 h150 M700 470 h150" stroke="#2A3349" strokeWidth="3" strokeLinecap="round" opacity="0.8" />

        {/* Lijf: pak met revers, overhemd, stropdas, pochet en knopen */}
        <path
          d="M710 600 L710 505 Q710 470 745 468 L805 468 Q840 470 840 505 L840 600 Z"
          fill="url(#office-suit)"
          stroke={INK}
          strokeWidth="3.5"
        />
        <path d="M716 496 Q714 474 744 471 L804 471 Q834 474 834 496" fill="none" stroke="#4E5A7A" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
        <path d="M756 468 L775 502 L794 468 Z" fill="#FEFCFC" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M756 468 L744 502 L768 514 L775 502 Z" fill="#222A3C" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M794 468 L806 502 L782 514 L775 502 Z" fill="#222A3C" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M770 486 L775 502 L780 486 L775 478 Z" fill="#FF5722" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
        <path d="M812 516 L834 514 L826 530 Z" fill="#FF5722" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
        <circle cx="775" cy="540" r="3" fill={INK} />
        <circle cx="775" cy="562" r="3" fill={INK} />
        {/* Linkerarm plus hand; rechterhand komt straks óp de muis te liggen */}
        <path d="M714 508 Q678 548 660 584" fill="none" stroke="#2E3648" strokeWidth="22" strokeLinecap="round" />
        <path d="M710 505 Q675 544 657 580" fill="none" stroke="#47526D" strokeWidth="6" strokeLinecap="round" opacity="0.65" />
        <path d="M836 508 Q874 544 892 574" fill="none" stroke="#2E3648" strokeWidth="22" strokeLinecap="round" />
        <path d="M840 505 Q877 540 895 570" fill="none" stroke="#47526D" strokeWidth="6" strokeLinecap="round" opacity="0.65" />
        <circle cx="660" cy="586" r="11" fill="#F8CBA3" stroke={INK} strokeWidth="2.5" />

        {/* Hoofd van Meneer Marketing, pupillen volgen de cursor */}
        <g transform="translate(692 318) scale(2.6)">
          <ellipse cx="14.7" cy="42" rx="2.9" ry="3.4" fill="#F6C09A" stroke={INK} strokeWidth="1.3" />
          <ellipse cx="49.3" cy="42" rx="2.9" ry="3.4" fill="#F6C09A" stroke={INK} strokeWidth="1.3" />
          <ellipse cx="14.7" cy="42.4" rx="1.3" ry="1.8" fill="#E7A877" opacity="0.6" />
          <ellipse cx="49.3" cy="42.4" rx="1.3" ry="1.8" fill="#E7A877" opacity="0.6" />
          <ellipse cx="32" cy="41" rx="17" ry="16.6" fill="url(#office-skin)" stroke={INK} strokeWidth="1.5" />

          {/* Alle schaduw en licht op het gezicht blijft binnen de hoofdvorm */}
          <g clipPath="url(#office-head-clip)">
            <ellipse cx="32" cy="30.4" rx="18.5" ry="3.6" fill="#D89B6C" opacity="0.4" />
            <ellipse cx="24.5" cy="51" rx="10" ry="5" fill="#E8A876" opacity="0.28" transform="rotate(-18 24.5 51)" />
            <ellipse cx="20.6" cy="47" rx="2.5" ry="1.5" fill="#F2A075" opacity="0.5" />
            <ellipse cx="43.4" cy="47" rx="2.5" ry="1.5" fill="#F2A075" opacity="0.5" />
            {/* Koele schermgloed van de laptop op zijn linkerwang */}
            <motion.ellipse
              cx="23"
              cy="42"
              rx="7.5"
              ry="10"
              fill="#4FC3F7"
              initial={{ opacity: 0.06 }}
              animate={idle ? { opacity: [0.05, 0.13, 0.05] } : undefined}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </g>

          {/* Wenkbrauwen geven het gezicht karakter */}
          <path d="M20.5 27.8 Q26 24.8 31 27" fill="none" stroke={INK} strokeWidth="1.7" strokeLinecap="round" />
          <path d="M33 27 Q38 24.8 43.5 27.8" fill="none" stroke={INK} strokeWidth="1.7" strokeLinecap="round" />

          <ellipse cx={LEFT_EYE.cx} cy={LEFT_EYE.cy} rx={EYE_RX} ry={EYE_RY} fill="url(#office-eye)" stroke={INK} strokeWidth="1.3" />
          <motion.circle cx={leftPupilX} cy={leftPupilY} r={PUPIL_R} fill={INK} />
          <motion.circle cx={leftGlintX} cy={leftGlintY} r={0.8} fill="#FFFFFF" />
          {blink ? (
            <motion.ellipse
              cx={LEFT_EYE.cx}
              cy={LEFT_EYE.cy}
              rx={EYE_RX - 0.7}
              ry={EYE_RY - 0.7}
              fill="#F4EEE3"
              initial={{ scaleY: 0 }}
              animate={blink}
              style={{ transformBox: "fill-box", transformOrigin: "50% 0%" }}
            />
          ) : null}

          <ellipse cx={RIGHT_EYE.cx} cy={RIGHT_EYE.cy} rx={EYE_RX} ry={EYE_RY} fill="url(#office-eye)" stroke={INK} strokeWidth="1.3" />
          <motion.circle cx={rightPupilX} cy={rightPupilY} r={PUPIL_R} fill={INK} />
          <motion.circle cx={rightGlintX} cy={rightGlintY} r={0.8} fill="#FFFFFF" />
          {blink ? (
            <motion.ellipse
              cx={RIGHT_EYE.cx}
              cy={RIGHT_EYE.cy}
              rx={EYE_RX - 0.7}
              ry={EYE_RY - 0.7}
              fill="#F4EEE3"
              initial={{ scaleY: 0 }}
              animate={blink}
              style={{ transformBox: "fill-box", transformOrigin: "50% 0%" }}
            />
          ) : null}

          {/* Neus met glimmertje */}
          <ellipse cx="32" cy="43.6" rx="3.3" ry="2.3" fill="#F2B285" stroke={INK} strokeWidth="1.2" />
          <ellipse cx="30.9" cy="42.9" rx="1.1" ry="0.7" fill="#FBD9B8" opacity="0.95" />
          {/* Snor met sheen */}
          <path
            d="M23.2 48.6 C25.4 45.6 29.6 45.9 32 47.9 C34.4 45.9 38.6 45.6 40.8 48.6 C40 51.3 36.1 52.2 32 50.3 C27.9 52.2 24 51.3 23.2 48.6 Z"
            fill={INK}
          />
          <path d="M25.4 47.9 Q28.5 46.4 31 47.6" fill="none" stroke="#3C4457" strokeWidth="0.9" strokeLinecap="round" opacity="0.9" />
          <path d="M28.4 54.2c2.3 1.5 4.9 1.5 7.2 0" fill="none" stroke={INK} strokeWidth="1.3" strokeLinecap="round" />
          {/* Bolhoed met gradient, glans en oranje band */}
          <path d="M19 24.6a13 12.2 0 0 1 26 0v0.9h-26z" fill="url(#office-hat)" />
          <path d="M21.6 20.5 a12 11 0 0 1 8 -7" fill="none" stroke="#4A5468" strokeWidth="1.6" strokeLinecap="round" opacity="0.9" />
          <rect x="19.8" y="20.7" width="24.4" height="4" fill="#FF5722" />
          <rect x="19.8" y="20.7" width="24.4" height="1.3" fill="#FF8A5C" opacity="0.8" />
          <rect x="11.5" y="23.8" width="41" height="4.4" rx="2.2" fill={INK} />
          <rect x="12.8" y="24.4" width="38.4" height="1.2" rx="0.6" fill="#3C4457" opacity="0.9" />
        </g>

        {/* ===== Bureau: compact, met ladenblok, poot en naamplaatje ===== */}
        <g>
          <rect x="396" y="583" width="892" height="20" rx="7" fill="url(#office-wood-top)" stroke={INK} strokeWidth="3" />
          <line x1="410" y1="586.5" x2="1274" y2="586.5" stroke="#D9A570" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
          <g stroke="#C08A5C" strokeWidth="1.4" strokeLinecap="round" opacity="0.35" fill="none">
            <path d="M470 592 q90 3 210 0 q120 -3 240 1" />
            <path d="M560 597 q140 -3 300 0 q150 3 260 -1" />
          </g>
          <rect x="406" y="603" width="872" height="13" fill="url(#office-wood-front)" stroke={INK} strokeWidth="2.5" />

          {/* Messing naamplaatje op de voorrand */}
          <rect x="794" y="604.5" width="96" height="10" rx="2" fill="url(#office-brass)" stroke={INK} strokeWidth="1.5" />
          <text x="842" y="612" textAnchor="middle" fontSize="6.4" fontWeight="800" fill={INK} letterSpacing="0.08em">
            MENEER MARKETING
          </text>

          {/* Ladenblok links, met bovenste la op een kier */}
          <rect x="436" y="616" width="138" height="140" fill="url(#office-wood-front)" stroke={INK} strokeWidth="3" />
          <g>
            <rect x="448" y="624" width="114" height="36" rx="4" fill="url(#office-wood-drawer)" stroke={INK} strokeWidth="2.2" transform="translate(0 3)" />
            <path d="M470 626 h70" stroke="#F5EDE0" strokeWidth="6" strokeLinecap="round" />
            <rect x="448" y="672" width="114" height="36" rx="4" fill="url(#office-wood-drawer)" stroke={INK} strokeWidth="2.2" />
            <rect x="448" y="714" width="114" height="36" rx="4" fill="url(#office-wood-drawer)" stroke={INK} strokeWidth="2.2" />
            {[644, 690, 732].map((hy) => (
              <rect key={hy} x="488" y={hy} width="34" height="6" rx="3" fill="#3B2A18" stroke={INK} strokeWidth="1.6" />
            ))}
          </g>

          {/* Rechterpoot met voetje */}
          <rect x="1222" y="616" width="28" height="136" fill="url(#office-wood-front)" stroke={INK} strokeWidth="3" />
          <rect x="1214" y="750" width="44" height="8" rx="3" fill="#452A14" stroke={INK} strokeWidth="2" />
          <rect x="428" y="754" width="154" height="8" rx="3" fill="#452A14" stroke={INK} strokeWidth="2" />

          {/* Warme lichtplas van de hanglamp op het blad */}
          <ellipse cx="790" cy="590" rx="160" ry="9" fill="#FFB74D" opacity="0.1" />
        </g>

        {/* Zachte vloerschaduwen onder meubels */}
        <g fill="#05070C" opacity="0.4" filter="url(#office-soft)" aria-hidden>
          <ellipse cx="505" cy="762" rx="92" ry="9" />
          <ellipse cx="1236" cy="760" rx="42" ry="7" />
          <ellipse cx="775" cy="752" rx="112" ry="10" />
          <ellipse cx="352" cy="746" rx="52" ry="7" />
        </g>

        {/* Prullenbak met propjes naast het bureau */}
        <g>
          <path d="M322 668 L382 668 L374 742 L330 742 Z" fill="url(#office-bin)" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
          <path d="M330 674 L338 674 L333 736 L327 736 Z" fill="#4E5B7C" opacity="0.6" />
          <circle cx="341" cy="656" r="8.5" fill="#EDE7DE" stroke={INK} strokeWidth="2" />
          <circle cx="359" cy="652" r="6.5" fill="#F5EFE4" stroke={INK} strokeWidth="2" />
          <rect x="316" y="660" width="72" height="12" rx="5" fill="#333D58" stroke={INK} strokeWidth="3" />
          <circle cx="399" cy="740" r="7" fill="#EDE7DE" stroke={INK} strokeWidth="2" />
        </g>

        {/* Contactschaduwen zodat objecten op het blad staan */}
        <g fill="#0B0F17" opacity="0.32" aria-hidden>
          <ellipse cx="541" cy="586" rx="96" ry="5.5" />
          <ellipse cx="666" cy="586" rx="24" ry="4.5" />
          <ellipse cx="988" cy="585" rx="60" ry="5" />
          <ellipse cx="1200" cy="581" rx="48" ry="5.5" />
          <ellipse cx="902" cy="584" rx="20" ry="3.5" />
        </g>

        {/* Draadloze muis met zijn rechterhand erop */}
        <g>
          <ellipse cx="902" cy="577" rx="14" ry="8.5" fill="#333D58" stroke={INK} strokeWidth="2.5" />
          <line x1="902" y1="570.5" x2="902" y2="575" stroke="#566180" strokeWidth="2" strokeLinecap="round" />
          <circle cx="893" cy="575" r="11" fill="#F8CBA3" stroke={INK} strokeWidth="2.5" />
          <path d="M886 571 q4 -3 8 -1" fill="none" stroke="#E7A877" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
        </g>

        {/* Bouwlaptop: scherm naar Meneer Marketing gericht, dus wij zien
            het deksel met een gloeiend bolhoed-en-snor-logo */}
        <ClickablePillar id="bouwen" hintDelay={0.7} {...clickProps}>
          <g>
            {/* Schermlicht lekt langs de randen richting zijn kant */}
            <ellipse cx="543" cy="449" rx="92" ry="15" fill="#4FC3F7" opacity="0.12" />
            <ellipse cx="612" cy="586" rx="42" ry="6" fill="#4FC3F7" opacity="0.12" />

            {/* Opgerolde blauwdruk naast de laptop */}
            <g>
              <rect x="406" y="571" width="46" height="13" rx="6.5" fill="#7FB3D9" stroke={INK} strokeWidth="2.5" />
              <rect x="422" y="571" width="9" height="13" fill="#FEFCFC" opacity="0.9" />
              <ellipse cx="452" cy="577.5" rx="4.5" ry="6.5" fill="#DCEBF7" stroke={INK} strokeWidth="2" />
              <circle cx="452" cy="577.5" r="1.8" fill="#7FB3D9" />
            </g>

            {/* Deksel, licht in perspectief naar achteren hellend */}
            <path
              d="M478 447 Q543 444 608 447 L624 562 Q543 566 462 562 Z"
              fill="url(#office-laptop-shell)"
              stroke={INK}
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* Koel randlicht van het scherm dat erachter brandt */}
            <path d="M481 449 Q543 446 605 449" fill="none" stroke="#4FC3F7" strokeWidth="3" strokeLinecap="round" opacity="0.55" />
            <path d="M609 452 L622 556" fill="none" stroke="#4FC3F7" strokeWidth="2" strokeLinecap="round" opacity="0.3" />

            {/* Gloeiend logo: eerst de gloed, dan het logo zelf */}
            <g filter="url(#office-soft-sm)" opacity="0.65">
              <path d="M527 496 a16 14 0 0 1 32 0 h-32 z" fill="#FF5722" />
              <rect x="517" y="495" width="52" height="6" rx="3" fill="#FF5722" />
              <path d="M521 517 C527 508 538 509 543 515 C548 509 559 508 565 517 C562 524 552 526 543 521 C534 526 524 524 521 517 Z" fill="#FF5722" />
            </g>
            <motion.g
              initial={{ opacity: 0.9 }}
              animate={idle ? { opacity: [0.85, 1, 0.85] } : undefined}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <path d="M527 496 a16 14 0 0 1 32 0 h-32 z" fill="#FF5722" />
              <rect x="517" y="495" width="52" height="6" rx="3" fill="#FF5722" />
              <path d="M521 517 C527 508 538 509 543 515 C548 509 559 508 565 517 C562 524 552 526 543 521 C534 526 524 524 521 517 Z" fill="#FF5722" />
            </motion.g>

            {/* Post-it op het deksel */}
            <g transform="rotate(7 594 470)">
              <rect x="580" y="456" width="30" height="30" rx="2.5" fill="#FFD54F" stroke={INK} strokeWidth="2" />
              <path d="M610 478 L610 486 L602 486 Z" fill="#E3B32F" />
              <path d="M586 466 h18 M586 473 h12" stroke={INK} strokeWidth="1.7" strokeLinecap="round" opacity="0.55" />
            </g>

            {/* Onderkant, gezien vanaf de achterzijde */}
            <rect x="460" y="560" width="166" height="4" rx="2" fill="#05080D" opacity="0.65" />
            <path d="M446 585 L640 585 L628 566 L458 566 Z" fill="url(#office-laptop-deck)" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
            <g fill="#1B2230" opacity="0.9">
              <rect x="502" y="572" width="18" height="4" rx="2" />
              <rect x="534" y="572" width="18" height="4" rx="2" />
              <rect x="566" y="572" width="18" height="4" rx="2" />
            </g>
            <line x1="449" y1="583" x2="637" y2="583" stroke="#67789A" strokeWidth="1.6" opacity="0.7" />
          </g>
        </ClickablePillar>

        {/* Koffie op schoteltje, met snorretje op de mok en stoom */}
        <g>
          <motion.path
            d="M660 540 q6 -10 0 -20 q-6 -10 0 -18"
            fill="none"
            stroke="#94A3B8"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ opacity: 0 }}
            animate={idle ? { opacity: [0, 0.7, 0], y: [4, -8, -14] } : undefined}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.path
            d="M674 542 q6 -10 0 -20 q-6 -10 0 -18"
            fill="none"
            stroke="#94A3B8"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ opacity: 0 }}
            animate={idle ? { opacity: [0, 0.55, 0], y: [4, -10, -16] } : undefined}
            transition={{ duration: 2.8, repeat: Infinity, delay: 1.1, ease: "easeInOut" }}
          />
          <ellipse cx="666" cy="584" rx="27" ry="6" fill="#EDE7DE" stroke={INK} strokeWidth="2.5" />
          <rect x="648" y="548" width="36" height="34" rx="7" fill="url(#office-mug)" stroke={INK} strokeWidth="3" />
          <path d="M680 552 v26" stroke="#C9C2B4" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
          <path
            d="M657.5 564 C659.5 561.6 662.8 561.8 665.5 563.6 C668.2 561.8 671.5 561.6 673.5 564 C672.8 566.2 669.8 567 665.5 565.6 C661.2 567 658.2 566.2 657.5 564 Z"
            fill="#FF5722"
          />
          <ellipse cx="666" cy="549" rx="18" ry="5" fill="#FEFCFC" stroke={INK} strokeWidth="2.5" />
          <ellipse cx="666" cy="549.5" rx="13" ry="3.2" fill="#6F4426" />
          <path d="M659 549 q7 -2.4 14 0" fill="none" stroke="#9C6B44" strokeWidth="1.4" strokeLinecap="round" opacity="0.9" />
          <path d="M684 556 q16 8 0 22" fill="none" stroke={INK} strokeWidth="3" />
        </g>

        {/* Vergrootglas, gedockt in een messing bureaustandaard */}
        <ClickablePillar id="vindbaarheid" hintDelay={1.4} {...clickProps}>
          <g>
            {/* Standaard: verzwaarde voet met klem die het handvat vasthoudt */}
            <ellipse cx="1020" cy="578" rx="24" ry="7" fill="url(#office-brass)" stroke={INK} strokeWidth="3" />
            <path d="M1002 576 a18 8 0 0 1 36 0 z" fill="#E5C25A" opacity="0.55" />
            <rect x="1010" y="556" width="20" height="18" rx="5" fill="url(#office-brass)" stroke={INK} strokeWidth="2.5" />
            <line x1="1014" y1="560" x2="1014" y2="570" stroke="#8F6A1E" strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />

            {/* Houten handvat, van de lensrand schuin de klem in */}
            <line x1="988" y1="552" x2="1022" y2="566" stroke={INK} strokeWidth="16" strokeLinecap="round" />
            <line x1="988" y1="552" x2="1020" y2="565" stroke="#8B5E3C" strokeWidth="10" strokeLinecap="round" />
            <line x1="989" y1="550" x2="1010" y2="559" stroke="#A0714A" strokeWidth="3.5" strokeLinecap="round" />

            {/* Vatting: ink-rand, metalen ring, ink-binnenrand */}
            <circle cx="960" cy="524" r="48" fill="none" stroke={INK} strokeWidth="4" />
            <circle cx="960" cy="524" r="43.5" fill="none" stroke="url(#office-metal)" strokeWidth="6.5" />
            <circle cx="960" cy="524" r="39.5" fill="none" stroke={INK} strokeWidth="2.5" />

            {/* Lens: glasgradient, dubbele highlight en refractierand */}
            <circle cx="960" cy="524" r="38" fill="url(#office-lens)" />
            <circle cx="960" cy="524" r="34.5" fill="none" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.3" />
            <path
              d="M934 509 a30 30 0 0 1 17 -13"
              fill="none"
              stroke="#FEFCFC"
              strokeWidth="6"
              strokeLinecap="round"
              opacity="0.85"
            />
            <circle cx="974" cy="539" r="4" fill="#FFFFFF" opacity="0.6" />
            <path d="M982 504 a30 30 0 0 1 8 12" fill="none" stroke="#BFE3FF" strokeWidth="3" strokeLinecap="round" opacity="0.55" />
            <path d="M938 544 a30 30 0 0 0 16 10" fill="none" stroke="#7FA8CC" strokeWidth="3" strokeLinecap="round" opacity="0.45" />

            {/* Af en toe vangt de lens een fonkeling: iets gevonden */}
            <motion.path
              d="M948 528 L950 522 L952 528 L958 530 L952 532 L950 538 L948 532 L942 530 Z"
              fill="#F3C65B"
              initial={{ opacity: 0 }}
              animate={idle ? { opacity: [0, 0.9, 0], scale: [0.6, 1, 0.6] } : undefined}
              transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 3.8, ease: "easeInOut" }}
              style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
            />
          </g>
        </ClickablePillar>

        {/* Megafoon, stabiel op zijn bel: campagnes de lucht in */}
        <ClickablePillar id="campagnes" hintDelay={2.1} {...clickProps}>
          <g>
            <g transform="rotate(4 1200 540)">
              {/* Bel-lip op het bureau */}
              <ellipse cx="1200" cy="572" rx="40" ry="11" fill="url(#office-mega-bell)" stroke={INK} strokeWidth="3.5" />
              {/* Conus omhoog */}
              <path
                d="M1162 570 C1174 518 1186 498 1191 476 L1209 476 C1214 498 1226 518 1238 570 Z"
                fill="url(#office-mega-body)"
                stroke={INK}
                strokeWidth="4"
                strokeLinejoin="round"
              />
              {/* Crème band, glans links en schaduw rechts */}
              <path d="M1176 522 L1224 522 L1227 536 L1173 536 Z" fill="#FFE8D6" opacity="0.9" />
              <path d="M1176 548 C1182 520 1187 500 1191 484" fill="none" stroke="#FFB74D" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
              <path d="M1224 548 C1218 520 1213 500 1209 484" fill="none" stroke="#A32F08" strokeWidth="4" strokeLinecap="round" opacity="0.45" />
              {/* Handgreep aan de zijkant */}
              <path
                d="M1230 508 C1250 511 1255 530 1246 547 L1236 542 C1242 530 1239 519 1227 516 Z"
                fill="#C43E14"
                stroke={INK}
                strokeWidth="3"
                strokeLinejoin="round"
              />
              {/* Mondstuk bovenop */}
              <rect x="1186" y="455" width="28" height="24" rx="11" fill="#C43E14" stroke={INK} strokeWidth="3.5" />
              <path d="M1192 460 v14" stroke="#E8794C" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
              <ellipse cx="1200" cy="455.5" rx="9" ry="3.5" fill="#8F2D0E" stroke={INK} strokeWidth="2" />
              {/* Klinknagels op de bel-lip */}
              <circle cx="1172" cy="574" r="2.2" fill="#8F5A1E" />
              <circle cx="1200" cy="579" r="2.2" fill="#8F5A1E" />
              <circle cx="1228" cy="574" r="2.2" fill="#8F5A1E" />
            </g>
            {/* Geluidsgolven zweven omhoog */}
            {[
              { d: "M1180 436 q22 -14 44 0", delay: 0 },
              { d: "M1170 412 q32 -20 64 0", delay: 0.25 },
              { d: "M1160 388 q42 -26 84 0", delay: 0.5 },
            ].map((arc) => (
              <motion.path
                key={arc.d}
                d={arc.d}
                fill="none"
                stroke="#F3C65B"
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ opacity: 0 }}
                animate={idle ? { opacity: [0, 0.9, 0], y: [6, -4, -10] } : undefined}
                transition={{ duration: 2, repeat: Infinity, delay: arc.delay, repeatDelay: 1.6, ease: "easeInOut" }}
              />
            ))}
            {/* Kleine sterretjes tussen de golven */}
            {[
              { x: 1252, y: 430, delay: 0.9 },
              { x: 1152, y: 414, delay: 1.5 },
            ].map((star) => (
              <motion.path
                key={`${star.x}-${star.y}`}
                d={`M${star.x} ${star.y - 6} L${star.x + 1.8} ${star.y - 1.8} L${star.x + 6} ${star.y} L${star.x + 1.8} ${star.y + 1.8} L${star.x} ${star.y + 6} L${star.x - 1.8} ${star.y + 1.8} L${star.x - 6} ${star.y} L${star.x - 1.8} ${star.y - 1.8} Z`}
                fill="#F3C65B"
                initial={{ opacity: 0 }}
                animate={idle ? { opacity: [0, 1, 0], scale: [0.6, 1, 0.6] } : undefined}
                transition={{ duration: 2, repeat: Infinity, delay: star.delay, repeatDelay: 1.6, ease: "easeInOut" }}
                style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
              />
            ))}
          </g>
        </ClickablePillar>

        {/* Bijzettafel met mailmachine */}
        <ClickablePillar id="behoud" hintDelay={2.8} {...clickProps}>
          <g>
            <motion.g
              initial={{ y: 44, opacity: 0 }}
              animate={idle ? { y: [44, -26, -44], opacity: [0, 1, 0], rotate: [0, -7, -11] } : undefined}
              transition={{ duration: 2.6, times: [0, 0.55, 1], repeat: Infinity, repeatDelay: 3.4, ease: "easeOut" }}
            >
              <rect x="1421" y="432" width="48" height="32" rx="4" fill="#FEFCFC" stroke={INK} strokeWidth="2.5" />
              <path d="M1421 436 L1445 452 L1469 436" fill="none" stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
              <path d="M1424 462 L1445 449 L1466 462" fill="none" stroke="#D5CFC2" strokeWidth="1.6" strokeLinejoin="round" />
            </motion.g>

            {/* Machinebehuizing met linker schaduwflank */}
            <rect x="1385" y="470" width="122" height="116" rx="14" fill="url(#office-cream)" stroke={INK} strokeWidth="4" />
            <path d="M1391 480 v96" stroke="#CFC3AA" strokeWidth="8" strokeLinecap="round" opacity="0.5" />
            <path d="M1500 480 v96" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" opacity="0.6" />
            <rect x="1412" y="462" width="68" height="11" rx="5" fill={INK} />
            <rect x="1414" y="463.5" width="64" height="2.5" rx="1.25" fill="#3C4457" />
            {/* Schermpje met datastreepjes */}
            <rect x="1400" y="492" width="62" height="27" rx="6" fill="#141B29" />
            <rect x="1428" y="497" width="26" height="3.5" rx="1.75" fill="#4FC3F7" opacity="0.8" />
            <rect x="1428" y="503.5" width="18" height="3.5" rx="1.75" fill="#4FC3F7" opacity="0.5" />
            <motion.circle
              cx="1412"
              cy="505"
              r="4"
              fill="#FF5722"
              animate={idle ? { opacity: [1, 0.25, 1] } : undefined}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
            <rect x="1422" y="510" width="30" height="5" rx="2.5" fill="#4B5568" />
            {/* Grote verzendknop met glimmertje */}
            <circle cx="1483" cy="505" r="9" fill="url(#office-btn)" stroke={INK} strokeWidth="3" />
            <circle cx="1480" cy="502" r="2.4" fill="#FFC7A8" opacity="0.9" />
            {/* Envelopsleuf met dieptelijn */}
            <rect x="1398" y="546" width="82" height="9" rx="4" fill={INK} opacity="0.9" />
            <rect x="1401" y="552.5" width="76" height="2" rx="1" fill="#4B5568" opacity="0.8" />

            {/* Stapel wachtende enveloppen */}
            <g transform="rotate(6 1530 572)">
              <rect x="1516" y="552" width="38" height="12" rx="2.5" fill="#F7F3EA" stroke={INK} strokeWidth="2" />
              <rect x="1512" y="562" width="38" height="12" rx="2.5" fill="#FEFCFC" stroke={INK} strokeWidth="2" />
              <rect x="1508" y="572" width="38" height="12" rx="2.5" fill="#F1EDE6" stroke={INK} strokeWidth="2" />
            </g>

            {/* Bijzettafel in hetzelfde hout als het bureau */}
            <ellipse cx="1446" cy="586" rx="88" ry="5" fill="#0B0F17" opacity="0.3" />
            <rect x="1352" y="583" width="204" height="18" rx="6" fill="url(#office-wood-top)" stroke={INK} strokeWidth="3" />
            <line x1="1364" y1="586.5" x2="1544" y2="586.5" stroke="#D9A570" strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />
            <rect x="1366" y="601" width="15" height="138" fill="url(#office-wood-front)" stroke={INK} strokeWidth="2.5" />
            <rect x="1526" y="601" width="15" height="138" fill="url(#office-wood-front)" stroke={INK} strokeWidth="2.5" />
            <rect x="1360" y="737" width="27" height="7" rx="3" fill="#452A14" stroke={INK} strokeWidth="2" />
            <rect x="1520" y="737" width="27" height="7" rx="3" fill="#452A14" stroke={INK} strokeWidth="2" />
          </g>
        </ClickablePillar>
      </motion.g>

      {/* ============ VOORGROND: plant en boeken ============ */}
      <motion.g style={reduce ? undefined : { x: frontX, y: frontY }}>
        <ellipse cx="197" cy="884" rx="86" ry="12" fill="#05070C" opacity="0.5" filter="url(#office-soft)" />
        <motion.g
          animate={idle ? { rotate: [-1.2, 1.2, -1.2] } : undefined}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
        >
          <ellipse cx="168" cy="668" rx="20" ry="66" fill="#2F6B4F" stroke={INK} strokeWidth="3" transform="rotate(-28 168 700)" />
          <ellipse cx="228" cy="664" rx="20" ry="70" fill="#2F6B4F" stroke={INK} strokeWidth="3" transform="rotate(24 228 700)" />
          <ellipse cx="182" cy="644" rx="19" ry="74" fill="#3D8464" stroke={INK} strokeWidth="3" transform="rotate(-10 182 690)" />
          <ellipse cx="212" cy="648" rx="19" ry="72" fill="#3D8464" stroke={INK} strokeWidth="3" transform="rotate(9 212 690)" />
          <ellipse cx="197" cy="632" rx="18" ry="78" fill="#498F6F" stroke={INK} strokeWidth="3" />
          {/* Nerven en licht op de bladeren */}
          <ellipse cx="192" cy="628" rx="5.5" ry="52" fill="#5FA382" opacity="0.55" />
          <path d="M182 610 q-3 40 0 76" fill="none" stroke="#2C5F45" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" transform="rotate(-10 182 690)" />
          <path d="M212 614 q3 38 0 72" fill="none" stroke="#2C5F45" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" transform="rotate(9 212 690)" />
        </motion.g>
        <path d="M150 790 L244 790 L230 874 L164 874 Z" fill="url(#office-pot)" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        <path d="M162 796 L172 796 L164 868 L156 868 Z" fill="#E07647" opacity="0.6" />
        <rect x="142" y="774" width="110" height="20" rx="7" fill="#C9552F" stroke={INK} strokeWidth="4" />
        <rect x="146" y="777" width="102" height="4.5" rx="2.25" fill="#E07647" opacity="0.85" />

        <ellipse cx="1540" cy="894" rx="88" ry="10" fill="#05070C" opacity="0.5" filter="url(#office-soft)" />
        <g transform="rotate(-2 1540 860)">
          <rect x="1462" y="866" width="150" height="24" rx="4" fill="#33405A" stroke={INK} strokeWidth="3" />
          <rect x="1600" y="869" width="9" height="18" rx="2" fill="#E8E4DA" />
          <path d="M1478 872 h44" stroke="#8FA0C2" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
          <rect x="1476" y="842" width="136" height="24" rx="4" fill="url(#office-mega-body)" stroke={INK} strokeWidth="3" />
          <rect x="1600" y="845" width="9" height="18" rx="2" fill="#F3EDE1" />
          <path d="M1492 848 h56" stroke="#FFD1B8" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
          <rect x="1490" y="818" width="118" height="24" rx="4" fill="#3E4C63" stroke={INK} strokeWidth="3" />
          <rect x="1596" y="821" width="9" height="18" rx="2" fill="#E8E4DA" />
          <path d="M1506 824 h38" stroke="#93A5C6" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
        </g>
      </motion.g>
    </svg>
  );
}