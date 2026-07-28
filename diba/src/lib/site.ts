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
  postalCode: "3054 HG",
  city: "Rotterdam",
  country: "NL",
  /** Volledige regel voor footer/contact/schema */
  line: "Weissenbruchlaan 166, 3054 HG Rotterdam",
} as const;

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

/** NAP voor footer/schema — canoniek adres, geen verzonnen telefoon/KvK */
export const DIBA_NAP = {
  name: DIBA_SITE.name,
  street: DIBA_ADDRESS.street,
  zip: DIBA_ADDRESS.postalCode,
  city: DIBA_ADDRESS.city,
  whatsappHref: DIBA_WHATSAPP_URL,
} as const;

/** Canonieke proof points — enige toegestane cijfers (DIBA-RULES.md §11) */
export const DIBA_PROOF = {
  activeSince: 2017,
  helpedClients: "8.000+",
  treatmentsPerformed: "50.000+",
  clientReviews: "4.000+",
} as const;

/** Numerieke waarden voor ProofStrip count-up (§11, enige bron) */
export type ProofStripItem = {
  readonly value: number;
  readonly suffix?: string;
  readonly label: string;
};

export const DIBA_PROOF_STRIP_ITEMS: readonly ProofStripItem[] = [
  { value: DIBA_PROOF.activeSince, label: "Actief sinds" },
  { value: 8000, suffix: "+", label: "Geholpen klanten" },
  { value: 50000, suffix: "+", label: "Behandelingen" },
  { value: 4000, suffix: "+", label: "Klantreviews" },
] as const;

/** Figma homepage volgorde — stats bar onder hero */
export const DIBA_HOME_PROOF_ITEMS: readonly ProofStripItem[] = [
  { value: 4000, suffix: "+", label: "Klantreviews" },
  { value: 50000, suffix: "+", label: "Uitgevoerde behandelingen" },
  { value: 8000, suffix: "+", label: "Geholpen klanten" },
  { value: DIBA_PROOF.activeSince, label: "Vertrouwd sinds" },
] as const;
