import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PillarNav from "@/components/pillar/PillarNav";
import {
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
import {
  KP_BEELDEN,
  KP_FAQ,
  KP_WEL_NIET,
  KP_WIJ_DOEN_NIET,
  SCHUURTEST_STAPPEN,
} from "@/data/keratosis-pilaris";
import { publicCopy } from "@/lib/copy-flags";
import { NOG_IN_AANBOUW } from "@/lib/pagina-af";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import {
  DIBA_PROOF_STRIP_ITEMS,
  DIBA_SITE_URL,
  DIBA_WHATSAPP_URL,
} from "@/lib/site";

/**
 * Keratosis pilaris — de pagina die zegt dat er geen genezing is, en waarom dat toch de moeite waard is om te lezen.
 *
 * De achtergrond bij de inhoud staat in `src/data/keratosis-pilaris.ts`.
 *
 * COPY: concept in de Diba-stem. Medische beweringen zijn gemarkeerd voor Rojda.
 */

export const metadata: Metadata = {
  title: "Keratosis pilaris en kippenvelhuid in Rotterdam",
  description:
    "Ruwe bultjes op je bovenarmen die niet weggaan. Niet te genezen, wel te verzachten, en scrubben maakt het juist erger.",
  ...NOG_IN_AANBOUW,
};

const PAD = "/huidproblemen/keratosis-pilaris";

const ANKERS = [
  { id: "check", label: "De schuurpapiertest" },
  { id: "welke", label: "Wat heb je" },
  { id: "wel-niet", label: "Wat helpt" },
  { id: "nee", label: "Waar wij nee zeggen" },
  { id: "vragen", label: "Vragen" },
] as const;

const SOORTEN: readonly SoortOptie[] = KP_BEELDEN.map((o) => ({
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
    label: o.binnenBereik ? "Dit verzachten wij" : "Dit is iets anders",
    tekst: o.binnenBereik
      ? "Verhoorning rond de haarzakjes. Niet te genezen, wel soepeler en minder rood te maken, met onderhoud dat erbij hoort."
      : "Geen keratosis pilaris maar droogte of ingegroeide haren. Allebei vragen ze om iets eenvoudigers of om een andere pagina.",
  },
}));

export default function Pagina() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Huidproblemen", url: `${DIBA_SITE_URL}/huidproblemen` },
          { name: "Keratosis pilaris", url: `${DIBA_SITE_URL}${PAD}` },
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
              <span className="text-[var(--t-muted)]">Keratosis pilaris</span>
            </nav>

            <h1 className="diba-display-l mt-6">
              Niet te genezen.
              <br />
              <span className="diba-accent">Wel te verzachten.</span>
            </h1>

            <p className="mt-6 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              Kippenvelhuid, of keratosis pilaris, is grotendeels erfelijk,
              onschuldig, en bij veel mensen wordt het met de jaren vanzelf
              minder. Dat is geen mooi verkoopverhaal en het is wel het
              eerlijke.
            </p>

            <p className="mt-4 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              En de meest gemaakte vergissing staat er meteen bij: schuren helpt
              niet. De propjes zitten rond het haarzakje en niet aan de
              oppervlakte.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Button href="#check">Doe de schuurpapiertest</Button>
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
              src="/images/shoot/beh-lichaam.jpg"
              alt="Lichaamsbehandeling in de behandelkamer"
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

      <section
        id="check"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-050)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="De schuurpapiertest"
            raster="gelijk"
            kop="Losse bultjes,"
            accent="of alleen ruw?"
            intro="Dat is het verschil tussen verhoorning en een droge huid, en het bepaalt of hier iets te behandelen valt of dat je een tube nodig hebt en geen afspraak."
          />

          <ol className="mt-12 grid gap-5 lg:grid-cols-3">
            {SCHUURTEST_STAPPEN.map((stap, i) => (
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
        </div>
      </section>

      <section
        id="welke"
        className="scroll-mt-[var(--anker-offset)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="Vier beelden"
            kop="Ruw voelt allemaal hetzelfde,"
            accent="en dat is het niet."
            intro="Verhoorning, droogte en ingegroeide haren voelen onder je hand vrijwel gelijk. Waar het zit en of het aan twee kanten symmetrisch is, zegt meer dan hoe het aanvoelt."
          />
          <SoortKiezer
            opties={SOORTEN}
            ctaHrefPatroon="/intake?topic=keratosis-pilaris&beeld={id}"
            ctaLabel="Laat dit bekijken"
            hint="Twijfel je tussen twee? Dan kijken we samen."
          />

          {/* Het doorverwijsblok hoort hier en niet onderaan: wie na de beelden doorheeft
              dat hij op de verkeerde pagina is, moet weg kunnen zonder eerst de rest te
              lezen die dan niet over hem gaat. */}
          <div className="mt-10 rounded-[var(--r-md)] bg-[var(--g-700)] p-7 text-[var(--on-dark)] sm:p-9">
            <Label opDonker>Zitten er haren in de bultjes?</Label>
            <p className="diba-card-title-lg mt-4 max-w-[36ch]">
              Dan is dit niet je pagina.
            </p>
            <p className="mt-4 max-w-[62ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
              Bultjes op geschoren zones met een donkere krul eronder zijn
              ingegroeide haren. Dat is een ander mechanisme en een andere
              behandeling.
            </p>
            <div className="mt-7">
              <Button
                href="/huidproblemen/ingegroeide-haren"
                variant="primair-op-donker"
              >
                Naar ingegroeide haren
              </Button>
            </div>
          </div>
        </div>
      </section>

      <WelNiet
        wel={KP_WEL_NIET.wel}
        niet={KP_WEL_NIET.niet}
        intro="Hier hoort onderhoud bij en geen kuur met een eindpunt. Dat is minder aantrekkelijk om te horen en het is wel hoe het werkt."
      />

      <WijZeggenNee
        kop="Twee keer nee,"
        accent="en allebei gaan ze over verwachtingen."
        intro="Er valt een reeks van zes te verkopen aan iemand die op gladde armen hoopt. Dat is hoop verkopen en een teleurstelling leveren, en daar beginnen we niet aan."
        punten={KP_WIJ_DOEN_NIET}
      />

      <PillarFaq items={KP_FAQ} />

      <PillarCta
        kop="Eerst weten wat het is."
        accent="Dat scheelt al veel."
        tekst="Voor de meeste mensen is de nuttigste uitkomst dat het een naam heeft, onschuldig is en niet aan hen ligt. Wat er daarnaast te verzachten valt, bespreken we in hetzelfde gesprek."
        topic="keratosis-pilaris"
        whatsappHref={DIBA_WHATSAPP_URL}
      />
    </main>
  );
}
