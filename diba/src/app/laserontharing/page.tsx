import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ReviewsBijOnderwerp from "@/components/reviews/ReviewsBijOnderwerp";
import PillarNav from "@/components/pillar/PillarNav";
import { PillarFaq, SectieKop } from "@/components/pillar/PillarSecties";
import BeeldVignet from "@/components/ui/BeeldVignet";
import { PincetHaar } from "@/components/ui/HuidIcon";
import Label from "@/components/ui/Label";
import { FIGMA_INTENT_LASER } from "@/data/figma-home-images";
import { LASER_LANDING_FAQ, LASER_USP_ROWS } from "@/data/laser-landing";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { DIBA_SITE_URL, DIBA_WHATSAPP_URL } from "@/lib/site";
import { zoekmachineVelden } from "@/lib/seo";
import LeesVerder from "@/components/ui/LeesVerder";

/**
 * Laserontharing — de grootste commerciële pagina van de site.
 *
 * HERBOUWD, EN NIET ALLEEN QUA OPMAAK.
 *
 * Dit was de laatste pagina die nog buiten het ontwerpsysteem stond. Zes losse
 * hexkleuren, eigen kopformaten in plaats van de display-klassen, randen en
 * scheidingslijnen overal, en een eigen FAQ-implementatie naast die van de rest.
 * Daardoor week de belangrijkste pagina van de site zichtbaar af van de pagina's
 * eromheen, en week hij ook af bij elke huisstijlwijziging die daarna komt.
 *
 * Zwaarder woog wat er níet stond. Vier secties bestonden uit een label, een kop en
 * meteen een component: de configurator, het huidtype, de sessieboog en de reviews. Geen
 * enkele zin die uitlegt waarom je ernaar kijkt. Voor iemand die hier binnenkomt met de
 * vraag "kan dit bij mij en wat kost het" is dat vier keer een gereedschap zonder
 * gebruiksaanwijzing, en dat is meteen de reden dat deze pagina met 402 woorden de dunste
 * van alle grote pagina's was.
 *
 * Elke sectie heeft nu een introzin die één ding doet: zeggen welke vraag hij beantwoordt.
 *
 * WAT ER BEWUST BLIJFT.
 *
 * Het beeld in de hero, de drie punten in de strook en de volgorde van de secties. Die
 * volgorde is de trechter van deze pagina: waar wil je het, past het bij jouw huid, hoe
 * lang duurt het, wat zeggen anderen, en pas dan de vragen. Daar was niets mis mee.
 *
 * Eén donkergroen vlak: de afsluiter (§5).
 */

export const metadata: Metadata = zoekmachineVelden({
  pad: "/laserontharing",
  titel: "Laserontharing Rotterdam | GentleMax Pro",
  omschrijving:
    "Laserontharing met GentleMax Pro in Rotterdam. Bereken je prijs per zone, veilig voor huidtype I tot VI.",
});

/* De ankerbalk wijst naar de secties die er zijn. "Jouw huidtype" en "Hoeveel sessies"
   waren twee losse koppen; die zijn samengegaan in één sectie over wat het aantal sessies
   bepaalt, en "tarieven" is er nieuw bij (Yasin, 10 september 2026). */
const ANKERS = [
  { id: "zones", label: "Waar je wilt ontharen" },
  { id: "tarieven", label: "Wat het kost" },
  { id: "huidtype", label: "Hoeveel sessies" },
  { id: "reviews", label: "Reviews" },
  { id: "vragen", label: "Vragen" },
] as const;

/**
 * De drie gebieden, met wat eronder valt en waar de tarieven liggen.
 *
 * De bedragen zijn de laagste en de hoogste zone binnen dat gebied over beide
 * prijslijsten, uitgerekend uit `laser-zones.ts` en met de hand overgenomen zodat er op
 * deze pagina geen tweede rekenlaag ontstaat. Ze staan er als richting, niet als tarief:
 * de volledige tabel staat op /tarieven.
 */
const GEBIEDEN = [
  {
    id: "gelaat",
    label: "Gelaat en hals",
    vanaf: 20,
    tot: 190,
    zones:
      "Bovenlip, kin, onderkin, wangen, bakkebaard, voorhoofd, tussen de wenkbrauwen, haarlijn, hals en nek, los of als hele gelaat.",
  },
  {
    id: "bovenlichaam",
    label: "Bovenlichaam",
    vanaf: 30,
    tot: 230,
    zones:
      "Oksels, boven- en onderarmen, buik, navelstrook, borst, schouders en rug, los of als hele rug.",
  },
  {
    id: "onderlichaam",
    label: "Onderlichaam",
    vanaf: 80,
    tot: 200,
    zones:
      "Boven- en onderbenen, bikinilijn klein of groot, bilnaad en bilwangen, los of als hele benen.",
  },
] as const;

