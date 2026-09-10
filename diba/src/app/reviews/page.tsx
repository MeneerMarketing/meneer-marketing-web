import type { Metadata } from "next";
import Link from "next/link";
import Reviewarchief from "@/components/reviews/Reviewarchief";
import { isOnderwerp } from "@/data/review-onderwerpen";
import { ARCHIEF_TOTAAL } from "@/data/reviews-archief";
import type { SalonizedReviewTopic } from "@/data/salonized-reviews";
import Label from "@/components/ui/Label";
import {
  SALONIZED_REVIEWS_URL,
  SALONIZED_REVIEW_SUMMARY,
} from "@/data/salonized-reviews";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { DIBA_SITE_URL } from "@/lib/site";
import BeeldVignet from "@/components/ui/BeeldVignet";
import { zoekmachineVelden } from "@/lib/seo";
import LeesVerder from "@/components/ui/LeesVerder";
import MobielInklap from "@/components/ui/MobielInklap";

/**
 * Reviews.
 *
 * HET PROBLEEM MET EEN PAGINA VOL VIJF STERREN.
 *
 * Alle 122 overgenomen reviews staan op vijf sterren, en het gemiddelde over alle 3.893 is
 * een 5,0. Op elke andere site is dat het verkoopargument. Op deze site kan dat niet: hier
 * staat bij elk cijfer wat het niet zegt, en een muur met alleen maar vijven is precies het
 * soort bewijs dat we op /resultaten afkeuren bij foto's.
 *
 * Dus staat het er meteen bij. Niet als disclaimer onderaan maar als kop: allemaal vijf
 * sterren, en dat zegt minder dan het lijkt. Wie na die uitleg alsnog doorleest, leest iets
 * wat hij kan wegen.
 *
 * DE SIGNATUUR: FILTEREN OP WAT JIJ HEBT, MET HET AANTAL EROP.
 *
 * Sorteren op score is zinloos als alles vijf is, en "beste eerst" zou betekenen dat wij
 * kiezen wat je ziet. De vraag die wel iets oplevert is of iemand met jouw probleem hier
 * iets over schreef. Bij acne zijn dat er twee, en dat staat op de knop vóór je klikt. Een
 * filter dat zijn lege hoeken verstopt, stuurt je.
 *
 * DE QUOTES ZIJN ECHT.
 *
 * Ze komen van de openbare Salonized-pagina en zijn niet door ons geselecteerd op inhoud;
 * de volgorde is die van de bron. Verzonnen reviews staan hier niet en komen hier nooit.
 *
 * [BESLUIT-OKAN] of dit een handmatige overname blijft of dat de reviews live opgehaald
 * gaan worden. Nu is het een momentopname van augustus 2026, en dat staat ook op de pagina.
 *
 * Eén donkergroen vlak: wat vijf sterren niet zegt (§5).
 */

export const metadata: Metadata = zoekmachineVelden({
  pad: "/reviews",
  titel: "Reviews",
  omschrijving: `${SALONIZED_REVIEW_SUMMARY.countFormatted} reviews op Salonized, gemiddeld een ${SALONIZED_REVIEW_SUMMARY.rating.toFixed(1).replace(".", ",")}. Wat dat wel zegt en wat niet, met de quotes zelf erbij.`,
});

/** Welke onderwerpen als filter in de URL mogen staan. */
function leesOnderwerp(
  waarde: string | undefined,
): SalonizedReviewTopic | "alle" {
  return isOnderwerp(waarde) ? waarde : "alle";
}

