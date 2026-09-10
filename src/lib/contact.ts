/** Publieke contactgegevens. Één bron voor footer, JSON-LD en contactpagina. */
export const businessEmail = "info@meneermarketing.nl";

export const businessEmailDisplay = "info@meneermarketing.nl";

/** Kamer van Koophandel */
export const businessKvk = "42095913";
export const businessKvkDisplay = `KVK ${businessKvk}`;

/** Thuisbasis voor lokale SEO en schema. */
export const businessLocation = {
  city: "Apeldoorn",
  region: "Gelderland",
  country: "NL",
  countryName: "Nederland",
} as const;

/** Optioneel volledig adres via env (voor LocalBusiness schema). */
export const businessStreetAddress: string | null =
  process.env.NEXT_PUBLIC_BUSINESS_STREET?.trim() || null;

export const businessPostalCode: string | null =
  process.env.NEXT_PUBLIC_BUSINESS_POSTCODE?.trim() || null;

export const businessAddress = {
  line1: businessStreetAddress ?? businessLocation.city,
  city: businessLocation.city,
  region: businessLocation.region,
  postalCode: businessPostalCode,
  country: businessLocation.country,
} as const;

/** Optioneel: LinkedIn, Instagram, etc. voor sameAs in Organization schema. */
export const businessSameAs: string[] = [
  process.env.NEXT_PUBLIC_LINKEDIN_URL?.trim(),
  process.env.NEXT_PUBLIC_INSTAGRAM_URL?.trim(),
].filter((url): url is string => Boolean(url));

export function mailtoHref(params?: {
  subject?: string;
  body?: string;
}): string {
  const q = new URLSearchParams();
  if (params?.subject) q.set("subject", params.subject);
  if (params?.body) q.set("body", params.body);
  const qs = q.toString();
  return qs ? `mailto:${businessEmail}?${qs}` : `mailto:${businessEmail}`;
}

/** WhatsApp Business (E.164 zonder +). Env overschrijft default. */
const DEFAULT_WHATSAPP_E164 = "31612935389";
const DEFAULT_WHATSAPP_DISPLAY = "06 12935389";

/** Optioneel via env, bijv. NEXT_PUBLIC_BUSINESS_PHONE=06 12 34 56 78 */
export const businessPhone: string | null =
  process.env.NEXT_PUBLIC_BUSINESS_PHONE?.trim() || null;

export const businessPhoneDisplay: string | null = businessPhone;

export const businessWhatsAppNumber: string =
  process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP?.replace(/\D/g, "") ||
  DEFAULT_WHATSAPP_E164;

export const businessWhatsAppDisplay: string =
  process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP_DISPLAY?.trim() ||
  DEFAULT_WHATSAPP_DISPLAY;

export const defaultWhatsAppMessage =
  "Hoi! Ik heb een vraag over mijn marketing." as const;

export function telHref(phone = businessPhone): string | null {
  if (!phone) return null;
  const digits = phone.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : null;
}

export function whatsappHref(
  message: string = defaultWhatsAppMessage,
): string {
  const base = `https://wa.me/${businessWhatsAppNumber}`;
  if (!message.trim()) return base;
  return `${base}?text=${encodeURIComponent(message.trim())}`;
}

export interface ContactChannel {
  id: "email" | "whatsapp" | "phone";
  label: string;
  action: string;
  hint: string;
  href: string;
  external?: boolean;
}

/** Publieke contactkanalen voor werkwijze, contact en over-pagina's. */
export function getContactChannels(): ContactChannel[] {
  const whatsappLink = whatsappHref();
  const phoneLink = telHref() ?? "/contact";

  return [
    {
      id: "email",
      label: "E-mail",
      action: businessEmailDisplay,
      hint: "Ik lees alles zelf. Reactie binnen één à twee werkdagen.",
      href: mailtoHref(),
      external: true,
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      action: businessWhatsAppDisplay,
      hint: "Kort appje sturen mag. Handig voor een snelle vraag.",
      href: whatsappLink,
      external: true,
    },
    {
      id: "phone",
      label: "Telefoon",
      action: businessPhoneDisplay ?? "Plan een moment",
      hint: businessPhone
        ? "Liever even praten? Bel me gerust."
        : "Plan een gesprek via intake of stuur een app.",
      href: phoneLink,
      external: Boolean(businessPhone),
    },
  ];
}

