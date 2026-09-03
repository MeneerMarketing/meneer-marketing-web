import type { Metadata } from "next";
import Link from "next/link";
import Glastest from "@/components/huiduitslag/Glastest";
import PillarNav from "@/components/pillar/PillarNav";
import {
  PillarFaq,
  SectieKop,
  WelNiet,
} from "@/components/pillar/PillarSecties";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import ProofBar from "@/components/ui/ProofBar";
import {
  ALARM,
  ALARM_ROUTE,
  ALARM_SLOT,
  OORZAKEN,
  UITSLAG_FAQ,
  UITSLAG_WEL_NIET,
} from "@/data/huiduitslag";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { DIBA_PROOF_STRIP_ITEMS, DIBA_SITE_URL } from "@/lib/site";
import { zoekmachineVelden } from "@/lib/seo";

/**
 * Huiduitslag — veertiende eigen pagina, en de vierde zonder afspraakknop.
 *
 * Uitslag is geen aandoening maar een symptoom met tientallen oorzaken, waarvan een deel
 * spoedeisend is. Een huidkliniek hoort daar niets over te beweren, ook geen
 * geruststelling: wat wij zeggen zou meewegen in of iemand belt.
 *
 * Wat we wél kunnen doen is de glastest uitleggen. Die kost tien seconden, artsen
 * gebruiken hem zelf, en bijna niemand kent hem. Dat is het soort informatie dat een
 * behandeling nooit verkoopt.
 *
 * De alarmsignalen staan bewust vóór de rest en niet onderaan, en ze staan op donkergroen
 * zodat ze het eerste zijn dat je ziet als je scrollt.
 *
 * MEDISCH: ELKE regel op deze pagina langs Rojda, inclusief de alarmsignalen zelf.
 */

export const metadata: Metadata = zoekmachineVelden({
  pad: "/huidproblemen/huiduitslag",
  titel: "Huiduitslag: bel je vandaag of morgen?",
  omschrijving:
    "Huiduitslag is een symptoom met tientallen oorzaken. Hier staat wanneer het naar de huisarts moet en wanneer wij iets voor je kunnen doen.",
});

const PAD = "/huidproblemen/huiduitslag";

const ANKERS = [
  { id: "alarm", label: "Wanneer je nu belt" },
  { id: "glastest", label: "De glastest" },
  { id: "oorzaken", label: "Gewone oorzaken" },
  { id: "wel-niet", label: "Wat helpt" },
  { id: "vragen", label: "Vragen" },
] as const;

