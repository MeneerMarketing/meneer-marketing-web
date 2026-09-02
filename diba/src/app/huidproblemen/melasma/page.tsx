import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Woodlamp from "@/components/melasma/Woodlamp";
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
import { FIGMA_INTENT_PIGMENT } from "@/data/figma-home-images";
import {
  AANJAGERS,
  MELASMA_FAQ,
  MELASMA_WEL_NIET,
  MELASMA_WIJ_DOEN_NIET,
} from "@/data/melasma";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { zoekmachineVelden } from "@/lib/seo";
import {
  DIBA_PROOF_STRIP_ITEMS,
  DIBA_SITE_URL,
  DIBA_WHATSAPP_URL,
} from "@/lib/site";

/**
 * Melasma — negende eigen pagina.
 *
 * De kernvraag verschilt per pagina. Pigmentvlekken vragen wanneer in het jaar; melasma
 * vraagt hoe diep. Dat onderscheid is de reden dat dit een aparte pagina is en geen
 * paragraaf op de pigmentpagina: dezelfde behandeling geeft hier een ander en vaak
 * slechter resultaat.
 *
 * De tweede reden is de toon. Dit is de enige aandoening op de site waarbij harder werken
 * je verder van huis brengt, en waar wij dus een behandeling afraden die de klant graag
 * zou willen.
 *
 * Twee donkergroene vlakken, niet meer (§5). De woodlamp gebruikt kort een donker vlak
 * binnen zijn eigen tekening; dat is geen sectievlak maar het licht zelf.
 */

export const metadata: Metadata = zoekmachineVelden({
  pad: "/huidproblemen/melasma",
  titel: "Melasma behandelen in Rotterdam: eerst de diepte",
  omschrijving:
    "Bij melasma bepaalt de diepte van het pigment wat mogelijk is, en die zie je in gewoon licht niet. Waarom we altijd met een UV-scan beginnen.",
});

const PAD = "/huidproblemen/melasma";

const ANKERS = [
  { id: "diepte", label: "Hoe diep zit het" },
  { id: "kranen", label: "De drie kranen" },
  { id: "wel-niet", label: "Wat helpt" },
  { id: "nee", label: "Waar wij nee zeggen" },
  { id: "meten", label: "Hoe we meten" },
  { id: "vragen", label: "Vragen" },
] as const;

const KNOP_KLEUR: Record<string, string> = {
  Volledig: "text-[var(--g-700)]",
  Deels: "text-[var(--warn-text)]",
  Nauwelijks: "text-[var(--t-muted)]",
};

