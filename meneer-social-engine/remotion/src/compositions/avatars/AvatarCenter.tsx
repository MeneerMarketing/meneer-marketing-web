import { MeneerHead } from "../../components/MeneerHead";
import { SceneFrame } from "./avatarScene";
import { ACCENT, PAPER } from "./avatarShared";

/**
 * Alleen het hoofd. Gecentreerd, niet te groot, op een lichtgrijze achtergrond.
 * Geen browser, geen letter, geen pijl. Gewoon Meneer.
 */
export const AvatarCenter: React.FC = () => (
  <SceneFrame background={PAPER}>
    <g transform="translate(540 530) scale(9.2) translate(-32 -35)">
      <MeneerHead bandColor={ACCENT} look={{ x: 0, y: 0.3 }} />
    </g>
  </SceneFrame>
);
