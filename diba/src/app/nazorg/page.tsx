import type { Metadata } from "next";
import Link from "next/link";
import Nazorgrooster from "@/components/nazorg/Nazorgrooster";
import BeeldVignet from "@/components/ui/BeeldVignet";
import Label from "@/components/ui/Label";
import { NAZORG } from "@/data/nazorg";
import { publicCopy } from "@/lib/copy-flags";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import {
  DIBA_SITE_URL,
  DIBA_TELEFOON,
  DIBA_TELEFOON_HREF,
  DIBA_WHATSAPP_URL,
} from "@/lib/site";

/**
 * Nazorg.
 *
 * WAT HIER STOND EN WAAROM HET WEG MOEST.
 *
 * Vijf trajecten met elk vier placeholders, twintig in totaal, opgemaakt als tijdlijn:
 * direct na, eerste week, eerste maand, thuisfase. Die vorm leest prettig en beantwoordt
 * de vraag niet die mensen thuis op de bank stellen. Die vraag is altijd concreet: mag ik
 * morgen sporten, mag ik make-up op, wanneer mag die retinol weer.
 *
 * DE SIGNATUURVORM: EEN ROOSTER.
 *
 * Zeven bezigheden tegen vijf behandelingen, met in elke cel vanaf wanneer het weer mag
 * en achter elke cel de reden. Dat is de vorm die je op je telefoon opzoekt terwijl je
 * huid nog nagloeit, en hij staat nergens anders op deze site.
 *
 * Het rooster laat bovendien iets zien wat een tijdlijn verbergt: de meeste beperkingen
 * duren een dag of korter, en er springt telkens één rij uit. Bij bijna elke behandeling
 * is dat de zon.
 *
 * WAT ER BOVENAAN STAAT EN NIET ONDERAAN.
 *
 * Wanneer je moet bellen. Dat hoort niet in de kleine lettertjes onder een rooster; het
 * is het enige stuk van deze pagina waar haast bij kan zitten.
 *
 * [MEDISCHE-CHECK-ROJDA] elke termijn, elke reden en elke belreden in `nazorg.ts`. Dit
 * zijn instructies waar iemand thuis naar handelt.
 *
 * Eén donkergroen vlak: wanneer je moet bellen (§5).
 */

export const metadata: Metadata = {
  title: "Nazorg",
  description:
    "Mag ik morgen sporten, wanneer mag die retinol weer? Per behandeling een rooster met vanaf wanneer alles weer mag, en waarom.",
};

