/**
 * De taallaag van de site.
 *
 * WAAROM HET NEDERLANDS OP DE WORTEL BLIJFT.
 *
 * Elke Nederlandse pagina staat in Google op zijn huidige adres. Die verplaatsen naar
 * /nl/... zou betekenen dat honderdvijftig adressen tegelijk veranderen, met alle
 * doorverwijzingen en verloren posities van dien, en dat voor een winst die nul is: de
 * hoofdtaal van deze kliniek is Nederlands en dat blijft zo. Engels komt er dus naast,
 * onder /en, en het Nederlands verandert niet van adres.
 *
 * WELKE PAGINA'S ER IN HET ENGELS ZIJN.
 *
 * Niet alle, en dat is geen tussenstand maar de kern van de aanpak. Een Engelse pagina die
 * half vertaald is of die alleen bestaat omdat de Nederlandse bestaat, is slechter dan
 * geen Engelse pagina: hij belooft een taal die hij niet spreekt. Daarom staat hieronder
 * per pad of er een Engelse versie is. De taalkiezer, hreflang en de sitemap lezen
 * allemaal deze lijst, dus een pagina die hier niet staat bestaat in het Engels niet en
 * wordt ook nergens aangeboden.
 *
 * HOE DE KEUZE ONTHOUDEN WORDT, EN WAT HIJ NIET DOET.
 *
 * In een koekje dat alleen de taalkeuze bevat (`diba-taal`), gezet op het moment dat
 * iemand zelf op een taal klikt. Niet op basis van de browsertaal: wie in Nederland woont
 * en zijn browser op Engels heeft staan, hoort niet ongevraagd op een andere site te
 * belanden, en een zoekmachine die de Nederlandse pagina ophaalt hoort de Nederlandse
 * pagina te krijgen. Alleen een eigen klik telt.
 *
 * Dat koekje verplaatst je nooit. Hier heeft een `proxy.ts` gestaan die je op grond van
 * die keuze doorverwees, en dat was een fout: wie eenmaal op Engels had geklikt, kwam bij
 * elk bezoek aan een Nederlands adres weer op het Engels uit, ook als hij dat adres zelf
 * intypte. Yasin, 12 september 2026: "als ik op engels klik kom ik op die pagina en kan ik
 * ook niet weg van die pagina". Een taalkeuze hoort te onthouden wát je koos, niet te
 * bepalen wáár je heen mag. Elk adres toont nu wat er staat, en de taalkiezer brengt je
 * naar dezelfde pagina in de andere taal.
 */

export const TALEN = ["nl", "en"] as const;
export type Taal = (typeof TALEN)[number];

export const STANDAARDTAAL: Taal = "nl";

/** Het koekje met de taalkeuze. Alleen gezet na een klik in de taalkiezer. */
export const TAAL_COOKIE = "diba-taal";

/** Een jaar. Lang genoeg om niet elk bezoek opnieuw te vragen, kort genoeg om te verlopen. */
export const TAAL_COOKIE_MAXAGE = 60 * 60 * 24 * 365;

/**
 * Het enige paar dat apart staat: de homepage.
 *
 * Er waren er vijf. /tarieven ging naar /en/prices, /afspraak naar /en/book, en achter elk
 * van die adressen stond een eigen, met de hand geschreven Engelse pagina. Dat leest als
 * een voordeel — het Engelse adres draagt de Engelse zoekterm — en het kost een tweede
 * kopie van dezelfde tekst, die het woordenboek niet gebruikt en dus uit de pas loopt zodra
 * het Nederlands verandert. Yasin, 13 september 2026: "alles moet woordenboek, hoef geen
 * aparte pagina's."
 *
 * Nu geldt overal dezelfde regel: /en ervoor. De homepage blijft de uitzondering, want /en
 * is nu eenmaal niet /en/.
 */
export const PAREN: readonly { readonly nl: string; readonly en: string }[] = [
  { nl: "/", en: "/en" },
];

