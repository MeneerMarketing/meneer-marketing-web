import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { brand } from "../brand";
import { GridBackground } from "../components/GridBackground";
import { HeadlineScene } from "../components/HeadlineScene";

const SCENE_DURATION_SECONDS = 5;

export const MeneerPromoVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  const sceneDuration = SCENE_DURATION_SECONDS * fps;

  return (
    <AbsoluteFill>
      <GridBackground />

      <Sequence durationInFrames={sceneDuration}>
        <HeadlineScene
          label="Meneer Marketing"
          headline="Jouw groei online."
          supporting="Ik pak strategie, bouwen en ads aan. Jij houdt het overzicht."
        />
      </Sequence>

      <Sequence from={sceneDuration} durationInFrames={sceneDuration}>
        <HeadlineScene
          headline="Eén plan. Eén aanspreekpunt."
          supporting="Google Ads, Meta Ads, SEO en custom builds. Alles onder één dak."
        />
      </Sequence>

      <Sequence from={sceneDuration * 2} durationInFrames={sceneDuration}>
        <HeadlineScene
          headline="Klaar om te schalen?"
          supporting="Plan een kennismaking op meneermarketing.nl"
          accent
        />
      </Sequence>
    </AbsoluteFill>
  );
};

/** Shared scene timing for all formats */
export const promoSceneDurationInFrames = SCENE_DURATION_SECONDS * brand.fps;
