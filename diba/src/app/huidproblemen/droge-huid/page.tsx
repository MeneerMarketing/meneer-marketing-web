import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Huidmatrix from "@/components/droge-huid/Huidmatrix";
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
import { PorieVocht } from "@/components/ui/HuidIcon";
import {
  DROGE_HUID_FAQ,
  DROGE_HUID_WEL_NIET,
  VERWARRINGEN,
} from "@/data/droge-huid";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { zoekmachineVelden } from "@/lib/seo";
import { DIBA_SITE_URL, DIBA_WHATSAPP_URL } from "@/lib/site";
import LeesVerder from "@/components/ui/LeesVerder";

/**
 * Droge huid — tiende eigen pagina.
 *
 * De kernvraag hier is of je wel weet waar je zit. Droog gaat over vet, uitgedroogd over
 * water, en het zijn twee losse assen en geen schaal. Dat wordt overal als één lijn
 * gepresenteerd, en dat is de reden dat mensen jarenlang het verkeerde product kopen.
 *
 * Daarom is de interactie een vlak en geen schuifbalk: de vorm van de bediening is hier
 * het argument. Een schuifbalk zou de fout bevestigen die de pagina wil rechtzetten.
 *
 * Twee donkergroene vlakken, niet meer (§5).
 */

export const metadata: Metadata = zoekmachineVelden({
  pad: "/huidproblemen/droge-huid",
  titel: "Droge of vochtarme huid: het verschil",
  omschrijving:
    "Een droge of vochtarme huid behandelen met hydraterende behandelingen. Het verschil tussen te weinig vet en te weinig water.",
});

const PAD = "/huidproblemen/droge-huid";

const ANKERS = [
  { id: "matrix", label: "Waar zit jij" },
  { id: "verwarring", label: "Wat mensen verwarren" },
  { id: "wel-niet", label: "Wat helpt" },
  { id: "meten", label: "Hoe we meten" },
  { id: "vragen", label: "Vragen" },
] as const;

export default function DrogeHuidPage() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Huidproblemen", url: `${DIBA_SITE_URL}/huidproblemen` },
          { name: "Droge huid", url: `${DIBA_SITE_URL}${PAD}` },
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
              <span className="text-[var(--on-dark-body)]">Droge huid</span>
            </nav>

            <h1 className="diba-display-l mt-6 text-[var(--on-dark)]">
              Een droge of
              <br />
              <span className="diba-accent-on-dark">vochtarme huid</span>
            </h1>

            <p className="mt-6 max-w-[48ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
              Een droge huid maakt te weinig vet aan, een vochtarme huid houdt
              te weinig water vast. Dat zijn twee verschillende dingen, en je
              kunt ze allebei tegelijk hebben.
            </p>
            <LeesVerder opDonker>
              <p className="mt-4 max-w-[48ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
                We behandelen beide met hydraterende behandelingen en een
                verzorgingsschema. Tijdens de intake stellen we vast welke van
                de twee bij jou speelt.
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
            {/* Yasin, 7 september 2026: opname 4S3A8055 uit de shoot, het masker dat met
                het handstuk wordt ingewerkt. Stond hier eerst de OxyGeneo-gel (Rojda's
                "die met die bubbeltjes"); deze is de keuze van Yasin. */}
            <Image
              src="/images/shoot/beh-masker-handstuk.jpg"
              alt="Masker wordt met een handstuk ingewerkt op het gezicht van een cliënt"
              fill
              priority
              sizes="(min-width: 1024px) 44vw, 100vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>

      <PillarNav ankers={ANKERS} />

      {/* ── De huidmatrix: de uitblinker ───────────────────────────────── */}
      <section
        id="matrix"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-050)] px-5 py-12 sm:py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            icoon={PorieVocht}
            label="Twee assen"
            // Twee gelijke helften eronder, dus de introzin volgt die indeling.
            raster="gelijk"
            kop="Vet en"
            accent="vocht"
            intro="Vet en vocht zijn twee losse assen. De huidtherapeut beoordeelt ze allebei, want een vette huid kan tegelijk vochtarm zijn."
          />
          <Huidmatrix />
        </div>
      </section>

      {/* ── Wat mensen verwarren ──────────────────────────────────────── */}
      <section
        id="verwarring"
        className="bg-[var(--g-025)] scroll-mt-[var(--anker-offset)] px-5 py-12 sm:py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="Drie misverstanden"
            kop="Dit horen we"
            accent="het vaakst."
            intro="Alle drie komen ze voort uit het idee dat vet en vocht op één schaal liggen. Dat is niet zo."
          />

          <ul className="mt-8 sm:mt-12 grid gap-px overflow-hidden rounded-[var(--r-md)] bg-[var(--g-100)] md:grid-cols-3">
            {VERWARRINGEN.map((v) => (
              <li key={v.vraag} className="bg-white p-6 sm:p-8">
                <h3 className="diba-card-title">{v.vraag}</h3>
                <p className="mt-4 text-[15px] leading-7 text-[var(--t-body)]">
                  {v.antwoord}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-[var(--r-md)] bg-[var(--g-050)] p-6">
            <p className="max-w-[62ch] text-[15px] leading-7 text-[var(--t-body)]">
              Verdraagt je huid steeds minder producten en wordt hij snel rood?
              Dan is een droge huid vaak het gevolg en niet de oorzaak, en
              begint het verhaal ergens anders.
            </p>
            <Link
              href="/huidproblemen/gevoelige-huid"
              className="diba-label text-[var(--g-700)] underline underline-offset-4"
            >
              Naar de gevoelige huid
            </Link>
          </div>
        </div>
      </section>

      <WelNiet
        wel={DROGE_HUID_WEL_NIET.wel}
        niet={DROGE_HUID_WEL_NIET.niet}
        intro="Meer producten gebruiken omdat het niet beter wordt, richt de meeste schade aan."
      />

      <HuidanalyseAssen
        kop="Twee assen, dus twee metingen."
        alineas={[
          "Je huid voelt de ene dag anders dan de andere, en daarom is een gevoel geen goed beginpunt. We meten daarom allebei de assen los van elkaar in plaats van te vragen of je huid droog aanvoelt.",
          "Dat maakt ook zichtbaar welke as beweegt zodra je iets verandert. Meestal is dat de wateras binnen enkele weken, en dat vertelt je meteen waar je zat.",
        ]}
        assen={[
          ["Vet", "Hoeveel de huid zelf aanmaakt"],
          ["Water", "Hoeveel vocht er in de bovenste laag zit"],
          ["Lekkage", "Hoe snel dat vocht weer verdwijnt"],
        ]}
      />

      {/* Welke behandelingen bij deze klacht horen, en op welk apparaat ze
          draaien. Leeg als er niets gekoppeld is; zie het component. */}
      <BehandelingenBijProbleem pad="/huidproblemen/droge-huid" />

      <PillarFaq items={DROGE_HUID_FAQ} onderwerp="een droge huid" />

      <PillarCta
        kop="Eerst weten"
        accent="in welk vak je zit."
        tekst="We meten vet en water apart, en vertellen je welke as bij jou beweegt. Zit je in balans, dan is ons advies om niets te doen en houdt het daar op."
        topic="droge-huid"
        whatsappHref={DIBA_WHATSAPP_URL}
      />
    </main>
  );
}
