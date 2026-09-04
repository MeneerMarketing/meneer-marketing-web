import { Easing, interpolate, useCurrentFrame } from "remotion";
import { EASE_OUT } from "../../brand/beat";
import { fontFamily } from "../../brand/font";
import { MM } from "../../brand/tokens";

const CARD: React.CSSProperties = {
  background: "rgba(255,255,255,0.05)",
  border: "2px solid rgba(255,255,255,0.12)",
  borderRadius: 26,
  overflow: "hidden",
  fontFamily,
};

const seconds = (value: number) => `${value.toFixed(1).replace(".", ",")}s`;

/**
 * Laadbalk die eerst vlot begint en dan blijft hangen, precies zoals een
 * te zware homepage voelt. De teller loopt mee zodat de pijn meetbaar is.
 */
export const SlowLoadBar: React.FC<{ totalSeconds?: number; delay?: number }> = ({
  totalSeconds = 6.4,
  delay = 4,
}) => {
  const frame = useCurrentFrame();

  // Bewust hakkelend verloop: snel naar 34%, dan bijna stilstand, dan pas vol.
  const fill = interpolate(
    frame,
    [delay, delay + 6, delay + 9, delay + 26, delay + 34],
    [0, 0.34, 0.36, 0.58, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(...EASE_OUT),
    }
  );

  const elapsed = fill * totalSeconds;

  return (
    <div style={{ ...CARD, padding: 40, display: "flex", flexDirection: "column", gap: 28 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <svg width={46} height={46} viewBox="0 0 46 46" style={{ rotate: `${frame * 9}deg` }}>
          <circle
            cx="23"
            cy="23"
            r="18"
            fill="none"
            stroke="rgba(255,255,255,0.16)"
            strokeWidth="5"
          />
          <path
            d="M23 5a18 18 0 0 1 18 18"
            fill="none"
            stroke={MM.accentBold}
            strokeWidth="5"
            strokeLinecap="round"
          />
        </svg>
        <span style={{ fontSize: 34, fontWeight: 700, color: "rgba(248,250,252,0.7)" }}>
          jouwbedrijf.nl
        </span>
        <span
          style={{
            marginLeft: "auto",
            fontSize: 40,
            fontWeight: 800,
            color: MM.accentBold,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {seconds(elapsed)}
        </span>
      </div>

      <div
        style={{
          height: 26,
          borderRadius: 13,
          background: "rgba(255,255,255,0.1)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${fill * 100}%`,
            height: "100%",
            background: MM.accentBold,
            borderRadius: 13,
          }}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 26, fontWeight: 700, color: "rgba(248,250,252,0.45)" }}>
          Drie seconden
        </span>
        <span style={{ fontSize: 26, fontWeight: 700, color: "rgba(248,250,252,0.45)" }}>
          Helft al weg
        </span>
      </div>
    </div>
  );
};

/**
 * Schermkader met de vouw erin getekend. De knop zit er net onder,
 * waar niemand hem tegenkomt.
 */
export const FoldLine: React.FC<{ delay?: number }> = ({ delay = 4 }) => {
  const frame = useCurrentFrame();

  const lineWidth = interpolate(frame, [delay, delay + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE_OUT),
  });

  const sink = interpolate(frame, [delay + 12, delay + 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE_OUT),
  });

  const bar = (width: number, opacity: number) => (
    <div
      style={{
        width,
        height: 18,
        borderRadius: 9,
        background: `rgba(255,255,255,${opacity})`,
      }}
    />
  );

  return (
    <div style={{ ...CARD, padding: 0 }}>
      <div
        style={{
          padding: "26px 40px",
          display: "flex",
          alignItems: "center",
          gap: 18,
          borderBottom: "2px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: "rgba(255,255,255,0.22)",
          }}
        />
        {bar(120, 0.14)}
        {bar(96, 0.14)}
        {bar(110, 0.14)}
      </div>

      <div style={{ padding: "40px 40px 34px", display: "flex", flexDirection: "column", gap: 20 }}>
        {bar(520, 0.34)}
        {bar(400, 0.34)}
        <div style={{ height: 10 }} />
        {bar(600, 0.14)}
        {bar(540, 0.14)}
        {bar(360, 0.14)}
      </div>

      <div style={{ padding: "0 40px", display: "flex", alignItems: "center", gap: 22 }}>
        <div style={{ flex: 1, display: "flex" }}>
          <div
            style={{
              width: `${lineWidth * 100}%`,
              borderTop: `5px dashed ${MM.accentBold}`,
            }}
          />
        </div>
        <span
          style={{
            flexShrink: 0,
            fontSize: 24,
            fontWeight: 800,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: MM.accentBold,
            opacity: lineWidth,
          }}
        >
          De vouw
        </span>
      </div>

      <div
        style={{
          padding: "34px 40px 44px",
          display: "flex",
          alignItems: "center",
          gap: 22,
          opacity: interpolate(sink, [0, 1], [1, 0.35]),
          translate: `0 ${sink * 18}px`,
        }}
      >
        <div
          style={{
            padding: "22px 44px",
            borderRadius: 14,
            background: "rgba(255,255,255,0.1)",
            fontSize: 32,
            fontWeight: 800,
            color: "rgba(248,250,252,0.5)",
          }}
        >
          Neem contact op
        </div>
        <span style={{ fontSize: 28, fontWeight: 700, color: "rgba(248,250,252,0.4)" }}>
          onzichtbaar
        </span>
      </div>
    </div>
  );
};

