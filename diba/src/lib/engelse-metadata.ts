import type { Metadata } from "next";
import { DIBA_SITE_URL } from "@/lib/site";
import { t } from "@/lib/vertaal";

/**
 * De paginatitel en de omschrijving van een Engelse wrapper.
 *
 * De wrappers onder /en renderen dezelfde pagina met de taal op Engels, en dat werkt voor
 * alles wat in beeld staat. De `metadata` kwam er ongemoeid doorheen: die wordt op de
 * Nederlandse pagina berekend en daarna letterlijk overgenomen. Gevolg: een pagina vol
 * Engelse tekst met "Tarieven huidbehandelingen Rotterdam" in het tabblad.
 *
 * Dit haalt de titel en de omschrijving alsnog door het woordenboek, op alle vier de
 * plekken waar ze staan: de gewone velden, Open Graph en Twitter. Een titel die niet in het
 * woordenboek staat blijft Nederlands, net als overal elders — dat is zichtbaar in de
 * meting en het breekt niets.
 *
 * En de canonical: die wees naar het Nederlandse adres. Voor een pagina die zichzelf als
 * vertaling aanbiedt is dat het verkeerde signaal; hij wijst nu naar het Engelse adres
 * zelf. De hreflang-verwijzingen komen mee uit de Nederlandse metadata en kloppen aan
 * beide kanten: een hreflang-set hoort symmetrisch te zijn.
 *
 * WAAROM HIER GEEN `noindex` MEER STAAT.
 *
 * Die stond er zolang de Engelse pagina's half Nederlands waren: een pagina die een taal
 * belooft die hij niet spreekt hoort niet in Google. Sinds 13 september 2026 is de
 * vertaling rond, dus erft elke Engelse pagina de robots-instelling van zijn Nederlandse
 * tegenhanger. Staat de Nederlandse op `noindex` — de voorwaarden, het cookiebeleid — dan
 * geldt dat vanzelf ook voor de Engelse.
 */
export function engelseMetadata(basis: Metadata, pad: string): Metadata {
  const vert = (v: unknown) => (typeof v === "string" ? t(v) : v);

  /* Het adres van deze pagina komt uit de canonical van de Nederlandse, niet uit `pad`.
     De wrappers geven hun routepatroon door, en op een pagina met een slug is dat
     letterlijk "/en/behandelingen/[slug]". Zolang de Engelse kant op `noindex` stond viel
     dat niet op; als canonical van een pagina die wél geïndexeerd wordt is het een adres
     dat niet bestaat. De Nederlandse canonical is wél ingevuld, dus daar /en voor. */
  const nl =
    typeof basis.alternates?.canonical === "string"
      ? basis.alternates.canonical
      : null;
  const engels = nl ? (nl === "/" ? "/en" : `/en${nl}`) : pad;
  const url = `${DIBA_SITE_URL}${engels === "/en" ? "/en" : engels}`;

  return {
    ...basis,
    ...(basis.title ? { title: vert(basis.title) as Metadata["title"] } : {}),
    ...(basis.description
      ? { description: vert(basis.description) as string }
      : {}),
    alternates: { ...basis.alternates, canonical: engels },
    ...(basis.openGraph
      ? {
          openGraph: {
            ...basis.openGraph,
            locale: "en_GB",
            url,
            ...("title" in basis.openGraph && basis.openGraph.title
              ? { title: vert(basis.openGraph.title) as string }
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
              ? { title: vert(basis.twitter.title) as string }
              : {}),
            ...("description" in basis.twitter && basis.twitter.description
              ? { description: vert(basis.twitter.description) as string }
              : {}),
          } as Metadata["twitter"],
        }
      : {}),
  };
}
