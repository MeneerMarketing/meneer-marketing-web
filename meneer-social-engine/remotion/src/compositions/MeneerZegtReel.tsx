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

export const meneerZegtSchema = z.object({
  everyoneSays: z.string(),
  meneerSays: z.string(),
  verdict: z.string(),
});

export type MeneerZegtProps = z.infer<typeof meneerZegtSchema>;

export const meneerZegtDefaultProps: MeneerZegtProps = {
  everyoneSays: "Je moet iedere dag posten.",
  meneerSays: "Je moet iets posten dat iemand wil bekijken.",
  verdict: "Meneer heeft gesproken.",
};

const TextScene = ({
  label,
  text,
  accent = false,
}: {
  label: string;
  text: string;
  accent?: boolean;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 0.45 * fps], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const translateY = interpolate(frame, [0, 0.45 * fps], [48, 0], {
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
        gap: 28,
        opacity,
        translate: `0 ${translateY}px`,
        fontFamily,
      }}
    >
      <FormatPill label={label} />
      <h1
        style={{
          fontSize: accent ? 96 : 84,
          fontWeight: 900,
          lineHeight: 1.08,
          margin: 0,
          background: accent
            ? "linear-gradient(transparent 62%, rgba(255,87,34,0.35) 62%)"
            : undefined,
        }}
      >
        {text}
      </h1>
      {accent ? (
        <div style={{ marginTop: 40 }}>
          <MeneerStamp scale={1} rotate="-2deg" />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const VerdictScene = ({ verdict }: { verdict: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const scale = interpolate(frame, [0, 0.5 * fps], [0.9, 1], {
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
        alignItems: "center",
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
        Meneer heeft gesproken
      </p>
      <p
        style={{
          fontSize: 72,
          fontWeight: 900,
          textAlign: "center",
          lineHeight: 1.1,
          scale,
        }}
      >
        {verdict}
      </p>
    </AbsoluteFill>
  );
};

export const MeneerZegtReel: React.FC<MeneerZegtProps> = (props) => {
  const { fps } = useVideoConfig();

  return (
    <ReelCanvas>
      <Sequence durationInFrames={2.5 * fps}>
        <TextScene label="Iedereen zegt" text={props.everyoneSays} />
      </Sequence>
      <Sequence from={2.5 * fps} durationInFrames={4 * fps}>
        <TextScene
          label="Meneer zegt"
          text={props.meneerSays}
          accent
        />
      </Sequence>
      <Sequence from={6.5 * fps} durationInFrames={3.5 * fps}>
        <VerdictScene verdict={props.verdict} />
      </Sequence>
      <ReelFooter look={{ x: 0.3, y: -0.5 }} />
    </ReelCanvas>
  );
};

export const MENEER_ZEGT_DURATION_SEC = 10;
