import { DotPattern, MeneerIcoon, SceneFrame } from "./avatarScene";
import { PAPER } from "./avatarShared";

/**
 * Alleen het geometrische icoon, gecentreerd maar niet groot.
 * Geen bolhoed-koepel, geen wangen, geen cartoon-proporties.
 */
export const AvatarIcoon: React.FC = () => (
  <SceneFrame
    background={PAPER}
    layers={<DotPattern color="rgba(255,87,34,0.09)" size={36} />}
  >
    <MeneerIcoon x={540} y={540} scale={2.4} lookY={-2} />
  </SceneFrame>
);
