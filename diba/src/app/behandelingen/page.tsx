import type { Metadata } from "next";
import Link from "next/link";
import Behandelingenoverzicht from "@/components/behandelingen/Behandelingenoverzicht";
import Huidreis from "@/components/behandelingen/Huidreis";
import DibaLeafMark from "@/components/ui/DibaLeafMark";
import BeeldVignet from "@/components/ui/BeeldVignet";
import Label from "@/components/ui/Label";
import { BEHANDELINGEN } from "@/data/behandelingen";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import {
  DIBA_SALONIZED_RATING,
  DIBA_SALONIZED_REVIEWS_URL,
  DIBA_SALONIZED_REVIEW_COUNT,
  DIBA_SITE_URL,
} from "@/lib/site";

/**
 * De behandelingenpagina.
 *
 * VIERDE VERSIE, en elke ronde ging over hetzelfde verwijt: het klopt wel, maar het pakt
 * niet. Versie één was een raster met "[COPY-NODIG]". Versie twee was een goed geschreven
 * brochure. Versie drie kreeg de huidreis en werd daarmee een pagina met één sterke tool.
 *
 * Wat er nu bij is, en waardoor het een ervaring wordt in plaats van een tool met tekst
 * eromheen: DE PAGINA ONTHOUDT JOU.
 *
 * Je vult drie dingen in, en de pagina zegt op basis daarvan wat past, wat half past en
 * wat niet past. Dat profiel blijft in je browser staan, dus als je morgen terugkomt staat
 * het er nog. Geen account, geen mailadres, geen server. Het is het voorproefje van Mijn
 * Diba, en meteen de belofte die daar gaat gelden.
 *
 * De opbouw is een trechter die andersom loopt dan gebruikelijk. Niet: hier zijn onze
 * behandelingen, kies er een. Maar: vertel drie dingen, dan zeggen wij welke afvallen.
 * Een kliniek die begint met wat er níet bij je past heeft daarna geen verkooppraatje
 * meer nodig.
 *
 * Ritme in kleur. Zes secties die afwisselen tussen paginavlak, mint en wit, met precies
 * één donkergroen vlak aan het eind (§5). De matchkaarten in het profiel zijn kaarten en
 * geen vlakken; die tellen niet mee, maar ze zijn er wel de reden voor dat de rest van de
 * pagina licht blijft.
 */

export const metadata: Metadata = {
  title: "Behandelingen",
  description:
    "Vijf behandelingen en drie vragen om te weten welke bij je past. Je huidprofiel blijft in je eigen browser staan.",
};

const TROTS = [
  {
    getal: `${DIBA_SALONIZED_RATING.toLocaleString("nl-NL", { minimumFractionDigits: 1 })}`,
    bij: "op Salonized",
  },
  {
    getal: DIBA_SALONIZED_REVIEW_COUNT.toLocaleString("nl-NL"),
    bij: "reviews",
  },
  { getal: "2017", bij: "open in Hillegersberg" },
] as const;

