import type { Metadata } from "next";
import Link from "next/link";
import Label from "@/components/ui/Label";
import { publicCopy } from "@/lib/copy-flags";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import {
  DIBA_ADDRESS,
  DIBA_EMAIL,
  DIBA_SITE,
  DIBA_SITE_URL,
  DIBA_TELEFOON,
  DIBA_TELEFOON_HREF,
  DIBA_WHATSAPP_URL,
} from "@/lib/site";

/**
 * Privacybeleid.
 *
 * WAT IK CONTROLEERDE VOORDAT IK IETS SCHREEF.
 *
 * Hier stond een algemeen verhaal over gegevens die "u zelf invult". Dat klopte niet met de
 * code: deze site heeft geen enkel formulier. De enige e-mailvelden staan op /dev/components
 * (een componentenetalage) en de enige API-route is de preview-login. Er is niets dat
 * bezoekersgegevens naar een server stuurt.
 *
 * Wat er wél is, is twee dingen in localStorage: de cookiekeuze en het huidprofiel. Dat
 * laatste zijn keuzes uit lijstjes, geen naam en geen mailadres, en het blijft in de browser
 * staan (zie `huidprofiel-opslag.ts`).
 *
 * DAAROM GAAT DEZE PAGINA OVER WAAR GEGEVENS WÉL TERECHTKOMEN.
 *
 * Namelijk niet hier. Boeken gebeurt bij Salonized, berichten via WhatsApp, en je dossier
 * ligt in de kliniek. Dat is een veel bruikbaarder verhaal dan een opsomming van
 * verwerkingsgrondslagen, en het is bovendien het enige dat klopt.
 *
 * De AVG-rechten staan er los bij, want die gelden ongeacht waar iets ligt.
 *
 * DE BEWAARTERMIJNEN STAAN ER SINDS 21-08-2026 WEL.
 *
 * Ze stonden hier eerst als open besluit "samen met een jurist". Dat was te voorzichtig:
 * de termijn voor een medisch dossier is geen afspraak maar wet. Artikel 7:454 BW (de
 * WGBO) schrijft twintig jaar voor, gerekend vanaf de laatste wijziging in het dossier.
 *
 * Dat de WGBO hier geldt volgt uit hun eigen algemene voorwaarden, waarin Diba Clinics
 * B.V. zichzelf omschrijft als hulpverlener die handelingen op het gebied van de
 * geneeskunst verricht, en de overeenkomst expliciet een behandelingsovereenkomst in de
 * zin van artikel 7:446 BW noemt. Wie dat opschrijft, valt onder de bewaarplicht.
 *
 * De termijn staat er daarom mét de reden erbij: twintig jaar is langer dan mensen
 * verwachten, en het scheelt een boos gesprek als er meteen bij staat dat de kliniek er
 * niet omheen mag. [MEDISCHE-CHECK-ROJDA] op deze passage, want het raakt de WGBO.
 *
 * WAT ER NOG WEL OPEN STAAT.
 *
 * Of er een apart e-mailadres voor privacyverzoeken komt; zolang dat er niet is wijst de
 * pagina naar het algemene adres en dat staat er dan ook zo.
 *
 * De u-vorm mag hier: dit is een juridische pagina.
 *
 * Eén donkergroen vlak: je rechten (§5).
 */

export const metadata: Metadata = {
  title: "Privacybeleid",
  description:
    "Deze website verzamelt zelf niets. Waar uw gegevens wel terechtkomen, wat daar gebeurt en welke rechten u heeft.",
  robots: { index: true, follow: true },
};

/**
 * Waar gegevens terechtkomen.
 *
 * `hier` betekent: op deze website. Bij precies twee dingen is dat waar, en allebei blijven
 * ze in de browser van de bezoeker.
 */
