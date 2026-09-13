import { DIBA_NAP, DIBA_SITE_URL, DIBA_SOCIALS } from "@/lib/site";
import { medicalClinicSchema, SchemaMarkup } from "@/lib/schema";

/**
 * Het JSON-LD over de kliniek zelf.
 *
 * De omschrijving gaat door het woordenboek en staat sinds 13 september 2026 ook echt in
 * het Engels op de Engelse kant. Dat lukte eerder niet: de enige indeling van de site
 * rendert voordat een pagina de taal zet, en als los component na `{children}` zetten hielp
 * niet, want React geeft geen volgorde waarin het dan aan de beurt komt. Met twee
 * wortelindelingen, `(nl)` en `(en)`, zet de Engelse indeling de taal in zijn eigen body,
 * dus voordat er iets onder hem gerenderd wordt.
 *
 * Rojda, 7 september 2026: de Instagram koppelen. Voor Google is dit de koppeling:
 * hetzelfde bedrijf op een andere plek. Sinds 11 september staan TikTok en Facebook er ook
 * in; met alleen de Instagram legt Google die koppeling voor de andere twee niet.
 */
export default function KliniekSchema() {
  return (
    <SchemaMarkup
      data={medicalClinicSchema({
        nap: DIBA_NAP,
        url: DIBA_SITE_URL,
        sameAs: DIBA_SOCIALS.length
          ? DIBA_SOCIALS.map((kanaal) => kanaal.url)
          : undefined,
      })}
    />
  );
}
