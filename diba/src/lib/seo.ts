import type { Metadata } from "next";
import { TAAL_AF, taalAlternatieven, taalVanPad, TAALCODES } from "@/lib/taal";
import { DIBA_SITE, DIBA_SITE_URL } from "@/lib/site";
import { vertaal } from "@/lib/vertaal";

/**
 * De velden die zoekmachines en berichtendiensten lezen maar die nergens op de pagina staan.
 *
 * WAT ER ONTBRAK.
 *
 * Een audit over alle honderd pagina's vond drie dingen die op geen enkele pagina stonden:
 * een canonical, Open Graph en een Twitter-kaart. Geen daarvan is zichtbaar in de browser,
 * en dat is precies waarom ze er maanden af konden zijn zonder dat iemand het merkte.
 *
 * WAAROM ELK ERVAN ERTOE DOET.
 *
 * De canonical zegt welke URL de echte is. Deze site heeft drie routes die doorverwijzen
 * (/keloiden, /striae, /huidkanker-naevi) en een handvol pagina's die vanaf meerdere plekken
 * bereikbaar zijn. Zonder canonical mag Google zelf kiezen welke versie hij toont, en die
 * keuze valt niet altijd zoals je wil.
 *
 * Open Graph bepaalt wat er in beeld komt als iemand een link deelt. Bij een huidkliniek
 * gaat dat vooral via WhatsApp: iemand stuurt een vriendin de pagina over haar klacht. Zonder
 * deze velden is dat een kale URL zonder titel en zonder plaatje.
 *
 * HOE JE HEM GEBRUIKT.
 *
 * In een pagina met een vast metadata-object:
 *
 *   export const metadata: Metadata = zoekmachineVelden({
 *     pad: "/tarieven",
 *     titel: "Alle prijzen",
 *     omschrijving: "...",
 *   });
 *
 * En in een generateMetadata dezelfde aanroep, met de waarden uit de data.
 */

/**
 * Het deelbeeld. 1200x630 is de maat die WhatsApp, LinkedIn en Facebook verwachten.
 *
 * Opnieuw gemaakt op 11 september 2026. Rojda: "het lettertype is niet het Diba-lettertype
 * en de kleur klopt ook niet." Het oude beeld stond op een helder smaragdgroen en zette
 * DIBA CLINICS in een schreefletter; dit staat op Olive leaf (--g-700) met het echte
 * woordmerk en DM Sans, gebouwd uit de bestanden van de site zelf (scratch/maak-og.mjs).
 *
 * Nieuwe bestandsnaam en niet dezelfde: WhatsApp en LinkedIn bewaren het oude beeld per
 * adres. Onder dezelfde naam blijven mensen die het al deelden het oude zien.
 */
const DEELBEELD = {
  url: "/images/og/diba-clinics-2026.jpg",
  width: 1200,
  height: 630,
  alt: `${DIBA_SITE.name}, huidkliniek in ${DIBA_SITE.area}`,
} as const;

export type ZoekmachineVelden = {
  /** Het pad zoals het in de adresbalk staat, met schuine streep vooraan. "/" voor de home. */
  readonly pad: string;
  /** De tabbladtitel, zonder de merknaam erachter; die plakt de sjabloon in layout.tsx eraan. */
  readonly titel?: string;
  readonly omschrijving?: string;
  /**
   * Een eigen deelbeeld, als de pagina er een verdient. Een pad onder /public.
   *
   * Alleen gebruiken waar het beeld echt iets toevoegt, bijvoorbeeld een apparaat dat je
   * herkent. Anders is het gedeelde beeld beter: dat zegt in één oogopslag van wie de link is.
   */
  readonly beeld?: { readonly url: string; readonly alt: string };
  /** Voor artikelen: wanneer het stuk voor het laatst is bijgewerkt. */
  readonly gewijzigd?: string;
  readonly extra?: Metadata;
};

