import { createAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/utils/normalize";
import type { VerticalWizardProvisionInput } from "@/lib/verticals/verticalLauncherWizard.shared";
import {
  createDiscoveryRunRecord,
  executeDiscoveryPipeline,
} from "@/services/discovery/launchDiscovery";
import { resolveCityForDiscovery } from "@/services/discovery/resolveCity";
import {
  refreshDynamicVerticalPackCache,
  type VerticalLauncherConfigRow,
} from "@/services/verticals/dynamicVerticalPack";
import { verticalRegistry } from "@/verticals/registry";
import type { CitySeed } from "@/verticals/shared-types";
import type { DiscoveryLauncherMode } from "@/config/discoveryLauncherModes";

export interface VerticalLauncherProvisionResult {
  configId: string;
  verticalId: string;
  cityId: string;
  citySlug: string;
  slug: string;
  discoveryRunId?: string;
  scaffold: {
    migrationSnippet: string;
    checklist: string[];
  };
}

function regionGroup(countryCode: "NL" | "BE"): "NL" | "VL" {
  return countryCode === "BE" ? "VL" : "NL";
}

function buildCitySeed(input: VerticalWizardProvisionInput): CitySeed {
  const slugBase = slugify(input.pilotCity.name.trim());
  const slug =
    input.pilotCity.countryCode === "BE" ? `${slugBase}-be` : slugBase || "stad";

  return {
    slug,
    name: input.pilotCity.name.trim(),
    country_code: input.pilotCity.countryCode,
    region: input.pilotCity.region.trim(),
    region_group: regionGroup(input.pilotCity.countryCode),
    latitude: 0,
    longitude: 0,
    radius_km: input.pilotCity.radiusKm,
  };
}

function buildMigrationSnippet(input: VerticalWizardProvisionInput): string {
  return `-- Optional: handmatige seed (wizard heeft DB al gevuld)
INSERT INTO verticals (slug, name, description)
VALUES ('${input.slug}', '${input.name.replace(/'/g, "''")}', '${(input.description ?? "").replace(/'/g, "''")}')
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;`;
}

function buildChecklist(input: VerticalWizardProvisionInput): string[] {
  const items = [
    `Landingpagina op meneermarketing.nl aanmaken: ${input.landingPath}`,
    "TemplateRenderer uitbreiden als je niche-specifieke preview layouts wilt",
    `Env optioneel: MENEER_${input.slug.toUpperCase().replace(/-/g, "_")}_LANDING_LIVE=1`,
  ];
  if (verticalRegistry[input.slug]) {
    items.unshift("Vertical staat al in code registry. Wizard-config is een extra DB-laag.");
  } else {
    items.unshift(
      "Optioneel: volledige code pack toevoegen in src/verticals/ (wizard draait al via DB-config)"
    );
  }
  return items;
}

export async function provisionVerticalFromWizard(
  input: VerticalWizardProvisionInput
): Promise<VerticalLauncherProvisionResult> {
  if (verticalRegistry[input.slug]?.status === "ACTIVE") {
    throw new Error(
      `Vertical '${input.slug}' bestaat al als code pack. Kies een andere slug of start discovery via Leads.`
    );
  }

  const client = createAdminClient();
  const pilotSeed = buildCitySeed(input);

  const resolvedCity = await resolveCityForDiscovery({
    verticalSlug: input.slug,
    countryCode: input.pilotCity.countryCode,
    cityName: input.pilotCity.name,
    region: input.pilotCity.region,
  });

  const citySeed: CitySeed = {
    ...pilotSeed,
    slug: resolvedCity.seed.slug,
    name: resolvedCity.seed.name,
    latitude: resolvedCity.seed.latitude,
    longitude: resolvedCity.seed.longitude,
    radius_km: input.pilotCity.radiusKm,
  };

  const now = new Date().toISOString();

  const { data: verticalRow, error: verticalError } = await client
    .from("verticals")
    .upsert(
      {
        slug: input.slug,
        name: input.name,
        description: input.description ?? null,
        active: true,
        updated_at: now,
      },
      { onConflict: "slug" }
    )
    .select("id")
    .single();

  if (verticalError || !verticalRow?.id) {
    throw new Error(verticalError?.message ?? "Vertical opslaan mislukt");
  }

  for (const template of input.templateVariants) {
    const { error: templateError } = await client.from("templates").upsert(
      {
        vertical_id: verticalRow.id,
        variant: template.variant,
        name: template.name,
        description: template.description ?? null,
        active: true,
        updated_at: now,
      },
      { onConflict: "vertical_id,variant" }
    );
    if (templateError) {
      throw new Error(templateError.message);
    }
  }

  const configPayload = {
    slug: input.slug,
    name: input.name,
    description: input.description ?? null,
    blueprint_slug: input.blueprintSlug,
    status: "ACTIVE",
    discovery_terms: input.discoveryTerms,
    discovery_intents: null,
    category_hints: input.categoryHints ?? [],
    negative_name_patterns: input.negativeNamePatterns ?? [],
    landing_path: input.landingPath,
    inbound_source: input.inboundSource,
    landing_live: input.landingLive,
    template_variants: input.templateVariants,
    pilot_city: citySeed,
    business_label: input.businessLabel,
    business_noun: input.businessNoun,
    edition_label: input.editionLabel,
    updated_at: now,
  };

  const { data: configRow, error: configError } = await client
    .from("vertical_launcher_configs")
    .upsert(configPayload, { onConflict: "slug" })
    .select("*")
    .single();

  if (configError || !configRow) {
    throw new Error(configError?.message ?? "Wizard-config opslaan mislukt");
  }

  await client.from("city_acquisition_settings").upsert(
    {
      vertical_id: verticalRow.id,
      city_id: resolvedCity.cityId,
      acquisition_status: "ACQUISITION_ALLOWED",
      protection_reason: null,
      updated_at: now,
    },
    { onConflict: "vertical_id,city_id" }
  );

  await refreshDynamicVerticalPackCache(client);

  let discoveryRunId: string | undefined;
  if (input.launchDiscovery) {
    const mode: DiscoveryLauncherMode = input.discoveryMode ?? "STANDARD";
    const run = await createDiscoveryRunRecord({
      verticalSlug: input.slug,
      countryCode: input.pilotCity.countryCode,
      cityName: citySeed.name,
      region: input.pilotCity.region,
      mode,
    });
    discoveryRunId = run.runId;
    await executeDiscoveryPipeline({
      runId: run.runId,
      verticalSlug: input.slug,
      citySeed: run.citySeed,
      countryCode: input.pilotCity.countryCode,
      mode,
    });
  }

  return {
    configId: (configRow as VerticalLauncherConfigRow).id,
    verticalId: verticalRow.id,
    cityId: resolvedCity.cityId,
    citySlug: citySeed.slug,
    slug: input.slug,
    discoveryRunId,
    scaffold: {
      migrationSnippet: buildMigrationSnippet(input),
      checklist: buildChecklist(input),
    },
  };
}
