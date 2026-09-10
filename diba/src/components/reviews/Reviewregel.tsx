import Link from "next/link";
import Sterren from "@/components/ui/Sterren";
import { reviewsForTopic, type ReviewTopic } from "@/data/reviews";

/**
 * Eén review, op één regel.
 *
 * Yasin, 10 september 2026: "reviews vaker laten terugkomen, hoeft niet in blokken, mag
 * klein." De site had ze op vijf plekken staan en dan meteen met drie tegelijk, onder een
 * eigen kop. Dat is een sectie, en een sectie zet je niet zomaar op een pagina die al vol
 * staat. Dit is het kleine broertje: sterren, een korte zin, een naam, een link naar de
 * rest. Past onder een prijslijst of naast een formulier zonder de bladzijde te sturen.
 *
 * WELKE REVIEW.
 *
 * De kortste die bij het onderwerp hoort, want deze regel mag niet afbreken. Is er voor dat
 * onderwerp niets, dan valt hij terug op de algemene stapel; is die ook leeg, dan rendert
 * hij niets. Een lege aanhalingstekenregel is erger dan geen regel.
 *
 * De keuze is bewust niet willekeurig: dezelfde pagina hoort bij elke bouw dezelfde review
 * te tonen, anders verandert de tekst van een statische pagina zonder dat iemand iets heeft
 * aangepast. Met `keuze` pakt een pagina een andere uit dezelfde stapel, zodat er niet op
 * vijf plekken hetzelfde zinnetje staat.
 */
export default function Reviewregel({
  onderwerp = "alle",
  keuze = 0,
  className = "",
}: {
  onderwerp?: ReviewTopic;
  /** De hoeveelste uit de stapel. Zo staat er niet overal dezelfde zin. */
  keuze?: number;
  className?: string;
}) {
  const bij = reviewsForTopic(onderwerp);
  const stapel = bij.length > 0 ? bij : reviewsForTopic("alle");
  /* Kort genoeg voor één of twee regels, en de kortste wint bij gelijke lengte. */
  const kort = [...stapel]
    .filter((r) => r.quote.length >= 40 && r.quote.length <= 150)
    .sort(
      (a, b) => a.quote.length - b.quote.length || a.id.localeCompare(b.id),
    );
  const review = kort[keuze % Math.max(1, kort.length)];
  if (!review) return null;

  return (
    <figure
      className={`flex flex-wrap items-baseline gap-x-3 gap-y-1 ${className}`.trim()}
    >
      <Sterren aantal={review.stars} maat="sm" />
      <blockquote className="min-w-0 text-[15px] leading-7 text-[var(--t-body)]">
        &ldquo;{review.quote}&rdquo;
      </blockquote>
      <figcaption className="diba-label text-[var(--t-muted)]">
        {review.name}
        {review.relativeDate ? ` · ${review.relativeDate}` : ""}
        <span aria-hidden="true"> · </span>
        <Link
          href="/reviews"
          className="text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
        >
          Alle reviews
        </Link>
      </figcaption>
    </figure>
  );
}
