import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Spiegeltest from "@/components/kringen/Spiegeltest";
import PillarNav from "@/components/pillar/PillarNav";
import {
  NulmetingAssen,
  PillarCta,
  PillarFaq,
  SectieKop,
  WelNiet,
} from "@/components/pillar/PillarSecties";
import Button from "@/components/ui/Button";
import ProofBar from "@/components/ui/ProofBar";
import { FIGMA_INTENT_PIGMENT } from "@/data/figma-home-images";
import { KRINGEN_FAQ, KRINGEN_WEL_NIET, UITKOMSTEN } from "@/data/kringen";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { zoekmachineVelden } from "@/lib/seo";
import {
  DIBA_PROOF_STRIP_ITEMS,
  DIBA_SITE_URL,
  DIBA_WHATSAPP_URL,
} from "@/lib/site";

/**
 * Donkere kringen — zevende eigen pagina.
 *
 * De kernvraag verschilt per pagina. Acne: waar. Pigment: wanneer in het jaar. Rosacea:
 * wat zet het aan. Littekens: hoe oud is het. Veroudering: tijd of zon. Poriën: wat kun
 * je veranderen. Hier: is dit wel één ding, en welk van de drie is het bij jou.
 *
 * Deze pagina heeft geen SoortKiezer. Dat is geen bezuiniging: de spiegeltest ís de
 * herkenning, en er twee keer hetzelfde laten kiezen zou de test ondermijnen. Wel staan
 * de drie types eronder als naslag, voor wie de test overslaat.
 *
 * Bij één van de drie uitkomsten verdwijnt de knop naar de intake. Een pagina die zegt
 * dat wij niets kunnen doen en er dan toch een afspraakknop onder zet, zegt het niet.
 *
 * Twee donkergroene vlakken, niet meer (§5). Staat op noindex tot Rojda en de prijzen.
 */

export const metadata: Metadata = zoekmachineVelden({
  pad: "/huidproblemen/donkere-kringen",
  titel: "Donkere kringen: welk type heb jij?",
  omschrijving:
    "Donkere kringen behandelen: pigment, doorschijnende vaatjes of schaduw. Hoe we vaststellen om welke van de drie het gaat.",
});

const PAD = "/huidproblemen/donkere-kringen";

const ANKERS = [
  { id: "test", label: "In het consult" },
  { id: "types", label: "De drie types" },
  { id: "wel-niet", label: "Wat helpt" },
  { id: "meten", label: "Hoe we meten" },
  { id: "vragen", label: "Vragen" },
] as const;

/* Stond op "Hier kunnen wij iets / deels iets / niets". Drie labels waarvan er twee met
   een ontkenning openden, op de plek waar iemand kijkt of hij hier goed zit. Nu zeggen ze
   wat de route is in plaats van wat wij niet kunnen. */
const HELPT_LABEL = {
  ja: "Dit behandelen wij",
  deels: "Deels behandelbaar",
  nee: "Andere discipline",
} as const;

