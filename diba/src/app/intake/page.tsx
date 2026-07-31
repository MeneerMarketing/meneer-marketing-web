import type { Metadata } from "next";
import Link from "next/link";
import Uurtijdlijn from "@/components/intake/Uurtijdlijn";
import { PillarFaq, SectieKop } from "@/components/pillar/PillarSecties";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import ProofBar from "@/components/ui/ProofBar";
import { INTAKE_FAQ, INTAKE_FEITEN, VOORBEREIDING } from "@/data/intake";
import { publicCopy } from "@/lib/copy-flags";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import {
  DIBA_PROOF_STRIP_ITEMS,
  DIBA_SALONIZED_BOOKING_URL,
  DIBA_SITE_URL,
  DIBA_WHATSAPP_URL,
} from "@/lib/site";

/**
 * Behandeling Nul — de intake.
 *
 * Hier wijst elke knop op de site naartoe, dus dit is de pagina waar de meeste twijfel
 * zit. Die twijfel gaat zelden over de meting; hij gaat over de vraag of je straks met een
 * verkoopgesprek en een pakket de deur uitloopt.
 *
 * De hele pagina is op die ene vraag gebouwd. De tijdlijn zet bij elke stap wat je op dat
 * moment níet hoeft, en de feitenrij in de hero zegt in vier regels dat er deze afspraak
 * niet behandeld wordt en dat er geen verplichting is. Dat werkt beter dan een alinea over
 * hoe eerlijk we zijn.
 *
 * Herbouwd in de huisstijl van de huidprobleempagina's; de vorige versie draaide op
 * IntakeTemplate en had achtendertig woorden.
 *
 * Twee donkergroene vlakken, niet meer (§5).
 */

export const metadata: Metadata = {
  title: "Behandeling Nul: de intake",
  description:
    "Wat er in de intake gebeurt, wat je niet hoeft, en waarom er in die afspraak niet behandeld wordt.",
};

const ANKERS = [
  { id: "uur", label: "Wat er gebeurt" },
  { id: "voorbereiden", label: "Voorbereiden" },
  { id: "vragen", label: "Vragen" },
];

