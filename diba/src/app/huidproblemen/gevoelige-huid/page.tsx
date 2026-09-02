import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Stapelteller from "@/components/gevoelige-huid/Stapelteller";
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
import Label from "@/components/ui/Label";
import ProofBar from "@/components/ui/ProofBar";
import { FIGMA_INTENT_ACNE } from "@/data/figma-home-images";
import {
  ANDERE_OORZAKEN,
  GEVOELIG_FAQ,
  GEVOELIG_WEL_NIET,
  GEVOELIG_WIJ_DOEN_NIET,
} from "@/data/gevoelige-huid";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { zoekmachineVelden } from "@/lib/seo";
import {
  DIBA_PROOF_STRIP_ITEMS,
  DIBA_SITE_URL,
  DIBA_WHATSAPP_URL,
} from "@/lib/site";

/**
 * Gevoelige huid — elfde eigen pagina.
 *
 * De kernvraag hier is of het wel een huidtype is. Meestal is een gevoelige huid een
 * gevólg: een routine die in jaren is volgestapeld met stoffen die elk op zich prima zijn
 * en samen op dezelfde barrière werken. Niemand ziet dat, want je bekijkt het per product.
 *
 * De teller telt daarom op. En de uitkomst is bijna altijd aftrekken, wat ons niets
 * oplevert; precies daarom staat het er.
 *
 * Wat deze pagina nadrukkelijk niet doet is alles op de routine schuiven. Rosacea, eczeem
 * en contactallergie beginnen met dezelfde klacht en horen ergens anders thuis. Die staan
 * er meteen onder, met links, ook wanneer de teller laag uitvalt.
 *
 * Twee donkergroene vlakken, niet meer (§5).
 */

export const metadata: Metadata = zoekmachineVelden({
  pad: "/huidproblemen/gevoelige-huid",
  titel: "Gevoelige huid: type of gevolg?",
  omschrijving:
    "Een huid die opeens overal op reageert is zelden van aanleg veranderd. Wat er meestal bij is gekomen, en hoe je de barrière weer opbouwt.",
});

const PAD = "/huidproblemen/gevoelige-huid";

const ANKERS = [
  { id: "teller", label: "Wat staat er aan" },
  { id: "anders", label: "Als het dat niet is" },
  { id: "wel-niet", label: "Wat helpt" },
  { id: "nee", label: "Waar wij nee zeggen" },
  { id: "meten", label: "Hoe we meten" },
  { id: "vragen", label: "Vragen" },
] as const;

