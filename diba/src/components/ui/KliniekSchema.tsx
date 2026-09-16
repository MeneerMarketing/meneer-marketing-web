import {
  DIBA_GOOGLE_PROFIEL,
  DIBA_NAP,
  DIBA_SITE_URL,
  DIBA_SOCIALS,
  DIBA_ZORGKAART,
} from "@/lib/site";
import { medicalClinicSchema, SchemaMarkup } from "@/lib/schema";
import { BEHANDELINGEN } from "@/data/behandelingen";

/**
 * Het tariefbereik, gerekend uit de behandelingen zelf.
 *
 * Niet uitgeschreven als "€20–€920": dan staat er een getal dat naast de tarieven leeft en
 * er stil van afdwaalt zodra er een behandeling bij komt. Nu volgt het de prijslijst.
 *
 * Een prijs van nul betekent "op aanvraag" en telt dus niet mee als ondergrens.
 */
function prijsbereik(): string | undefined {
  const bedragen = BEHANDELINGEN.map((b) => b.prijs).filter((p) => p > 0);
  if (bedragen.length === 0) return undefined;
  return `€${Math.min(...bedragen)}–€${Math.max(...bedragen)}`;
}

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
        /**
         * Waar dezelfde kliniek nog meer staat.
         *
         * Hier stonden alleen de drie eigen kanalen. Het Zorgkaart-profiel ontbrak, en dat
         * is juist het soort verwijzing waar `sameAs` voor is: een onafhankelijke plek waar
         * deze kliniek staat, bijgehouden door de Patiëntenfederatie en niet door onszelf.
         * Daar staat ook de 9,7 die op de homepage genoemd wordt. Zo'n koppeling is hoe
         * Google een website aan een profiel verbindt — niet door dat cijfer in ons eigen
         * schema te zetten, want een waardering die de aanbieder over zichzelf meldt telt
         * niet (zie de kop van `lib/schema.tsx`).
         *
         * Het Google-bedrijfsprofiel staat er sinds 15 september 2026 ook in, als de
         * uitgeschreven Knowledge-Graph-verwijzing; wat die link precies is staat bij
         * `DIBA_GOOGLE_PROFIEL` in `lib/site.ts`.
         */
        sameAs: [
          ...DIBA_SOCIALS.map((kanaal) => kanaal.url),
          DIBA_ZORGKAART.url,
          DIBA_GOOGLE_PROFIEL.url,
        ].filter(Boolean),
        prijsbereik: prijsbereik(),
      })}
    />
  );
}
