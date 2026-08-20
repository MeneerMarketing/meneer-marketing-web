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
import ProofBar from "@/components/ui/ProofBar";
import {
  LIJNSOORTEN,
  RIMPELS_FAQ,
  RIMPELS_WEL_NIET,
  RIMPELS_WIJ_DOEN_NIET,
} from "@/data/rimpels";
import { NOG_IN_AANBOUW } from "@/lib/pagina-af";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import {
  DIBA_PROOF_STRIP_ITEMS,
  DIBA_SITE_URL,
  DIBA_WHATSAPP_URL,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "Rimpels en fijne lijntjes behandelen in Rotterdam",
  description:
    "Beweegt de lijn mee of blijft hij staan? Dat verschil bepaalt volledig wat er zin heeft, en je maakt het zelf met een spiegel.",
  ...NOG_IN_AANBOUW,
};

const PAD = "/huidproblemen/rimpels";

const ANKERS = [
  { id: "welke", label: "Welke lijn heb je" },
  { id: "wel-niet", label: "Wat helpt" },
  { id: "nee", label: "Waar wij nee zeggen" },
  { id: "vragen", label: "Vragen" },
] as const;

const SOORTEN: readonly SoortOptie[] = LIJNSOORTEN.map((o) => ({
  id: o.id,
  naam: o.naam,
  klanttaal: o.klanttaal,
  vakterm: o.vakterm,
  velden: [
    ["Wat de beweegtest doet", o.beweegtest],
    ["Wat het is", o.watHetIs],
    ["Wat wij doen", o.watWijDoen],
  ] as const,
  uitgelicht: {
    label: o.binnenBereik ? "Hier zijn wij aan zet" : "Hier zijn wij het niet",
    tekst: o.binnenBereik
      ? "Dit werkt op de huid, en dat is precies wat wij doen. Reken op een reeks over maanden en niet op een sessie."
      : "Hiervoor is een injectable of een ingreep de gangbare route, en daar werken wij niet mee. Dan verwijzen we liever door.",
  },
}));

export default function Pagina() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Huidproblemen", url: `${DIBA_SITE_URL}/huidproblemen` },
          { name: "Rimpels en fijne lijntjes", url: `${DIBA_SITE_URL}${PAD}` },
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
              <span className="text-[var(--t-muted)]">
                Rimpels en fijne lijntjes
              </span>
            </nav>

            <h1 className="diba-display-l mt-6">
              Beweegt de lijn mee?
              <br />
              <span className="diba-accent">Of blijft hij staan?</span>
            </h1>

            <p className="mt-6 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              Ontspan je gezicht en kijk in de spiegel. Verdwijnt de lijn, dan
              zit hij in de spier. Staat hij er nog, dan zit hij in je huid. Dat
              onderscheid bepaalt volledig wat er zin heeft, en het kost je tien
              seconden.
            </p>

            <p className="mt-4 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              Wij werken op de huid en niet op de spier. Dat betekent dat wij
              niet voor elke lijn de juiste zijn, en dat zeggen we hieronder
              ook.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Button href="#welke">Doe de beweegtest</Button>
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
              src="/images/shoot/beh-fotona.jpg"
              alt="Fotona-laserbehandeling in de behandelkamer, met oogbescherming"
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
        id="welke"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-050)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="Vier soorten lijn"
            kop="Niet elke lijn"
            accent="is een rimpel."
            intro="Dit is een herkenningshulp en geen diagnose. Maar de beweegtest brengt de meeste mensen bij de juiste kaart, en bij twee daarvan is ons antwoord dat verzorging of iemand anders meer oplevert dan een reeks bij ons."
          />
          <SoortKiezer
            opties={SOORTEN}
            ctaHrefPatroon="/intake?topic=rimpels&beeld={id}"
            ctaLabel="Laat dit bekijken"
            hint="Twijfel je tussen twee? Dan kijken we samen."
          />
        </div>
      </section>

      <WelNiet
        wel={RIMPELS_WEL_NIET.wel}
        niet={RIMPELS_WEL_NIET.niet}
        intro="Bij lijnen zit de winst in de juiste keuze en in geduld. Collageen bouwt in maanden op, en dat is niet te versnellen door vaker te komen."
      />

      <WijZeggenNee
        kop="Twee keer nee,"
        accent="en de eerste verrast mensen."
        intro="Dit zijn de gevallen waarin wij een behandeling afhouden die je zelf wilde boeken. In het ene geval omdat het niet ons vak is, in het andere omdat het niet nodig is."
        punten={RIMPELS_WIJ_DOEN_NIET}
      />

      <PillarFaq items={RIMPELS_FAQ} />

      <PillarCta
        kop="Eerst meten."
        accent="Dan pas beginnen."
        tekst="Bij lijnen gaat het om maanden, en je eigen gezicht zie je elke dag. De nulmeting legt vast waar je begon, zodat het verschil later te zien is in plaats van te geloven."
        topic="rimpels"
        whatsappHref={DIBA_WHATSAPP_URL}
      />
    </main>
  );
}
