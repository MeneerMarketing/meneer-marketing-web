import type { Metadata } from "next";
import Link from "next/link";
import { PillarFaq, SectieKop } from "@/components/pillar/PillarSecties";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import ProofBar from "@/components/ui/ProofBar";
import {
  VERBOND_FAQ,
  VERBOND_INTRO,
  VERBOND_SLOT,
  WEIGERINGEN,
} from "@/data/verbond";
import { publicCopy } from "@/lib/copy-flags";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { DIBA_PROOF_STRIP_ITEMS, DIBA_SITE_URL } from "@/lib/site";
import BeeldVignet from "@/components/ui/BeeldVignet";

/**
 * Ons verbond — tien weigeringen.
 *
 * Hier linkt elke "waar wij nee zeggen"-sectie van de zeventien huidprobleempagina's
 * naartoe, dus dit is geen losse beloftepagina maar de optelsom ervan.
 *
 * De kolom "wat het ons kost" is het hele idee. Iedereen kan opschrijven dat hij eerlijk
 * is; wat een belofte waard maakt is wat je ervoor opgeeft. En bij bijna elke regel staat
 * een link naar de plek waar hij in de praktijk geldt, want een weigering die nergens
 * terugkomt is een slogan.
 *
 * Herbouwd in de huisstijl van de huidprobleempagina's. De vorige versie draaide op
 * VerbondTemplate en vatte onze eigen ontwerpregels samen, inclusief dingen als "één
 * primaire stap per scherm" — waar een klant niets aan heeft.
 */

export const metadata: Metadata = {
  title: "Ons verbond: tien dingen die wij niet doen",
  description:
    "Tien weigeringen, met bij elke regel wat hij ons kost en waar je hem in de praktijk terugziet.",
};

export default function OnsVerbondPage() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Ons verbond", url: `${DIBA_SITE_URL}/ons-verbond` },
        ])}
      />

      {/* ── Hero ── */}
      <section className="mx-auto px-5 sm:px-9 lg:px-[7.5vw]">
        <div className="py-14 lg:py-20">
          <nav
            aria-label="Kruimelpad"
            className="diba-label flex flex-wrap gap-2"
          >
            <Link href="/" className="hover:text-[var(--g-700)]">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-[var(--t-muted)]">Ons verbond</span>
          </nav>

          <h1 className="diba-display-l mt-6 max-w-[16ch]">
            Tien dingen
            <br />
            <span className="diba-accent">die wij niet doen.</span>
          </h1>

          <p className="mt-6 max-w-[62ch] text-[16px] leading-7 text-[var(--t-body)]">
            {VERBOND_INTRO}
          </p>

          <div className="mt-9">
            <Button href="#weigeringen">Lees de tien</Button>
          </div>
        </div>
      </section>

      <ProofBar items={DIBA_PROOF_STRIP_ITEMS} />

      {/* ── De tien ── */}
      <section
        id="weigeringen"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-050)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="De weigeringen"
            kop="Elke regel heeft"
            accent="een prijs."
            intro="Die staat er in de rechterkolom bij. Dat is meteen de reden dat deze lijst kort is: er staat alleen op wat we ook volhouden als het ons iets kost."
          />

          {/*
            Dit was één blok met haarlijnen ertussen (space-y-px op een --g-100-vlak) en
            een verticale streep tussen de kolommen. Lijnen zijn niet de huisstijl: kaarten
            dragen zichzelf met een vlak. Nu losse kaarten met ruimte ertussen, en de
            kostenkolom is een eigen vlak binnen de kaart.
          */}
          {/* Geen "01 02 03" meer voor de regels. Die nummers waren decoratie: de
              weigeringen hebben geen rangorde en je verwijst er nooit naar met hun nummer.
              Ze lazen als een sjabloon in plaats van als een standpunt. */}
          <ul className="mt-12 space-y-4">
            {WEIGERINGEN.map((w) => (
              <li
                key={w.regel}
                className="rounded-[var(--r-lg)] bg-white p-6 sm:p-9"
              >
                <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr] lg:gap-10">
                  <div>
                    <h2 className="diba-card-title">{w.regel}</h2>
                    <p className="mt-3 text-[16px] leading-7 text-[var(--t-body)]">
                      {w.uitleg}
                    </p>
                    {w.zieOok ? (
                      <Link
                        href={w.zieOok.pad}
                        className="diba-label mt-4 inline-block text-[var(--g-700)] underline underline-offset-4"
                      >
                        {w.zieOok.tekst}
                      </Link>
                    ) : null}
                  </div>

                  <div className="rounded-[var(--r-md)] bg-[var(--g-050)] p-5 sm:p-6">
                    <Label className="text-[var(--warn-text)]">
                      Wat dit ons kost
                    </Label>
                    <p className="mt-3 text-[15px] leading-7 text-[var(--t-body)]">
                      {w.kost}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <PillarFaq items={VERBOND_FAQ} onderwerp="ons verbond" />

      {/* ── Slot ── */}
      {/* Tien weigeringen op een rij kan streng overkomen. Ze komen niet uit een reglement
          maar uit gesprekken zoals deze, waarin twee mensen besluiten wat er niet gebeurt. */}
      <section className="px-5 pb-14 sm:px-9 lg:px-[7.5vw] lg:pb-16">
        <div className="mx-auto">
          <BeeldVignet
            src="/images/shoot/team-overleg.jpg"
            alt="Twee behandelaars in gesprek in de kliniek"
            onderschrift="Elke nee begint met een gesprek"
            sizes="(min-width: 1024px) 86vw, 92vw"
            className="aspect-[16/10] lg:aspect-[2/1]"
          />
        </div>
      </section>

      <section className="mx-5 mb-5 rounded-[var(--r-xl)] bg-[var(--g-700)] px-7 py-14 text-[var(--on-dark)] sm:mx-9 sm:px-12 lg:mx-[7.5vw] lg:px-16 lg:py-20">
        <div className="mx-auto lg:grid lg:grid-cols-[1.35fr_0.65fr] lg:gap-10">
          <div>
            <Label opDonker>Wat je ermee kunt</Label>
            <h2 className="diba-display-l mt-5 max-w-[14ch]">
              {VERBOND_SLOT.kop}
              <br />
              <span className="diba-accent-on-dark">aan wat hier staat.</span>
            </h2>
          </div>
          <div className="mt-8 flex flex-col justify-end lg:mt-0">
            <p className="max-w-sm text-[16px] leading-7 text-[var(--on-dark-body)]">
              {publicCopy(VERBOND_SLOT.tekst)}
            </p>
            <div className="mt-7">
              <Button href="/contact" variant="primair-op-donker">
                Laat het ons weten
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
