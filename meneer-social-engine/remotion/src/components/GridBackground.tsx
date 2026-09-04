import { AbsoluteFill } from "remotion";
import { MM } from "../brand/tokens";

export const GridBackground = ({ dark = false }: { dark?: boolean }) => {
  const line = dark ? "rgba(255,255,255,0.05)" : "rgba(15,23,42,0.05)";

  return (
    <AbsoluteFill
      style={{
        background: dark ? MM.footer : MM.bg,
        backgroundImage: `
          linear-gradient(${line} 1px, transparent 1px),
          linear-gradient(90deg, ${line} 1px, transparent 1px)
        `,
        backgroundSize: "56px 56px",
      }}
    />
  );
};
