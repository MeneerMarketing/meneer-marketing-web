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
import { publicCopy } from "@/lib/copy-flags";
import {
  BOLLETJE_BEELDEN,
  GERSTEKORRELS_FAQ,
  GERSTEKORRELS_WEL_NIET,
  GERSTEKORRELS_WIJ_DOEN_NIET,
  AFSPRAAK_STAPPEN,
} from "@/data/gerstekorrels";
import { NOG_IN_AANBOUW } from "@/lib/pagina-af";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import {
  DIBA_PROOF_STRIP_ITEMS,
  DIBA_SITE_URL,
  DIBA_WHATSAPP_URL,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "Gerstekorrels en milia: wit bolletje of ontsteking",
  description:
    "Een hard wit bolletje dat je niet kunt uitdrukken is een milium en in seconden weg. Een rood, pijnlijk bultje is iets anders en hoort bij de huisarts.",
  ...NOG_IN_AANBOUW,
};

const PAD = "/huidproblemen/gerstekorrels";

const ANKERS = [
  { id: "afspraak", label: "Wat er gebeurt" },
  { id: "welke", label: "Wat heb je" },
  { id: "wel-niet", label: "Wat helpt" },
  { id: "nee", label: "Waar wij nee zeggen" },
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
                Gerstekorrels en milia
              </span>
            </nav>

            <h1 className="diba-display-l mt-6">
              Wit en hard?
              <br />
              <span className="diba-accent">Of rood en pijnlijk?</span>
            </h1>

            <p className="mt-6 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              Gerstekorrel betekent in de volksmond en in de spreekkamer twee
              verschillende dingen. Wat mensen meestal bedoelen is een milium:
              een hard wit bolletje dat er maanden zit, geen pijn doet en niet
              uit te knijpen is. Dat is in seconden weg.
            </p>

            <p className="mt-4 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              Is het rood, warm en pijnlijk, dan is het een ontsteking en dan
              hoort het bij de huisarts. Wij prikken daar niet in.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Button href="#welke">Kijk wat jij hebt</Button>
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
              src="/images/shoot/kliniek-behandelkamer.jpg"
              alt="Behandelaar werkt aan de huid van een client in de behandelkamer"
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

      {/* ── In de behandelkamer ── */}
      <section
        id="afspraak"
        className="scroll-mt-[var(--anker-offset)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="In de behandelkamer"
            raster="gelijk"
            kop="Een naald naast je oog."
            accent="Daar mag je tegenop zien."
            intro="De drempel bij milia is zelden de prijs en bijna altijd dat beeld. Daar omheen praten maakt het niet kleiner, dus staat hier gewoon wat er gebeurt en hoe lang het duurt."
          />

          <ol className="mt-12 grid gap-5 lg:grid-cols-3">
            {AFSPRAAK_STAPPEN.map((stap, i) => (
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

          <div className="mt-10 rounded-[var(--r-md)] bg-[var(--g-700)] p-7 text-[var(--on-dark)] sm:p-9">
            <Label opDonker>Zitten er ook mee-eters bij?</Label>
            <p className="diba-card-title-lg mt-4 max-w-[36ch]">
              Dan is dit maar de helft van je verhaal.
            </p>
            <p className="mt-4 max-w-[62ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
              Losse witte bolletjes zijn een ding op zich. Zie je daarnaast
              verstopte porien, puistjes of een glimmende T-zone, dan gaat het
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
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-050)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="Vier bultjes"
            kop="Ze lijken op elkaar,"
            accent="en dat is het probleem."
            intro="Dit is een herkenningshulp en geen diagnose. Het verschil tussen wit en hard aan de ene kant en rood en pijnlijk aan de andere is wel iets dat je zelf kunt zien, en het bepaalt of je hier moet zijn of bij je huisarts."
          />
          <SoortKiezer
            opties={SOORTEN}
            ctaHrefPatroon="/intake?topic=gerstekorrels&beeld={id}"
            ctaLabel="Laat dit bekijken"
            hint="Twijfel je tussen twee? Dan kijken we samen."
          />
        </div>
      </section>

      <WelNiet
        wel={GERSTEKORRELS_WEL_NIET.wel}
        niet={GERSTEKORRELS_WEL_NIET.niet}
        intro="Dit is een van de weinige huidproblemen waarbij het antwoord kort is: als het het juiste bultje is, is het in een afspraak klaar."
      />

      <WijZeggenNee
        kop="Twee keer nee,"
        accent="en allebei rond het oog."
        intro="Het gaat hier om de dunste huid van je lichaam, op enkele millimeters van je oog. De grenzen zijn daarom strakker dan elders op deze site."
        punten={GERSTEKORRELS_WIJ_DOEN_NIET}
      />

      <PillarFaq items={GERSTEKORRELS_FAQ} />

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