export default function GevoeligeHuidPage() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Huidproblemen", url: `${DIBA_SITE_URL}/huidproblemen` },
          { name: "Gevoelige huid", url: `${DIBA_SITE_URL}${PAD}` },
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
              <span className="text-[var(--t-muted)]">Gevoelige huid</span>
            </nav>

            <h1 className="diba-display-l mt-6">
              Een huid die
              <br />
              <span className="diba-accent">snel reageert</span>
            </h1>

            <p className="mt-6 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              Een huid die jarenlang alles verdroeg en het opeens niet meer
              doet, is zelden veranderd van aanleg. Er is meestal iets bij
              gekomen, en daarna nog iets, en alles werkt op dezelfde barrière.
            </p>

            <p className="mt-4 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              Je ziet dat niet, omdat je het per product bekijkt en niet bij
              elkaar optelt. Hieronder tellen we het wel op.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Button href="#teller">Tel je routine op</Button>
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

          {/* Leent het acnebeeld tot er een eigen shoot is voor dit onderwerp. */}
          <div className="relative min-h-[300px] overflow-hidden rounded-[var(--r-md)] bg-[var(--g-200)] lg:min-h-[460px]">
            <Image
              src={FIGMA_INTENT_ACNE.src}
              alt={FIGMA_INTENT_ACNE.alt}
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

      {/* ── De stapelteller: de uitblinker ─────────────────────────────── */}
      <section
        id="teller"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-050)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="De stapelteller"
            kop="Vink aan wat je"
            accent="nu gebruikt."
            intro="Elk van deze dingen kan op zichzelf prima zijn. Het gaat om wat er samen op dezelfde barrière werkt, en om de combinaties die op dezelfde dag botsen."
          />
          <Stapelteller />
        </div>
      </section>

      {/* ── Als het de routine niet is ─────────────────────────────────── */}
      <section
        id="anders"
        className="scroll-mt-[var(--anker-offset)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="Als het dat niet is"
            kop="Vier aandoeningen"
            accent="die zo beginnen."
            intro="Een gevoelige huid is een klacht en geen diagnose. Deze vier beginnen alle vier met dezelfde zin, en ze vragen alle vier iets anders. Herken je er een, dan begint het verhaal daar."
          />

          <ul className="mt-12 grid gap-px overflow-hidden rounded-[var(--r-md)] bg-[var(--g-100)] md:grid-cols-2 lg:grid-cols-4">
            {ANDERE_OORZAKEN.map((o) => (
              <li key={o.id} className="flex flex-col bg-white p-6 sm:p-7">
                <h3 className="diba-card-title">{o.naam}</h3>
                <p className="mt-3 grow text-[15px] leading-7 text-[var(--t-body)]">
                  {o.herken}
                </p>
                <Link
                  href={o.pad}
                  className="diba-label mt-5 text-[var(--g-700)] underline underline-offset-4"
                >
                  {o.link}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-[var(--r-md)] bg-[var(--g-050)] p-6">
            <Label>Wanneer je naar de huisarts gaat</Label>
            <p className="mt-3 max-w-[70ch] text-[15px] leading-7 text-[var(--t-body)]">
              Bij jeuk die je uit je slaap houdt, bij kloofjes of wondjes, bij
              plekken die niet weggaan of steeds terugkomen op dezelfde plaats.
              Dat is geen gevoelige huid meer en daar zijn wij niet de juiste
              plek voor.
            </p>
          </div>
        </div>
      </section>

      <WelNiet
        wel={GEVOELIG_WEL_NIET.wel}
        niet={GEVOELIG_WEL_NIET.niet}
        intro="Het eerste kruisje rechts is het hardnekkigste verhaal in de huidverzorging: dat prikken betekent dat het werkt."
      />

      <WijZeggenNee
        kop="Minder producten"
        accent="verdient ons niets"
        intro="Bij een gevoelige huid is een eenvoudigere routine vaak verstandiger dan meer producten toevoegen."
        punten={GEVOELIG_WIJ_DOEN_NIET}
      />

      <NulmetingAssen
        kop="Waarom we eerst de oorzaak zoeken"
        alineas={[
          "Een gevoelige huid voelt de ene dag anders dan de andere, en achteraf weet niemand meer hoe het vorige maand was. Zonder vast beginpunt praat je dus over een herinnering.",
          "We leggen daarom vast hoe rood het is, hoe snel vocht verdwijnt en hoe de bovenlaag erbij ligt. Dan is de vraag over twee maanden niet of het beter voelt, maar of het beter is.",
        ]}
        assen={[
          ["Roodheid", "Hoeveel er zichtbaar is in rust"],
          ["Lekkage", "Hoe snel vocht door de barrière verdwijnt"],
          ["Structuur", "Hoe gelijkmatig de bovenlaag ligt"],
        ]}
      />

      <PillarFaq items={GEVOELIG_FAQ} onderwerp="een gevoelige huid" />

      <PillarCta
        kop="Eerst uitzoeken"
        accent="wat er aanstaat."
        tekst="We lopen je routine langs, meten hoe je barrière ervoor staat en zeggen wat eruit kan. Vaak is dat het hele advies, en dan is de behandeling dat je twee weken minder doet."
        topic="gevoelige-huid"
        whatsappHref={DIBA_WHATSAPP_URL}
      />
    </main>
  );
}