/**
 * De titel zoals hij bij een gedeelde link hoort te staan, dus mét de merknaam.
 *
 * De tabbladtitel krijgt die naam van de sjabloon in layout.tsx, maar Open Graph kent geen
 * sjabloon: daar moet de hele titel in het veld staan. Plakken zonder kijken gaat mis op de
 * homepage, want die draagt de naam al in zijn eigen titel — de sjabloon slaat namelijk de
 * laag over waarin hij zelf gedefinieerd is. Dan zou er "Diba Clinics | Diba Clinics" staan.
 */
function metMerknaam(titel: string): string {
  return titel.includes(DIBA_SITE.name)
    ? titel
    : `${titel} | ${DIBA_SITE.name}`;
}

export function zoekmachineVelden({
  pad,
  titel,
  omschrijving,
  beeld,
  gewijzigd,
  extra,
}: ZoekmachineVelden): Metadata {
  /* De alt-tekst van het deelbeeld gaat door het woordenboek, in de taal die het pad
     draagt. De vertaalde wrappers doen dat al via `lib/vertaalde-metadata.ts`, maar de
     Engelse en de Spaanse homepage bouwen hun velden hier rechtstreeks. Die hielden
     "huidkliniek in Rotterdam" als enige Nederlandse regel op een verder vertaalde
     pagina, onzichtbaar in de browser en zichtbaar zodra iemand de link deelt. Voor een
     Nederlands pad verandert er niets. */
  const taal = taalVanPad(pad);
  const beelden = beeld
    ? [
        {
          url: beeld.url,
          width: 1200,
          height: 630,
          alt: vertaal(beeld.alt, taal),
        },
      ]
    : [{ ...DEELBEELD, alt: vertaal(DEELBEELD.alt, taal) }];

  return {
    ...(titel ? { title: titel } : {}),
    ...(omschrijving ? { description: omschrijving } : {}),

    /* De canonical. Relatief mag: metadataBase in layout.tsx maakt er een hele URL van.
       De hreflang-verwijzingen staan er alleen bij als de pagina echt in twee talen
       bestaat; zie `lib/taal.ts` voor waarom dat geen detail is. */
    /* Geen hreflang op een pagina die zelf `noindex` draagt. Een taal die nog niet af is
       staat op noindex (zie hieronder), en hreflang vanaf zo'n pagina is een tegenstrijdig
       signaal: "dit is mijn Engelse tegenhanger" over een pagina die Google niet mag
       opnemen, terwijl die tegenhanger bewust niet terugwijst. `npm run seo` meldde dat
       312 keer, op elke Spaanse pagina twee keer. Zodra `TAAL_AF` omgaat komt de hreflang
       vanzelf terug, en wijzen de andere talen dan ook terug. */
    alternates: {
      canonical: pad,
      ...(TAAL_AF[taalVanPad(pad)] && taalAlternatieven(pad)
        ? { languages: taalAlternatieven(pad) }
        : {}),
    },

    /* Een taal die nog niet af is, hoort niet in Google. De vertaalde pagina's krijgen dat
       van `lib/vertaalde-metadata.ts`, maar twee pagina's bouwen hun velden hier
       rechtstreeks: de Engelse en de Spaanse homepage. Daardoor stond /es op 15 september
       2026 als enige Spaanse pagina zonder `noindex`, terwijl de andere drieënzestig hem
       wel hadden — precies de pagina waar iemand als eerste op uitkomt. Het pad draagt de
       taal, dus die vraag is hier ook te stellen. Zie `TAAL_AF` in lib/taal.ts. */
    ...(TAAL_AF[taalVanPad(pad)]
      ? {}
      : { robots: { index: false, follow: true } }),

    openGraph: {
      type: "website",
      locale: TAALCODES[taalVanPad(pad)].opengraph,
      siteName: DIBA_SITE.name,
      url: `${DIBA_SITE_URL}${pad === "/" ? "" : pad}`,
      ...(titel ? { title: metMerknaam(titel) } : {}),
      ...(omschrijving ? { description: omschrijving } : {}),
      images: beelden,
      ...(gewijzigd ? { modifiedTime: gewijzigd } : {}),
    },

    twitter: {
      card: "summary_large_image",
      ...(titel ? { title: metMerknaam(titel) } : {}),
      ...(omschrijving ? { description: omschrijving } : {}),
      images: beelden.map((b) => b.url),
    },

    ...extra,
  };
}
