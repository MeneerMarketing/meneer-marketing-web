import type { Metadata } from "next";
import Link from "next/link";
import { SectieKop } from "@/components/pillar/PillarSecties";
import Zoeker from "@/components/symptoomzoeker/Zoeker";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import ProofBar from "@/components/ui/ProofBar";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { DIBA_PROOF_STRIP_ITEMS, DIBA_SITE_URL, DIBA_WHATSAPP_URL } from "@/lib/site";

/**
 * De symptoomzoeker — de wegwijzer over alle huidprobleempagina's heen.
 *
 * Vijftien pagina's zijn te veel om doorheen te bladeren als je niet weet hoe je het
 * noemt, en zo komt bijna iedereen binnen. Deze pagina vraagt daarom niet welke aandoening
 * je denkt te hebben maar wat je ziet en voelt, in gewone woorden.
 *
 * Net als de kleurwijzer verkoopt hij niets en heeft hij geen WelNiet, geen WijZeggenNee
 * en geen NulmetingAssen: hij sorteert, en dan ben je ergens anders.
 */

export const metadata: Metadata = {
  title: "Weet je niet hoe het heet? Begin hier",
};

const PAD = "/huidproblemen/symptoomzoeker";

export default function SymptoomzoekerPage() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Huidproblemen", url: `${DIBA_SITE_URL}/huidproblemen` },
          { name: "Symptoomzoeker", url: `${DIBA_SITE_URL}${PAD}` },
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
            <span className="text-[var(--t-muted)]">Symptoomzoeker</span>
          </nav>

          <h1 className="diba-display-l mt-6 max-w-[17ch]">
            Je hoeft niet te weten
            <br />
            <span className="diba-accent">hoe het heet.</span>
          </h1>

          <p className="mt-6 max-w-[62ch] text-[16px] leading-7 text-[var(--t-body)]">
            De meeste mensen komen hier binnen met wat ze zien en niet met een naam. Daarom
            staat er hieronder geen enkele vakterm: je kruist aan wat er speelt en wij
            zoeken de pagina erbij.
          </p>

          <p className="mt-4 max-w-[62ch] text-[16px] leading-7 text-[var(--t-body)]">
            Bij twee dingen wijzen we je meteen naar de huisarts, ook als de rest bij ons
            hoort. Dat is geen voorbehoud maar de volgorde die klopt.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Button href="#zoeker">Begin met aankruisen</Button>
            <Button
              href={DIBA_WHATSAPP_URL}
              variant="ghost"
              target="_blank"
              rel="noopener noreferrer"
            >
              Of stel je vraag gewoon
            </Button>
          </div>
        </div>
      </section>

      <ProofBar items={DIBA_PROOF_STRIP_ITEMS} />

      {/* ── De zoeker ── */}
      <section
        id="zoeker"
        className="scroll-mt-24 bg-[var(--g-050)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto max-w-[1800px]">
          <SectieKop
            label="De zoeker"
            kop="Kruis aan wat"
            accent="er speelt."
            intro="Je mag er meerdere kiezen. Hoe meer je aankruist, hoe scherper de lijst wordt, en achter elke pagina staat hoeveel van jouw punten hij dekt."
          />
          <Zoeker />
        </div>
      </section>

      {/* ── Afsluiting ── */}
      <section className="mx-5 mb-5 rounded-[var(--r-xl)] bg-[var(--g-700)] px-7 py-14 text-[var(--on-dark)] sm:mx-9 sm:px-12 lg:mx-[7.5vw] lg:px-16 lg:py-20">
        <div className="mx-auto max-w-[1800px] lg:grid lg:grid-cols-[1.35fr_0.65fr] lg:gap-10">
          <div>
            <Label opDonker>Komt er niets uit</Label>
            <h2 className="diba-display-l mt-5 max-w-[16ch]">
              Dan kijken wij
              <br />
              <span className="diba-accent-on-dark">er gewoon naar.</span>
            </h2>
          </div>
          <div className="mt-8 flex flex-col justify-end lg:mt-0">
            <p className="max-w-sm text-[16px] leading-7 text-[var(--on-dark-body)]">
              Niet alles past in een lijst, en sommige dingen spelen tegelijk. Dat is geen
              probleem: dan begint het met kijken en meten in plaats van met kiezen.
            </p>
            <div className="mt-7">
              <Button href="/intake?topic=onbekend" variant="primair-op-donker">
                Plan de nulmeting
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
