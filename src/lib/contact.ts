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

/** Optioneel: vul aan wanneer bekend */
export const businessPhone: string | null = null;

export const businessAddress = {
  line1: "Nederland",
  country: "NL",
} as const;
