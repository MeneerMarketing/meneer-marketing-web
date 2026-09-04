import { AbsoluteFill } from "remotion";
import { z } from "zod";
import { HEAD_BOX, MeneerHead } from "../components/MeneerHead";

export const avatarPreviewSchema = z.object({
  background: z.string(),
  showGrid: z.boolean(),
  headScale: z.number(),
  bandColor: z.string(),
  gridColor: z.string(),
});

export type AvatarPreviewProps = z.infer<typeof avatarPreviewSchema>;

const SIZES = [
  { px: 320, label: "Profielpagina" },
  { px: 176, label: "Story-ring" },
  { px: 96, label: "Feed-post" },
  { px: 56, label: "Reactie" },
];

const AvatarCircle: React.FC<AvatarPreviewProps & { size: number }> = ({
  background,
  showGrid,
  headScale,
  bandColor,
  gridColor,
  size,
}) => {
  const scale = (size * headScale) / HEAD_BOX.height;
  const translateX = size / 2 - HEAD_BOX.centerX * scale;
  const translateY = size / 2 - HEAD_BOX.centerY * scale;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        background,
        position: "relative",
        flexShrink: 0,
      }}
    >
      {showGrid ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              linear-gradient(${gridColor} 1px, transparent 1px),
              linear-gradient(90deg, ${gridColor} 1px, transparent 1px)
            `,
            backgroundSize: `${size / 12}px ${size / 12}px`,
          }}
        />
      ) : null}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ position: "absolute", inset: 0 }}
      >
        <g transform={`translate(${translateX} ${translateY}) scale(${scale})`}>
          <MeneerHead bandColor={bandColor} />
        </g>
      </svg>
    </div>
  );
};

export const AvatarPreview: React.FC<AvatarPreviewProps> = (props) => {
  return (
    <AbsoluteFill
      style={{
        background: "#f3f7fb",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 64,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {SIZES.map((s) => (
        <div
          key={s.px}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
            width: 340,
          }}
        >
          <div
            style={{
              height: 340,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AvatarCircle {...props} size={s.px} />
          </div>
          <span style={{ fontSize: 22, fontWeight: 600, color: "#64748b" }}>
            {s.label}
          </span>
          <span style={{ fontSize: 18, color: "#94a3b8" }}>{s.px}px</span>
        </div>
      ))}
    </AbsoluteFill>
  );
};
