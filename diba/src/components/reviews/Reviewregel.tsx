import Reviewregelrol, {
  type Regelreview,
} from "@/components/reviews/Reviewregelrol";
import { reviewsForTopic, type ReviewTopic } from "@/data/reviews";

/**
 * Eén review, op één regel, die doorschuift.
 *
 * Yasin, 10 september 2026: "reviews vaker laten terugkomen, hoeft niet in blokken, mag
 * klein." De site had ze op vijf plekken staan en dan meteen met drie tegelijk, onder een
 * eigen kop. Dat is een sectie, en een sectie zet je niet zomaar op een pagina die al vol
 * staat. Dit is het kleine broertje: sterren, een korte zin, een naam, een link naar de
 * rest. Past onder een prijslijst of naast een formulier zonder de bladzijde te sturen.
 *
 * Diezelfde dag erbij: er schuiven er nu meer langs in plaats van dat er één blijft staan.
 * Het schuiven zelf zit in `Reviewregelrol`; hier gebeurt de keuze.
 *
 * WAAROM DE KEUZE HIER STAAT EN NIET IN DE BROWSER.
 *
 * Het archief is 2.467 reviews met tekst. Die lijst naar elke bezoeker sturen om er zes te
 * tonen is zeshonderd kilobyte voor niets. Deze component draait op de server, kiest er zes
 * en geeft alleen die zes door.
 *
 * DE LENGTEBAND IS GEEN SMAAKKWESTIE.
 *
 * Alle zes moeten over hetzelfde aantal regels breken, anders springt het vak bij elke
 * wisseling. Daarom komen ze uit een smalle band, en staan de kortste vooraan zodat een
 * pagina met weinig ruimte de kortste krijgt.
 *
 * De keuze is bewust niet willekeurig: dezelfde pagina hoort bij elke bouw dezelfde reeks
 * te tonen, anders verandert de tekst van een statische pagina zonder dat iemand iets heeft
 * aangepast. Met `keuze` pakt een pagina een ander stuk uit dezelfde stapel, zodat er niet
 * op vijf plekken hetzelfde zinnetje staat.
 */

/** Zoveel reviews schuiven er langs. Meer voegt niets toe en kost alleen laadtijd. */
const HOEVEEL = 6;

export default function Reviewregel({
  onderwerp = "alle",
  keuze = 0,
  className = "",
}: {
  onderwerp?: ReviewTopic;
  /** Vanaf welke plek in de stapel deze pagina zijn zes pakt. */
  keuze?: number;
  className?: string;
}) {
  const bij = reviewsForTopic(onderwerp);
  const stapel = bij.length > 0 ? bij : reviewsForTopic("alle");
  const kort = [...stapel]
    .filter((r) => r.quote.length >= 45 && r.quote.length <= 110)
    .sort(
      (a, b) => a.quote.length - b.quote.length || a.id.localeCompare(b.id),
    );
  if (kort.length === 0) return null;

  const start = (keuze * HOEVEEL) % kort.length;
  const reeks: Regelreview[] = Array.from(
    { length: Math.min(HOEVEEL, kort.length) },
    (_, n) => {
      const r = kort[(start + n) % kort.length];
      return {
        id: r.id,
        quote: r.quote,
        name: r.name,
        stars: r.stars,
        relativeDate: r.relativeDate,
      };
    },
  );

  return <Reviewregelrol reviews={reeks} className={className} />;
}
