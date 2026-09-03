import type { Metadata } from "next";
import Link from "next/link";
import AbcdeCheck from "@/components/moedervlekken/AbcdeCheck";
import PillarNav from "@/components/pillar/PillarNav";
import {
  PillarFaq,
  SectieKop,
  WelNiet,
  WijZeggenNee,
} from "@/components/pillar/PillarSecties";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import ProofBar from "@/components/ui/ProofBar";
import {
  MOEDERVLEK_FAQ,
  MOEDERVLEK_VOORWAARDEN,
  MOEDERVLEK_WEL_NIET,
} from "@/data/moedervlekken";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { DIBA_PROOF_STRIP_ITEMS, DIBA_SITE_URL } from "@/lib/site";
import { zoekmachineVelden } from "@/lib/seo";

/**
 * Moedervlekken.
 *
 * WAT HIER STOND.
 *
 * De enige pagina zonder afspraakknop, met als kop "hiervoor moet je niet bij ons zijn".
 * Bewust zo gebouwd: geen PillarCta, geen link naar de intake, en een afsluiting die je
 * naar de huisarts stuurde. Yasin (3 september 2026): Diba behandelt dit gewoon.
 *
 * WAT ER NU STAAT.
 *
 * Een gewone behandelpagina, met één voorwaarde die blijft: verandert er iets aan het
 * plekje, dan kijkt eerst een arts. Dat is geen afbakening maar de reden dat een melanoom
 * op tijd gevonden wordt, en het is ook precies waarom de ABCDE-check hieronder blijft
 * staan. Die stond er om je weg te sturen; hij staat er nu om samen te kijken voordat er
 * iets weggehaald wordt, en dat is een betere plek voor hem.
 *
 * MEDISCH: alles op deze pagina moet langs Rojda voordat het online mag, inclusief de
 * criteria. Het protocol zelf staat er met opzet niet in — wie beoordeelt, met welk
 * instrument en wat er met weggehaald weefsel gebeurt is een [MEDISCHE-CHECK-ROJDA].
 */

export const metadata: Metadata = zoekmachineVelden({
  pad: "/huidproblemen/moedervlekken",
  titel: "Moedervlekken weghalen",
  omschrijving:
    "Een moedervlek die stoort kan weg. Wat er eerst gebeurt, waar we op letten en waarom een plekje dat verandert eerst langs een arts gaat.",
});

const PAD = "/huidproblemen/moedervlekken";

const ANKERS = [
  { id: "check", label: "De ABCDE-check" },
  { id: "wel-niet", label: "Wat helpt" },
  { id: "voorwaarden", label: "Wat er eerst gebeurt" },
  { id: "vragen", label: "Vragen" },
] as const;

