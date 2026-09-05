/**
 * Vijf sterren, overal dezelfde.
 *
 * YASIN, 5 september 2026: op de reviewkaarten stonden vijf groene streepjes, en die
 * moeten sterren zijn — dezelfde als linksboven in de topbalk.
 *
 * Hij heeft gelijk, en het is meer dan smaak: een ster is het teken dat iedereen leest als
 * een waardering. Vijf horizontale streepjes zijn dat niet; die las je als een streepjescode
 * of als versiering, en dan doet het cijfer waar deze kliniek trots op is niets. De topbalk
 * had het al goed en de kaarten niet, en dat verschil had geen reden.
 *
 * Het pad is hetzelfde als in de topbalk. Eén component in plaats van drie kopieën, want de
 * drie plekken waar dit stond liepen al uit elkaar in maat en kleur.
 */
export default function Sterren({
  aantal = 5,
  maat = "md",
  opDonker = false,
}: {
  /** Hoeveel sterren gevuld zijn. De rest staat er als omtrek. */
  aantal?: number;
  maat?: "sm" | "md" | "lg";
  opDonker?: boolean;
}) {
  const px = maat === "sm" ? 13 : maat === "lg" ? 20 : 16;
  const vol = opDonker ? "var(--on-dark-accent)" : "var(--g-600)";
  const leeg = opDonker ? "rgba(255,255,255,.35)" : "var(--g-200)";

  return (
    <span
      className="inline-flex items-center gap-0.5"
      role="img"
      aria-label={`${aantal} van de vijf sterren`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          aria-hidden="true"
          width={px}
          height={px}
          viewBox="0 0 20 20"
          fill={i < aantal ? vol : leeg}
        >
          <path d="M10 1.5l2.6 5.3 5.9.85-4.25 4.15 1 5.85L10 14.9l-5.25 2.75 1-5.85L1.5 7.65l5.9-.85z" />
        </svg>
      ))}
    </span>
  );
}
