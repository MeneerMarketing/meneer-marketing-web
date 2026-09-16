import type { Metadata } from "next";
import Link from "@/components/ui/Linktaal";
import VideoKolom from "@/components/media/VideoKolom";
import ProfielOordeel from "@/components/huidprofiel/ProfielOordeel";
import BeeldVignet from "@/components/ui/BeeldVignet";
import { notFound } from "next/navigation";
import Werkingsvenster, {
  type WerkingsvensterApparaat,
} from "@/components/apparatuur/Werkingsvenster";
import Variantkiezer from "@/components/behandelingen/Variantkiezer";
import Label from "@/components/ui/Label";
import { toepassingenBijBehandeling } from "@/data/toepassingen";
import { videoVoor } from "@/data/videos";
import { apparatenVoorBehandeling, type Apparaat } from "@/data/apparatuur";
import { PillarFaq } from "@/components/pillar/PillarSecties";
import {
  BEHANDELINGEN,
  HUIDLAGEN,
  behandelingVoorSlug,
  prijsCijfer,
  prijsTekst,
  diepteVanLagen,
  type Behandeling,
} from "@/data/behandelingen";
import { eersteZin } from "@/lib/copy-flags";
import { TITELCLAIM } from "@/data/titelclaims";
import DibaLeafMark from "@/components/ui/DibaLeafMark";
import { BESTEMMINGEN } from "@/data/symptoomzoeker";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { zoekmachineVelden } from "@/lib/seo";
import { DIBA_SITE_URL } from "@/lib/site";
import { euro } from "@/lib/getallen";
import { t, tc } from "@/lib/vertaal";

/**
 * De behandelpagina's.
 *
 * Eén sjabloon voor alle vijf, gevoed uit `behandelingen.ts`. Dat is hier de juiste keuze
 * en bij de huidproblemen niet: die hebben elk een eigen interactie omdat elk huidprobleem
 * bij een andere vraag begint. Behandelingen beginnen allemaal bij dezelfde vraag, dus
 * verdienen ze dezelfde opbouw. Vijf keer hetzelfde met een ander accentje zou alleen maar
 * verbergen dat ze inderdaad hetzelfde zijn.
 *
 * De volgorde van de secties is niet willekeurig. Eerst wat het doet en hoe diep, dan wat
 * je ervan merkt, dan wat het níet doet, en pas daarna een knop. De meeste behandelsites
 * doen dat andersom.
 *
 * De wel- en nietlijst zijn even lang. Dat is geen toeval maar de bedoeling: een lijstje
 * van zes voordelen met één nadeeltje eronder is geen eerlijkheid maar opmaak.
 *
 * DONKERGROENE VLAKKEN: DRIE, EN DAT IS ER ÉÉN TE VEEL (§5).
 *
 * Gemeten op deze pagina: de herokaart, het nietblok en de afsluiter. Dit stond hier
 * eerder als "twee" genoteerd, maar de herokaart is altijd al donkergroen geweest en
 * werd niet meegeteld. Het waren er zelfs vier zolang het lagentrapje ook donkere balken
 * had; dat trapje is nu licht, dus het gaat de goede kant op.
 *
 * Welke van de drie licht wordt is een ontwerpkeuze en geen opruimklus, want alle drie
 * dragen ze iets: de herokaart de getallen, het nietblok de grenzen, de afsluiter de
 * uitnodiging. [BESLUIT-OKAN]
 */

type PageProps = { params: Promise<{ slug: string }> };

import { taalNu } from "@/lib/taalcontext";
export function generateStaticParams() {
  return BEHANDELINGEN.map((b) => ({ slug: b.slug }));
}

/**
 * De velden voor zoekmachines en gedeelde links.
 *
 * WAT HIER ONTBRAK. Deze functie bestond niet. `zoekmachineVelden` werd bovenaan
 * geïmporteerd en nergens aangeroepen, en daardoor hadden alle 46 behandelpagina's de titel
 * en de omschrijving van de homepage, geen canonical en geen deelbeeld. In de zoekresultaten
 * stond boven elke behandeling "Diba Clinics | Rotterdam", met dezelfde zin eronder. Gevonden
 * met een scan over de hele sitemap op 11 september 2026; de andere negentig pagina's waren
 * in orde.
 *
 * DE TITEL is de naam van de behandeling, zonder "in Rotterdam". De lokale zoekvraag is van
 * de klachtpagina's ("Acne behandelen in Rotterdam") en van de landingspagina's in de
 * kennisbank ("HydraFacial Rotterdam"). Zet je de plaats ook hier, dan concurreren drie
 * pagina's om dezelfde vraag en kiest Google er zelf een.
 *
 * Sinds 15 september 2026 staat er wel een halve regel achter die naam. "FRAC3 | Diba
 * Clinics" was twintig tekens van de zestig die Google toont, en wie niet weet wat FRAC3 is
 * wist het na dat zoekresultaat nog steeds niet. Die halve regels staan in
 * `data/titelclaims.ts`, met de afweging erbij; hier staat alleen de ladder die kiest of hij
 * past.
 *
 * DE OMSCHRIJVING is de korte zin van de behandeling met het tarief en de duur erachter, en
 * de plaats erbij als dat binnen de lengte past. Het bedrag is wat iemand in de
 * zoekresultaten het eerst zoekt.
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const b = behandelingVoorSlug(slug);
  if (!b) return {};
  const kort = tc(b.kort);
  const kortZin = /[.!?]$/.test(kort) ? kort : `${kort}.`;
  /* Deze staart werd in het Nederlands in elkaar gezet en ging daarna niet meer langs het
     woordenboek: op /en stond er "Vanaf € 170, 60 minuten. Bij Diba Clinics in Rotterdam."
     onder een verder Engelse omschrijving. Dat is precies de regel die in Google staat. */
  const bedrag =
    b.prijs > 0
      ? ` ${b.varianten && b.varianten.length > 1 ? t("Vanaf") : t("Tarief")} ${euro(b.prijs, taalNu())}${
          b.duurMinuten ? `, ${b.duurMinuten} ${t("minuten")}` : ""
        }.`
      : "";
  const kandidaten = [
    `${kortZin}${bedrag} ${t("Bij Diba Clinics in Rotterdam.")}`,
    `${kortZin}${bedrag}`,
    kortZin,
  ];
  const omschrijving =
    kandidaten.find((k) => k.length <= 158) ?? kortZin.slice(0, 155);
  /**
   * De halve regel achter de naam, als hij past.
   *
   * Zie `data/titelclaims.ts` voor waarom er geen plaatsnaam in staat en waarom die regels
   * met de hand geschreven zijn. De ladder is dezelfde als bij de omschrijving hierboven:
   * het rijkste dat binnen de maat blijft.
   *
   * WAAROM TWEEËNVIJFTIG. Er zijn drie grenzen en dit is de middelste. Onder de vijfenveertig
   * past de hele titel inclusief " | Diba Clinics" in de zestig tekens die Google toont.
   * Boven de zestig begint de claim zelf af te breken, en dat is de enige echte grens. Ertussen
   * valt alleen een stuk van de merknaam weg, en dat kost niets: wie het zoekresultaat leest
   * weet na de claim al waar hij is. Op vijfenveertig vielen vier claims er met één teken
   * buiten; die halen het nu, en de langste titel wordt zevenenzestig tekens.
   *
   * Gemeten op de vertaalde tekst en niet op de Nederlandse, want Spaans is langer. Een
   * Spaanse titel die niet past valt terug op de naam alleen, en dat is de goede uitkomst.
   */
  const claim = TITELCLAIM[b.slug] ? tc(TITELCLAIM[b.slug]) : "";
  const naam = tc(b.naam);
  const metClaim = claim ? `${naam}: ${claim}` : "";
  const titel = metClaim && metClaim.length <= 52 ? metClaim : naam;

  return zoekmachineVelden({
    pad: `/behandelingen/${b.slug}`,
    titel,
    omschrijving,
    ...(b.foto ? { beeld: { url: b.foto.src, alt: b.foto.alt } } : {}),
  });
}

