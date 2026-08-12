import type { VerticalCampaignPersonalization } from "@/data/verticals/types";
import {
  isSafeLgeCampaignRef,
  isValidCampaignContext,
  mapContextToPersonalization,
  resolveCampaignContext,
} from "@/lib/lge/campaign";

export interface ResolveCampaignRefResult {
  ref: string | null;
  personalization: VerticalCampaignPersonalization | null;
}

/**
 * Server-side campaign ref → LGE public context.
 * Invalid / offline / timeout → generieke pagina (geen crash, geen leak).
 */
export async function resolveCampaignRef(
  rawRef: string | null | undefined,
): Promise<ResolveCampaignRefResult> {
  if (!isSafeLgeCampaignRef(rawRef)) {
    return { ref: null, personalization: null };
  }

  const ref = rawRef as string;
  const context = await resolveCampaignContext(ref);

  if (!isValidCampaignContext(context)) {
    if (process.env.NODE_ENV === "development" && context?.valid === false) {
      console.info("[lge] invalid/expired campaign ref ignored");
    }
    return { ref: null, personalization: null };
  }

  return {
    ref,
    personalization: mapContextToPersonalization(context, ref),
  };
}

/** @deprecated use isSafeLgeCampaignRef */
export function isSafeCampaignRef(ref: string | null | undefined): boolean {
  return isSafeLgeCampaignRef(ref);
}
