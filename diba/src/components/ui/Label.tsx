import type { ReactNode } from "react";

/**
 * Het eyebrow-label boven een kop (DIBA-RULES.md §6).
 *
 * Stond eerder ~30x los in de code, telkens op 9 of 10px met wisselende tracking en
 * een groen dat WCAG AA niet haalde (3.46:1). Nu één plek: 11px is de ondergrens,
 * en de kleur is gemeten tegen het vlak waar hij op staat.
 *
 * Een `span.block` en geen `<p>`. Dat is niet cosmetisch: dit label staat vaak binnen een
 * alinea of een andere `<p>`, en een `<p>` in een `<p>` is ongeldige HTML. De browser
 * herschikt die boom dan, waarop de server-render en de client-render uit elkaar lopen en
 * React de hydratie afbreekt. Dat is twee keer gebeurd voordat de oorzaak hier lag; als
 * span kan het niet meer misgaan, en visueel is er geen verschil.
 */
export default function Label({
  children,
  opDonker = false,
  className = "",
}: {
  children: ReactNode;
  /** Zet aan binnen een --g-700-vlak. */
  opDonker?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`diba-label block ${opDonker ? "diba-label-on-dark" : ""} ${className}`.trim()}
    >
      {children}
    </span>
  );
}
