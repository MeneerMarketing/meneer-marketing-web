import { padNaarNederlands, padNaarTaal } from "@/lib/slugs";

/**
 * De taallaag van de site.
 *
 * WAAROM HET NEDERLANDS OP DE WORTEL BLIJFT.
 *
 * Elke Nederlandse pagina staat in Google op zijn huidige adres. Die verplaatsen naar
 * /nl/... zou betekenen dat honderdvijftig adressen tegelijk veranderen, met alle
 * doorverwijzingen en verloren posities van dien, en dat voor een winst die nul is: de
 * hoofdtaal van deze kliniek is Nederlands en dat blijft zo. De andere talen komen ernaast,
 * onder hun eigen voorvoegsel, en het Nederlands verandert niet van adres.
 *
 * WELKE PAGINA'S ER VERTAALD ZIJN.
 *
 * Niet alle, en dat is geen tussenstand maar de kern van de aanpak. Een vertaalde pagina
 * die half af is of die alleen bestaat omdat de Nederlandse bestaat, is slechter dan geen
 * vertaalde pagina: hij belooft een taal die hij niet spreekt. `GEEN_VERTALING` hieronder
 * zegt welke paden geen tegenhanger hebben. De taalkiezer, hreflang en de sitemap lezen
 * allemaal deze lijst, dus een pagina die hier staat wordt nergens in een andere taal
 * aangeboden.
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

export const TALEN = ["nl", "en", "es"] as const;
export type Taal = (typeof TALEN)[number];

export const STANDAARDTAAL: Taal = "nl";

/**
 * De talen die een voorvoegsel in het adres dragen.
 *
 * Het Nederlands hoort er niet bij: dat staat op de wortel. Elke andere taal krijgt zijn
 * tweeletterige code voor het pad, en die code is meteen de maptussenmap onder `src/app`.
 */
export const VREEMDE_TALEN = ["en", "es"] as const;
export type Vreemdetaal = (typeof VREEMDE_TALEN)[number];

export function isVreemdetaal(taal: Taal): taal is Vreemdetaal {
  return taal !== "nl";
}

/** Het koekje met de taalkeuze. Alleen gezet na een klik in de taalkiezer. */
export const TAAL_COOKIE = "diba-taal";

/** Een jaar. Lang genoeg om niet elk bezoek opnieuw te vragen, kort genoeg om te verlopen. */
export const TAAL_COOKIE_MAXAGE = 60 * 60 * 24 * 365;

/**
 * De opmaakcode en de Open Graph-code per taal.
 *
 * `en` en niet `en-GB` in hreflang: de Engelse pagina's zijn voor iedereen die in Rotterdam
 * Engels spreekt, niet voor Britten in het bijzonder. Hetzelfde geldt voor `es`. In `lang`
 * en in Open Graph staat wél een land, want die velden vragen erom.
 */
export const TAALCODES: Readonly<
  Record<Taal, { hreflang: string; html: string; opengraph: string }>
> = {
  nl: { hreflang: "nl-NL", html: "nl", opengraph: "nl_NL" },
  en: { hreflang: "en", html: "en-GB", opengraph: "en_GB" },
  es: { hreflang: "es", html: "es-ES", opengraph: "es_ES" },
};

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
 * Nu geldt overal dezelfde regel: de taalcode ervoor. De homepage blijft de uitzondering,
 * want /en is nu eenmaal niet /en/.
 */
export const PAREN: readonly { readonly nl: string; readonly en: string }[] = [
  { nl: "/", en: "/en" },
];

/**
 * De pagina's zonder vertaalde versie.
 *
 * /resultaten en de laserconfigurator staan bewust dicht; zie de uitsluiting in
 * `app/sitemap.ts`. /huidproblemen/huidkanker-naevi is een oude slug die alleen
 * doorverwijst, en /dev/components is de etalage voor onszelf. Voor alle vier geldt: een
 * taalkiezer die ze aanbiedt, wijst naar een adres dat niet bestaat.
 */
const GEEN_VERTALING = new Set([
  "/resultaten",
  "/laserontharing/configurator",
  "/huidproblemen/huidkanker-naevi",
  "/dev/components",
]);

/** Zonder schuine streep aan het eind, want /tarieven/ en /tarieven zijn dezelfde pagina. */
function schoonPad(pad: string): string {
  return pad.length > 1 && pad.endsWith("/") ? pad.slice(0, -1) : pad;
}

