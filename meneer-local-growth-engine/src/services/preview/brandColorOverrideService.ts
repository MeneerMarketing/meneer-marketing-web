import { createAdminClient } from "@/lib/supabase/admin";
import { isHex, normalizeHex } from "@/lib/color";
import { writeActivity } from "@/lib/repositories/lge";

export interface BrandColorOverrideInput {
  businessId: string;
  primaryColor: string;
  accentColor: string;
  secondaryColor?: string | null;
}

export interface BrandColorOverrideResult {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  previewUpdated: boolean;
}

function parseColor(label: string, value: string): string {
  const trimmed = value.trim();
  if (!isHex(trimmed)) {
    throw new Error(`${label} moet een geldige hex-kleur zijn (bijv. #2C2217)`);
  }
  return normalizeHex(trimmed);
}

function mergeBrandProfile(
  existing: Record<string, unknown> | null | undefined,
  colors: { primary: string; secondary: string; accent: string },
): Record<string, unknown> {
  return {
    ...(existing ?? {}),
    primary_color: colors.primary,
    secondary_color: colors.secondary,
    accent_color: colors.accent,
    manual_color_override: true,
    manual_color_override_at: new Date().toISOString(),
  };
}

function patchSnapshotColors(
  snapshot: Record<string, unknown> | null | undefined,
  colors: { primary: string; secondary: string; accent: string },
): Record<string, unknown> {
  return {
    ...(snapshot ?? {}),
    primary_color: colors.primary,
    secondary_color: colors.secondary,
    accent_color: colors.accent,
  };
}

export async function overrideBrandColors(
  input: BrandColorOverrideInput,
): Promise<BrandColorOverrideResult> {
  const primaryColor = parseColor("Primary", input.primaryColor);
  const accentColor = parseColor("Accent", input.accentColor);
  const secondaryColor = input.secondaryColor?.trim()
    ? parseColor("Secondary", input.secondaryColor)
    : null;

  const client = createAdminClient();

  const { data: business, error: businessError } = await client
    .from("businesses")
    .select("id, studio_name, primary_color, secondary_color, accent_color, brand_profile")
    .eq("id", input.businessId)
    .single();

  if (businessError || !business) {
    throw new Error("Lead niet gevonden");
  }

  const resolvedSecondary =
    secondaryColor ??
    (business.secondary_color && isHex(String(business.secondary_color))
      ? normalizeHex(String(business.secondary_color))
      : "#F4EFE6");

  const colors = {
    primary: primaryColor,
    secondary: resolvedSecondary,
    accent: accentColor,
  };

  const brandProfile = mergeBrandProfile(
    business.brand_profile as Record<string, unknown> | null,
    colors,
  );

  await client
    .from("businesses")
    .update({
      primary_color: colors.primary,
      secondary_color: colors.secondary,
      accent_color: colors.accent,
      brand_profile: brandProfile,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.businessId);

  const { data: preview } = await client
    .from("previews")
    .select("id, slug, studio_snapshot, brand_profile_snapshot")
    .eq("business_id", input.businessId)
    .in("status", ["READY", "APPROVED"])
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let previewUpdated = false;
  if (preview?.id) {
    await client
      .from("previews")
      .update({
        studio_snapshot: patchSnapshotColors(
          preview.studio_snapshot as Record<string, unknown> | null,
          colors,
        ),
        brand_profile_snapshot: mergeBrandProfile(
          preview.brand_profile_snapshot as Record<string, unknown> | null,
          colors,
        ),
        updated_at: new Date().toISOString(),
      })
      .eq("id", preview.id);
    previewUpdated = true;
  }

  await writeActivity(client, {
    business_id: input.businessId,
    activity_type: "BUSINESS_UPDATED",
    title: "Brandkleuren handmatig aangepast",
    description: `${colors.primary} · ${colors.accent}${previewUpdated && preview?.slug ? ` · preview /${preview.slug}` : ""}`,
    metadata: {
      primary_color: colors.primary,
      secondary_color: colors.secondary,
      accent_color: colors.accent,
      preview_id: preview?.id ?? null,
    },
  });

  return {
    primaryColor: colors.primary,
    secondaryColor: colors.secondary,
    accentColor: colors.accent,
    previewUpdated,
  };
}