/**
 * Wat het aantal sessies bepaalt.
 *
 * Vier dingen, en geen van de vier is vooraf op een website vast te stellen. Dat is precies
 * waarom er hier geen aantal staat. [MEDISCHE-CHECK-ROJDA]
 */
const BEPAALT = [
  {
    kop: "Je huidtype",
    zin: "Hoe je huid op zon reageert, van type I tot VI. Het bepaalt met welke van de twee golflengtes er gewerkt wordt en hoeveel energie erop mag.",
  },
  {
    kop: "De kleur en dikte van je haar",
    zin: "De laser mikt op het pigment in de haarwortel. Donker en dik haar neemt het licht het best op; grijs en heel licht haar nauwelijks.",
  },
  {
    kop: "De zone",
    zin: "Op de bovenlip groeit haar sneller terug dan op een onderbeen, en dat scheelt in het aantal sessies en in de tijd ertussen.",
  },
  {
    kop: "Je hormonen",
    zin: "Bij PCOS of een andere hormonale oorzaak blijft er aanvoer van nieuw haar. Ontharen werkt dan, maar het onderhoud houdt niet vanzelf op.",
  },
] as const;

export default function LaserontharingPage() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Laserontharing", url: `${DIBA_SITE_URL}/laserontharing` },
        ])}
      />

      {/* ── Hero ──
          Donkergroen, zoals elke andere hoofdingang van de site (Yasin, 10 september
          2026). */}
      <section className="bg-[var(--g-700)] text-[var(--on-dark)]">
        {/* Op een telefoon plakte het beeld tegen de onderrand van het groene vlak: de
            tekstkolom bracht zijn eigen onderruimte mee, de beeldkolom niet (Yasin, 11
            september 2026). De ruimte tussen de twee is kleiner, en onder het beeld staat
            nu evenveel als erboven. Vanaf 1024 staan ze naast elkaar en geldt het niet. */}
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
              <span className="text-[var(--on-dark-body)]">Laserontharing</span>
            </nav>

            <h1 className="diba-display-l mt-6 max-w-[21ch] text-[var(--on-dark)]">
              Laserontharing
              <br />
              <span className="diba-accent-on-dark">in Rotterdam</span>
            </h1>

            {/* De oude tekst ging over de configurator: "hier kies je je zones en zie je
                meteen je opbouw". Die configurator staat sinds september uit, dus dat
                klopte niet meer (Yasin, 10 september 2026). Wat er nu staat is wat je hier
                wél vindt: de zones, de tarieven per zone en het huidtype. */}
            <p className="mt-7 max-w-[52ch] text-[17px] leading-8 text-[var(--on-dark-body)]">
              De haarwortel neemt het licht op en wordt uitgeschakeld. Elk
              tarief staat per zone op de tarievenpagina, dus je weet wat een
              sessie kost voordat je boekt.
            </p>
            <LeesVerder opDonker>
              <p className="mt-4 max-w-[52ch] text-[17px] leading-8 text-[var(--on-dark-body)]">
                Wat je niet vooraf krijgt is het aantal sessies. Dat hangt af
                van je huidtype, de zone en de dikte van je haar, en dat hoor je
                na de meting in plaats van nu.
              </p>
            </LeesVerder>

            <div className="mt-9 diba-knoprij">
              <Link
                href="/afspraak"
                className="diba-label inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--r-pill)] bg-[var(--on-dark-btn)] px-6 text-[var(--on-dark-btn-text)] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Afspraak maken
              </Link>
              <Link
                href="#tarieven"
                className="diba-label inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--r-pill)] border border-white/50 px-6 text-white transition-colors hover:border-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Tarieven
              </Link>
            </div>
          </div>

          <div className="relative min-h-[360px] overflow-hidden rounded-[var(--r-xl)] bg-[var(--g-400)]">
            <Image
              src={FIGMA_INTENT_LASER.src}
              alt={FIGMA_INTENT_LASER.alt}
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover object-center"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-[var(--foto-scrim)]/68 via-[var(--foto-scrim)]/12 to-transparent"
              aria-hidden="true"
            />
            <p className="diba-label absolute top-7 left-7 rounded-[var(--r-pill)] bg-white/90 px-4 py-2 text-[var(--g-700)]">
              Rotterdam
            </p>
            <p className="diba-card-title-lg absolute bottom-7 left-7 max-w-xs text-white drop-shadow-[0_2px_12px_rgba(67,79,58,.35)]">
              Rustig in de stoel.
              <br />
              Scherp in de instelling.
            </p>
          </div>
        </div>
      </section>

      {/* ── De drie punten ──
          Stond op een strook met scheidingslijnen ertussen. Drie vlakken doen hetzelfde
          zonder één lijn, en dat is de huisregel. */}
      {/* Een stilleven en geen behandelfoto, met opzet. Veiligheid is bij laser het
          onderwerp waar mensen het minst over horen en het meest over twijfelen; een bril
          op een handdoek zegt dat rustiger dan een zin erover. */}
      {/* `pt` erbij: de hero eindigt met zijn eigen beeld, en zonder ruimte erboven
          plakten de twee foto's tegen elkaar (Yasin, 10 september 2026). */}
      {/* Onderruimte kleiner dan bovenruimte: de sectie hierna brengt zijn eigen ruimte
          mee, dus die twee telden bij elkaar op (Yasin, 11 september 2026). */}
      <section className="px-5 pt-10 pb-4 sm:px-9 sm:pt-14 sm:pb-6 lg:px-[7.5vw]">
        <div className="mx-auto">
          <BeeldVignet
            src="/images/shoot/laser-met-bril.jpg"
            alt="Laserontharing met beschermbril, uitgevoerd door een huidtherapeut"
            onderschrift="Beschermbril, voor jou en voor ons"
            sizes="(min-width: 1024px) 86vw, 92vw"
            className="aspect-[16/9] lg:aspect-[21/9]"
          />
        </div>
      </section>

      <section className="bg-white px-5 py-10 sm:py-14 sm:px-9 lg:px-[7.5vw]">
        <ul className="mx-auto grid gap-4 md:grid-cols-3">
          {LASER_USP_ROWS.map(({ title, body }) => (
            <li
              key={title}
              className="rounded-[var(--r-md)] bg-[var(--g-025)] p-6 sm:p-7"
            >
              <p className="diba-card-title text-[var(--t-strong)]">{title}</p>
              <p className="mt-3 text-[15px] leading-7 text-[var(--t-body)]">
                {body}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <PillarNav ankers={ANKERS} />

      {/* ── Zones ──

          Hier stond een tekening van een lichaam waar je een gebied op aanwees, met een
          intro die verwees naar de configurator. Twee dingen mis (Yasin, 10 september
          2026): die configurator staat uit sinds september, en op een telefoon was de
          tekening een blok van driehonderd pixels waar niets in te klikken viel omdat de
          knoppen eronder buiten beeld stonden.

          Wat ervoor in de plaats staat is wat de tekening probeerde te zeggen: welke zones
          er per gebied zijn, en wat een sessie kost. De volledige tabel met alle
          tweeënzestig zones en beide prijslijsten staat op de tarievenpagina; die
          verdubbelen we hier niet. */}
      <section
        id="zones"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-050)] px-5 py-12 sm:py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <span id="tarieven" className="sr-only" />
        <div className="mx-auto">
          <SectieKop
            icoon={PincetHaar}
            label="De zones"
            kop="Waar wil je"
            accent="ontharen?"
            intro="We ontharen van de bovenlip tot de hele rug. Hieronder staat per gebied wat eronder valt en wat de goedkoopste en de duurste zone daar kost; het tarief van jouw zone staat op de tarievenpagina."
          />

          <ul className="mt-10 grid gap-4 sm:mt-12 lg:grid-cols-3">
            {GEBIEDEN.map((g) => (
              <li
                key={g.id}
                className="flex h-full flex-col rounded-[var(--r-lg)] bg-white p-6 sm:p-8"
              >
                <p className="diba-card-title text-[var(--t-strong)]">
                  {g.label}
                </p>
                <p className="diba-label mt-2 text-[var(--g-700)]">
                  {g.vanaf} tot {g.tot} euro per sessie
                </p>
                <p className="mt-4 flex-1 text-[15px] leading-7 text-[var(--t-body)]">
                  {g.zones}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-8 diba-knoprij">
            <Link
              href="/tarieven#laserontharing-per-zone"
              className="diba-label inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-[var(--on-dark)] transition-colors hover:bg-[var(--g-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
            >
              <span className="sm:hidden">Alle tarieven</span>
              <span className="max-sm:hidden">Alle tarieven per zone</span>
            </Link>
            <Link
              href="/gentlemax-pro"
              className="diba-label inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--r-pill)] border border-[var(--g-200)] px-6 text-[var(--t-strong)] transition-colors hover:border-[var(--g-700)] hover:bg-[var(--g-025)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
            >
              <span className="sm:hidden">De laser</span>
              <span className="max-sm:hidden">De laser die we gebruiken</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Huidtype ──

          Hier stond een ring die je van Fitzpatrick I tot VI kon draaien. Yasin, 10
          september 2026: "leuk, maar ik zie de meerwaarde er niet van; zet er liever
          gewoon duidelijke informatie over laserontharing neer." Dat is wat er nu staat, en
          het huidtype zelf is één van de vier dingen die het aantal sessies bepalen. */}
      {/* Op een vlak: de kaarten zijn wit en de pagina is dat bijna ook, dus zonder tint
          zie je vier alinea's in plaats van vier kaarten (Yasin, 11 september 2026). */}
      <section
        id="huidtype"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-025)] px-5 py-12 sm:py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="Goed om te weten"
            kop="Wat het aantal sessies"
            accent="bepaalt"
            intro="Niemand kan je vooraf zeggen hoeveel sessies je nodig hebt, en wie dat wel doet raadt. Deze vier dingen bepalen het, en de behandelaar stelt ze vast tijdens de intake."
          />

          <ul className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2">
            {BEPAALT.map((b) => (
              <li
                key={b.kop}
                className="rounded-[var(--r-lg)] bg-white p-6 sm:p-8"
              >
                <p className="diba-card-title text-[var(--t-strong)]">
                  {b.kop}
                </p>
                <p className="mt-3 text-[15px] leading-7 text-[var(--t-body)] sm:min-h-[4lh]">
                  {b.zin}
                </p>
              </li>
            ))}
          </ul>

          <p className="mt-8 max-w-[76ch] text-[15px] leading-7 text-[var(--t-muted)]">
            De GentleMax Pro heeft twee golflengtes, en welke van de twee je
            krijgt hangt af van je huidtype. Dat is de enige technische keuze op
            deze site die rechtstreeks over veiligheid gaat.{" "}
            <Link
              href="/gentlemax-pro"
              className="text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
            >
              Zo werkt dat
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Het reviewblok is nu een component, zodat de huidprobleempagina's hem ook
          kunnen gebruiken met reviews over hun eigen onderwerp. */}
      <ReviewsBijOnderwerp
        onderwerp="laser"
        intro="Deze komen uit Salonized en zijn niet door ons uitgekozen op inhoud. Wat er niet bij staat is een voor-en-na, want bij ontharing verandert vooral het licht op de foto en niet wat je ziet."
      />

      {/* ── Vragen ──
          Stond hier als eigen implementatie met haarlijnen, naast de PillarFaq die de
          rest van de site gebruikt. Twee accordeons met hetzelfde doel lopen bij de
          eerste wijziging uit elkaar. */}
      <PillarFaq
        items={LASER_LANDING_FAQ.map((f) => ({
          vraag: f.question,
          antwoord: f.answer,
        }))}
      />

      {/* ── Afsluiter ── */}
      <section className="mx-5 mt-16 mb-5 rounded-[var(--r-xl)] lg:mt-20 bg-[var(--g-700)] px-7 py-10 sm:py-14 text-[var(--on-dark)] sm:mx-9 sm:px-12 lg:mx-[7.5vw] lg:px-16 lg:py-20">
        <div className="mx-auto grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
          <div>
            {/* Ook deze tekst ging over de configurator, die uitstaat (Yasin, 10 september
                2026). Er staat nu wat er in de eerste afspraak gebeurt. */}
            <Label opDonker>Volgende stap</Label>
            <h2 className="diba-display-m mt-5 max-w-[18ch]">
              Het aantal sessies{" "}
              <span className="diba-accent-on-dark">
                hoor je in het consult
              </span>
            </h2>
            <p className="mt-6 max-w-[54ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
              In het consult stelt de behandelaar je huidtype vast, kijkt naar
              je haar en de zone, en zegt hoeveel sessies er realistisch nodig
              zijn en wat dat kost. Past het niet, dan hoor je dat ook.
            </p>
          </div>
          <div className="diba-knoprij">
            <Link
              href="/intake"
              className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--on-dark-btn)] px-6 text-[var(--on-dark-btn-text)] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <span className="sm:hidden">Huidconsult</span>
              <span className="max-sm:hidden">Plan een huidconsult</span>
              <span aria-hidden="true">›</span>
            </Link>
            <a
              href={DIBA_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-800)] px-6 text-[var(--on-dark)] transition-colors hover:bg-[var(--g-900)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <span className="sm:hidden">Stel je vraag</span>
              <span className="max-sm:hidden">Eerst je vraag stellen</span>
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
