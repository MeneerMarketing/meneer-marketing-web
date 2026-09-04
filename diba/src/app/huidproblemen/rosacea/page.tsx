import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PillarNav from "@/components/pillar/PillarNav";
import {
  HuidanalyseAssen,
  PillarCta,
  PillarFaq,
  SectieKop,
  WelNiet,
} from "@/components/pillar/PillarSecties";
import SoortKiezer, { type SoortOptie } from "@/components/pillar/SoortKiezer";
import Triggersorteerder from "@/components/rosacea/Triggersorteerder";
import Button from "@/components/ui/Button";
import ProofBar from "@/components/ui/ProofBar";
import { FIGMA_INTENT_PIGMENT } from "@/data/figma-home-images";
import { ROSACEA_FAQ, ROSACEA_SOORTEN, ROSACEA_WEL_NIET } from "@/data/rosacea";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { zoekmachineVelden } from "@/lib/seo";
import {
  DIBA_PROOF_STRIP_ITEMS,
  DIBA_SITE_URL,
  DIBA_WHATSAPP_URL,
} from "@/lib/site";

/**
 * Rosacea en couperose — eigen pagina met een eigen uitblinker.
 *
 * Drie pagina's, drie verschillende kernvragen. Acne: waar zit het. Pigment: wanneer.
 * Rosacea: wat zet het bij jou aan, en waar zit dan de hefboom. Dat laatste is de
 * triggersorteerder, en die bestaat omdat elke andere rosaceapagina een lijstje triggers
 * plakt zonder er iets mee te doen.
 *
 * De pagina begint met de zin die er moet staan: rosacea gaat niet weg. Dat is geen
 * slecht nieuws maar de start van een eerlijk gesprek, en het staat vooraan in plaats van
 * in de kleine lettertjes (A7).
 *
 * Tweede eigen keuze: rosacea wordt structureel als acne behandeld en daar wordt het
 * erger van. Het snelste onderscheid dat je zelf kunt maken — geen mee-eters — staat
 * daarom in de tekst en niet in een voetnoot.
 *
 * Twee donkergroene vlakken, niet meer (§5). Geen italic accentwoorden.
 * COPY: concept; medische beweringen gemarkeerd voor Rojda. Staat op noindex.
 */

export const metadata: Metadata = zoekmachineVelden({
  pad: "/huidproblemen/rosacea",
  titel: "Rosacea behandelen in Rotterdam",
  omschrijving:
    "Rosacea is te sturen: minder opvlammingen en een rustiger basiskleur. Welke triggers je zelf in de hand hebt en wat een behandeling kan toevoegen.",
});

const PAD = "/huidproblemen/rosacea";

const ANKERS = [
  { id: "triggers", label: "Wat zet het aan" },
  { id: "welke", label: "Welk beeld" },
  { id: "acne", label: "Rosacea of acne" },
  { id: "wel-niet", label: "Wat helpt" },
  { id: "meten", label: "Hoe we meten" },
  { id: "vragen", label: "Vragen" },
] as const;

const SOORTEN: readonly SoortOptie[] = ROSACEA_SOORTEN.map((s) => ({
  id: s.id,
  naam: s.naam,
  klanttaal: s.klanttaal,
  vakterm: s.vakterm,
  velden: [
    ["Wat je ziet", s.watJeZiet],
    ["Wat het betekent", s.watHetBetekent],
    ["Wat wij eerst doen", s.aanpak],
  ] as const,
  uitgelicht: {
    label: "Wat mensen hier vaak verkeerd hebben",
    tekst: s.verwarring,
  },
}));

/** Het onderscheid dat het vaakst misgaat, en dat je zelf kunt maken. */
const ACNE_OF_ROSACEA = [
  ["Mee-eters", "Bij acne wel, bij rosacea niet. Het snelste verschil."],
  ["Waar het zit", "Acne op kaaklijn en voorhoofd, rosacea in het midden."],
  ["Blozen", "Bij rosacea hoort opvlammen erbij, bij acne niet."],
  ["Wat scrubben doet", "Bij acne soms iets. Bij rosacea maakt het het erger."],
] as const;

