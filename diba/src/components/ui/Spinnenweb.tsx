import { SCAN_ASSEN, type AsId } from "@/data/huidprofiel";

/**
 * Het spinnenweb van de Eve-M-scan.
 *
 * Zat eerst binnen in `MiniHuidscan` en kon daardoor nergens anders komen. Nu staat het
 * los, want de vorm moet op drie plekken terug te zien zijn: in de scan zelf, in het
 * uitklapje rechtsonder en op de behandelingenpagina. Dat is precies het punt van een
 * profiel: je herkent het terug.
 *
 * Twee lagen, en die twee zijn de hele boodschap:
 *
 *   1. De gevulde vorm — wat jij vertelt.
 *   2. De gestippelde buitenring — wat er nog niet gemeten is.
 *
 * Dat gat blijft staan tot iemand echt onder de Eve-M heeft gelegen. "Wij gokken niet,
 * wij meten" wordt een leugen op het moment dat een vragenlijstje een dichte vorm
 * teruggeeft alsof er iets gemeten is.
 */

const CX = 170;
const CY = 170;
const R = 116;
const RINGEN = [0.3, 0.55, 0.8, 1];

/** Hoek per as: de eerste as recht omhoog, daarna met de klok mee. */
export function punt(index: number, straal: number, aantal = SCAN_ASSEN.length) {
  const hoek = ((-90 + index * (360 / aantal)) * Math.PI) / 180;
  return [CX + straal * Math.cos(hoek), CY + straal * Math.sin(hoek)] as const;
}

function veelhoek(straal: number) {
  return SCAN_ASSEN.map((_, i) => punt(i, straal).join(",")).join(" ");
}

type Props = {
  readonly waarden: Readonly<Record<AsId, number>>;
  /** Aslabels erbij. Uit bij kleine maten: dan past er niets omheen. */
  readonly metLabels?: boolean;
  readonly className?: string;
};

export default function Spinnenweb({
  waarden,
  metLabels = false,
  className = "",
}: Props) {
  const vorm = SCAN_ASSEN.map((as, i) =>
    punt(i, (R * Math.min(100, Math.max(0, waarden[as.id]))) / 100).join(","),
  ).join(" ");

  return (
    <svg
      viewBox={metLabels ? "-34 -4 408 348" : "36 36 268 268"}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {/* Raster */}
      {RINGEN.map((f) => (
        <polygon
          key={f}
          points={veelhoek(R * f)}
          fill="none"
          stroke="var(--g-100)"
          strokeWidth={f === 1 ? 1.2 : 0.8}
        />
      ))}
      {SCAN_ASSEN.map((as, i) => {
        const [x, y] = punt(i, R);
        return (
          <line
            key={as.id}
            x1={CX}
            y1={CY}
            x2={x}
            y2={y}
            stroke="var(--g-100)"
            strokeWidth="0.8"
          />
        );
      })}

      {/* Wat nog niet gemeten is: de buitenring blijft open. */}
      <polygon
        points={veelhoek(R)}
        fill="none"
        stroke="var(--g-300)"
        strokeWidth="1.4"
        strokeDasharray="4 5"
      />

      {/* Wat jij vertelt. */}
      <polygon
        points={vorm}
        fill="var(--g-400)"
        fillOpacity="0.45"
        stroke="var(--g-700)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {SCAN_ASSEN.map((as, i) => {
        const [x, y] = punt(i, (R * waarden[as.id]) / 100);
        return <circle key={as.id} cx={x} cy={y} r="3.5" fill="var(--g-700)" />;
      })}

      <circle cx={CX} cy={CY} r="3.5" fill="var(--g-700)" />

      {metLabels
        ? SCAN_ASSEN.map((as, i) => {
            const [x, y] = punt(i, R + 22);
            return (
              <text
                key={as.id}
                x={x}
                y={y + 4}
                textAnchor={x > CX + 4 ? "start" : x < CX - 4 ? "end" : "middle"}
                fontSize="12"
                fill="var(--t-muted)"
              >
                {as.label}
              </text>
            );
          })
        : null}
    </svg>
  );
}
