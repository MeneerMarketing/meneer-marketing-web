import { behandelingVoorSlug, prijsTekst } from "@/data/behandelingen";

/**
 * De kostenvraag op de huidprobleempagina's.
 *
 * WAT HIER MIS WAS.
 *
 * Vijf pagina's hadden een FAQ-vraag "Wat kost dit?" waarvan het antwoord begon met
 * `[PRIJS-NODIG]`. Door de vlaggenfilter werd dat niets, dus stond er een vraag met een half
 * antwoord eronder. En het poortje in `pagina-af.ts` houdt elke pagina met zo'n vlag uit de
 * index zodra het aangezet wordt, dus vijf van de acht huidprobleempagina's zouden er bij
 * livegang uit vallen op een prijs die we allang hebben.
 *
 * Het bedrag stond namelijk gewoon in `behandelingen.ts`, en op /intake en op de uitkomst
 * van het huidprofiel werd het al getoond. Dezelfde fout als daar: de prijs bestond, alleen
 * niet op de plek waar hij gevraagd werd.
 *
 * WAAROM ÉÉN GEDEELDE VRAAG EN GEEN VIJF LOSSE ZINNEN.
 *
 * Vijf keer hetzelfde antwoord overschrijven levert vijf plekken op die uit elkaar gaan
 * lopen zodra het tarief verandert. Nu komt het bedrag uit de behandelingentabel en staat
 * de zin één keer.
 *
 * WAT ER MET OPZET NIET IN STAAT.
 *
 * Een prijs voor de behandeling van dít probleem. Die hangt af van wat er uit de meting
 * komt, en een bedrag noemen dat we niet kunnen waarmaken is precies wat /ons-verhaal
 * verbiedt. In plaats daarvan wijst het antwoord naar de prijslijst, waar alles staat.
 */
export function kostenVraag(): { vraag: string; antwoord: string } {
  const nul = behandelingVoorSlug("huidanalyse");
  const bedrag = nul ? prijsTekst(nul.prijs) : "een vast bedrag";

  return {
    vraag: "Wat kost dit?",
    antwoord:
      `Het begint bij de nulmeting: ${bedrag}, en daar zit geen behandeling in. ` +
      "Je gaat naar huis met wat er gemeten is en wat dat betekent, ook als het antwoord is dat je niets hoeft te doen. " +
      "Wat een traject daarna kost hangt af van wat er uit die meting komt; een bedrag noemen voordat we gekeken hebben zou een slag in de lucht zijn. " +
      "Alle tarieven per behandeling staan wel gewoon openbaar op de prijzenpagina, ook de duurste.",
  };
}
