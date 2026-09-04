import Link from "next/link";
import { SectieKop } from "@/components/pillar/PillarSecties";
import ReviewCard from "@/components/ui/ReviewCard";
import { reviewsForTopic, type ReviewTopic } from "@/data/reviews";

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
 * De site heeft 57 reviews in de data, niet de 3.883 die Salonized meldt. Van die 57 gaan er
 * 46 over de kliniek in het algemeen, 16 over huidveroudering, 14 over laser, 4 over
 * roodheid en 2 over acne. Voor pigment staat er niets.
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
  const reviews = reviewsForTopic(onderwerp).slice(0, 3);
  if (reviews.length < minimum) return null;

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