export default function RosaceaPage() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Huidproblemen", url: `${DIBA_SITE_URL}/huidproblemen` },
          { name: "Rosacea en couperose", url: `${DIBA_SITE_URL}${PAD}` },
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
              <span className="text-[var(--t-muted)]">
                Rosacea en couperose
              </span>
            </nav>

            <h1 className="diba-display-l mt-6">
              Rosacea: een huid
              <br />
              <span className="diba-accent">die steeds opvlamt</span>
            </h1>

            <p className="mt-6 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              Rosacea is een chronische aandoening die je goed kunt sturen. Met
              behandeling en de juiste verzorging krijg je een rustiger
              basiskleur, minder opvlammingen en minder zichtbare adertjes.
            </p>

            {/* De andere kant van de kruisverwijzing. Zonder dit is de couperosepagina
                een doodlopende zijtak, en dan concurreren de twee wel met elkaar in
                plaats van elkaar aan te vullen. */}
            <p className="mt-4 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              Zie je vooral losse adertjes en geen opvlammingen? Dan gaat het
              waarschijnlijk om{" "}
              <Link
                href="/huidproblemen/couperose"
                className="text-[var(--g-700)] underline underline-offset-4"
              >
                couperose
              </Link>
              , en daar staat de drukproef waarmee je dat zelf nagaat.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Button href="#triggers">Sorteer jouw triggers</Button>
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
              alt="Behandelaar beoordeelt roodheid in de huid van een cliënt"
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

      {/* ── De triggersorteerder: de uitblinker ────────────────────────── */}
      <section
        id="triggers"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-050)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="De triggersorteerder"
            // Twee gelijke helften eronder, dus de introzin volgt die indeling.
            raster="gelijk"
            kop="Welke triggers"
            accent="je zelf kunt sturen"
            intro="Dat wijn je rood maakt wist je al. De vraag die telt is hoeveel van jouw triggers je kunt beïnvloeden en hoeveel niet, want die verhouding bepaalt of gewoontes of behandelen het meeste oplevert. Tik aan wat je herkent."
          />
          <Triggersorteerder />
        </div>
      </section>

      {/* ── Welk beeld ─────────────────────────────────────────────────── */}
      <section
        id="welke"
        className="scroll-mt-[var(--anker-offset)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="Herkenning"
            kop="Welke vorm van rosacea"
            accent="herken je?"
            intro="Rosacea kent stadia die om een andere aanpak vragen. Bij twee ervan is ons antwoord dat je bij de dermatoloog hoort. Dat staat er dan ook, want dat is sneller dan eerst een traject bij ons."
          />
          <SoortKiezer
            opties={SOORTEN}
            ctaHrefPatroon="/intake?topic=rosacea&beeld={id}"
            ctaLabel="Laat dit beeld bekijken"
            hint="Twijfel je tussen twee? Dan kijken we samen."
          />
        </div>
      </section>

      {/* ── Rosacea of acne ────────────────────────────────────────────── */}
      <section
        id="acne"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-025)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="Het verschil dat uitmaakt"
            kop="Rosacea of acne?"
            intro="Dit gaat het vaakst mis, en het is niet onschuldig: rosacea behandelen als acne maakt het erger. Vier verschillen die je zelf kunt nagaan."
          />

          <ul className="mt-12 grid gap-px overflow-hidden rounded-[var(--r-md)] bg-[var(--g-100)] sm:grid-cols-2 lg:grid-cols-4">
            {ACNE_OF_ROSACEA.map(([kop, tekst]) => (
              <li key={kop} className="bg-white p-6 sm:p-7">
                <h3 className="diba-card-title">{kop}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--t-body)]">
                  {tekst}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-[var(--r-md)] bg-white p-6">
            <p className="max-w-[62ch] text-[15px] leading-7 text-[var(--t-body)]">
              Denk je na het lezen hiervan dat je toch acne hebt? Dan hoor je op
              de andere pagina, en dat is geen omweg maar de kortste route.
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
        wel={ROSACEA_WEL_NIET.wel}
        niet={ROSACEA_WEL_NIET.niet}
        intro="Bij rosacea is het eerste punt links gratis en levert het vaak het meest op. Dat is niet het antwoord dat een kliniek hoort te geven, maar het is wel het juiste."
      />

      <HuidanalyseAssen
        kop="Bij rosacea telt roodheid."
        alineas={[
          "Roodheid is het soort ding waar je oog aan gewent raakt. Daarom meten we het: niet om je te overtuigen, maar zodat we het verschil kunnen zien op een dag dat jij vindt dat er niets veranderd is.",
          "We meten ook de zichtbare vaatjes afzonderlijk, want die reageren anders dan de basiskleur.",
        ]}
        assen={[
          ["Roodheid", "De basiskleur van je huid, los van een opvlamming"],
          ["Vaatjes", "Hoeveel er zichtbaar zijn en waar ze zitten"],
          ["Barrière", "Hoe prikkelbaar je huid op dit moment is"],
        ]}
      />

      <PillarFaq items={ROSACEA_FAQ} onderwerp="rosacea" />

      <PillarCta
        kop="Plan een intake"
        accent="bij Diba Clinics"
        tekst="Tijdens de intake meten we je roodheid, lopen we je triggers na en hoor je wat er in jouw geval realistisch is. Ook als dat betekent dat je bij de arts hoort."
        topic="rosacea"
        whatsappHref={DIBA_WHATSAPP_URL}
      />
    </main>
  );
}
