import type { Metadata } from "next";
import Link from "next/link";
import Kleurwijzer from "@/components/huidverkleuring/Kleurwijzer";
import { PillarFaq, SectieKop } from "@/components/pillar/PillarSecties";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import ProofBar from "@/components/ui/ProofBar";
import {
  KLEUREN,
  KLEUR_ALARM,
  KLEUR_ZEGT_NIET,
  VERKLEURING_FAQ,
} from "@/data/huidverkleuring";
import { publicCopy } from "@/lib/copy-flags";
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
 *
 * WAT ERBIJ MOCHT, EN WAAROM JUIST DIT.
 *
 * Die redenering klopt en houdt de pagina kort, maar hij liet drie dingen weg die alleen
 * hier thuishoren en dus nergens anders gedekt worden.
 *
 * 1. Het volledige overzicht. De kleurwijzer laat één kleur tegelijk zien, dus je zag een
 *    kwart van de kaart en moest vier keer klikken om te weten of jouw geval erbij stond.
 *    Dat is precies het werk dat een wegwijzer je uit handen hoort te nemen. Twaalf routes
 *    over vier kleuren, in één blik.
 * 2. Wat de kleur níet zegt. Dit was de enige huidprobleempagina zonder tegenkolom, en
 *    juist hier is die nodig: een pagina die je op kleur laat kiezen wekt de indruk dat
 *    kleur het antwoord is. Kleur is de eerste vraag, niet de laatste.
 * 3. De alarmregel. Een plek die verandert hoort bij de huisarts, ongeacht de kleur. Dat
 *    stond weggestopt als vierde vraag in de FAQ. Het geldt voor alle vier de kleuren en
 *    kan daarom op geen van de vier doelpagina's staan; het hoort hier.
 *
 * Geen van drieën is een doorslag van pigmentvlekken, melasma, rosacea of littekens. Ze
 * gaan over het sorteren zelf, en dat is wat deze pagina is.
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
            <span className="text-[var(--t-muted)]">Huidverkleuring</span>
          </nav>

          <h1 className="diba-display-l mt-6 max-w-[16ch]">
            Begin bij de kleur.
            <br />
            <span className="diba-accent">Die zegt het meeste.</span>
          </h1>

          <p className="mt-6 max-w-[62ch] text-[16px] leading-7 text-[var(--t-body)]">
            Verkleuring is een verzamelwoord. Bruin is iets anders dan rood, en
            wit is weer een heel ander verhaal. De kleur vertelt in welke laag
            het zit, en daarmee of er iets aan te doen valt.
          </p>

          <p className="mt-4 max-w-[62ch] text-[16px] leading-7 text-[var(--t-body)]">
            Op deze pagina staat geen behandeling en geen prijs. Hij brengt je
            naar de pagina die er wel over gaat, en soms is dat de huisarts.
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
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-050)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="De kleurwijzer"
            kop="Vier kleuren,"
            accent="vier verhalen."
            intro="Je hoeft geen term te kennen om te kiezen. Kijk bij daglicht, houd je onderarm ernaast als vergelijking, en tik de kleur aan die het dichtst komt."
          />
          <Kleurwijzer />
        </div>
      </section>

      {/* ── Alle routes in één blik ──
          De kleurwijzer laat er één tegelijk zien. Wie zijn eigen geval zoekt moest dus
          vier keer klikken om te weten of het er tussen stond, en dat is precies het werk
          dat een wegwijzer je uit handen hoort te nemen. */}
      <section
        id="overzicht"
        className="scroll-mt-[var(--anker-offset)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="Alles op een rij"
            kop="Twaalf routes,"
            accent="vier kleuren."
            intro="Hierboven zie je er één kleur van tegelijk. Hier staan ze allemaal, zodat je kunt scannen in plaats van klikken. Herken je je eigen geval in geen enkele regel, dan is dat ook informatie."
          />

          <div className="mt-12 grid gap-4 sm:grid-cols-2 sm:items-start xl:grid-cols-4">
            {KLEUREN.map((k) => (
              <div
                key={k.id}
                className="rounded-[var(--r-lg)] bg-white p-6 sm:p-7"
              >
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="block h-4 w-4 shrink-0 rounded-[var(--r-pill)]"
                    style={{ background: k.staal }}
                  />
                  <p className="diba-card-title text-[var(--t-strong)]">
                    {k.naam}
                  </p>
                </div>
                <p className="mt-3 text-[14px] leading-6 text-[var(--t-muted)]">
                  {k.vraag}
                </p>
                <ul className="mt-5 space-y-2">
                  {k.routes.map((r) => (
                    <li key={r.naam + r.pad}>
                      <Link
                        href={r.pad}
                        className="block rounded-[var(--r-sm)] bg-[var(--g-025)] p-4 transition-colors hover:bg-[var(--g-050)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
                      >
                        <span className="block text-[15px] leading-6 font-medium text-[var(--t-strong)]">
                          {r.naam}
                        </span>
                        <span className="mt-1 block text-[14px] leading-6 text-[var(--t-body)]">
                          {r.wanneer}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Wat de kleur niet zegt ──
          Deze pagina was de enige huidprobleempagina zonder tegenkolom, en juist een
          pagina die je op kleur laat sorteren wekt de indruk dat kleur het antwoord is. */}
      <section className="bg-[var(--g-050)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28">
        <div className="mx-auto">
          <SectieKop
            label="De grens van deze pagina"
            kop="Wat de kleur"
            accent="niet zegt."
            intro="De kleur is de eerste vraag en niet de laatste. Hij wijst de richting aan; wat er in die richting mogelijk is hangt af van dingen die je aan de buitenkant niet ziet."
          />

          <ul className="mt-12 grid gap-4 lg:grid-cols-3 lg:items-start">
            {KLEUR_ZEGT_NIET.map((n) => (
              <li
                key={n.kop}
                className="rounded-[var(--r-lg)] bg-white p-6 sm:p-7"
              >
                <p className="diba-card-title text-[var(--t-strong)]">
                  {n.kop}
                </p>
                <p className="mt-4 text-[16px] leading-7 text-[var(--t-body)]">
                  {n.zin}
                </p>
              </li>
            ))}
          </ul>

          {/* De enige regel op deze pagina die over veiligheid gaat. Apart, want tussen
              de andere drie zou hij wegvallen, en hij geldt voor alle vier de kleuren. */}
          <div className="mt-6 rounded-[var(--r-lg)] bg-[var(--g-075)] p-6 sm:p-8">
            <p className="diba-card-title text-[var(--t-strong)]">
              {KLEUR_ALARM.kop}
            </p>
            <p className="mt-4 max-w-[76ch] text-[17px] leading-8 text-[var(--t-body)]">
              {publicCopy(KLEUR_ALARM.zin)}
            </p>
          </div>
        </div>
      </section>

      <PillarFaq items={VERKLEURING_FAQ} />

      {/* ── Afsluiting ── */}
      <section className="mx-5 mb-5 rounded-[var(--r-xl)] bg-[var(--g-700)] px-7 py-14 text-[var(--on-dark)] sm:mx-9 sm:px-12 lg:mx-[7.5vw] lg:px-16 lg:py-20">
        <div className="mx-auto lg:grid lg:grid-cols-[1.35fr_0.65fr] lg:gap-10">
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
              Twijfel je tussen twee kleuren of spelen er meerdere veranderingen
              tegelijk, laat de plek dan beoordelen.
            </p>
            <div className="mt-7">
              <Button
                href="/intake?topic=huidverkleuring"
                variant="primair-op-donker"
              >
                Plan de nulmeting
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
