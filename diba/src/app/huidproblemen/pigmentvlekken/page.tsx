import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import HetZonjaar from "@/components/pigment/HetZonjaar";
import PillarNav from "@/components/pillar/PillarNav";
import {
  HuidanalyseAssen,
  PillarCta,
  PillarFaq,
  SectieKop,
  WelNiet,
} from "@/components/pillar/PillarSecties";
import SoortKiezer, { type SoortOptie } from "@/components/pillar/SoortKiezer";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import ProofBar from "@/components/ui/ProofBar";
import { FIGMA_KENNISBANK_PIGMENT } from "@/data/figma-home-images";
import { PIGMENT_FAQ, PIGMENT_SOORTEN, PIGMENT_WEL_NIET } from "@/data/pigment";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { zoekmachineVelden } from "@/lib/seo";
import {
  DIBA_PROOF_STRIP_ITEMS,
  DIBA_SITE_URL,
  DIBA_WHATSAPP_URL,
} from "@/lib/site";

/**
 * Pigmentvlekken en melasma — eigen pagina met een eigen uitblinker.
 *
 * Waar de acnepagina "waar zit het" als kern heeft, draait deze om "wanneer". Bij pigment
 * bepaalt UV bijna alles, en het eerlijke advies is vaak "nu niet". Het zonjaar maakt dat
 * concreet: een kalender die je in juni vertelt dat je beter wacht. Dat is een sectie
 * waarin we onszelf omzet ontzeggen, en precies daarom hoort hij hier.
 *
 * De tweede eigen keuze is het onderscheid zonschade versus melasma bovenaan in plaats
 * van in de FAQ. Ze lijken op elkaar en vragen het tegenovergestelde, en bij melasma
 * hoort het woord dat de merkregels voorschrijven: beheersing, niet verdwijning (§10).
 *
 * Twee donkergroene vlakken, niet meer (§5). Geen italic accentwoorden.
 * COPY: concept; medische beweringen gemarkeerd voor Rojda. Staat op noindex.
 */

export const metadata: Metadata = zoekmachineVelden({
  pad: "/huidproblemen/pigmentvlekken",
  titel: "Pigmentvlekken behandelen in Rotterdam",
  omschrijving:
    "Pigmentvlekken behandelen met laser, IPL en peelings. Welke aanpak past, hangt af van het type vlek, je huidtype en het seizoen.",
});

const PAD = "/huidproblemen/pigmentvlekken";

const ANKERS = [
  { id: "wanneer", label: "Wanneer starten" },
  { id: "welke", label: "Welk pigment" },
  { id: "wel-niet", label: "Wat helpt" },
  { id: "meten", label: "Hoe we meten" },
  { id: "vragen", label: "Vragen" },
] as const;

const SOORTEN: readonly SoortOptie[] = PIGMENT_SOORTEN.map((s) => ({
  id: s.id,
  naam: s.naam,
  klanttaal: s.klanttaal,
  vakterm: s.vakterm,
  velden: [
    ["Het patroon", s.patroon],
    ["Waar het vandaan komt", s.oorzaak],
    ["Wat wij eerst doen", s.aanpak],
  ] as const,
  uitgelicht: { label: "Wat realistisch is", tekst: s.realistisch },
}));

