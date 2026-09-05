import Link from "next/link";
import { SectieKop } from "@/components/pillar/PillarSecties";
import ReviewCard from "@/components/ui/ReviewCard";
import { reviewsForTopic, type Review, type ReviewTopic } from "@/data/reviews";

/**
 * Wat anderen over dít onderwerp schreven.
 *
 * WAAROM DIT EEN COMPONENT IS.
 *
 * Dit blok stond alleen op /laserontharing, en dat is precies de plek waar het het meeste
 * doet: iemand die twijfelt leest liever wat een ander schreef dan wat wij beweren. Yasin,
 * 5 september: dit moet op de huidprobleempagina's ook, met reviews die over díé klacht
 * gaan.
 *
 * WAT DE DEKKING BEPERKT.
 *
 * Alle 390 pagina's van het Salonized-archief zijn nagelopen: 2.467 van de 3.893 reviews
 * hebben tekst. Daarin gaat het bijna altijd over het bezoek en bijna nooit over de klacht.
 * Geteld op een woord in de review zelf: gezichtsbehandeling 29, laser 18, huidconsult 12,
 * acne 11, littekens 7, roodheid 1, pigment 0, rimpels 0.
 *
 * Daarom rendert dit onderdeel niets onder een ondergrens. Twee reviews onder een kop
 * "Wat anderen erover zeggen" leest als een kliniek die er maar twee heeft, en dat is
 * slechter dan geen sectie. Zodra er meer reviews binnenkomen, verschijnen de secties
 * vanzelf op de pagina's die ze dan halen.
 */
export default function ReviewsBijOnderwerp({
  onderwerp,
  intro,
  minimum = 3,
  achtergrond = "wit",
}: {
  onderwerp: Exclude<ReviewTopic, "alle">;
  /** Eén regel die zegt waar deze reviews over gaan. */
  intro: string;
  /** Onder dit aantal blijft de sectie weg. */
  minimum?: number;
  achtergrond?: "wit" | "zacht";
}) {
  const overOnderwerp = reviewsForTopic(onderwerp);
  if (overOnderwerp.length < minimum) return null;
  const reviews = drieVanGelijkeLengte(overOnderwerp);

  return (
    <section
      id="reviews"
      className={`scroll-mt-[var(--anker-offset)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28 ${
        achtergrond === "zacht" ? "bg-[var(--g-050)]" : "bg-white"
      }`}
    >
      <div className="mx-auto">
        <SectieKop
          label="Reviews"
          kop="Wat anderen"
          accent="erover zeggen."
          intro={intro}
          raster="gelijk"
        />
        <ul className="mt-12 grid gap-4 md:grid-cols-3 md:items-start">
          {reviews.map((r) => (
            <li key={r.id}>
              <ReviewCard
                quote={r.quote}
                name={r.name}
                treatment={r.treatment}
                stars={r.stars}
                relativeDate={r.relativeDate}
              />
            </li>
          ))}
        </ul>
        <Link
          href="/reviews"
          className="diba-label mt-10 inline-flex min-h-11 items-center gap-1.5 text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
        >
          Alle reviews
          <span aria-hidden="true">›</span>
        </Link>
      </div>
    </section>
  );
}

/**
 * Drie reviews die ongeveer even lang zijn.
 *
 * De eerste drie uit de lijst pakken gaf een rij van 240, 210 en 90 tekens, en die derde
 * kaart bungelt dan onder de andere twee. Dit zoekt het drietal met het kleinste verschil
 * in lengte en zet ze daarna terug in de volgorde van de data.
 *
 * Kiezen op lengte is geen kiezen op inhoud: de intro belooft dat we niet de mooiste
 * eruit halen, en dat blijft zo. Wie langer is dan een ander zegt niets over wat er staat.
 */
function drieVanGelijkeLengte(reviews: readonly Review[]): readonly Review[] {
  if (reviews.length <= 3) return reviews;
  const opLengte = [...reviews].sort((a, b) => a.quote.length - b.quote.length);
  let beste = opLengte.slice(0, 3);
  let kleinste = Infinity;
  for (let i = 0; i + 3 <= opLengte.length; i++) {
    const spreiding = opLengte[i + 2].quote.length - opLengte[i].quote.length;
    if (spreiding < kleinste) {
      kleinste = spreiding;
      beste = opLengte.slice(i, i + 3);
    }
  }
  return reviews.filter((r) => beste.includes(r));
}
