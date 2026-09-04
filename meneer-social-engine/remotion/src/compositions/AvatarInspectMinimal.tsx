import { AbsoluteFill } from "remotion";
import { HEAD_BOX, MeneerHead } from "../components/MeneerHead";

const CANVAS = 1080;
const BG = "#f3f7fb";
const GRID = "rgba(15, 23, 42, 0.07)";
const ACCENT = "#FF5722";

/**
 * Variant zonder browser: alleen het hoofd op wit raster,
 * ogen naar beneden, oranje hoedband. Schoner op heel klein formaat.
 */
export const AvatarInspectMinimal: React.FC = () => {
  const headScale = 0.46;
  const headCenterY = CANVAS * 0.44;
  const scale = (CANVAS * headScale) / HEAD_BOX.height;
  const translateX = CANVAS / 2 - HEAD_BOX.centerX * scale;
  const translateY = headCenterY - HEAD_BOX.centerY * scale;

  return (
    <AbsoluteFill style={{ background: BG }}>
      <AbsoluteFill
        style={{
          backgroundImage: `
            linear-gradient(${GRID} 1.5px, transparent 1.5px),
            linear-gradient(90deg, ${GRID} 1.5px, transparent 1.5px)
          `,
          backgroundSize: "72px 72px",
        }}
      />

      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 42%, rgba(255,87,34,0.06), transparent 55%)",
        }}
      />

      <AbsoluteFill>
        <svg width={CANVAS} height={CANVAS} viewBox={`0 0 ${CANVAS} ${CANVAS}`}>
          {/* Oranje markeerstift-streep onder het hoofd */}
          <rect
            x={CANVAS / 2 - 90}
            y={headCenterY + 130}
            width={180}
            height={14}
            rx={4}
            fill={ACCENT}
            opacity={0.75}
          />

          <g transform={`translate(${translateX} ${translateY}) scale(${scale})`}>
            <MeneerHead bandColor={ACCENT} look={{ x: 0, y: 2.2 }} />
          </g>
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
