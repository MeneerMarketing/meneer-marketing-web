import type { Metadata } from "next";
import Link from "next/link";
import BeeldVignet from "@/components/ui/BeeldVignet";
import FaqAccordion, { type FaqItem } from "@/components/ui/FaqAccordion";
import Label from "@/components/ui/Label";
import { behandelingVoorSlug, prijsTekst } from "@/data/behandelingen";
import { breadcrumbSchema, faqSchema, SchemaMarkup } from "@/lib/schema";
import { DIBA_SALONIZED_BOOKING_URL, DIBA_SITE_URL } from "@/lib/site";
import { zoekmachineVelden } from "@/lib/seo";

/**
 * Behandeling op advies.
 *
 * OKAN, 5 SEPTEMBER 2026: dit wordt geen extra uitlegpagina maar een keuzestress-oplosser.
 * Iemand weet wat hij wil verbeteren en niet welke behandeling daarbij hoort.
 *
 * WAAROM DIT DE ONTBREKENDE PAGINA WAS. De site telt vijfendertig behandelingen en een
 * indeling op huidwens, en dat helpt tot het moment waarop iemand tussen een peeling, een
 * laser en microneedling moet kiezen. Daar houdt zelfrapportage op: dat is een klinische
 * afweging. Elke andere pagina zegt "hoor het tijdens de intake"; deze pagina maakt daar
 * een afspraak van die je kunt boeken.
 *
 * TWEE ROUTES, EN DAT IS HET PUNT. Voor een nieuwe klant is het intake plus behandelen als
 * het kan, met twee uur gereserveerd; de intake vervalt zodra er behandeld wordt. Voor een
 * bestaande klant is er geen nieuwe intake en geen intakekosten. Die twee stonden nergens
 * uit elkaar, waardoor een vaste klant dacht dat hij opnieuw vijftig euro kwijt was.
 *
 * De behandelaar adviseert; de klant beslist mee. Dat staat er twee keer, want het is het
 * enige wat deze pagina onderscheidt van een verkooppagina.
 *
 * [GEGEVEN-NODIG: de twee diensten in Salonized aanmaken, en voor bestaande klanten
 * negentig minuten reserveren met een verplicht veld "Wat wil je laten beoordelen?"]
 */

export const metadata: Metadata = zoekmachineVelden({
  pad: "/behandeling-op-advies",
  titel: "Welke huidbehandeling past bij mij?",
  omschrijving:
    "Weet je niet welke huidbehandeling je nodig hebt? Boek een behandeling op advies. Voor nieuwe klanten met intake en voor bestaande klanten zonder nieuwe intake.",
});

const intake = behandelingVoorSlug("huidanalyse");
const intakeBedrag = intake ? prijsTekst(intake.prijs) : "een vast bedrag";

/** Waar mensen advies over vragen. In hun woorden, niet in behandelnamen. */
const HULPVRAGEN = [
  "acne, mee-eters of een onrustige huid",
  "pigmentvlekken of een ongelijkmatige teint",
  "roodheid, rosacea of zichtbare vaatjes",
  "littekens, grove poriën of een onregelmatige huidstructuur",
  "fijne lijnen, huidverslapping of algemene huidverbetering",
  "ongewenste haargroei of ingegroeide haren",
  "haaruitval of klachten aan de hoofdhuid",
  "een combinatie van verschillende huidproblemen",
  "een huidwens waarbij je niet weet welke behandeling past",
] as const;

const STAPPEN = [
  {
    kop: "Je vertelt wat je wilt verbeteren",
    zin: "Een paar korte vragen vooraf. Je hoeft geen behandeling te kiezen: we willen weten waar je last van hebt en wat je al hebt geprobeerd.",
  },
  {
    kop: "De behandelaar beoordeelt je huid",
    zin: "We kijken naar je huid, je hulpvraag en alles wat een veilige behandeling raakt: medicatie, huidproducten, eerdere reacties en zon.",
  },
  {
    kop: "Je krijgt een duidelijk advies",
    zin: "Welke behandeling het beste aansluit, waarom, en welke alternatieven er zijn. Soms is het eerlijkste advies om te wachten of niets te doen.",
  },
  {
    kop: "Behandelen als het verantwoord is",
    zin: "Past het binnen de gereserveerde tijd en ben je het eens met advies en prijs, dan kan het meteen. Zo niet, dan plannen we het samen in.",
  },
] as const;

