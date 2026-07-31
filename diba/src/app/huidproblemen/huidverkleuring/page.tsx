import type { Metadata } from "next";
import Link from "next/link";
import Kleurwijzer from "@/components/huidverkleuring/Kleurwijzer";
import { PillarFaq, SectieKop } from "@/components/pillar/PillarSecties";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import ProofBar from "@/components/ui/ProofBar";
import { VERKLEURING_FAQ } from "@/data/huidverkleuring";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { DIBA_PROOF_STRIP_ITEMS, DIBA_SITE_URL } from "@/lib/site";

/**
 * Huidverkleuring — een wegwijzer en geen aandoeningspagina.
 *
 * Mensen zoeken hierop omdat ze de goede term niet kennen. De nuttigste vraag is dan
 * precies de vraag die een behandelaar als eerste stelt: welke kleur. Die zegt iets over
 * de laag waarin het zit, en dus over wat er mogelijk is.
 *
 * Daarom heeft deze pagina geen WelNiet, geen WijZeggenNee en geen NulmetingAssen: dat
 * zou tekst zijn over een aandoening die hier niet bestaat. Hij sorteert, en dan ben je
 * ergens anders. Dat is ook de reden dat hij kort is; een langere versie zou een dunne
 * doorslagpagina worden van de vier waar hij naartoe wijst.
 */

export const metadata: Metadata = {
  title: "Huidverkleuring: welke kleur is het?",
};

const PAD = "/huidproblemen/huidverkleuring";

export default function HuidverkleuringPage() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Huidproblemen", url: `${DIBA_SITE_URL}/huidproblemen` },
          { name: "Huidverkleuring", url: `${DIBA_SITE_URL}${PAD}` },
        ])}
      />

      {/* ── Hero ── */}
      <section className="mx-auto max-w-[1800px] px-5 sm:px-9 lg:px-[7.5vw]">
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
            <span className="text-[var(--t-muted)]">Huidverkleuring</span>
          </nav>

          <h1 className="diba-display-l mt-6 max-w-[16ch]">
            Begin bij de kleur.
            <br />
            <span className="diba-accent">Die zegt het meeste.</span>
          </h1>

          <p className="mt-6 max-w-[62ch] text-[16px] leading-7 text-[var(--t-body)]">
            Verkleuring is een verzamelwoord. Bruin is iets anders dan rood, en wit is weer
            een heel ander verhaal. De kleur vertelt in welke laag het zit, en daarmee of er
            iets aan te doen valt.
          </p>

          <p className="mt-4 max-w-[62ch] text-[16px] leading-7 text-[var(--t-body)]">
            Op deze pagina staat geen behandeling en geen prijs. Hij brengt je naar de
            pagina die er wel over gaat, en soms is dat de huisarts.
          </p>

          <div className="mt-9">
            <Button href="#kleur">Kies je kleur</Button>
          </div>
        </div>
      </section>

      <ProofBar items={DIBA_PROOF_STRIP_ITEMS} />

      {/* ── De kleurwijzer ── */}
      <section
        id="kleur"
        className="scroll-mt-24 bg-[var(--g-050)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto max-w-[1800px]">
          <SectieKop
            label="De kleurwijzer"
            kop="Vier kleuren,"
            accent="vier verhalen."
            intro="Je hoeft geen term te kennen om te kiezen. Kijk bij daglicht, houd je onderarm ernaast als vergelijking, en tik de kleur aan die het dichtst komt."
          />
          <Kleurwijzer />
        </div>
      </section>

      <PillarFaq items={VERKLEURING_FAQ} />

      {/* ── Afsluiting ── */}
      <section className="mx-5 mb-5 rounded-[var(--r-xl)] bg-[var(--g-700)] px-7 py-14 text-[var(--on-dark)] sm:mx-9 sm:px-12 lg:mx-[7.5vw] lg:px-16 lg:py-20">
        <div className="mx-auto max-w-[1800px] lg:grid lg:grid-cols-[1.35fr_0.65fr] lg:gap-10">
          <div>
            <Label opDonker>Weet je het nog niet</Label>
            <h2 className="diba-display-l mt-5 max-w-[16ch]">
              Kom gewoon langs.
              <br />
              <span className="diba-accent-on-dark">Wij kijken mee.</span>
            </h2>
          </div>
          <div className="mt-8 flex flex-col justify-end lg:mt-0">
            <p className="max-w-sm text-[16px] leading-7 text-[var(--on-dark-body)]">
              Twijfel je tussen twee kleuren, of speelt er meer tegelijk? Dan is dat precies
              de reden om het te laten bekijken in plaats van er zelf uit te komen.
            </p>
            <div className="mt-7">
              <Button href="/intake?topic=huidverkleuring" variant="primair-op-donker">
                Plan de nulmeting
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
