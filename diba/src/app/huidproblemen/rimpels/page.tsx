import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PillarNav from "@/components/pillar/PillarNav";
import {
  NulmetingAssen,
  PillarCta,
  PillarFaq,
  SectieKop,
  WelNiet,
} from "@/components/pillar/PillarSecties";
import SoortKiezer, { type SoortOptie } from "@/components/pillar/SoortKiezer";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import ProofBar from "@/components/ui/ProofBar";
import { publicCopy } from "@/lib/copy-flags";
import {
  LIJNSOORTEN,
  RIMPELS_FAQ,
  RIMPELS_WEL_NIET,
  BEWEEGTEST_STAPPEN,
} from "@/data/rimpels";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { zoekmachineVelden } from "@/lib/seo";
import {
  DIBA_PROOF_STRIP_ITEMS,
  DIBA_SITE_URL,
  DIBA_WHATSAPP_URL,
} from "@/lib/site";

export const metadata: Metadata = zoekmachineVelden({
  pad: "/huidproblemen/rimpels",
  titel: "Rimpels behandelen in Rotterdam",
  omschrijving:
    "Rimpels en fijne lijntjes behandelen met microneedling, laser en peelings die de aanmaak van collageen op gang brengen.",
});

const PAD = "/huidproblemen/rimpels";

const ANKERS = [
  { id: "test", label: "De beweegtest" },
  { id: "welke", label: "Welke lijn heb je" },
  { id: "wel-niet", label: "Wat helpt" },
  { id: "meten", label: "Hoe we meten" },
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
      ? "Dit werkt op de huid, en dat is wat wij doen. Reken op een reeks over maanden en niet op een sessie."
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
              Rimpels en
              <br />
              <span className="diba-accent">fijne lijntjes</span>
            </h1>

            <p className="mt-6 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              Rimpels en fijne lijntjes behandelen we met microneedling, laser
              en peelings. Die brengen de aanmaak van collageen op gang,
              waardoor de huid steviger wordt en lijnen minder diep.
            </p>

            <p className="mt-4 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              Een lijn kan in je huid zitten of in de spier eronder. De
              behandelaar stelt vast om welke van de twee het gaat, want dat
              bepaalt wat er werkt.
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
              src="/images/shoot/intent-veroudering.jpg"
              alt="Cliënt tijdens een behandeling gericht op huidveroudering"
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

      {/* ── De beweegtest ── */}
      <section
        id="test"
        className="scroll-mt-[var(--anker-offset)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="In het consult"
            raster="gelijk"
            kop="Huid of"
            accent="spier"
            intro="Een lijn in de spier en een lijn in de huid zien er hetzelfde uit en vragen iets anders. De behandelaar kijkt in rust en in beweging."
          />

          <ol className="mt-12 grid gap-5 lg:grid-cols-3">
            {BEWEEGTEST_STAPPEN.map((stap) => (
              <li
                key={stap.kop}
                className="flex flex-col rounded-[var(--r-md)] bg-white p-7 sm:p-8"
              >
                <h3 className="diba-card-title mt-3">{stap.kop}</h3>
                <p className="mt-3 text-[15px] leading-7 text-[var(--t-body)]">
                  {publicCopy(stap.tekst)}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-10 rounded-[var(--r-md)] bg-[var(--g-700)] p-7 text-[var(--on-dark)] sm:p-9">
            <Label opDonker>Gaat het om meer dan lijnen?</Label>
            <p className="diba-card-title-lg mt-4 max-w-[36ch]">
              Dan kijk je breder dan deze pagina.
            </p>
            <p className="mt-4 max-w-[62ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
              Pigment, textuur, elasticiteit en verslapping lopen bij
              huidveroudering door elkaar. Zit je daarmee, dan is de bredere
              pagina de betere ingang.
            </p>
            <div className="mt-7">
              <Button
                href="/huidproblemen/huidveroudering"
                variant="primair-op-donker"
              >
                Naar huidveroudering
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section
        id="welke"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-050)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="Vier soorten lijn"
            kop="Vier soorten"
            accent="lijnen"
            intro="Vier soorten lijnen die er hetzelfde uitzien. Of een lijn in de huid of in de spier zit, bepaalt welke behandeling werkt."
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

      <NulmetingAssen
        kop="Waarom we vooraf vastleggen"
        alineas={[
          "Bij lijnen gaat het om maanden, en in die maanden zie je jezelf elke dag. Daardoor merk je een geleidelijke verandering nauwelijks op, in beide richtingen. De EVE-M legt je huid vast onder vast licht en vanuit een vaste hoek.",
          "Dat maakt het verschil later zichtbaar in plaats van dat je het moet geloven. En het werkt ook andersom: blijkt er na een reeks weinig veranderd, dan is dat een reden om iets anders te doen en niet om door te gaan.",
        ]}
        assen={[
          ["Textuur", "Hoe fijn of grof het oppervlak van je huid is"],
          ["Elasticiteit", "Hoe snel de huid terugveert, en waar niet meer"],
          ["Zonschade", "Wat er onder de oppervlakte al is opgebouwd"],
        ]}
      />

      <PillarFaq items={RIMPELS_FAQ} onderwerp="rimpels" />

      <PillarCta
        kop="Wat een nulmeting"
        accent="oplevert"
        tekst="Bij lijnen gaat het om maanden, en je eigen gezicht zie je elke dag. De nulmeting legt vast waar je begon, zodat het verschil later te zien is in plaats van te geloven."
        topic="rimpels"
        whatsappHref={DIBA_WHATSAPP_URL}
      />
    </main>
  );
}
