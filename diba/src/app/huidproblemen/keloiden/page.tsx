import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import BehandelingenBijProbleem from "@/components/pillar/BehandelingenBijProbleem";
import PillarNav from "@/components/pillar/PillarNav";
import {
  PillarCta,
  PillarFaq,
  SectieKop,
  WelNiet,
} from "@/components/pillar/PillarSecties";
import Button from "@/components/ui/Button";
import { HuidStrakker } from "@/components/ui/HuidIcon";
import Label from "@/components/ui/Label";
import {
  KELOID_BEOORDELING,
  KELOID_FAQ,
  KELOID_SOORTEN,
  KELOID_WEL_NIET,
} from "@/data/keloiden";
import { publicCopy } from "@/lib/copy-flags";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { zoekmachineVelden } from "@/lib/seo";
import { DIBA_SITE_URL, DIBA_WHATSAPP_URL } from "@/lib/site";
import LeesVerder from "@/components/ui/LeesVerder";

/**
 * Keloiden — sinds vandaag weer een eigen pagina.
 *
 * Hij stond als redirect naar de littekenpagina. Wie op keloid zoekt heeft meestal al een
 * diagnose en wil weten of er iets aan te doen is; die vraag verdient een eigen antwoord.
 *
 * De grens blijft: de behandeling van een keloid loopt via een arts, want een te stevige
 * prikkel maakt het groter. Het onderscheid met een hypertrofisch litteken maken wij wel,
 * en dat tweede behandelen we ook.
 *
 * De achtergrond bij de inhoud staat in `src/data/keloiden.ts`.
 *
 * COPY: concept in de Diba-stem. Medische beweringen zijn gemarkeerd voor Rojda.
 */

export const metadata: Metadata = zoekmachineVelden({
  pad: "/huidproblemen/keloiden",
  titel: "Keloid en verdikte littekens in Rotterdam",
  omschrijving:
    "Het verschil tussen een keloid en een verdikt litteken, wat wij behandelen en wat via je arts loopt.",
});

const PAD = "/huidproblemen/keloiden";

const ANKERS = [
  { id: "consult", label: "In het consult" },
  { id: "soorten", label: "Twee soorten" },
  { id: "wel-niet", label: "Wat helpt" },
  { id: "vragen", label: "Vragen" },
] as const;

export default function KeloidenPage() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Huidproblemen", url: `${DIBA_SITE_URL}/huidproblemen` },
          { name: "Keloid", url: `${DIBA_SITE_URL}${PAD}` },
        ])}
      />

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
              <span className="text-[var(--on-dark-body)]">Keloid</span>
            </nav>

            <h1 className="diba-display-l mt-6 max-w-[21ch]">
              Keloid en{" "}
              <span className="diba-accent-on-dark">verdikte littekens</span>
            </h1>

            <p className="mt-6 max-w-[48ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
              Een verdikt litteken dat binnen de wondranden blijft, behandelen
              we met microneedling en laser. Daarmee wordt het vlakker en minder
              rood.
            </p>
            <LeesVerder opDonker>
              <p className="mt-4 max-w-[48ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
                Groeit het over de wondrand heen, dan is het een keloid en loopt
                de behandeling via je arts. Wij beoordelen mee en stemmen af,
                want een te stevige prikkel maakt een keloid groter.
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
              /* Yasin, 7 september 2026: de Fotona, want dat is het apparaat waarmee
                 keloïden hier behandeld worden. */
              src="/images/shoot/beh-fotona.jpg"
              alt="Fotona-laserbehandeling met oogbescherming voor cliënt en behandelaar"
              fill
              priority
              sizes="(min-width: 1024px) 44vw, 100vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>

      <PillarNav ankers={ANKERS} />

      <section
        id="consult"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-050)] px-5 py-12 sm:py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            icoon={HuidStrakker}
            label="In het consult"
            raster="gelijk"
            kop="Waar we"
            accent="naar kijken"
            intro="Het verschil tussen een keloid en een verdikt litteken zie je aan drie dingen. Die bepalen ook wie de behandeling doet."
          />

          <ol className="mt-8 sm:mt-12 grid gap-5 lg:grid-cols-3">
            {KELOID_BEOORDELING.map((stap) => (
              <li
                key={stap.kop}
                className="flex flex-col rounded-[var(--r-md)] bg-white p-7 sm:p-8"
              >
                <h3 className="diba-card-title">{stap.kop}</h3>
                {/* min-h in lh, zoals elders: gelijke tekstlengte geeft niet altijd
                    gelijke regels, want dat hangt af van waar de woorden breken. */}
                <p className="mt-3 lg:min-h-[4lh] text-[15px] leading-7 text-[var(--t-body)]">
                  {publicCopy(stap.tekst)}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        id="soorten"
        className="bg-[var(--g-025)] scroll-mt-[var(--anker-offset)] px-5 py-12 sm:py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="Twee soorten"
            kop="Binnen of"
            accent="over de rand"
            intro="Ze lijken op elkaar en vragen een andere route. Het verschil zit in de vraag of het weefsel binnen de oorspronkelijke wond blijft."
          />

          <ul className="mt-8 sm:mt-12 grid gap-4 lg:grid-cols-2">
            {KELOID_SOORTEN.map((s) => (
              <li
                key={s.id}
                className="flex flex-col rounded-[var(--r-md)] bg-white p-7 sm:p-9"
              >
                <Label>{s.klanttaal}</Label>
                <h3 className="diba-card-title-lg mt-3 text-[var(--t-strong)]">
                  {s.naam}
                </h3>
                <p className="diba-label mt-2 text-[var(--t-muted)]">
                  {s.vakterm}
                </p>
                <p className="mt-4 lg:min-h-[4lh] text-[15px] leading-7 text-[var(--t-body)]">
                  {publicCopy(s.watHetIs)}
                </p>
                <p className="mt-4 lg:min-h-[4lh] text-[15px] leading-7 text-[var(--t-body)]">
                  {publicCopy(s.watWijDoen)}
                </p>
                <p className="mt-auto border-t border-[var(--g-100)] pt-4 text-[15px] leading-7 text-[var(--t-muted)]">
                  {publicCopy(s.verwachting)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <WelNiet
        wel={KELOID_WEL_NIET.wel}
        niet={KELOID_WEL_NIET.niet}
        intro="Bij keloid telt de aanleg zwaarder dan de verzorging. Wat je wel in de hand hebt, is hoe vroeg er iemand naar kijkt."
      />

      {/* Welke behandelingen bij deze klacht horen, en op welk apparaat ze
          draaien. Leeg als er niets gekoppeld is; zie het component. */}
      <BehandelingenBijProbleem pad="/huidproblemen/keloiden" />

      <PillarFaq items={KELOID_FAQ} onderwerp="keloid" />

      <PillarCta
        kop="Plan een intake"
        accent="bij Diba Clinics"
        tekst="De behandelaar stelt vast of het om een verdikt litteken of om een keloid gaat, en wat daar in jouw geval bij past. Bij een keloid overleggen we met je arts."
        topic="keloid"
        whatsappHref={DIBA_WHATSAPP_URL}
      />
    </main>
  );
}