const NAAR_EN = new Map(PAREN.map((p) => [p.nl, p.en]));
const NAAR_NL = new Map(PAREN.map((p) => [p.en, p.nl]));

/** In welke taal staat dit pad? */
export function taalVanPad(pad: string): Taal {
  return pad === "/en" || pad.startsWith("/en/") ? "en" : "nl";
}

/**
 * Het pad van dezelfde pagina in de andere taal, of `null` als die er niet is.
 *
 * Dat `null` is het belangrijkste deel van deze functie. Een taalkiezer die altijd naar
 * de Engelse homepage springt, brengt iemand van de pagina over laserontharing naar een
 * beginscherm en laat hem zelf opnieuw zoeken. Dan is teruggaan naar Google sneller.
 */
/**
 * De pagina's zonder Engelse versie.
 *
 * /resultaten en de laserconfigurator staan bewust dicht; zie de uitsluiting in
 * `app/sitemap.ts`. /huidproblemen/huidkanker-naevi is een oude slug die alleen
 * doorverwijst, en /dev/components is de etalage voor onszelf. Voor alle vier geldt: een
 * taalkiezer die ze aanbiedt, wijst naar een adres dat niet bestaat.
 */
const GEEN_ENGELS = new Set([
  "/resultaten",
  "/laserontharing/configurator",
  "/huidproblemen/huidkanker-naevi",
  "/dev/components",
]);

export function anderePad(pad: string, naar: Taal): string | null {
  const schoon = pad.length > 1 && pad.endsWith("/") ? pad.slice(0, -1) : pad;

  if (naar === "en") {
    /* Eerst de pagina's met een eigen Engels adres. Voor de rest geldt: elke Nederlandse
       pagina bestaat sinds 12 september 2026 ook onder /en, met dezelfde opbouw en
       dezelfde gegevens. Zie `scratch/maak-en-routes.py`. */
    const eigen = NAAR_EN.get(schoon);
    if (eigen) return eigen;
    if (GEEN_ENGELS.has(schoon)) return null;
    return schoon === "/" ? "/en" : `/en${schoon}`;
  }

  const eigen = NAAR_NL.get(schoon);
  if (eigen) return eigen;
  if (schoon === "/en") return "/";
  if (schoon.startsWith("/en/")) return schoon.slice(3);
  return null;
}

/** Alle Engelse paden, voor de sitemap. */
export function engelsePaden(): readonly string[] {
  return PAREN.map((p) => p.en);
}

/**
 * De hreflang-verwijzingen voor een pagina.
 *
 * Alleen als de pagina in allebei de talen bestaat. Een hreflang die naar een pagina wijst
 * die er niet is, of die van twee losse pagina's beweert dat het vertalingen zijn, maakt
 * het slechter dan geen hreflang: dan gaan de twee elkaar beconcurreren in plaats van
 * elkaar versterken.
 *
 * Tot 13 september 2026 stond hier alleen de homepage, want de gegenereerde Engelse
 * pagina's droegen `noindex` zolang hun teksten nog Nederlands waren, en een hreflang naar
 * een noindex-pagina is een tegenstrijdig signaal. Nu de vertaling rond is geldt het voor
 * elk paar: `anderePad` weet welke pagina de tegenhanger is en welke vier dat niet hebben.
 *
 * `en` en niet `en-GB`: de Engelse pagina's zijn voor iedereen die in Rotterdam Engels
 * spreekt, niet voor Britten in het bijzonder.
 */
export function taalAlternatieven(
  pad: string,
): Record<string, string> | undefined {
  const taal = taalVanPad(pad);
  const ander = anderePad(pad, taal === "nl" ? "en" : "nl");
  if (!ander) return undefined;

  const nl = taal === "nl" ? pad : ander;
  const en = taal === "en" ? pad : ander;
  return {
    "nl-NL": nl,
    en: en,
    /* x-default wijst naar het Nederlands: dat is de taal van de kliniek en van de plaats
       waar ze staat. Wie geen van beide talen als voorkeur heeft, hoort daar te beginnen. */
    "x-default": nl,
  };
}