export default function NazorgPage() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Nazorg", url: `${DIBA_SITE_URL}/nazorg` },
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
              <span className="text-[var(--t-muted)]">Nazorg</span>
            </nav>

            <h1 className="diba-display-l mt-6 max-w-[14ch]">
              Mag ik morgen
              <br />
              <span className="diba-accent">weer sporten?</span>
            </h1>

            <p className="mt-7 max-w-[54ch] text-[17px] leading-8 text-[var(--t-body)]">
              Dat is de vraag die thuis op de bank gesteld wordt, en niet: hoe
              verloopt mijn eerste week. Dus staat het hier als rooster: per
              behandeling vanaf wanneer alles weer mag, met de reden erbij.
            </p>
            <p className="mt-4 max-w-[54ch] text-[17px] leading-8 text-[var(--t-body)]">
              De meeste beperkingen duren een dag of korter. Op één na, en die
              springt er in elke kolom uit.
            </p>
          </div>

          <div className="flex flex-col justify-center rounded-[var(--r-lg)] bg-white p-8 sm:p-10">
            <Label>Wat voorgaat op deze pagina</Label>
            <p className="mt-5 text-[19px] leading-8 text-[var(--t-body)]">
              Wat je in de kliniek te horen hebt gekregen. Deze termijnen zijn
              richtlijnen; hoe snel jouw huid herstelt hangt af van de
              instelling die is gekozen en van hoe jij erop reageert.
            </p>
            <p className="mt-5 text-[16px] leading-7 text-[var(--t-muted)]">
              Twijfel je, bel dan. Dat is altijd goedkoper dan afwachten.
            </p>
          </div>
        </div>
      </section>

      {/* ── Wanneer bellen: bovenaan, want hier kan haast bij zitten ── */}
      <section className="px-5 pb-16 sm:px-9 lg:px-[7.5vw] lg:pb-20">
        <div className="mx-auto">
          <div className="rounded-[var(--r-lg)] bg-[var(--g-700)] p-8 text-[var(--on-dark)] sm:p-12 lg:p-14">
            <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
              <div>
                <Label opDonker>Bel ons</Label>
                <h2 className="diba-display-m mt-4 max-w-[16ch]">
                  Dit hoort niet{" "}
                  <span className="diba-accent-on-dark">
                    {" "}
                    onderaan te staan.
                  </span>
                </h2>
                <p className="mt-6 max-w-[44ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
                  De meeste nazorgpagina&apos;s zetten dit in de kleine
                  lettertjes onder aan de bladzijde. Het is het enige deel waar
                  haast bij kan zitten, dus staat het hier.
                </p>
                <a
                  href={DIBA_TELEFOON_HREF}
                  className="diba-label mt-8 inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--on-dark-btn)] px-6 text-[var(--on-dark-btn-text)] transition-colors hover:bg-white"
                >
                  {DIBA_TELEFOON}
                </a>
              </div>

              <ul className="space-y-4">
                {NAZORG.map((n) => (
                  <li
                    key={n.slug}
                    className="rounded-[var(--r-md)] bg-white/10 p-5"
                  >
                    <p className="text-[16px] leading-6 font-medium">
                      {n.naam}
                    </p>
                    <ul className="mt-2 space-y-1">
                      {n.belOns.map((b) => (
                        <li
                          key={b}
                          className="text-[15px] leading-7 text-[var(--on-dark-body)]"
                        >
                          {publicCopy(b)}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Het rooster: de signatuur ── */}
      <section className="bg-[var(--g-025)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        {/* Nazorg is een pagina vol roosters en termijnen. Dit is het moment waar die roosters
          over gaan: het meegeven en het uitleggen, aan het eind van de afspraak. */}
        <section className="px-5 pb-16 sm:px-9 lg:px-[7.5vw] lg:pb-20">
          <div className="mx-auto">
            <BeeldVignet
              src="/images/shoot/nazorg-producten.jpg"
              alt="Behandelaar geeft een verzorgingsproduct mee aan een client"
              onderschrift="Wat je meekrijgt, en waarom"
              sizes="(min-width: 1024px) 86vw, 92vw"
              className="aspect-[16/9] lg:aspect-[21/9]"
            />
          </div>
        </section>
        <div className="mx-auto">
          <div>
            <Label>Zeven bezigheden, vijf behandelingen</Label>
            <h2 className="diba-display-m mt-4">
              Wat mag <span className="diba-accent">wanneer weer.</span>
            </h2>
            <p className="max-w-[62ch] mt-6 text-[17px] leading-8 text-[var(--t-body)]">
              Zoek je behandeling in de kolommen en je vraag in de rijen. Klik
              een vakje aan en de reden staat eronder, want een regel zonder
              reden is een verbod en verboden worden genegeerd.
            </p>
          </div>

          <div className="mt-10">
            <Nazorgrooster />
          </div>
        </div>
      </section>

      {/* ── Wat je meteen na afloop merkt ── */}
      <section className="px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto">
          <div>
            <Label>Geen verrassingen</Label>
            <h2 className="diba-display-m mt-4">
              Wat je de eerste uren{" "}
              <span className="diba-accent">gaat merken.</span>
            </h2>
            <p className="max-w-[62ch] mt-6 text-[17px] leading-8 text-[var(--t-body)]">
              Bij elke behandeling hoort iets wat je thuis ziet of voelt. Wie
              dat vooraf weet schrikt niet, en belt ook niet voor iets wat
              hoort.
            </p>
          </div>

          <ul className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {NAZORG.map((n) => (
              <li
                key={n.slug}
                className="flex flex-col rounded-[var(--r-lg)] bg-white p-7 sm:p-8"
              >
                <p className="diba-card-title text-[var(--t-strong)]">
                  {n.naam}
                </p>
                <p className="mt-3 flex-1 text-[15px] leading-7 text-[var(--t-body)]">
                  {publicCopy(n.meteenNa)}
                </p>
                <p className="mt-5 rounded-[var(--r-md)] bg-[var(--g-050)] p-5 text-[15px] leading-7 text-[var(--t-body)]">
                  <span className="diba-label block text-[var(--t-label)]">
                    De regel die telt
                  </span>
                  <span className="mt-2 block">{publicCopy(n.hoofdregel)}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Afsluiter ── */}
      <section className="bg-[var(--g-025)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <Label>Bij twijfel</Label>
            <h2 className="diba-display-m mt-4 max-w-[16ch]">
              Liever één keer
              <br />
              <span className="diba-accent">te veel gebeld.</span>
            </h2>
          </div>
          <div className="max-w-[58ch]">
            <p className="text-[17px] leading-8 text-[var(--t-body)]">
              Dit rooster is een richtlijn en geen voorschrift. Wijkt jouw huid
              af van wat hier staat, dan is dat een reden om contact op te nemen
              en niet om af te wachten tot de volgende afspraak. Een foto
              meesturen helpt om in te schatten of het kan wachten.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a
                href={DIBA_TELEFOON_HREF}
                className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-white transition-colors hover:bg-[var(--g-800)]"
              >
                Bel {DIBA_TELEFOON}
              </a>
              <a
                href={DIBA_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="diba-label text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
              >
                Of stuur een bericht met een foto
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