/**
 * De vragen die bij elke behandeling gesteld worden.
 *
 * Ze komen uit de gegevens van de behandeling zelf, dus er wordt hier niets bedacht: de
 * duur, de hersteltijd, het aantal sessies en het bedrag staan allemaal al op de pagina.
 * Dat ze er twee keer staan is geen fout maar het punt van een vragenlijst: iemand die
 * "hoeveel hersteltijd" zoekt leest niet eerst het blok bovenaan.
 */
function basisvragen(b: Behandeling): { vraag: string; antwoord: string }[] {
  const uit: { vraag: string; antwoord: string }[] = [];
  if (b.duurMinuten) {
    uit.push({
      vraag: t("Hoe lang duurt een afspraak?"),
      antwoord: `${t("Reken op")} ${b.duurMinuten} ${t("minuten in de kliniek. Dat is de tijd die in de agenda voor je gereserveerd staat, inclusief het reinigen vooraf.")}`,
    });
  }
  uit.push({
    vraag: t("Hoeveel hersteltijd heb ik nodig?"),
    antwoord: tc(b.herstel),
  });
  uit.push({
    vraag: t("Hoe vaak moet ik komen?"),
    antwoord: tc(b.sessies, "Dat hoor je tijdens de intake."),
  });
  if (b.prijs > 0) {
    uit.push({
      vraag: t("Wat kost het?"),
      antwoord:
        b.varianten && b.varianten.length > 1
          ? `${t("Vanaf")} ${prijsCijfer(b.prijs, taalNu())} ${t("euro; het bedrag hangt af van de variant die je kiest. Alle varianten staan op de tarievenpagina.")}`
          : `${prijsCijfer(b.prijs, taalNu())} ${t("euro per sessie. Alle tarieven staan openbaar op de tarievenpagina.")}`,
    });
  }
  return uit;
}

const ANKERS = [
  { id: "werking", label: "Wat het doet" },
  { id: "afspraak", label: "In de afspraak" },
  { id: "grenzen", label: "Waar het voor is" },
  { id: "vragen", label: "Vragen" },
];

/**
 * Alleen de velden die het werkingsvenster tekent.
 *
 * Het hele apparaatrecord meegeven aan een client component zet dat record in de
 * broncode van de pagina, inclusief de redactievlaggen die erin staan.
 */
function vensterApparaat(a: Apparaat): WerkingsvensterApparaat {
  return {
    naam: a.naam,
    fasen: a.fasen,
    diepte: a.diepte,
    doelwit: a.doelwit,
    werkwijze: a.werkwijze,
    werkwijzeNaam: a.werkwijzeNaam,
  };
}

