import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
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
import ProofBar from "@/components/ui/ProofBar";
import {
  STRIAE_BEOORDELING,
  STRIAE_FAQ,
  STRIAE_SOORTEN,
  STRIAE_WEL_NIET,
} from "@/data/striae";
import { publicCopy } from "@/lib/copy-flags";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { zoekmachineVelden } from "@/lib/seo";
import {
  DIBA_PROOF_STRIP_ITEMS,
  DIBA_SITE_URL,
  DIBA_WHATSAPP_URL,
} from "@/lib/site";

/**
 * Striae — sinds vandaag weer een eigen pagina.
 *
 * Hij stond als redirect naar de littekenpagina, met als redenering dat het verhaal
 * hetzelfde is. Dat klopt klinisch, maar iemand met striae na een zwangerschap zoekt op
 * striae en krijgt op een littekenpagina drie kwart tekst die niet over hem gaat.
 *
 * De achtergrond bij de inhoud staat in `src/data/striae.ts`.
 *
 * COPY: concept in de Diba-stem. Medische beweringen zijn gemarkeerd voor Rojda.
 */

export const metadata: Metadata = zoekmachineVelden({
  pad: "/huidproblemen/striae",
  titel: "Striae behandelen in Rotterdam",
  omschrijving:
    "Striae behandelen met microneedling en laser. Rode striae reageren het best, bij witte werken we op de structuur.",
});

const PAD = "/huidproblemen/striae";

const ANKERS = [
  { id: "consult", label: "In het consult" },
  { id: "soorten", label: "Twee stadia" },
  { id: "wel-niet", label: "Wat helpt" },
  { id: "vragen", label: "Vragen" },
] as const;

export default function StriaePage() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Huidproblemen", url: `${DIBA_SITE_URL}/huidproblemen` },
          { name: "Striae", url: `${DIBA_SITE_URL}${PAD}` },
        ])}
      />

      <section className="mx-auto px-5 sm:px-9 lg:px-[7.5vw]">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="py-14 lg:py-20">
            <nav
              aria-label="Kruimelpad"
              className="diba-label flex flex-wrap gap-2"
            >
              <Link href="/" className="hover:text-[var(--g-700)]">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <Link href="/huidproblemen" className="hover:text-[var(--g-700)]">
                Huidproblemen
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-[var(--t-muted)]">Striae</span>
            </nav>

            <h1 className="diba-display-l mt-6 max-w-[21ch]">
              Striae <span className="diba-accent">behandelen</span>
            </h1>

            <p className="mt-6 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              Striae behandelen we met microneedling en laser, die de aanmaak
              van collageen in het gescheurde bindweefsel op gang brengen. Zo
              worden ze vlakker en minder zichtbaar.
            </p>

            <p className="mt-4 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              Het stadium bepaalt wat er haalbaar is. Rode en paarse striae
              reageren het beste; bij witte werken we op de structuur. Tijdens
              de intake stelt de behandelaar vast waar jij staat.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Button href="/intake">Plan een huidconsult</Button>
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

          <div className="relative min-h-[300px] overflow-hidden rounded-[var(--r-md)] bg-[var(--g-200)] lg:min-h-[460px]">
            <Image
              src="/images/shoot/beh-skinpen.jpg"
              alt="Microneedlingbehandeling in de behandelkamer"
              fill
              priority
              sizes="(min-width: 1024px) 44vw, 100vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>

      <ProofBar items={DIBA_PROOF_STRIP_ITEMS} />

      <PillarNav ankers={ANKERS} />

      <section
        id="consult"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-050)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            icoon={HuidStrakker}
            label="In het consult"
            raster="gelijk"
            kop="Waar we"
            accent="naar kijken"
            intro="Kleur, ouderdom en reliëf bepalen samen wat er te halen valt. De behandelaar loopt die drie langs voordat er een plan komt."
          />

          <ol className="mt-12 grid gap-5 lg:grid-cols-3">
            {STRIAE_BEOORDELING.map((stap) => (
              <li
                key={stap.kop}
                className="flex flex-col rounded-[var(--r-md)] bg-white p-7 sm:p-8"
              >
                <h3 className="diba-card-title">{stap.kop}</h3>
                {/* min-h in lh, zoals elders: gelijke tekstlengte geeft niet altijd
                    gelijke regels, want dat hangt af van waar de woorden breken. */}
                <p className="mt-3 min-h-[4lh] text-[15px] leading-7 text-[var(--t-body)]">
                  {publicCopy(stap.tekst)}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        id="soorten"
        className="scroll-mt-[var(--anker-offset)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="Twee stadia"
            kop="Rood of"
            accent="wit"
            intro="Striae doorlopen twee fasen. Welke van de twee je hebt, bepaalt wat een behandeling oplevert en hoe snel je erbij moet zijn."
          />

          <ul className="mt-12 grid gap-4 lg:grid-cols-2">
            {STRIAE_SOORTEN.map((s) => (
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
                <p className="mt-4 min-h-[4lh] text-[15px] leading-7 text-[var(--t-body)]">
                  {publicCopy(s.watHetIs)}
                </p>
                <p className="mt-4 min-h-[4lh] text-[15px] leading-7 text-[var(--t-body)]">
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
        wel={STRIAE_WEL_NIET.wel}
        niet={STRIAE_WEL_NIET.niet}
        intro="Bij striae telt het moment zwaarder dan de techniek. Wie begint zolang ze nog rood zijn, houdt de meeste ruimte over."
      />

      <PillarFaq items={STRIAE_FAQ} onderwerp="striae" />

      <PillarCta
        kop="Plan een intake"
        accent="bij Diba Clinics"
        tekst="De behandelaar beoordeelt in welk stadium je striae zijn en wat een reeks in jouw geval kan opleveren. Je hoort meteen hoeveel afspraken dat vraagt en wat het kost."
        topic="striae"
        whatsappHref={DIBA_WHATSAPP_URL}
      />
    </main>
  );
}
