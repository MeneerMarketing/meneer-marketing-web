import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Littekenklok from "@/components/littekens/Littekenklok";
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
import ProofBar from "@/components/ui/ProofBar";
import { FIGMA_INTENT_LITTEKENS } from "@/data/figma-home-images";
import {
  LITTEKEN_FAQ,
  LITTEKEN_SOORTEN,
  LITTEKEN_WEL_NIET,
  LITTEKEN_WIJ_DOEN_NIET,
} from "@/data/littekens";
import { NOG_IN_AANBOUW } from "@/lib/pagina-af";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { DIBA_PROOF_STRIP_ITEMS, DIBA_SITE_URL, DIBA_WHATSAPP_URL } from "@/lib/site";

/**
 * Littekens en striae — eigen pagina met een eigen uitblinker.
 *
 * Vier pagina's, vier kernvragen. Acne: waar. Pigment: wanneer in het jaar. Rosacea: wat
 * zet het aan. Hier: hoe oud is het. Dat is bij littekens namelijk de as die de uitkomst
 * bepaalt, meer dan welke techniek dan ook.
 *
 * De littekenklok wordt eerlijker naarmate je verder schuift, en raadt bij de laatste
 * stand behandelen af. Dat is dezelfde beweging als het zonjaar: een sectie waarin we
 * onszelf omzet ontzeggen omdat het alternatief liegen is (A7).
 *
 * Deze pagina hangt bewust aan de acnepagina vast (§15: probleem naar behandeling naar
 * bewijs). "Eerst rust, dan littekens" staat daar; hier staat de andere kant van dat
 * gesprek, inclusief de link terug.
 *
 * Twee donkergroene vlakken, niet meer (§5). Geen italic accentwoorden.
 * COPY: concept; medische beweringen gemarkeerd voor Rojda. Staat op noindex.
 */

export const metadata: Metadata = {
  title: "Littekens en striae behandelen in Rotterdam",
  ...NOG_IN_AANBOUW,
};

const PAD = "/huidproblemen/littekens";

const ANKERS = [
  { id: "hoe-oud", label: "Hoe oud is het" },
  { id: "welke", label: "Welk type" },
  { id: "volgorde", label: "De volgorde" },
  { id: "wel-niet", label: "Wat helpt" },
  { id: "nee", label: "Waar wij nee zeggen" },
  { id: "meten", label: "Hoe we meten" },
  { id: "vragen", label: "Vragen" },
] as const;

const SOORTEN: readonly SoortOptie[] = LITTEKEN_SOORTEN.map((s) => ({
  id: s.id,
  naam: s.naam,
  klanttaal: s.klanttaal,
  vakterm: s.vakterm,
  velden: [
    ["Wat je ziet", s.watJeZiet],
    ["Wat het betekent", s.watHetBetekent],
    ["Wat wij eerst doen", s.aanpak],
  ] as const,
  uitgelicht: { label: "Wat mensen hier vaak verkeerd hebben", tekst: s.verwarring },
}));

/** De volgorde die bijna altijd wordt omgedraaid, met de reden erbij. */
const VOLGORDE = [
  {
    stap: "Eerst rustig",
    tekst:
      "Zolang er nog actieve acne of ontsteking is, maak je er littekens bij in plaats van weg. Dit is de stap die mensen willen overslaan.",
  },
  {
    stap: "Dan meten",
    tekst:
      "We leggen vast hoe diep en hoe uitgebreid het is. Littekens veranderen traag, dus zonder meting is later niet te zien of het werkte.",
  },
  {
    stap: "Dan behandelen",
    tekst:
      "Gericht, met een afgesproken aantal sessies en een moment waarop we opnieuw kijken. Werkt het niet, dan stoppen we.",
  },
  {
    stap: "En dan beschermen",
    tekst:
      "Een behandeld litteken is tijdelijk gevoeliger voor zon. Zonder bescherming ruil je een litteken in voor een vlek.",
  },
] as const;

