import { AbsoluteFill } from "remotion";
import { AVATAR_CANVAS } from "./avatarShared";
import { AvatarIcoon } from "./AvatarIcoon";
import { AvatarLetter } from "./AvatarLetter";
import { AvatarPijl } from "./AvatarPijl";
import { AvatarSite } from "./AvatarSite";
import { AvatarZegel } from "./AvatarZegel";

export const AVATAR_SHEET_V3 = { width: 2300, height: 860 } as const;

const VARIANTS = [
  { id: "letter", label: "M.", node: <AvatarLetter /> },
  { id: "site", label: "Site", node: <AvatarSite /> },
  { id: "zegel", label: "Zegel", node: <AvatarZegel /> },
  { id: "pijl", label: "Pijl", node: <AvatarPijl /> },
  { id: "icoon", label: "Icoon", node: <AvatarIcoon /> },
] as const;

const SIZES = [
  { px: 300, label: "Profielpagina" },
  { px: 96, label: "In de feed" },
  { px: 56, label: "Bij een reactie" },
];

const Circle: React.FC<{ size: number; children: React.ReactNode }> = ({
  size,
  children,
}) => (
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
        width: AVATAR_CANVAS,
        height: AVATAR_CANVAS,
        transform: `scale(${size / AVATAR_CANVAS})`,
        transformOrigin: "top left",
      }}
    >
      {children}
    </div>
  </div>
);

export const AvatarSheetV3: React.FC = () => (
  <AbsoluteFill
    style={{
      background: "#E8F0F8",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 44,
      fontFamily: "system-ui, sans-serif",
      padding: 48,
    }}
  >
    {VARIANTS.map((variant) => (
      <div
        key={variant.id}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 26,
          width: 380,
        }}
      >
        <span style={{ fontSize: 26, fontWeight: 800, color: "#0F172A" }}>
          {variant.label}
        </span>

        <Circle size={SIZES[0].px}>{variant.node}</Circle>

        <div style={{ display: "flex", alignItems: "flex-end", gap: 30 }}>
          {SIZES.slice(1).map((size) => (
            <div
              key={size.px}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Circle size={size.px}>{variant.node}</Circle>
              <span style={{ fontSize: 15, color: "#64748B" }}>{size.label}</span>
            </div>
          ))}
        </div>
      </div>
    ))}
  </AbsoluteFill>
);

/** Icoon apart op het sheet, als vijfde kolom in een tweede rij of los still. */
export { AvatarIcoon };
