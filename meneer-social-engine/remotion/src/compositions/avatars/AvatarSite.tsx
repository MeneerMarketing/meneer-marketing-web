import { MeneerPeeking, SceneFrame } from "./avatarScene";
import { ACCENT } from "./avatarShared";

/**
 * De browser is het verhaal. Meneer zit klein in de hoek en kijkt mee.
 * Oranje inspectiecirkel op de foute knop. Dit is wat je doet, niet wie je bent.
 */
export const AvatarSite: React.FC = () => {
  const bx = 140;
  const by = 200;
  const bw = 800;
  const bh = 520;

  return (
    <SceneFrame background="#FAFBFC">
      <g>
        {/* Zachte schaduw onder de browser. */}
        <rect
          x={bx + 12}
          y={by + 18}
          width={bw}
          height={bh}
          rx={36}
          fill="rgba(15,23,42,0.08)"
        />

        <rect
          x={bx}
          y={by}
          width={bw}
          height={bh}
          rx={36}
          fill="#ffffff"
          stroke="rgba(15,23,42,0.1)"
          strokeWidth={4}
        />

        {/* Titelbalk */}
        <rect x={bx} y={by} width={bw} height={72} rx={36} fill="#EEF2F7" />
        <rect x={bx} y={by + 36} width={bw} height={36} fill="#EEF2F7" />
        <circle cx={bx + 44} cy={by + 36} r={10} fill="#EF4444" />
        <circle cx={bx + 72} cy={by + 36} r={10} fill="#FBBF24" />
        <circle cx={bx + 100} cy={by + 36} r={10} fill="#22C55E" />
        <rect
          x={bx + 140}
          y={by + 22}
          width={420}
          height={28}
          rx={8}
          fill="rgba(15,23,42,0.08)"
        />
        <text
          x={bx + 156}
          y={by + 42}
          fontFamily="Plus Jakarta Sans, system-ui, sans-serif"
          fontSize={18}
          fill="rgba(15,23,42,0.45)"
        >
          jouwsite.nl
        </text>

        {/* Placeholder content */}
        <rect x={bx + 48} y={by + 110} width={280} height={22} rx={6} fill="rgba(15,23,42,0.14)" />
        <rect x={bx + 48} y={by + 148} width={520} height={14} rx={4} fill="rgba(15,23,42,0.07)" />
        <rect x={bx + 48} y={by + 174} width={440} height={14} rx={4} fill="rgba(15,23,42,0.07)" />

        {/* Foute knop */}
        <rect
          x={bx + 48}
          y={by + 240}
          width={160}
          height={52}
          rx={12}
          fill="rgba(15,23,42,0.06)"
          stroke="rgba(15,23,42,0.12)"
          strokeWidth={2}
        />

        {/* Inspectiecirkel */}
        <circle
          cx={bx + 128}
          cy={by + 266}
          r={108}
          fill="none"
          stroke={ACCENT}
          strokeWidth={8}
          strokeDasharray="16 12"
        />

        {/* Label */}
        <rect x={bx + 48} y={by + 380} width={200} height={44} rx={10} fill={ACCENT} />
        <text
          x={bx + 148}
          y={by + 410}
          textAnchor="middle"
          fontFamily="Plus Jakarta Sans, system-ui, sans-serif"
          fontWeight={800}
          fontSize={22}
          fill="#fff"
          letterSpacing="0.08em"
        >
          HIER
        </text>
      </g>

      <MeneerPeeking corner="br" lookX={-8} lookY={2} />
    </SceneFrame>
  );
};