const FAQ: FaqItem[] = [
  {
    question: "Moet ik vooraf een behandeling kiezen?",
    answer:
      "Nee. Deze afspraak is juist bedoeld voor wie niet weet welke behandeling het beste past. Het is genoeg als je kunt vertellen wat je stoort.",
  },
  {
    question: "Word ik altijd meteen behandeld?",
    answer:
      "Niet automatisch. We behandelen alleen als het op dat moment verantwoord is, als het binnen de gereserveerde tijd past en als jij akkoord bent met het advies en de prijs.",
  },
  {
    question: "Bepaalt een huidscanner welke behandeling ik krijg?",
    answer:
      "Nee. De behandelaar bepaalt wat passend is op basis van je huid, je hulpvraag en je medische achtergrond. Een huidmeting ondersteunt die beoordeling wanneer dat iets toevoegt.",
  },
  {
    question: "Kan ik aangeven wat ik zelf wel of niet wil?",
    answer:
      "Ja. Het advies komt van de behandelaar, maar de keuze maak je samen. Er wordt niets uitgevoerd zonder jouw toestemming.",
  },
  {
    question: "Wat betaal ik?",
    answer: `Ben je nieuw, dan betaal je de behandeling die wordt uitgevoerd en vervallen de intakekosten. Gebeurt er geen behandeling, dan kost de intake ${intakeBedrag}. Ben je al klant, dan betaal je alleen de behandeling die gedaan wordt. De prijs hoor je altijd voordat we beginnen.`,
  },
];

function Vinkje() {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      className="mt-1 shrink-0"
      fill="none"
      stroke="var(--g-700)"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3.5 9.5 7 13l7.5-8" />
    </svg>
  );
}

