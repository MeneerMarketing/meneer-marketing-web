import { AbsoluteFill } from "remotion";
import { z } from "zod";
import { HEAD_BOX, MeneerHead } from "../components/MeneerHead";

export const avatarSchema = z.object({
  background: z.string(),
  showGrid: z.boolean(),
  headScale: z.number(),
  bandColor: z.string(),
  gridColor: z.string(),
});

export type AvatarProps = z.infer<typeof avatarSchema>;

export const avatarDefaultProps: AvatarProps = {
  background: "#FF5722",
  showGrid: true,
  headScale: 0.72,
  bandColor: "#0F172A",
  gridColor: "rgba(255,255,255,0.10)",
};

const CANVAS = 1080;

/**
 * Instagram-avatar. Instagram cropt naar een cirkel, dus de kop staat optisch
 * gecentreerd binnen de ingeschreven cirkel met ruime marge.
 */
export const Avatar: React.FC<AvatarProps> = ({
  background,
  showGrid,
  headScale,
  bandColor,
  gridColor,
}) => {
  const targetHeight = CANVAS * headScale;
  const scale = targetHeight / HEAD_BOX.height;
  const translateX = CANVAS / 2 - HEAD_BOX.centerX * scale;
  const translateY = CANVAS / 2 - HEAD_BOX.centerY * scale;

  return (
    <AbsoluteFill style={{ background }}>
      {showGrid ? (
        <AbsoluteFill
          style={{
            backgroundImage: `
              linear-gradient(${gridColor} 2px, transparent 2px),
              linear-gradient(90deg, ${gridColor} 2px, transparent 2px)
            `,
            backgroundSize: "90px 90px",
          }}
        />
      ) : null}

      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 34%, rgba(255,255,255,0.16), transparent 62%)",
        }}
      />

      <AbsoluteFill>
        <svg width={CANVAS} height={CANVAS} viewBox={`0 0 ${CANVAS} ${CANVAS}`}>
          <g transform={`translate(${translateX} ${translateY}) scale(${scale})`}>
            <MeneerHead bandColor={bandColor} />
          </g>
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const AVATAR_SIZE = CANVAS;
