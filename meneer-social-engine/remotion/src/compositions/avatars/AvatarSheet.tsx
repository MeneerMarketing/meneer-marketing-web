import { AbsoluteFill } from "remotion";
import { AVATAR_CANVAS } from "./avatarShared";
import { AvatarBlauwdruk } from "./AvatarBlauwdruk";
import { AvatarBolhoed } from "./AvatarBolhoed";
import { AvatarDoorkijk } from "./AvatarDoorkijk";
import { AvatarGroeisnor } from "./AvatarGroeisnor";

export const AVATAR_SHEET = { width: 1840, height: 860 } as const;

const VARIANTS = [
  { id: "groeisnor", label: "Groeisnor", node: <AvatarGroeisnor /> },
  { id: "blauwdruk", label: "Blauwdruk", node: <AvatarBlauwdruk /> },
  { id: "doorkijk", label: "Doorkijk", node: <AvatarDoorkijk /> },
  { id: "bolhoed", label: "Bolhoed", node: <AvatarBolhoed /> },
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

/** Overzichtsblad zodat de keuze op echte Instagram-formaten gemaakt wordt. */
export const AvatarSheet: React.FC = () => (
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
