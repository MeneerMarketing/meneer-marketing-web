import { cache } from "react";
import { isConceptInstructorImage } from "@/lib/previewContentFallbacks";
import { isPreviewWorthyStudioPhoto, isTrustedPreviewImageUrl } from "@/lib/previewImagePolicy";
import { plainText } from "@/lib/text";
import { fetchWebsiteTeamMember } from "@/lib/websiteTeamExtractor";
import type { StudioData } from "@/types/studio";

function hasVerifiedTeamMember(team: StudioData["team"]): boolean {
  return team.some((member) => {
    const image = plainText(member.image_url);
    return (
      Boolean(image) &&
      !isConceptInstructorImage(image) &&
      isTrustedPreviewImageUrl(image) &&
      isPreviewWorthyStudioPhoto(image, plainText(member.name))
    );
  });
}

/** Vult team/instructors aan vanaf Over mij / About-pagina's wanneer er nog geen echte foto's zijn. */
export const enrichStudioTeam = cache(
  async (studio: StudioData, websiteUrl?: string | null): Promise<StudioData> => {
    if (hasVerifiedTeamMember(studio.team ?? [])) return studio;
    if (!websiteUrl?.trim()) return studio;

    const member = await fetchWebsiteTeamMember(
      websiteUrl.trim(),
      plainText(studio.studio_name)
    );
    if (!member) return studio;

    return {
      ...studio,
      team: [member],
    };
  }
);
