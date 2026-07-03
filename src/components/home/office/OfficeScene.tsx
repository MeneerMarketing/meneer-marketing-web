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

const CODE_LINES = [
  { w: 42, c: "#FF5722" },
  { w: 74, c: "#E2E8F0" },
  { w: 54, c: "#4FC3F7" },
  { w: 66, c: "#94A3B8" },
  { w: 36, c: "#E2E8F0" },
  { w: 58, c: "#4FC3F7" },
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
  const showHint = interactive && active === null && hovered === null;

  const labelWidth = pillar.label.length * 8.2 + 34;
  const labelY = hitBox.y - 44;

  return (
    <g
      opacity={dimmed ? 0.38 : 1}
      style={{ transition: "opacity 0.35s ease" }}
      onClick={(e) => {
        e.stopPropagation();
        if (interactive) onSelect(id);
      }}
      onMouseEnter={() => interactive && onHover(id)}
      onMouseLeave={() => interactive && onHover(null)}
      className={interactive ? "cursor-pointer" : undefined}
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
 * Het kantoor van Meneer Marketing: cartoon-avondscène met de mascotte
 * achter zijn bureau. Zijn pupillen volgen de cursor, of het object van
 * de actieve hoofddienst. Vier parallax-lagen bewegen mee met de muis.
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
        <linearGradient id="office-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2B3242" />
          <stop offset="100%" stopColor="#20262F" />
        </linearGradient>
        <linearGradient id="office-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1B2436" />
          <stop offset="100%" stopColor="#0D1220" />
        </linearGradient>
        <radialGradient id="office-moon-halo">
          <stop offset="0%" stopColor="#F2ECDA" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#F2ECDA" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="office-lamp-cone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF5722" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#FF5722" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="office-screen-glow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4FC3F7" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#4FC3F7" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="office-hint">
          <stop offset="0%" stopColor="#FF5722" stopOpacity="0.4" />
          <stop offset="55%" stopColor="#FF5722" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#FF5722" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ============ ACHTERGROND: muur, raam, nacht ============ */}
      <motion.g style={reduce ? undefined : { x: backX, y: backY }}>
        <rect x="-40" y="-30" width="1680" height="672" fill="url(#office-wall)" />
        <rect x="-40" y="632" width="1680" height="12" fill="#141824" />
        <rect x="-40" y="642" width="1680" height="290" fill="#191E29" />

        {/* Raam met nachtlucht */}
        <g>
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

          {/* Raamstijlen */}
          <rect x="1250" y="110" width="10" height="414" fill="#11151E" />
          <rect x="1030" y="308" width="450" height="10" fill="#11151E" />
          <rect x="1004" y="530" width="502" height="16" rx="5" fill="#11151E" />
        </g>

        {/* Slapende kat op de vensterbank */}
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
          <circle cx="1368" cy="504" r="12" fill="#14181F" />
          <path d="M1360 495 L1363 485 L1368 494 Z" fill="#14181F" />
          <path d="M1370 494 L1375 484 L1378 494 Z" fill="#14181F" />
          <path d="M1362 505 q3 2 6 0" fill="none" stroke="#F3C65B" strokeWidth="1.4" strokeLinecap="round" opacity="0.9" />
          <path d="M1371 505 q3 2 6 0" fill="none" stroke="#F3C65B" strokeWidth="1.4" strokeLinecap="round" opacity="0.9" />
        </g>

        {/* Klok met draaiende wijzers */}
        <g>
          <circle cx="585" cy="185" r="27" fill="#FEFCFC" stroke={INK} strokeWidth="4" />
          <line x1="585" y1="163" x2="585" y2="168" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="607" y1="185" x2="602" y2="185" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="585" y1="207" x2="585" y2="202" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="563" y1="185" x2="568" y2="185" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
          <motion.g
            style={{ transformOrigin: "585px 185px", transformBox: "view-box" }}
            initial={{ rotate: 120 }}
            animate={idle ? { rotate: 480 } : undefined}
            transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
          >
            <line x1="585" y1="185" x2="585" y2="166" stroke={INK} strokeWidth="3" strokeLinecap="round" />
          </motion.g>
          <motion.g
            style={{ transformOrigin: "585px 185px", transformBox: "view-box" }}
            initial={{ rotate: 45 }}
            animate={idle ? { rotate: 405 } : undefined}
            transition={{ duration: 288, repeat: Infinity, ease: "linear" }}
          >
            <line x1="585" y1="185" x2="585" y2="172" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
          </motion.g>
          <circle cx="585" cy="185" r="2.6" fill={INK} />
        </g>

        {/* Ingelijst portret: de kantoorkat, medewerker van de maand */}
        <g>
          <rect x="868" y="162" width="118" height="146" rx="6" fill="#C9A227" stroke={INK} strokeWidth="4" />
          <rect x="878" y="172" width="98" height="124" rx="4" fill="#F5EDE0" stroke={INK} strokeWidth="2.5" />

          {/* Oren boven het gezicht */}
          <path d="M902 210 L909 194 L918 208 Z" fill="#E8A04A" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M936 208 L945 194 L952 210 Z" fill="#E8A04A" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
          <ellipse cx="927" cy="232" rx="33" ry="29" fill="#E8A04A" stroke={INK} strokeWidth="3" />

          {/* Ogen, neus */}
          <ellipse cx="915" cy="226" rx="5" ry="6.5" fill="#fff" stroke={INK} strokeWidth="2" />
          <ellipse cx="939" cy="226" rx="5" ry="6.5" fill="#fff" stroke={INK} strokeWidth="2" />
          <circle cx="916" cy="227" r="2.2" fill={INK} />
          <circle cx="940" cy="227" r="2.2" fill={INK} />
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
          <path d="M913 194 a14 12 0 0 1 28 0 v1 h-28 z" fill={INK} />
          <rect x="914" y="190" width="26" height="4" fill="#FF5722" />
          <rect x="906" y="193.4" width="42" height="4.6" rx="2.3" fill={INK} />

          {/* Naamplaatje */}
          <rect x="884" y="280" width="86" height="12" rx="3" fill="#EDE7DE" stroke={INK} strokeWidth="1.5" />
          <text x="927" y="289" textAnchor="middle" fontSize="7.5" fontWeight="700" fill={INK} letterSpacing="0.06em">
            KAT VAN DE MAAND
          </text>
        </g>
      </motion.g>

      {/* ============ MIDDENLAAG: whiteboard en lamp ============ */}
      <motion.g style={reduce ? undefined : { x: midX, y: midY }}>
        {/* Strategiebord */}
        <ClickablePillar id="strategie" hintDelay={0} {...clickProps}>
          <g>
            <rect x="130" y="140" width="322" height="252" rx="14" fill="#F7F8FA" stroke={INK} strokeWidth="5" />
            <rect x="200" y="392" width="182" height="12" rx="5" fill="#C9CFDA" stroke={INK} strokeWidth="2.5" />
            <rect x="222" y="386" width="34" height="8" rx="4" fill="#FF5722" stroke={INK} strokeWidth="2" />

            <rect x="162" y="162" width="82" height="8" rx="4" fill="#C7CEDA" />
            <rect x="162" y="177" width="52" height="7" rx="3.5" fill="#DDE2EA" />

            <g transform="rotate(6 385 182)">
              <rect x="365" y="162" width="40" height="40" rx="3" fill="#FFD54F" stroke={INK} strokeWidth="2" />
              <path d="M373 176 h24 M373 185 h18" stroke={INK} strokeWidth="1.8" strokeLinecap="round" opacity="0.55" />
            </g>
            <g transform="rotate(-8 336 176)">
              <rect x="318" y="158" width="36" height="36" rx="3" fill="#7EDCE2" stroke={INK} strokeWidth="2" />
              <path d="M325 170 h22 M325 178 h15" stroke={INK} strokeWidth="1.8" strokeLinecap="round" opacity="0.55" />
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

        {/* Hanglamp met lichtkegel */}
        <g>
          <line x1="790" y1="-10" x2="790" y2="142" stroke={INK} strokeWidth="4" />
          <motion.path
            d="M752 186 L828 186 L960 585 L622 585 Z"
            fill="url(#office-lamp-cone)"
            initial={{ opacity: 0.3 }}
            animate={idle ? { opacity: [0.26, 0.4, 0.26] } : undefined}
            transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
          />
          <path d="M762 142 L818 142 L836 186 L744 186 Z" fill="#FF5722" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
          <ellipse cx="790" cy="188" rx="26" ry="7" fill="#FFD180" opacity="0.9" />
        </g>
      </motion.g>

      {/* ============ BUREAULAAG: mascotte, bureau en objecten ============ */}
      <motion.g style={reduce ? undefined : { x: deskX, y: deskY }}>
        {/* Vloerkleed */}
        <ellipse cx="800" cy="745" rx="432" ry="58" fill="#222A3C" />
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

        {/* Bureaustoel */}
        <rect x="682" y="378" width="186" height="212" rx="26" fill="#39435C" stroke={INK} strokeWidth="3.5" />

        {/* Lijf: pak, overhemd, stropdas, armen */}
        <path
          d="M710 600 L710 505 Q710 470 745 468 L805 468 Q840 470 840 505 L840 600 Z"
          fill="#2E3648"
          stroke={INK}
          strokeWidth="3.5"
        />
        <path d="M756 468 L775 502 L794 468 Z" fill="#FEFCFC" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M770 486 L775 502 L780 486 L775 478 Z" fill="#FF5722" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
        <path d="M714 508 Q678 548 660 584" fill="none" stroke="#2E3648" strokeWidth="22" strokeLinecap="round" />
        <path d="M836 508 Q872 548 890 584" fill="none" stroke="#2E3648" strokeWidth="22" strokeLinecap="round" />
        <circle cx="660" cy="586" r="11" fill="#F8CBA3" stroke={INK} strokeWidth="2.5" />
        <circle cx="890" cy="586" r="11" fill="#F8CBA3" stroke={INK} strokeWidth="2.5" />

        {/* Hoofd van Meneer Marketing, pupillen volgen de cursor */}
        <g transform="translate(692 318) scale(2.6)">
          <ellipse cx="14.7" cy="42" rx="2.9" ry="3.4" fill="#F6C09A" stroke={INK} strokeWidth="1.3" />
          <ellipse cx="49.3" cy="42" rx="2.9" ry="3.4" fill="#F6C09A" stroke={INK} strokeWidth="1.3" />
          <ellipse cx="32" cy="41" rx="17" ry="16.6" fill="#F8CBA3" stroke={INK} strokeWidth="1.5" />
          <ellipse cx="20.6" cy="47" rx="2.5" ry="1.5" fill="#F2A075" opacity="0.5" />
          <ellipse cx="43.4" cy="47" rx="2.5" ry="1.5" fill="#F2A075" opacity="0.5" />

          <ellipse cx={LEFT_EYE.cx} cy={LEFT_EYE.cy} rx={EYE_RX} ry={EYE_RY} fill="#fff" stroke={INK} strokeWidth="1.3" />
          <motion.circle cx={leftPupilX} cy={leftPupilY} r={PUPIL_R} fill={INK} />
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

          <ellipse cx={RIGHT_EYE.cx} cy={RIGHT_EYE.cy} rx={EYE_RX} ry={EYE_RY} fill="#fff" stroke={INK} strokeWidth="1.3" />
          <motion.circle cx={rightPupilX} cy={rightPupilY} r={PUPIL_R} fill={INK} />
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

          <ellipse cx="32" cy="43.6" rx="3.3" ry="2.3" fill="#F2B285" stroke={INK} strokeWidth="1.2" />
          <path
            d="M23.2 48.6 C25.4 45.6 29.6 45.9 32 47.9 C34.4 45.9 38.6 45.6 40.8 48.6 C40 51.3 36.1 52.2 32 50.3 C27.9 52.2 24 51.3 23.2 48.6 Z"
            fill={INK}
          />
          <path d="M28.4 54.2c2.3 1.5 4.9 1.5 7.2 0" fill="none" stroke={INK} strokeWidth="1.3" strokeLinecap="round" />
          <path d="M19 24.6a13 12.2 0 0 1 26 0v0.9h-26z" fill={INK} />
          <rect x="19.8" y="20.7" width="24.4" height="4" fill="#FF5722" />
          <rect x="11.5" y="23.8" width="41" height="4.4" rx="2.2" fill={INK} />
        </g>

        {/* Bureau */}
        <rect x="228" y="583" width="1164" height="22" rx="7" fill="#9A6B45" stroke={INK} strokeWidth="3" />
        <rect x="238" y="605" width="1144" height="14" fill="#7C5233" />
        <rect x="270" y="619" width="22" height="146" fill="#5F3E27" stroke={INK} strokeWidth="2.5" />
        <rect x="1328" y="619" width="22" height="146" fill="#5F3E27" stroke={INK} strokeWidth="2.5" />

        {/* Contactschaduwen zodat objecten op het blad staan */}
        <g fill="#0B0F17" opacity="0.32" aria-hidden>
          <ellipse cx="541" cy="586" rx="96" ry="5.5" />
          <ellipse cx="666" cy="586" rx="24" ry="4.5" />
          <ellipse cx="985" cy="586" rx="66" ry="5.5" />
          <ellipse cx="1200" cy="588" rx="66" ry="5.5" />
        </g>

        {/* Bouwlaptop */}
        <ClickablePillar id="bouwen" hintDelay={0.7} {...clickProps}>
          <g>
            <rect x="455" y="443" width="172" height="120" rx="9" fill="#10151F" stroke={INK} strokeWidth="4" />
            <rect x="455" y="443" width="172" height="120" rx="9" fill="url(#office-screen-glow)" />
            {CODE_LINES.map((line, i) => (
              <rect
                key={i}
                x={i % 2 === 0 ? 470 : 484}
                y={458 + i * 16}
                width={line.w}
                height="7"
                rx="3.5"
                fill={line.c}
                opacity="0.9"
              />
            ))}
            <motion.rect
              x="548"
              y="458"
              width="8"
              height="7"
              rx="2"
              fill="#FF5722"
              initial={{ opacity: 1 }}
              animate={idle ? { opacity: [1, 0, 1] } : undefined}
              transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
            />
            <path d="M440 585 L642 585 L626 565 L456 565 Z" fill="#2B3242" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
          </g>
        </ClickablePillar>

        {/* Koffie met stoom */}
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
          <rect x="648" y="548" width="36" height="36" rx="6" fill="#FEFCFC" stroke={INK} strokeWidth="3" />
          <path d="M684 556 q16 8 0 22" fill="none" stroke={INK} strokeWidth="3" />
        </g>

        {/* Vergrootglas op het bureau (vindbaarheid) */}
        <ClickablePillar id="vindbaarheid" hintDelay={1.4} {...clickProps}>
          <g>
            {/* Handvat rust op het blad */}
            <line x1="1000" y1="560" x2="1046" y2="581" stroke={INK} strokeWidth="17" strokeLinecap="round" />
            <line x1="1000" y1="560" x2="1043" y2="579" stroke="#8B5E3C" strokeWidth="11" strokeLinecap="round" />
            <line x1="1001" y1="558" x2="1030" y2="571" stroke="#A0714A" strokeWidth="4" strokeLinecap="round" />

            {/* Lens leunt schuin tegen het bureau */}
            <circle cx="968" cy="532" r="46" fill="none" stroke={INK} strokeWidth="4" />
            <circle cx="968" cy="532" r="41" fill="#D4ECFF" fillOpacity="0.5" stroke="#C9D4E2" strokeWidth="8" />
            <circle cx="968" cy="532" r="36.5" fill="none" stroke={INK} strokeWidth="2.5" />
            <path
              d="M944 515 a29 29 0 0 1 15 -11"
              fill="none"
              stroke="#FEFCFC"
              strokeWidth="5"
              strokeLinecap="round"
              opacity="0.8"
            />

            {/* Gouden #1 in het glas */}
            <circle cx="982" cy="520" r="11" fill="#F3C65B" stroke={INK} strokeWidth="2.5" />
            <text x="982" y="525" textAnchor="middle" fontSize="12" fontWeight="800" fill={INK}>
              1
            </text>
          </g>
        </ClickablePillar>

        {/* Megafoon met geluidsgolven */}
        <ClickablePillar id="campagnes" hintDelay={2.1} {...clickProps}>
          <g>
            <g transform="rotate(-8 1200 552)">
              {/* Handvat onder de romp */}
              <path
                d="M1178 566 L1172 592 Q1170 600 1178 600 L1196 600 Q1203 600 1201 592 L1196 570"
                fill="#C43E14"
                stroke={INK}
                strokeWidth="3.5"
                strokeLinejoin="round"
              />
              {/* Mondstuk */}
              <rect x="1132" y="537" width="22" height="30" rx="10" fill="#C43E14" stroke={INK} strokeWidth="3.5" />
              <circle cx="1143" cy="552" r="4" fill="#8F2D0E" />
              {/* Romp: vloeiende conus */}
              <path
                d="M1150 541 Q1148 552 1148 552 Q1148 552 1150 563 L1238 590 Q1250 594 1250 581 L1250 523 Q1250 510 1238 514 Z"
                fill="#FF5722"
                stroke={INK}
                strokeWidth="4"
                strokeLinejoin="round"
              />
              {/* Crème band en glans op de romp */}
              <path d="M1174 534 L1190 529 L1190 573 L1174 568 Z" fill="#FFE8D6" opacity="0.9" />
              <path d="M1158 545 Q1200 534 1240 524" fill="none" stroke="#FFB74D" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
              {/* Bell-rand */}
              <ellipse cx="1250" cy="552" rx="11" ry="42" fill="#FFD180" stroke={INK} strokeWidth="3.5" />
              <ellipse cx="1250" cy="552" rx="5" ry="33" fill="#B33A10" />
            </g>
            {[
              { d: "M1280 520 q16 30 0 60", delay: 0 },
              { d: "M1296 506 q24 44 0 88", delay: 0.25 },
              { d: "M1312 492 q32 58 0 116", delay: 0.5 },
            ].map((arc) => (
              <motion.path
                key={arc.d}
                d={arc.d}
                fill="none"
                stroke="#F3C65B"
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ opacity: 0 }}
                animate={idle ? { opacity: [0, 0.9, 0] } : undefined}
                transition={{ duration: 2, repeat: Infinity, delay: arc.delay, repeatDelay: 1.6, ease: "easeInOut" }}
              />
            ))}
            {/* Kleine sterretjes tussen de golven */}
            {[
              { x: 1330, y: 512, delay: 0.9 },
              { x: 1346, y: 560, delay: 1.5 },
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
            </motion.g>

            <rect x="1385" y="470" width="122" height="116" rx="14" fill="#EDE7DE" stroke={INK} strokeWidth="4" />
            <rect x="1412" y="462" width="68" height="11" rx="5" fill={INK} />
            <rect x="1400" y="492" width="62" height="27" rx="6" fill="#1F2430" />
            <motion.circle
              cx="1412"
              cy="505"
              r="4"
              fill="#FF5722"
              animate={idle ? { opacity: [1, 0.25, 1] } : undefined}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
            <rect x="1422" y="501" width="30" height="7" rx="3.5" fill="#4B5568" />
            <circle cx="1483" cy="505" r="9" fill="#FF5722" stroke={INK} strokeWidth="3" />
            <rect x="1398" y="546" width="82" height="9" rx="4" fill={INK} opacity="0.85" />

            <g transform="rotate(6 1530 572)">
              <rect x="1512" y="562" width="38" height="12" rx="2.5" fill="#FEFCFC" stroke={INK} strokeWidth="2" />
              <rect x="1508" y="572" width="38" height="12" rx="2.5" fill="#F1EDE6" stroke={INK} strokeWidth="2" />
            </g>

            <rect x="1352" y="583" width="204" height="18" rx="6" fill="#9A6B45" stroke={INK} strokeWidth="3" />
            <rect x="1366" y="601" width="15" height="138" fill="#5F3E27" stroke={INK} strokeWidth="2.5" />
            <rect x="1526" y="601" width="15" height="138" fill="#5F3E27" stroke={INK} strokeWidth="2.5" />
          </g>
        </ClickablePillar>
      </motion.g>

      {/* ============ VOORGROND: plant en boeken ============ */}
      <motion.g style={reduce ? undefined : { x: frontX, y: frontY }}>
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
        </motion.g>
        <path d="M150 790 L244 790 L230 874 L164 874 Z" fill="#B34A2B" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        <rect x="142" y="774" width="110" height="20" rx="7" fill="#C9552F" stroke={INK} strokeWidth="4" />

        <g transform="rotate(-2 1540 860)">
          <rect x="1462" y="866" width="150" height="24" rx="4" fill="#33405A" stroke={INK} strokeWidth="3" />
          <rect x="1476" y="842" width="136" height="24" rx="4" fill="#FF5722" stroke={INK} strokeWidth="3" />
          <rect x="1490" y="818" width="118" height="24" rx="4" fill="#3E4C63" stroke={INK} strokeWidth="3" />
        </g>
      </motion.g>
    </svg>
  );
}