export default async function BehandelingPage({ params }: PageProps) {
  const { slug } = await params;
  const b = behandelingVoorSlug(slug);
  if (!b) notFound();

  const toepassingen = toepassingenBijBehandeling(b.slug);

  /* De eigen opname bij deze pagina, als het bestand er is. */
  const video = videoVoor(b.slug);

  /* De koppeling loopt twee kanten op: hier het apparaat, en op de apparatuurpagina de
     behandelingen die erop draaien. Beide uit dezelfde tabel. */
  const apparaten = apparatenVoorBehandeling(b.slug);

  const vragen = [...(b.faq ?? []), ...basisvragen(b)];

  /* De klachten waar deze behandeling bij hoort, met de zin van de klachtpagina erbij.
     Twee verwijzingen vallen af: het huidconsult en het overzicht van alle huidproblemen.
     Die staan elders op deze pagina al, en het zijn geen klachten. /snurken en
     /laserontharing blijven staan: dat zijn wél de pagina's waar de klacht behandeld
     wordt, ze heten alleen niet /huidproblemen. */
  const klachten = (b.bijProblemen ?? [])
    .filter((p) => p.href !== "/intake" && p.href !== "/huidproblemen")
    .map((p) => ({
      ...p,
      zin: BESTEMMINGEN.find((x) => x.pad === p.href)?.zin,
    }));

  /* De verwante behandelingen, met hun record erbij. Een slug die nergens bij hoort valt
     stil weg in plaats van een lege kaart op te leveren. */
  const verwanten = (b.verwant ?? [])
    .map(({ slug: s, waarom }) => ({
      behandeling: behandelingVoorSlug(s),
      waarom,
    }))
    .filter(
      (
        x,
      ): x is {
        behandeling: NonNullable<typeof x.behandeling>;
        waarom: string;
      } => Boolean(x.behandeling),
    );

  /* De diepste laag die geraakt wordt, en op welke plek die in de rij staat. Dat tweede
     bepaalt welke lagen erboven gepasseerd worden om er te komen. */
  const diepsteIndex = HUIDLAGEN.reduce(
    (tot, laag, i) => (b.lagen.includes(laag.id) ? i : tot),
    -1,
  );
  const diepsteLaag = diepsteIndex < 0 ? null : HUIDLAGEN[diepsteIndex];

  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: t("Behandelingen"), url: `${DIBA_SITE_URL}/behandelingen` },
          { name: b.naam, url: `${DIBA_SITE_URL}/behandelingen/${b.slug}` },
        ])}
      />

      {/* ── De hero ──

          Het groene blok stond in een eigen kolom naast alles wat links stond: kruimelpad,
          kop, foto, omschrijving en knoppen. Daardoor was het net zo hoog als die hele
          kolom en liep het ruim onder de foto door, met een leeg groen vlak als gevolg.

          Nu staan de foto en het blok samen in een eigen rij met `items-stretch`. Die twee
          zijn daarmee per definitie even hoog: de een kan niet groeien zonder de ander. De
          kop staat erboven en de omschrijving eronder, allebei over de volle breedte.

          Dat laatste is meteen waarom de omschrijving nu op één regel past. Hij stond in
          een kolom van nog geen halve pagina en brak daardoor telkens af halverwege een
          zin die als geheel bedoeld is. */}
      <section className="mx-auto px-5 sm:px-9 lg:px-[7.5vw]">
        <div className="py-10 sm:py-14 lg:py-20">
          <nav
            aria-label={t("Kruimelpad")}
            className="diba-label flex flex-wrap gap-2"
          >
            <Link href="/" className="hover:text-[var(--g-700)]">
              {t("Home")}
            </Link>
            <span aria-hidden="true">/</span>
            {/* Op een telefoon staat hier alleen Home en de pagina waar je bent. "Home /
                Behandelingen / Medische peelings" is veertig tekens in kleine kapitalen met
                letterafstand, en dat is vijf pixels breder dan een telefoon (Yasin, 10
                september 2026: "de breadcrumb moet altijd op één regel"). Vanaf 640 pixels
                staat het hele pad er weer. */}
            <Link href="/behandelingen" className="hover:text-[var(--g-700)]">
              {t("Behandelingen")}
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-[var(--t-muted)]">
              {t(b.naamKort ?? b.naam)}
            </span>
          </nav>

          <h1 className="diba-display-l mt-4 max-w-[21ch] sm:mt-6">
            {t(b.naamKort ?? b.naam)}
          </h1>

          {/* ── De rij: wat je ziet, naast wat je moet weten ── */}
          <div
            className={`mt-6 grid gap-6 sm:mt-8 lg:items-stretch ${
              b.foto ? "lg:grid-cols-[1.08fr_0.92fr]" : ""
            }`}
          >
            {b.foto ? (
              <BeeldVignet
                src={b.foto.src}
                alt={tc(b.foto.alt)}
                /* De apparaatnaam er alleen achter zetten als hij niet al in de
                   behandelnaam staat. Bij "Consult met EVE-M huidanalyse" werd het anders
                   "Consult met EVE-M huidanalyse, EVE-M" (Yasin, 10 september 2026). */
                onderschrift={
                  b.apparaat &&
                  !b.naam.toLowerCase().includes(b.apparaat.toLowerCase())
                    ? `${tc(b.naam)}, ${b.apparaat}`
                    : b.naam
                }
                priority
                sizes="(min-width: 1024px) 52vw, 92vw"
                className="aspect-[16/10] sm:aspect-[4/3] lg:aspect-auto lg:min-h-[520px]"
              />
            ) : null}

            {/* De getallen die het verschil maken, meteen in beeld.
                De inhoud krijgt een maximumbreedte. Zonder die grens rekte elke regel mee
                met het vlak: op een scherm van 1600 stond "Hoe diep" links en "Opperhuid"
                elfhonderd pixels verderop tegen de rechterrand, met een gat ertussen
                (Yasin, 12 september 2026: "zit die content in de hero rechts geplakt aan
                de rand"). Tot ongeveer 1200 verandert er niets; daarboven blijft het blok
                lezen zoals het op een laptop leest. */}
            <div className="flex flex-col justify-center rounded-[var(--r-lg)] bg-[var(--g-700)] p-6 text-[var(--on-dark)] sm:p-10">
              <div className="w-full lg:mx-auto lg:max-w-[30rem]">
                <Label opDonker>{t("In het kort")}</Label>
                {/* Vier regels op een eigen vlak in plaats van achter een haarlijn: de
                  huisregel is vullingen, en op --g-800 haalt de tekst 7,57 tegen 4,08 op
                  een doorschijnend wit vlak. "Hoe lang" is er nieuw bij; dat is de vraag
                  die bepaalt of je er vrij voor moet nemen. */}
                <dl className="mt-6 space-y-2">
                  {[
                    [
                      "Hoe diep",
                      diepsteLaag
                        ? t(diepsteLaag.naam)
                        : t("Meet, zonder aanraking"),
                    ] as const,
                    b.duurMinuten
                      ? ([
                          "Hoe lang",
                          `${b.duurMinuten} ${t("minuten")}`,
                        ] as const)
                      : null,
                    ["Herstel", t(eersteZin(tc(b.herstel)))] as const,
                    [
                      "Hoe vaak",
                      t(eersteZin(tc(b.sessies, "Nog niet vastgesteld"))),
                    ] as const,
                  ]
                    .filter(
                      (rij): rij is NonNullable<typeof rij> => rij !== null,
                    )
                    .map(([kop, waarde]) => (
                      /* Op een telefoon onder elkaar en niet naast elkaar. Naast een
                       opschrift van vier tekens blijft er 180 pixels over voor het
                       antwoord, en daar liep "Je gaat meteen door met je dag..." over vier
                       regels in (Yasin, 10 september 2026). Onder elkaar krijgt het
                       antwoord de hele breedte en past het in twee. */
                      <div
                        key={kop}
                        className="rounded-[var(--r-sm)] bg-[var(--g-800)] px-4 py-3 sm:flex sm:items-baseline sm:justify-between sm:gap-6 sm:px-5 sm:py-4"
                      >
                        <dt className="diba-label diba-label-on-dark shrink-0">
                          {t(kop)}
                        </dt>
                        <dd className="diba-card-title max-sm:mt-1 max-sm:text-[15px] max-sm:leading-6 sm:text-right">
                          {tc(waarde)}
                        </dd>
                      </div>
                    ))}
                </dl>

                {/* De prijs staat buiten de dl, want het is geen enkel getal meer maar een
                    keuze. Alle varianten even zichtbaar, ook de duurste. */}
                <div className="mt-4">
                  <Variantkiezer
                    varianten={b.varianten ?? []}
                    basisprijs={b.prijs}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Wat er bij deze bezoeker uit het huidprofiel kwam.

              Staat direct onder de rij en boven de omschrijving: als deze behandeling bij
              jou is afgevallen, hoor je dat te lezen voordat je de verkooptekst leest en
              niet erna. Zonder ingevuld profiel rendert hij niets. */}
          <ProfielOordeel slug={b.slug} />

          {/* ── Onder de rij, over de volle breedte ── */}
          <p className="mt-6 text-[17px] leading-8 text-[var(--t-body)] sm:mt-8">
            {tc(b.kort)}
          </p>

          {/* De landingspagina in de kennisbank, als die er is. Zie het veld `landing` in
              behandelingen.ts voor waarom deze verwijzing er hoort te staan. */}
          {b.landing ? (
            <p className="mt-3 text-[16px] leading-7 text-[var(--t-muted)]">
              {t(b.landing.zin)}{" "}
              <Link
                href={b.landing.href}
                className="text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
              >
                {t(b.landing.tekst)}
              </Link>
              .
            </p>
          ) : null}

          {/* Hier stond "We doen dit met <apparaat>". Yasin, 10 september 2026: eraf, samen
              met de cijferbalk eronder. De verwijzing naar het apparaat zelf is niet
              verdwenen; die staat nu in "Wat het doet", bij het venster dat laat zien hoe
              diep het komt. Daar hoort hij ook, want dan weet je waar het over gaat. */}

          <div className="diba-knoprij mt-8">
            <Link
              href="/afspraak"
              className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-white transition-colors hover:bg-[var(--g-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
            >
              <span className="sm:hidden">{t("Plan consult")}</span>
              <span className="max-sm:hidden">{t("Plan een huidconsult")}</span>
            </Link>
            <Link
              href="/behandelingen"
              className="diba-label text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)] max-sm:inline-flex max-sm:min-h-12 max-sm:items-center max-sm:justify-center"
            >
              <span className="sm:hidden">{t("Vergelijk")}</span>
              <span className="max-sm:hidden">
                {t("Vergelijk met de rest")}
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* De balk met vier cijfers stond hier. Yasin, 10 september 2026: te veel, op elk
          scherm. Het cijfer staat al in de balk bovenaan elke pagina. */}

      <nav
        aria-label={t("Op deze pagina")}
        className="sticky top-[var(--nav-h)] z-20 bg-[var(--g-010)]/95 backdrop-blur"
      >
        <ul className="diba-schuifrij mx-auto flex gap-6 px-5 py-4 sm:px-9 lg:px-[7.5vw]">
          {ANKERS.map((a) => (
            <li key={a.id}>
              <a
                href={`#${a.id}`}
                className="diba-label whitespace-nowrap hover:text-[var(--g-700)]"
              >
                {t(a.label)}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── Werking ── */}
      <section
        id="werking"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-050)] px-5 py-10 sm:py-16 sm:px-9 lg:px-[7.5vw] lg:py-24"
      >
        <div className="mx-auto">
          <Label>{t("Wat het doet")}</Label>
          <h2 className="diba-display-m mt-4 max-w-[20ch]">
            {diepsteLaag ? t("Waar het aankomt") : t("Wat het oplevert")}
          </h2>
          <p className="mt-6 max-w-[64ch] text-[16px] leading-7 text-[var(--t-body)]">
            {tc(b.werking)}
          </p>

          {/* Draait deze behandeling op een apparaat, dan hoort het mechaniek erbij.

              De diepte komt uit de lagen van deze behandeling en niet uit het apparaat:
              de Fotona haalt vijfentachtig procent, maar niet elke behandeling erop gaat
              zo diep. Het apparaat levert het hoe, de behandeling bepaalt het hoever. */}
          {apparaten.length > 0 ? (
            <p className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[15px] leading-7 text-[var(--t-body)]">
              <span className="text-[var(--t-muted)]">
                {t("Dit draait op")}
              </span>
              {apparaten.map((a, i) => (
                <span key={a.slug}>
                  <Link
                    href={`/apparatuur/${a.slug}`}
                    className="font-medium text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
                  >
                    {tc(a.naam)}
                  </Link>
                  {i < apparaten.length - 1 ? <span>,</span> : null}
                </span>
              ))}
            </p>
          ) : null}

          {apparaten.length > 0 && b.lagen.length > 0 ? (
            <div className="mt-10">
              <Werkingsvenster
                apparaat={vensterApparaat(apparaten[0])}
                diepte={diepteVanLagen(b.lagen)}
              />
            </div>
          ) : null}

          {/* Op een telefoon staat de lagenlijst uit (Yasin, 10 september 2026). Vier
              rijen met een naam, een zin, een diepte en een oordeel ernaast worden op 375
              pixels acht regels per rij; je scrolt er langs zonder te lezen. Het venster
              erboven laat dezelfde diepte zien in één beeld. */}
          {/* De lagen in woorden.

              Dit was een trapje met donkergroene balken, en dat werkte tot de doorsnede
              erboven kwam te staan. Twee keer hetzelfde signaal geven is niet dubbel zo
              duidelijk maar half zo rustig, en het luidste van de twee wint dan van het
              nauwkeurigste. De tekening zegt nu waar het aankomt; deze lijst voegt toe
              wat elke laag eigenlijk is. */}
          <ul className="mt-10 divide-y divide-[var(--g-100)] overflow-hidden rounded-[var(--r-md)] bg-white max-lg:hidden">
            {HUIDLAGEN.map((laag, i) => {
              const raakt = b.lagen.includes(laag.id);
              /* Een laag waar niet gewerkt wordt maar die wel boven de diepste ligt,
                 wordt gepasseerd. Een naald die tot in de lederhuid komt gaat nu
                 eenmaal door de hoornlaag heen, en "blijft onaangeroerd" zou daar de
                 tekening tegenspreken. */
              const doorheen = !raakt && i < diepsteIndex;
              return (
                <li
                  key={laag.id}
                  className="flex flex-wrap items-baseline gap-x-5 gap-y-1 p-5"
                >
                  <span className="flex w-[13rem] shrink-0 items-baseline gap-2.5">
                    <span
                      aria-hidden="true"
                      className={`h-2.5 w-2.5 shrink-0 translate-y-[-1px] rounded-full ${
                        raakt
                          ? "bg-[var(--g-700)]"
                          : doorheen
                            ? "bg-[var(--g-400)]"
                            : "bg-[var(--g-200)]"
                      }`}
                    />
                    <span
                      className={`text-[15px] leading-6 ${
                        raakt
                          ? "font-medium text-[var(--t-strong)]"
                          : doorheen
                            ? "text-[var(--t-body)]"
                            : "text-[var(--t-muted)]"
                      }`}
                    >
                      {t(laag.naam)}
                    </span>
                  </span>
                  <span
                    className={`flex-1 text-[14px] leading-6 ${
                      raakt || doorheen
                        ? "text-[var(--t-body)]"
                        : "text-[var(--t-muted)]"
                    }`}
                  >
                    {t(laag.zin)}
                  </span>
                  <span
                    className={`diba-label shrink-0 ${
                      raakt || doorheen
                        ? "text-[var(--t-label)]"
                        : "text-[var(--t-muted)]"
                    }`}
                  >
                    {/* "Blijft onaangeroerd" zei niet wat het betekende (Yasin, 10
                        september 2026: "wazig en niet duidelijk"). Wat een bezoeker wil
                        weten is of deze behandeling daar komt, en het antwoord is ja, hij
                        gaat er alleen doorheen, of nee. Zo staat het er nu. */}
                    {raakt
                      ? t("Hier werkt het")
                      : doorheen
                        ? t("Gaat hier doorheen")
                        : t("Komt hier niet")}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ── In de afspraak ──

          De sectie hing eerst aan `b.stappen`, en vijf behandelingen hebben die niet. Dat waren
          precies de vijf dunste pagina's van de reeks. Nu draagt hij zichzelf zodra er iets
          in te zetten valt: de stappen als die er zijn, en anders het verloop van de
          afspraak. */}
      {/* Hier stond een reviewregel tussen twee blokken. Yasin, 10 september 2026: eraf.
          Hij had alleen ruimte erboven en niet eronder, dus hij plakte tegen de sectie die
          erop volgde, en hij is op deze pagina ook niet nodig: het cijfer staat al in de
          balk bovenaan en de reviews staan op /reviews. */}

      {b.stappen?.length || b.inDeStoel?.length ? (
        <section
          id="afspraak"
          /* Op een vlak, want de kaarten met de stappen zijn wit en de pagina is dat
             bijna ook. Yasin, 10 september 2026: "oogt nu te wit en saai." */
          className="scroll-mt-[var(--anker-offset)] bg-[var(--g-025)] px-5 py-10 sm:py-16 sm:px-9 lg:px-[7.5vw] lg:py-24"
        >
          <div className="mx-auto">
            <Label>{t("In de afspraak")}</Label>
            {b.stappen?.length ? (
              <h2 className="diba-display-m mt-4 max-w-[20ch]">
                {t("Wat er gebeurt,")}
                <br />
                <span className="diba-accent">{t("in volgorde.")}</span>
              </h2>
            ) : null}

            {/* Geen "Stap 1, Stap 2, Stap 3" boven deze kaarten. De kop erboven zegt al
                "in volgorde", de kaarten staan van links naar rechts, en het is een
                genummerde lijst. Drie keer dezelfde mededeling, waarvan er twee alleen
                als opmaak leesbaar zijn. */}
            {/* Okan, 10 september 2026: "belangrijk detail, elke behandeling wordt vooraf
                handmatig gereinigd zodat alle talg ook handmatig wordt verwijderd en
                nagelopen." Dat geldt voor alle behandelingen, dus het staat hier in plaats
                van in de stappen van elke behandeling apart: dan zou het vijfenveertig keer
                overgeschreven worden en na de eerste wijziging uit elkaar lopen. */}
            <p className="mt-6 max-w-[62ch] text-[17px] leading-8 text-[var(--t-body)]">
              {t(
                "Elke behandeling begint met reinigen, en dat gaat met de hand. Make-up en talg gaan eraf en de behandelaar loopt na of alles weg is, want een apparaat of een werkstof die op een laagje werkt komt niet bij je huid.",
              )}
            </p>

            {b.stappen?.length ? (
              <ol className="mt-8 grid gap-4 sm:mt-10 md:grid-cols-3">
                {b.stappen.map((s) => (
                  <li
                    key={tc(s.kop)}
                    className="rounded-[var(--r-md)] bg-white p-7 sm:p-8"
                  >
                    <p className="diba-card-title text-[var(--t-strong)]">
                      {tc(s.kop)}
                    </p>
                    {/* Laatste blok van de kaart: het raster rekt de kaarten al tot
                        dezelfde hoogte. Zie `huidproblemen/striae/page.tsx`. */}
                    <p className="mt-3 text-[15px] leading-7 text-[var(--t-body)]">
                      {tc(s.zin)}
                    </p>
                  </li>
                ))}
              </ol>
            ) : null}

            {/* Hoe het voelt.

                De drie kaarten hierboven vertellen wat het apparaat doet, en dat staat ook
                op de apparatuurpagina. Dit is het deel dat alleen hier hoort: wat jij ervan
                merkt, en wat je erna wel en niet kunt. Dat is de vraag waarmee iemand op
                deze pagina komt. */}
            {b.inDeStoel?.length ? (
              <div
                className={`grid gap-4 lg:items-stretch ${
                  b.fotoInDeStoel ? "lg:grid-cols-2" : ""
                } ${b.stappen?.length ? "mt-14" : "mt-4"}`}
              >
                {/* Links de foto, rechts het groene vlak, allebei even hoog.

                    De foto stond eerst onder de kop in een smalle kolom met de tekst
                    ernaast. Bij Nordlys was die foto bijna achthonderd pixels hoog en de
                    tekst tweehonderd, dus stond er rechts zeshonderd pixels wit.

                    `lg:items-stretch` met `lg:aspect-auto` laat de kortste van de twee
                    meegroeien met de langste, wie dat ook is. Dezelfde opbouw als de hero
                    bovenaan deze pagina, dus het leest als een herhaling. */}
                {b.fotoInDeStoel ? (
                  <BeeldVignet
                    src={b.fotoInDeStoel.src}
                    alt={tc(b.fotoInDeStoel.alt)}
                    /* Zonder onderschrift geen verloop, en dan is het een kale foto in een
                       groen vlak (Yasin, 11 september 2026: "die foto is te droog"). Niet
                       alleen de naam, want die staat al onder de hero; hier hoort erbij dat
                       dit de behandeling zelf is. */
                    onderschrift={`${tc(b.naam)}${t(", tijdens de behandeling")}`}
                    sizes="(min-width: 1024px) 46vw, 92vw"
                    className="aspect-[4/3] sm:aspect-[3/2] lg:aspect-auto lg:min-h-[520px]"
                  />
                ) : null}

                <div className="flex flex-col justify-center rounded-[var(--r-lg)] bg-[var(--g-700)] p-8 text-[var(--on-dark)] sm:p-10 lg:p-12">
                  <Label opDonker>{t("Hoe het voelt")}</Label>
                  {b.stappen?.length ? (
                    <h3 className="diba-display-s mt-4 max-w-[18ch]">
                      {t("Wat je ervan")}{" "}
                      <span className="diba-accent-on-dark">
                        {t("merkt in de stoel")}
                      </span>
                    </h3>
                  ) : (
                    <h2 className="diba-display-m mt-4 max-w-[18ch]">
                      {t("Wat je ervan")}{" "}
                      <span className="diba-accent-on-dark">
                        {t("merkt in de stoel")}
                      </span>
                    </h2>
                  )}

                  <div className="mt-6 max-w-[52ch] space-y-4">
                    {b.inDeStoel.map((alinea) => (
                      <p
                        key={tc(alinea).slice(0, 40)}
                        className="text-[16px] leading-7 text-[var(--on-dark-body)]"
                      >
                        {tc(alinea)}
                      </p>
                    ))}
                  </div>

                  {/* Deze knop staat er niet om het vlak te vullen. Iemand heeft net
                      gelezen hoe de behandeling voelt, en dat is het moment waarop de
                      vraag "en nu" komt. */}
                  <Link
                    href="/afspraak"
                    className="diba-label mt-8 inline-flex min-h-12 w-fit items-center gap-2 rounded-[var(--r-pill)] bg-[var(--on-dark-btn)] px-6 text-[var(--on-dark-btn-text)] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    {t("Plan een huidconsult")}
                  </Link>
                </div>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* ── Wel en niet ── */}
      {/* `wel` en `niet` heten nog zo in de data, maar `niet` draagt sinds vandaag de
          route: waarom deze behandeling het niet is, en welke het dan wel is. Een grens
          zonder vervolg stuurt iemand de deur uit; met vervolg is het een verwijzing.

          Links en rechts hebben evenveel regels, dat blijft. */}
      {b.wel?.length || b.niet?.length ? (
        <section
          id="grenzen"
          className="scroll-mt-[var(--anker-offset)] bg-[var(--g-050)] px-5 py-10 sm:py-16 sm:px-9 lg:px-[7.5vw] lg:py-24"
        >
          <div className="mx-auto">
            <Label>{t("Waar het voor is")}</Label>
            <h2 className="diba-display-m mt-4 max-w-[24ch]">
              {t(b.welNietKop?.kop ?? "Waar deze behandeling")}{" "}
              <span className="diba-accent">
                {t(b.welNietKop?.accent ?? "voor bedoeld is")}
              </span>
            </h2>
            <p className="mt-6 max-w-[62ch] text-[16px] leading-7 text-[var(--t-body)]">
              {t(
                "Links waar deze behandeling goed werkt, rechts wanneer een andere behandeling meer voor je doet.",
              )}
            </p>

            <div className="mt-8 sm:mt-12 grid gap-8 lg:grid-cols-2 lg:gap-12">
              <div>
                <Label>{t("Hier werkt het goed bij")}</Label>
                <ul className="mt-5 space-y-3">
                  {(b.wel ?? []).map((w) => (
                    <li
                      key={tc(w)}
                      className="rounded-[var(--r-sm)] bg-white p-5 text-[16px] leading-7 text-[var(--t-body)]"
                    >
                      {tc(w)}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <Label>{t("Hiervoor kies je iets anders")}</Label>
                <ul className="mt-5 space-y-3">
                  {(b.niet ?? []).map((n) => (
                    <li
                      key={tc(n)}
                      className="rounded-[var(--r-sm)] bg-[var(--g-700)] p-5 text-[16px] leading-7 text-[var(--on-dark-body)]"
                    >
                      {tc(n)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Hier stond een rij pillen "Komt vaak voor bij". Die is een eigen sectie
                geworden, verderop, met bij elke klacht de zin die op de klachtpagina zelf
                ook boven staat (Yasin, 10 september 2026). */}
          </div>
        </section>
      ) : null}

      {/* De eigen opname bij deze pagina, als die er is. Het onderdeel staat er
          niet zolang het bestand ontbreekt; zie data/videos.ts. */}
      {video ? <VideoKolom video={video} achtergrond="wit" /> : null}

      {/* Voor wie halverwege denkt: is dit het wel? Zonder dit blok is de enige uitweg
          terug naar het overzicht, waar dezelfde twijfel opnieuw begint. */}
      {/* Even veel ruimte boven als onder. Dit blok had alleen `pb-4`, dus het plakte
          tegen de sectie erboven en had eronder wel lucht (Yasin, 10 september 2026). */}
      <section className="px-5 py-8 sm:px-9 sm:py-10 lg:px-[7.5vw]">
        <div className="mx-auto">
          <Link
            href="/behandeling-op-advies"
            className="flex flex-col gap-4 rounded-[var(--r-lg)] bg-[var(--g-050)] p-6 transition-colors duration-300 [transition-timing-function:var(--ease-diba)] hover:bg-[var(--g-075)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:p-8"
          >
            <span>
              <span className="diba-card-title block text-[var(--t-strong)]">
                {t("Weet je niet of deze behandeling bij je past?")}
              </span>
              <span className="mt-2 block max-w-[62ch] text-[15px] leading-7 text-[var(--t-body)]">
                {t(
                  "Boek een behandeling op advies. De behandelaar bekijkt je huid en kiest, en je hoort vooraf wat het wordt en wat het kost.",
                )}
              </span>
            </span>
            <span className="diba-label inline-flex min-h-12 shrink-0 items-center gap-2 rounded-[var(--r-pill)] bg-white px-6 text-[var(--t-strong)]">
              {t("Naar advies")}
            </span>
          </Link>
        </div>
      </section>

      {/* ── Bij welke klachten ──

          Yasin, 10 september 2026: "ik mis op de behandelingenpagina's een sectie die de
          behandeling koppelt aan de huidproblemen die ermee behandeld worden, dat is goed
          voor de interne links en het maakt doorklikken interessant."

          De koppeling zat er wel, als een rij pillen onderin de grenzensectie: een naam en
          verder niets. Hier staat bij elke klacht de zin die op de klachtpagina zelf ook
          bovenaan staat, zodat je weet waar je heen klikt. De zinnen komen uit
          `BESTEMMINGEN`, dezelfde bron als de symptoomzoeker en het menu, dus ze lopen
          niet uit elkaar.

          Verwijzingen die geen klachtpagina zijn (het huidconsult, het overzicht) vallen
          eruit: die staan elders op deze pagina al. */}
      {klachten.length > 0 ? (
        <section className="px-5 py-10 sm:py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
          <div className="mx-auto">
            <Label>{t("Waarvoor mensen hiermee komen")}</Label>
            <h2 className="diba-display-m mt-4 max-w-[22ch]">
              {t("De klachten waar dit")}{" "}
              <span className="diba-accent">{t("bij hoort")}</span>
            </h2>
            <p className="mt-6 max-w-[62ch] text-[16px] leading-7 text-[var(--t-body)]">
              {t(
                "Op elke klachtpagina staat wat de klacht is, wat eraan te doen is en wanneer een andere aanpak meer oplevert.",
              )}
            </p>

            <ul className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3">
              {klachten.map((k) => (
                <li key={k.href}>
                  <Link
                    href={k.href}
                    className="group flex h-full flex-col rounded-[var(--r-lg)] border border-[var(--g-100)] bg-white p-6 transition-colors duration-300 [transition-timing-function:var(--ease-diba)] hover:border-[var(--g-700)] hover:bg-[var(--g-025)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
                  >
                    <span className="diba-card-title text-[var(--t-strong)]">
                      {t(k.label)}
                    </span>
                    {k.zin ? (
                      <span className="mt-3 flex-1 text-[15px] leading-7 text-[var(--t-body)]">
                        {t(k.zin)}
                      </span>
                    ) : null}
                    <span className="diba-label mt-5 inline-flex items-center gap-1.5 text-[var(--g-700)]">
                      {t("Lees over")} {tc(k.label).toLowerCase()}
                      <span
                        aria-hidden="true"
                        className="transition-transform duration-200 group-hover:translate-x-0.5"
                      >
                        ›
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* ── Waar we dit voor gebruiken ──
          De toepassingen van deze behandeling: dezelfde techniek, per klacht uitgeschreven.
          Zonder deze ingang zijn die pagina's alleen via de sitemap te vinden. */}
      {toepassingen.length > 0 ? (
        <section className="bg-[var(--g-050)] px-5 py-10 sm:py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
          <div className="mx-auto">
            <Label>{t("Waar we dit voor gebruiken")}</Label>
            <h2 className="diba-display-m mt-4 max-w-[22ch]">
              {t("Dezelfde techniek,")}{" "}
              <span className="diba-accent">
                {t("per klacht uitgeschreven")}
              </span>
            </h2>
            <p className="mt-6 max-w-[58ch] text-[16px] leading-7 text-[var(--t-body)]">
              {t(
                "Wat er anders gaat aan de instelling, wat je kunt verwachten en wanneer je hier beter iets anders voor kiest.",
              )}
            </p>
            <ul className="mt-8 sm:mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {toepassingen.map((toep) => (
                <li key={toep.slug}>
                  <Link
                    href={`/behandelingen/${toep.behandeling}/${toep.slug}`}
                    className="flex h-full flex-col rounded-[var(--r-lg)] bg-white p-6 transition-colors duration-300 [transition-timing-function:var(--ease-diba)] hover:bg-[var(--g-025)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
                  >
                    <p className="diba-card-title sm:min-h-[2lh] text-[var(--t-strong)]">
                      {tc(toep.naam)}
                    </p>
                    <p className="mt-3 text-[15px] leading-7 text-[var(--t-body)]">
                      {tc(toep.intro).split(". ")[0]}.
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* ── Hoort hierbij ──

          Fotona 4D bestaat uit vier andere behandelingen die elk een eigen pagina hebben.
          Zonder dit blok zijn dat vijf losse pagina's die toevallig op hetzelfde apparaat
          draaien, en moet de bezoeker zelf bedenken dat SmoothLiftin de eerste stap is.

          De reden per behandeling is het punt: een rijtje namen zegt niets. */}
      {verwanten.length > 0 ? (
        <section className="px-5 py-10 sm:py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
          <div className="mx-auto">
            <Label>{t("Hoort hierbij")}</Label>
            <h2 className="diba-display-m mt-4 max-w-[22ch]">
              {t("Wat er")}{" "}
              <span className="diba-accent">{t("bij aansluit")}</span>
            </h2>

            <ul className="mt-8 sm:mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {verwanten.map(({ behandeling: v, waarom }) => (
                <li
                  key={v.slug}
                  className="flex flex-col rounded-[var(--r-md)] bg-white p-7 sm:p-8"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h3 className="diba-card-title">{tc(v.naam)}</h3>
                    <span className="text-[15px] leading-6 text-[var(--t-muted)] tabular-nums">
                      {tc(prijsTekst(v.prijs, taalNu()))}
                    </span>
                  </div>
                  <p className="mt-3 grow text-[15px] leading-7 text-[var(--t-body)]">
                    {tc(waarom)}
                  </p>
                  <Link
                    href={`/behandelingen/${v.slug}`}
                    className="diba-label mt-5 border-t border-[var(--g-100)] pt-5 text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
                  >
                    {t("Wat het inhoudt")}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* ── Vragen ──

          Hier stond een eigen opmaak: kop bovenaan over de volle breedte, daaronder de
          vragen in een kolom van 64 tekens tegen de linkerrand. Op een breed scherm is dat
          een smal strookje met een half leeg vlak ernaast, terwijl elke andere sectie op
          deze site kop links en inhoud rechts zet.

          Het was bovendien een tweede kopie van PillarFaq, die datzelfde doet mét de
          indeling van de rest en de vragen ook aanmeldt bij Google. Dat laatste deden deze
          pagina's dus niet. */}
      {/* Yasin, 10 september 2026: "waarom staat er bij veelgestelde vragen maar één
          vraag? Dat slaat nergens op, doe er minimaal drie of vier." Vijftien behandelingen
          hadden er geen, dertien hadden er een of twee. De eigen vragen staan voorop; daarna
          komen de vier die iedereen stelt en waarvan het antwoord al in deze pagina staat:
          hoe lang, welke hersteltijd, hoe vaak en wat het kost. Blijft het onder de drie,
          dan staat de sectie er niet.

          Het onderwerp is de vertaalde naam, niet de Nederlandse in kleine letters: het
          label zet hem toch in kapitalen, en `t()` kent de Nederlandse naam alleen met
          hoofdletters. Met kleine letters stond er "Over nordlys ipl bij pigment" op
          /en en /es. */}
      {vragen.length >= 3 ? (
        <PillarFaq items={vragen} onderwerp={tc(b.naam)} />
      ) : null}

      {/* ── Afsluiter ── */}
      {/* Geen onderruimte hier: de voettekst brengt die mee. Stond dit er wel, dan
          telde het op tot honderdvierenveertig pixels tussen het groene vlak en de eerste
          lijn van de voettekst, en dat is te veel. */}
      <section className="px-5 pt-10 sm:pt-16 sm:px-9 lg:px-[7.5vw] lg:pt-20">
        <div className="mx-auto">
          {/* Het blad groot en doorschijnend in de hoek, zoals in de afsluiter van
              /behandelingen. Yasin, 10 september 2026: "dat vind ik mooi, kun je dat vaker
              toepassen?" Hier dus ook, en op /intake, /huidprofiel en /apparatuur. */}
          <div className="relative overflow-hidden rounded-[var(--r-lg)] bg-[var(--g-700)] p-8 text-[var(--on-dark)] sm:p-12">
            <DibaLeafMark
              aria-hidden="true"
              className="pointer-events-none absolute -right-6 -bottom-10 h-[260px] w-[260px] -rotate-12 opacity-20"
            />
            <div className="relative">
              <Label opDonker>{t("De eerste afspraak")}</Label>
              <h2 className="diba-display-m mt-4 max-w-[22ch]">
                {t("Begin met een")}{" "}
                <span className="diba-accent-on-dark">{t("huidanalyse")}</span>
              </h2>
              <p className="mt-6 max-w-[58ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
                {t(
                  "De behandelaar bekijkt je huid, meet met de EVE-M en stelt vast wat er bij jou past. Je hoort meteen om hoeveel sessies het gaat en wat het kost. Word je in dezelfde afspraak behandeld, dan vervallen de intakekosten.",
                )}
              </p>
              <Link
                href="/intake"
                className="diba-label mt-8 inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--on-dark-btn)] px-6 text-[var(--on-dark-btn-text)] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <span className="sm:hidden">{t("Huidconsult")}</span>
                <span className="max-sm:hidden">
                  {t("Wat er in een huidconsult gebeurt")}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
