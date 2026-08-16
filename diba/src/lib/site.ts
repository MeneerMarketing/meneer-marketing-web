/** Canonieke site- en bedrijfsgegevens. Enige bron voor NAP/SEO. */

export { DIBA_CITAAT } from "./schema";

export const DIBA_SITE_URL = "https://dibaclinics.nl";

export const DIBA_SITE = {
  name: "DIBA Clinics",
  legalName: "DIBA Clinics B.V.",
  domain: "dibaclinics.nl",
  baseUrl: "https://dibaclinics.nl",
  locale: "nl-NL",
  area: "Rotterdam",
  neighborhood: "Hillegersberg",
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

/** WhatsApp Business deeplink. */
export const DIBA_WHATSAPP_URL = "https://wa.me/31639181277";

/**
 * Salonized boekings-deeplink — alleen tonen als env gezet is.
 * [GEGEVEN-NODIG: URL van Okan]
 */
export const DIBA_SALONIZED_BOOKING_URL =
  process.env.NEXT_PUBLIC_SALONIZED_BOOKING_URL ?? "";

/** Instagram URL — [GEGEVEN-NODIG] */
export const DIBA_INSTAGRAM_URL = process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "";

/**
 * Openingstijden.
 *
 * VOORLOPIG. Deze tijden zijn een werkbaar voorstel en niet door de kliniek bevestigd.
 * Ze staan hier omdat een kliniek zonder openingstijden geen kliniek is: het is het
 * meest opgezochte gegeven op een contactpagina, het hoort in het bedrijfsschema voor
 * Google, en zonder tijden kon de pagina er ook niet omheen ontworpen worden.
 *
 * Wijzig ze op deze ene plek. Ze voeden de contactpagina, de voettekst en het
 * LocalBusiness-schema tegelijk; wie ze op één van die drie aanpast krijgt drie
 * verschillende antwoorden op dezelfde vraag.
 *
 * `dag` volgt de schema.org-notatie, want daar gaan ze uiteindelijk heen.
 * [GEGEVEN-NODIG: de echte openingstijden, Okan]
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
  telefoon: "Tijdens openingstijden direct. Staat er niemand vrij, dan bellen we dezelfde dag terug.",
  whatsapp: "Meestal binnen een paar uur op een werkdag, en altijd binnen één werkdag.",
  email: "Binnen twee werkdagen. Voor iets met haast is bellen of appen sneller.",
} as const;

/** NAP voor footer/schema — canoniek adres, geen verzonnen telefoon/KvK */
export const DIBA_NAP = {
  name: DIBA_SITE.name,
  street: DIBA_ADDRESS.street,
  zip: DIBA_ADDRESS.postalCode,
  city: DIBA_ADDRESS.city,
  whatsappHref: DIBA_WHATSAPP_URL,
} as const;

/** Publieke reviewbron — live op Salonized. */
export const DIBA_SALONIZED_REVIEWS_URL = "https://dibaclinics.salonized.com/reviews";

/** Stand Salonized (aug 2026): 5,0 · 3.883 reviews. */
export const DIBA_SALONIZED_RATING = 5.0;
export const DIBA_SALONIZED_REVIEW_COUNT = 3883;

/** Canonieke proof points — enige toegestane cijfers (DIBA-RULES.md §11) */
export const DIBA_PROOF = {
  activeSince: 2017,
  helpedClients: "8.000+",
  treatmentsPerformed: "50.000+",
  clientReviews: "3.883",
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
};

export const DIBA_PROOF_STRIP_ITEMS: readonly ProofStripItem[] = [
  { value: DIBA_PROOF.activeSince, label: "Actief sinds", isJaartal: true },
  { value: 8000, suffix: "+", label: "Geholpen klanten" },
  { value: 50000, suffix: "+", label: "Behandelingen" },
  { value: DIBA_SALONIZED_REVIEW_COUNT, label: "Klantreviews" },
] as const;

/** Figma homepage volgorde — stats bar onder hero */
export const DIBA_HOME_PROOF_ITEMS: readonly ProofStripItem[] = [
  { value: DIBA_SALONIZED_REVIEW_COUNT, label: "Klantreviews" },
  { value: 50000, suffix: "+", label: "Uitgevoerde behandelingen" },
  { value: 8000, suffix: "+", label: "Geholpen klanten" },
  { value: DIBA_PROOF.activeSince, label: "Vertrouwd sinds", isJaartal: true },
] as const;
