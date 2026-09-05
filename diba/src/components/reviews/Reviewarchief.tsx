import Link from "next/link";
import Sterren from "@/components/ui/Sterren";
import Label from "@/components/ui/Label";
import { REVIEW_TOPICS, reviewTopicLabel } from "@/data/reviews";
import {
  archiefAantal,
  archiefBijOnderwerp,
  ONDER_VIJF,
  PER_PAGINA,
  ZONDER_TEKST,
} from "@/data/reviews-archief";
import type { SalonizedReviewTopic } from "@/data/salonized-reviews";

/**
 * Alle reviews, gefilterd en gepagineerd via de URL.
 *
 * WAAROM GEEN KNOPPEN MAAR LINKS. De vorige muur was een client component met een filter in
 * de staat van de browser. Dat kon toen er 122 reviews stonden. Met 2.472 teksten zou dat
 * zeshonderd kilobyte naar elke bezoeker sturen om er achtenveertig te tonen.
 *
 * Nu leest de server de filter uit de URL. Dat scheelt niet alleen laadtijd: /reviews?
 * onderwerp=acne is een adres dat je kunt delen en dat Google kan indexeren, en dat is
 * precies waar iemand op zoekt die wil weten of hier mensen met acne komen.
 *
 * GEEN OORDEEL VAN ONS IN DE VOLGORDE. Die is van de bron: nieuwste eerst, zoals Salonized
 * ze zet. Geen uitgelichte review, geen "meest behulpzaam". Dat is de enige volgorde die we
 * niet zelf bedacht hebben.
 */

function adres(onderwerp: string, pagina: number) {
  const delen: string[] = [];
  if (onderwerp !== "alle") delen.push(`onderwerp=${onderwerp}`);
  if (pagina > 1) delen.push(`pagina=${pagina}`);
  return delen.length > 0
    ? `/reviews?${delen.join("&")}#alles`
    : "/reviews#alles";
}

export default function Reviewarchief({
  onderwerp,
  pagina,
}: {
  onderwerp: SalonizedReviewTopic | "alle";
  pagina: number;
}) {
  const alle = archiefBijOnderwerp(onderwerp);
  const paginas = Math.max(1, Math.ceil(alle.length / PER_PAGINA));
  const huidig = Math.min(Math.max(1, pagina), paginas);
  const zichtbaar = alle.slice((huidig - 1) * PER_PAGINA, huidig * PER_PAGINA);

  return (
    <div>
      {/* De filter. Het aantal staat op de knop, ook als dat aantal tegenvalt: een filter
          dat zijn lege hoeken verstopt is een filter dat je stuurt. Onderwerpen waar
          niemand over schrijft krijgen geen knop, want een nul is een dood eind. */}
      <Label>Onderwerp</Label>
      <ul className="mt-4 flex flex-wrap gap-2">
        {REVIEW_TOPICS.filter(
          (t) => t.id === "alle" || archiefAantal(t.id) > 0,
        ).map((t) => {
          const actief = t.id === onderwerp;
          return (
            <li key={t.id}>
              <Link
                href={adres(t.id, 1)}
                scroll={false}
                aria-current={actief ? "page" : undefined}
                className={`diba-label inline-flex min-h-11 items-center gap-2 rounded-[var(--r-pill)] px-4 transition-colors duration-300 [transition-timing-function:var(--ease-diba)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] ${
                  actief
                    ? "diba-pill-active"
                    : "bg-white text-[var(--t-label)] hover:bg-[var(--g-100)]"
                }`}
              >
                {t.id === "alle" ? "Alles" : reviewTopicLabel(t.id)}
                <span
                  className={`rounded-[var(--r-pill)] px-2 py-0.5 text-[10px] tabular-nums ${
                    actief
                      ? "bg-white/20"
                      : "bg-[var(--g-025)] text-[var(--g-700)]"
                  }`}
                >
                  {archiefAantal(t.id).toLocaleString("nl-NL")}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <p className="mt-6 max-w-[62ch] text-[15px] leading-7 text-[var(--t-muted)]">
        {`${alle.length.toLocaleString("nl-NL")} ${
          onderwerp === "alle"
            ? "reviews met tekst"
            : `reviews waarin ${reviewTopicLabel(onderwerp).toLowerCase()} voorkomt`
        }, in de volgorde van Salonized: nieuwste eerst. Pagina ${huidig} van ${paginas}.`}
      </p>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {zichtbaar.map((r) => (
          <li
            key={r.id}
            className="flex flex-col rounded-[var(--r-lg)] bg-white p-6"
          >
            <Sterren aantal={Math.round(r.sterren)} />
            <p className="mt-4 grow text-[15px] leading-7 text-[var(--g-900)]">
              {r.tekst}
            </p>
            <p className="diba-label mt-5 flex items-baseline justify-between gap-3 text-[var(--t-muted)]">
              <span className="truncate">{r.naam}</span>
              <span className="shrink-0">{r.datum}</span>
            </p>
          </li>
        ))}
      </ul>

      {paginas > 1 ? (
        <nav
          aria-label="Meer reviews"
          className="mt-12 flex flex-wrap items-center justify-between gap-4"
        >
          {huidig > 1 ? (
            <Link
              href={adres(onderwerp, huidig - 1)}
              className="diba-label inline-flex min-h-12 items-center rounded-[var(--r-pill)] border border-[var(--g-200)] px-6 text-[var(--t-strong)] transition-colors hover:border-[var(--g-700)] hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
            >
              Vorige
            </Link>
          ) : (
            <span />
          )}
          <span className="diba-label text-[var(--t-muted)]">
            {huidig} / {paginas}
          </span>
          {huidig < paginas ? (
            <Link
              href={adres(onderwerp, huidig + 1)}
              className="diba-label inline-flex min-h-12 items-center rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-[var(--on-dark)] transition-colors hover:bg-[var(--g-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
            >
              Volgende
            </Link>
          ) : (
            <span />
          )}
        </nav>
      ) : null}

      {/* Okan: de beoordelingen zonder tekst horen erbij, maar onder een eigen kopje. Ze
          tellen mee voor het gemiddelde, dus ze weglaten zou het cijfer onverklaard laten.
          Ze als lege kaart tonen zou veertienhonderd keer niets zijn. */}
      <div className="mt-16 rounded-[var(--r-lg)] bg-white p-8 sm:p-10">
        <Label>Beoordelingen zonder tekst</Label>
        <p className="diba-card-title mt-3 text-[var(--t-strong)]">
          {ZONDER_TEKST.toLocaleString("nl-NL")} mensen gaven wel sterren, maar
          schreven niets
        </p>
        <p className="mt-4 max-w-[62ch] text-[16px] leading-7 text-[var(--t-body)]">
          Ze tellen mee voor het gemiddelde en daarom staan ze hier genoemd. Wat
          ze niet doen is iets vertellen: je weet niet waarvoor iemand kwam of
          wat er gebeurde. Reken ze dus mee in het cijfer en niet in je oordeel.
        </p>
        <p className="mt-4 max-w-[62ch] text-[16px] leading-7 text-[var(--t-body)]">
          {ONDER_VIJF === 0
            ? "Alle beoordelingen staan op vijf sterren."
            : `${ONDER_VIJF.toLocaleString("nl-NL")} beoordelingen staan onder de vijf sterren. Ook die staan hierboven; ze zijn niet weggefilterd.`}
        </p>
      </div>
    </div>
  );
}
