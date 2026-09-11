/** Canonieke site- en bedrijfsgegevens. Enige bron voor NAP/SEO. */

export { DIBA_CITAAT } from "./schema";

export const DIBA_SITE_URL = "https://dibaclinics.nl";

export const DIBA_SITE = {
  name: "Diba Clinics",
  legalName: "Diba Clinics B.V.",
  domain: "dibaclinics.nl",
  baseUrl: "https://dibaclinics.nl",
  locale: "nl-NL",
  area: "Rotterdam",
  /* Stond op "Hillegersberg". Yasin (3 september 2026): dat leest alsof we in een andere
     stad zitten. De wijk klopt, maar hij zegt niets tegen iemand die Rotterdam zoekt, en
     op de plekken waar de ligging er wél toe doet staat die nu uitgeschreven: noordkant,
     woonwijk, parkeren in de straat. */
  neighborhood: "Rotterdam",
} as const;

export const DIBA_ADDRESS = {
  street: "Weissenbruchlaan 166",
  postalCode: "3054 LS",
  city: "Rotterdam",
  country: "NL",
  /** Volledige regel voor footer/contact/schema */
  line: "Weissenbruchlaan 166, 3054 LS Rotterdam",
} as const;

/** Telefoon en mail zoals ze op dibaclinics.nl staan. */
export const DIBA_TELEFOON = "010-2038423";
export const DIBA_TELEFOON_HREF = "tel:+31102038423";
export const DIBA_EMAIL = "info@dibaclinics.nl";

/**
 * WhatsApp Business deeplink.
 *
 * Yasin, 10 september 2026: het nummer dat hier stond is dat van Rojda persoonlijk, en
 * "stel je vraag" hoort naar de kliniek te gaan. Vandaar dit nummer.
 */
export const DIBA_WHATSAPP_URL = "https://wa.me/31624315661";

/**
 * De boekingspagina in Salonized.
 *
 * Stond leeg, met een terugval naar /intake. Daardoor kwam je op "Afspraak maken" uit bij
 * een pagina die uitlegt wat een intake is, terwijl je wilde boeken. Yasin, 10 september
 * 2026: "die eerste grote knop moet meteen doorlinken naar afspraak boeken, niet nog meer
 * uitleg." Nu wijst hij naar de agenda zelf; per omgeving te overschrijven.
 */
/**
 * Het bedrijfsnummer van de boekingswidget van Salonized.
 *
 * Overgenomen uit de code die Salonized zelf neerzet op
 * dibaclinics.salonized.com/widget_bookings/new; het laadscript zoekt een element met dit
 * nummer op en zet daar de agenda in. Zie `components/afspraak/Boekingswidget`.
 */
export const DIBA_SALONIZED_WIDGET_COMPANY =
  process.env.NEXT_PUBLIC_SALONIZED_WIDGET_COMPANY ?? "399Dy";

export const DIBA_SALONIZED_BOOKING_URL =
  process.env.NEXT_PUBLIC_SALONIZED_BOOKING_URL ??
  "https://dibaclinics.salonized.com/";

/**
 * Instagram. Per omgeving te overschrijven; de standaard is de verwachte handle.
 *
 * Stond leeg, en dan toont de voettekst een uitgeschakelde link met een lege tooltip. Een
 * doodlopende link is slechter dan geen link, dus staat er nu een echte.
 * [GEGEVEN-NODIG: bevestiging van het profiel, Okan]
 */
export const DIBA_INSTAGRAM_URL =
  process.env.NEXT_PUBLIC_INSTAGRAM_URL ??
  "https://www.instagram.com/dibaclinics/";

/** Hero-achtergrondvideo op de homepage (geluidloos, decoratief). */
export const DIBA_HERO_VIDEO_SRC = "/videos/hero-hydrafacial.mp4";

/**
 * Openingstijden.
 *
 * BEVESTIGD door Okan op 5 september 2026, naast het Google-profiel van de kliniek gelegd.
 * Ze stonden hier als voorstel met een vlag erop en blijken precies te kloppen.
 *
 * Wijzig ze op deze ene plek. Ze voeden de contactpagina, de voettekst en het
 * LocalBusiness-schema tegelijk; wie ze op één van die drie aanpast krijgt drie
 * verschillende antwoorden op dezelfde vraag.
 *
 * `dag` volgt de schema.org-notatie, want daar gaan ze uiteindelijk heen.
 */
export const DIBA_OPENINGSTIJDEN = [
  { dag: "Monday", label: "Maandag", van: "09:00", tot: "17:30" },
  { dag: "Tuesday", label: "Dinsdag", van: "09:00", tot: "21:00" },
  { dag: "Wednesday", label: "Woensdag", van: "09:00", tot: "17:30" },
  { dag: "Thursday", label: "Donderdag", van: "09:00", tot: "21:00" },
  { dag: "Friday", label: "Vrijdag", van: "09:00", tot: "17:30" },
  { dag: "Saturday", label: "Zaterdag", van: "10:00", tot: "16:00" },
  { dag: "Sunday", label: "Zondag", van: null, tot: null },
] as const;

