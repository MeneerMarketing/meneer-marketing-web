import { AbsoluteFill } from "remotion";

export const AVATAR_CANVAS = 1080;

/** Kleuren van de mascotte, zodat losse onderdelen exact matchen. */
export const INK = "#1F2430";
export const SKIN = "#F8CBA3";
export const ACCENT = "#FF5722";
export const NAVY = "#0C1222";
export const PAPER = "#F3F7FB";

interface AvatarFrameProps {
  /** Achtergrondkleur van de hele cirkel. */
  background: string;
  /** Rasterkleur. Laat weg voor een vlakke achtergrond. */
  gridColor?: string;
  /** Zachte gloed achter het merkteken, voor diepte op klein formaat. */
  halo?: string;
  /**
   * Uitsnede in het 64x64 coördinatenstelsel van de mascotte.
   * Kleiner venster is een strakkere crop, dus meer punch op 56 pixels.
   */
  viewBox: string;
  children: React.ReactNode;
}

/**
 * Vierkant canvas van 1080 met achtergrond, raster en één svg-laag die in het
 * 64x64 stelsel van de mascotte tekent. Alle avatars gebruiken dit frame,
 * zodat de uitsnede het enige verschil is dat de compositie bepaalt.
 */
export const AvatarFrame: React.FC<AvatarFrameProps> = ({
  background,
  gridColor,
  halo,
  viewBox,
  children,
}) => (
  <AbsoluteFill style={{ background }}>
    {gridColor ? (
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

    {halo ? (
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 46%, ${halo}, transparent 62%)`,
        }}
      />
    ) : null}

    <AbsoluteFill>
      <svg
        width={AVATAR_CANVAS}
        height={AVATAR_CANVAS}
        viewBox={viewBox}
        shapeRendering="geometricPrecision"
      >
        {children}
      </svg>
    </AbsoluteFill>
  </AbsoluteFill>
);

/** Bolhoed als los onderdeel: koepel, band, rand. Tekenorde is belangrijk. */
export const BowlerHat: React.FC<{
  bandColor?: string;
  ink?: string;
}> = ({ bandColor = ACCENT, ink = INK }) => (
  <g>
    <path d="M19 24.6a13 12.2 0 0 1 26 0v0.9h-26z" fill={ink} />
    <rect x="19.8" y="20.7" width="24.4" height="4" fill={bandColor} />
    <rect x="11.5" y="23.8" width="41" height="4.4" rx="2.2" fill={ink} />
  </g>
);

/** Snor als los onderdeel. */
export const Moustache: React.FC<{ ink?: string }> = ({ ink = INK }) => (
  <path
    d="M23.2 48.6C25.4 45.6 29.6 45.9 32 47.9C34.4 45.9 38.6 45.6 40.8 48.6C40 51.3 36.1 52.2 32 50.3C27.9 52.2 24 51.3 23.2 48.6Z"
    fill={ink}
  />
);

/**
 * Dezelfde mascotte, maar als blauwdruk: alleen lijnen, niets ingevuld.
 * Exact dezelfde geometrie als MeneerHead, zodat de twee helften naadloos
 * op elkaar aansluiten wanneer je ze naast elkaar zet.
 */
export const MeneerWireframe: React.FC<{
  stroke?: string;
  strokeWidth?: number;
}> = ({ stroke = ACCENT, strokeWidth = 0.85 }) => {
  const line = {
    fill: "none",
    stroke,
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  // Een tekening hoort minder te bevatten dan het eindresultaat. Daarom alleen
  // de silhouetten en één oog, plus een hulplijn op ooghoogte.
  return (
    <g>
      <ellipse cx="32" cy="41" rx="17" ry="16.6" {...line} />
      <ellipse cx="26.4" cy="36.4" rx="5.8" ry="7.4" {...line} />
      <path d="M19 24.6a13 12.2 0 0 1 26 0v0.9h-26z" {...line} />
      <rect x="11.5" y="23.8" width="41" height="4.4" rx="2.2" {...line} />
      <path
        d="M8.6 36.4h23.4"
        {...line}
        strokeWidth={strokeWidth * 0.62}
        strokeDasharray="1.6 1.8"
        opacity="0.75"
      />
    </g>
  );
};
