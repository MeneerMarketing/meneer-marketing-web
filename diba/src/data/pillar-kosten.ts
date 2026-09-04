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
 * WAT ER EERST FOUT AAN WAS.
 *
 * Het antwoord begon met "Het begint bij de huidanalyse: 50 euro, en daar zit geen
 * behandeling in", en legde daarna uit waarom we geen bedrag noemen. Yasin: dat klopt niet.
 * Wat het kost hangt af van de behandeling, dat wordt tijdens de intake duidelijk, en die
 * 50 euro gaat er weer af zodra je een behandeling neemt.
 *
 * Dat laatste stond nergens, terwijl het het enige is wat de drempel wegneemt: de intake
 * kost je niets als je daarna behandeld wordt.
 */
export function kostenVraag(): { vraag: string; antwoord: string } {
  const intake = behandelingVoorSlug("huidanalyse");
  const bedrag = intake ? prijsTekst(intake.prijs) : "een vast bedrag";

  return {
    vraag: "Wat kost dit?",
    antwoord:
      "Dat hangt af van de behandeling die bij jouw huid past, en dat stellen we tijdens de intake vast. " +
      `De intake kost ${bedrag}; neem je in dezelfde afspraak een behandeling, dan gaat dat bedrag daar weer af. ` +
      "Je hoort dan meteen om hoeveel sessies het gaat en wat het totaal wordt. " +
      "Alle tarieven per behandeling staan openbaar op de prijzenpagina.",
  };
}
