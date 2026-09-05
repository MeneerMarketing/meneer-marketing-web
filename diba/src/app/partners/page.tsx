import type { Metadata } from "next";
import Link from "next/link";
import Label from "@/components/ui/Label";
import {
  APPARATUUR_MERKEN,
  NOG_UITZOEKEN,
  PRODUCT_MERKEN,
  type Merk,
} from "@/data/partners";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { DIBA_SITE_URL } from "@/lib/site";
import { zoekmachineVelden } from "@/lib/seo";

/**
 * De merken en systemen waarmee Diba werkt.
 *
 * OKAN, 5 SEPTEMBER 2026. Twee dingen bepalen deze pagina.
 *
 * EEN: het woord "partner" komt er niet in voor. Niet ieder merk waarvan we apparatuur
 * gebruiken is een officiële partner, en dat is een claim over een contract. Er staat dus
 * wat er te controleren valt: welk systeem er staat, en waarvoor we het gebruiken.
 *
 * TWEE: een kale logopagina levert niets op. Per merk staat er wat er bij Diba van staat,
 * waarvoor het gebruikt wordt, en een link naar de behandeling. Dat geeft Google de
 * samenhang tussen merknaam, behandeling en plaats, en het geeft de bezoeker een reden om
 * door te klikken in plaats van een rij plaatjes.
 *
 * De eerste alinea zegt waarom het apparaat niet het verhaal is. Dat is geen bescheidenheid
 * maar de lijn van de hele site: dezelfde laser doet in twee klinieken niet hetzelfde, en
 * dat verschil zit in de hand die hem instelt.
 */

export const metadata: Metadata = zoekmachineVelden({
  pad: "/partners",
  titel: "Onze merken en apparatuur",
  omschrijving:
    "Bekijk met welke professionele merken en systemen Diba Clinics werkt, waaronder Candela, Fotona, HydraFacial, SkinPen en Dermapen 4.",
});

function MerkKaart({ merk }: { merk: Merk }) {
  return (
    <li className="flex h-full flex-col rounded-[var(--r-lg)] bg-white p-7 sm:p-8">
      <p className="diba-card-title text-[var(--t-strong)]">{merk.naam}</p>
      <p className="diba-label mt-2 text-[var(--g-700)]">{merk.bijDiba}</p>
      <p className="mt-4 grow text-[15px] leading-7 text-[var(--t-body)]">
        {merk.waarvoor}
      </p>
      <Link
        href={merk.link.href}
        className="diba-label mt-6 inline-flex items-center gap-1.5 text-[var(--g-700)] underline underline-offset-4 transition-colors hover:text-[var(--g-800)]"
      >
        {merk.link.label}
        <span aria-hidden="true">›</span>
      </Link>
    </li>
  );
}

