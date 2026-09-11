import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import BehandelingenBijProbleem from "@/components/pillar/BehandelingenBijProbleem";
import PillarNav from "@/components/pillar/PillarNav";
import {
  HuidanalyseAssen,
  PillarCta,
  PillarFaq,
  SectieKop,
  WelNiet,
} from "@/components/pillar/PillarSecties";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import {
  AANJAGERS,
  MELASMA_FAQ,
  MELASMA_WEL_NIET,
  VERSCHIL,
  WETENSWAARD,
} from "@/data/melasma";
import { publicCopy } from "@/lib/copy-flags";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { zoekmachineVelden } from "@/lib/seo";
import { DIBA_SITE_URL, DIBA_WHATSAPP_URL } from "@/lib/site";
import LeesVerder from "@/components/ui/LeesVerder";

/**
 * Melasma — negende eigen pagina.
 *
 * De kernvraag verschilt per pagina. Pigmentvlekken vragen wanneer in het jaar; melasma
 * vraagt hoe diep. Dat onderscheid is de reden dat dit een aparte pagina is en geen
 * paragraaf op de pigmentpagina: dezelfde behandeling geeft hier een ander en vaak
 * slechter resultaat.
 *
 * De tweede reden is de toon. Dit is de enige aandoening op de site waarbij harder werken
 * je verder van huis brengt, en waar wij dus een behandeling afraden die de klant graag
 * zou willen.
 *
 * Twee donkergroene vlakken, niet meer (§5). De woodlamp gebruikt kort een donker vlak
 * binnen zijn eigen tekening; dat is geen sectievlak maar het licht zelf.
 */

export const metadata: Metadata = zoekmachineVelden({
  pad: "/huidproblemen/melasma",
  titel: "Melasma behandelen in Rotterdam",
  omschrijving:
    "Melasma behandelen met peelings, verzorging en zonbescherming. Hoe diep het pigment zit bepaalt wat mogelijk is, en dat zien we onder UV-scan beginnen.",
});

const PAD = "/huidproblemen/melasma";

const ANKERS = [
  { id: "herkennen", label: "Melasma of zonvlek" },
  { id: "kranen", label: "De drie kranen" },
  { id: "wel-niet", label: "Wat helpt" },
  { id: "meten", label: "Hoe we meten" },
  { id: "vragen", label: "Vragen" },
] as const;

const KNOP_KLEUR: Record<string, string> = {
  Volledig: "text-[var(--g-700)]",
  Deels: "text-[var(--warn-text)]",
  Nauwelijks: "text-[var(--t-muted)]",
};