export default function PigmentPage() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Huidproblemen", url: `${DIBA_SITE_URL}/huidproblemen` },
          { name: "Pigmentvlekken", url: `${DIBA_SITE_URL}${PAD}` },
        ])}
      />

      {/* ── Hero ───────────────────────────────────────────────────────────
          De kop zet meteen de omkering neer die deze pagina eigen maakt: bij
          pigment is timing belangrijker dan techniek. */}
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
              <span className="text-[var(--t-muted)]">Pigmentvlekken</span>
            </nav>

            <h1 className="diba-display-l mt-6">
              Pigmentvlekken
              <br />
              <span className="diba-accent">behandelen</span>
            </h1>

            <p className="mt-6 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              We behandelen pigmentvlekken met laser, IPL en peelings. Welke
              aanpak past, hangt af van het type vlek en van je huidtype. Dat
              stellen we tijdens de intake samen vast.
            </p>

            <p className="mt-4 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              Het seizoen telt mee. Met weinig zon houdt het resultaat beter
              stand, dus in het najaar en de winter zit je het beste.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Button href="#wanneer">Bekijk het zonjaar</Button>
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
              src={FIGMA_KENNISBANK_PIGMENT.src}
              alt={FIGMA_KENNISBANK_PIGMENT.alt}
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

      {/* ── Het zonjaar: de uitblinker ─────────────────────────────────── */}
      <section
        id="wanneer"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-050)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="Het zonjaar"
            kop="Het jaar bepaalt"
            accent="of het gaat werken."
            intro="De staafhoogte is de gemiddelde UV-index in Nederland. Klik op een maand en je ziet wat er dan met pigment gebeurt, en of wij je zouden aanraden om te starten. Deze maand staat al open."
          />
          <HetZonjaar />
        </div>
      </section>

      {/* ── Welk pigment ───────────────────────────────────────────────── */}
      <section
        id="welke"
        className="scroll-mt-[var(--anker-offset)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="Herkenning"
            kop="Drie soorten"
            accent="pigment"
            intro="Zonschade en melasma lijken op elkaar, maar vragen een andere behandeling. Welk type je hebt, stellen we vast voordat we beginnen. Kies het patroon dat het dichtst bij jou komt."
          />
          <SoortKiezer
            opties={SOORTEN}
            ctaHrefPatroon="/intake?topic=pigment&beeld={id}"
            ctaLabel="Laat dit patroon bekijken"
            hint="Weet je het niet zeker? Dan bepalen we het bij de meting."
          />
        </div>
      </section>

      {/* ── Het pigmentgeheugen: waarom bescherming de behandeling is ──── */}
      <section className="bg-[var(--g-025)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28">
        <div className="mx-auto grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-12">
          <div>
            <Label>Waarom het terugkomt</Label>
            <h2 className="diba-display-m mt-4 max-w-[20ch]">
              Waarom pigment terugkomt
            </h2>
            <p className="mt-6 max-w-[54ch] text-[16px] leading-7 text-[var(--t-body)]">
              Pigmentcellen die eenmaal ontregeld zijn, reageren de volgende
              keer sneller op zonlicht. Elke onbeschermde zomer telt daardoor op
              bij de vorige.
            </p>
            <p className="mt-4 max-w-[54ch] text-[16px] leading-7 text-[var(--t-body)]">
              Dagelijkse zonbescherming en het beperken van nieuwe zonbelasting
              zijn bij pigment minstens zo belangrijk als de behandeling in de
              kliniek.
            </p>
          </div>

          <ul className="grid gap-3">
            {[
              [
                "Zonder bescherming",
                "Elke zomer legt een laag op de vorige. Wat je in de winter wint, verlies je in juli.",
              ],
              [
                "Met bescherming",
                "Het pigment dat er is kan lichter worden, en er komt weinig nieuw bij.",
              ],
              [
                "Met bescherming én behandeling",
                "Hier zit de meeste winst. Begin wel met de bescherming, want zonder dat houdt het resultaat niet stand.",
              ],
            ].map(([kop, tekst], i) => (
              <li
                key={kop}
                className="flex gap-4 rounded-[var(--r-sm)] p-5"
                style={{
                  background: i === 2 ? "var(--g-075)" : "var(--g-050)",
                }}
              >
                <span
                  className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-[var(--r-pill)]"
                  style={{
                    background:
                      i === 0
                        ? "var(--warn)"
                        : i === 1
                          ? "var(--g-400)"
                          : "var(--g-700)",
                  }}
                  aria-hidden="true"
                />
                <span>
                  <strong className="block text-[15px] font-medium leading-6">
                    {kop}
                  </strong>
                  <span className="mt-1 block text-sm leading-6 text-[var(--t-body)]">
                    {tekst}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <WelNiet
        wel={PIGMENT_WEL_NIET.wel}
        niet={PIGMENT_WEL_NIET.niet}
        intro="Bij pigment gaat het vaak mis door te vroeg beginnen, niet door te weinig behandelen."
      />

      <HuidanalyseAssen
        kop="Deze kenmerken volgen we bij pigment"
        alineas={[
          "De EVE-M-meting legt vast hoe donker en hoe uitgebreid het pigment is voordat we beginnen. Bij pigment meten we per seizoen in plaats van per sessie, omdat het beeld met het jaar meebeweegt.",
          "Dat is ook de eerlijkste manier om te zien of het werkt. Pigment verandert langzaam, en je oog raakt eraan gewend.",
        ]}
        assen={[
          ["Pigment", "Hoe donker en hoe verspreid, objectief in kaart"],
          [
            "UV-belasting",
            "Wat de zon al heeft aangericht, ook wat je niet ziet",
          ],
          ["Textuur", "Of er naast kleur ook oneffenheid meespeelt"],
        ]}
      />

      <PillarFaq items={PIGMENT_FAQ} onderwerp="pigmentvlekken" />

      <PillarCta
        kop="Waarom het seizoen"
        accent="meetelt bij pigment"
        tekst="De huidanalyse kan het hele jaar door. Zo hebben we een vertrekpunt klaarliggen voor het moment dat het seizoen wél meewerkt."
        topic="pigment"
        whatsappHref={DIBA_WHATSAPP_URL}
      />
    </main>
  );
}
