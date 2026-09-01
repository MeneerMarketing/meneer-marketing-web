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
  WijZeggenNee,
} from "@/components/pillar/PillarSecties";
import Button from "@/components/ui/Button";
import ProofBar from "@/components/ui/ProofBar";
import { FIGMA_INTENT_PIGMENT } from "@/data/figma-home-images";
import {
  KRINGEN_FAQ,
  KRINGEN_WEL_NIET,
  KRINGEN_WIJ_DOEN_NIET,
  UITKOMSTEN,
} from "@/data/kringen";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
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

export const metadata: Metadata = {
  title: "Donkere kringen: welk type heb jij?",
  description:
    "Donkere kringen hebben drie verschillende oorzaken die er hetzelfde uitzien. Hoe je ze uit elkaar houdt, en bij welke wij je niet verder helpen.",
};

const PAD = "/huidproblemen/donkere-kringen";

const ANKERS = [
  { id: "test", label: "Doe de spiegeltest" },
  { id: "types", label: "De drie types" },
  { id: "wel-niet", label: "Wat helpt" },
  { id: "nee", label: "Waar wij nee zeggen" },
  { id: "meten", label: "Hoe we meten" },
  { id: "vragen", label: "Vragen" },
] as const;

const HELPT_LABEL = {
  ja: "Hier kunnen wij iets",
  deels: "Hier kunnen wij deels iets",
  nee: "Hier kunnen wij niets",
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
              Donkere kringen zijn geen aandoening maar een uiterlijk kenmerk
              met drie verschillende oorzaken. Ze zien er hetzelfde uit en
              vragen alle drie iets anders, en bij één ervan is de eerlijke
              uitkomst dat wij je niet verder helpen.
            </p>

            <p className="mt-4 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              Je kunt zelf uitzoeken welke het bij jou is. Daar heb je een
              spiegel voor nodig en twee minuten, en het kost je niets.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Button href="#test">Doe de spiegeltest</Button>
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
            label="De spiegeltest"
            kop="Zoek zelf uit"
            accent="welk type je hebt."
            intro="Twee handelingen voor de spiegel en één vraag over je week. Daarna weet je of je naar kleur kijkt of naar schaduw, en dat bepaalt of behandelen zin heeft."
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
            kop="Hetzelfde beeld,"
            accent="drie verschillende oorzaken."
            intro="Voor wie de test wil overslaan of wil nalezen wat eruit kwam. Let op de middelste kolom: die verschilt per type en daarom één behandeling voor alle drie niet bestaat."
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
                  <p className="mt-4 text-[15px] leading-7 text-[var(--t-body)]">
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
        intro="Het eerste kruisje rechts kost de meeste mensen het meeste geld: een behandeling boeken voordat duidelijk is welk type ze hebben."
      />

      <WijZeggenNee
        kop="Soms is het antwoord"
        accent="dat wij je niet helpen."
        intro="Als de test uitwijst dat het schaduw is, sturen we je weg zonder behandeling. Dat is geen bescheidenheid maar rekenwerk: een huidbehandeling maakt een holte niet ondieper, dus zou je betalen voor niets."
        punten={KRINGEN_WIJ_DOEN_NIET}
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