export default function MelasmaPage() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Huidproblemen", url: `${DIBA_SITE_URL}/huidproblemen` },
          { name: "Melasma", url: `${DIBA_SITE_URL}${PAD}` },
        ])}
      />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      {/* Donkergroen, zoals elke andere hoofdingang van de site (Yasin, 11 september
          2026). */}
      <section className="bg-[var(--g-700)] text-[var(--on-dark)]">
        {/* Op een telefoon plakte het beeld tegen de onderrand van het groene vlak: de
            tekstkolom bracht zijn eigen onderruimte mee, de beeldkolom niet (Yasin, 11
            september 2026). Vanaf 1024 staan ze naast elkaar en geldt het niet. */}
        <div className="mx-auto grid gap-6 px-5 pb-10 sm:px-9 sm:pb-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-10 lg:px-[7.5vw] lg:pb-0">
          <div className="py-10 sm:py-14 lg:py-20 max-lg:pb-0">
            <nav
              aria-label="Kruimelpad"
              className="diba-label diba-label-on-dark flex flex-wrap gap-2"
            >
              <Link href="/" className="hover:text-white">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <Link href="/huidproblemen" className="hover:text-white">
                Huidproblemen
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-[var(--on-dark-body)]">Melasma</span>
            </nav>

            <h1 className="diba-display-l mt-6 text-[var(--on-dark)]">
              Melasma <span className="diba-accent-on-dark">behandelen</span>
            </h1>

            <p className="mt-6 max-w-[48ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
              Melasma behandelen we met peelings, gerichte verzorging en
              zonbescherming. Hoe diep het pigment zit, bepaalt wat er mogelijk
              is, en dat zie je in gewoon licht niet.
            </p>
            <LeesVerder opDonker>
              <p className="mt-4 max-w-[48ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
                Daarom kijken we eerst onder UV-licht. Zit het pigment diep, dan
                richten we ons op beheersen: minder opvlammingen en een rustiger
                beeld.
              </p>
            </LeesVerder>

            <div className="diba-knoprij mt-9">
              <Button
                variant="primair-op-donker"
                href="/intake"
                kort="Plan consult"
              >
                Plan een huidconsult
              </Button>
              <Button
                href={DIBA_WHATSAPP_URL}
                variant="secundair-op-donker"
                target="_blank"
                rel="noopener noreferrer"
                kort="Stel een vraag"
              >
                Liever eerst een vraag stellen
              </Button>
            </div>
          </div>

          <div className="relative min-h-[220px] overflow-hidden rounded-[var(--r-md)] bg-[var(--g-200)] sm:min-h-[300px] lg:min-h-[460px]">
            <Image
              /* Yasin, 7 september 2026: "peelingrood" uit de shoot. De roodheid na de
                 peeling is precies het eerlijke beeld bij melasma: er gebeurt iets, en
                 dat zie je een paar dagen. */
              src="/images/shoot/beh-peeling-rood.jpg"
              alt="Na een peeling: de huid is rood en wordt met een ventilator gekoeld"
              fill
              priority
              sizes="(min-width: 1024px) 44vw, 100vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>

      <PillarNav ankers={ANKERS} />

      {/* ── Melasma of een zonvlek ─────────────────────────────────────── */}
      {/* Hier stond een woodlamp waarin je zelf drie dieptes kon aanklikken. Dat is werk
          voor de behandelaar en niet voor de bezoeker. Wat er nu staat is de vraag die
          iemand met een vlek in de spiegel echt heeft, in tien seconden te scannen. */}
      <section
        id="herkennen"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-050)] px-5 py-12 sm:py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="Melasma of zonvlek"
            kop="Hoe je het"
            accent="herkent"
            intro="Ze lijken op elkaar en vragen een andere aanpak. Het verschil zit in het patroon, de plek en hoe de vlek zich door het jaar heen gedraagt."
          />

          <div className="mt-8 sm:mt-12 grid gap-4 lg:grid-cols-2">
            {(
              [
                { titel: "Melasma", veld: "melasma" },
                { titel: "Een zonvlek", veld: "zonvlek" },
              ] as const
            ).map((kolom) => (
              <div
                key={kolom.titel}
                className="rounded-[var(--r-md)] bg-white p-7 sm:p-9"
              >
                <Label>{kolom.titel}</Label>
                <ul className="mt-6 space-y-5">
                  {VERSCHIL.map((v) => (
                    <li
                      key={v.kenmerk}
                      className="border-b border-[var(--g-100)] pb-5 last:border-b-0 last:pb-0"
                    >
                      <p className="diba-label text-[var(--t-muted)]">
                        {v.kenmerk}
                      </p>
                      {/* Twee regelhoogtes gereserveerd, zodat links en rechts op
                          dezelfde hoogte blijven staan. */}
                      <p className="mt-2 lg:min-h-[2lh] text-[15px] leading-7 text-[var(--t-body)]">
                        {publicCopy(v[kolom.veld])}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <ul className="mt-4 grid gap-4 md:grid-cols-3">
            {WETENSWAARD.map((w) => (
              <li
                key={w.kop}
                className="rounded-[var(--r-md)] bg-white p-7 sm:p-8"
              >
                <h3 className="diba-card-title">{w.kop}</h3>
                <p className="mt-3 md:min-h-[4lh] text-[15px] leading-7 text-[var(--t-body)]">
                  {publicCopy(w.zin)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── De drie kranen ─────────────────────────────────────────────── */}
      <section
        id="kranen"
        className="bg-[var(--g-025)] scroll-mt-[var(--anker-offset)] px-5 py-12 sm:py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="Wat het aanwakkert"
            kop="Drie dingen die"
            accent="melasma sturen"
            intro="Een zonvlek zit er en blijft er. Melasma gaat open en dicht, en drie dingen bepalen hoe ver hij open staat. Kijk naar de derde kolom: dat is het deel dat je zelf in de hand hebt."
          />

          <ul className="mt-8 sm:mt-12 grid gap-px overflow-hidden rounded-[var(--r-md)] bg-[var(--g-100)] md:grid-cols-3">
            {AANJAGERS.map((a) => (
              <li key={a.id} className="bg-white p-6 sm:p-8">
                <h3 className="diba-card-title">{a.naam}</h3>
                <p className="mt-4 text-[15px] leading-7 text-[var(--t-body)]">
                  {a.tekst.replace(/\[[^\]]+\]/g, "").trim()}
                </p>
                {/* Een div en geen p: Label rendert zelf een <p>, en een <p> in een <p>
                    is ongeldige HTML waar de browser de boom voor herschikt. Dat leverde
                    een hydratiefout op. */}
                <div className="mt-6 pt-4">
                  <Label>Zelf in de hand</Label>
                  <span
                    className={`diba-card-title mt-2 block ${KNOP_KLEUR[a.knop] ?? ""}`}
                  >
                    {a.knop}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-[var(--r-md)] bg-[var(--g-050)] p-6">
            <p className="max-w-[62ch] text-[15px] leading-7 text-[var(--t-body)]">
              Bescherming is bij melasma geen advies naast de behandeling maar
              een deel van de behandeling zelf. Zonder dat werkt de rest niet,
              en dat is de reden dat we er hier zo lang over doorgaan.
            </p>
            <Link
              href="/huidproblemen/pigmentvlekken"
              className="diba-label text-[var(--g-700)] underline underline-offset-4"
            >
              Zijn het toch gewone pigmentvlekken?
            </Link>
          </div>
        </div>
      </section>

      <WelNiet
        wel={MELASMA_WEL_NIET.wel}
        niet={MELASMA_WEL_NIET.niet}
        intro="Het eerste kruisje rechts is bij melasma de duurste fout die er is, en hij wordt gemaakt door klinieken en niet door klanten."
      />

      <HuidanalyseAssen
        kop="Meten gaat hier over diepte."
        alineas={[
          "Bij gewone pigmentvlekken meten we hoe donker en hoe groot. Bij melasma is de eerste vraag hoe diep het zit, want dat bepaalt of de rest van de meting er nog toe doet.",
          "Daarnaast leggen we vast wat je aanjagers zijn. Melasma dat lichter wordt terwijl de kraan openstaat, is een resultaat dat niet blijft, en dat wil je vooraf weten.",
        ]}
        assen={[
          ["Diepte", "Hoog, gemengd of diep in de huid"],
          ["Intensiteit", "Hoe sterk het afsteekt tegen de huid eromheen"],
          ["Uitbreiding", "Welke gebieden meedoen en hoe groot ze zijn"],
        ]}
      />

      {/* Welke behandelingen bij deze klacht horen, en op welk apparaat ze
          draaien. Leeg als er niets gekoppeld is; zie het component. */}
      <BehandelingenBijProbleem pad="/huidproblemen/melasma" />

      <PillarFaq items={MELASMA_FAQ} onderwerp="melasma" />

      <PillarCta
        kop="Plan een intake"
        accent="bij Diba Clinics"
        tekst="We schatten de diepte in en leggen je aanjagers vast. Zit het diep, dan hoor je dat en raden we behandelen af. Zit het hoog, dan weet je meteen wat er te halen valt en wat het vraagt."
        topic="melasma"
        whatsappHref={DIBA_WHATSAPP_URL}
      />
    </main>
  );
}
