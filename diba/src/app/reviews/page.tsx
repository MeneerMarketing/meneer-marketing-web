import type { Metadata } from "next";
import Link from "next/link";
import Reviewmuur from "@/components/reviews/Reviewmuur";
import Label from "@/components/ui/Label";
import {
  SALONIZED_REVIEWS,
  SALONIZED_REVIEWS_URL,
  SALONIZED_REVIEW_SUMMARY,
} from "@/data/salonized-reviews";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { DIBA_SITE_URL } from "@/lib/site";
import BeeldVignet from "@/components/ui/BeeldVignet";

/**
 * Reviews.
 *
 * HET PROBLEEM MET EEN PAGINA VOL VIJF STERREN.
 *
 * Alle 56 overgenomen reviews staan op vijf sterren, en het gemiddelde over alle 3.883 is
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

export const metadata: Metadata = {
  title: "Reviews",
  description: `${SALONIZED_REVIEW_SUMMARY.countFormatted} reviews op Salonized, gemiddeld een ${SALONIZED_REVIEW_SUMMARY.rating.toFixed(1).replace(".", ",")}. Wat dat wel zegt en wat niet, met de quotes zelf erbij.`,
};

export default function ReviewsPage() {
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
      <section className="mx-auto px-5 sm:px-9 lg:px-[7.5vw]">
        <div className="grid gap-10 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
          <div>
            <nav
              aria-label="Kruimelpad"
              className="diba-label flex flex-wrap gap-2"
            >
              <Link href="/" className="hover:text-[var(--g-700)]">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-[var(--t-muted)]">Reviews</span>
            </nav>

            <h1 className="diba-display-l mt-6 max-w-[15ch]">
              Allemaal vijf sterren.
              <br />
              <span className="diba-accent">Wees daar wantrouwig over.</span>
            </h1>

            <p className="mt-7 max-w-[54ch] text-[17px] leading-8 text-[var(--t-body)]">
              {SALONIZED_REVIEW_SUMMARY.countFormatted} reviews op Salonized,
              gemiddeld een {gemiddeld}. Op elke andere site is dat het
              verkoopargument. Hier staat er meteen bij waarom zo een cijfer
              minder zegt dan het lijkt.
            </p>
            <p className="mt-4 max-w-[54ch] text-[17px] leading-8 text-[var(--t-body)]">
              Lees je daarna alsnog door, dan lees je iets wat je kunt wegen. Dat
              is meer waard dan een muur met vijven.
            </p>
          </div>

          <div className="flex flex-col justify-center rounded-[var(--r-lg)] bg-white p-8 sm:p-10">
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
              verwijderen. Hieronder staan er {SALONIZED_REVIEWS.length} van,
              overgenomen in de volgorde van de bron.
            </p>
            <a
              href={SALONIZED_REVIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="diba-label mt-7 inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--on-dark-btn)] px-6 text-[var(--on-dark-btn-text)] transition-colors hover:bg-[var(--g-200)]"
            >
              Controleer ze bij de bron
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── Wat vijf sterren niet zegt ── */}
      <section className="px-5 pb-16 sm:px-9 lg:px-[7.5vw] lg:pb-20">
        <div className="mx-auto">
          <div className="rounded-[var(--r-lg)] bg-[var(--g-700)] p-8 text-[var(--on-dark)] sm:p-12 lg:p-14">
            <div className="max-w-[62ch]">
              <Label opDonker>Lees dit eerst</Label>
              <h2 className="diba-display-m mt-4 max-w-[20ch]">
                Drie redenen{" "}
                <span className="diba-accent-on-dark">
                  {" "}
                  om een 5,0 te wantrouwen.
                </span>
              </h2>
              <p className="mt-6 text-[16px] leading-7 text-[var(--on-dark-body)]">
                Ook die van ons. Deze drie gelden voor elk reviewgemiddelde dat
                je ergens ziet staan.
              </p>
            </div>

            <ul className="mt-12 grid gap-4 md:grid-cols-3">
              {[
                {
                  kop: "Wie wegblijft, schrijft niets",
                  zin: "De uitnodiging komt na een bezoek. Wie ontevreden was komt vaak niet terug, krijgt dus geen tweede uitnodiging, en verdwijnt daarmee uit het gemiddelde. Dat is geen opzet maar het maakt het cijfer wel rooskleuriger dan de werkelijkheid.",
                },
                {
                  kop: "Het gaat over het bezoek",
                  zin: "Bijna elke review hierboven gaat over hoe iemand behandeld is: er werd tijd genomen, alles werd uitgelegd, iemand was voorzichtig. Dat is echt en het is belangrijk. Het is alleen iets anders dan of jouw huid gaat veranderen.",
                },
                {
                  kop: "Het is geschreven vlak erna",
                  zin: "Een review komt meestal binnen een week. Bij de meeste behandelingen hier is er dan nog niets te zien, want het resultaat komt weken later. Wat je leest is dus de ervaring en niet de uitkomst.",
                },
              ].map((r) => (
                <li
                  key={r.kop}
                  className="rounded-[var(--r-lg)] bg-white/10 p-7 sm:p-8"
                >
                  <p className="text-[18px] leading-7 font-medium">{r.kop}</p>
                  <p className="mt-3 text-[15px] leading-7 text-[var(--on-dark-body)]">
                    {r.zin}
                  </p>
                </li>
              ))}
            </ul>

            <p className="mt-10 max-w-[62ch] text-[15px] leading-7 text-[var(--on-dark-accent)]">
              Wat een review wél kan: laten zien hoe het eraan toegaat in de
              kamer. Daar is hij het beste bewijs voor dat er bestaat, want daar
              was de schrijver bij en jij nog niet.
            </p>
          </div>
        </div>
      </section>

      {/* ── De muur ── */}
      {/* Reviews gaan bijna altijd over een persoon en niet over een apparaat. Dan hoort er
          ook een mens bij te staan. */}
      <section className="px-5 pb-14 sm:px-9 lg:px-[7.5vw] lg:pb-16">
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

      <section className="bg-[var(--g-025)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto">
          <div>
            <Label>{SALONIZED_REVIEWS.length} overgenomen quotes</Label>
            <h2 className="diba-display-m mt-4">
              Zoek op wat{" "}
              <span className="diba-accent">jij zelf hebt.</span>
            </h2>
            <p className="max-w-[62ch] mt-6 text-[17px] leading-8 text-[var(--t-body)]">
              Sorteren op score heeft geen zin als alles vijf is, en zelf de
              beste bovenaan zetten zou betekenen dat wij kiezen wat je ziet. Dus
              filter je zelf, met het aantal op de knop. Ook als dat aantal
              tegenvalt.
            </p>
          </div>

          <div className="mt-10">
            <Reviewmuur />
          </div>
        </div>
      </section>

      {/* ── Afsluiter ── */}
      <section className="px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <Label>Wat hier niet staat</Label>
            <h2 className="diba-display-m mt-4 max-w-[16ch]">
              Verzonnen{" "}
              <span className="diba-accent">reviews.</span>
            </h2>
          </div>
          <div className="max-w-[58ch]">
            <p className="text-[17px] leading-8 text-[var(--t-body)]">
              Alle quotes hierboven komen van de openbare Salonized-pagina en
              zijn overgenomen in de volgorde waarin ze daar stonden. Ze zijn
              niet door ons geselecteerd op inhoud en er is niets bijgeschreven.
              Klopt er iets niet, dan is het bij de bron na te kijken.
            </p>
            <p className="mt-4 text-[17px] leading-8 text-[var(--t-body)]">
              Het is wel een momentopname. Er komen er dagelijks bij, en die
              staan daar eerder dan hier.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a
                href={SALONIZED_REVIEWS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-white transition-colors hover:bg-[var(--g-800)]"
              >
                Lees ze allemaal bij de bron
                <span aria-hidden="true">↗</span>
              </a>
              <Link
                href="/resultaten"
                className="diba-label text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
              >
                Of: waarom voor-en-na-foto&apos;s niets bewijzen
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