export default function PartnersPage() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Over Diba", url: `${DIBA_SITE_URL}/over-ons` },
          { name: "Merken en apparatuur", url: `${DIBA_SITE_URL}/partners` },
        ])}
      />

      {/* ── Hero ── */}
      <section className="mx-auto px-5 pt-12 pb-10 sm:px-9 lg:px-[7.5vw] lg:pt-16">
        <nav
          aria-label="Kruimelpad"
          className="diba-label flex flex-wrap gap-2"
        >
          <Link href="/" className="hover:text-[var(--g-700)]">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/over-ons" className="hover:text-[var(--g-700)]">
            Over Diba
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-[var(--t-muted)]">Merken en apparatuur</span>
        </nav>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-16">
          <h1 className="diba-display-l max-w-[13ch]">
            De merken <span className="diba-accent">waarmee we werken</span>
          </h1>

          <div>
            <p className="max-w-[54ch] text-[17px] leading-8 text-[var(--t-body)]">
              Goede apparatuur is belangrijk, maar bepaalt het resultaat niet in
              zijn eentje. De behandelaar beoordeelt je huid, kiest de
              behandeling en stelt het apparaat daarop af. Dezelfde laser doet
              in twee klinieken niet hetzelfde.
            </p>
            <p className="mt-4 max-w-[54ch] text-[17px] leading-8 text-[var(--t-body)]">
              Hieronder staat per merk wat er bij ons staat en waarvoor we het
              gebruiken.
            </p>
          </div>
        </div>
      </section>

      {/* ── Apparatuur ── */}
      <section className="bg-[var(--g-050)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto">
          <Label>Apparatuur en technologie</Label>
          <h2 className="diba-display-m mt-4 max-w-[20ch]">
            Wat er in de{" "}
            <span className="diba-accent">behandelkamers staat</span>
          </h2>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {APPARATUUR_MERKEN.map((m) => (
              <MerkKaart key={m.naam} merk={m} />
            ))}
          </ul>
        </div>
      </section>

      {/* ── Producten ── */}
      <section className="px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto">
          <Label>Producten en protocollen</Label>
          <h2 className="diba-display-m mt-4 max-w-[20ch]">
            Wat er op je huid komt{" "}
            <span className="diba-accent">en wat je meekrijgt</span>
          </h2>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCT_MERKEN.map((m) => (
              <MerkKaart key={m.naam} merk={m} />
            ))}
          </ul>
        </div>
      </section>

      {/* ── Wat we niet claimen ──
          Dit blok is de reden dat de pagina "merken en apparatuur" heet en niet "partners".
          Een merk noemen is iets anders dan een samenwerking claimen, en dat verschil hoort
          op de pagina zelf te staan en niet alleen in de broncode. */}
      <section className="px-5 pb-16 sm:px-9 lg:px-[7.5vw] lg:pb-24">
        <div className="mx-auto">
          <div className="grid gap-10 rounded-[var(--r-lg)] bg-[var(--g-700)] p-8 text-[var(--on-dark)] sm:p-12 lg:grid-cols-[1fr_1fr] lg:gap-16 lg:p-14">
            <div>
              <Label opDonker>Wat hier niet staat</Label>
              <h2 className="diba-display-m mt-4 max-w-[18ch]">
                Het woord <span className="diba-accent-on-dark">partner.</span>
              </h2>
            </div>
            <div>
              <p className="max-w-[52ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
                Werken met de apparatuur van een merk maakt je nog geen
                officiële partner van dat merk. Dat is een afspraak op papier,
                en zolang die er niet ligt schrijven we hem hier ook niet op.
              </p>
              <p className="mt-4 max-w-[52ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
                Wat er wel staat is te controleren: welk systeem er in de kamer
                staat en waarvoor het gebruikt wordt. Voor jou als bezoeker is
                dat het antwoord op dezelfde vraag.
              </p>
              {NOG_UITZOEKEN.length > 0 ? (
                <>
                  <p className="diba-label mt-8 text-[var(--on-dark-accent)]">
                    Nog aan het uitzoeken
                  </p>
                  <ul className="mt-3 space-y-1.5">
                    {NOG_UITZOEKEN.map((n) => (
                      <li
                        key={n}
                        className="text-[15px] leading-7 text-[var(--on-dark-body)]"
                      >
                        {n}
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* ── Door ── */}
      <section className="px-5 pb-20 sm:px-9 lg:px-[7.5vw] lg:pb-28">
        <div className="mx-auto flex flex-wrap items-center gap-3">
          <Link
            href="/apparatuur"
            className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-[var(--on-dark)] transition-colors hover:bg-[var(--g-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
          >
            Alle apparatuur, per apparaat
          </Link>
          <Link
            href="/kwaliteit-en-registraties"
            className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] border border-[var(--g-200)] px-6 text-[var(--t-strong)] transition-colors hover:border-[var(--g-700)] hover:bg-[var(--g-050)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
          >
            Onze registraties
          </Link>
        </div>
      </section>
    </main>
  );
}
