import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { EASE_OUT } from "../../brand/beat";
import { fontFamily } from "../../brand/font";
import { MM } from "../../brand/tokens";
import { MeneerHead } from "../MeneerHead";

/** Veilige zone voor Instagram Reels (notch boven, caption en UI onder). */
export const REEL_SAFE = {
  top: 150,
  bottom: 230,
  horizontal: 80,
} as const;

export type Tone = "light" | "dark" | "accent";

const TONE = {
  light: {
    bg: MM.bg,
    line: "rgba(15,23,42,0.06)",
    text: MM.text,
    soft: "rgba(15,23,42,0.55)",
  },
  dark: {
    bg: MM.footer,
    line: "rgba(255,255,255,0.07)",
    text: "#f8fafc",
    soft: "rgba(248,250,252,0.6)",
  },
  accent: {
    bg: MM.accentBold,
    line: "rgba(255,255,255,0.12)",
    text: "#ffffff",
    soft: "rgba(255,255,255,0.75)",
  },
} as const;

export const toneColors = (tone: Tone) => TONE[tone];

export const ReelCanvas: React.FC<{
  children: React.ReactNode;
  dark?: boolean;
}> = ({ children, dark = false }) => (
  <AbsoluteFill
    style={{
      background: dark ? MM.footer : MM.bg,
      fontFamily,
      color: dark ? "#f8fafc" : MM.text,
    }}
  >
    {children}
  </AbsoluteFill>
);

interface SceneShellProps {
  children: React.ReactNode;
  tone?: Tone;
  /** Waar de inhoud verticaal landt. */
  align?: "top" | "center" | "bottom";
  /** Korte kleurflits op de cut, zodat de montage aanvoelt als geknipt. */
  flash?: boolean;
  watermark?: boolean;
  /** Traag inzoomen op de achtergrond houdt statische scenes levend. */
  drift?: boolean;
  padded?: boolean;
}

/**
 * Basis voor elke scene: brand-grid, safe zones, watermerk en cut-flits.
 * Elke scene kiest zelf zijn tone, want het contrast tussen licht en donker
 * is wat de montage ritme geeft.
 */
