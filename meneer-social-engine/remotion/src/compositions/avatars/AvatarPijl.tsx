import { DiagonalSplit, MeneerIcoon, SceneFrame } from "./avatarScene";
import { ACCENT, NAVY } from "./avatarShared";

/**
 * Diagonale split, geometrisch gezicht op klein formaat, oranje groeipijl
 * als hoofdact. Het poppetje kijkt naar de pijl, niet naar de camera.
 */
export const AvatarPijl: React.FC = () => (
  <SceneFrame
    background={NAVY}
    layers={<DiagonalSplit topLeft={ACCENT} bottomRight={NAVY} />}
  >
    <g>
      <path
        d="M 200 700 L 200 320 L 500 320 L 500 220 L 760 400 L 500 580 L 500 480 L 200 480 Z"
        fill="#fff"
      />

      {/* Gezicht op een wit rondje, klein, in de hoek */}
      <circle cx={260} cy={820} r={118} fill="#fff" />
      <MeneerIcoon x={260} y={830} scale={0.95} lookX={14} lookY={-6} />
    </g>
  </SceneFrame>
);
