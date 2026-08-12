import type { VerticalCampaignPersonalization } from "@/data/verticals/types";

const SAFE_REF_PATTERN = /^[a-zA-Z0-9_-]{8,64}$/;

/**
 * Campaign ref foundation voor Vertical Growth Pages.
 * Token wordt NOOIT rechtstreeks gerenderd. Alleen server-side gekoppelde lead-data
 * mag personalisatie opleveren. Zonder geldige lookup blijft de pagina generiek.
 */
export function isSafeCampaignRef(ref: string | null | undefined): boolean {
  if (!ref) return false;
  return SAFE_REF_PATTERN.test(ref);
}

export interface ResolveCampaignRefResult {
  ref: string | null;
  personalization: VerticalCampaignPersonalization | null;
}

/**
 * Placeholder-resolver. Later: lookup in Local Growth Engine.
 * Nu: valideert formaat en retourneert geen personalisatie.
 */
export async function resolveCampaignRef(
  rawRef: string | null | undefined,
): Promise<ResolveCampaignRefResult> {
  if (!isSafeCampaignRef(rawRef)) {
    return { ref: null, personalization: null };
  }

  // TODO: server-side koppeling aan Local Growth Engine lead
  // Nooit query-data rechtstreeks in UI plakken.
  return {
    ref: rawRef ?? null,
    personalization: null,
  };
}
