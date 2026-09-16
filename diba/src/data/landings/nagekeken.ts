import { TEAM } from "@/data/team";
import type { Landing } from "./types";

/**
 * Wie de kennisbankpagina's heeft nagekeken.
 *
 * Rojda heeft de zeventien pagina's gelezen. Yasin bevestigde dat op 15 september 2026
 * ("rojda heeft al gelezen"), en dat is de datum die hier staat: de dag waarop de controle
 * in de data kwam. Een eerdere leesdag reconstrueren zou een gok zijn, en dit veld gaat als
 * `lastReviewed` de wereld in. Klopt de dag niet, verander hem hier: het is één plek.
 *
 * De functie komt uit de teamlijst, zodat het schema hetzelfde zegt als de teampagina en
 * meebeweegt als haar titel daar verandert. De achternaam staat er wel: zo stond ze als
 * founder op de vorige site (zie `app/(nl)/over-ons/page.tsx`), en een `reviewedBy` met
 * alleen een voornaam is voor Google geen persoon om aan te haken.
 *
 * Kijkt iemand anders een pagina na, of Rojda opnieuw na een wijziging, dan krijgt die
 * pagina een eigen object in plaats van deze constante.
 */
const rojda = TEAM.find((lid) => lid.slug === "rojda-sahin");
if (!rojda) {
  throw new Error(
    "Rojda staat niet meer in TEAM; pas data/landings/nagekeken.ts aan.",
  );
}

export const NAGEKEKEN_ROJDA: NonNullable<Landing["nagekeken"]> = {
  door: "Rojda Sahin",
  functie: rojda.functie,
  op: "2026-09-15",
};
