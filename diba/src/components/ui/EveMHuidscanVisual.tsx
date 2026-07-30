"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

type ScanDimension = {
  id: string;
  label: string;
  score: number;
  detail: string;
};

const DIMENSIONS: readonly ScanDimension[] = [
  {
    id: "hydratatie",
    label: "Hydratatie",
    score: 74,
    detail: "Vochtbalans en barrièrefunctie in beeld.",
  },
  {
    id: "pigment",
    label: "Pigment",
    score: 58,
    detail: "Pigmentverdeling en egaliteit per zone.",
  },
  {
    id: "porien",
    label: "Poriën",
    score: 66,
    detail: "Poriégrootte en -dichtheid objectief gemeten.",
  },
  {
    id: "textuur",
    label: "Textuur",
    score: 62,
    detail: "Huidstructuur en gladheid in kaart.",
  },
  {
    id: "roodheid",
    label: "Roodheid",
    score: 48,
    detail: "Roodheid en gevoeligheid per gebied.",
  },
  {
    id: "uv",
    label: "UV-belasting",
    score: 55,
    detail: "Zichtbare UV-sporen en herstelbehoefte.",
  },
] as const;

const COUNT = DIMENSIONS.length;
const CX = 200;
const CY = 200;
/** Groter radar-web in viewBox. */
const RING_INNER = 40;
const RING_STEP = 26;
const RING_COUNT = 5;
const RADAR_RINGS = Array.from(
  { length: RING_COUNT },
  (_, i) => RING_INNER + i * RING_STEP,
);
const MAX_R = RADAR_RINGS[RING_COUNT - 1]!;

const LABEL_SLOTS = [
  "left-1/2 top-0 -translate-x-1/2 -translate-y-0",
  "right-0 top-[12%] translate-x-1 translate-y-0",
  "right-0 bottom-[12%] translate-x-1 translate-y-0",
  "left-1/2 bottom-0 -translate-x-1/2 translate-y-0",
  "left-0 bottom-[12%] -translate-x-1 translate-y-0",
  "left-0 top-[12%] -translate-x-1 translate-y-0",
] as const;

/** Graden per seconde — langzaam (~22 s per rondje). */
const SWEEP_DEG_PER_SEC = 360 / 22;

function polar(index: number, total: number, radius: number) {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  return {
    x: CX + radius * Math.cos(angle),
    y: CY + radius * Math.sin(angle),
  };
}

