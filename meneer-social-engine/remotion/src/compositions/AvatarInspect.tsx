import { AbsoluteFill } from "remotion";
import { HEAD_BOX, MeneerHead } from "../components/MeneerHead";

const CANVAS = 1080;

/** Site-achtergrond, zelfde als meneermarketing.nl */
const BG = "#f3f7fb";
const GRID = "rgba(15, 23, 42, 0.07)";
const ACCENT = "#FF5722";

/**
 * Instagram-avatar v2: wit raster, kleiner hoofd, ogen naar beneden.
 * Het verhaal: Meneer bekijkt je website en ziet meteen wat er mis is.
 * De rode cirkel op de mini-browser is het "aha"-moment.
 */
export const AvatarInspect: React.FC = () => {
  const headScale = 0.46;
  const headCenterY = CANVAS * 0.36;
  const scale = (CANVAS * headScale) / HEAD_BOX.height;
  const translateX = CANVAS / 2 - HEAD_BOX.centerX * scale;
  const translateY = headCenterY - HEAD_BOX.centerY * scale;

  const browserW = 380;
  const browserH = 220;
  const browserX = (CANVAS - browserW) / 2;
  const browserY = CANVAS * 0.56;

  return (
    <AbsoluteFill style={{ background: BG }}>
      {/* Raster */}
      <AbsoluteFill
        style={{
          backgroundImage: `
            linear-gradient(${GRID} 1.5px, transparent 1.5px),
            linear-gradient(90deg, ${GRID} 1.5px, transparent 1.5px)
          `,
          backgroundSize: "72px 72px",
        }}
      />

      <AbsoluteFill>
        <svg width={CANVAS} height={CANVAS} viewBox={`0 0 ${CANVAS} ${CANVAS}`}>
          {/* Mini-browser: wat hij bekijkt */}
          <g>
            <rect
              x={browserX - 8}
              y={browserY - 8}
              width={browserW + 16}
              height={browserH + 16}
              rx={20}
              fill="#fff"
              stroke="rgba(15,23,42,0.08)"
              strokeWidth={3}
            />
            <rect
              x={browserX}
              y={browserY}
              width={browserW}
              height={36}
              rx={12}
              fill="#e8f0f8"
            />
            <circle cx={browserX + 28} cy={browserY + 18} r={7} fill="#ef4444" opacity={0.85} />
            <circle cx={browserX + 52} cy={browserY + 18} r={7} fill="#fbbf24" opacity={0.85} />
            <circle cx={browserX + 76} cy={browserY + 18} r={7} fill="#22c55e" opacity={0.85} />
            {/* Placeholder content lines */}
            <rect
              x={browserX + 24}
              y={browserY + 58}
              width={180}
              height={14}
              rx={4}
              fill="rgba(15,23,42,0.12)"
            />
            <rect
              x={browserX + 24}
              y={browserY + 82}
              width={120}
              height={10}
              rx={3}
              fill="rgba(15,23,42,0.07)"
            />
            {/* De "foute" knop */}
            <rect
              x={browserX + 24}
              y={browserY + 118}
              width={88}
              height={32}
              rx={8}
              fill="rgba(15,23,42,0.06)"
              stroke="rgba(15,23,42,0.1)"
              strokeWidth={2}
            />
            {/* Rode inspectie-cirkel */}
            <circle
              cx={browserX + 68}
              cy={browserY + 134}
              r={52}
              fill="none"
              stroke={ACCENT}
              strokeWidth={5}
              strokeDasharray="8 6"
              opacity={0.9}
            />
          </g>

          {/* Bliklijn: subtiel, van ogen naar probleem */}
          <path
            d={`M ${CANVAS / 2 - 20} ${headCenterY + 55} Q ${CANVAS / 2} ${browserY - 30} ${browserX + 68} ${browserY + 90}`}
            fill="none"
            stroke={ACCENT}
            strokeWidth={3}
            strokeDasharray="12 10"
            opacity={0.35}
          />

          {/* Meneer, kleiner, kijkt naar beneden */}
          <g transform={`translate(${translateX} ${translateY}) scale(${scale})`}>
            <MeneerHead bandColor={ACCENT} look={{ x: -0.2, y: 2.2 }} />
          </g>
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const AVATAR_INSPECT_SIZE = CANVAS;