export default function LittekensPage() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Huidproblemen", url: `${DIBA_SITE_URL}/huidproblemen` },
          { name: "Littekens en striae", url: `${DIBA_SITE_URL}${PAD}` },
        ])}
      />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1800px] px-5 sm:px-9 lg:px-[7.5vw]">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="py-14 lg:py-20">
            <nav aria-label="Kruimelpad" className="diba-label flex flex-wrap gap-2">
              <Link href="/" className="hover:text-[var(--g-700)]">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <Link href="/huidproblemen" className="hover:text-[var(--g-700)]">
                Huidproblemen
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-[var(--t-muted)]">Littekens en striae</span>
            </nav>

            <h1 className="diba-display-l mt-6">
              Rood reageert.
              <br />
              <span className="diba-accent">Wit veel minder.</span>
            </h1>

            <p className="mt-6 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              De leeftijd van een litteken bepaalt de uitkomst meer dan de techniek. Dat
              geldt net zo goed voor striae. Daarom begint deze pagina met de vraag hoe
              lang je het al hebt.
            </p>

            <p className="mt-4 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              Bij oude, witte littekens is ons antwoord vaak dat het niet genoeg oplevert.
              Liever nu dan na vier sessies.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Button href="#hoe-oud">Zet de littekenklok</Button>
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
              src={FIGMA_INTENT_LITTEKENS.src}
              alt={FIGMA_INTENT_LITTEKENS.alt}
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

      {/* ── De littekenklok: de uitblinker ─────────────────────────────── */}
      <section
        id="hoe-oud"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-050)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto max-w-[1800px]">
          <SectieKop
            label="De littekenklok"
            kop="Hoe oud het is,"
            accent="bepaalt wat er kan."
            intro="Schuif naar hoe lang je het al hebt. De kleur in de tekening verandert mee, en het antwoord wordt eerlijker naarmate je verder komt. Littekens en striae volgen dezelfde as."
          />
          <Littekenklok />
        </div>
      </section>

      {/* ── Welk type ──────────────────────────────────────────────────── */}
      <section id="welke" className="scroll-mt-[var(--anker-offset)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28">
        <div className="mx-auto max-w-[1800px]">
          <SectieKop
            label="Herkenning"
            kop="Vier beelden,"
            accent="en niet allemaal bij ons."
            intro="Kuiltjes reageren het beste. Verheven littekens en keloïd horen bij de arts. En bij striae is de kleur belangrijker dan de plek. Kies wat het dichtst bij jou komt."
          />
          <SoortKiezer
            opties={SOORTEN}
            ctaHrefPatroon="/intake?topic=littekens&beeld={id}"
            ctaLabel="Laat dit beeld bekijken"
            hint="Twijfel je? Dan kijken we er samen naar."
          />
        </div>
      </section>

      {/* ── De volgorde ────────────────────────────────────────────────── */}
      <section
        id="volgorde"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-025)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto max-w-[1800px]">
          <SectieKop
            label="De volgorde"
            kop="De stap die iedereen"
            accent="wil overslaan."
            intro="Bijna niemand komt hier voor stap één. Toch bepaalt die of de rest zin heeft, want littekens behandelen in een ontstoken huid levert nieuwe littekens op."
          />

          <ol className="mt-12 grid gap-px overflow-hidden rounded-[var(--r-md)] bg-[var(--g-100)] sm:grid-cols-2 lg:grid-cols-4">
            {VOLGORDE.map((v) => (
              <li key={v.stap} className="bg-white p-6 sm:p-7">
                <h3 className="diba-card-title">{v.stap}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--t-body)]">{v.tekst}</p>
              </li>
            ))}
          </ol>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-[var(--r-md)] bg-white p-6">
            <p className="max-w-[62ch] text-[15px] leading-7 text-[var(--t-body)]">
              Heb je nog actieve acne? Dan hoort stap één op de acnepagina, en pas daarna
              hier. Dat is geen omweg maar de kortste route naar minder littekens.
            </p>
            <Link
              href="/huidproblemen/acne"
              className="diba-label text-[var(--g-700)] underline underline-offset-4"
            >
              Naar de acnepagina
            </Link>
          </div>
        </div>
      </section>

      <WelNiet
        wel={LITTEKEN_WEL_NIET.wel}
        niet={LITTEKEN_WEL_NIET.niet}
        intro="Het eerste kruisje rechts is de duurste fout van deze pagina, en hij kost niets om te vermijden: wachten tot het wit is."
      />

      <WijZeggenNee
        kop="Te vroeg is net zo"
        accent="verkeerd als te laat."
        intro="Bij een vers litteken behandelen we niet, en bij witte striae beloven we niets. Allebei die momenten voelen als een gemiste kans, en allebei zijn ze de reden dat je hier later niet teleurgesteld staat."
        punten={LITTEKEN_WIJ_DOEN_NIET}
      />

      <NulmetingAssen
        kop="Bij littekens telt diepte."
        alineas={[
          "Littekens veranderen in maanden, niet in weken, en je oog went eraan. De meting legt vast hoe diep en hoe uitgebreid het is, zodat het verschil later niet iets is dat je moet geloven.",
          "Bij striae meten we ook de kleur, want die vertelt in welke fase ze zitten en dus wat er nog mogelijk is.",
        ]}
        assen={[
          ["Textuur", "Hoe diep de kuiltjes zijn en hoe uitgebreid"],
          ["Kleur", "Rood, roze of wit: dat bepaalt de fase"],
          ["Oppervlak", "Hoe groot het gebied is dat we behandelen"],
        ]}
      />

      <PillarFaq items={LITTEKEN_FAQ} />

      <PillarCta
        kop="Kom liever te vroeg."
        accent="Dan te laat."
        tekst="Bij een rood litteken of rode striae is dit het moment waarop het het meeste uitmaakt. Bij oude littekens rekenen we eerlijk voor of het genoeg oplevert."
        topic="littekens"
        whatsappHref={DIBA_WHATSAPP_URL}
      />
    </main>
  );
}
