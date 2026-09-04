import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { MM } from "../brand/tokens";
import { fontFamily } from "../brand/font";
import {
  FormatPill,
  MeneerStamp,
  REEL_SAFE,
  ReelCanvas,
  ReelFooter,
} from "../components/reel/ReelChrome";

export const deRekeningSchema = z.object({
  hook: z.string(),
  amount: z.string(),
  period: z.string(),
  problem: z.string(),
  calculation: z.array(z.object({ label: z.string(), value: z.string() })),
  fix: z.string(),
  meneerNote: z.string(),
});

export type DeRekeningProps = z.infer<typeof deRekeningSchema>;

export const deRekeningDefaultProps: DeRekeningProps = {
  hook: "Deze knop kost je",
  amount: "€840",
  period: "per maand",
  problem: "Je belangrijkste knop staat onder de vouw, in dezelfde kleur als de rest.",
  calculation: [
    { label: "Bezoekers per maand", value: "2.400" },
    { label: "Klikt nu door", value: "1,4%" },
    { label: "Realistisch haalbaar", value: "3,2%" },
    { label: "Gemiddelde orderwaarde", value: "€78" },
  ],
  fix: "Knop boven de vouw, in je accentkleur, met een werkwoord erop.",
  meneerNote: "Je hebt het verkeer al betaald.",
};

const AmountScene = ({
  hook,
  amount,
  period,
}: Pick<DeRekeningProps, "hook" | "amount" | "period">) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 0.4 * fps], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const amountScale = interpolate(frame, [0.2 * fps, 0.8 * fps], [0.85, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill
      style={{
        padding: `${REEL_SAFE.top}px ${REEL_SAFE.horizontal}px ${REEL_SAFE.bottom}px`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        gap: 16,
        opacity,
        fontFamily,
      }}
    >
      <FormatPill label="De rekening" />
      <p style={{ fontSize: 48, fontWeight: 600, opacity: 0.6, marginTop: 40 }}>
        {hook}
      </p>
      <p
        style={{
          fontSize: 220,
          fontWeight: 900,
          lineHeight: 0.9,
          color: MM.accentBold,
          scale: amountScale,
          letterSpacing: "-0.03em",
        }}
      >
        {amount}
      </p>
      <p style={{ fontSize: 64, fontWeight: 800 }}>{period}</p>
    </AbsoluteFill>
  );
};

const ProblemScene = ({ problem }: { problem: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 0.35 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });
  const translateY = interpolate(frame, [0, 0.35 * fps], [40, 0], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill
      style={{
        padding: `${REEL_SAFE.top}px ${REEL_SAFE.horizontal}px ${REEL_SAFE.bottom}px`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 32,
        opacity,
        translate: `0 ${translateY}px`,
        fontFamily,
      }}
    >
      <p
        style={{
          fontSize: 30,
          fontWeight: 800,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          opacity: 0.45,
        }}
      >
        Wat er gebeurt
      </p>
      <p style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.12 }}>{problem}</p>
    </AbsoluteFill>
  );
};

const CalcScene = ({
  calculation,
  amount,
}: Pick<DeRekeningProps, "calculation" | "amount">) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        padding: `${REEL_SAFE.top}px ${REEL_SAFE.horizontal}px ${REEL_SAFE.bottom}px`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 20,
        fontFamily,
      }}
    >
      <p
        style={{
          fontSize: 30,
          fontWeight: 800,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          opacity: 0.45,
          marginBottom: 16,
        }}
      >
        De rekensom
      </p>
      {calculation.map((row, i) => {
        const rowOpacity = interpolate(
          frame,
          [i * 0.35 * fps, i * 0.35 * fps + 0.3 * fps],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        const rowY = interpolate(
          frame,
          [i * 0.35 * fps, i * 0.35 * fps + 0.3 * fps],
          [24, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        return (
          <div
            key={row.label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              padding: "20px 0",
              borderBottom: "2px solid rgba(15,23,42,0.08)",
              opacity: rowOpacity,
              translate: `0 ${rowY}px`,
            }}
          >
            <span style={{ fontSize: 38, opacity: 0.7 }}>{row.label}</span>
            <span style={{ fontSize: 48, fontWeight: 800 }}>{row.value}</span>
          </div>
        );
      })}
      <div
        style={{
          marginTop: 24,
          background: MM.accentBold,
          color: "#fff",
          borderRadius: 20,
          padding: "28px 36px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          opacity: interpolate(frame, [1.6 * fps, 2 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(frame, [1.6 * fps, 2 * fps], [0.95, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <span style={{ fontSize: 40, fontWeight: 700 }}>Kost je</span>
        <span style={{ fontSize: 72, fontWeight: 900 }}>{amount}</span>
      </div>
    </AbsoluteFill>
  );
};

const OutroScene = ({
  fix,
  meneerNote,
}: Pick<DeRekeningProps, "fix" | "meneerNote">) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 0.4 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  const stampScale = interpolate(frame, [0.5 * fps, 1 * fps], [0.8, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill
      style={{
        padding: `${REEL_SAFE.top}px ${REEL_SAFE.horizontal}px ${REEL_SAFE.bottom}px`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 40,
        opacity,
        fontFamily,
      }}
    >
      <p
        style={{
          fontSize: 30,
          fontWeight: 800,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: MM.accentBold,
        }}
      >
        Wat ik zou doen
      </p>
      <p style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.14 }}>{fix}</p>
      <p style={{ fontSize: 44, fontStyle: "italic", opacity: 0.75 }}>
        {meneerNote}
      </p>
      <div style={{ marginTop: 20 }}>
        <MeneerStamp scale={stampScale} />
      </div>
    </AbsoluteFill>
  );
};

export const DeRekeningReel: React.FC<DeRekeningProps> = (props) => {
  const { fps } = useVideoConfig();

  return (
    <ReelCanvas>
      <Sequence durationInFrames={2.5 * fps}>
        <AmountScene hook={props.hook} amount={props.amount} period={props.period} />
      </Sequence>
      <Sequence from={2.5 * fps} durationInFrames={2.5 * fps}>
        <ProblemScene problem={props.problem} />
      </Sequence>
      <Sequence from={5 * fps} durationInFrames={3 * fps}>
        <CalcScene calculation={props.calculation} amount={props.amount} />
      </Sequence>
      <Sequence from={8 * fps} durationInFrames={4 * fps}>
        <OutroScene fix={props.fix} meneerNote={props.meneerNote} />
      </Sequence>
      <ReelFooter look={{ x: -0.3, y: 1.8 }} />
    </ReelCanvas>
  );
};

export const DE_REKENING_DURATION_SEC = 12;