const PLEKKEN = [
  {
    plek: "Deze website",
    van: "Ons",
    wat: "Twee dingen, en allebei blijven ze in uw eigen browser: de keuze die u op de cookiebalk maakt, en het huidprofiel als u dat invult. Dat profiel bestaat uit keuzes uit lijstjes, zonder naam, mailadres of foto.",
    heen: "Nergens heen. Er is op deze site geen formulier en geen server die dit ontvangt. Wist u uw browsergegevens, dan is het weg.",
    hier: true,
  },
  {
    plek: "Salonized",
    van: "Boekingssysteem",
    wat: "Uw afspraakgegevens en de contactgegevens die u bij het boeken invult. Ook de reviews die u achterlaat, want die worden daar verzameld.",
    heen: "Naar Salonized als verwerker, voor het plannen van afspraken en het bijhouden van uw traject.",
    hier: false,
  },
  {
    plek: "WhatsApp",
    van: "Berichtenverkeer",
    wat: "Wat u ons stuurt, inclusief foto's als u die meestuurt bij een vraag over nazorg.",
    heen: "Via WhatsApp, dat een eigen privacybeleid heeft waar wij niet over gaan. Wilt u iets gevoeligs delen, bel dan liever.",
    hier: false,
  },
  {
    plek: "In de kliniek",
    van: "Uw dossier",
    wat: "Wat er bij de intake is besproken, wat er gemeten is, welke behandelingen u heeft gehad en hoe uw huid reageerde.",
    heen: "Dit blijft in de kliniek en is de enige plek waar echt gevoelige gegevens liggen. Alleen de mensen die u behandelen kijken erin.",
    hier: false,
  },
] as const;

/**
 * Hoe lang iets blijft, en op grond waarvan.
 *
 * De grond staat er expliciet bij, want dat is het verschil tussen een kliniek die iets
 * bewaart omdat het handig is en een die het moet.
 */
const TERMIJNEN = [
  {
    wat: "Uw behandeldossier",
    hoelang: "Twintig jaar",
    grond:
      "Wettelijk verplicht op grond van de WGBO (artikel 7:454 BW), gerekend vanaf de laatste wijziging in het dossier. Dit is geen termijn die wij korter mogen maken. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    wat: "Foto's die bij een behandeling horen",
    hoelang: "Twintig jaar",
    grond:
      "Die horen bij het dossier en vallen onder dezelfde plicht. Foto's die u ons apart heeft toegestaan te gebruiken buiten uw dossier, verwijderen wij zodra u die toestemming intrekt. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    wat: "Facturen en administratie",
    hoelang: "Zeven jaar",
    grond: "De fiscale bewaarplicht van de Belastingdienst.",
  },
  {
    wat: "Wat u ons appt of mailt",
    hoelang: "Zolang het gesprek loopt, daarna opgeruimd",
    grond:
      "Geen verplichting; wij bewaren het alleen zolang het ergens toe dient.",
  },
  {
    wat: "Meetgegevens van deze website",
    hoelang: "Maximaal veertien maanden",
    grond:
      "Alleen als u de cookiebalk heeft geaccepteerd. Weigert u, dan wordt er niets gemeten en is er dus niets te bewaren.",
  },
] as const;

