/** Publieke contactgegevens. Één bron voor footer, JSON-LD en contactpagina. */
export const businessEmail = "info@meneermarketing.nl";

export const businessEmailDisplay = "info@meneermarketing.nl";

/** Kamer van Koophandel */
export const businessKvk = "42095913";
export const businessKvkDisplay = `KVK ${businessKvk}`;

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

/** Optioneel via env, bijv. NEXT_PUBLIC_BUSINESS_PHONE=06 12 34 56 78 */
export const businessPhone: string | null =
  process.env.NEXT_PUBLIC_BUSINESS_PHONE?.trim() || null;

export const businessPhoneDisplay: string | null = businessPhone;

/** E.164 zonder +, bijv. NEXT_PUBLIC_BUSINESS_WHATSAPP=31612345678 */
export const businessWhatsAppNumber: string | null =
  process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP?.replace(/\D/g, "") || null;

export const businessWhatsAppDisplay: string | null =
  process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP_DISPLAY?.trim() ||
  businessPhoneDisplay;

export function telHref(phone = businessPhone): string | null {
  if (!phone) return null;
  const digits = phone.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : null;
}

export function whatsappHref(message?: string): string | null {
  if (!businessWhatsAppNumber) return null;
  const base = `https://wa.me/${businessWhatsAppNumber}`;
  if (!message?.trim()) return base;
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
  const whatsappLink =
    whatsappHref("Hoi! Ik heb een vraag over mijn marketing.") ?? "/contact";
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
      action: businessWhatsAppDisplay ?? "Stuur een app",
      hint: businessWhatsAppNumber
        ? "Kort en informeel. Handig voor een snelle vraag."
        : "Laat je nummer achter via contact. Dan app ik je terug.",
      href: whatsappLink,
      external: Boolean(businessWhatsAppNumber),
    },
    {
      id: "phone",
      label: "Telefoon",
      action: businessPhoneDisplay ?? "Bel of plan een moment",
      hint: businessPhone
        ? "Liever even praten? Bel me gerust."
        : "Vraag een belafspraak aan via contact of mail.",
      href: phoneLink,
      external: Boolean(businessPhone),
    },
  ];
}

export const businessAddress = {
  line1: "Nederland",
  country: "NL",
} as const;
