import { Composition, Folder } from "remotion";
import { brand, getDurationInFrames } from "./brand";
import { MeneerPromoVideo } from "./compositions/MeneerPromoVideo";

export const RemotionRoot: React.FC = () => {
  const durationInFrames = getDurationInFrames();

  return (
    <Folder name="Meneer-Marketing">
      <Composition
        id="MM-Promo-15s"
        component={MeneerPromoVideo}
        durationInFrames={durationInFrames}
        fps={brand.fps}
        width={1920}
        height={1080}
      />
      <Composition
        id="MM-Reel-9x16"
        component={MeneerPromoVideo}
        durationInFrames={durationInFrames}
        fps={brand.fps}
        width={1080}
        height={1920}
      />
      <Composition
        id="MM-Square-1x1"
        component={MeneerPromoVideo}
        durationInFrames={durationInFrames}
        fps={brand.fps}
        width={1080}
        height={1080}
      />
    </Folder>
  );
};