export default function MelasmaPage() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Huidproblemen", url: `${DIBA_SITE_URL}/huidproblemen` },
          { name: "Melasma", url: `${DIBA_SITE_URL}${PAD}` },
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
              <span className="text-[var(--t-muted)]">Melasma</span>
            </nav>

            <h1 className="diba-display-l mt-6">
              Melasma: vlekken
              <br />
              <span className="diba-accent">die steeds terugkomen</span>
            </h1>

            <p className="mt-6 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              Bij melasma bepaalt de diepte van het pigment wat er mogelijk is,
              en die zie je in gewoon licht niet. Twee vlekken die er identiek
              uitzien kunnen totaal anders reageren.
            </p>

            <p className="mt-4 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              Daarom begint het hier met kijken en niet met behandelen. Zit het
              diep, dan raden we het af, want dit is de enige aandoening waarbij
              harder werken je verder van huis brengt.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Button href="#diepte">Pak de lamp</Button>
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

      {/* ── De woodlamp: de uitblinker ─────────────────────────────────── */}
      <section
        id="diepte"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-050)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="De woodlamp"
            kop="Wat je in gewoon licht"
            accent="niet kunt zien."
            intro="Dit is het gereedschap waarmee een dermatoloog de diepte inschat. Onder ultraviolet licht springt pigment dat hoog zit eruit, en pigment dat dieper ligt juist niet. Sleep de lamp over de vlek en kijk wat er verandert."
          />
          <Woodlamp />
        </div>
      </section>

      {/* ── De drie kranen ─────────────────────────────────────────────── */}
      <section
        id="kranen"
        className="scroll-mt-[var(--anker-offset)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="De drie kranen"
            kop="Melasma heeft een kraan."
            accent="Die staat maar deels bij jou."
            intro="Een zonvlek zit er en blijft er. Melasma gaat open en dicht, en drie dingen bepalen hoe ver. Kijk naar de derde kolom: dat is het deel dat je zelf in de hand hebt."
          />

          <ul className="mt-12 grid gap-px overflow-hidden rounded-[var(--r-md)] bg-[var(--g-100)] md:grid-cols-3">
            {AANJAGERS.map((a) => (
              <li key={a.id} className="bg-white p-6 sm:p-8">
                <h3 className="diba-card-title">{a.naam}</h3>
                <p className="mt-4 text-[15px] leading-7 text-[var(--t-body)]">
                  {a.tekst.replace(/\[[^\]]+\]/g, "").trim()}
                </p>
                {/* Een div en geen p: Label rendert zelf een <p>, en een <p> in een <p>
                    is ongeldige HTML waar de browser de boom voor herschikt. Dat leverde
                    een hydratiefout op. */}
                <div className="mt-6 pt-4">
                  <Label>Zelf in de hand</Label>
                  <span
                    className={`diba-card-title mt-2 block ${KNOP_KLEUR[a.knop] ?? ""}`}
                  >
                    {a.knop}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-[var(--r-md)] bg-[var(--g-050)] p-6">
            <p className="max-w-[62ch] text-[15px] leading-7 text-[var(--t-body)]">
              Bescherming is bij melasma geen advies naast de behandeling maar
              een deel van de behandeling zelf. Zonder dat werkt de rest niet,
              en dat is de reden dat we er hier zo lang over doorgaan.
            </p>
            <Link
              href="/huidproblemen/pigmentvlekken"
              className="diba-label text-[var(--g-700)] underline underline-offset-4"
            >
              Zijn het toch gewone pigmentvlekken?
            </Link>
          </div>
        </div>
      </section>

      <WelNiet
        wel={MELASMA_WEL_NIET.wel}
        niet={MELASMA_WEL_NIET.niet}
        intro="Het eerste kruisje rechts is bij melasma de duurste fout die er is, en hij wordt gemaakt door klinieken en niet door klanten."
      />

      <WijZeggenNee
        kop="Hier brengt harder werken"
        accent="je verder van huis."
        intro="Bij elke andere aandoening op deze site geldt: meer vermogen, meer resultaat. Bij melasma niet. Een te stevige behandeling geeft hier vaak méér pigment, en dat is een bekend en pijnlijk patroon."
        punten={MELASMA_WIJ_DOEN_NIET}
      />

      <NulmetingAssen
        kop="Meten gaat hier over diepte."
        alineas={[
          "Bij gewone pigmentvlekken meten we hoe donker en hoe groot. Bij melasma is de eerste vraag hoe diep het zit, want dat bepaalt of de rest van de meting er nog toe doet.",
          "Daarnaast leggen we vast wat je aanjagers zijn. Melasma dat lichter wordt terwijl de kraan openstaat, is een resultaat dat niet blijft, en dat wil je vooraf weten.",
        ]}
        assen={[
          ["Diepte", "Hoog, gemengd of diep in de huid"],
          ["Intensiteit", "Hoe sterk het afsteekt tegen de huid eromheen"],
          ["Uitbreiding", "Welke gebieden meedoen en hoe groot ze zijn"],
        ]}
      />

      <PillarFaq items={MELASMA_FAQ} onderwerp="melasma" />

      <PillarCta
        kop="Plan een intake"
        accent="bij Diba Clinics"
        tekst="We schatten de diepte in en leggen je aanjagers vast. Zit het diep, dan hoor je dat en raden we behandelen af. Zit het hoog, dan weet je meteen wat er te halen valt en wat het vraagt."
        topic="melasma"
        whatsappHref={DIBA_WHATSAPP_URL}
      />
    </main>
  );
}
