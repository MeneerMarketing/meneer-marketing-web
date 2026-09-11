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
import {
  OCHTENDTEST,
  WAL_OORZAKEN,
  WALLEN_FAQ,
  WALLEN_WEL_NIET,
} from "@/data/wallen";
import { publicCopy, zonderVlaggen } from "@/lib/copy-flags";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { zoekmachineVelden } from "@/lib/seo";
import { DIBA_SITE_URL, DIBA_WHATSAPP_URL } from "@/lib/site";

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
  /* Per beeld in de data, sinds xanthelasma erbij staat: dat is geen wal en valt buiten
     "de enige van de drie". */
  uitgelicht: o.uitgelicht,
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

      {/* Donkergroen, zoals elke andere hoofdingang van de site (Yasin, 11 september
          2026). */}
      <section className="bg-[var(--g-700)] text-[var(--on-dark)]">
        {/* Op een telefoon plakte het beeld tegen de onderrand van het groene vlak: de
            tekstkolom bracht zijn eigen onderruimte mee, de beeldkolom niet (Yasin, 11
            september 2026). Vanaf 1024 staan ze naast elkaar en geldt het niet. */}
        <div className="mx-auto grid gap-6 px-5 pb-10 sm:px-9 sm:pb-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-10 lg:px-[7.5vw] lg:pb-0">
          <div className="py-10 sm:py-14 lg:py-20 max-lg:pb-0">
            <nav
              aria-label="Kruimelpad"
              className="diba-label diba-label-on-dark flex flex-wrap gap-2"
            >
              <Link href="/" className="hover:text-white">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <Link href="/huidproblemen" className="hover:text-white">
                Huidproblemen
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-[var(--on-dark-body)]">Wallen</span>
            </nav>

            <h1 className="diba-display-l mt-6 text-[var(--on-dark)]">
              Wallen onder <span className="diba-accent-on-dark">je ogen</span>
            </h1>

            <p className="mt-6 max-w-[48ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
              Wallen komen door vocht, een vetkussen of schaduw door een groef.
              Bij vocht en bij een dunne huid rond de ogen kunnen we iets doen,
              met gerichte verzorging en behandelingen die de huid steviger
              maken.
            </p>

            <p className="mt-4 max-w-[48ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
              Tijdens de intake stellen we vast waar het bij jou vandaan komt.
            </p>

            <div className="diba-knoprij mt-9">
              <Button
                variant="primair-op-donker"
                href="/intake"
                kort="Plan consult"
              >
                Plan een huidconsult
              </Button>
              <Button
                href={DIBA_WHATSAPP_URL}
                variant="secundair-op-donker"
                target="_blank"
                rel="noopener noreferrer"
                kort="Stel een vraag"
              >
                Liever eerst een vraag stellen
              </Button>
            </div>
          </div>

          <div className="relative min-h-[220px] overflow-hidden rounded-[var(--r-md)] bg-[var(--g-200)] sm:min-h-[300px] lg:min-h-[460px]">
            <Image
              /* Rojda, 7 september 2026: "deze voor wallen", de RRS Eyes-opname die ook
                 op Instagram staat. */
              src="/images/shoot/beh-rrs-eyes-close.jpg"
              alt="RRS Eyes: injectie met een fijne naald onder het oog"
              fill
              priority
              sizes="(min-width: 1024px) 44vw, 100vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>

      <PillarNav ankers={ANKERS} />

      {/* ── De ochtendtest ─────────────────────────────────────────────── */}
      <section
        id="test"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-050)] px-5 py-12 sm:py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="In het consult"
            raster="gelijk"
            kop="Waar we"
            accent="naar kijken"
            intro="De huidtherapeut kijkt naar de stand van de huid onder je oog, naar het verloop over de dag en naar de dikte van de huid ter plaatse."
          />

          <ol className="mt-8 sm:mt-12 grid gap-5 lg:grid-cols-3">
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

      {/* ── Vocht, vet of schaduw, en de gele plek die geen wal is ──────────
          Griss, 9 september 2026: xanthelasma erbij, want mensen vragen er geregeld
          naar. Het is geen oorzaak van wallen, dus de kop zegt dat ook. */}
      <section
        id="welke"
        className="scroll-mt-[var(--anker-offset)] px-5 py-12 sm:py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="Vocht, vet, schaduw"
            kop="Wat er onder"
            accent="je ogen zit"
            intro="Wallen komen door vocht, een vetkussen of schaduw door een groef. Welke van de drie het is, bepaalt wat een huidbehandeling kan toevoegen. En soms is het geen wal maar een gele plek op het ooglid."
          />
          <SoortKiezer
            opties={zonderVlaggen(SOORTEN)}
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
