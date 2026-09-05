"use client";

import { useMemo, useState } from "react";
import {
  SALONIZED_REVIEWS,
  type SalonizedReviewTopic,
} from "@/data/salonized-reviews";
import Sterren from "@/components/ui/Sterren";
import { REVIEW_TOPICS } from "@/data/reviews";

/**
 * De reviewmuur.
 *
 * WAAROM DIT EEN FILTER HEEFT EN GEEN SORTERING.
 *
 * Alle 122 reviews staan op vijf sterren. Sorteren op score is dus zinloos, en "beste eerst"
 * zou hier betekenen: wij kiezen welke je ziet. Dat is precies wat we bij voor-en-na-foto's
 * afkeuren, dus het mag hier ook niet.
 *
 * De vraag die wél iets oplevert is een andere: heeft iemand met mijn probleem hier iets
 * over geschreven. Daar is het filter voor.
 *
 * HET AANTAL STAAT OP DE PIL, EN DAT IS HET EERLIJKE DEEL.
 *
 * Bij roodheid staat er één. Eén. Dat is te weinig om iets uit af te leiden en dat hoor je
 * te zien vóór je klikt, niet erna. Een filter dat zijn lege hoeken verstopt is een filter
 * dat je stuurt.
 *
 * Onderwerpen waar helemaal niets over geschreven is krijgen geen knop. Dat is iets anders
 * dan een hoek verstoppen: een knop met een nul erop is geen eerlijkheid maar een dood
 * eind.
 *
 * GEEN OORDEEL VAN ONS BIJ DE QUOTES.
 *
 * Geen uitgelichte review, geen "meest behulpzaam", geen volgorde die iets suggereert. De
 * volgorde is die van de bron, en dat is de enige volgorde die we niet zelf hebben bedacht.
 */

/* De knoppen komen uit de gedeelde lijst, die alleen onderwerpen bevat waar ook echt
   reviews over zijn. De muur noemt "alles" waar de rest "alle" zegt; dat scheelt hier
   een hernoeming door het hele bestand. */
const ONDERWERPEN = REVIEW_TOPICS.map((t) => ({
  id: t.id === "alle" ? ("alles" as const) : t.id,
  label: t.label,
}));

export default function Reviewmuur() {
  const [gekozen, setGekozen] = useState<SalonizedReviewTopic | "alles">(
    "alles",
  );

  const aantallen = useMemo(() => {
    const t: Record<string, number> = { alles: SALONIZED_REVIEWS.length };
    for (const o of ONDERWERPEN) {
      if (o.id === "alles") continue;
      t[o.id] = SALONIZED_REVIEWS.filter((r) =>
        r.topics.includes(o.id as SalonizedReviewTopic),
      ).length;
    }
    return t;
  }, []);

  const zichtbaar = useMemo(
    () =>
      gekozen === "alles"
        ? SALONIZED_REVIEWS
        : SALONIZED_REVIEWS.filter((r) => r.topics.includes(gekozen)),
    [gekozen],
  );

  const gekozenLabel =
    ONDERWERPEN.find((o) => o.id === gekozen)?.label ?? "Alles";

  return (
    <div>
      {/* Het filter. Het aantal staat erbij, ook als dat aantal tegenvalt. */}
      <div
        role="group"
        aria-label="Filter reviews op onderwerp"
        className="flex flex-wrap gap-2"
      >
        {ONDERWERPEN.map((o) => {
          const aan = o.id === gekozen;
          const n = aantallen[o.id] ?? 0;
          if (n === 0) return null;
          return (
            <button
              key={o.id}
              type="button"
              aria-pressed={aan}
              onClick={() => setGekozen(o.id)}
              className={`inline-flex min-h-12 items-center gap-2.5 rounded-[var(--r-pill)] px-5 text-[15px] leading-none transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] ${
                aan
                  ? "bg-[var(--g-700)] text-white"
                  : "bg-white text-[var(--g-900)] hover:bg-[var(--g-100)]"
              }`}
            >
              {o.label}
              <span
                className={`rounded-[var(--r-pill)] px-2 py-1 text-[12px] leading-none tabular-nums ${
                  aan
                    ? "bg-white/20 text-white"
                    : "bg-[var(--g-050)] text-[var(--t-body)]"
                }`}
              >
                {n}
              </span>
            </button>
          );
        })}
      </div>

      {/* Wat het filter opleverde, in woorden. Ook als dat weinig is. */}
      <p
        aria-live="polite"
        className="mt-6 text-[16px] leading-7 text-[var(--t-body)]"
      >
        {gekozen === "alles" ? (
          <>
            Alle {zichtbaar.length} reviews die we van Salonized hebben
            overgenomen, in de volgorde waarin ze daar staan.
          </>
        ) : zichtbaar.length < 5 ? (
          <>
            {zichtbaar.length} {zichtbaar.length === 1 ? "review" : "reviews"}{" "}
            over {gekozenLabel.toLowerCase()}. Dat is te weinig om iets uit af
            te leiden, en daarom staat het aantal op de knop en niet in de
            kleine letters.
          </>
        ) : (
          <>
            {zichtbaar.length} reviews waarin {gekozenLabel.toLowerCase()} ter
            sprake komt.
          </>
        )}
      </p>

      {/* De muur. Kolommen zodat korte en lange quotes naast elkaar passen. */}
      <ul className="mt-8 gap-4 sm:columns-2 xl:columns-3 [&>li]:mb-4 [&>li]:break-inside-avoid">
        {zichtbaar.map((r) => (
          <li key={r.id} className="rounded-[var(--r-lg)] bg-white p-7 sm:p-8">
            <Sterren />
            <blockquote className="mt-5 text-[16px] leading-7 text-[var(--t-strong)]">
              {r.quote}
            </blockquote>
            <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-[15px] leading-6 font-medium text-[var(--t-strong)]">
                {r.name}
              </span>
              {r.relativeDate ? (
                <span className="text-[14px] leading-6 text-[var(--t-muted)]">
                  {r.relativeDate}
                </span>
              ) : null}
            </div>
            <p className="diba-label mt-4 inline-flex rounded-[var(--r-pill)] bg-[var(--g-050)] px-4 py-2 text-[var(--t-label)]">
              {r.treatment}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
