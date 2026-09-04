import { MeneerIcoon, SceneFrame } from "./avatarScene";
import { ACCENT, NAVY, PAPER } from "./avatarShared";

/**
 * Zegelstempel: twaalf jaar als keurmerk, niet als CV-regel.
 * Het gezicht zit binnen de cirkel maar neemt minder dan een derde in.
 */
export const AvatarZegel: React.FC = () => (
  <SceneFrame background={PAPER}>
    <g>
      {/* Buitenring */}
      <circle
        cx={540}
        cy={520}
        r={340}
        fill="none"
        stroke={ACCENT}
        strokeWidth={14}
      />
      <circle
        cx={540}
        cy={520}
        r={300}
        fill="#fff"
        stroke={NAVY}
        strokeWidth={6}
      />

      {/* Bogen tekst */}
      <defs>
        <path
          id="zegel-boven"
          d="M 260 520 A 280 280 0 0 1 820 520"
          fill="none"
        />
        <path
          id="zegel-onder"
          d="M 820 520 A 280 280 0 0 1 260 520"
          fill="none"
        />
      </defs>
      <text
        fontFamily="Plus Jakarta Sans, system-ui, sans-serif"
        fontWeight={800}
        fontSize={38}
        fill={NAVY}
        letterSpacing="0.22em"
      >
        <textPath href="#zegel-boven" startOffset="50%" textAnchor="middle">
          MENEER MARKETING
        </textPath>
      </text>
      <text
        fontFamily="Plus Jakarta Sans, system-ui, sans-serif"
        fontWeight={800}
        fontSize={34}
        fill={ACCENT}
        letterSpacing="0.18em"
      >
        <textPath href="#zegel-onder" startOffset="50%" textAnchor="middle">
          12 JAAR GROEI
        </textPath>
      </text>

      {/* Klein geometrisch gezicht in het midden van de zegel */}
      <MeneerIcoon x={540} y={530} scale={1.35} lookY={-3} />

      {/* Sterretjes op de ring, als echte stempel */}
      {[0, 72, 144, 216, 288].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const cx = 540 + Math.cos(rad) * 340;
        const cy = 520 + Math.sin(rad) * 340;
        return (
          <circle key={deg} cx={cx} cy={cy} r={8} fill={ACCENT} />
        );
      })}
    </g>
  </SceneFrame>
);
