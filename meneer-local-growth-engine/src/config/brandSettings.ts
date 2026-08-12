export type OutreachSenderMode = "BRAND" | "FORMAL_PERSON";

export interface MeneerMarketingBrandSettings {
  outreach_sender_mode: OutreachSenderMode;
  sender_brand_name: string;
  formal_sender_name: string;
  /** @deprecated use sender modes; kept for merge compat */
  sender_name: string;
  brand_name: string;
  tagline: string;
  website: string;
  website_label: string;
  kvk: string;
  from_email: string;
  reply_to: string;
  years_experience: number;
  years_experience_phrase: string;
  allowed_sender_domains: string[];
  preview_base_url: string;
  preview_allowed_hosts: string[];
}

export const DEFAULT_BRAND_SETTINGS: MeneerMarketingBrandSettings = {
  outreach_sender_mode: (process.env.OUTREACH_SENDER_MODE as OutreachSenderMode) || "BRAND",
  sender_brand_name: process.env.OUTREACH_SENDER_BRAND_NAME ?? "Meneer Marketing",
  formal_sender_name: process.env.OUTREACH_FORMAL_SENDER_NAME ?? "Dhr. Ertan",
  sender_name: "Meneer Marketing",
  brand_name: "Meneer Marketing",
  tagline: "Webdesign & online vindbaarheid",
  website: "https://meneermarketing.nl",
  website_label: "meneermarketing.nl",
  kvk: process.env.OUTREACH_KVK ?? "",
  from_email: process.env.RESEND_FROM_EMAIL ?? "",
  reply_to: process.env.OUTREACH_REPLY_TO ?? "",
  years_experience: Number(process.env.OUTREACH_YEARS_EXPERIENCE ?? 12),
  years_experience_phrase:
    process.env.OUTREACH_YEARS_EXPERIENCE_PHRASE ??
    "Ik doe dit werk inmiddels {{years}} jaar en help bedrijven met webdesign en online vindbaarheid.",
  allowed_sender_domains: (
    process.env.OUTREACH_ALLOWED_SENDER_DOMAINS ??
    "meneermarketing.nl,mail.meneermarketing.nl"
  )
    .split(",")
    .map((d) => d.trim().toLowerCase())
    .filter(Boolean),
  preview_base_url: process.env.OUTREACH_PREVIEW_BASE_URL ?? "",
  preview_allowed_hosts: (
    process.env.OUTREACH_PREVIEW_ALLOWED_HOSTS ??
    "meneermarketing.nl,preview.meneermarketing.nl,localhost"
  )
    .split(",")
    .map((d) => d.trim().toLowerCase())
    .filter(Boolean),
};

export function mergeBrandSettings(
  raw: Partial<MeneerMarketingBrandSettings> | null | undefined
): MeneerMarketingBrandSettings {
  const mode =
    raw?.outreach_sender_mode === "FORMAL_PERSON" || raw?.outreach_sender_mode === "BRAND"
      ? raw.outreach_sender_mode
      : DEFAULT_BRAND_SETTINGS.outreach_sender_mode;

  return {
    ...DEFAULT_BRAND_SETTINGS,
    ...(raw ?? {}),
    outreach_sender_mode: mode,
    sender_brand_name:
      raw?.sender_brand_name ??
      raw?.brand_name ??
      DEFAULT_BRAND_SETTINGS.sender_brand_name,
    formal_sender_name:
      raw?.formal_sender_name ?? DEFAULT_BRAND_SETTINGS.formal_sender_name,
    allowed_sender_domains:
      raw?.allowed_sender_domains?.length
        ? raw.allowed_sender_domains
        : DEFAULT_BRAND_SETTINGS.allowed_sender_domains,
    preview_allowed_hosts:
      raw?.preview_allowed_hosts?.length
        ? raw.preview_allowed_hosts
        : DEFAULT_BRAND_SETTINGS.preview_allowed_hosts,
    years_experience: Number(
      raw?.years_experience ?? DEFAULT_BRAND_SETTINGS.years_experience
    ),
    years_experience_phrase:
      raw?.years_experience_phrase ?? DEFAULT_BRAND_SETTINGS.years_experience_phrase,
  };
}

export function getSenderDisplay(brand: MeneerMarketingBrandSettings): {
  mode: OutreachSenderMode;
  display_name: string;
  signature_name: string;
  signature_company: string | null;
} {
  if (brand.outreach_sender_mode === "FORMAL_PERSON") {
    return {
      mode: "FORMAL_PERSON",
      display_name: `${brand.formal_sender_name} | ${brand.sender_brand_name}`,
      signature_name: brand.formal_sender_name,
      signature_company: brand.sender_brand_name,
    };
  }
  return {
    mode: "BRAND",
    display_name: brand.sender_brand_name,
    signature_name: brand.sender_brand_name,
    signature_company: null,
  };
}