export default function HuiduitslagPage() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Huidproblemen", url: `${DIBA_SITE_URL}/huidproblemen` },
          { name: "Huiduitslag", url: `${DIBA_SITE_URL}${PAD}` },
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
            <Link href="/huidproblemen" className="hover:text-[var(--g-700)]">
              Huidproblemen
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-[var(--t-muted)]">Huiduitslag</span>
          </nav>

          <h1 className="diba-display-l mt-6 max-w-[18ch]">
            Huiduitslag, en wanneer
            <br />
            <span className="diba-accent">het haast heeft</span>
          </h1>

          <p className="mt-6 max-w-[62ch] text-[16px] leading-7 text-[var(--t-body)]">
            Huiduitslag is geen aandoening maar een symptoom, met tientallen
            oorzaken die uiteenlopen van onschuldig tot spoedeisend. Wij stellen
            daar geen diagnose over en we stellen je ook niet gerust, want dat
            zou meewegen in of je belt.
          </p>

          <p className="mt-4 max-w-[62ch] text-[16px] leading-7 text-[var(--t-body)]">
            Wat we wel doen is de test uitleggen die artsen zelf gebruiken om
            haast van geen haast te onderscheiden. Hij kost tien seconden en
            bijna niemand kent hem.
          </p>

          <div className="mt-9">
            <Button href="#alarm">Kijk eerst naar de alarmsignalen</Button>
          </div>
        </div>
      </section>

      <ProofBar items={DIBA_PROOF_STRIP_ITEMS} />

      <PillarNav ankers={ANKERS} />

      {/* ── Alarmsignalen. Vóór alles, want dit is het enige dat echt haast heeft. ── */}
      <section
        id="alarm"
        className="mx-5 scroll-mt-[var(--anker-offset)] rounded-[var(--r-xl)] bg-[var(--g-700)] px-7 py-14 text-[var(--on-dark)] sm:mx-9 sm:px-12 lg:mx-[7.5vw] lg:px-16 lg:py-20"
      >
        <div className="mx-auto">
          <Label opDonker>Wanneer je niet afwacht</Label>
          <h2 className="diba-display-s mt-5 max-w-[22ch]">
            Zes signalen waarbij
            <br />
            <span className="diba-accent-on-dark">je vandaag belt.</span>
          </h2>

          {/* De signalen op een eigen vlak in plaats van achter een haarlijntje. Dat is de
              huisregel (vullingen, geen lijnen), en op --g-800 haalt --on-dark-body 7,57
              tegen 4,08 op een doorschijnend wit vlak: dat laatste zakt onder AA. */}
          <ul className="mt-10 grid gap-3 md:grid-cols-2 md:gap-4">
            {ALARM.map((a) => (
              <li
                key={a}
                className="rounded-[var(--r-sm)] bg-[var(--g-800)] px-5 py-4 text-[16px] leading-7 text-[var(--on-dark-body)]"
              >
                {a}
              </li>
            ))}
          </ul>

          <p className="mt-8 max-w-[62ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
            {ALARM_SLOT.replace(/\[[^\]]+\]/g, "").trim()}
          </p>

          {/* Waar je dan naartoe belt. Dit stond als halve zin in het label erboven
              ("bel vandaag, of 112 buiten kantooruren"): twee handelingen in één regel,
              zonder te zeggen wanneer welke geldt. Wie hier op dit moment staat heeft
              geen samenvatting nodig maar een nummer. */}
          <div className="mt-10 rounded-[var(--r-md)] bg-[var(--g-800)] p-6 sm:p-8">
            <Label opDonker>Waar je dan naartoe belt</Label>
            <dl className="mt-5 grid gap-4 sm:grid-cols-3 sm:gap-6">
              {/* De antwoorden op één lijn, ook als de vraag erboven twee regels pakt.
                  Anders hangt 112 lager dan de rest en leest dat als minder belangrijk. */}
              {ALARM_ROUTE.map((r) => (
                <div key={r.waar} className="flex h-full flex-col">
                  <dt className="text-[15px] leading-6 text-[var(--on-dark-body)]">
                    {r.wanneer}
                  </dt>
                  <dd className="diba-card-title mt-auto pt-2 text-[var(--on-dark)]">
                    {r.waar}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ── De glastest: de uitblinker ── */}
      <section
        id="glastest"
        className="scroll-mt-[var(--anker-offset)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="De glastest"
            // Twee gelijke helften eronder, dus de introzin volgt die indeling.
            raster="gelijk"
            kop="Drukken de vlekken weg"
            accent="of blijven ze staan?"
            intro="Druk de zijkant van een doorzichtig glas stevig op de vlekken en kijk er dwars doorheen. Hieronder staan beide uitkomsten naast elkaar, zodat je herkent welke je ziet in plaats van moet raden."
          />
          <Glastest />
        </div>
      </section>

      {/* ── Gewone oorzaken ── */}
      <section
        id="oorzaken"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-050)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="Gewone oorzaken"
            kop="Vier die veel"
            accent="voorkomen."
            intro="Dit is geen lijst om jezelf mee te diagnosticeren, en er staan bewust geen foto's bij. Het helpt je vertellen wat je ziet, en de laatste kolom zegt waar je ermee heen gaat."
          />

          <ul className="mt-12 grid gap-px overflow-hidden rounded-[var(--r-md)] bg-[var(--g-100)] md:grid-cols-2 lg:grid-cols-4">
            {OORZAKEN.map((o) => (
              <li key={o.naam} className="flex flex-col bg-white p-6 sm:p-7">
                <h3 className="diba-card-title">{o.naam}</h3>
                <p className="mt-3 grow text-[15px] leading-7 text-[var(--t-body)]">
                  {o.herken}
                </p>
                <p className="diba-label mt-5 text-[var(--t-muted)]">
                  Waar je heen gaat
                </p>
                <p className="mt-1.5 text-[15px] leading-6 text-[var(--t-body)]">
                  {o.waarheen.replace(/\[[^\]]+\]/g, "").trim()}
                </p>
                {"pad" in o && o.pad ? (
                  <Link
                    href={o.pad}
                    className="diba-label mt-4 text-[var(--g-700)] underline underline-offset-4"
                  >
                    {o.link}
                  </Link>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <WelNiet
        wel={UITSLAG_WEL_NIET.wel}
        niet={UITSLAG_WEL_NIET.niet}
        intro="Het eerste kruisje rechts maakt het werk van de arts moeilijker: zalf op onbekende uitslag verandert het beeld dat hij moet beoordelen."
      />

      <PillarFaq items={UITSLAG_FAQ} onderwerp="huiduitslag" />

      {/* ── Afsluiting zonder afspraakknop ── */}
      <section className="mx-5 mb-5 rounded-[var(--r-xl)] bg-[var(--g-050)] px-7 py-14 sm:mx-9 sm:px-12 lg:mx-[7.5vw] lg:px-16 lg:py-20">
        <div className="mx-auto">
          <Label>Waar je wel heen gaat</Label>
          <h2 className="diba-display-s mt-5 max-w-[22ch]">
            Naar je huisarts.
            <br />
            <span className="diba-accent">Bij twijfel vandaag nog.</span>
          </h2>
          <p className="mt-6 max-w-[62ch] text-[16px] leading-7 text-[var(--t-body)]">
            Er staat op deze pagina geen knop om bij ons een afspraak te maken.
            Maak een foto bij het begin en noteer wat eraan voorafging; dat is
            het meest bruikbare dat je kunt meenemen.
          </p>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
            <Link
              href="/huidproblemen/eczeem"
              className="diba-label text-[var(--g-700)] underline underline-offset-4"
            >
              Misschien is het eczeem
            </Link>
            <Link
              href="/huidproblemen/gevoelige-huid"
              className="diba-label text-[var(--g-700)] underline underline-offset-4"
            >
              Of reageert je huid op je routine
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
