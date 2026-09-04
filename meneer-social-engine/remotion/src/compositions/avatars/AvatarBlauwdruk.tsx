import { MeneerHead } from "../../components/MeneerHead";
import { ACCENT, AvatarFrame, MeneerWireframe, NAVY } from "./avatarShared";

/**
 * Links de bouwtekening, rechts het afgemaakte werk. Twaalf jaar geleden
 * begon het met code, en die kant zit er nog steeds in. Eén beeld dat zowel
 * de herkomst als het vak vertelt, zonder er een woord bij te hoeven zetten.
 */
export const AvatarBlauwdruk: React.FC = () => (
  <AvatarFrame
    background={NAVY}
    gridColor="rgba(255,87,34,0.12)"
    halo="rgba(255,87,34,0.16)"
    viewBox="10.6 10.4 43 43"
  >
    <defs>
      <clipPath id="blauwdruk-links">
        <rect x="0" y="0" width="32" height="64" />
      </clipPath>
      <clipPath id="blauwdruk-rechts">
        <rect x="32" y="0" width="32" height="64" />
      </clipPath>
    </defs>

    <g clipPath="url(#blauwdruk-links)">
      <MeneerWireframe />
    </g>

    <g clipPath="url(#blauwdruk-rechts)">
      <MeneerHead bandColor={ACCENT} look={{ x: 0.4, y: -0.1 }} />
    </g>

    {/* De naad tussen tekening en resultaat. */}
    <path
      d="M32 9v46"
      fill="none"
      stroke={ACCENT}
      strokeWidth="0.7"
      strokeDasharray="2.4 2"
      opacity="0.85"
    />
  </AvatarFrame>
);
