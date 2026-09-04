import { AbsoluteFill } from "remotion";
import { AvatarInspect } from "./AvatarInspect";
import { AvatarInspectMinimal } from "./AvatarInspectMinimal";

const SIZES = [
  { px: 320, label: "Profielpagina" },
  { px: 176, label: "Story-ring" },
  { px: 96, label: "Feed-post" },
  { px: 56, label: "Reactie" },
];

function CircleFrame({
  size,
  variant,
}: {
  size: number;
  variant: "inspect" | "minimal";
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        position: "relative",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 1080,
          height: 1080,
          transform: `scale(${size / 1080})`,
          transformOrigin: "top left",
        }}
      >
        {variant === "inspect" ? <AvatarInspect /> : <AvatarInspectMinimal />}
      </div>
    </div>
  );
}

export const AvatarInspectPreview: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background: "#e8f0f8",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 48,
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
            gap: 16,
            width: 340,
          }}
        >
          <p style={{ fontSize: 20, fontWeight: 700, color: "#0f172a" }}>
            Met browser
          </p>
          <div style={{ height: 340, display: "flex", alignItems: "center" }}>
            <CircleFrame size={s.px} variant="inspect" />
          </div>
          <span style={{ fontSize: 18, color: "#64748b" }}>{s.label}</span>
        </div>
      ))}
    </AbsoluteFill>
  );
};

export const AvatarMinimalPreview: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background: "#e8f0f8",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 48,
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
            gap: 16,
            width: 340,
          }}
        >
          <p style={{ fontSize: 20, fontWeight: 700, color: "#0f172a" }}>
            Minimal
          </p>
          <div style={{ height: 340, display: "flex", alignItems: "center" }}>
            <CircleFrame size={s.px} variant="minimal" />
          </div>
          <span style={{ fontSize: 18, color: "#64748b" }}>{s.label}</span>
        </div>
      ))}
    </AbsoluteFill>
  );
};
