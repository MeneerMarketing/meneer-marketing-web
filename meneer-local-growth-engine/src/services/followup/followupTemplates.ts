import {
  getSenderDisplay,
  type MeneerMarketingBrandSettings,
} from "@/config/brandSettings";
import { getVerticalOfferConfig } from "@/config/verticalOffers";
import {
  OUTREACH_OFFER_CTA,
  OUTREACH_PREVIEW_CTA,
} from "@/services/outreach/outreachCopy";
import { normalizeVerticalSlug } from "@/verticals/normalizeVerticalSlug.shared";
import type { FollowupTemplateId } from "@/types/domain";

export interface FollowupTemplateInput {
  business_name: string;
  city: string;
  contact_first_name: string | null;
  verticalSlug?: string;
  brand: MeneerMarketingBrandSettings;
  /** Optionele social-proof regel (alleen last_ping). */
  social_proof_line?: string | null;
}

export interface FollowupRenderResult {
  subject: string;
  body_text: string;
  template: FollowupTemplateId;
}

function salutation(firstName: string | null): string {
  if (firstName && firstName.length >= 2 && firstName.length <= 20) {
    return `Hoi ${firstName},`;
  }
  return "Hoi,";
}

function signatureBlock(brand: MeneerMarketingBrandSettings): string {
  const sender = getSenderDisplay(brand);
  return ["Groet,", "", sender.signature_name].join("\n");
}

function verticalNoun(verticalSlug: string): string {
  const offer = getVerticalOfferConfig(verticalSlug);
  return offer?.businessNoun ?? "studio";
}

export {
  FOLLOWUP_TEMPLATE_OPTIONS,
  followupTemplateLabel,
} from "@/services/followup/followupTemplateOptions";

export function renderFollowupTemplate(
  template: FollowupTemplateId,
  input: FollowupTemplateInput,
): FollowupRenderResult {
  const verticalSlug = normalizeVerticalSlug(input.verticalSlug);
  const noun = verticalNoun(verticalSlug);
  const greeting = salutation(input.contact_first_name);
  const sig = signatureBlock(input.brand);

  if (template === "check_in") {
    const subject = `Even checken · ${input.business_name}`;
    const body_text = [
      greeting,
      "",
      `Kort nog even: heb je het concept voor ${input.business_name} al kunnen bekijken?`,
      "",
      OUTREACH_PREVIEW_CTA,
      "",
      `Als je wilt zien hoe ik met ${noun === "studio" ? "studio's" : `${noun}s`} samenwerk:`,
      OUTREACH_OFFER_CTA,
      "",
      sig,
    ].join("\n");
    return { subject, body_text, template };
  }

  if (template === "last_ping") {
    const subject = `Nog even over ${input.business_name}`;
    const social =
      input.social_proof_line?.trim() ||
      (verticalSlug === "pilates"
        ? "Ter inspiratie: zo ziet een live preview eruit (Hills Pilates): https://meneermarketing.nl/preview/hills-pilates-rotterdam-minimal"
        : null);
    const body_text = [
      greeting,
      "",
      `Laatste ping van mijn kant. Ik werk nu met een paar ${noun === "studio" ? "studio's" : `${noun}s`} in ${input.city} en omgeving.`,
      "",
      ...(social ? [social, ""] : []),
      "Jouw concept staat nog klaar:",
      OUTREACH_PREVIEW_CTA,
      "",
      "Vragen? Antwoord gerust op deze mail.",
      "",
      sig,
    ].join("\n");
    return { subject, body_text, template };
  }

  const subject = `Even over ${input.business_name}`;
  const body_text = [
    greeting,
    "",
    "Schrijf hier je follow-up. Houd het kort en persoonlijk.",
    "",
    OUTREACH_PREVIEW_CTA,
    "",
    sig,
  ].join("\n");
  return { subject, body_text, template: "custom" };
}
