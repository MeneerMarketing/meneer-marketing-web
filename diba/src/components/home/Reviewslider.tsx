import Link from "next/link";
import Sterren from "@/components/ui/Sterren";
import { SALONIZED_REVIEWS } from "@/data/salonized-reviews";
import { ZONDER_TEKST } from "@/data/reviews-archief";
import {
  DIBA_SALONIZED_RATING,
  DIBA_SALONIZED_REVIEWS_URL,
  DIBA_SALONIZED_REVIEW_COUNT,
} from "@/lib/site";

/**
 * De reviews op de homepage, als twee banden die langsschuiven.
 *
 * YASIN, 5 september 2026: "5,0 gebaseerd op 3.893 reviews is niet normaal, dus daar moeten
 * we mee pronken." Dat cijfer stond alleen in de topbalk, in zes punts, naast de taalkiezer.
 *
 * WAAROM TWEE BANDEN EN GEEN RASTER. Een raster van negen reviews is een muur die je scant
 * en overslaat. Twee banden die tegen elkaar in schuiven doen iets anders: ze suggereren dat
 * er nog veel meer is waar deze net vandaan komen, en dat is hier ook zo. Het is dezelfde
 * gedachte als het cijfer zelf: niet negen mooie, maar bijna vierduizend.
 *
 * DE BEWEGING IS TE STOPPEN. De banden staan stil zodra je muis erop komt, zodat je een
 * kaart die je aanspreekt kunt uitlezen. Bij `prefers-reduced-motion` bewegen ze helemaal
 * niet; dan staat er gewoon een rij kaarten. Beide zitten al in de bestaande
 * `.review-marquee-track`, die tot nu toe nergens gebruikt werd.
 *
 * WAT ER NIET GEBEURT. Er wordt niet gekozen op inhoud. Dit zijn de eerste reviews uit de
 * overgenomen set die binnen de kaart passen, in de volgorde van de bron. "De mooiste
 * eruit" is precies wat /reviews drie alinea's lang afkeurt, en dan mag de homepage dat ook
 * niet doen.
 */

function Kaart({
  quote,
  naam,
  wanneer,
}: {
  quote: string;
  naam: string;
  wanneer?: string;
}) {
  return (
    <li className="flex w-[300px] shrink-0 flex-col rounded-[var(--r-md)] bg-white p-6 sm:w-[340px]">
      <Sterren />
      <p className="mt-4 line-clamp-4 grow text-[15px] leading-7 text-[var(--g-900)]">
        {quote}
      </p>
      <p className="diba-label mt-5 flex items-baseline justify-between gap-3 text-[var(--t-muted)]">
        <span className="truncate">{naam}</span>
        {wanneer ? <span className="shrink-0">{wanneer}</span> : null}
      </p>
    </li>
  );
}

/* Kaarten van vergelijkbare lengte, zodat de band een rechte onderrand houdt. Kiezen op
   lengte is niet kiezen op inhoud: wie langer schrijft zegt niet iets anders. */
const BRUIKBAAR = SALONIZED_REVIEWS.filter(
  (r) => r.quote.length >= 90 && r.quote.length <= 210,
);

const BAND_EEN = BRUIKBAAR.slice(0, 10);
const BAND_TWEE = BRUIKBAAR.slice(10, 20);

function Band({
  reviews,
  terug = false,
}: {
  reviews: typeof BAND_EEN;
  /** De tweede band loopt de andere kant op. */
  terug?: boolean;
}) {
  if (reviews.length === 0) return null;
  /* Twee keer dezelfde rij: de animatie schuift precies de helft op, dus op het moment dat
     hij terugspringt staat er hetzelfde en zie je geen naad. */
  const dubbel = [...reviews, ...reviews];

  return (
    <ul
      className="review-marquee-track flex w-max gap-4"
      style={terug ? { animationDirection: "reverse" } : undefined}
    >
      {dubbel.map((r, i) => (
        <Kaart
          key={`${r.id}-${i}`}
          quote={r.quote}
          naam={r.name}
          wanneer={r.relativeDate}
        />
      ))}
    </ul>
  );
}

export default function Reviewslider() {
  const gemiddeld = DIBA_SALONIZED_RATING.toLocaleString("nl-NL", {
    minimumFractionDigits: 1,
  });

  return (
    <section className="overflow-hidden bg-[var(--g-050)] py-16 lg:py-24">
      <div className="mx-auto px-5 sm:px-9 lg:px-[7.5vw]">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end lg:gap-16">
          <div>
            {/* Het cijfer op formaat. Het stond in de topbalk in zes punts naast de
                taalkiezer, en daar leest het als een badge in plaats van als een feit. */}
            <div className="flex items-end gap-4">
              <span className="text-[64px] leading-none font-medium tracking-[-.05em] text-[var(--g-700)] tabular-nums lg:text-[80px]">
                {gemiddeld}
              </span>
              <span className="pb-2">
                <Sterren />
                <span className="diba-label mt-2 block text-[var(--t-muted)]">
                  {DIBA_SALONIZED_REVIEW_COUNT.toLocaleString("nl-NL")} reviews
                </span>
              </span>
            </div>

            <h2 className="diba-display-m mt-7 max-w-[16ch]">
              Wat mensen erover{" "}
              <span className="diba-accent">geschreven hebben</span>
            </h2>
          </div>

          <div>
            <p className="max-w-[54ch] text-[17px] leading-8 text-[var(--t-body)]">
              Een 5,0 over {DIBA_SALONIZED_REVIEW_COUNT.toLocaleString("nl-NL")}{" "}
              beoordelingen is een cijfer dat je hoort te wantrouwen, dus staan
              ze allemaal op de site: met tekst en zonder, en zonder dat wij
              vooraf iets wegstrepen.
            </p>
            <p className="mt-4 max-w-[54ch] text-[17px] leading-8 text-[var(--t-body)]">
              {ZONDER_TEKST.toLocaleString("nl-NL")} mensen gaven alleen
              sterren. Hieronder schuiven de reviews langs die wél iets zeggen.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href="/reviews"
                className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-[var(--on-dark)] transition-colors hover:bg-[var(--g-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
              >
                Lees alle reviews
              </Link>
              <a
                href={DIBA_SALONIZED_REVIEWS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="diba-label text-[var(--g-700)] underline underline-offset-4 transition-colors hover:text-[var(--g-800)]"
              >
                Of controleer ze bij de bron
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* De banden lopen buiten de marges door tot voorbij de schermrand, met een zachte
          uitvloeier aan beide kanten. Een kaart die halverwege wordt afgesneden door een
          harde rand leest als een fout; een kaart die vervaagt leest als "er is meer". */}
      <div
        className="mt-12 space-y-4 lg:mt-16"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
        }}
      >
        <Band reviews={BAND_EEN} />
        <Band reviews={BAND_TWEE} terug />
      </div>
    </section>
  );
}
