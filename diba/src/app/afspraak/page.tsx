import type { Metadata } from "next";
import Link from "next/link";
import Boekingswidget from "@/components/afspraak/Boekingswidget";
import Reviewregel from "@/components/reviews/Reviewregel";
import Label from "@/components/ui/Label";
import { behandelingVoorSlug, prijsTekst } from "@/data/behandelingen";
import { ADVIES_MINUTEN, INTAKE_MINUTEN } from "@/data/intake";
import { AFSPRAKEN, SITUATIES } from "@/data/voorwaarden";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { zoekmachineVelden } from "@/lib/seo";
import {
  DIBA_OPENINGSTIJDEN,
  DIBA_SALONIZED_BOOKING_URL,
  DIBA_SITE_URL,
  DIBA_TELEFOON,
  DIBA_TELEFOON_HREF,
  DIBA_WHATSAPP_URL,
} from "@/lib/site";

/**
 * Afspraak maken.
 *
 * WAAROM DEZE PAGINA ER IS.
 *
 * Yasin, 10 september 2026: "kunnen we die Salonized-widget niet inladen op een pagina van
 * onszelf, zodat mensen niet weggaan?" Tot nu toe stuurde elke knop "Afspraak maken" naar
 * dibaclinics.salonized.com. Dat werkt, maar het is wel het einde van het bezoek: je staat
 * op een andere site, in een andere huisstijl, en de vraag die je nog had stel je niet meer.
 *
 * Nu staat de agenda hier, en eromheen precies de drie dingen die iemand op dat moment nog
 * wil weten: welke afspraak hij moet kiezen, wat er gebeurt als het niet doorgaat, en hoe
 * hij ons bereikt als boeken niet lukt. Niet meer dan dat: dit is een pagina om iets te
 * doen, geen pagina om te lezen.
 */

export const metadata: Metadata = zoekmachineVelden({
  pad: "/afspraak",
  titel: "Afspraak maken",
  omschrijving:
    "Boek je afspraak bij Diba Clinics rechtstreeks in de agenda. Met wat je vooraf moet weten over de duur, de kosten en afzeggen.",
});

const intake = behandelingVoorSlug("huidanalyse");
const intakeBedrag = intake ? prijsTekst(intake.prijs) : "50 euro";

/** Wat je vlak voor het boeken wilt weten. Kort, want de agenda staat eronder. */
const VOORAF = [
  {
    kop: "Je bevestiging komt direct",
    zin: "Je kiest zelf een moment en krijgt de bevestiging meteen in je mail.",
  },
  {
    kop: `Verzetten kan tot ${AFSPRAKEN.annulerenUren} uur van tevoren`,
    zin: "Kosteloos, en je hoeft geen reden te geven.",
  },
  {
    /* Okan, 10 september 2026, letterlijk: de aanbetaling gaat mee naar je volgende
       behandeling als je doorboekt, dus er staat altijd een aanbetaling klaar voor je
       volgende afspraak. Stop je met je behandelingen, of wil je online inplannen, dan
       krijg je hem terug. */
    kop: "Je betaalt een aanbetaling",
    zin: "Boek je door, dan gaat het bedrag mee naar je volgende behandeling; er staat dan altijd een aanbetaling klaar. Stop je, of wil je online inplannen, dan krijg je hem terug.",
  },
] as const;

/** De twee afspraken waaruit je kiest als je nog niet weet wat je nodig hebt. */
const KEUZES = [
  {
    kop: "Alleen een huidconsult",
    /* De regel eronder is een label in kleinkapitaal. Daar past een maat en een bedrag in,
       geen zin: drie regels hoofdletters leest als geschreeuw. De rest staat in de tekst. */
    meta: `${INTAKE_MINUTEN} minuten, ${intakeBedrag}`,
    zin: "Meten, uitleg en een plan dat je meeneemt. Je beslist daarna zelf of en wanneer je verdergaat.",
  },
  {
    kop: "Behandeling op advies",
    meta: `${ADVIES_MINUTEN.nieuw} of ${ADVIES_MINUTEN.bestaand} minuten`,
    zin: `In dezelfde afspraak kijken en behandelen, als dat verantwoord is. Ben je nieuw, dan duurt hij twee uur: ${ADVIES_MINUTEN.intakeVan} tot ${ADVIES_MINUTEN.intakeTot} minuten intake en daarna minstens een uur behandelen. Ben je al klant, dan is het een uur zonder nieuwe intake. Je betaalt de behandeling; de intakekosten vervallen.`,
  },
];

