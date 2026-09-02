import type { Metadata } from "next";
import Link from "next/link";
import Label from "@/components/ui/Label";
import { ANDERE_WEGEN, KLACHT_HOUDING, KLACHT_STAPPEN } from "@/data/klachten";
import { publicCopy } from "@/lib/copy-flags";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { zoekmachineVelden } from "@/lib/seo";
import {
  DIBA_EMAIL,
  DIBA_NAP,
  DIBA_SITE_URL,
  DIBA_TELEFOON,
  DIBA_TELEFOON_HREF,
} from "@/lib/site";

/**
 * Klachtenregeling (Wkkgz).
 *
 * De achtergrond staat in `src/data/klachten.ts`: waarom deze pagina verplicht is, en
 * waarom dat niet de reden is dat hij goed moet zijn.
 *
 * DE TOON.
 *
 * Op de rest van de site tutoyeren we. Hier ook, en dat is een keuze tegen de gewoonte in:
 * klachtenregelingen staan bijna altijd in de u-vorm, en dat maakt ze afstandelijk op
 * precies het moment dat iemand zich al niet gehoord voelt. De algemene voorwaarden mogen
 * formeel zijn omdat je die leest vóórdat er iets aan de hand is. Deze lees je erna.
 *
 * WAT ER OPVALT ALS JE HEM SCANT.
 *
 * De eerste stap is geen procedure maar "zeg het gewoon", en de laatste kaart in het
 * groene blok zegt dat een klacht je niets kost. Dat zijn de twee dingen die mensen
 * tegenhouden, en ze staan daarom vooraan en achteraan.
 */

export const metadata: Metadata = zoekmachineVelden({
  pad: "/klachten",
  titel: "Een klacht of iets dat niet goed ging",
  omschrijving:
    "Wat je kunt doen als een behandeling of een gesprek niet ging zoals het hoorde. Van één gesprek tot een bindende uitspraak.",
});

const PAD = "/klachten";

