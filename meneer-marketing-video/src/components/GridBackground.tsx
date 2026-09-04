import { AbsoluteFill } from "remotion";
import { brand } from "../brand";

export const GridBackground: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: brand.colors.background,
        backgroundImage: `
          linear-gradient(${brand.colors.grid} 1px, transparent 1px),
          linear-gradient(90deg, ${brand.colors.grid} 1px, transparent 1px)
        `,
        backgroundSize: `${brand.spacing.gridSize}px ${brand.spacing.gridSize}px`,
      }}
    />
  );
};
