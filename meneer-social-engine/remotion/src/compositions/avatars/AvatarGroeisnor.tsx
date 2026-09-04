import { MeneerHead } from "../../components/MeneerHead";
import { ACCENT, AvatarFrame, NAVY } from "./avatarShared";

/**
 * De rechterpunt van de snor loopt door in een groeilijn die het hoofd uit
 * schiet. Eén beeld dat zegt waar het over gaat, zonder een woord tekst.
 */
export const AvatarGroeisnor: React.FC = () => (
  <AvatarFrame
    background={NAVY}
    gridColor="rgba(255,255,255,0.07)"
    halo="rgba(255,87,34,0.28)"
    viewBox="8.6 11 48 48"
  >
    <MeneerHead bandColor={ACCENT} look={{ x: 1.5, y: -0.9 }} />

    {/*
      Groeilijn vanaf de snorpunt. Eerst in de achtergrondkleur gezet, zodat de
      lijn een eigen marge krijgt en niet vastkleeft aan de wang.
    */}
    {[
      { color: NAVY, width: 5.2 },
      { color: ACCENT, width: 2.6 },
    ].map((pass) => (
      <g key={pass.color}>
        <path
          d="M40.4 48.4 L45.8 44 L49.8 36.8 L55.6 25.6"
          fill="none"
          stroke={pass.color}
          strokeWidth={pass.width}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M50.4 27.2 L55.8 25.2 L54.6 31"
          fill="none"
          stroke={pass.color}
          strokeWidth={pass.width}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    ))}
    <circle cx="45.8" cy="44" r="1.4" fill={ACCENT} stroke={NAVY} strokeWidth="0.8" />
    <circle cx="49.8" cy="36.8" r="1.4" fill={ACCENT} stroke={NAVY} strokeWidth="0.8" />
  </AvatarFrame>
);