export default function BehandelingOpAdviesPage() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Behandelingen", url: `${DIBA_SITE_URL}/behandelingen` },
          {
            name: "Behandeling op advies",
            url: `${DIBA_SITE_URL}/behandeling-op-advies`,
          },
        ])}
      />
      <SchemaMarkup data={faqSchema(FAQ)} />

      {/* ── Hero ── */}
      <section className="mx-auto px-5 pt-12 pb-10 sm:px-9 lg:px-[7.5vw] lg:pt-16">
        <nav
          aria-label="Kruimelpad"
          className="diba-label flex flex-wrap gap-2"
        >
          <Link href="/" className="hover:text-[var(--g-700)]">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/behandelingen" className="hover:text-[var(--g-700)]">
            Behandelingen
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-[var(--t-muted)]">Behandeling op advies</span>
        </nav>

        <div className="mt-6 grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div>
            <h1 className="diba-display-l max-w-[16ch]">
              Ik wil een behandeling{" "}
              <span className="diba-accent">op advies</span>
            </h1>

            <p className="mt-6 max-w-[52ch] text-[17px] leading-8 text-[var(--t-body)]">
              Je weet wat je aan je huid wilt verbeteren, maar niet of daar een
              peeling, een laserbehandeling, microneedling of iets anders bij
              past. Dat hoef je niet zelf uit te zoeken.
            </p>
            <p className="mt-4 max-w-[52ch] text-[17px] leading-8 text-[var(--t-body)]">
              Vertel waar je last van hebt. De behandelaar bekijkt je huid,
              bespreekt wat er mogelijk is en geeft een duidelijk advies. Pas
              als je weet wélke behandeling wordt voorgesteld, waarom en wat het
              kost, beslis je of je hem laat uitvoeren.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={DIBA_SALONIZED_BOOKING_URL || "/intake"}
                className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-[var(--on-dark)] transition-colors hover:bg-[var(--g-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
              >
                Boek een behandeling op advies
              </Link>
              <a
                href="#routes"
                className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] border border-[var(--g-200)] px-6 text-[var(--t-strong)] transition-colors hover:border-[var(--g-700)] hover:bg-[var(--g-025)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
              >
                Nieuw of al klant?
              </a>
            </div>
          </div>

          <BeeldVignet
            src="/images/shoot/eerlijk-advies-consult.jpg"
            alt="Behandelaar bespreekt het advies met een client in de behandelkamer"
            onderschrift="De behandelaar adviseert, jij beslist mee"
            sizes="(min-width: 1024px) 44vw, 92vw"
            brandpunt={45}
            className="aspect-[4/3] lg:aspect-[5/4]"
          />
        </div>
      </section>

      {/* ── De twee routes ──
          Dit is de kern van de pagina. Een vaste klant dacht dat hij opnieuw vijftig euro
          kwijt was voor een intake die hij niet nodig heeft; dat staat hier uit elkaar. */}
      <section
        id="routes"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-050)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24"
      >
        <div className="mx-auto">
          <Label>Kies de afspraak die bij jou past</Label>
          <h2 className="diba-display-m mt-4 max-w-[20ch]">
            Twee routes,{" "}
            <span className="diba-accent">en ze kosten niet hetzelfde</span>
          </h2>

          <div className="mt-12 grid gap-4 lg:grid-cols-2 lg:items-start">
            {/* Nieuw */}
            <div className="flex h-full flex-col rounded-[var(--r-lg)] bg-white p-8 sm:p-10">
              <Label>Ik ben nieuw bij Diba</Label>
              <p className="diba-display-s mt-3 text-[var(--t-strong)]">
                Intake plus behandeling op advies
              </p>
              <p className="mt-5 text-[16px] leading-7 text-[var(--t-body)]">
                We reserveren maximaal twee uur. De afspraak begint met de
                intake: je hulpvraag, je medische achtergrond, je huidproducten
                en eerdere behandelingen. Daarna bekijkt de behandelaar je huid.
                Een huidmeting doen we alleen als die iets toevoegt.
              </p>

              <p className="diba-label mt-7 text-[var(--t-label)]">
                Daarna hoor je
              </p>
              <ul className="mt-3 space-y-2.5">
                {[
                  "welke behandeling we adviseren",
                  "waarom die bij jouw huid past",
                  "wat je ervan kunt verwachten",
                  "hoeveel behandelingen er nodig kunnen zijn",
                  "wat het kost",
                  "welke hersteltijd en nazorg erbij horen",
                ].map((r) => (
                  <li key={r} className="flex gap-3">
                    <Vinkje />
                    <span className="text-[15px] leading-7 text-[var(--t-body)]">
                      {r}
                    </span>
                  </li>
                ))}
              </ul>

              <p className="mt-7 text-[16px] leading-7 text-[var(--t-body)]">
                Is behandelen op dat moment verantwoord, past het binnen de tijd
                en wil je doorgaan? Dan gebeurt het meestal meteen.
              </p>

              <div className="mt-7 rounded-[var(--r-sm)] bg-[var(--g-025)] p-5">
                <p className="text-[15px] leading-7 text-[var(--t-body)]">
                  Je betaalt dan alleen de behandeling; de intakekosten
                  vervallen. Gebeurt er geen behandeling, dan kost de intake{" "}
                  {intakeBedrag}. De afspraak hoeft de twee uur niet vol te
                  maken.
                </p>
              </div>

              <div className="mt-auto pt-8">
                <Link
                  href={DIBA_SALONIZED_BOOKING_URL || "/intake"}
                  className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-[var(--on-dark)] transition-colors hover:bg-[var(--g-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
                >
                  Boek als nieuwe klant
                </Link>
              </div>
            </div>

            {/* Bestaand */}
            <div className="flex h-full flex-col rounded-[var(--r-lg)] bg-white p-8 sm:p-10">
              <Label>Ik ben al klant bij Diba</Label>
              <p className="diba-display-s mt-3 text-[var(--t-strong)]">
                Behandeling op advies
              </p>
              <p className="mt-5 text-[16px] leading-7 text-[var(--t-body)]">
                Je hoeft geen nieuwe intake te boeken. De behandelaar pakt je
                dossier erbij, bespreekt wat er sinds je vorige afspraak is
                veranderd en beoordeelt je huid zoals die nu is.
              </p>
              <p className="mt-4 text-[16px] leading-7 text-[var(--t-body)]">
                Daarna krijg je een behandeladvies. Vooraf hoor je welke
                behandeling het wordt en wat die kost.
              </p>

              <div className="mt-7 rounded-[var(--r-sm)] bg-[var(--g-025)] p-5">
                <p className="text-[15px] leading-7 text-[var(--t-body)]">
                  Je betaalt alleen de behandeling die daadwerkelijk gedaan
                  wordt. Er worden geen aparte intakekosten gerekend.
                </p>
              </div>

              <p className="mt-7 text-[16px] leading-7 text-[var(--t-body)]">
                Gaat het om een volledig nieuwe hulpvraag, of is er aanvullend
                onderzoek nodig? Dan kan de behandelaar adviseren om de
                behandeling op een later moment in te plannen.
              </p>

              <div className="mt-auto pt-8">
                <Link
                  href={DIBA_SALONIZED_BOOKING_URL || "/intake"}
                  className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] border border-[var(--g-200)] px-6 text-[var(--t-strong)] transition-colors hover:border-[var(--g-700)] hover:bg-[var(--g-025)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
                >
                  Boek als bestaande klant
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Waarover ── */}
      <section className="px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <Label>Waar kun je advies over vragen</Label>
            <h2 className="diba-display-m mt-4 max-w-[16ch]">
              Je hoeft de naam{" "}
              <span className="diba-accent">niet te kennen</span>
            </h2>
            <p className="mt-6 max-w-[42ch] text-[16px] leading-7 text-[var(--t-body)]">
              Het is genoeg als je kunt vertellen wat je stoort, wat je wilt
              verbeteren en hoeveel hersteltijd voor jou haalbaar is.
            </p>
          </div>

          <div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {HULPVRAGEN.map((h) => (
                <li
                  key={h}
                  className="flex gap-3 rounded-[var(--r-sm)] bg-white p-4"
                >
                  <Vinkje />
                  <span className="text-[15px] leading-7 text-[var(--t-body)]">
                    {h}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-[58ch] text-[15px] leading-7 text-[var(--t-muted)]">
              Staat jouw hulpvraag er niet tussen? Omschrijf hem kort tijdens
              het boeken, dan weten we vooraf hoeveel tijd en welke kamer we
              nodig hebben.
            </p>
          </div>
        </div>
      </section>

      {/* ── Verloop ── */}
      <section className="bg-white px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto">
          <Label>Zo verloopt je afspraak</Label>
          <h2 className="diba-display-m mt-4 max-w-[20ch]">
            Vier stappen,{" "}
            <span className="diba-accent">en jij beslist bij de laatste</span>
          </h2>

          <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STAPPEN.map((s, i) => (
              <li
                key={s.kop}
                className="rounded-[var(--r-lg)] bg-[var(--g-025)] p-6"
              >
                <span className="diba-label text-[var(--g-700)]">
                  Stap {i + 1}
                </span>
                <p className="diba-card-title mt-3 min-h-[2lh] text-[var(--t-strong)]">
                  {s.kop}
                </p>
                <p className="mt-3 text-[15px] leading-7 text-[var(--t-body)]">
                  {s.zin}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <Label>Veelgestelde vragen</Label>
            <h2 className="diba-display-m mt-4 max-w-[16ch]">
              Wat mensen <span className="diba-accent">hierover vragen.</span>
            </h2>
          </div>
          <FaqAccordion items={FAQ} />
        </div>
      </section>

      {/* ── Afsluiter ── */}
      <section className="px-5 pb-16 sm:px-9 lg:px-[7.5vw] lg:pb-24">
        <div className="mx-auto">
          <div className="rounded-[var(--r-lg)] bg-[var(--g-700)] p-8 text-[var(--on-dark)] sm:p-12">
            <Label opDonker>Beginnen</Label>
            <h2 className="diba-display-m mt-4 max-w-[22ch]">
              Vertel wat je stoort.
              <br />
              <span className="diba-accent-on-dark">
                De rest zoeken wij uit.
              </span>
            </h2>
            <p className="mt-6 max-w-[58ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
              Het advies komt van de behandelaar, de keuze maak je samen, en er
              gebeurt niets zonder dat je weet wat het is en wat het kost.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={DIBA_SALONIZED_BOOKING_URL || "/intake"}
                className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--on-dark-btn)] px-6 text-[var(--on-dark-btn-text)] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Ik ben nieuw bij Diba
              </Link>
              <Link
                href={DIBA_SALONIZED_BOOKING_URL || "/intake"}
                className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] border border-white/50 px-6 text-white transition-colors hover:border-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Ik ben al klant
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