export default function IntakePage() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Behandeling Nul", url: `${DIBA_SITE_URL}/intake` },
        ])}
      />

      {/* ── Hero ── */}
      <section className="mx-auto max-w-[1800px] px-5 sm:px-9 lg:px-[7.5vw]">
        <div className="grid gap-10 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
          <div>
            <nav aria-label="Kruimelpad" className="diba-label flex flex-wrap gap-2">
              <Link href="/" className="hover:text-[var(--g-700)]">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-[var(--t-muted)]">Behandeling Nul</span>
            </nav>

            <h1 className="diba-display-l mt-6 max-w-[16ch]">
              Eerst kijken.
              <br />
              <span className="diba-accent">Nog niets doen.</span>
            </h1>

            <p className="mt-6 max-w-[52ch] text-[16px] leading-7 text-[var(--t-body)]">
              Behandeling Nul is een afspraak waarin niet behandeld wordt. We meten je huid
              onder vaste belichting, laten zien wat we zien en vertellen wat er realistisch
              mogelijk is. Meer niet.
            </p>

            <p className="mt-4 max-w-[52ch] text-[16px] leading-7 text-[var(--t-body)]">
              Je hoeft aan het eind niets af te spreken. Soms is het advies zelfs om niets
              te doen, en dan houdt het daar op.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Button href={DIBA_SALONIZED_BOOKING_URL || "/contact"}>
                Plan Behandeling Nul
              </Button>
              <Button
                href={DIBA_WHATSAPP_URL}
                variant="ghost"
                target="_blank"
                rel="noopener noreferrer"
              >
                Liever eerst een vraag stellen
              </Button>
            </div>
          </div>

          {/* De feiten. Vier regels die de twijfel wegnemen voordat de tekst begint. */}
          <div className="flex flex-col justify-center rounded-[var(--r-lg)] bg-[var(--g-700)] p-8 text-[var(--on-dark)] sm:p-10">
            <Label opDonker>In het kort</Label>
            <dl className="mt-6 space-y-4">
              {INTAKE_FEITEN.map((f) => (
                <div
                  key={f.label}
                  className="flex items-baseline justify-between gap-6 border-b border-white/20 pb-4"
                >
                  <dt className="diba-label diba-label-on-dark">{f.label}</dt>
                  <dd className="diba-card-title text-right">
                    {publicCopy(f.waarde, "Nog niet vastgesteld")}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-[15px] leading-7 text-[var(--on-dark-body)]">
              De meting staat los van de behandeling. Dat is geen formaliteit: het is de
              reden dat het advies eerlijk kan zijn.
            </p>
          </div>
        </div>
      </section>

      <ProofBar items={DIBA_PROOF_STRIP_ITEMS} />

      {/* In-paginanavigatie, dezelfde vorm als op de huidprobleempagina's. */}
      <nav
        aria-label="Op deze pagina"
        className="sticky top-0 z-20 border-y border-[var(--g-100)] bg-[var(--g-010)]/95 backdrop-blur"
      >
        <ul className="mx-auto flex max-w-[1800px] gap-6 overflow-x-auto px-5 py-4 sm:px-9 lg:px-[7.5vw]">
          {ANKERS.map((a) => (
            <li key={a.id}>
              <a
                href={`#${a.id}`}
                className="diba-label whitespace-nowrap hover:text-[var(--g-700)]"
              >
                {a.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── De tijdlijn: de uitblinker ── */}
      <section
        id="uur"
        className="scroll-mt-24 bg-[var(--g-050)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto max-w-[1800px]">
          <SectieKop
            label="Het uur, stap voor stap"
            kop="Bij elke stap staat"
            accent="wat je niet hoeft."
            intro="De meeste twijfel voor een intake gaat niet over de meting maar over de vraag of je straks met een pakket de deur uitloopt. Daarom staat het bij elke stap erbij, en niet één keer in de kleine lettertjes."
          />
          <Uurtijdlijn />
        </div>
      </section>

      {/* ── Voorbereiden ── */}
      <section
        id="voorbereiden"
        className="scroll-mt-24 px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto max-w-[1800px]">
          <SectieKop
            label="Voorbereiden"
            kop="Vier dingen altijd,"
            accent="en drie soms."
            intro="Niets ingewikkelds, en het scheelt of de meting klopt. Het eerste punt links is het belangrijkste: een meting over foundation heen is geen meting."
          />

          <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-12">
            <div>
              <Label>Altijd</Label>
              <ul className="mt-5 space-y-3">
                {VOORBEREIDING.altijd.map((v) => (
                  <li
                    key={v}
                    className="rounded-[var(--r-sm)] bg-white p-5 text-[16px] leading-7 text-[var(--t-body)]"
                  >
                    {v}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <Label>Afhankelijk van waarvoor je komt</Label>
              <ul className="mt-5 space-y-3">
                {VOORBEREIDING.soms.map((v) => (
                  <li key={v.wanneer} className="rounded-[var(--r-sm)] bg-white p-5">
                    <span className="diba-card-title block">{v.wanneer}</span>
                    <span className="mt-2 block text-[16px] leading-7 text-[var(--t-body)]">
                      {publicCopy(v.wat)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-[var(--r-md)] bg-[var(--g-050)] p-6">
                <p className="max-w-[54ch] text-[15px] leading-7 text-[var(--t-body)]">
                  Weet je nog niet waarvoor je komt? Dat is geen bezwaar, en de zoeker helpt
                  je een richting te vinden voordat je hier bent.
                </p>
                <Link
                  href="/huidproblemen/symptoomzoeker"
                  className="diba-label text-[var(--g-700)] underline underline-offset-4"
                >
                  Naar de symptoomzoeker
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PillarFaq items={INTAKE_FAQ} />

      {/* ── Slot ── */}
      <section className="mx-5 mb-5 rounded-[var(--r-xl)] bg-[var(--g-700)] px-7 py-14 text-[var(--on-dark)] sm:mx-9 sm:px-12 lg:mx-[7.5vw] lg:px-16 lg:py-20">
        <div className="mx-auto max-w-[1800px] lg:grid lg:grid-cols-[1.35fr_0.65fr] lg:gap-10">
          <div>
            <Label opDonker>Behandeling nul</Label>
            <h2 className="diba-display-l mt-5 max-w-[15ch]">
              Eén afspraak.
              <br />
              <span className="diba-accent-on-dark">Geen verplichting.</span>
            </h2>
          </div>
          <div className="mt-8 flex flex-col justify-end lg:mt-0">
            <p className="max-w-sm text-[16px] leading-7 text-[var(--on-dark-body)]">
              Je gaat weg met een meting die van jou is en een advies dat ook nee mag zijn.
              Wat je daarna doet, beslis je thuis.
            </p>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3">
              <Button
                href={DIBA_SALONIZED_BOOKING_URL || "/contact"}
                variant="primair-op-donker"
              >
                Plan Behandeling Nul
              </Button>
              <Button href="/ons-verbond" variant="secundair-op-donker">
                Lees ons verbond
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
