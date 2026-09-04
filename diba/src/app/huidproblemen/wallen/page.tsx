import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import BehandelingenBijProbleem from "@/components/pillar/BehandelingenBijProbleem";
import PillarNav from "@/components/pillar/PillarNav";
import {
  PillarCta,
  PillarFaq,
  SectieKop,
  WelNiet,
} from "@/components/pillar/PillarSecties";
import SoortKiezer, { type SoortOptie } from "@/components/pillar/SoortKiezer";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import ProofBar from "@/components/ui/ProofBar";
import {
  OCHTENDTEST,
  WAL_OORZAKEN,
  WALLEN_FAQ,
  WALLEN_WEL_NIET,
} from "@/data/wallen";
import { publicCopy } from "@/lib/copy-flags";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { zoekmachineVelden } from "@/lib/seo";
import {
  DIBA_PROOF_STRIP_ITEMS,
  DIBA_SITE_URL,
  DIBA_WHATSAPP_URL,
} from "@/lib/site";

/**
 * Wallen — de pagina die de meeste bezoekers doorstuurt.
 *
 * Waarom deze naast /huidproblemen/donkere-kringen staat, en waarom hij eerlijk moet zijn
 * over wat een huidkliniek hier niet kan, staat in `src/data/wallen.ts`.
 *
 * DE OCHTENDTEST IS DE UITBLINKER.
 *
 * Twee foto's, dezelfde plek, twaalf uur ertussen. Verandert het, dan is het vocht en valt
 * er iets te doen. Verandert het niet, dan is het vet of schaduw en ligt het antwoord
 * buiten deze kliniek. Dat is geen truc maar de enige test die het onderscheid maakt
 * zonder dat er iemand naar je kijkt.
 *
 * COPY: concept in de Diba-stem. Medische beweringen zijn gemarkeerd voor Rojda.
 */

export const metadata: Metadata = zoekmachineVelden({
  pad: "/huidproblemen/wallen",
  titel: "Wallen onder de ogen: vocht, vet of schaduw",
  omschrijving:
    "Wallen onder je ogen: waar ze vandaan komen en wat een huidbehandeling kan toevoegen bij vocht of een dunne huid.",
});

const PAD = "/huidproblemen/wallen";

const ANKERS = [
  { id: "test", label: "In het consult" },
  { id: "welke", label: "Vocht, vet of schaduw" },
  { id: "wel-niet", label: "Wat helpt" },
  { id: "vragen", label: "Vragen" },
] as const;

const SOORTEN: readonly SoortOptie[] = WAL_OORZAKEN.map((o) => ({
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
    label: o.binnenBereik ? "Hier zijn wij aan zet" : "Hier zijn wij het niet",
    tekst: o.binnenBereik
      ? "Van de drie oorzaken is dit de enige die met een huidbehandeling te beïnvloeden is, en de enige die van dag tot dag verandert."
      : "Een huidkliniek verandert hier niets aan. Wij zeggen dat liever nu dan na een reeks, ook als je hier kwam om iets te boeken.",
  },
}));

export default function WallenPage() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Huidproblemen", url: `${DIBA_SITE_URL}/huidproblemen` },
          { name: "Wallen", url: `${DIBA_SITE_URL}${PAD}` },
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
              <span className="text-[var(--t-muted)]">Wallen</span>
            </nav>

            <h1 className="diba-display-l mt-6">
              Wallen onder <span className="diba-accent">je ogen</span>
            </h1>

            <p className="mt-6 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              Wallen komen door vocht, een vetkussen of schaduw door een groef.
              Bij vocht en bij een dunne huid rond de ogen kunnen we iets doen,
              met gerichte verzorging en behandelingen die de huid steviger
              maken.
            </p>

            <p className="mt-4 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              Tijdens de intake stellen we vast waar het bij jou vandaan komt.
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

          <div className="relative min-h-[300px] overflow-hidden rounded-[var(--r-md)] bg-[var(--g-200)] lg:min-h-[460px]">
            <Image
              src="/images/shoot/beh-led-masker.jpg"
              alt="Client met LED-masker tijdens een rustige behandeling"
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

      {/* ── De ochtendtest ─────────────────────────────────────────────── */}
      <section
        id="test"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-050)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="In het consult"
            raster="gelijk"
            kop="Waar we"
            accent="naar kijken"
            intro="De huidtherapeut kijkt naar de stand van de huid onder je oog, naar het verloop over de dag en naar de dikte van de huid ter plaatse."
          />

          <ol className="mt-12 grid gap-5 lg:grid-cols-3">
            {OCHTENDTEST.map((stap) => (
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
        </div>
      </section>

      {/* ── Vocht, vet of schaduw ──────────────────────────────────────── */}
      <section
        id="welke"
        className="scroll-mt-[var(--anker-offset)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="Drie oorzaken"
            kop="Drie"
            accent="oorzaken"
            intro="Wallen komen door vocht, een vetkussen of schaduw door een groef. Welke van de drie het is, bepaalt wat een huidbehandeling kan toevoegen."
          />
          <SoortKiezer
            opties={SOORTEN}
            ctaHrefPatroon="/intake?topic=wallen&oorzaak={id}"
            ctaLabel="Laat dit bekijken"
            hint="Twijfel je tussen twee? Dan kijken we samen."
          />

          {/* Wallen en donkere kringen worden voortdurend door elkaar gehaald. Wie hier
              op de verkeerde pagina is beland moet dat kunnen zien en weg kunnen. */}
          <div className="mt-10 rounded-[var(--r-md)] bg-[var(--g-700)] p-7 text-[var(--on-dark)] sm:p-9">
            <Label opDonker>Gaat het bij jou om kleur?</Label>
            <p className="diba-card-title-lg mt-4 max-w-[34ch]">
              Dan zoek je geen wal maar een kring.
            </p>
            <p className="mt-4 max-w-[62ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
              Een wal is volume: er zit iets. Een donkere kring is kleur:
              pigment of vaatjes die doorschijnen. Ze komen vaak samen voor en
              vragen om verschillende dingen.
            </p>
            <div className="mt-7">
              <Button
                href="/huidproblemen/donkere-kringen"
                variant="primair-op-donker"
              >
                Naar donkere kringen
              </Button>
            </div>
          </div>
        </div>
      </section>

      <WelNiet
        wel={WALLEN_WEL_NIET.wel}
        niet={WALLEN_WEL_NIET.niet}
        intro="De huid onder je oog is de dunste van je lichaam. Dat bepaalt zowel wat er kan als hoe voorzichtig we werken."
      />

      {/* Welke behandelingen bij deze klacht horen, en op welk apparaat ze
          draaien. Leeg als er niets gekoppeld is; zie het component. */}
      <BehandelingenBijProbleem pad="/huidproblemen/wallen" />

      <PillarFaq items={WALLEN_FAQ} onderwerp="wallen" />

      <PillarCta
        kop="Plan een intake"
        accent="bij Diba Clinics"
        tekst="In het huidconsult stellen we vast of het vocht, vet of schaduw is. Bij twee van de drie is ons advies om ergens anders te beginnen, en dat hoor je dan meteen."
        topic="wallen"
        whatsappHref={DIBA_WHATSAPP_URL}
      />
    </main>
  );
}
