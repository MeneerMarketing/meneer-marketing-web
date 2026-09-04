import { useMemo } from "react";
import { Easing, interpolate, random, useCurrentFrame } from "remotion";
import { EASE_SLAM } from "../../brand/beat";
import { MM } from "../../brand/tokens";

const COLS = 10;
const CELL = 88;
const DOT = 48;

export const VISITOR_GRID_SIZE = COLS * CELL;

export type VisitorGridMode = "arrive" | "leak" | "convert";

interface VisitorGridProps {
  mode: VisitorGridMode;
  total?: number;
  /** Hoeveel bezoekers blijven staan in `leak`. */
  keepCount?: number;
  /** Hoeveel bezoekers uiteindelijk oplichten in `convert`. */
  convertCount?: number;
  tone?: "light" | "dark";
  delay?: number;
}

interface Dot {
  index: number;
  col: number;
  row: number;
  arriveDelay: number;
  leaveDelay: number;
  drift: number;
  spin: number;
}

/**
 * Honderd bezoekers, één per grid-cel. Ze landen in hetzelfde raster als de
 * achtergrond, lopen weg als het misgaat, en lichten oranje op als ze iets doen.
 * De volgorde is seeded, dus dezelfde drie blijvers zijn later ook de eerste drie
 * gesprekken. Dat maakt het verhaal over de scenes heen kloppend.
 */
export const VisitorGrid: React.FC<VisitorGridProps> = ({
  mode,
  total = 100,
  keepCount = 3,
  convertCount = 11,
  tone = "light",
  delay = 0,
}) => {
  const frame = useCurrentFrame() - delay;

  const dots = useMemo<Dot[]>(
    () =>
      Array.from({ length: total }, (_, index) => ({
        index,
        col: index % COLS,
        row: Math.floor(index / COLS),
        arriveDelay: Math.round(random(`arrive-${index}`) * 26),
        leaveDelay: Math.round(random(`leave-${index}`) * 44),
        drift: (random(`drift-${index}`) - 0.5) * 260,
        spin: (random(`spin-${index}`) - 0.5) * 70,
      })),
    [total]
  );

  const ranked = useMemo(
    () =>
      Array.from({ length: total }, (_, index) => ({
        index,
        rank: random(`rank-${index}`),
      }))
        .sort((a, b) => a.rank - b.rank)
        .map((d) => d.index),
    [total]
  );

  const stayers = useMemo(() => new Set(ranked.slice(0, keepCount)), [ranked, keepCount]);
  const converters = useMemo(
    () => ranked.slice(0, convertCount),
    [ranked, convertCount]
  );

  const idleColor = tone === "dark" ? "#e2e8f0" : MM.text;
  const ghostColor = tone === "dark" ? "rgba(255,255,255,0.24)" : "rgba(15,23,42,0.16)";

  return (
    <div
      style={{
        position: "relative",
        width: VISITOR_GRID_SIZE,
        height: VISITOR_GRID_SIZE,
      }}
    >
      {dots.map((dot) => {
        const left = dot.col * CELL + (CELL - DOT) / 2;
        const top = dot.row * CELL + (CELL - DOT) / 2;

        let opacity = 1;
        let scale = 1;
        let offsetX = 0;
        let offsetY = 0;
        let rotate = 0;
        let background = idleColor;
        let ring: string | undefined;

        if (mode === "arrive") {
          const progress = interpolate(
            frame,
            [dot.arriveDelay, dot.arriveDelay + 14],
            [0, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(...EASE_SLAM),
            }
          );
          opacity = interpolate(progress, [0, 0.35], [0, 1], {
            extrapolateRight: "clamp",
          });
          scale = interpolate(progress, [0, 1], [0.3, 1]);
          offsetY = (1 - progress) * 300;
        }

        if (mode === "leak") {
          if (stayers.has(dot.index)) {
            background = MM.accentBold;
            const pulse = interpolate(frame, [46, 58], [1, 1.32], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(...EASE_SLAM),
            });
            scale = pulse;
            ring = MM.accentBold;
          } else {
            const fade = interpolate(
              frame,
              [dot.leaveDelay, dot.leaveDelay + 8],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            const fall = interpolate(
              frame,
              [dot.leaveDelay + 4, dot.leaveDelay + 30],
              [0, 1],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.4, 0, 0.9, 0.4),
              }
            );

            background = tone === "dark" ? "#475569" : "#cbd5e1";
            opacity = (1 - fade * 0.35) * (1 - fall);
            offsetY = fall * 760;
            offsetX = fall * dot.drift;
            rotate = fall * dot.spin;
            scale = interpolate(fall, [0, 1], [1, 0.55]);
          }
        }

        if (mode === "convert") {
          const slot = converters.indexOf(dot.index);
          const isStayer = stayers.has(dot.index);
          const isConverter = slot !== -1;

          if (!isConverter) {
            background = "transparent";
            ring = ghostColor;
            opacity = 1;
          } else if (isStayer) {
            background = MM.accentBold;
            ring = MM.accentBold;
          } else {
            const lightUp = interpolate(
              frame,
              [18 + slot * 5, 18 + slot * 5 + 10],
              [0, 1],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(...EASE_SLAM),
              }
            );
            background = lightUp > 0.05 ? MM.accentBold : "transparent";
            ring = lightUp > 0.05 ? MM.accentBold : ghostColor;
            scale = interpolate(lightUp, [0, 1], [0.5, 1]);
            opacity = interpolate(lightUp, [0, 0.4], [0.35, 1], {
              extrapolateRight: "clamp",
            });
          }
        }

        return (
          <div
            key={dot.index}
            style={{
              position: "absolute",
              left,
              top,
              width: DOT,
              height: DOT,
              borderRadius: "50%",
              background,
              border: ring ? `3px solid ${ring}` : undefined,
              opacity,
              scale,
              rotate: `${rotate}deg`,
              translate: `${offsetX}px ${offsetY}px`,
            }}
          />
        );
      })}
    </div>
  );
};

/**
 * Oranje scanner die over het beeld veegt. Retourneert via de callback-vrije
 * variant niets; positie wordt berekend uit hetzelfde frame zodat Meneer
 * er met zijn ogen naartoe kan kijken.
 */
export const scanPosition = (frame: number, duration: number) => {
  const progress = interpolate(frame, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.5, 0, 0.5, 1),
  });

  return {
    progress,
    x: interpolate(progress, [0, 0.5, 1], [-0.75, 0.6, -0.2]),
    y: interpolate(progress, [0, 0.5, 1], [0.55, -0.3, 0.7]),
  };
};