export const SceneShell: React.FC<SceneShellProps> = ({
  children,
  tone = "light",
  align = "center",
  flash = true,
  watermark = true,
  drift = true,
  padded = true,
}) => {
  const frame = useCurrentFrame();
  const c = TONE[tone];

  const flashOpacity = flash
    ? interpolate(frame, [0, 1, 5], [0.9, 0.5, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  const gridScale = drift ? interpolate(frame, [0, 120], [1, 1.06]) : 1;

  const justifyContent =
    align === "top" ? "flex-start" : align === "bottom" ? "flex-end" : "center";

  return (
    <AbsoluteFill style={{ background: c.bg, color: c.text, fontFamily }}>
      <AbsoluteFill
        style={{
          backgroundImage: `
            linear-gradient(${c.line} 1.5px, transparent 1.5px),
            linear-gradient(90deg, ${c.line} 1.5px, transparent 1.5px)
          `,
          backgroundSize: "88px 88px",
          scale: gridScale,
        }}
      />

      {tone !== "accent" ? (
        <AbsoluteFill
          style={{
            background:
              tone === "dark"
                ? "radial-gradient(circle at 50% 42%, rgba(255,87,34,0.16), transparent 62%)"
                : "radial-gradient(circle at 50% 38%, rgba(255,255,255,0.9), transparent 65%)",
          }}
        />
      ) : null}

      <AbsoluteFill
        style={{
          padding: padded
            ? `${REEL_SAFE.top}px ${REEL_SAFE.horizontal}px ${REEL_SAFE.bottom}px`
            : undefined,
          display: "flex",
          flexDirection: "column",
          justifyContent,
        }}
      >
        {children}
      </AbsoluteFill>

      {watermark ? <Watermark tone={tone} /> : null}

      {flashOpacity > 0 ? (
        <AbsoluteFill
          style={{
            background: tone === "accent" ? "#ffffff" : MM.accentBold,
            opacity: flashOpacity,
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

export const Watermark: React.FC<{ tone: Tone }> = ({ tone }) => {
  const c = TONE[tone];

  return (
    <div
      style={{
        position: "absolute",
        top: 62,
        left: REEL_SAFE.horizontal,
        display: "flex",
        alignItems: "center",
        gap: 14,
        opacity: 0.75,
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: tone === "accent" ? "#ffffff" : MM.accentBold,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg viewBox="0 0 64 64" width={42} height={42}>
          <MeneerHead look={{ x: 0, y: 0.4 }} bandColor={MM.footer} />
        </svg>
      </div>
      <span
        style={{
          fontFamily,
          fontSize: 24,
          fontWeight: 800,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: c.text,
        }}
      >
        Meneer Marketing
      </span>
    </div>
  );
};

export const FormatPill: React.FC<{
  label: string;
  tone?: Tone;
  delay?: number;
}> = ({ label, tone = "light", delay = 0 }) => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame, [delay, delay + 9], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE_OUT),
  });

  return (
    <div
      style={{
        alignSelf: "flex-start",
        background: tone === "accent" ? "#ffffff" : MM.accentBold,
        color: tone === "accent" ? MM.accentBold : "#ffffff",
        borderRadius: 999,
        padding: "13px 30px",
        fontFamily,
        fontSize: 26,
        fontWeight: 800,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        opacity: progress,
        translate: `${(1 - progress) * -24}px 0`,
      }}
    >
      {label}
    </div>
  );
};

export const Kicker: React.FC<{
  children: React.ReactNode;
  tone?: Tone;
  delay?: number;
}> = ({ children, tone = "light", delay = 0 }) => {
  const frame = useCurrentFrame();
  const c = TONE[tone];

  const progress = interpolate(frame, [delay, delay + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <p
      style={{
        margin: 0,
        fontFamily,
        fontSize: 28,
        fontWeight: 800,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: c.soft,
        opacity: progress,
      }}
    >
      {children}
    </p>
  );
};

export const ReelFooter: React.FC<{
  look?: { x: number; y: number };
  tone?: Tone;
}> = ({ look = { x: 0, y: 0 }, tone = "light" }) => {
  const c = TONE[tone];

  return (
    <div
      style={{
        position: "absolute",
        left: REEL_SAFE.horizontal,
        right: REEL_SAFE.horizontal,
        bottom: 100,
        display: "flex",
        alignItems: "center",
        gap: 20,
        paddingTop: 24,
        borderTop: `2px solid ${tone === "light" ? "rgba(15,23,42,0.1)" : "rgba(255,255,255,0.2)"}`,
        fontFamily,
        color: c.text,
      }}
    >
      <div
        style={{
          width: 88,
          height: 88,
          borderRadius: "50%",
          background: tone === "accent" ? "#ffffff" : MM.accentBold,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg viewBox="0 0 64 64" width={68} height={68}>
          <MeneerHead look={look} bandColor={MM.footer} />
        </svg>
      </div>
      <div>
        <div style={{ fontSize: 32, fontWeight: 800 }}>Meneer Marketing</div>
        <div style={{ fontSize: 26, opacity: 0.6 }}>meneermarketing.nl</div>
      </div>
    </div>
  );
};

export const MeneerStamp: React.FC<{
  scale?: number;
  rotate?: string;
  label?: string;
  tone?: Tone;
}> = ({ scale = 1, rotate = "-3deg", label = "Meneer fixt.", tone = "light" }) => (
  <div
    style={{
      alignSelf: "flex-start",
      background: tone === "accent" ? "#ffffff" : MM.accentBold,
      color: tone === "accent" ? MM.accentBold : "#ffffff",
      borderRadius: 20,
      padding: "24px 48px",
      fontFamily,
      fontSize: 56,
      fontWeight: 800,
      scale,
      rotate,
      letterSpacing: "-0.01em",
    }}
  >
    {label}
  </div>
);
