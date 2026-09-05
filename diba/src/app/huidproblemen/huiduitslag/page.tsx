import type { Metadata } from "next";
import Link from "next/link";
import BehandelingenBijProbleem from "@/components/pillar/BehandelingenBijProbleem";
import PillarNav from "@/components/pillar/PillarNav";
import {
  PillarFaq,
  SectieKop,
  WelNiet,
  PillarCta,
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
  UITSLAG_GEDRAG,
} from "@/data/huiduitslag";
import { publicCopy } from "@/lib/copy-flags";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import {
  DIBA_PROOF_STRIP_ITEMS,
  DIBA_SITE_URL,
  DIBA_WHATSAPP_URL,
} from "@/lib/site";
import { zoekmachineVelden } from "@/lib/seo";

/**
 * Huiduitslag — veertiende eigen pagina, en de vierde zonder afspraakknop.
 *
 * Uitslag is geen aandoening maar een symptoom met tientallen oorzaken, waarvan een deel
 * spoedeisend is. Een huidkliniek hoort daar niets over te beweren, ook geen
 * geruststelling: wat wij zeggen zou meewegen in of iemand belt.
 *
 * Wat we wél kunnen doen is uitleggen hoe een uitslag zich gedraagt. Of hij binnen uren
 * wegtrekt of weken blijft staan is de eerste vraag die een arts stelt, en het is iets wat
 * je kunt lezen zonder er iets voor te doen. Dat is het soort informatie dat een behandeling
 * nooit verkoopt.
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
    "Huiduitslag is een symptoom met tientallen oorzaken. Wanneer je vandaag nog belt, en welke soorten het vaakst voorkomen.",
});

const PAD = "/huidproblemen/huiduitslag";

const ANKERS = [
  { id: "alarm", label: "Wanneer je nu belt" },
  { id: "gedrag", label: "Het patroon" },
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
            Huiduitslag is een symptoom en geen aandoening. De oorzaken lopen
            uiteen van onschuldig tot spoedeisend, en een diagnose hoort bij je
            huisarts.
          </p>

          <p className="mt-4 max-w-[62ch] text-[16px] leading-7 text-[var(--t-body)]">
            Op deze pagina staan de signalen waarbij je vandaag nog belt, en de
            veelvoorkomende soorten uitslag met wat eraan te doen is.
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

      {/* ── Hoe een uitslag zich gedraagt ──

          Hier stond de glastest. Yasin, 5 september: geen tests meer, en hij begreep hem
          niet. Dat tweede weegt het zwaarst; een uitblinker die uitleg nodig heeft doet
          zijn werk niet.

          Het veiligheidssignaal dat die test gaf blijft staan: "Wanneer je nu belt" is een
          eigen sectie en die staat hierboven.

          Dit is iets anders dan de sectie eronder over oorzaken. Het gedrag van een uitslag
          is de eerste vraag die een behandelaar stelt, en het is in tien seconden te lezen
          zonder dat je er iets voor hoeft te doen. */}
      <section
        id="gedrag"
        className="scroll-mt-[var(--anker-offset)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="Het patroon"
            raster="gelijk"
            kop="Hoe een uitslag"
            accent="zich gedraagt"
            intro="Niet wat je ziet maar wat het doet, zegt het meeste. Dit is ook de eerste vraag die je krijgt, bij ons en bij de huisarts."
          />

          <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {UITSLAG_GEDRAG.map((g) => (
              <li
                key={g.kop}
                className="rounded-[var(--r-md)] bg-white p-7 sm:p-8"
              >
                <h3 className="diba-card-title">{g.kop}</h3>
                {/* Zes regelhoogtes, zodat de vier kaarten in een rij gelijk blijven. */}
                <p className="mt-3 min-h-[6lh] text-[15px] leading-7 text-[var(--t-body)]">
                  {publicCopy(g.zin)}
                </p>
              </li>
            ))}
          </ul>
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
            intro="Deze vier komen het vaakst voor. Ze helpen je beschrijven wat je ziet, en dat maakt het gesprek met de huisarts korter."
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
                {/* min-h in lh: het aantal regels hangt hier af van waar de woorden breken en niet
                      van de lengte, dus reserveren we de ruimte in plaats van tekens te tellen. */}
                <p className="mt-1.5 min-h-[3lh] text-[15px] leading-6 text-[var(--t-body)]">
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
        intro="Zalf op onbekende uitslag verandert het beeld dat de arts moet beoordelen."
      />

      {/* Welke behandelingen bij deze klacht horen, en op welk apparaat ze
          draaien. Leeg als er niets gekoppeld is; zie het component. */}
      <BehandelingenBijProbleem pad="/huidproblemen/huiduitslag" />

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
            Bij onbegrepen uitslag hoort een arts de diagnose te stellen. Weet
            je eenmaal wat het is, dan kunnen wij daarnaast aan je huidbarrière
            werken, in overleg met je arts.
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

      {/* Okan, 5 september 2026: dit behandelen we wel, alleen niet alleen. Dan
          hoort er ook een manier te staan om dat af te spreken. */}
      <PillarCta
        kop="Plan een huidconsult"
        accent="als je weet wat het is"
        tekst="Bij onbegrepen uitslag stelt een arts eerst de diagnose. Daarna kijken wij wat er aan je huidbarriere te doen valt. Weet je het nog niet, bel dan gerust; dan hoor je of het bij ons hoort of niet."
        topic="huiduitslag"
        whatsappHref={DIBA_WHATSAPP_URL}
      />
    </main>
  );
}
