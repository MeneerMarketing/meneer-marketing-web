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
import { BrowserFrame } from "../components/reel/BrowserFrame";
import {
  FormatPill,
  MeneerStamp,
  REEL_SAFE,
  ReelCanvas,
  ReelFooter,
} from "../components/reel/ReelChrome";

export const meneerFixtSchema = z.object({
  hook: z.string(),
  problemLabel: z.string(),
  timeLabel: z.string(),
  resultLabel: z.string(),
  clientName: z.string().optional(),
  beforeImage: z.string().optional(),
  afterImage: z.string().optional(),
});

export type MeneerFixtProps = z.infer<typeof meneerFixtSchema>;

export const meneerFixtDefaultProps: MeneerFixtProps = {
  hook: "Deze hero krijgt vijftien minuten van me.",
  problemLabel: "Drie knoppen, geen duidelijke belofte",
  timeLabel: "Vijftien minuten later",
  resultLabel: "Eén belofte. Eén knop. Sneller geladen.",
  clientName: "BestRest",
};

const HookScene = ({ hook }: { hook: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const translateY = interpolate(frame, [0, 0.5 * fps], [50, 0], {
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
        gap: 32,
        opacity,
        translate: `0 ${translateY}px`,
        fontFamily,
      }}
    >
      <FormatPill label="Meneer fixt" />
      <h1
        style={{
          fontSize: 88,
          fontWeight: 900,
          lineHeight: 1.06,
          margin: 0,
        }}
      >
        {hook}
      </h1>
    </AbsoluteFill>
  );
};

const BeforeScene = ({
  problemLabel,
  beforeImage,
}: Pick<MeneerFixtProps, "problemLabel" | "beforeImage">) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 0.4 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });
  const scale = interpolate(frame, [0, 0.5 * fps], [0.94, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill
      style={{
        padding: `${REEL_SAFE.top}px ${REEL_SAFE.horizontal}px ${REEL_SAFE.bottom}px`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 28,
        opacity,
        fontFamily,
      }}
    >
      <div style={{ scale }}>
        <BrowserFrame
          label="Before"
          variant="before"
          imageSrc={beforeImage}
          highlightCircle={!beforeImage}
        >
          {!beforeImage ? (
            <p
              style={{
                fontSize: 40,
                fontWeight: 700,
                textAlign: "center",
                color: "#991b1b",
                lineHeight: 1.25,
                maxWidth: 600,
              }}
            >
              {problemLabel}
            </p>
          ) : null}
        </BrowserFrame>
      </div>
    </AbsoluteFill>
  );
};

const AfterScene = ({
  timeLabel,
  resultLabel,
  afterImage,
  clientName,
}: Pick<MeneerFixtProps, "timeLabel" | "resultLabel" | "afterImage" | "clientName">) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const wipe = interpolate(frame, [0, 0.6 * fps], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const timeOpacity = interpolate(frame, [0.3 * fps, 0.7 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        padding: `${REEL_SAFE.top}px ${REEL_SAFE.horizontal}px ${REEL_SAFE.bottom}px`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 28,
        fontFamily,
      }}
    >
      <p
        style={{
          fontSize: 44,
          fontWeight: 800,
          color: MM.accentBold,
          opacity: timeOpacity,
        }}
      >
        {timeLabel}
      </p>
      <div style={{ scale: interpolate(wipe, [0, 1], [0.94, 1]) }}>
        <BrowserFrame
          label="After"
          variant="after"
          imageSrc={afterImage}
        >
          {!afterImage ? (
            <p
              style={{
                fontSize: 40,
                fontWeight: 700,
                textAlign: "center",
                color: "#166534",
                lineHeight: 1.25,
                maxWidth: 600,
              }}
            >
              {resultLabel}
            </p>
          ) : null}
        </BrowserFrame>
      </div>
      {clientName ? (
        <p style={{ fontSize: 36, fontWeight: 600, opacity: timeOpacity * 0.55 }}>
          {clientName}
        </p>
      ) : null}
    </AbsoluteFill>
  );
};

const StampScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = interpolate(frame, [0, 0.5 * fps], [0.75, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const opacity = interpolate(frame, [0, 0.3 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity,
        fontFamily,
      }}
    >
      <MeneerStamp scale={scale} />
    </AbsoluteFill>
  );
};

export const MeneerFixtReel: React.FC<MeneerFixtProps> = (props) => {
  const { fps } = useVideoConfig();

  return (
    <ReelCanvas>
      <Sequence durationInFrames={2 * fps}>
        <HookScene hook={props.hook} />
      </Sequence>
      <Sequence from={2 * fps} durationInFrames={3 * fps}>
        <BeforeScene
          problemLabel={props.problemLabel}
          beforeImage={props.beforeImage}
        />
      </Sequence>
      <Sequence from={5 * fps} durationInFrames={4 * fps}>
        <AfterScene
          timeLabel={props.timeLabel}
          resultLabel={props.resultLabel}
          afterImage={props.afterImage}
          clientName={props.clientName}
        />
      </Sequence>
      <Sequence from={9 * fps} durationInFrames={2 * fps}>
        <StampScene />
      </Sequence>
      <ReelFooter look={{ x: 0, y: 0 }} />
    </ReelCanvas>
  );
};

export const MENEER_FIXT_DURATION_SEC = 11;
