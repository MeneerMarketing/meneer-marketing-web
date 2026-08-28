import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PillarNav from "@/components/pillar/PillarNav";
import {
  PillarCta,
  PillarFaq,
  SectieKop,
  WelNiet,
  WijZeggenNee,
} from "@/components/pillar/PillarSecties";
import SoortKiezer, { type SoortOptie } from "@/components/pillar/SoortKiezer";
import Button from "@/components/ui/Button";
import { HuidBultje } from "@/components/ui/HuidIcon";
import Label from "@/components/ui/Label";
import ProofBar from "@/components/ui/ProofBar";
import {
  STEELTJESCHECK_STAPPEN,
  STEELWRAT_FAQ,
  STEELWRAT_WEL_NIET,
  STEELWRAT_WIJ_DOEN_NIET,
  UITSTEEKSEL_BEELDEN,
} from "@/data/steelwratjes";
import { publicCopy } from "@/lib/copy-flags";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import {
  DIBA_PROOF_STRIP_ITEMS,
  DIBA_SITE_URL,
  DIBA_WHATSAPP_URL,
} from "@/lib/site";

/**
 * Steelwratjes — de klacht bij een behandeling die al bestond, met de beoordeling ervoor.
 *
 * De achtergrond bij de inhoud staat in `src/data/steelwratjes.ts`.
 *
 * COPY: concept in de Diba-stem. Medische beweringen zijn gemarkeerd voor Rojda.
 */

export const metadata: Metadata = {
  title: "Steelwratjes laten verwijderen in Rotterdam",
  description:
    "Een zacht velletje aan een steeltje in je hals of oksel is meestal onschuldig en in een afspraak weg. Maar niet alles wat uitsteekt is een steelwratje.",
};

const PAD = "/huidproblemen/steelwratjes";

const ANKERS = [
  { id: "check", label: "De steeltjescheck" },
  { id: "welke", label: "Wat hangt er" },
  { id: "wel-niet", label: "Wat helpt" },
  { id: "nee", label: "Waar wij nee zeggen" },
  { id: "vragen", label: "Vragen" },
] as const;

const SOORTEN: readonly SoortOptie[] = UITSTEEKSEL_BEELDEN.map((o) => ({
  id: o.id,
  naam: o.naam,
  klanttaal: o.klanttaal,
  vakterm: o.vakterm,
  velden: [
    ["Waar je het zelf aan herkent", o.zelfcheck],
    ["Wat het is", o.watHetIs],
    ["Wat wij doen", o.watWijDoen],
  ] as const,
  uitgelicht: {
    label: o.binnenBereik
      ? "Dit halen wij weg"
      : "Hier kijkt eerst iemand anders",
    tekst: o.binnenBereik
      ? "Goedaardig, aan een steeltje, en onveranderd. Meestal in een afspraak klaar, en per kwartier gerekend zodat meerdere plekjes samen niet duurder uitvallen."
      : "Dit is geen fibroom, of het verandert. Weghalen zou betekenen dat er niets meer te beoordelen valt, en dat is een fout die niet te herstellen is.",
  },
}));