export default function MoedervlekkenPage() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Huidproblemen", url: `${DIBA_SITE_URL}/huidproblemen` },
          { name: "Moedervlekken", url: `${DIBA_SITE_URL}${PAD}` },
        ])}
      />

      {/* ── Hero ──
          Geen beeld naast de kop. Op deze pagina zou een sfeerfoto van een behandeling
          precies het verkeerde suggereren, namelijk dat je hiermee bij ons terechtkunt. */}
      <section className="mx-auto px-5 sm:px-9 lg:px-[7.5vw]">
        <div className="grid gap-10 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
          <div>
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
              <span className="text-[var(--t-muted)]">Moedervlekken</span>
            </nav>

            <h1 className="diba-display-l mt-6">
              Een moedervlek die stoort
              <br />
              <span className="diba-accent">kan weg</span>
            </h1>

            <p className="mt-6 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              Zit hij in de weg bij het scheren, blijft hij haken achter je
              kraag of vind je hem gewoon lelijk: dat is een goede reden om hem
              weg te laten halen. We kijken er eerst samen naar, en dan hoor je
              wat er kan. [MEDISCHE-CHECK-ROJDA]
            </p>

            <p className="mt-4 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              E' + chr(0xe9) + 'n ding gaat altijd voor: verandert er iets aan
              een plekje, dan laat je het eerst door een arts beoordelen. Blijkt
              het goedaardig, dan halen we het daarna hier weg.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Button href="/intake">Plan een huidconsult</Button>
              <Button href="#check" variant="secundair">
                Eerst de ABCDE-check
              </Button>
            </div>
          </div>

          {/* Het enige donkergroene vlak van deze pagina, en het staat er niet om iets te
              verkopen maar om één zin te laten staan. */}
          <div className="flex flex-col justify-center rounded-[var(--r-lg)] bg-[var(--g-700)] p-8 text-[var(--on-dark)] sm:p-10">
            <Label opDonker>Het korte antwoord</Label>
            <p className="diba-card-title-lg mt-5">
              Verandert er iets aan een plekje? Dan kijkt daar eerst een arts
              naar, en pas daarna halen wij iets weg.
            </p>
            <p className="mt-5 text-[16px] leading-7 text-[var(--on-dark-body)]">
              Dat kost je ' + chr(0xe9) + 'en consult bij de huisarts. Wat weg
              is kan niet meer onderzocht worden, en dat is de enige stap in dit
              hele onderwerp die je later niet kunt inhalen.
            </p>
          </div>
        </div>
      </section>

      <ProofBar items={DIBA_PROOF_STRIP_ITEMS} />

      <PillarNav ankers={ANKERS} />

      {/* ── De ABCDE-check: de uitblinker ──────────────────────────────── */}
      <section
        id="check"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-050)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="De ABCDE-check"
            kop="Zes dingen"
            accent="om naar te kijken."
            intro="Vijf letters die dermatologen gebruiken, plus een zesde die op de meeste sites ontbreekt. Loop hem langs voordat je een afspraak maakt. Hij geeft geen uitslag en kan niets uitsluiten; hij helpt je bepalen of er eerst een arts naar moet kijken."
          />
          <AbcdeCheck />
        </div>
      </section>

      <WelNiet
        wel={MOEDERVLEK_WEL_NIET.wel}
        niet={MOEDERVLEK_WEL_NIET.niet}
        intro="Het eerste kruisje rechts is de enige op deze site die niet over geld gaat: iets laten weghalen dat verandert, betekent dat er niets meer te onderzoeken valt."
      />

      <WijZeggenNee
        kop="Wat er eerst gebeurt"
        accent="voordat er iets weggaat"
        intro="Op de andere pagina's staan hier de dingen die we niet doen. Hier staan de drie stappen die aan een behandeling voorafgaan, en de eerste is de enige op deze site die je later niet kunt inhalen."
        punten={MOEDERVLEK_VOORWAARDEN}
      />

      <PillarFaq items={MOEDERVLEK_FAQ} onderwerp="moedervlekken" />

      {/* ── Afsluiting ──

          Hier stond "Naar je huisarts. Daar houdt het bij ons op." — de enige afsluiting op
          de site zonder afspraakknop. Nu staat er wat er gebeurt als je komt, in de
          volgorde waarin het gebeurt. De huisarts is niet weg: hij staat in stap één, waar
          hij thuishoort. */}
      <section className="mx-5 mb-5 rounded-[var(--r-xl)] bg-[var(--g-700)] px-7 py-14 text-[var(--on-dark)] sm:mx-9 sm:px-12 lg:mx-[7.5vw] lg:px-16 lg:py-20">
        <div className="mx-auto lg:grid lg:grid-cols-[1.1fr_.9fr] lg:gap-16">
          <div>
            <Label opDonker>Hoe het gaat</Label>
            <h2 className="diba-display-m mt-4 max-w-[18ch]">
              Eerst kijken,{" "}
              <span className="diba-accent-on-dark">dan pas weghalen</span>
            </h2>
            <p className="mt-6 max-w-[52ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
              Kom je voor iets anders en zit er een moedervlek in het gebied,
              dan dekken we die af en gaan we verder. Kom je voor de moedervlek
              zelf, dan begint het met kijken.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/intake"
                className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--on-dark-btn)] px-6 text-[var(--on-dark-btn-text)] transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--on-dark-accent)]"
              >
                Plan een huidconsult
              </Link>
              <Link
                href="/huidproblemen/pigmentvlekken"
                className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] border border-white/25 px-6 text-[var(--on-dark)] transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--on-dark-accent)]"
              >
                Ik zoek pigmentvlekken
              </Link>
            </div>
          </div>

          <ol className="mt-12 space-y-6 border-t border-white/15 pt-8 lg:mt-0 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
            {[
              [
                "Verandert het?",
                "Dan eerst je huisarts. Die kan weefsel laten onderzoeken en wij niet.",
              ],
              [
                "Verandert het niet?",
                "Dan kijken we er samen naar en hoor je wat er kan en wat het kost.",
              ],
              [
                "Weghalen",
                "Een korte handeling per plekje. Daarna een korstje dat vanzelf loslaat.",
              ],
            ].map(([kop, uitleg]) => (
              <li key={kop}>
                <h3 className="diba-label text-[var(--on-dark-accent)]">
                  {kop}
                </h3>
                <p className="mt-2 max-w-[38ch] text-[15px] leading-7 text-[var(--on-dark-body)]">
                  {uitleg}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