export default function KlachtenPage() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Klachten", url: `${DIBA_SITE_URL}${PAD}` },
        ])}
      />

      <section className="mx-auto px-5 pt-14 pb-10 sm:px-9 lg:px-[7.5vw] lg:pt-20">
        <nav
          aria-label="Kruimelpad"
          className="diba-label flex flex-wrap gap-2"
        >
          <Link href="/" className="hover:text-[var(--g-700)]">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-[var(--t-muted)]">Klachten</span>
        </nav>

        <h1 className="diba-display-l mt-6 max-w-[18ch]">
          Ging er iets niet goed?
          <br />
          <span className="diba-accent">Zeg het.</span>
        </h1>

        <p className="mt-6 max-w-[56ch] text-[16px] leading-7 text-[var(--t-body)]">
          Een resultaat dat tegenviel, een gesprek dat verkeerd viel, een
          rekening die niet klopte. De meeste dingen zijn in één gesprek recht
          te zetten, en dat gesprek begint zodra jij het aankaart.
        </p>

        <p className="mt-4 max-w-[56ch] text-[16px] leading-7 text-[var(--t-body)]">
          Lukt dat niet, dan is er een vaste route met termijnen en een
          onafhankelijke uitspraak. Die staat hieronder ook, en hij kost je
          niets.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-3">
          <a
            href={DIBA_TELEFOON_HREF}
            className="text-[16px] leading-7 text-[var(--g-700)] underline underline-offset-4"
          >
            {DIBA_TELEFOON}
          </a>
          <a
            href={`mailto:${DIBA_EMAIL}`}
            className="text-[16px] leading-7 text-[var(--g-700)] underline underline-offset-4"
          >
            {DIBA_EMAIL}
          </a>
        </div>
      </section>

      {/* ── De vier stappen ──
          Genummerd, maar met de nadruk op de eerste: wie alleen die leest heeft genoeg. */}
      <section className="px-5 pb-16 sm:px-9 lg:px-[7.5vw]">
        <ol className="mx-auto grid gap-5">
          {KLACHT_STAPPEN.map((stap, i) => (
            <li
              key={stap.id}
              id={stap.id}
              className="scroll-mt-[var(--anker-offset)] rounded-[var(--r-md)] bg-white p-7 sm:p-9"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                <Label>
                  Stap {i + 1} · {stap.kop}
                </Label>
                {stap.termijn ? (
                  <span className="diba-label text-[var(--t-muted)]">
                    {stap.termijn}
                  </span>
                ) : null}
              </div>
              <p className="diba-card-title-lg mt-4 max-w-[44ch]">
                {publicCopy(stap.kern)}
              </p>
              <p className="mt-4 max-w-[68ch] text-[15px] leading-7 text-[var(--t-body)]">
                {publicCopy(stap.tekst)}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Wat wij beloven ── */}
      <section className="px-5 pb-16 sm:px-9 lg:px-[7.5vw]">
        <div className="mx-auto rounded-[var(--r-md)] bg-[var(--g-700)] p-8 text-[var(--on-dark)] sm:p-12">
          <Label opDonker>Wat je van ons mag verwachten</Label>
          <h2 className="diba-display-m mt-4 max-w-[20ch]">
            Een klacht kost je niets
            <br />
            <span className="diba-accent-on-dark">
              en verandert niets aan je behandeling
            </span>
          </h2>
          <ul className="mt-9 grid gap-4 md:grid-cols-2">
            {KLACHT_HOUDING.map((z) => (
              <li
                key={z.slice(0, 30)}
                className="rounded-[var(--r-lg)] bg-white/10 p-6 text-[15px] leading-7 text-[var(--on-dark-body)] sm:p-7"
              >
                {publicCopy(z)}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Waar je met iets anders heen moet ──
          Staat er omdat mensen anders bij de inspectie aankloppen voor een vergoeding, en
          daar weken op wachten voor niets. */}
      <section className="bg-[var(--g-050)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-20">
        <div className="mx-auto">
          <Label>Niet bij ons</Label>
          <h2 className="diba-display-m mt-4 max-w-[20ch]">
            Waar je met iets anders
            <br />
            <span className="diba-accent">terechtkunt</span>
          </h2>
          <p className="mt-6 max-w-[58ch] text-[16px] leading-7 text-[var(--t-body)]">
            Dit staat er omdat mensen anders wekenlang bij de verkeerde
            instantie wachten. Bij elk staat er ook bij waarvoor je er juist
            níét moet zijn.
          </p>

          <ul className="mt-10 grid gap-5 lg:grid-cols-3">
            {ANDERE_WEGEN.map((w) => (
              <li
                key={w.wie}
                className="flex flex-col rounded-[var(--r-md)] bg-white p-7 sm:p-8"
              >
                <h3 className="diba-card-title">{w.wie}</h3>
                <dl className="mt-5 space-y-4">
                  <div>
                    <dt className="diba-label text-[var(--t-label)]">
                      Wel voor
                    </dt>
                    <dd className="mt-1.5 text-[15px] leading-7 text-[var(--t-body)]">
                      {publicCopy(w.waarvoor)}
                    </dd>
                  </div>
                  <div>
                    <dt className="diba-label text-[var(--t-label)]">
                      Niet voor
                    </dt>
                    <dd className="mt-1.5 text-[15px] leading-7 text-[var(--t-body)]">
                      {publicCopy(w.nietVoor)}
                    </dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-20">
        <div className="mx-auto max-w-[68ch]">
          <p className="text-[14px] leading-6 text-[var(--t-muted)]">
            Deze regeling geldt voor {DIBA_NAP.legalName}, {DIBA_NAP.street},{" "}
            {DIBA_NAP.zip} {DIBA_NAP.city}, KvK {DIBA_NAP.kvk}. Zij is opgesteld
            volgens de Wet kwaliteit, klachten en geschillen zorg (Wkkgz). Wil
            je weten hoe wij met je gegevens omgaan bij een klacht, lees dan het{" "}
            <Link
              href="/privacybeleid"
              className="text-[var(--g-700)] underline underline-offset-4"
            >
              privacybeleid
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
