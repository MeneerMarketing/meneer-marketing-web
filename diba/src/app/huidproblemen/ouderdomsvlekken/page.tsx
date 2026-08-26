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
  WijZeggenNee,
} from "@/components/pillar/PillarSecties";
import SoortKiezer, { type SoortOptie } from "@/components/pillar/SoortKiezer";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import ProofBar from "@/components/ui/ProofBar";
import { publicCopy } from "@/lib/copy-flags";
import {
  OUDERDOMSVLEKKEN_FAQ,
  OUDERDOMSVLEKKEN_WEL_NIET,
  OUDERDOMSVLEKKEN_WIJ_DOEN_NIET,
  PIGMENT_BEELDEN,
  VERANDERCHECK_STAPPEN,
} from "@/data/ouderdomsvlekken";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import {
  DIBA_PROOF_STRIP_ITEMS,
  DIBA_SITE_URL,
  DIBA_WHATSAPP_URL,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "Ouderdomsvlekken en zonnevlekken behandelen in Rotterdam",
  description:
    "Is deze plek door de jaren heen ontstaan, of is hij veranderd? Die vraag komt eerst, want niet alles wat bruin is mag onder een laser.",
};

const PAD = "/huidproblemen/ouderdomsvlekken";

const ANKERS = [
  { id: "check", label: "De verandercheck" },
  { id: "welke", label: "Wat heb je" },
  { id: "wel-niet", label: "Wat helpt" },
  { id: "nee", label: "Waar wij nee zeggen" },
  { id: "meten", label: "Hoe we meten" },
  { id: "vragen", label: "Vragen" },
] as const;

const SOORTEN: readonly SoortOptie[] = PIGMENT_BEELDEN.map((o) => ({
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
      ? "Dit behandelen wij"
      : "Hier kijkt eerst iemand anders",
    tekst: o.binnenBereik
      ? "Een egale, platte vlek op een plek die veel zon heeft gehad. Dit is het beeld waar licht het meest oplevert."
      : "Dit is geen gewone zonnevlek. Behandelen zonder dat er eerst naar gekeken is, is hier precies wat er niet moet gebeuren.",
  },
}));

export default function Pagina() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Huidproblemen", url: `${DIBA_SITE_URL}/huidproblemen` },
          { name: "Ouderdomsvlekken", url: `${DIBA_SITE_URL}${PAD}` },
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
              <span className="text-[var(--t-muted)]">Ouderdomsvlekken</span>
            </nav>

            <h1 className="diba-display-l mt-6">
              Niet alles wat bruin is
              <br />
              <span className="diba-accent">mag onder een laser.</span>
            </h1>

            <p className="mt-6 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              Ouderdomsvlekken en zonnevlekken zijn onschuldig en goed te
              behandelen. Het probleem is dat andere dingen er in het begin op
              lijken, en die zijn dat niet altijd. Daarom is onze eerste vraag
              niet hoe je ervan afkomt, maar of het is wat je denkt.
            </p>

            <p className="mt-4 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              Verandert een plek van vorm of kleur, dan gaat hij eerst naar de
              huisarts. Ook als het waarschijnlijk niets is.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Button href="#welke">Kijk wat jij hebt</Button>
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
              src="/images/shoot/beh-nordlys.jpg"
              alt="Nordlys-behandeling met beschermbril in de behandelkamer"
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

      {/* ── De verandercheck ── */}
      <section
        id="check"
        className="scroll-mt-[var(--anker-offset)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="De verandercheck"
            raster="gelijk"
            kop="Een foto met een datum"
            accent="verslaat je geheugen."
            intro="Dit zegt niet wat een plek is; dat kan niemand vanaf een foto. Het zegt wel of er iets verandert, en dat is het enige dat bepaalt of je eerst ergens anders moet zijn."
          />

          <ol className="mt-12 grid gap-5 lg:grid-cols-3">
            {VERANDERCHECK_STAPPEN.map((stap, i) => (
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

          <div className="mt-10 rounded-[var(--r-md)] bg-[var(--g-700)] p-7 text-[var(--on-dark)] sm:p-9">
            <Label opDonker>Twijfel je over een plek?</Label>
            <p className="diba-card-title-lg mt-4 max-w-[36ch]">
              Dan hoort daar eerst iemand anders naar te kijken.
            </p>
            <p className="mt-4 max-w-[62ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
              Een rafelige rand, ongelijke kleur, groei of jeuk: bij die dingen
              ga je naar de huisarts. Wij behandelen niets waarvan niet
              vaststaat wat het is.
            </p>
            <div className="mt-7">
              <Button
                href="/huidproblemen/huidkanker-naevi"
                variant="primair-op-donker"
              >
                Naar de ABCDE-check
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
            label="Vier beelden"
            kop="Een ervan behandelen wij,"
            accent="en drie niet meteen."
            intro="Dit is een herkenningshulp en geen diagnose. Zit er iets bij dat verandert, dan is de rest van deze pagina niet aan de orde en ga je eerst naar de huisarts."
          />
          <SoortKiezer
            opties={SOORTEN}
            ctaHrefPatroon="/intake?topic=ouderdomsvlekken&beeld={id}"
            ctaLabel="Laat dit bekijken"
            hint="Twijfel je tussen twee? Dan kijken we samen."
          />
        </div>
      </section>

      <WelNiet
        wel={OUDERDOMSVLEKKEN_WEL_NIET.wel}
        niet={OUDERDOMSVLEKKEN_WEL_NIET.niet}
        intro="Bij pigment is zonbescherming geen advies achteraf maar onderdeel van de behandeling. Zonder dat komt het terug en is het geld weg."
      />

      <WijZeggenNee
        kop="Twee keer nee,"
        accent="en de eerste is niet onderhandelbaar."
        intro="Een plek wegbranden maakt niet alleen de plek weg maar ook de mogelijkheid om hem te beoordelen. Dat is een fout die niet te herstellen is."
        punten={OUDERDOMSVLEKKEN_WIJ_DOEN_NIET}
      />

      <NulmetingAssen
        kop="Onder UV zie je wat er nog komt."
        alineas={[
          "Pigment begint dieper in de huid dan waar je het ziet. Onder UV-licht wordt zichtbaar wat er al ligt en aan de oppervlakte nog niet doorkomt, en dat is vaak meer dan mensen verwachten.",
          "Confronterend, en nuttig: het verklaart waarom er zonder zonbescherming steeds nieuwe vlekken bij lijken te komen. Ze kwamen er niet bij; ze waren er al.",
        ]}
        assen={[
          ["Zichtbaar pigment", "De vlekken zoals je ze nu in de spiegel ziet"],
          ["Onderliggend pigment", "Wat er dieper ligt en later doorkomt"],
          ["Zonschade", "Hoeveel de huid over de jaren te verwerken kreeg"],
        ]}
      />

      <PillarFaq items={OUDERDOMSVLEKKEN_FAQ} />

      <PillarCta
        kop="Eerst kijken."
        accent="Dan pas licht."
        tekst="In Behandeling Nul beoordelen we de plekken en meten we onder UV-licht ook het pigment dat je zelf nog niet ziet. Daarna weet je wat er kan en wat er eerst ergens anders hoort."
        topic="ouderdomsvlekken"
        whatsappHref={DIBA_WHATSAPP_URL}
      />
    </main>
  );
}