/** De AVG-rechten. Deze gelden ongeacht waar iets ligt. */
const RECHTEN = [
  {
    kop: "Inzien",
    zin: "U mag opvragen welke gegevens er van u zijn en wat ermee gebeurt.",
  },
  {
    kop: "Corrigeren",
    zin: "Klopt er iets niet, dan laten we het aanpassen.",
  },
  {
    kop: "Laten verwijderen",
    zin: "Waar de wet dat toelaat. Voor delen van een behandeldossier gelden wettelijke bewaartermijnen; dat leggen we dan uit in plaats van er omheen te praten.",
  },
  {
    kop: "Bezwaar maken",
    zin: "Tegen een verwerking waar u het niet mee eens bent.",
  },
  {
    kop: "Meenemen",
    zin: "Uw gegevens in een leesbaar bestand opvragen om ze ergens anders te gebruiken.",
  },
  {
    kop: "Klagen",
    zin: "Komt u er met ons niet uit, dan kunt u terecht bij de Autoriteit Persoonsgegevens. Dat recht heeft u altijd, ook zonder eerst bij ons te klagen.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Privacybeleid", url: `${DIBA_SITE_URL}/privacybeleid` },
        ])}
      />

      {/* ── Hero ── */}
      <section className="mx-auto px-5 sm:px-9 lg:px-[7.5vw]">
        <div className="grid gap-10 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div>
            <nav
              aria-label="Kruimelpad"
              className="diba-label flex flex-wrap gap-2"
            >
              <Link href="/" className="hover:text-[var(--g-700)]">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-[var(--t-muted)]">Privacybeleid</span>
            </nav>

            <h1 className="diba-display-l mt-6 max-w-[15ch]">
              Deze website
              <br />
              <span className="diba-accent">verzamelt niets.</span>
            </h1>

            <p className="mt-7 max-w-[54ch] text-[17px] leading-8 text-[var(--t-body)]">
              Er staat geen enkel formulier op {DIBA_SITE.domain}. Geen
              nieuwsbrief, geen contactformulier, geen veld waar u uw mailadres
              achterlaat. Er is dus ook niets dat naar ons toe gestuurd wordt.
            </p>
            <p className="mt-4 max-w-[54ch] text-[17px] leading-8 text-[var(--t-body)]">
              Dat betekent niet dat er nergens gegevens van u zijn. Ze staan
              alleen ergens anders, en hieronder staat precies waar.
            </p>
          </div>

          <div className="flex flex-col justify-center rounded-[var(--r-lg)] bg-white p-8 sm:p-10">
            <Label>Wie dit beleid voert</Label>
            <address className="mt-5 text-[17px] leading-8 not-italic text-[var(--t-strong)]">
              {DIBA_SITE.legalName}
              <br />
              {DIBA_ADDRESS.street}
              <br />
              {DIBA_ADDRESS.postalCode} {DIBA_ADDRESS.city}
            </address>
            <p className="mt-5 text-[16px] leading-7 text-[var(--t-body)]">
              Vragen over uw gegevens gaan naar{" "}
              <a
                href={`mailto:${DIBA_EMAIL}`}
                className="text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
              >
                {DIBA_EMAIL}
              </a>{" "}
              of telefonisch naar {DIBA_TELEFOON}. Zet er even bij dat het om
              een privacyverzoek gaat, dan komt het bij de juiste persoon
              terecht.
            </p>
          </div>
        </div>
      </section>

      {/* ── Waar het wel terechtkomt ── */}
      <section className="bg-[var(--g-025)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto">
          <div>
            <Label>Vier plekken</Label>
            <h2 className="diba-display-m mt-4">
              Waar uw gegevens{" "}
              <span className="diba-accent">wel terechtkomen.</span>
            </h2>
            <p className="max-w-[62ch] mt-6 text-[17px] leading-8 text-[var(--t-body)]">
              Drie van de vier zijn niet deze website. Bij elke plek staat wat
              er ligt en waar het heen gaat.
            </p>
          </div>

          <ul className="mt-10 grid gap-4 md:grid-cols-2">
            {PLEKKEN.map((p) => (
              <li
                key={p.plek}
                className={`flex flex-col rounded-[var(--r-lg)] p-7 sm:p-9 ${
                  p.hier ? "bg-[var(--g-200)]" : "bg-white"
                }`}
              >
                <p
                  className={`diba-label ${p.hier ? "text-[var(--g-900)]" : "text-[var(--t-label)]"}`}
                >
                  {p.van}
                </p>
                <p
                  className={`diba-card-title mt-3 ${p.hier ? "text-[var(--g-900)]" : "text-[var(--t-strong)]"}`}
                >
                  {p.plek}
                </p>
                <p
                  className={`mt-4 flex-1 text-[15px] leading-7 ${p.hier ? "text-[var(--g-900)]" : "text-[var(--t-body)]"}`}
                >
                  {p.wat}
                </p>
                <p
                  className={`mt-5 rounded-[var(--r-md)] p-5 text-[15px] leading-7 ${
                    p.hier
                      ? "bg-white text-[var(--t-body)]"
                      : "bg-[var(--g-050)] text-[var(--t-body)]"
                  }`}
                >
                  <span className="diba-label block text-[var(--t-label)]">
                    Waar het heen gaat
                  </span>
                  <span className="mt-2 block">{p.heen}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Uw rechten ── */}
      <section className="px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto">
          <Label>Hoe lang het blijft</Label>
          <h2 className="diba-display-m mt-4 max-w-[20ch]">
            Twintig jaar,{" "}
            <span className="diba-accent">en dat is geen keuze van ons.</span>
          </h2>
          <p className="mt-6 max-w-[62ch] text-[16px] leading-7 text-[var(--t-body)]">
            Een dossier van een geneeskundige behandeling moet twintig jaar
            bewaard blijven. Dat staat in de wet, en het is langer dan de meeste
            mensen verwachten. Daarom staat er hieronder bij elk gegeven op
            grond waarvan wij het bewaren.
          </p>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[var(--g-100)]">
                  <th scope="col" className="diba-label pb-3 pr-6">
                    Wat
                  </th>
                  <th scope="col" className="diba-label pb-3 pr-6">
                    Hoe lang
                  </th>
                  <th scope="col" className="diba-label pb-3">
                    Op grond waarvan
                  </th>
                </tr>
              </thead>
              <tbody>
                {TERMIJNEN.map((t) => (
                  <tr key={t.wat} className="border-b border-[var(--g-100)]">
                    <td className="py-4 pr-6 align-top text-[15px] leading-7 font-medium">
                      {t.wat}
                    </td>
                    <td className="py-4 pr-6 align-top text-[15px] leading-7 whitespace-nowrap text-[var(--t-body)]">
                      {t.hoelang}
                    </td>
                    <td className="max-w-[52ch] py-4 align-top text-[15px] leading-7 text-[var(--t-body)]">
                      {publicCopy(t.grond)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto">
          <div className="rounded-[var(--r-lg)] bg-[var(--g-700)] p-8 text-[var(--on-dark)] sm:p-12 lg:p-14">
            <div className="max-w-[62ch]">
              <Label opDonker>Wat u kunt vragen</Label>
              <h2 className="diba-display-m mt-4 max-w-[20ch]">
                Zes rechten,{" "}
                <span className="diba-accent-on-dark">
                  {" "}
                  ongeacht waar iets ligt.
                </span>
              </h2>
              <p className="mt-6 text-[16px] leading-7 text-[var(--on-dark-body)]">
                U hoeft niet uit te zoeken bij welke partij iets staat. Stel de
                vraag bij ons, dan zoeken wij het uit.
              </p>
            </div>

            <ul className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {RECHTEN.map((r) => (
                <li
                  key={r.kop}
                  className="rounded-[var(--r-lg)] bg-white/10 p-6 sm:p-7"
                >
                  <p className="text-[18px] leading-7 font-medium">{r.kop}</p>
                  <p className="mt-3 text-[15px] leading-7 text-[var(--on-dark-body)]">
                    {r.zin}
                  </p>
                </li>
              ))}
            </ul>

            <a
              href={`mailto:${DIBA_EMAIL}`}
              className="diba-label mt-10 inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--on-dark-btn)] px-6 text-[var(--on-dark-btn-text)] transition-colors hover:bg-white"
            >
              Dien een verzoek in
            </a>
          </div>
        </div>
      </section>

      {/* ── Wat we niet doen ── */}
      <section className="bg-[var(--g-025)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <Label>Wat er niet gebeurt</Label>
            <h2 className="diba-display-m mt-4 max-w-[16ch]">
              Geen profiel,
              <br />
              <span className="diba-accent">geen verkoop.</span>
            </h2>
          </div>
          <div className="max-w-[58ch]">
            <p className="text-[17px] leading-8 text-[var(--t-body)]">
              Er worden geen advertentieprofielen van u opgebouwd en er wordt
              niets doorverkocht of geruild. De enige meting op deze site is
              anonieme statistiek, en die laadt pas nadat u daar akkoord voor
              geeft; zonder akkoord worden die scripts niet ingeladen.
            </p>
            <p className="mt-4 text-[17px] leading-8 text-[var(--t-body)]">
              Uw huidprofiel wordt bewust niet naar ons gestuurd. Dat is de plek
              waar de verleiding het grootst is om alvast een mailadres te
              vragen, en precies daarom gebeurt het niet.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href="/cookiebeleid"
                className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-white transition-colors hover:bg-[var(--g-800)]"
              >
                Beheer uw cookiekeuze
              </Link>
              <a
                href={DIBA_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="diba-label text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
              >
                Of stel uw vraag via WhatsApp
              </a>
            </div>
            <p className="mt-8 text-[14px] leading-6 text-[var(--t-muted)]">
              Liever bellen? Dat kan op{" "}
              <a
                href={DIBA_TELEFOON_HREF}
                className="text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
              >
                {DIBA_TELEFOON}
              </a>
              . Zie ook de{" "}
              <Link
                href="/algemene-voorwaarden"
                className="text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
              >
                algemene voorwaarden
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