/**
 * Lichte site-mock waar de scanner overheen kan vegen. Bewust neutraal,
 * zodat de aandacht naar de scanner en naar Meneer gaat.
 */
export const SiteMock: React.FC<{ domain?: string }> = ({
  domain = "jouwbedrijf.nl",
}) => {
  const bar = (width: number | string, opacity: number, height = 20) => (
    <div
      style={{
        width,
        height,
        borderRadius: height / 2,
        background: `rgba(15,23,42,${opacity})`,
      }}
    />
  );

  return (
    <div
      style={{
        borderRadius: 26,
        overflow: "hidden",
        background: "#ffffff",
        border: "3px solid rgba(15,23,42,0.1)",
        boxShadow: "0 26px 70px rgba(15,23,42,0.14)",
        fontFamily,
      }}
    >
      <div
        style={{
          height: 62,
          background: "rgba(15,23,42,0.05)",
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "0 24px",
        }}
      >
        <div style={{ width: 15, height: 15, borderRadius: "50%", background: "#ef4444" }} />
        <div style={{ width: 15, height: 15, borderRadius: "50%", background: "#fbbf24" }} />
        <div style={{ width: 15, height: 15, borderRadius: "50%", background: "#22c55e" }} />
        <div
          style={{
            flex: 1,
            marginLeft: 14,
            height: 32,
            borderRadius: 10,
            background: "rgba(15,23,42,0.06)",
            display: "flex",
            alignItems: "center",
            paddingLeft: 18,
            fontSize: 22,
            fontWeight: 600,
            color: "rgba(15,23,42,0.45)",
          }}
        >
          {domain}
        </div>
      </div>

      <div style={{ padding: "38px 40px 46px", display: "flex", flexDirection: "column", gap: 18 }}>
        {bar(280, 0.3, 26)}
        {bar("86%", 0.12, 16)}
        {bar("72%", 0.12, 16)}
        <div style={{ height: 12 }} />
        <div style={{ display: "flex", gap: 16 }}>
          <div
            style={{
              padding: "18px 38px",
              borderRadius: 12,
              background: "rgba(15,23,42,0.1)",
              fontSize: 26,
              fontWeight: 700,
              color: "rgba(15,23,42,0.4)",
            }}
          >
            Meer info
          </div>
          <div
            style={{
              padding: "18px 38px",
              borderRadius: 12,
              background: "rgba(15,23,42,0.1)",
              fontSize: 26,
              fontWeight: 700,
              color: "rgba(15,23,42,0.4)",
            }}
          >
            Over ons
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Tabblad plus zoekresultaat met een titel die niets zegt.
 * Twee plekken waar dezelfde lege belofte staat.
 */
export const LameTitleCard: React.FC<{ title: string; delay?: number }> = ({
  title,
  delay = 4,
}) => {
  const frame = useCurrentFrame();

  const tabIn = interpolate(frame, [delay, delay + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE_OUT),
  });

  const resultIn = interpolate(frame, [delay + 10, delay + 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE_OUT),
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          alignSelf: "flex-start",
          maxWidth: "100%",
          padding: "22px 30px",
          borderRadius: "20px 20px 6px 6px",
          background: "rgba(255,255,255,0.09)",
          border: "2px solid rgba(255,255,255,0.14)",
          fontFamily,
          opacity: tabIn,
          translate: `0 ${(1 - tabIn) * -18}px`,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 7,
            background: "rgba(255,255,255,0.28)",
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: "rgba(248,250,252,0.62)",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </span>
        <span style={{ fontSize: 30, color: "rgba(248,250,252,0.35)" }}>×</span>
      </div>

      <div
        style={{
          ...CARD,
          padding: "34px 38px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          opacity: resultIn,
          translate: `0 ${(1 - resultIn) * 16}px`,
        }}
      >
        <span style={{ fontSize: 26, fontWeight: 600, color: "rgba(248,250,252,0.45)" }}>
          jouwbedrijf.nl
        </span>
        <span style={{ fontSize: 40, fontWeight: 700, color: "#93c5fd" }}>{title}</span>
        <div
          style={{
            marginTop: 10,
            height: 14,
            width: "88%",
            borderRadius: 7,
            background: "rgba(255,255,255,0.12)",
          }}
        />
        <div
          style={{
            height: 14,
            width: "64%",
            borderRadius: 7,
            background: "rgba(255,255,255,0.12)",
          }}
        />
      </div>
    </div>
  );
};

/** Drie vinkjes die snel achter elkaar aanvliegen. */
export const TripleCheck: React.FC<{ delay?: number }> = ({ delay = 4 }) => {
  const frame = useCurrentFrame();

  return (
    <div style={{ display: "flex", gap: 26 }}>
      {[0, 1, 2].map((i) => {
        const pop = interpolate(frame, [delay + i * 7, delay + i * 7 + 10], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.34, 1.56, 0.64, 1),
        });

        return (
          <div
            key={i}
            style={{
              width: 152,
              height: 152,
              borderRadius: 42,
              background: MM.accentBold,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: interpolate(pop, [0, 0.3], [0, 1], { extrapolateRight: "clamp" }),
              scale: pop,
            }}
          >
            <svg width={76} height={76} viewBox="0 0 24 24">
              <path
                d="M4 12.6 9.4 18 20 6.6"
                fill="none"
                stroke="#ffffff"
                strokeWidth={3.2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        );
      })}
    </div>
  );
};