function radarPolygon(scores: number[]) {
  return scores
    .map((score, i) => {
      const { x, y } = polar(i, scores.length, (score / 100) * MAX_R);
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ")
    .concat(" Z");
}

/** Bepaal welk meetpunt het dichtst bij de scan-lijn ligt. */
function indexFromSweepAngle(deg: number): number {
  const step = 360 / COUNT;
  const normalized = ((deg % 360) + 360) % 360;
  return Math.floor((normalized + step / 2) / step) % COUNT;
}

/** Radar-sweep kegel (wijst omhoog; groep roteert). */
function sweepWedgePath(spreadDeg: number, radius: number) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const base = -90;
  const a1 = toRad(base - spreadDeg);
  const a2 = toRad(base + spreadDeg);
  const x1 = CX + radius * Math.cos(a1);
  const y1 = CY + radius * Math.sin(a1);
  const x2 = CX + radius * Math.cos(a2);
  const y2 = CY + radius * Math.sin(a2);
  return `M ${CX} ${CY} L ${x1.toFixed(1)} ${y1.toFixed(1)} A ${radius} ${radius} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)} Z`;
}

type EveMHuidscanVisualProps = {
  className?: string;
  /** light = wit kaartblok op donkere sectie. dark = op groen vlak. */
  surface?: "dark" | "light" | "hero-block";
};

/** Interactieve Eve-M radar — demo-visual voor de huidscan-sectie. */
export default function EveMHuidscanVisual({
  className = "",
  surface = "dark",
}: EveMHuidscanVisualProps) {
  const [sweepAngle, setSweepAngle] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [stilgezet, setStilgezet] = useState(false);
  // Wie beweging heeft uitgezet krijgt een stilstaande radar, en kan hem ook niet
  // per ongeluk starten. Afgeleid, dus geen effect dat state naloopt.
  const reduced = useReducedMotion();
  const paused = stilgezet || reduced;
  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);
  const uid = useId().replace(/:/g, "");
  const titleId = useId();
  const detailId = useId();
  const sweepFillId = `eve-sweep-fill-${uid}`;
  const sweepLineId = `eve-sweep-line-${uid}`;
  const sweepSoftId = `eve-sweep-soft-${uid}`;

  useEffect(() => {
    if (paused) return undefined;

    const tick = (now: number) => {
      if (lastTickRef.current === 0) lastTickRef.current = now;
      const dt = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;

      setSweepAngle((prev) => {
        const next = (prev + SWEEP_DEG_PER_SEC * dt) % 360;
        return next;
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      lastTickRef.current = 0;
    };
  }, [paused]);

  // De actieve as ís de hoek van de sweep — niets om apart bij te houden. Een klik
  // parkeert de sweep op die as (zie selectIndex), dus kiezen werkt langs dezelfde weg.
  const sweepIndex = indexFromSweepAngle(sweepAngle);
  const focusIndex = hovered ?? sweepIndex;
  const active = DIMENSIONS[focusIndex];
  const scores = DIMENSIONS.map((d, i) =>
    i === focusIndex ? Math.min(100, d.score + 5) : d.score,
  );

  const selectIndex = useCallback((index: number) => {
    setStilgezet(true);
    const step = 360 / COUNT;
    setSweepAngle(index * step);
  }, []);

  const onKey = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectIndex(index);
      }
    },
    [selectIndex],
  );

  const onLight = surface === "light" || surface === "hero-block";

  return (
    <div
      className={`mx-auto w-full max-w-[520px] ${className}`}
      role="group"
      aria-labelledby={titleId}
      onMouseEnter={() => setStilgezet(true)}
      onMouseLeave={() => {
        setStilgezet(false);
        setHovered(null);
        lastTickRef.current = 0;
      }}
    >
      <p id={titleId} className="sr-only">
        Eve-M huidscan visualisatie. De scan-lijn activeert elk meetpunt. Pauzeer met hover of
        kies zelf een punt.
      </p>

      <div
        className={
          onLight
            ? "mb-5 overflow-hidden rounded-[1.15rem] border border-[#dce8d9] bg-[#f3f9ef] px-5 py-4"
            : "mb-5 overflow-hidden rounded-2xl border border-[#95c592]/35 bg-[#1f5638]/55 px-5 py-4 backdrop-blur-sm"
        }
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={
                  onLight
                    ? "rounded-full bg-[#286943] px-2.5 py-1 text-[8px] font-bold uppercase tracking-[.14em] text-white"
                    : "rounded-full bg-[#d8f0c8] px-2.5 py-1 text-[8px] font-bold uppercase tracking-[.14em] text-[#245f3b]"
                }
              >
                Eve-M
              </span>
              <span
                className={
                  onLight
                    ? "text-[8px] font-medium uppercase tracking-[.12em] text-[#5d8166]"
                    : "text-[8px] font-medium uppercase tracking-[.12em] text-[#b9dfa9]"
                }
              >
                Nulmeting · demo
              </span>
            </div>
            <p
              id={detailId}
              className={
                onLight
                  ? "mt-2.5 text-xl font-medium tracking-[-.04em] text-[#17372a] sm:text-[1.35rem]"
                  : "mt-2.5 text-xl font-medium tracking-[-.04em] text-white sm:text-[1.35rem]"
              }
            >
              {active.label}
            </p>
            <p
              className={
                onLight
                  ? "mt-1 text-[11px] leading-relaxed text-[#487152]"
                  : "mt-1 text-[11px] leading-relaxed text-[#d2ead0]"
              }
            >
              {active.detail}
            </p>
          </div>

          <div className="shrink-0 text-right">
            <p
              className={
                onLight
                  ? "text-[9px] font-semibold uppercase tracking-[.12em] text-[#5d8166]"
                  : "text-[9px] font-semibold uppercase tracking-[.12em] text-[#b9dfa9]"
              }
            >
              Score
            </p>
            <p
              className={
                onLight
                  ? "mt-1 tabular-nums text-3xl font-medium leading-none tracking-[-.06em] text-[#286943]"
                  : "mt-1 tabular-nums text-3xl font-medium leading-none tracking-[-.06em] text-[#d8f0c8]"
              }
            >
              {active.score}
              <span
                className={
                  onLight
                    ? "ml-0.5 text-sm font-normal text-[#738369]"
                    : "ml-0.5 text-sm font-normal text-[#95c592]"
                }
              >
                /100
              </span>
            </p>
          </div>
        </div>

        <div
          className={
            onLight
              ? "mt-4 h-1.5 overflow-hidden rounded-full bg-[#dce8d9]"
              : "mt-4 h-1.5 overflow-hidden rounded-full bg-[#286943]/80"
          }
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#5eae67] to-[#8ec87a] transition-all duration-700 ease-out"
            style={{ width: `${active.score}%` }}
            role="presentation"
          />
        </div>
      </div>

      <div className="relative mx-auto aspect-square w-full max-w-[460px] px-0 pb-1 pt-1">
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-[12%] rounded-full ${
            onLight
              ? "bg-[radial-gradient(circle,rgba(94,174,103,.12)_0%,transparent_68%)]"
              : "bg-[radial-gradient(circle,rgba(184,227,157,.14)_0%,transparent_68%)]"
          }`}
        />
        <svg
          className="absolute inset-3 h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)] sm:inset-2"
          viewBox="0 0 400 400"
          fill="none"
          aria-hidden
        >
          <defs>
            <linearGradient id={sweepFillId} x1="200" y1="200" x2="200" y2="56" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={onLight ? "#286943" : "#d8f0c8"} stopOpacity="0" />
              <stop offset="45%" stopColor={onLight ? "#5eae67" : "#b8e39d"} stopOpacity="0.12" />
              <stop offset="100%" stopColor={onLight ? "#5eae67" : "#d8f0c8"} stopOpacity="0.28" />
            </linearGradient>
            <linearGradient id={sweepSoftId} x1="200" y1="200" x2="200" y2="56" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={onLight ? "#286943" : "#d8f0c8"} stopOpacity="0" />
              <stop offset="100%" stopColor={onLight ? "#8ec87a" : "#d8f0c8"} stopOpacity="0.08" />
            </linearGradient>
            <linearGradient id={sweepLineId} x1="200" y1="200" x2="200" y2="56" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={onLight ? "#286943" : "#d8f0c8"} stopOpacity="0.05" />
              <stop offset="72%" stopColor={onLight ? "#286943" : "#d8f0c8"} stopOpacity="0.55" />
              <stop offset="100%" stopColor={onLight ? "#5eae67" : "#eef8e8"} stopOpacity="1" />
            </linearGradient>
          </defs>

          {RADAR_RINGS.map((r, i) => (
            <circle
              key={r}
              cx={CX}
              cy={CY}
              r={r}
              stroke={onLight ? "#5d9564" : "#95c592"}
              strokeWidth="1"
              opacity={onLight ? 0.2 + i * 0.1 : 0.16 + i * 0.1}
            />
          ))}

          {DIMENSIONS.map((_, i) => {
            const end = polar(i, DIMENSIONS.length, MAX_R);
            return (
              <line
                key={i}
                x1={CX}
                y1={CY}
                x2={end.x}
                y2={end.y}
                stroke={onLight ? "#7aab7e" : "#95c592"}
                strokeWidth="1"
                opacity={onLight ? 0.3 : 0.2}
              />
            );
          })}

          <path
            d={radarPolygon(scores)}
            fill={onLight ? "#5eae67" : "#cbeab8"}
            fillOpacity={onLight ? 0.18 : 0.2}
            stroke={onLight ? "#286943" : "#d8f0c8"}
            strokeWidth="2"
            className="transition-all duration-700 ease-out"
          />

          <path
            d={radarPolygon(DIMENSIONS.map((d) => d.score))}
            fill="none"
            stroke={onLight ? "#286943" : "#b8e39d"}
            strokeWidth="1"
            strokeDasharray="3 5"
            opacity={onLight ? 0.4 : 0.45}
          />

          <g
            style={{
              transform: `rotate(${sweepAngle}deg)`,
              transformOrigin: `${CX}px ${CY}px`,
              transition: paused ? "transform 0.4s ease-out" : "none",
            }}
          >
            <path d={sweepWedgePath(26, MAX_R)} fill={`url(#${sweepSoftId})`} />
            <path d={sweepWedgePath(14, MAX_R)} fill={`url(#${sweepFillId})`} />
            <line
              x1={CX}
              y1={CY}
              x2={CX}
              y2={CY - MAX_R}
              stroke={`url(#${sweepLineId})`}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle
              cx={CX}
              cy={CY - MAX_R}
              r="11"
              fill={onLight ? "#5eae67" : "#d8f0c8"}
              opacity="0.18"
            >
              {!paused ? (
                <animate attributeName="r" values="9;14;9" dur="2.2s" repeatCount="indefinite" />
              ) : null}
            </circle>
            <circle
              cx={CX}
              cy={CY - MAX_R}
              r="5"
              fill={onLight ? "#286943" : "#d8f0c8"}
              className="eve-scan-head-glow"
            />
            <circle cx={CX} cy={CY - MAX_R} r="1.8" fill={onLight ? "#eef8e8" : "#ffffff"} opacity="0.95" />
          </g>

          <circle
            cx={CX}
            cy={CY}
            r="18"
            fill="none"
            stroke={onLight ? "#5eae67" : "#b8e39d"}
            strokeWidth="1"
            opacity={onLight ? 0.35 : 0.28}
            className="eve-scan-hub-ring"
          />

          {DIMENSIONS.map((dim, i) => {
            const pt = polar(i, DIMENSIONS.length, (dim.score / 100) * MAX_R);
            const isActive = i === focusIndex;
            return (
              <g key={dim.id}>
                {isActive ? (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="11"
                    fill={onLight ? "#286943" : "#d8f0c8"}
                    opacity={onLight ? 0.12 : 0.22}
                  >
                    <animate attributeName="r" values="8;13;8" dur="2.4s" repeatCount="indefinite" />
                  </circle>
                ) : null}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isActive ? 5.5 : 3.5}
                  fill={isActive ? (onLight ? "#286943" : "#d8f0c8") : onLight ? "#5d9564" : "#b8e39d"}
                  className="transition-all duration-500"
                />
              </g>
            );
          })}
        </svg>

        <div
          className={`absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full sm:h-[3.25rem] sm:w-[3.25rem] ${
            onLight
              ? "border border-[#c5dfc0] bg-white shadow-[0_0_0_4px_rgba(94,174,103,.12),0_2px_12px_rgba(40,105,67,.08)]"
              : "border border-[#95c592]/35 bg-[#286943]/75 shadow-[0_0_0_4px_rgba(184,227,157,.08),inset_0_1px_0_rgba(216,240,200,.1)]"
          }`}
        >
          <span
            className={`text-center text-[7px] font-bold uppercase leading-tight tracking-[.14em] sm:text-[8px] ${
              onLight ? "text-[#286943]" : "text-[#b8e39d]"
            }`}
          >
            Eve-M
            <br />
            Scan
          </span>
        </div>

        {DIMENSIONS.map((dim, i) => {
          const isActive = i === focusIndex;
          return (
            <button
              key={dim.id}
              type="button"
              aria-pressed={sweepIndex === i}
              aria-describedby={isActive ? detailId : undefined}
              onClick={() => selectIndex(i)}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => {
                setStilgezet(true);
                setHovered(i);
              }}
              onBlur={() => setHovered(null)}
              onKeyDown={(e) => onKey(e, i)}
              className={`absolute whitespace-nowrap rounded-full px-2.5 py-1.5 text-[8px] font-semibold uppercase tracking-[.09em] transition-all duration-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:px-3 sm:text-[9px] ${LABEL_SLOTS[i]} ${
                isActive
                  ? onLight
                    ? "scale-105 border border-[#dce8d9] bg-white text-[#286943] shadow-[0_4px_16px_rgba(40,105,67,.12)]"
                    : "scale-105 bg-white text-[#245f3b] shadow-[0_0_20px_rgba(184,227,157,.35)]"
                  : onLight
                    ? "bg-[#286943] text-white hover:bg-[#347a4d]"
                    : "bg-[#245f3b]/90 text-[#bfe7ac] hover:bg-[#347a4d] hover:text-white"
              } focus-visible:outline-[#286943]`}
            >
              {dim.label}
            </button>
          );
        })}
      </div>

      <p
        className={`mt-3 text-center text-[9px] uppercase tracking-[.14em] ${
          onLight ? "text-[#487152]" : "text-[#95c592]"
        }`}
      >
        Scan loopt automatisch · hover om te pauzeren
      </p>
    </div>
  );
}
