import { Img, staticFile } from "remotion";
import { MM } from "../../brand/tokens";
import { fontFamily } from "../../brand/font";

interface BrowserFrameProps {
  label?: string;
  variant?: "before" | "after" | "neutral";
  children?: React.ReactNode;
  imageSrc?: string;
  highlightCircle?: boolean;
  width?: number;
  height?: number;
}

const VARIANT_STYLE = {
  before: { border: "#fecaca", bg: "#fef2f2", tag: "#991b1b", tagBg: "#fee2e2" },
  after: { border: "#86efac", bg: "#f0fdf4", tag: "#166534", tagBg: "#dcfce7" },
  neutral: { border: "rgba(15,23,42,0.1)", bg: "#fff", tag: MM.muted, tagBg: MM.surface },
} as const;

export const BrowserFrame: React.FC<BrowserFrameProps> = ({
  label,
  variant = "neutral",
  children,
  imageSrc,
  highlightCircle = false,
  width = 920,
  height = 620,
}) => {
  const v = VARIANT_STYLE[variant];

  return (
    <div
      style={{
        width,
        height,
        borderRadius: 28,
        overflow: "hidden",
        background: "#fff",
        border: `4px solid ${v.border}`,
        boxShadow: "0 24px 80px rgba(15,23,42,0.12)",
        fontFamily,
        position: "relative",
      }}
    >
      <div
        style={{
          height: 56,
          background: MM.surface,
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          gap: 10,
        }}
      >
        <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#ef4444" }} />
        <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#fbbf24" }} />
        <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#22c55e" }} />
        <div
          style={{
            flex: 1,
            marginLeft: 12,
            height: 28,
            borderRadius: 8,
            background: "rgba(15,23,42,0.06)",
          }}
        />
      </div>

      <div
        style={{
          height: height - 56,
          background: v.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 32,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {imageSrc ? (
          <Img
            src={staticFile(imageSrc)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          children
        )}

        {label ? (
          <div
            style={{
              position: "absolute",
              top: 20,
              left: 20,
              background: v.tagBg,
              color: v.tag,
              padding: "10px 20px",
              borderRadius: 10,
              fontSize: 26,
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            {label}
          </div>
        ) : null}

        {highlightCircle ? (
          <div
            style={{
              position: "absolute",
              width: 200,
              height: 200,
              borderRadius: "50%",
              border: `5px dashed ${MM.accentBold}`,
              bottom: 80,
              left: "50%",
              translate: "-50% 0",
            }}
          />
        ) : null}
      </div>
    </div>
  );
};
