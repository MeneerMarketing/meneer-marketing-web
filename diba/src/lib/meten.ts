/**
 * Meten wat er telt: vier klikken en één verzending.
 *
 * WAAROM DIT BESTAAT.
 *
 * Google Analytics telt vanzelf paginaweergaves, en daar heeft een kliniek weinig aan. De
 * vragen die ertoe doen zijn: hoeveel mensen klikken door naar de agenda, wie belt er,
 * wie appt er, en hoeveel vragen komen er via het formulier binnen. Dat zijn vier
 * gebeurtenissen, en die moeten hier vandaan komen.
 *
 * WAT ER NIET IN GAAT.
 *
 * Geen naam, geen mailadres, geen telefoonnummer, geen vrije tekst. Alleen het soort
 * gebeurtenis en het pad waar hij plaatsvond. Een kliniek meet op welke pagina iemand
 * besloot te bellen; niet wie er belde.
 *
 * ZONDER TOESTEMMING GEBEURT ER NIETS.
 *
 * `window.gtag` bestaat pas nadat de bezoeker akkoord heeft gegeven en het script geladen
 * is (zie `Analytics.tsx`). Staat het er niet, dan doet deze functie niets. Dat is geen
 * foutafhandeling maar de bedoeling.
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export type Gebeurtenis =
  "afspraak_geopend" | "bellen" | "whatsapp" | "contact_verstuurd";

export function meld(
  naam: Gebeurtenis,
  gegevens?: Record<string, string>,
): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function")
    return;
  window.gtag("event", naam, {
    plek: window.location.pathname,
    ...gegevens,
  });
}
