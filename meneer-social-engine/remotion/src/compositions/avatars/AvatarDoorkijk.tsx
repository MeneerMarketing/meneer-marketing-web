import { MeneerHead } from "../../components/MeneerHead";
import { ACCENT, AvatarFrame, PAPER } from "./avatarShared";

/**
 * Extreme uitsnede: hoedrand en ogen vullen de cirkel, de kin valt eraf.
 * Op 56 pixels lees je drie banen: oranje, donkere hoed, licht gezicht.
 * Dat is precies genoeg om herkend te worden in een reactielijst.
 */
export const AvatarDoorkijk: React.FC = () => (
  <AvatarFrame
    background={ACCENT}
    gridColor="rgba(255,255,255,0.14)"
    halo="rgba(255,255,255,0.22)"
    viewBox="13.2 10.8 38 38"
  >
    <MeneerHead bandColor={PAPER} look={{ x: 0, y: -0.2 }} />
  </AvatarFrame>
);
