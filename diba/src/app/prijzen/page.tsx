import type { Metadata } from "next";
import Link from "next/link";
import Prijslijst from "@/components/prijzen/Prijslijst";
import Behandelprijzen from "@/components/prijzen/Behandelprijzen";
import PrijzenVoorJou from "@/components/prijzen/PrijzenVoorJou";
import Label from "@/components/ui/Label";
import ProofBar from "@/components/ui/ProofBar";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { DIBA_PROOF_STRIP_ITEMS, DIBA_SITE_URL } from "@/lib/site";
import { zoekmachineVelden } from "@/lib/seo";

/**
 * De prijzenpagina.
 *
 * Herbouwd, en niet alleen qua vorm. De vorige versie bouwde de laserlijst met een
 * hulpfunctie die elke prijs op nul zette, en toonde bij nul letterlijk "[PRIJS-NODIG]"
 * op het scherm. Sinds er tarieven in `laser-zones.ts` staan zou deze pagina overal € 0
 * hebben laten zien terwijl de configurator ernaast de juiste bedragen toont.
 *
 * Alle regels komen nu uit dezelfde bron als de rest van de site. Een prijs die op twee
 * plekken staat, staat binnen een maand twee keer verschillend.
 *
 * Eén donkergroen vlak op deze pagina: de afsluiter. Een prijslijst hoort licht te zijn,
 * anders leest hij als een offerte.
 */

export const metadata: Metadata = zoekmachineVelden({
  pad: "/prijzen",
  titel: "Prijzen",
  omschrijving:
    "Alle tarieven van Diba Clinics op één pagina, per sessie en per zone. Wat er staat is wat je betaalt.",
});

export default function PrijzenPage() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Prijzen", url: `${DIBA_SITE_URL}/prijzen` },
        ])}
      />

      {/* ── Hero ── */}
      <section className="mx-auto px-5 sm:px-9 lg:px-[7.5vw]">
        <div className="grid gap-10 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
          <div>
            <nav
              aria-label="Kruimelpad"
              className="diba-label flex flex-wrap gap-2"
            >
              <Link href="/" className="hover:text-[var(--g-700)]">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-[var(--t-muted)]">Prijzen</span>
            </nav>

            <h1 className="diba-display-l mt-6 max-w-[14ch]">
              Alle prijzen
              <br />
              <span className="diba-accent">op één plek</span>
            </h1>

            <p className="mt-6 max-w-[52ch] text-[16px] leading-7 text-[var(--t-body)]">
              Wat een behandeling kost hoor je liever voordat je een afspraak
              maakt dan erna. Daarom staat het hier: elk tarief, per sessie en
              per zone, zonder dat je ervoor hoeft te bellen.
            </p>

            <p className="mt-4 max-w-[52ch] text-[16px] leading-7 text-[var(--t-body)]">
              Hier staat het gewoon. Per sessie, per zone, inclusief wat een
              pakket vervangt. Je kunt het vergelijken voordat je een afspraak
              maakt, en dat is precies de bedoeling.
            </p>
          </div>

          {/* Stond op een rand. Vlakken dragen zichzelf; op --g-010 is wit al genoeg
              onderscheid en een lijntje eromheen is precies de stijl die hier niet hoort. */}
          <div className="flex flex-col justify-center rounded-[var(--r-lg)] bg-white p-8 sm:p-10">
            <Label>Wat een prijs niet is</Label>
            <p className="diba-card-title mt-4 text-[var(--t-strong)]">
              Een voorspelling
            </p>
            <p className="mt-4 text-[15px] leading-7 text-[var(--t-body)]">
              De prijs per sessie is vooraf bekend. Hoeveel sessies nodig zijn,
              kunnen we pas na de intake en tijdens het traject beter
              inschatten.
            </p>
            <p className="mt-4 text-[15px] leading-7 text-[var(--t-body)]">
              Daarom staan hier sessieprijzen en geen pakketten met een streep
              door de oude prijs. Wat je in totaal kwijt bent hoor je na de
              meting.
            </p>
          </div>
        </div>
      </section>

      <ProofBar items={DIBA_PROOF_STRIP_ITEMS} />

      {/* ── Wat het bij jou kost ──
          De lijst hieronder is ruim vier schermen lang, en dat blijft zo: alles staat er,
          altijd. Maar het antwoord op de vraag waarmee iemand hier komt stond daardoor
          ergens in die vier schermen verstopt. De behandelingenpagina ordende al op het
          huidprofiel; deze pagina deed dat niet, dus las je daar wat bij je past en hier
          weer een alfabetische muur. Dit blok haalt die twee bij elkaar. Er wordt niets
          weggefilterd; het staat erboven en niet ervoor in de plaats. */}
      <section className="px-5 pt-14 sm:px-9 lg:px-[7.5vw] lg:pt-16">
        <div className="mx-auto">
          <PrijzenVoorJou />
        </div>
      </section>

      {/* ── De behandelingen, met wat je voor dat bedrag krijgt ──
          Dit was een tabel met een naam links en een bedrag rechts. De vraag achter "wat
          kost een peeling" gaat nooit alleen over het bedrag, maar over of het bij je
          past, hoe vaak je moet komen en hoe lang je erna rood bent. Dat stond allemaal
          al in behandelingen.ts en werd hier niet gebruikt. Nu wel, uitklapbaar, met het
          bedrag altijd in beeld. */}
      <section className="bg-[var(--g-050)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto">
          <div>
            <Label>Per behandeling</Label>
            <h2 className="diba-display-m mt-4">
              Wat een behandeling <span className="diba-accent">kost</span>
            </h2>
            <p className="max-w-[62ch] mt-6 text-[17px] leading-8 text-[var(--t-body)]">
              Klap een behandeling open en je ziet hoe vaak je moet komen, hoe
              lang de hersteltijd is en wat het niet doet. Het bedrag blijft
              staan, ook dicht.
            </p>
          </div>
          <div className="mt-10">
            <Behandelprijzen />
          </div>
        </div>
      </section>

      {/* ── De laserzones ──
          Dit blijft een tabel, want dat is het ook: veertig zones tegen twee
          tarievenlijsten. Rijen en kolommen in de letterlijke zin. */}
      <section className="px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto">
          <div>
            <Label>Laserontharing per zone</Label>
            <h2 className="diba-display-m mt-4">
              Elke zone,{" "}
              <span className="diba-accent">met het tarief erbij.</span>
            </h2>
          </div>
          <div className="mt-10">
            <Prijslijst />
          </div>
        </div>
      </section>

      {/* ── Afsluiter ── */}
      <section className="px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto">
          <div className="rounded-[var(--r-lg)] bg-[var(--g-700)] p-8 text-[var(--on-dark)] sm:p-12">
            <Label opDonker>Zelf uitrekenen</Label>
            <h2 className="diba-display-m mt-4 max-w-[22ch]">
              Voor laser
              <br />
              <span className="diba-accent-on-dark">
                stel je het zelf samen.
              </span>
            </h2>
            <p className="mt-6 max-w-[58ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
              Wijs je zones aan op een tekening en zie meteen wat je opbouw
              wordt, inclusief wat een pakket vervangt. Je keuze staat daarna in
              de adresbalk, dus je kunt hem bewaren of doorsturen.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/laserontharing/configurator"
                className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--on-dark-btn)] px-6 text-[var(--on-dark-btn-text)] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Naar de configurator
              </Link>
              <Link
                href="/behandelingen"
                className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] border border-white/50 px-6 text-white transition-colors hover:border-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Wat de behandelingen doen
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