export default function BehandelingenPage() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Behandelingen", url: `${DIBA_SITE_URL}/behandelingen` },
        ])}
      />

      {/* ══ Hero ══ */}
      <section className="relative overflow-hidden">
        {/* Twee zachte mintvlakken en een blad. Puur decoratie, en het enige stukje van
            deze pagina dat er is om er te zijn. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 -right-32 h-[520px] w-[520px] rounded-full bg-[var(--g-050)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-24 -right-10 h-[300px] w-[300px] rounded-full bg-[var(--g-075)] opacity-60"
        />
        <DibaLeafMark
          aria-hidden="true"
          className="pointer-events-none absolute top-16 right-16 hidden h-[210px] w-[210px] rotate-12 opacity-90 lg:block"
        />

        <div className="relative mx-auto px-5 pt-12 pb-16 sm:px-9 lg:px-[7.5vw] lg:pt-16 lg:pb-20">
          <nav
            aria-label="Kruimelpad"
            className="diba-label flex flex-wrap gap-2"
          >
            <Link href="/" className="hover:text-[var(--g-700)]">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-[var(--t-muted)]">Behandelingen</span>
          </nav>

          <h1 className="diba-display-l mt-8 max-w-[17ch]">
            {BEHANDELINGEN.length} behandelingen.
            <br />
            <span className="diba-accent">Eén vraag: hoe diep?</span>
          </h1>

          <p className="mt-7 max-w-[54ch] text-[17px] leading-8 text-[var(--t-body)]">
            Van een peeling die aan de oppervlakte blijft tot een laser die de
            haarwortel bereikt. Waar een behandeling aankomt bepaalt de rest:
            wat het kost, hoe lang je rood bent en hoe vaak je terug moet.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#alles"
              className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-white transition-colors hover:bg-[var(--g-800)]"
            >
              Naar alle behandelingen
            </a>
            <Link
              href="/huidprofiel"
              className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--on-dark-btn)] px-6 text-[var(--on-dark-btn-text)] transition-colors hover:bg-[var(--g-200)]"
            >
              Of maak eerst je huidprofiel
            </Link>
          </div>

          {/* Bewijs in één regel in plaats van een cijferbalk. Kleiner, en het onderbreekt
              de pagina niet halverwege. */}
          <ul className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-3">
            {TROTS.map((t) => (
              <li key={t.bij} className="flex items-baseline gap-2">
                <span className="text-[19px] leading-7 font-medium text-[var(--g-700)] tabular-nums">
                  {t.getal}
                </span>
                <span className="text-[14px] leading-6 text-[var(--t-muted)]">
                  {t.bij}
                </span>
              </li>
            ))}
            <li>
              <a
                href={DIBA_SALONIZED_REVIEWS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="diba-label text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
              >
                Lees ze zelf
              </a>
            </li>
          </ul>
        </div>
      </section>

      {/* ══ De huidreis ══ */}
      {/* Eenentwintig behandelingen op een rij is een lijst. Dit is waar ze allemaal op
          uitkomen: een kamer, een behandelaar en een half uur van je dag. */}
      <section className="px-5 pb-14 sm:px-9 lg:px-[7.5vw] lg:pb-16">
        <div className="mx-auto">
          <BeeldVignet
            src="/images/shoot/kliniek-behandelkamer.jpg"
            alt="Behandelaar werkt aan de huid van een client in de behandelkamer"
            onderschrift="In de behandelkamer, Hillegersberg"
            sizes="(min-width: 1024px) 86vw, 92vw"
            className="aspect-[16/9] lg:aspect-[21/9]"
          />
        </div>
      </section>

      <section className="bg-white px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28">
        <div className="mx-auto">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-16">
            <div>
              <Label>Waarom diepte de kapstok is</Label>
              <h2 className="diba-display-m mt-4 max-w-[16ch]">
                Je kiest geen behandeling.
                <br />
                <span className="diba-accent">Je kiest een diepte.</span>
              </h2>
            </div>
            <p className="max-w-[46ch] text-[16px] leading-7 text-[var(--t-body)]">
              Sleep de sonde door je huid naar beneden. Hoe dieper je komt, hoe
              minder behandelingen er nog bij zijn. Daar zit alles in: wat het
              kost, hoe lang je rood bent en hoe vaak je terug moet.
            </p>
          </div>

          <div className="mt-12">
            <Huidreis />
          </div>
        </div>
      </section>

      {/* ══ Alle behandelingen ══ */}
      <section
        id="alles"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-025)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <Label>Alles op een rij</Label>
          <h2 className="diba-display-m mt-4 max-w-[20ch]">
            {BEHANDELINGEN.length} behandelingen.
            <br />
            <span className="diba-accent">Filter tot er twee overblijven.</span>
          </h2>
          <p className="mt-6 max-w-[58ch] text-[16px] leading-7 text-[var(--t-body)]">
            Filter op waar het voor is, en op hoeveel hersteltijd je hebt. Dat
            tweede filter staat nergens anders, terwijl het vaak het meest
            bepaalt.
          </p>

          <div className="mt-12">
            <Behandelingenoverzicht />
          </div>
        </div>
      </section>

      {/* ══ De eerlijke tegenhanger ══ */}
      <section className="px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28">
        <div className="mx-auto grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <Label>Wat hier niet staat</Label>
            <h2 className="diba-display-m mt-4 max-w-[14ch]">
              Welke de <span className="diba-accent">beste is.</span>
            </h2>
            <DibaLeafMark
              aria-hidden="true"
              className="mt-10 hidden h-24 w-24 opacity-70 lg:block"
            />
          </div>

          <div className="max-w-[58ch]">
            <p className="text-[17px] leading-8 text-[var(--t-body)]">
              Die vraag heeft geen antwoord zonder jouw huid erbij. Dieper is
              niet beter, duurder is niet beter, en nieuwer al helemaal niet.
              Een behandeling is passend of niet passend, en dat verschilt per
              persoon en per moment.
            </p>
            <p className="mt-5 text-[17px] leading-8 text-[var(--t-body)]">
              Ook je huidprofiel hierboven geeft geen advies. Het legt naast
              elkaar wat jij hebt ingevuld en wat een behandeling doet, en zegt
              waar dat wringt. Dat is iets anders dan een aanbeveling, en het is
              bewust iets anders.
            </p>
            <p className="mt-5 text-[17px] leading-8 text-[var(--t-body)]">
              Wat bij jou past hoor je na de meting, van een mens. Soms is dat
              geen van de vijf.
            </p>
          </div>
        </div>
      </section>

      {/* ══ Afsluiter ══ */}
      <section className="px-5 pb-20 sm:px-9 lg:px-[7.5vw] lg:pb-28">
        <div className="mx-auto">
          <div className="relative overflow-hidden rounded-[var(--r-xl)] bg-[var(--g-700)] p-8 text-[var(--on-dark)] sm:p-14">
            <DibaLeafMark
              aria-hidden="true"
              className="pointer-events-none absolute -right-6 -bottom-10 h-[260px] w-[260px] -rotate-12 opacity-20"
            />
            <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
              <div>
                <Label opDonker>Beginnen</Label>
                <h2 className="diba-display-m mt-4 max-w-[16ch]">
                  Zo kies je
                  <br />
                  <span className="diba-accent-on-dark">een behandeling</span>
                </h2>
              </div>

              <div>
                <p className="max-w-[50ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
                  In Behandeling Nul kijken we onder vast licht wat er bij jou
                  aan de hand is. Neem je huidprofiel mee: dan hoef je het
                  gesprek niet bij nul te beginnen.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link
                    href="/intake"
                    className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--on-dark-btn)] px-6 text-[var(--on-dark-btn-text)] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    Plan Behandeling Nul
                  </Link>
                  <Link
                    href="/huidproblemen"
                    className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] border border-white/50 px-6 text-white transition-colors hover:border-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    Of begin bij je huidprobleem
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
