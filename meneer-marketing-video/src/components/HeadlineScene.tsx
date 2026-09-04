import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { brand, getSafeArea, scaleForWidth } from "../brand";
import { bodyFontFamily, headlineFontFamily } from "../fonts";

type HeadlineSceneProps = {
  headline: string;
  supporting?: string;
  accent?: boolean;
  label?: string;
};

export const HeadlineScene: React.FC<HeadlineSceneProps> = ({
  headline,
  supporting,
  accent = true,
  label,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const safe = getSafeArea(width, height);

  const opacity = interpolate(frame, [0, brand.motion.fadeFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const translateY = interpolate(
    frame,
    [0, brand.motion.fadeFrames],
    [brand.motion.enterOffset, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    },
  );

  const accentWidth = interpolate(
    frame,
    [8, brand.motion.fadeFrames + 20],
    [0, 100],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    },
  );

  const headlineSize = scaleForWidth(width, brand.typography.headline);
  const supportingSize = scaleForWidth(width, brand.typography.supporting);
  const labelSize = scaleForWidth(width, brand.typography.label);
  const isPortrait = height > width;

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: safe.paddingLeft,
        paddingRight: safe.paddingRight,
        paddingTop: safe.paddingTop,
        paddingBottom: safe.paddingBottom,
        opacity,
        translate: `0 ${translateY}px`,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: isPortrait ? 32 : 24,
          maxWidth: isPortrait ? width - safe.paddingLeft * 2 : width * 0.72,
          textAlign: "center",
        }}
      >
        {label ? (
          <span
            style={{
              fontFamily: bodyFontFamily,
              fontSize: labelSize,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: brand.colors.accent,
            }}
          >
            {label}
          </span>
        ) : null}

        <h1
          style={{
            margin: 0,
            fontFamily: headlineFontFamily,
            fontSize: headlineSize,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            color: brand.colors.text,
          }}
        >
          {headline}
        </h1>

        {accent ? (
          <div
            style={{
              width: `${accentWidth}%`,
              maxWidth: 280,
              height: brand.spacing.accentBarHeight,
              borderRadius: 999,
              backgroundColor: brand.colors.accent,
            }}
          />
        ) : null}

        {supporting ? (
          <p
            style={{
              margin: 0,
              fontFamily: bodyFontFamily,
              fontSize: supportingSize,
              fontWeight: 400,
              lineHeight: 1.35,
              color: brand.colors.textMuted,
              maxWidth: isPortrait ? "100%" : "88%",
            }}
          >
            {supporting}
          </p>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