/** Hoe snel je antwoord krijgt, per kanaal. [GEGEVEN-NODIG: bevestiging, Okan] */
export const DIBA_REACTIETIJDEN = {
  telefoon:
    "Tijdens openingstijden direct. Staat er niemand vrij, dan bellen we dezelfde dag terug.",
  whatsapp:
    "Meestal binnen een paar uur op een werkdag, en altijd binnen één werkdag.",
  email:
    "Binnen twee werkdagen. Voor iets met haast is bellen of appen sneller.",
} as const;

/**
 * Het KvK-nummer en de rechtsvorm.
 *
 * Ontbraken, en zijn nodig zodra er een privacyverklaring en een klachtenregeling staan:
 * daarin moet staan wie de verwerkingsverantwoordelijke is, en dat is de rechtspersoon en
 * niet de handelsnaam.
 *
 * Op 21-08-2026 overgenomen uit hun eigen algemene voorwaarden op dibaclinics.nl, waar het
 * als rechtspersoongegeven staat. Het telefoonnummer stond hierboven al en is ongewijzigd.
 *
 * Gemarkeerd omdat die site op dat moment gecompromitteerd was. De kans dat een aanvaller
 * een KvK-nummer wijzigt is klein, maar klein is niet nul, en dit gegeven komt straks in
 * een juridisch document te staan.
 *
 * [GEGEVEN-NODIG: bevestig KvK-nummer 88713709 en de rechtsvorm B.V., Okan]
 */
export const DIBA_KVK = "88713709";
export const DIBA_LEGAL_NAME = "Diba Clinics B.V.";

/** NAP voor footer/schema — canoniek adres. */
export const DIBA_NAP = {
  name: DIBA_SITE.name,
  legalName: DIBA_LEGAL_NAME,
  street: DIBA_ADDRESS.street,
  zip: DIBA_ADDRESS.postalCode,
  city: DIBA_ADDRESS.city,
  phone: DIBA_TELEFOON,
  phoneHref: DIBA_TELEFOON_HREF,
  kvk: DIBA_KVK,
  email: DIBA_EMAIL,
  whatsappHref: DIBA_WHATSAPP_URL,
} as const;

/** Publieke reviewbron — live op Salonized. */
export const DIBA_SALONIZED_REVIEWS_URL =
  "https://dibaclinics.salonized.com/reviews";

/**
 * Wanneer de cijfers op deze pagina voor het laatst zijn nagekeken.
 *
 * De gids vraagt hier twee keer om: gebruik alleen cijfers die op de publicatiedatum zijn
 * gecontroleerd, en kijk vóór publicatie opnieuw naar reviews, klantaantallen, prijzen en
 * teamgegevens.
 *
 * Het reviewaantal loopt op, dus dit veroudert vanzelf. Een getal dat maanden achterloopt is
 * erger dan geen getal, want het staat er met de stelligheid van een feit. `npm run stijl`
 * klaagt zodra deze datum ouder is dan een half jaar.
 *
 * Werk hem bij zodra je de cijfers hierboven hebt nagekeken, ook als er niets veranderd is.
 * Dat "niets veranderd" is namelijk de uitkomst van de controle en niet het overslaan ervan.
 */
export const CIJFERS_GECONTROLEERD_OP = "2026-09-06";

/**
 * ZorgkaartNederland, de onafhankelijke waarderingssite van de Patiëntenfederatie.
 *
 * Yasin, 6 september 2026: in de hero stond "sinds 2017" twee keer, in het zegel en als
 * vierde cijfer. Het vierde cijfer is nu dit. Het is een ander soort bewijs dan de
 * Salonized-reviews: die schrijft de klant na de afspraak op ons eigen boekingssysteem,
 * dit staat op een site die niet van ons is en waar wij niets aan kunnen veranderen.
 *
 * Het aantal waarderingen (zes) staat niet in de hero; Yasin, 7 september 2026: alleen
 * "9,7 op Zorgkaart". Het cijfer linkt naar de Zorgkaart-pagina, waar dat aantal wél
 * staat, dus wie het wil nakijken kan dat met één klik. Het aantal staat hier in de data
 * zodat het niet vergeten wordt.
 * [GEGEVEN-NODIG: iemand kijkt dit per kwartaal na, want het cijfer beweegt zodra er
 * een waardering bij komt]
 */
export const DIBA_ZORGKAART = {
  score: 9.7,
  aantal: 6,
  url: "https://www.zorgkaartnederland.nl/zorginstelling/huidtherapiepraktijk-diba-clinics-rotterdam-10082984",
} as const;