/** In welke taal staat dit pad? */
export function taalVanPad(pad: string): Taal {
  const eerste = schoonPad(pad).split("/")[1] ?? "";
  return (VREEMDE_TALEN as readonly string[]).includes(eerste)
    ? (eerste as Taal)
    : "nl";
}

/**
 * Hetzelfde pad, maar dan het Nederlandse adres ervan.
 *
 * Alles loopt via het Nederlands: dat is de bron, en de slugtabellen kennen alleen de weg
 * van en naar het Nederlands. Van Engels naar Spaans gaan is dus twee keer omzetten, en
 * dat hoort ook zo — anders zou elke nieuwe taal een tabel naar elke andere taal vragen.
 */
function nederlandsPad(pad: string): string | null {
  const schoon = schoonPad(pad);
  const taal = taalVanPad(schoon);
  if (taal === "nl") return schoon;
  if (schoon === `/${taal}`) return "/";
  return padNaarNederlands(schoon.slice(taal.length + 1), taal);
}

/**
 * Het pad van dezelfde pagina in een andere taal, of `null` als die er niet is.
 *
 * Dat `null` is het belangrijkste deel van deze functie. Een taalkiezer die altijd naar
 * de Engelse homepage springt, brengt iemand van de pagina over laserontharing naar een
 * beginscherm en laat hem zelf opnieuw zoeken. Dan is teruggaan naar Google sneller.
 */
export function anderePad(pad: string, naar: Taal): string | null {
  const nl = nederlandsPad(pad);
  if (nl === null) return null;
  if (GEEN_VERTALING.has(nl)) return null;
  if (naar === "nl") return nl;
  return nl === "/" ? `/${naar}` : `/${naar}${padNaarTaal(nl, naar)}`;
}

/** Alle vertaalde homepages, voor de sitemap. */
export function vertaaldePaden(): readonly string[] {
  return VREEMDE_TALEN.map((t) => `/${t}`);
}

/**
 * Is deze taal af, en mag hij dus aangeboden worden?
 *
 * Eén schakelaar, vier gevolgen. Staat een taal hier op false, dan:
 *
 *   - staat hij niet in de taalkiezer, dus niemand klikt er per ongeluk heen;
 *   - staat hij niet in de sitemap;
 *   - komt hij niet voor in hreflang;
 *   - dragen zijn pagina's `noindex` (zie `lib/vertaalde-metadata.ts`).
 *
 * De pagina's bestaan wel en zijn gewoon te bekijken door het adres in te typen. Dat is
 * precies wat je wilt tijdens het vertalen: te zien voor wie ernaar zoekt, niet aangeboden
 * aan wie dat niet doet.
 *
 * Yasin, 15 september 2026: "spaans moet uit de language switcher ook tijdelijk eruit
 * totdat we klaar daarmee zijn."
 */
export const TAAL_AF: Readonly<Record<Taal, boolean>> = {
  nl: true,
  en: true,
  /* Omzetten zodra `npm run vreemdetaal es` schoon is. */
  es: false,
};

/**
 * De hreflang-verwijzingen voor een pagina.
 *
 * Alleen als de pagina in de andere taal bestaat. Een hreflang die naar een pagina wijst
 * die er niet is, of die van twee losse pagina's beweert dat het vertalingen zijn, maakt
 * het slechter dan geen hreflang: dan gaan de twee elkaar beconcurreren in plaats van
 * elkaar versterken. Een taal die nog niet af is staat er om dezelfde reden niet in: een
 * hreflang naar een noindex-pagina is een tegenstrijdig signaal.
 */
export function taalAlternatieven(
  pad: string,
): Record<string, string> | undefined {
  const nl = anderePad(pad, "nl");
  if (nl === null) return undefined;

  const uit: Record<string, string> = { [TAALCODES.nl.hreflang]: nl };
  for (const taal of VREEMDE_TALEN) {
    if (!TAAL_AF[taal]) continue;
    const ander = anderePad(nl, taal);
    if (ander) uit[TAALCODES[taal].hreflang] = ander;
  }
  /* Twee regels is geen set: dan staat er alleen het Nederlands, en een hreflang naar
     jezelf alleen zegt niets. */
  if (Object.keys(uit).length < 2) return undefined;

  /* x-default wijst naar het Nederlands: dat is de taal van de kliniek en van de plaats
     waar ze staat. Wie geen van de talen als voorkeur heeft, hoort daar te beginnen. */
  uit["x-default"] = nl;
  return uit;
}
