import type { EmailType } from "../../config/outreach.js";

const PRIVACY_PREFIXES = [
  "privacy",
  "legal",
  "avg",
  "gdpr",
  "compliance",
  "juridisch",
];
const SUPPORT_PREFIXES = [
  "support",
  "klantenservice",
  "helpdesk",
  "help",
  "service",
  "returns",
  "retour",
];
const SALES_PREFIXES = ["sales", "verkoop", "partners", "b2b", "wholesale"];
const INFO_PREFIXES = ["info", "contact", "hello", "hallo", "hi", "mail"];
const GENERAL_PREFIXES = ["office", "administratie", "admin", "general"];

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function classifyEmailType(email: string): EmailType {
  const normalized = normalizeEmail(email);
  const local = normalized.split("@")[0] ?? "";
  const localClean = local.replace(/[^a-z0-9]/g, "");

  if (PRIVACY_PREFIXES.some((p) => localClean.startsWith(p) || localClean === p)) {
    return "PRIVACY_LEGAL";
  }
  if (SUPPORT_PREFIXES.some((p) => localClean.startsWith(p))) {
    return "SUPPORT";
  }
  if (SALES_PREFIXES.some((p) => localClean.startsWith(p))) {
    return "SALES";
  }
  if (INFO_PREFIXES.some((p) => localClean === p || localClean.startsWith(p))) {
    return localClean.startsWith("info") || localClean === "info"
      ? "INFO"
      : "GENERAL_BUSINESS";
  }
  if (GENERAL_PREFIXES.some((p) => localClean.startsWith(p))) {
    return "GENERAL_BUSINESS";
  }

  // voornaam.achternaam / voornaam@ → personal business
  if (
    /^[a-z]{2,}([._-][a-z]{2,})+$/.test(local) ||
    (/^[a-z]{3,}$/.test(localClean) &&
      !INFO_PREFIXES.includes(localClean) &&
      !SUPPORT_PREFIXES.includes(localClean))
  ) {
    // Single token that's not a role mailbox often is a person
    if (/^[a-z]+\.[a-z]+/.test(local) || /^[a-z]+_[a-z]+/.test(local)) {
      return "PERSONAL_BUSINESS";
    }
    if (localClean.length >= 4 && localClean.length <= 14 && !/[0-9]{3,}/.test(localClean)) {
      // ambiguous single name — treat as personal candidate with lower confidence later
      return "PERSONAL_BUSINESS";
    }
  }

  return "UNKNOWN";
}

export function isUsableForOutreach(emailType: EmailType): boolean {
  return emailType !== "PRIVACY_LEGAL";
}

export function emailTypePreferenceRank(emailType: EmailType): number {
  switch (emailType) {
    case "PERSONAL_BUSINESS":
      return 100;
    case "GENERAL_BUSINESS":
      return 80;
    case "INFO":
      return 75;
    case "SALES":
      return 70;
    case "UNKNOWN":
      return 40;
    case "SUPPORT":
      return 20;
    case "PRIVACY_LEGAL":
      return 0;
    default:
      return 0;
  }
}

export function emailDomainMatchesBrand(
  email: string,
  brandDomain: string
): boolean {
  const emailDomain = normalizeEmail(email).split("@")[1] ?? "";
  const brand = brandDomain.toLowerCase().replace(/^www\./, "");
  if (!emailDomain || !brand) return false;
  return (
    emailDomain === brand ||
    emailDomain.endsWith(`.${brand}`) ||
    brand.endsWith(`.${emailDomain}`)
  );
}