export default function DonkereKringenPage() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Huidproblemen", url: `${DIBA_SITE_URL}/huidproblemen` },
          { name: "Donkere kringen", url: `${DIBA_SITE_URL}${PAD}` },
        ])}
      />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
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
              <span className="text-[var(--t-muted)]">Donkere kringen</span>
            </nav>

            <h1 className="diba-display-l mt-6">
              Donkere kringen
              <br />
              <span className="diba-accent">onder je ogen</span>
            </h1>

            <p className="mt-6 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              Donkere kringen hebben drie mogelijke oorzaken: pigment,
              doorschijnende vaatjes of schaduw door een groef. Pigment
              behandelen we met peelings en gerichte verzorging.
            </p>

            <p className="mt-4 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              In de intake stellen we vast om welke van de drie het gaat en wat
              daarbij past.
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

          {/* Leent het pigmentbeeld: dat is het enige type dat wij behandelen. */}
          <div className="relative min-h-[300px] overflow-hidden rounded-[var(--r-md)] bg-[var(--g-200)] lg:min-h-[460px]">
            <Image
              src={FIGMA_INTENT_PIGMENT.src}
              alt={FIGMA_INTENT_PIGMENT.alt}
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

      {/* ── De spiegeltest: de uitblinker ──────────────────────────────── */}
      <section
        id="test"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-050)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="In het consult"
            kop="Waar we"
            accent="naar kijken"
            intro="De huidtherapeut beoordeelt of je naar kleur kijkt of naar schaduw, en of het pigment is of doorschijnende vaatjes."
          />
          <Spiegeltest />
        </div>
      </section>

      {/* ── De drie types als naslag ───────────────────────────────────── */}
      <section
        id="types"
        className="scroll-mt-[var(--anker-offset)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="De drie types"
            kop="Drie"
            accent="oorzaken"
            intro="De drie oorzaken naast elkaar, met per soort wat eraan te doen is."
          />

          <ul className="mt-12 grid gap-px overflow-hidden rounded-[var(--r-md)] bg-[var(--g-100)] md:grid-cols-3">
            {(["pigment", "vaten", "schaduw"] as const).map((id) => {
              const u = UITKOMSTEN[id];
              return (
                <li key={u.id} className="bg-white p-6 sm:p-8">
                  <h3 className="diba-card-title">{u.kop}</h3>
                  <p className="diba-label mt-2 text-[var(--t-muted)]">
                    {u.vakterm}
                  </p>
                  {/* min-h in lh, net als op de littekenpagina: twee blokken van 151 tekens
                      gaven vijf en vier regels, want het verschil zit op een woordgrens en
                      niet in de lengte. Vijf regelhoogtes gereserveerd, die meegroeien als
                      de tekst op een smal scherm meer nodig heeft. */}
                  <p className="mt-4 min-h-[5lh] text-[15px] leading-7 text-[var(--t-body)]">
                    {u.watHetIs.replace(/\[[^\]]+\]/g, "").trim()}
                  </p>
                  <p
                    className={`diba-label mt-5 ${
                      u.wijHelpen === "nee"
                        ? "text-[var(--warn-text)]"
                        : "text-[var(--g-700)]"
                    }`}
                  >
                    {HELPT_LABEL[u.wijHelpen]}
                  </p>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-[var(--r-md)] bg-white p-6">
            <p className="max-w-[62ch] text-[15px] leading-7 text-[var(--t-body)]">
              Kwam er pigment uit? Dan gelden dezelfde regels als voor pigment
              elders in je gezicht, inclusief het seizoen waarin je beter niet
              begint.
            </p>
            <Link
              href="/huidproblemen/pigmentvlekken"
              className="diba-label text-[var(--g-700)] underline underline-offset-4"
            >
              Naar de pigmentpagina
            </Link>
          </div>
        </div>
      </section>

      <WelNiet
        wel={KRINGEN_WEL_NIET.wel}
        niet={KRINGEN_WEL_NIET.niet}
        intro="Behandelen voordat duidelijk is om welke van de drie het gaat, kost de meeste mensen het meeste geld."
      />

      <NulmetingAssen
        kop="Onder het oog telt het licht dubbel."
        alineas={[
          "Geen enkel gebied is zo gevoelig voor de stand van een lamp als dit. Licht van boven maakt van elke holte een donkere plek, en dan meet je vooral je verlichting in plaats van je huid.",
          "Daarom leggen we dit gebied vast met vaste belichting en op vaste afstand. Pas dan is een verschil later een verschil, en geen ander moment van de dag.",
        ]}
        assen={[
          ["Kleur", "Hoeveel pigment er in de huid zelf zit"],
          ["Doorschijnen", "Hoe sterk het vaatnetwerk eronder meetelt"],
          ["Schaduw", "Hoe diep de overgang naar de wang ligt"],
        ]}
      />

      <PillarFaq items={KRINGEN_FAQ} onderwerp="donkere kringen" />

      <PillarCta
        kop="Eerst weten"
        accent="welk type je hebt."
        tekst="We kijken onder vaste belichting welk van de drie het is. Blijkt het schaduw, dan hoor je dat en houdt het op. Blijkt het pigment, dan weet je meteen wat er mogelijk is."
        topic="donkere-kringen"
        whatsappHref={DIBA_WHATSAPP_URL}
      />
    </main>
  );
}