export default function Pagina() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Huidproblemen", url: `${DIBA_SITE_URL}/huidproblemen` },
          { name: "Steelwratjes", url: `${DIBA_SITE_URL}${PAD}` },
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
              <span className="text-[var(--t-muted)]">Steelwratjes</span>
            </nav>

            <h1 className="diba-display-l mt-6">
              Hangt het aan een steeltje?
              <br />
              <span className="diba-accent">Dat is de eerste vraag.</span>
            </h1>

            <p className="mt-6 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              Een zacht, huidkleurig velletje aan een smal steeltje in je hals,
              oksel of lies is een fibroom. Onschuldig, het gaat niet vanzelf
              weg, en het is meestal in een afspraak verholpen.
            </p>

            <p className="mt-4 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              Maar er hangt van alles aan een hals dat erop lijkt en het niet
              is. Daarom kijken we eerst, ook als je precies weet wat je wil.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Button href="#check">Doe de steeltjescheck</Button>
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
              src="/images/shoot/beh-fibromen.jpg"
              alt="Behandeling van kleine huidplekjes in de behandelkamer"
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
        id="check"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-050)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            icoon={HuidBultje}
            label="De steeltjescheck"
            raster="gelijk"
            kop="Steeltje, kleur,"
            accent="en of het onveranderd is."
            intro="Drie waarnemingen die bepalen of dit hier thuishoort of bij een arts. Niet eraan trekken en niet knijpen: dat is wat mensen thuis doen en waar het misgaat."
          />

          <ol className="mt-12 grid gap-5 lg:grid-cols-3">
            {STEELTJESCHECK_STAPPEN.map((stap, i) => (
              <li
                key={stap.kop}
                className="flex flex-col rounded-[var(--r-md)] bg-white p-7 sm:p-8"
              >
                <span className="diba-label text-[var(--g-700)]">
                  Stap {i + 1}
                </span>
                <h3 className="diba-card-title mt-3">{stap.kop}</h3>
                <p className="mt-3 text-[15px] leading-7 text-[var(--t-body)]">
                  {publicCopy(stap.tekst)}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        id="welke"
        className="scroll-mt-[var(--anker-offset)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="Vier uitsteeksels"
            kop="Een ervan halen wij weg,"
            accent="en drie niet zomaar."
            intro="Ze zitten op dezelfde plekken en voelen bijna hetzelfde. Het verschil bepaalt of het hier in een kwartier klaar is of dat er eerst iemand anders naar hoort te kijken."
          />
          <SoortKiezer
            opties={SOORTEN}
            ctaHrefPatroon="/intake?topic=steelwratjes&beeld={id}"
            ctaLabel="Laat dit bekijken"
            hint="Twijfel je tussen twee? Dan kijken we samen."
          />

          {/* Het doorverwijsblok hoort hier en niet onderaan: wie na de beelden doorheeft
              dat hij op de verkeerde pagina is, moet weg kunnen zonder eerst de rest te
              lezen die dan niet over hem gaat. */}
          <div className="mt-10 rounded-[var(--r-md)] bg-[var(--g-700)] p-7 text-[var(--on-dark)] sm:p-9">
            <Label opDonker>Gaat het om een moedervlek?</Label>
            <p className="diba-card-title-lg mt-4 max-w-[36ch]">
              Dan is dit niet de plek.
            </p>
            <p className="mt-4 max-w-[62ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
              Pigmentplekjes beoordelen en verwijderen hoort bij een arts, die
              het weefsel kan laten onderzoeken. Wij halen ze niet weg, ook niet
              als ze storen.
            </p>
            <div className="mt-7">
              <Button
                href="/huidproblemen/huidkanker-naevi"
                variant="primair-op-donker"
              >
                Naar moedervlekken controleren
              </Button>
            </div>
          </div>
        </div>
      </section>

      <WelNiet
        wel={STEELWRAT_WEL_NIET.wel}
        niet={STEELWRAT_WEL_NIET.niet}
        intro="Dit is een van de weinige huidproblemen waarbij het antwoord kort is: als het het juiste plekje is, is het in een afspraak klaar."
      />

      <WijZeggenNee
        kop="Twee keer nee,"
        accent="en allebei gaan over wat je daarna niet meer kunt."
        intro="Wat weg is kan niemand meer bekijken. Dat is de reden dat er hier eerst gekeken wordt en dat moedervlekken buiten deze deur blijven."
        punten={STEELWRAT_WIJ_DOEN_NIET}
      />

      <PillarFaq items={STEELWRAT_FAQ} />

      <PillarCta
        kop="Eerst kijken."
        accent="Vaak is het zo klaar."
        tekst="Bij goedaardige steelwratjes is het een korte afspraak, per kwartier gerekend. Blijkt er iets tussen te zitten dat beoordeeld moet worden, dan hoor je dat voordat we beginnen."
        topic="steelwratjes"
        whatsappHref={DIBA_WHATSAPP_URL}
      />
    </main>
  );
}
