/**
 * Cookietoestemming.
 *
 * WAAROM DIT DRIE STANDEN HEEFT EN GEEN TWEE.
 *
 * Er stond hier één sleutel met de waarde "1" of niets. Dat kan geen onderscheid maken
 * tussen "heeft nog niet gekozen" en "heeft nee gezegd", en dus bleef de balk bij iemand
 * die weigerde bij elk bezoek terugkomen. Het gevolg is dat weigeren feitelijk geen optie
 * was: de enige manier om van de balk af te komen was akkoord geven.
 *
 * Nu zijn er drie standen. `null` betekent nog niet gevraagd, `"0"` is een bewuste
 * weigering en `"1"` is toestemming. Alleen bij `"1"` laadt er iets.
 *
 * INTREKKEN MOET NET ZO MAKKELIJK ZIJN ALS GEVEN.
 *
 * Daarom kan de stand ook terug naar weigeren, vanaf /cookiebeleid. Een beleid dat zegt
 * "wis de sitegegevens in uw browser" is geen intrekmogelijkheid maar een omweg die
 * niemand loopt.
 */

export const COOKIE_CONSENT_KEY = "diba-cookie-consent";
export const COOKIE_CONSENT_EVENT = "diba-cookie-consent-change";

/** `null` = nog niet gevraagd. */
export type Toestemming = "toegestaan" | "geweigerd" | null;

function lees(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(COOKIE_CONSENT_KEY);
  } catch {
    return null;
  }
}

export function toestemmingStand(): Toestemming {
  const waarde = lees();
  if (waarde === "1") return "toegestaan";
  if (waarde === "0") return "geweigerd";
  return null;
}

/** Alleen hierop mag iets laden. Onbekend telt als nee. */
export function hasAnalyticsConsent(): boolean {
  return toestemmingStand() === "toegestaan";
}

/** Is de vraag al gesteld? Zo niet, dan hoort de balk te verschijnen. */
export function isGevraagd(): boolean {
  return toestemmingStand() !== null;
}

function schrijf(waarde: "1" | "0"): void {
  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, waarde);
  } catch {
    /* storage geblokkeerd; dan geldt de standaard, en die is nee */
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(COOKIE_CONSENT_EVENT));
  }
}

export function acceptCookieConsent(): void {
  schrijf("1");
}

export function refuseCookieConsent(): void {
  schrijf("0");
}

/**
 * Intrekken zet de stand op geweigerd en niet terug op onbekend.
 *
 * Terug naar onbekend zou de balk opnieuw laten verschijnen, en dan lijkt intrekken op
 * opnieuw gevraagd worden. Wie nee zegt, wordt niet nog een keer gevraagd.
 */
export function withdrawCookieConsent(): void {
  refuseCookieConsent();
}
