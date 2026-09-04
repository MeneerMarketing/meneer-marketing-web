import { AbsoluteFill } from "remotion";
import { ACCENT, AVATAR_CANVAS, INK, NAVY, PAPER } from "./avatarShared";

interface SceneFrameProps {
  background: string;
  children: React.ReactNode;
  /** Optionele CSS-achtergrondlagen boven de basiskleur. */
  layers?: React.ReactNode;
}

/**
 * Vrij canvas van 1080×1080. Gebruik dit wanneer het merkteken niet meer
 * rond de mascotte-viewBox draait, maar om een scene of een lettermark heen.
 */
export const SceneFrame: React.FC<SceneFrameProps> = ({
  background,
  children,
  layers,
}) => (
  <AbsoluteFill style={{ background }}>
    {layers}
    <AbsoluteFill>
      <svg
        width={AVATAR_CANVAS}
        height={AVATAR_CANVAS}
        viewBox={`0 0 ${AVATAR_CANVAS} ${AVATAR_CANVAS}`}
        shapeRendering="geometricPrecision"
      >
        {children}
      </svg>
    </AbsoluteFill>
  </AbsoluteFill>
);

/** Subtiel stippenpatroon, warmer dan een technisch raster. */
export const DotPattern: React.FC<{ color?: string; size?: number }> = ({
  color = "rgba(15,23,42,0.07)",
  size = 28,
}) => (
  <AbsoluteFill
    style={{
      backgroundImage: `radial-gradient(${color} 1.5px, transparent 1.5px)`,
      backgroundSize: `${size}px ${size}px`,
    }}
  />
);

/** Diagonale split: twee vlakken, geen grid. */
export const DiagonalSplit: React.FC<{
  topLeft: string;
  bottomRight: string;
}> = ({ topLeft, bottomRight }) => (
  <AbsoluteFill>
    <div style={{ position: "absolute", inset: 0, background: bottomRight }} />
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: topLeft,
        clipPath: "polygon(0 0, 100% 0, 0 100%)",
      }}
    />
  </AbsoluteFill>
);

/**
 * Geometrisch gezicht: geen huid, geen oren, geen bolhoed-koepel.
 * Alleen de kenmerken die je op 56px nog herkent: rand, ogen, snor.
 */
export const MeneerIcoon: React.FC<{
  x: number;
  y: number;
  scale?: number;
  lookX?: number;
  lookY?: number;
  ink?: string;
  accent?: string;
}> = ({
  x,
  y,
  scale = 1,
  lookX = 0,
  lookY = 0,
  ink = INK,
  accent = ACCENT,
}) => {
  const s = scale;
  const px = Math.max(-6, Math.min(6, lookX));
  const py = Math.max(-6, Math.min(6, lookY));

  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* Hoed: alleen de rand, geen bol. Strakker en volwassener. */}
      <rect x={-72} y={-8} width={144} height={16} rx={8} fill={ink} />
      <rect x={-52} y={-22} width={104} height={10} rx={3} fill={accent} />

      {/* Ogen: rechthoeken in plaats van grote cartoon-ovals. */}
      <rect x={-38} y={18} width={28} height={22} rx={6} fill="#fff" stroke={ink} strokeWidth={4} />
      <rect x={10} y={18} width={28} height={22} rx={6} fill="#fff" stroke={ink} strokeWidth={4} />
      <rect x={-28 + px} y={26 + py} width={10} height={10} rx={2} fill={ink} />
      <rect x={20 + px} y={26 + py} width={10} height={10} rx={2} fill={ink} />

      {/* Snor: één vloeiende curve, geen dikke cartoon-vorm. */}
      <path
        d="M -34 62 Q -18 48 0 54 Q 18 48 34 62 Q 0 78 -34 62 Z"
        fill={ink}
      />
    </g>
  );
};

/** Klein gezicht voor hoekplaatsing. Schaal ~0.22 past in een hoek van 1080. */
export const MeneerPeeking: React.FC<{
  corner: "br" | "bl" | "tr";
  lookX?: number;
  lookY?: number;
}> = ({ corner, lookX = -4, lookY = 0 }) => {
  const pos = {
    br: { x: 820, y: 780, rot: -8 },
    bl: { x: 180, y: 780, rot: 8 },
    tr: { x: 820, y: 260, rot: 8 },
  }[corner];

  return (
    <g transform={`translate(${pos.x} ${pos.y}) rotate(${pos.rot})`}>
      <MeneerIcoon x={0} y={0} scale={0.9} lookX={lookX} lookY={lookY} />
    </g>
  );
};

/** Grote letter M met een levend punt eronder. Het gezicht zit in het punt. */
export const LetterMark: React.FC<{
  ink?: string;
  accent?: string;
  paper?: string;
}> = ({ ink = NAVY, accent = ACCENT, paper = PAPER }) => (
  <g>
    <text
      x={540}
      y={500}
      textAnchor="middle"
      fontFamily="Plus Jakarta Sans, system-ui, sans-serif"
      fontWeight={800}
      fontSize={520}
      fill={ink}
      letterSpacing="-0.06em"
    >
      M
    </text>

    {/* Het punt van Meneer. */}
    <circle cx={700} cy={560} r={52} fill={accent} />
    <circle cx={688} cy={548} r={10} fill={paper} />
    <circle cx={712} cy={548} r={10} fill={paper} />
    <circle cx={686} cy={550} r={4} fill={ink} />
    <circle cx={710} cy={550} r={4} fill={ink} />
    <path
      d="M 682 572 Q 700 580 718 572"
      fill="none"
      stroke={ink}
      strokeWidth={5}
      strokeLinecap="round"
    />
  </g>
);
