import type { Metadata } from "next";
import { DIBA_SITE, DIBA_SITE_URL } from "@/lib/site";
import {
  anderePad,
  TAALCODES,
  TAAL_AF,
  type Vreemdetaal,
} from "@/lib/taal";
import { vertaal } from "@/lib/vertaal";

/**
 * De paginatitel en de omschrijving van een vertaalde wrapper.
 *
 * De wrappers onder /en en /es renderen dezelfde pagina met de taal omgezet, en dat werkt
 * voor alles wat in beeld staat. De `metadata` kwam er ongemoeid doorheen: die wordt op de
 * Nederlandse pagina berekend en daarna letterlijk overgenomen. Gevolg: een pagina vol
 * Engelse tekst met "Tarieven huidbehandelingen Rotterdam" in het tabblad.
 *
 * Dit haalt de titel en de omschrijving alsnog door het woordenboek, op alle vier de
 * plekken waar ze staan: de gewone velden, Open Graph en Twitter. Een titel die niet in het
 * woordenboek staat blijft Nederlands, net als overal elders — dat is zichtbaar in de
 * meting en het breekt niets.
 *
 * En de canonical: die wees naar het Nederlandse adres. Voor een pagina die zichzelf als
 * vertaling aanbiedt is dat het verkeerde signaal; hij wijst nu naar het vertaalde adres
 * zelf. De hreflang-verwijzingen komen mee uit de Nederlandse metadata en kloppen aan alle
 * kanten: een hreflang-set hoort symmetrisch te zijn.
 *
 * WANNEER ER `noindex` OP STAAT.
 *
 * Zolang een taal half af is. Een pagina die een taal belooft die hij niet spreekt hoort
 * niet in Google. Dat staat per taal in `TAAL_AF` (lib/taal.ts): het Engels is
 * sinds 13 september 2026 rond en staat op true, het Spaans wordt in golven gevuld. Staat
 * een taal op true, dan erft elke pagina de robots-instelling van zijn Nederlandse
 * tegenhanger — staat die op `noindex` (de voorwaarden, het cookiebeleid), dan geldt dat
 * vanzelf ook hier.
 */
export function vertaaldeMetadata(
  basis: Metadata,
  taal: Vreemdetaal,
  pad: string,
): Metadata {
  const vert = (v: unknown) => (typeof v === "string" ? vertaal(v, taal) : v);

  /* De titel voor Open Graph draagt de merknaam: "Hoe wij werken | Diba Clinics". Die hele
     regel staat niet in het woordenboek — de sleutel is de titel zonder merknaam — dus
     kwam er Nederlands uit terwijl het tabblad wél vertaald was. Vandaar het achtervoegsel
     eraf, vertalen, en er weer aan. */
  const vertTitel = (v: unknown) => {
    if (typeof v !== "string") return v;
    const staart = ` | ${DIBA_SITE.name}`;
    if (!v.endsWith(staart)) return vertaal(v, taal);
    return `${vertaal(v.slice(0, -staart.length), taal)}${staart}`;
  };

  /* Het adres van deze pagina komt uit de canonical van de Nederlandse, niet uit `pad`.
     De wrappers geven hun routepatroon door, en op een pagina met een slug is dat
     letterlijk "/en/treatments/[slug]". Zolang de vertaalde kant op `noindex` stond viel
     dat niet op; als canonical van een pagina die wél geïndexeerd wordt is het een adres
     dat niet bestaat. De Nederlandse canonical is wél ingevuld, dus die omzetten. */
  const nl =
    typeof basis.alternates?.canonical === "string"
      ? basis.alternates.canonical
      : null;
  /* `anderePad` zet het Nederlandse pad om naar het vertaalde adres, inclusief de slugs van
     die taal: /huidproblemen/rimpels wordt /en/skin-concerns/wrinkles en
     /es/problemas-de-piel/arrugas. Zie `lib/slugs.ts`. */
  const eigen = (nl ? anderePad(nl, taal) : null) ?? pad;
  const url = `${DIBA_SITE_URL}${eigen}`;

  return {
    ...basis,
    ...(basis.title ? { title: vert(basis.title) as Metadata["title"] } : {}),
    ...(basis.description
      ? { description: vert(basis.description) as string }
      : {}),
    alternates: { ...basis.alternates, canonical: eigen },
    ...(TAAL_AF[taal] ? {} : { robots: { index: false, follow: true } }),
    ...(basis.openGraph
      ? {
          openGraph: {
            ...basis.openGraph,
            locale: TAALCODES[taal].opengraph,
            url,
            ...("title" in basis.openGraph && basis.openGraph.title
              ? { title: vertTitel(basis.openGraph.title) as string }
              : {}),
            ...("description" in basis.openGraph && basis.openGraph.description
              ? { description: vert(basis.openGraph.description) as string }
              : {}),
          } as Metadata["openGraph"],
        }
      : {}),
    ...(basis.twitter
      ? {
          twitter: {
            ...basis.twitter,
            ...("title" in basis.twitter && basis.twitter.title
              ? { title: vertTitel(basis.twitter.title) as string }
              : {}),
            ...("description" in basis.twitter && basis.twitter.description
              ? { description: vert(basis.twitter.description) as string }
              : {}),
          } as Metadata["twitter"],
        }
      : {}),
  };
}
