import {
  ACCENT,
  AvatarFrame,
  BowlerHat,
  Moustache,
  NAVY,
  PAPER,
} from "./avatarShared";

/**
 * Alleen de hoed en de snor. Het gezicht laat je zelf invullen, en juist
 * daardoor blijft het hangen. Dit is de variant die tot op favicon-formaat
 * overeind blijft, omdat er niets in zit dat kan dichtslibben.
 */
export const AvatarBolhoed: React.FC = () => (
  <AvatarFrame
    background={ACCENT}
    gridColor="rgba(255,255,255,0.15)"
    halo="rgba(255,255,255,0.2)"
    viewBox="10.4 10.6 42.4 42.4"
  >
    <BowlerHat bandColor={PAPER} ink={NAVY} />
    {/* Snor omhoog, want zonder gezicht hoeft de afstand niet anatomisch te zijn. */}
    <g transform="translate(0 -6.4)">
      <Moustache ink={NAVY} />
    </g>
  </AvatarFrame>
);
