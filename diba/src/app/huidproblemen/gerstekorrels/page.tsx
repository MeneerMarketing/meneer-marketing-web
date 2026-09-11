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
import { publicCopy, zonderVlaggen } from "@/lib/copy-flags";
import {
  BOLLETJE_BEELDEN,
  GERSTEKORRELS_FAQ,
  GERSTEKORRELS_WEL_NIET,
  AFSPRAAK_STAPPEN,
} from "@/data/gerstekorrels";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { zoekmachineVelden } from "@/lib/seo";
import { DIBA_SITE_URL, DIBA_WHATSAPP_URL } from "@/lib/site";
import LeesVerder from "@/components/ui/LeesVerder";

export const metadata: Metadata = zoekmachineVelden({
  pad: "/huidproblemen/gerstekorrels",
  titel: "Gerstekorrels en milia verwijderen",
  omschrijving:
    "Milia en gerstekorrels laten weghalen. Een hard wit bolletje is in seconden weg; rood en pijnlijk hoort bij je huisarts.",
});

const PAD = "/huidproblemen/gerstekorrels";

const ANKERS = [
  { id: "afspraak", label: "Wat er gebeurt" },
  { id: "welke", label: "Wat heb je" },
  { id: "wel-niet", label: "Wat helpt" },
  { id: "vragen", label: "Vragen" },
] as const;

const SOORTEN: readonly SoortOptie[] = BOLLETJE_BEELDEN.map((o) => ({
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
    label: o.binnenBereik ? "Dit behandelen wij" : "Hier zijn wij het niet",
    tekst: o.binnenBereik
      ? "Een steriele naald, enkele seconden per bolletje, en er blijft niets van te zien. Bijna altijd een eenmalige behandeling."
      : "Rond het oog nemen we geen risico dat nergens voor nodig is. Dit hoort bij de huisarts, en die verwijst zo nodig door.",
  },
}));

export default function Pagina() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Huidproblemen", url: `${DIBA_SITE_URL}/huidproblemen` },
          { name: "Gerstekorrels en milia", url: `${DIBA_SITE_URL}${PAD}` },
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
              <span className="text-[var(--on-dark-body)]">
                Gerstekorrels en milia
              </span>
            </nav>

            <h1 className="diba-display-l mt-6 text-[var(--on-dark)]">
              Gerstekorrels
              <br />
              <span className="diba-accent-on-dark">en witte bultjes</span>
            </h1>

            <p className="mt-6 max-w-[48ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
              Gerstekorrel betekent in de volksmond en in de spreekkamer twee
              verschillende dingen. Wat mensen meestal bedoelen is een milium:
              een hard wit bolletje dat er maanden zit, geen pijn doet en niet
              uit te knijpen is. Dat is in seconden weg.
            </p>
            <LeesVerder opDonker>
              <p className="mt-4 max-w-[48ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
                Een milium halen we weg met een fijne naald, in een paar
                seconden per bolletje. Is het rood, warm en pijnlijk, dan gaat
                het om een ontsteking; kom dan langs, want de aanpak is dan een
                andere.
              </p>
            </LeesVerder>

            <div className="diba-knoprij mt-9">
              <Button variant="primair-op-donker" href="#welke">
                Kijk wat jij hebt
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
              /* Yasin, 7 september 2026: de HydraFacial Syndeo uit de shoot. */
              src="/images/shoot/beh-hydrafacial-syndeo.jpg"
              alt="HydraFacial Syndeo op het voorhoofd van een cliënt"
              fill
              priority
              sizes="(min-width: 1024px) 44vw, 100vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>

      <PillarNav ankers={ANKERS} />

      {/* ── In de behandelkamer ── */}
      <section
        id="afspraak"
        className="bg-[var(--g-025)] scroll-mt-[var(--anker-offset)] px-5 py-12 sm:py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="In de behandelkamer"
            raster="gelijk"
            kop="Hoe we milia"
            accent="weghalen"
            intro="Een fijne naald opent het bolletje en de inhoud komt eruit. Per milium duurt dat een paar seconden, en er blijft geen wondje."
          />

          <ol className="mt-8 sm:mt-12 grid gap-5 lg:grid-cols-3">
            {AFSPRAAK_STAPPEN.map((stap) => (
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

          <div className="mt-10 rounded-[var(--r-md)] bg-[var(--g-700)] p-7 text-[var(--on-dark)] sm:p-9">
            <Label opDonker>Zitten er ook mee-eters bij?</Label>
            <p className="diba-card-title-lg mt-4 max-w-[36ch]">
              Dan is dit maar de helft van je verhaal.
            </p>
            <p className="mt-4 max-w-[62ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
              Losse witte bolletjes zijn een ding op zich. Zie je daarnaast
              verstopte poriën, puistjes of een glimmende T-zone, dan gaat het
              om onzuiverheden en is de acnepagina de betere ingang.
            </p>
            <div className="mt-7">
              <Button href="/huidproblemen/acne" variant="primair-op-donker">
                Naar de acnepagina
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section
        id="welke"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-050)] px-5 py-12 sm:py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="Vier bultjes"
            kop="Wit bolletje of"
            accent="ontstoken kliertje?"
            intro="Wit en hard aan de ene kant, rood en pijnlijk aan de andere: dat verschil bepaalt of het hier weg kan of naar de huisarts gaat."
          />
          <SoortKiezer
            opties={zonderVlaggen(SOORTEN)}
            ctaHrefPatroon="/intake?topic=gerstekorrels&beeld={id}"
            ctaLabel="Laat dit bekijken"
            hint="Twijfel je tussen twee? Dan kijken we samen."
          />
        </div>
      </section>

      <WelNiet
        wel={GERSTEKORRELS_WEL_NIET.wel}
        niet={GERSTEKORRELS_WEL_NIET.niet}
        intro="Bij milia is het antwoord meestal kort: als het het juiste bultje is, is het in een afspraak klaar."
      />

      {/* Welke behandelingen bij deze klacht horen, en op welk apparaat ze
          draaien. Leeg als er niets gekoppeld is; zie het component. */}
      <BehandelingenBijProbleem pad="/huidproblemen/gerstekorrels" />

      <PillarFaq items={GERSTEKORRELS_FAQ} onderwerp="gerstekorrels" />

      <PillarCta
        kop="Even laten kijken."
        accent="Vaak is het zo klaar."
        tekst="Bij milia is de afspraak kort en eenmalig. Blijkt het iets anders, dan hoor je dat meteen en sturen we je door in plaats van dat we het proberen."
        topic="gerstekorrels"
        whatsappHref={DIBA_WHATSAPP_URL}
      />
    </main>
  );
}
