import { Easing, interpolate, useCurrentFrame } from "remotion";
import { EASE_OUT, EASE_SLAM, euro, nl } from "../../brand/beat";
import { fontFamily } from "../../brand/font";
import { MM } from "../../brand/tokens";

interface WordPunchProps {
  text: string;
  fontSize: number;
  delay?: number;
  stagger?: number;
  color?: string;
  weight?: number;
  lineHeight?: number;
  /** Woorden die een oranje marker krijgen. Case-insensitive, punctuatie wordt genegeerd. */
  mark?: string[];
  align?: "left" | "center";
  maxWidth?: number;
}

const bare = (word: string) => word.replace(/[.,:;!?"']/g, "").toLowerCase();

/**
 * Tekst die woord voor woord inslaat: iets te groot binnenkomen, scherp worden,
 * en dan stil vallen. Dat leest op telefoonformaat veel harder dan een fade.
 */
export const WordPunch: React.FC<WordPunchProps> = ({
  text,
  fontSize,
  delay = 0,
  stagger = 3,
  color = MM.text,
  weight = 800,
  lineHeight = 1.06,
  mark = [],
  align = "left",
  maxWidth,
}) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");
  const marked = mark.map(bare);

  return (
    <p
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: `${fontSize * 0.06}px ${fontSize * 0.26}px`,
        justifyContent: align === "center" ? "center" : "flex-start",
        margin: 0,
        maxWidth,
        fontFamily,
        fontSize,
        fontWeight: weight,
        lineHeight,
        color,
        letterSpacing: "-0.02em",
      }}
    >
      {words.map((word, i) => {
        const start = delay + i * stagger;
        const progress = interpolate(frame, [start, start + 7], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(...EASE_OUT),
        });

        const isMarked = marked.includes(bare(word));

        return (
          <span
            key={`${word}-${i}`}
            style={{
              display: "inline-block",
              opacity: progress,
              translate: `0 ${(1 - progress) * fontSize * 0.34}px`,
              scale: interpolate(progress, [0, 1], [1.14, 1]),
              filter: `blur(${(1 - progress) * 9}px)`,
              background: isMarked
                ? `linear-gradient(transparent 58%, ${MM.accentBold}59 58%)`
                : undefined,
            }}
          >
            {word}
          </span>
        );
      })}
    </p>
  );
};

interface TickerProps {
  from: number;
  to: number;
  delay?: number;
  duration?: number;
  fontSize: number;
  color?: string;
  weight?: number;
  format?: "number" | "euro";
  prefix?: string;
}

/** Meelopend getal. Tabular figures zodat de cijfers niet gaan dansen. */
export const Ticker: React.FC<TickerProps> = ({
  from,
  to,
  delay = 0,
  duration = 24,
  fontSize,
  color = MM.text,
  weight = 800,
  format = "number",
  prefix,
}) => {
  const frame = useCurrentFrame();

  const value = interpolate(frame, [delay, delay + duration], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE_OUT),
  });

  const settle = interpolate(
    frame,
    [delay + duration - 2, delay + duration + 6],
    [1.06, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(...EASE_SLAM),
    }
  );

  const rounded = Math.round(value);
  const label = format === "euro" ? euro.format(rounded) : nl.format(rounded);

  return (
    <span
      style={{
        display: "inline-block",
        fontFamily,
        fontSize,
        fontWeight: weight,
        color,
        lineHeight: 0.92,
        letterSpacing: "-0.045em",
        fontVariantNumeric: "tabular-nums",
        scale: settle,
      }}
    >
      {prefix}
      {label}
    </span>
  );
};

interface SlamCardProps {
  children: React.ReactNode;
  delay?: number;
  tone?: "light" | "dark" | "accent";
}

/** Kaart die vanaf links inschuift met een lichte overshoot. */
export const SlamCard: React.FC<SlamCardProps> = ({
  children,
  delay = 0,
  tone = "light",
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame, [delay, delay + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE_SLAM),
  });

  const palette = {
    light: { bg: "#ffffff", border: "rgba(15,23,42,0.08)", text: MM.text },
    dark: { bg: "rgba(255,255,255,0.06)", border: "rgba(255,255,255,0.14)", text: "#f8fafc" },
    accent: { bg: MM.accentBold, border: MM.accentBold, text: "#ffffff" },
  }[tone];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 28,
        padding: "34px 38px",
        borderRadius: 26,
        background: palette.bg,
        border: `2px solid ${palette.border}`,
        color: palette.text,
        boxShadow: tone === "light" ? "0 20px 60px rgba(15,23,42,0.10)" : undefined,
        opacity: interpolate(progress, [0, 0.3], [0, 1], {
          extrapolateRight: "clamp",
        }),
        translate: `${(1 - progress) * -70}px 0`,
        fontFamily,
      }}
    >
      {children}
    </div>
  );
};

/** Oranje vinkje dat zichzelf tekent. */
export const DrawnCheck: React.FC<{ delay?: number; size?: number }> = ({
  delay = 0,
  size = 62,
}) => {
  const frame = useCurrentFrame();

  const draw = interpolate(frame, [delay, delay + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE_OUT),
  });

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: MM.accentBold,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        scale: interpolate(draw, [0, 1], [0.6, 1]),
      }}
    >
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24">
        <path
          d="M4 12.6 9.4 18 20 6.6"
          fill="none"
          stroke="#ffffff"
          strokeWidth={3.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={30}
          strokeDashoffset={30 * (1 - draw)}
        />
      </svg>
    </div>
  );
};