function leesPagina(waarde: string | undefined) {
  return Number.parseInt(waarde ?? "1", 10) || 1;
}

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{
    onderwerp?: string;
    pagina?: string;
    sterren?: string;
  }>;
}) {
  const params = await searchParams;
  const onderwerp = leesOnderwerp(params.onderwerp);
  const pagina = leesPagina(params.pagina);
  const sterrenPagina = leesPagina(params.sterren);

  const gemiddeld = SALONIZED_REVIEW_SUMMARY.rating
    .toFixed(1)
    .replace(".", ",");

  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Reviews", url: `${DIBA_SITE_URL}/reviews` },
        ])}
      />

      {/* ── Hero ── */}
      <section className="bg-[var(--g-700)] text-[var(--on-dark)] px-5 sm:px-9 lg:px-[7.5vw]">
        <div className="grid gap-10 py-10 sm:py-14 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
          <div>
            <nav
              aria-label="Kruimelpad"
              className="diba-label diba-label-on-dark flex flex-wrap gap-2"
            >
              <Link href="/" className="hover:text-white">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-[var(--on-dark-body)]">Reviews</span>
            </nav>

            <h1 className="diba-display-l mt-6 max-w-[21ch]">
              Wat klanten
              <br />
              <span className="diba-accent-on-dark">over ons schrijven</span>
            </h1>

            <p className="mt-7 max-w-[54ch] text-[17px] leading-8 text-[var(--on-dark-body)]">
              {SALONIZED_REVIEW_SUMMARY.countFormatted} reviews op Salonized,
              gemiddeld een {gemiddeld}. Ze zijn na de afspraak geschreven door
              mensen die hier zijn geweest, en ze staan er allemaal: met tekst
              en zonder.
            </p>
            <p className="mt-4 max-w-[54ch] text-[17px] leading-8 text-[var(--on-dark-body)]">
              Zoek gerust op de behandeling die jou bezighoudt. Dan lees je wat
              mensen met jouw vraag erover schreven, en dat zegt meer dan het
              gemiddelde eronder.
            </p>
          </div>

          <div className="flex flex-col justify-center rounded-[var(--r-lg)] bg-white p-8 sm:p-10 text-[var(--t-strong)]">
            <Label>De stand bij de bron</Label>
            <p className="mt-5 text-[64px] leading-none font-medium tracking-[-.05em] text-[var(--t-strong)] tabular-nums">
              {gemiddeld}
            </p>
            <p className="mt-4 text-[17px] leading-7 text-[var(--t-body)]">
              over {SALONIZED_REVIEW_SUMMARY.countFormatted} reviews op{" "}
              {SALONIZED_REVIEW_SUMMARY.sourceLabel}
            </p>
            <p className="mt-5 text-[16px] leading-7 text-[var(--t-body)]">
              Wij verzamelen ze niet en we kunnen ze niet selecteren of
              verwijderen. Hieronder staan ze allemaal, overgenomen in de
              volgorde van de bron.
            </p>
            {/* De knop naar Salonized stond hier als vlak. Okan, 10 september 2026:
                "korter, niet in blokvorm, en meer onderaan de pagina." Hij staat nu als
                regel onder de laatste kaarten. */}
          </div>
        </div>
      </section>

      <section className="px-5 pb-10 sm:pb-14 sm:px-9 lg:px-[7.5vw] lg:pb-16">
        <div className="mx-auto">
          <BeeldVignet
            src="/images/shoot/team-tweetal.jpg"
            alt="Twee behandelaars van Diba Clinics naast elkaar in de kliniek"
            onderschrift="De mensen over wie het gaat"
            sizes="(min-width: 1024px) 86vw, 92vw"
            className="aspect-[16/10] lg:aspect-[2/1]"
          />
        </div>
      </section>

      <section
        id="alles"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-025)] px-5 py-10 sm:py-16 sm:px-9 lg:px-[7.5vw] lg:py-24"
      >
        <div className="mx-auto">
          <div>
            <Label>
              Alle {ARCHIEF_TOTAAL.toLocaleString("nl-NL")} beoordelingen
            </Label>
            <h2 className="diba-display-m mt-4">
              Zoek op wat <span className="diba-accent">jij zelf hebt.</span>
            </h2>
            <p className="max-w-[62ch] mt-6 text-[17px] leading-8 text-[var(--t-body)]">
              Sorteren op score heeft geen zin als bijna alles vijf is, en zelf
              de beste bovenaan zetten zou betekenen dat wij kiezen wat je ziet.
              Dus filter je zelf: op de klacht waarvoor iemand kwam, of op hoe
              het bezoek was. Met het aantal op de knop, ook als dat tegenvalt.
            </p>
          </div>

          <div className="mt-10">
            <Reviewarchief
              onderwerp={onderwerp}
              pagina={pagina}
              sterrenPagina={sterrenPagina}
            />
          </div>
        </div>
      </section>

      {/* ── Afsluiter ── */}
      <section className="px-5 py-10 sm:py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <Label>Wat hier niet staat</Label>
            <h2 className="diba-display-m mt-4 max-w-[16ch]">
              Verzonnen <span className="diba-accent">reviews.</span>
            </h2>
          </div>
          <div className="max-w-[58ch]">
            <p className="text-[17px] leading-8 text-[var(--t-body)]">
              De reviews komen van de openbare Salonized-pagina, en het is een
              momentopname: er komen er dagelijks bij, en die staan daar eerder
              dan hier.{" "}
              <a
                href={SALONIZED_REVIEWS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
              >
                Controleer ze bij de bron
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