export default function AfspraakPage() {
  const vandaag = DIBA_OPENINGSTIJDEN;

  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Afspraak maken", url: `${DIBA_SITE_URL}/afspraak` },
        ])}
      />

      {/* ── Hero: kort, want de agenda staat eronder ── */}
      <section className="bg-[var(--g-700)] px-5 text-[var(--on-dark)] sm:px-9 lg:px-[7.5vw]">
        <div className="grid gap-8 py-10 sm:py-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-16">
          <div>
            <nav
              aria-label="Kruimelpad"
              className="diba-label diba-label-on-dark flex flex-wrap gap-2"
            >
              <Link href="/" className="hover:text-white">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-[var(--on-dark-body)]">Afspraak maken</span>
            </nav>

            <h1 className="diba-display-l mt-6 max-w-[18ch]">
              Maak een <span className="diba-accent-on-dark">afspraak</span>
            </h1>

            <p className="mt-6 max-w-[52ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
              Kies hieronder een behandeling en een moment. Je ziet meteen wat
              er vrij is en je krijgt de bevestiging direct.
            </p>
          </div>

          {/* Yasin, 10 september 2026: "op desktop is de hero te droog, leeg en saai, maak
              dat net als de andere pagina's." Die hebben hier een witte kaart met inhoud,
              en op deze pagina zijn dat de drie dingen die je vlak voor het boeken wilt
              weten. Daaronder pas de manier om iemand te spreken. */}
          <div className="rounded-[var(--r-lg)] bg-white p-6 text-[var(--t-strong)] sm:p-8">
            <Label>Voor je boekt</Label>
            <dl className="mt-5 divide-y divide-[var(--g-100)]">
              {VOORAF.map((v) => (
                <div key={v.kop} className="py-3.5 first:pt-0 last:pb-0">
                  <dt className="text-[16px] leading-7 font-medium text-[var(--t-strong)]">
                    {v.kop}
                  </dt>
                  <dd className="mt-0.5 text-[15px] leading-7 text-[var(--t-body)]">
                    {v.zin}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-[var(--g-100)] pt-5">
              <a
                href={DIBA_TELEFOON_HREF}
                className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-white transition-colors hover:bg-[var(--g-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
              >
                Bel {DIBA_TELEFOON}
              </a>
              <a
                href={DIBA_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="diba-label text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
              >
                Of stuur een bericht
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── De agenda ── */}
      <section
        id="agenda"
        className="scroll-mt-[var(--anker-offset)] px-5 py-10 sm:px-9 sm:py-16 lg:px-[7.5vw] lg:py-20"
      >
        {/* De agenda is 720 punten breed. In een kolom over de volle breedte staat hij
            als een strook in het midden van een leeg vlak; naast de uitleg over wat je
            kiest vult hij de bladzijde en staat het antwoord op de vraag "welke moet ik
            hebben" naast de knop waarmee je hem kiest. */}
        <div className="mx-auto grid gap-10 lg:grid-cols-[minmax(0,760px)_1fr] lg:items-start lg:gap-14">
          <div>
            <Boekingswidget />
            {/* Hier stond een alinea die uitlegde dat de agenda van Salonized is. Weg op
                verzoek van Okan (10 september 2026). De uitwijk naar hun eigen agenda is
                niet weg: die verschijnt in de widget zelf zodra die niet laadt, en dat is
                het enige moment waarop iemand er iets aan heeft. */}
            <Reviewregel className="mt-6" keuze={5} />
          </div>

          <div className="lg:pt-2">
            <Label>Als je twijfelt</Label>
            {/* De kop brak in de smalle kolom over drie regels; de huisregel houdt het
                op twee. Korter dus, en wat eraf viel staat in de zin eronder. */}
            <h2 className="diba-display-s mt-3 max-w-[16ch] text-[var(--t-strong)]">
              Twee manieren
            </h2>
            <p className="mt-4 text-[16px] leading-7 text-[var(--t-body)]">
              Weet je nog niet welke behandeling je nodig hebt, dan begin je met
              een van deze twee. In allebei kijkt een behandelaar eerst naar je
              huid.
            </p>

            <ul className="mt-5 space-y-3">
              {KEUZES.map((k) => (
                <li
                  key={k.kop}
                  className="rounded-[var(--r-md)] bg-[var(--g-025)] p-5"
                >
                  <p className="text-[16px] leading-7 font-medium text-[var(--t-strong)]">
                    {k.kop}
                  </p>
                  <p className="diba-label mt-1.5 text-[var(--t-label)]">
                    {k.meta}
                  </p>
                  <p className="mt-2.5 text-[15px] leading-7 text-[var(--t-body)]">
                    {k.zin}
                  </p>
                </li>
              ))}
            </ul>

            <Link
              href="/behandeling-op-advies"
              className="diba-label mt-5 inline-flex text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
            >
              Meer over de behandeling op advies
            </Link>
          </div>
        </div>
      </section>

      {/* ── Wat er geldt als het niet doorgaat ── */}
      <section className="bg-[var(--g-025)] px-5 py-10 sm:px-9 sm:py-16 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-12">
          <div>
            <Label>Goed om te weten</Label>
            <h2 className="diba-display-m mt-4">
              Als het <span className="diba-accent">niet doorgaat</span>
            </h2>
            <p className="mt-5 max-w-[52ch] text-[16px] leading-7 text-[var(--t-body)]">
              Het kan gebeuren. Dit geldt er dan, zodat je het weet voordat je
              boekt.
            </p>

            <dl className="mt-6 divide-y divide-[var(--g-100)] rounded-[var(--r-md)] bg-white px-5 sm:px-6">
              {SITUATIES.map((si) => (
                <div key={si.id} className="py-5">
                  <dt className="text-[16px] leading-7 font-medium text-[var(--t-strong)]">
                    {si.kop}
                  </dt>
                  <dd className="mt-1.5 text-[15px] leading-7 text-[var(--t-body)]">
                    {si.kost}
                  </dd>
                </div>
              ))}
            </dl>

            <p className="mt-5 text-[15px] leading-7 text-[var(--t-muted)]">
              Verzetten of afzeggen doe je het snelst telefonisch. Alles staat
              voluit in de{" "}
              <Link
                href="/algemene-voorwaarden"
                className="text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
              >
                algemene voorwaarden
              </Link>
              .
            </p>
          </div>

          <div>
            <Label>Wanneer we er zijn</Label>
            <h2 className="diba-display-m mt-4">
              Onze <span className="diba-accent">openingstijden</span>
            </h2>
            <p className="mt-5 max-w-[52ch] text-[16px] leading-7 text-[var(--t-body)]">
              Binnen die tijden staat niet elk uur een therapeut vrij. Wat je in
              de agenda kunt aanklikken is wat er echt open is.
            </p>

            <ul className="mt-6 rounded-[var(--r-md)] bg-white p-5 sm:p-6">
              {vandaag.map((d, i) => (
                <li
                  key={d.dag}
                  className={`flex items-baseline justify-between gap-6 rounded-[var(--r-sm)] px-3 py-2.5 text-[15px] leading-6 ${
                    i % 2 === 1 ? "bg-[var(--g-025)]" : ""
                  }`}
                >
                  <span className="text-[var(--t-strong)]">{d.label}</span>
                  <span
                    className={
                      d.van
                        ? "text-[var(--t-body)] tabular-nums"
                        : "text-[var(--t-muted)]"
                    }
                  >
                    {d.van ? `${d.van} tot ${d.tot}` : "Gesloten"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
