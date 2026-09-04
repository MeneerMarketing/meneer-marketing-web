import { DotPattern, LetterMark, SceneFrame } from "./avatarScene";
import { PAPER } from "./avatarShared";
/**
 * Het gezicht is niet het logo. De letter M is het logo, en het oranje punt
 * heeft ogen. Op 56 pixels zie je een M met een stip. Op 300 pixels zie je
 * de grap. Geen cartoon-hoofd dat het hele rondje vult.
 */
export const AvatarLetter: React.FC = () => (
  <SceneFrame
    background={PAPER}
    layers={<DotPattern color="rgba(15,23,42,0.055)" size={32} />}
  >
    <LetterMark />
  </SceneFrame>
);
