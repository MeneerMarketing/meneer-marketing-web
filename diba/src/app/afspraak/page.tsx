import type { Metadata } from "next";
import Link from "next/link";
import Boekingswidget from "@/components/afspraak/Boekingswidget";
import Reviewregel from "@/components/reviews/Reviewregel";
import Label from "@/components/ui/Label";
import { behandelingVoorSlug, prijsTekst } from "@/data/behandelingen";
import { ADVIES_MINUTEN, INTAKE_MINUTEN } from "@/data/intake";
import { SITUATIES } from "@/data/voorwaarden";
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

/** De twee afspraken waaruit je kiest als je nog niet weet wat je nodig hebt. */
const KEUZES = [
  {
    kop: "Alleen een huidconsult",
    duur: `${INTAKE_MINUTEN} minuten`,
    prijs: intakeBedrag,
    zin: "Meten, uitleg en een plan dat je meeneemt. Je beslist daarna zelf of en wanneer je verdergaat.",
  },
  {
    kop: "Behandeling op advies",
    duur: `${ADVIES_MINUTEN.nieuw} minuten als je nieuw bent, ${ADVIES_MINUTEN.bestaand} als je al klant bent`,
    prijs: "Je betaalt de behandeling; de intakekosten vervallen",
    zin: `In dezelfde afspraak kijken en behandelen, als dat verantwoord is. De intake duurt ${ADVIES_MINUTEN.intakeVan} tot ${ADVIES_MINUTEN.intakeTot} minuten, en er blijft altijd minstens een uur over om te behandelen.`,
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

          <div className="rounded-[var(--r-lg)] bg-white p-6 text-[var(--t-strong)] sm:p-8">
            <Label>Liever iemand spreken</Label>
            <p className="mt-4 text-[16px] leading-7 text-[var(--t-body)]">
              Bellen kan tijdens openingstijden, en een bericht mag altijd. Bij
              verzetten of afzeggen gaat bellen het snelst.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a
                href={DIBA_TELEFOON_HREF}
                className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-white transition-colors hover:bg-[var(--g-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
              >
                {DIBA_TELEFOON}
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
        <div className="mx-auto">
          <Boekingswidget />
          <p className="mt-6 max-w-[70ch] text-[14px] leading-6 text-[var(--t-muted)]">
            De agenda hierboven is die van Salonized, het systeem waarin onze
            afspraken staan. Wat je invult gaat rechtstreeks daarheen; wij zien
            het in dezelfde agenda terug. Lukt boeken hier niet, dan kan het{" "}
            <a
              href={DIBA_SALONIZED_BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
            >
              ook rechtstreeks bij Salonized
            </a>
            .
          </p>
          <Reviewregel className="mt-6" keuze={5} />
        </div>
      </section>

      {/* ── Wat je kiest, en wat er geldt ── */}
      <section className="bg-[var(--g-025)] px-5 py-10 sm:px-9 sm:py-16 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-12">
          <div>
            <Label>Als je twijfelt</Label>
            <h2 className="diba-display-m mt-4">
              Twee manieren <span className="diba-accent">om te beginnen</span>
            </h2>
            <p className="mt-5 max-w-[52ch] text-[16px] leading-7 text-[var(--t-body)]">
              Weet je nog niet welke behandeling je nodig hebt, dan kies je een
              van deze twee. In allebei kijkt een behandelaar eerst naar je
              huid.
            </p>

            <ul className="mt-6 space-y-3">
              {KEUZES.map((k) => (
                <li
                  key={k.kop}
                  className="rounded-[var(--r-md)] bg-white p-5 sm:p-6"
                >
                  <p className="text-[17px] leading-7 font-medium text-[var(--t-strong)]">
                    {k.kop}
                  </p>
                  <p className="diba-label mt-1.5 text-[var(--t-label)]">
                    {k.duur} &middot; {k.prijs}
                  </p>
                  <p className="mt-3 text-[15px] leading-7 text-[var(--t-body)]">
                    {k.zin}
                  </p>
                </li>
              ))}
            </ul>

            <Link
              href="/behandeling-op-advies"
              className="diba-label mt-6 inline-flex text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
            >
              Meer over de behandeling op advies
            </Link>
          </div>

          <div>
            <Label>Goed om te weten</Label>
            <h2 className="diba-display-m mt-4">
              Als het <span className="diba-accent">niet doorgaat</span>
            </h2>
            <p className="mt-5 max-w-[52ch] text-[16px] leading-7 text-[var(--t-body)]">
              Het kan gebeuren. Dit geldt er dan, en het staat er vooraf zodat
              je het niet achteraf hoort.
            </p>

            <dl className="mt-6 divide-y divide-[var(--g-100)] rounded-[var(--r-md)] bg-white px-5 sm:px-6">
              {SITUATIES.map((s) => (
                <div key={s.id} className="py-5">
                  <dt className="text-[16px] leading-7 font-medium text-[var(--t-strong)]">
                    {s.kop}
                  </dt>
                  <dd className="mt-1.5 text-[15px] leading-7 text-[var(--t-body)]">
                    {s.kost}
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

            <div className="mt-8 rounded-[var(--r-md)] bg-white p-5 sm:p-6">
              <p className="diba-label text-[var(--t-label)]">Openingstijden</p>
              <ul className="mt-3">
                {vandaag.map((d, i) => (
                  <li
                    key={d.dag}
                    className={`flex items-baseline justify-between gap-6 rounded-[var(--r-sm)] px-3 py-2 text-[15px] leading-6 ${
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
        </div>
      </section>
    </main>
  );
}
