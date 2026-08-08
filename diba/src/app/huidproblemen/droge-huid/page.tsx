import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Huidmatrix from "@/components/droge-huid/Huidmatrix";
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
import ProofBar from "@/components/ui/ProofBar";
import {
  DROGE_HUID_FAQ,
  DROGE_HUID_WEL_NIET,
  DROGE_HUID_WIJ_DOEN_NIET,
  VERWARRINGEN,
} from "@/data/droge-huid";
import { FIGMA_INTENT_VEROUDERING } from "@/data/figma-home-images";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import {
  DIBA_PROOF_STRIP_ITEMS,
  DIBA_SITE_URL,
  DIBA_WHATSAPP_URL,
} from "@/lib/site";

/**
 * Droge huid — tiende eigen pagina.
 *
 * De kernvraag hier is of je wel weet waar je zit. Droog gaat over vet, uitgedroogd over
 * water, en het zijn twee losse assen en geen schaal. Dat wordt overal als één lijn
 * gepresenteerd, en dat is de reden dat mensen jarenlang het verkeerde product kopen.
 *
 * Daarom is de interactie een vlak en geen schuifbalk: de vorm van de bediening is hier
 * het argument. Een schuifbalk zou de fout bevestigen die de pagina wil rechtzetten.
 *
 * Twee donkergroene vlakken, niet meer (§5).
 */

export const metadata: Metadata = {
  title: "Droge huid of uitgedroogde huid: wat is het verschil?",
};

const PAD = "/huidproblemen/droge-huid";

const ANKERS = [
  { id: "matrix", label: "Waar zit jij" },
  { id: "verwarring", label: "Wat mensen verwarren" },
  { id: "wel-niet", label: "Wat helpt" },
  { id: "nee", label: "Waar wij nee zeggen" },
  { id: "meten", label: "Hoe we meten" },
  { id: "vragen", label: "Vragen" },
] as const;

export default function DrogeHuidPage() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Huidproblemen", url: `${DIBA_SITE_URL}/huidproblemen` },
          { name: "Droge huid", url: `${DIBA_SITE_URL}${PAD}` },
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
              <span className="text-[var(--t-muted)]">Droge huid</span>
            </nav>

            <h1 className="diba-display-l mt-6">
              Geen schaal.
              <br />
              <span className="diba-accent">Twee assen.</span>
            </h1>

            <p className="mt-6 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              Droog gaat over vet. Uitgedroogd gaat over water. Overal wordt dat
              als één lijn getekend, van vet naar droog, en dat klopt niet. Je
              kunt een vette huid hebben die uitgedroogd is.
            </p>

            <p className="mt-4 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              Precies daar gaat het mis. Wie in het verkeerde vak zit, koopt
              jarenlang producten die het andere probleem oplossen. Zet jezelf
              hieronder eens neer.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Button href="#matrix">Zet jezelf in de matrix</Button>
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
              src={FIGMA_INTENT_VEROUDERING.src}
              alt={FIGMA_INTENT_VEROUDERING.alt}
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

      {/* ── De huidmatrix: de uitblinker ───────────────────────────────── */}
      <section
        id="matrix"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-050)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="De huidmatrix"
            kop="Zet jezelf neer"
            accent="in het vlak."
            intro="Naar links en rechts gaat over vet, naar boven en beneden over water. Sleep het punt naar waar jij denkt te zitten en kijk wat er dan zou moeten gebeuren. Merk op dat de twee richtingen los van elkaar bewegen."
          />
          <Huidmatrix />
        </div>
      </section>

      {/* ── Wat mensen verwarren ──────────────────────────────────────── */}
      <section
        id="verwarring"
        className="scroll-mt-[var(--anker-offset)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="Drie misverstanden"
            kop="Dit horen we"
            accent="het vaakst."
            intro="Alle drie komen ze voort uit dezelfde denkfout: dat er één schaal is. Met twee assen in je hoofd vallen ze meteen op hun plek."
          />

          <ul className="mt-12 grid gap-px overflow-hidden rounded-[var(--r-md)] bg-[var(--g-100)] md:grid-cols-3">
            {VERWARRINGEN.map((v) => (
              <li key={v.vraag} className="bg-white p-6 sm:p-8">
                <h3 className="diba-card-title">{v.vraag}</h3>
                <p className="mt-4 text-[15px] leading-7 text-[var(--t-body)]">
                  {v.antwoord}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-[var(--r-md)] bg-[var(--g-050)] p-6">
            <p className="max-w-[62ch] text-[15px] leading-7 text-[var(--t-body)]">
              Verdraagt je huid steeds minder producten en wordt hij snel rood?
              Dan is een droge huid vaak het gevolg en niet de oorzaak, en
              begint het verhaal ergens anders.
            </p>
            <Link
              href="/huidproblemen/gevoelige-huid"
              className="diba-label text-[var(--g-700)] underline underline-offset-4"
            >
              Naar de gevoelige huid
            </Link>
          </div>
        </div>
      </section>

      <WelNiet
        wel={DROGE_HUID_WEL_NIET.wel}
        niet={DROGE_HUID_WEL_NIET.niet}
        intro="Het eerste kruisje rechts is de reflex die de meeste schade aanricht: meer erbij doen omdat het niet beter wordt."
      />

      <WijZeggenNee
        kop="Weglaten is hier"
        accent="vaker de behandeling."
        intro="Bij een droge huid is de winst meestal te halen door dingen te schrappen, en daar valt voor ons weinig aan te verdienen. Dat is precies waarom je het van ons hoort."
        punten={DROGE_HUID_WIJ_DOEN_NIET}
      />

      <NulmetingAssen
        kop="Twee assen, dus twee metingen."
        alineas={[
          "Je huid voelt de ene dag anders dan de andere, en daarom is een gevoel geen goed beginpunt. We meten daarom allebei de assen los van elkaar in plaats van te vragen of je huid droog aanvoelt.",
          "Dat maakt ook zichtbaar welke as beweegt zodra je iets verandert. Meestal is dat de wateras binnen enkele weken, en dat vertelt je meteen waar je zat.",
        ]}
        assen={[
          ["Vet", "Hoeveel de huid zelf aanmaakt"],
          ["Water", "Hoeveel vocht er in de bovenste laag zit"],
          ["Lekkage", "Hoe snel dat vocht weer verdwijnt"],
        ]}
      />

      <PillarFaq items={DROGE_HUID_FAQ} />

      <PillarCta
        kop="Eerst weten"
        accent="in welk vak je zit."
        tekst="We meten vet en water apart, en vertellen je welke as bij jou beweegt. Zit je in balans, dan is ons advies om niets te doen en houdt het daar op."
        topic="droge-huid"
        whatsappHref={DIBA_WHATSAPP_URL}
      />
    </main>
  );
}
