import type { ReactNode } from "react";

/**
 * Het eyebrow-label boven een kop (DIBA-RULES.md §6).
 *
 * Stond eerder ~30x los in de code, telkens op 9 of 10px met wisselende tracking en
 * een groen dat WCAG AA niet haalde (3.46:1). Nu één plek: 11px is de ondergrens,
 * en de kleur is gemeten tegen het vlak waar hij op staat.
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
    <p className={`diba-label ${opDonker ? "diba-label-on-dark" : ""} ${className}`.trim()}>
      {children}
    </p>
  );
}