/** Stand Salonized, zie CIJFERS_GECONTROLEERD_OP: 5,0 · 3.893 reviews. */
export const DIBA_SALONIZED_RATING = 5.0;
export const DIBA_SALONIZED_REVIEW_COUNT = 3893;

/**
 * Canonieke proof points, de enige toegestane cijfers (DIBA-RULES.md §11).
 *
 * De aantallen stonden hier twee keer: een keer als tekst met duizendscheiding en een keer
 * als kaal getal in de tellers hieronder. Toen Rojda in augustus 2026 doorgaf dat het
 * inmiddels tienduizend klanten en vijfenvijftigduizend behandelingen zijn, moest dat dus
 * op vier plekken worden bijgewerkt, en dan is het een kwestie van tijd voor de homepage
 * iets anders zegt dan /over-ons.
 *
 * Vandaar één getal per feit, en de tekstvorm eruit afgeleid.
 */
const AANTAL = {
  geholpenKlanten: 10000,
  behandelingen: 55000,
} as const;

/** "10.000+" uit 10000. Eén plek waar de vorm wordt bepaald. */
function metPlus(aantal: number): string {
  return `${aantal.toLocaleString("nl-NL")}+`;
}

export const DIBA_PROOF = {
  activeSince: 2017,
  helpedClients: metPlus(AANTAL.geholpenKlanten),
  treatmentsPerformed: metPlus(AANTAL.behandelingen),
  clientReviews: DIBA_SALONIZED_REVIEW_COUNT.toLocaleString("nl-NL"),
} as const;

/** Numerieke waarden voor ProofStrip count-up (§11, enige bron) */
export type ProofStripItem = {
  readonly value: number;
  readonly suffix?: string;
  readonly label: string;
  /**
   * Jaartallen krijgen geen duizendscheiding. Dat stond eerder impliciet in het ontbreken
   * van een achtervoegsel, en toen het reviewaantal ook zonder plusje kwam te staan
   * verscheen dat als "3883" in plaats van "3.883" — precies wat §11 verbiedt.
   */
  readonly isJaartal?: true;
  /**
   * Het label in twee woorden of minder.
   *
   * Op de homepage staan deze vier op een telefoon naast elkaar in een strook van
   * driehonderdvijfendertig pixels. "Uitgevoerde behandelingen" past daar niet, en
   * afkappen maakt van een bewijs een raadsel.
   */
  readonly kort?: string;
  /**
   * Waar het cijfer na te kijken is. Alleen voor cijfers die ergens anders staan dan bij
   * ons: de Zorgkaart-score linkt naar Zorgkaart. Een cijfer dat je kunt aanklikken en
   * controleren is een ander cijfer dan een dat we zelf noemen.
   */
  readonly href?: string;
};

export const DIBA_PROOF_STRIP_ITEMS: readonly ProofStripItem[] = [
  { value: DIBA_PROOF.activeSince, label: "Actief sinds", isJaartal: true },
  {
    value: AANTAL.geholpenKlanten,
    suffix: "+",
    label: "Geholpen klanten",
  },
  { value: AANTAL.behandelingen, suffix: "+", label: "Behandelingen" },
  { value: DIBA_SALONIZED_REVIEW_COUNT, label: "Klantreviews" },
] as const;

/** Figma homepage volgorde — stats bar onder hero */
export const DIBA_HOME_PROOF_ITEMS: readonly ProofStripItem[] = [
  {
    value: DIBA_SALONIZED_REVIEW_COUNT,
    label: "Klantreviews",
    kort: "Reviews",
  },
  {
    value: AANTAL.behandelingen,
    suffix: "+",
    label: "Uitgevoerde behandelingen",
    /* "Behandelingen" is in kleine kapitalen met letterafstand ruim honderd pixels breed,
       en een vak in de cijferkaart is er op een telefoon achtentachtig (Yasin, 11 september
       2026: "het woord behandelingen is te lang waardoor het uit zijn vakje gaat"). */
    kort: "Behandeld",
  },
  {
    value: AANTAL.geholpenKlanten,
    suffix: "+",
    label: "Geholpen klanten",
    kort: "Klanten",
  },
  /* Hier stond "Vertrouwd sinds 2017", maar dat jaartal staat al in het zegel op de foto
     ernaast (Yasin, 6 september 2026). Het vierde cijfer komt nu van buiten. */
  {
    value: DIBA_ZORGKAART.score,
    label: "Op Zorgkaart",
    kort: "Zorgkaart",
    href: DIBA_ZORGKAART.url,
  },
] as const;

/**
 * Wie de site gebouwd heeft, met een verwijzing.
 *
 * Yasin, 11 september 2026: "in de voettekst wil ik de copyright links en rechts een
 * backlink naar Meneer Marketing." Het domein is nagekeken: meneermarketing.nl geeft 200
 * en is het bureau van Yasin zelf.
 */
export const DIBA_BOUWER = {
  naam: "Meneer Marketing",
  url: "https://meneermarketing.nl",
} as const;
