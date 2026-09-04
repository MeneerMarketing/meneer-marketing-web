import { createAdminClient } from "@/lib/supabase/admin";
import { writeActivity } from "@/lib/repositories/lge";
import {
  searchBusinessListings,
  type BusinessListingItem,
} from "@/services/discovery/dataforseoBusinessListings";
import { getVerticalRuntime } from "@/verticals/runtime";
import type { CitySeed, DiscoveryMode, DiscoveryScope } from "@/verticals/shared-types";
import {
  intentLabelForCity,
  intentsFromTerms,
  type CoverageThresholds,
  type DiscoveryIntentKind,
  type DiscoveryQueryIntent,
} from "@/verticals/pilates/discoveryQueries";
import { normalizeDomain, slugify } from "@/lib/utils/normalize";
import { enrichBusinessEmailFromWebsite } from "@/services/enrichment/enrichBusinessEmail";
import type { DiscoveryLauncherMode } from "@/config/discoveryLauncherModes";

export interface DiscoveryRunInput {
  verticalSlug?: string;
  scope: DiscoveryScope;
  mode: DiscoveryMode;
  /** Limit to specific city slugs (e.g. ['arnhem'] for first live test) */
  citySlugs?: string[];
  /** Direct city seeds (launcher). Overschrijft citiesForScope. */
  citySeeds?: CitySeed[];
  /** Bestaande discovery_run bijwerken i.p.v. nieuwe aanmaken. */
  existingRunId?: string;
  launcherMode?: DiscoveryLauncherMode;
  /** Launcher: geen test-slice op 1 stad en geen DISCOVERY_TEST_MODE limiet. */
  skipTestLimits?: boolean;
  maxCost?: number;
  maxResults?: number;
  terms?: string[];
  /** Hoeveel zoekhoeken per stad. Laat leeg voor alle intents. */
  maxIntents?: number;
}

/** Wat één zoekhoek nog toevoegde bovenop de vorige. */
export interface CoverageQueryRow {
  intent_id: string;
  label: string;
  kind: DiscoveryIntentKind;
  broad: boolean;
  results: number;
  unique_new: number;
  relevant_new: number;
  duplicates: number;
  api_cost: number;
  error: string | null;
}

export interface CityCoverageSummary {
  city_slug: string;
  city_name: string;
  queries_run: number;
  total_results: number;
  unique_businesses: number;
  relevant_businesses: number;
  duplicates: number;
  eligible_businesses: number;
  new_businesses: number;
  incremental_unique_by_query: CoverageQueryRow[];
  coverage_confidence: number;
  coverage_label: "HIGH" | "MEDIUM" | "LOW";
  saturated: boolean;
  api_cost: number;
}

export interface DiscoveryRunResult {
  runId: string;
  status: "COMPLETED" | "FAILED";
  api_calls: number;
  api_cost: number;
  businesses_found: number;
  new_businesses: number;
  duplicates: number;
  qualified: number;
  excluded: number;
  errors: string[];
  coverage: CityCoverageSummary[];
}

/**
 * Eén zoekhoek is nooit genoeg: een studio die Pilates aanbiedt zonder het woord
 * in de naam valt buiten een titel-zoekopdracht. Dekking is daarom de vraag of
 * extra hoeken nog nieuwe studio's opleveren. Zodra de laatste hoeken vrijwel
 * niets toevoegen, is de stad verzadigd en kunnen we op de lijst vertrouwen.
 */
function summarizeCoverage(input: {
  citySlug: string;
  cityName: string;
  rows: CoverageQueryRow[];
  uniqueBusinesses: number;
  relevantBusinesses: number;
  duplicates: number;
  eligibleBusinesses: number;
  newBusinesses: number;
  apiCost: number;
  coverageThresholds: CoverageThresholds;
}): CityCoverageSummary {
  const { saturationNewRatio, saturationTrailingQueries, minIntentsForHighConfidence } =
    input.coverageThresholds;

  const succeeded = input.rows.filter((row) => !row.error);
  const totalResults = input.rows.reduce((sum, row) => sum + row.results, 0);

  const trailing = succeeded.slice(-saturationTrailingQueries);
  const saturated =
    trailing.length === saturationTrailingQueries &&
    input.uniqueBusinesses > 0 &&
    trailing.every(
      (row) => row.unique_new / Math.max(1, input.uniqueBusinesses) <= saturationNewRatio
    );

  // Dekking leunt op twee dingen: hoeveel hoeken we werkelijk hebben gelopen en
  // of de laatste daarvan nog iets opleverden.
  const breadth = Math.min(1, succeeded.length / Math.max(1, minIntentsForHighConfidence));
  const confidence = Math.round((breadth * 0.6 + (saturated ? 0.4 : 0.1)) * 100);
  const label: CityCoverageSummary["coverage_label"] =
    confidence >= 80 ? "HIGH" : confidence >= 55 ? "MEDIUM" : "LOW";

  return {
    city_slug: input.citySlug,
    city_name: input.cityName,
    queries_run: succeeded.length,
    total_results: totalResults,
    unique_businesses: input.uniqueBusinesses,
    relevant_businesses: input.relevantBusinesses,
    duplicates: input.duplicates,
    eligible_businesses: input.eligibleBusinesses,
    new_businesses: input.newBusinesses,
    incremental_unique_by_query: input.rows,
    coverage_confidence: confidence,
    coverage_label: label,
    saturated,
    api_cost: input.apiCost,
  };
}

function countryLabel(code: string): string {
  return code === "BE" ? "België" : "Nederland";
}

function listingStatus(item: BusinessListingItem): string | null {
  return (
    item.current_status ??
    item.work_time?.work_hours?.current_status ??
    null
  );
}

async function ensureCity(
  client: ReturnType<typeof createAdminClient>,
  seed: CitySeed
): Promise<string> {
  const { data: existing } = await client
    .from("cities")
    .select("id")
    .eq("slug", seed.slug)
    .maybeSingle();

  if (existing?.id) {
    await client
      .from("cities")
      .update({
        latitude: seed.latitude,
        longitude: seed.longitude,
        region_group: seed.region_group,
        country_code: seed.country_code,
        region: seed.region,
        name: seed.name,
      })
      .eq("id", existing.id);
    return existing.id as string;
  }

  const { data, error } = await client
    .from("cities")
    .insert({
      slug: seed.slug,
      name: seed.name,
      country_code: seed.country_code,
      region: seed.region,
      region_group: seed.region_group,
      latitude: seed.latitude,
      longitude: seed.longitude,
    })
    .select("id")
    .single();

  if (error) throw error;
  return data.id as string;
}

async function findDuplicate(
  client: ReturnType<typeof createAdminClient>,
  item: BusinessListingItem,
  verticalId: string
): Promise<{ id: string } | null> {
  if (item.place_id) {
    const { data } = await client
      .from("businesses")
      .select("id")
      .eq("vertical_id", verticalId)
      .eq("google_place_id", item.place_id)
      .maybeSingle();
    if (data?.id) return { id: data.id as string };
  }

  if (item.cid) {
    const { data } = await client
      .from("businesses")
      .select("id")
      .eq("vertical_id", verticalId)
      .eq("google_cid", item.cid)
      .maybeSingle();
    if (data?.id) return { id: data.id as string };
  }

  const domain = normalizeDomain(item.domain ?? item.url);
  const cityName = item.address_info?.city ?? null;
  if (domain && cityName) {
    const { data } = await client
      .from("businesses")
      .select("id, studio_name, address")
      .eq("vertical_id", verticalId)
      .eq("normalized_domain", domain);
    const match = (data ?? []).find((row) => {
      const name = String(row.studio_name ?? "").toLowerCase();
      const title = String(item.title ?? "").toLowerCase();
      return name === title || name.includes(title.slice(0, 12));
    });
    if (match?.id) return { id: match.id as string };
  }

  return null;
}

function buildSlug(title: string, city: string, placeId?: string | null): string {
  const base = slugify(`${title}-${city}`) || "studio";
  const suffix = placeId ? placeId.slice(-6).toLowerCase() : String(Date.now()).slice(-6);
  return `${base}-${suffix}`;
}

export async function runVerticalDiscovery(
  input: DiscoveryRunInput
): Promise<DiscoveryRunResult> {
  const verticalSlug = input.verticalSlug ?? "pilates";
  const runtime = getVerticalRuntime(verticalSlug);
  const client = createAdminClient();
  const maxCost = input.maxCost ?? Number(process.env.DISCOVERY_MAX_COST_PER_RUN ?? 0.15);
  const maxResults =
    input.maxResults ?? Number(process.env.DISCOVERY_MAX_RESULTS ?? 15);
  const testMode =
    !input.skipTestLimits &&
    (input.mode === "TEST" || process.env.DISCOVERY_TEST_MODE === "true");

  const { data: vertical, error: verticalError } = await client
    .from("verticals")
    .select("id, slug")
    .eq("slug", runtime.slug)
    .single();
  if (verticalError || !vertical) {
    throw new Error(`${runtime.displayName} vertical ontbreekt in Supabase`);
  }

  let cities: CitySeed[] = input.citySeeds?.length
    ? input.citySeeds
    : runtime.citiesForScope(input.scope);
  if (!input.citySeeds?.length && input.citySlugs?.length) {
    cities = cities.filter((c) => input.citySlugs!.includes(c.slug));
  }
  if (testMode && !input.citySeeds?.length) {
    cities = cities.slice(0, Math.max(1, cities.length ? 1 : 0));
  }
  if (cities.length === 0) {
    throw new Error("Geen steden geselecteerd voor discovery");
  }

  // Losse termen blijven werken voor oudere aanroepen; zonder termen lopen we
  // de zoekhoeken van de vertical af, op prioriteit.
  const allIntents = input.terms?.length
    ? intentsFromTerms(input.terms)
    : [...runtime.discoveryIntents].sort((a, b) => a.priority - b.priority);
  const intentLimit =
    input.maxIntents ?? (testMode ? 4 : allIntents.length);
  const intents = allIntents.slice(0, Math.max(1, intentLimit));
  const terms = intents.map((intent) => intent.title ?? intent.description ?? intent.id);

  let run: { id: string };
  if (input.existingRunId) {
    const { data: existing, error: existingError } = await client
      .from("discovery_runs")
      .select("id")
      .eq("id", input.existingRunId)
      .single();
    if (existingError || !existing) {
      throw existingError ?? new Error("Discovery run niet gevonden");
    }
    run = existing;
    await client
      .from("discovery_runs")
      .update({
        pipeline_phase: "SEARCHING",
        config_snapshot: {
          scope: input.scope,
          mode: input.mode,
          citySlugs: cities.map((c) => c.slug),
          terms,
          maxCost,
          maxResults,
          testMode,
          launcherMode: input.launcherMode ?? null,
        },
        updated_at: new Date().toISOString(),
      })
      .eq("id", run.id);
  } else {
    const { data: inserted, error: runError } = await client
      .from("discovery_runs")
      .insert({
        vertical_id: vertical.id,
        scope: input.scope,
        mode: input.mode,
        launcher_mode: input.launcherMode ?? null,
        status: "RUNNING",
        pipeline_phase: "SEARCHING",
        started_at: new Date().toISOString(),
        config_snapshot: {
          scope: input.scope,
          mode: input.mode,
          citySlugs: cities.map((c) => c.slug),
          terms,
          maxCost,
          maxResults,
          testMode,
          launcherMode: input.launcherMode ?? null,
        },
      })
      .select("*")
      .single();

    if (runError || !inserted) throw runError ?? new Error("Kon discovery_run niet aanmaken");
    run = inserted;
  }

  await writeActivity(client, {
    activity_type: "DISCOVERY_STARTED",
    title: `Discovery gestart · ${runtime.displayName} · ${input.scope}`,
    description: `${input.mode} mode · ${cities.map((c) => c.name).join(", ")}`,
    metadata: { run_id: run.id },
  });

  let apiCalls = 0;
  let apiCost = 0;
  let businessesFound = 0;
  let newBusinesses = 0;
  let duplicates = 0;
  let qualified = 0;
  let excluded = 0;
  const errors: string[] = [];
  const coverage: CityCoverageSummary[] = [];
  let hardStop = false;

  try {
    for (const city of cities) {
      if (hardStop) break;
      const cityId = await ensureCity(client, city);

      // Dekking per stad: welke listing zagen we al, en wat voegde elke hoek toe.
      const seenInCity = new Set<string>();
      const relevantInCity = new Set<string>();
      const coverageRows: CoverageQueryRow[] = [];
      let cityCost = 0;
      let cityNew = 0;
      let cityDuplicates = 0;
      let cityEligible = 0;

      // Ensure exclusivity row exists
      await client.from("city_exclusivity").upsert(
        {
          vertical_id: vertical.id,
          city_id: cityId,
          status: "AVAILABLE",
        },
        { onConflict: "vertical_id,city_id", ignoreDuplicates: true }
      );

      for (const intent of intents) {
        const term = intent.title ?? intent.description ?? intent.id;
        const label = intentLabelForCity(intent, city.name);
        const row: CoverageQueryRow = {
          intent_id: intent.id,
          label,
          kind: intent.kind,
          broad: Boolean(intent.broad),
          results: 0,
          unique_new: 0,
          relevant_new: 0,
          duplicates: 0,
          api_cost: 0,
          error: null,
        };

        if (hardStop) break;
        if (apiCost >= maxCost) {
          hardStop = true;
          errors.push(`Budgetgrens bereikt (${apiCost.toFixed(4)} >= ${maxCost})`);
          break;
        }
        if (businessesFound >= maxResults && testMode) {
          hardStop = true;
          break;
        }

        try {
          const remainingBudget = Math.max(0, maxCost - apiCost);
          if (remainingBudget <= 0) {
            hardStop = true;
            break;
          }

          const limit = testMode ? Math.min(10, maxResults) : Math.min(50, maxResults);
          // Titel en beschrijving samen zoeken werkt als een EN-filter, dus per
          // hoek sturen we alleen het veld dat die hoek bedoelt.
          const result = await searchBusinessListings({
            title: intent.title,
            description: intent.description,
            categories: intent.categories,
            location_coordinate: `${city.latitude},${city.longitude},${city.radius_km}`,
            limit,
            tag: `lge-${runtime.slug}-${city.slug}-${intent.id}`,
          });

          apiCalls += 1;
          apiCost += result.cost;
          cityCost += result.cost;
          row.api_cost = result.cost;
          row.results = result.items.length;

          for (const item of result.items) {
            if (!item.title) continue;

            const identity = String(
              item.place_id ?? item.cid ?? `${item.title}|${item.address ?? ""}`
            );
            const firstSighting = !seenInCity.has(identity);
            if (firstSighting) {
              seenInCity.add(identity);
              row.unique_new += 1;
            } else {
              row.duplicates += 1;
            }

            const relevant = runtime.isRelevantListing(item, { minFocus: "MEDIUM" });
            if (relevant && !relevantInCity.has(identity)) {
              relevantInCity.add(identity);
              row.relevant_new += 1;
            }

            // Brede hoeken meten alleen dekking. Een yogastudio zonder Pilates
            // hoort niet als lead in de database te belanden.
            if (intent.broad && !relevant) continue;
            if (!firstSighting) continue;

            // Skip Wallonia / French-only for VL scope safety
            const country = item.address_info?.country_code ?? city.country_code;
            if (input.scope === "VL" && country === "BE") {
              const region = (item.address_info?.region ?? "").toLowerCase();
              if (/wallon|namur|liège|liege|hainaut|luxembourg|bruxelles-capitale|brussels/i.test(region)) {
                excluded += 1;
                continue;
              }
            }

            businessesFound += 1;

            const dup = await findDuplicate(client, item, vertical.id);
            const qualification = runtime.qualifyListing(item);
            const domain = normalizeDomain(item.domain ?? item.url);
            const nowIso = new Date().toISOString();

            let businessId: string;

            if (dup) {
              duplicates += 1;
              cityDuplicates += 1;
              businessId = dup.id;
              await client
                .from("businesses")
                .update({
                  last_seen_at: nowIso,
                  phone: item.phone ?? undefined,
                  website_url: item.url ?? undefined,
                  domain: item.domain ?? domain,
                  normalized_domain: domain,
                  google_rating: item.rating?.value ?? undefined,
                  google_review_count: item.rating?.votes_count ?? undefined,
                  google_status: listingStatus(item),
                  google_logo_url: item.logo ?? undefined,
                  google_main_image_url: item.main_image ?? undefined,
                  last_activity_at: nowIso,
                })
                .eq("id", businessId);

              // bump discovery_count
              const { data: current } = await client
                .from("businesses")
                .select("discovery_count")
                .eq("id", businessId)
                .single();
              await client
                .from("businesses")
                .update({
                  discovery_count: Number(current?.discovery_count ?? 0) + 1,
                })
                .eq("id", businessId);

              await writeActivity(client, {
                business_id: businessId,
                activity_type: "BUSINESS_UPDATED",
                title: `Business bijgewerkt via discovery`,
                description: `${item.title} · query "${term}" · ${city.name}`,
                metadata: { run_id: run.id, query: term },
              });
            } else {
              const slug = buildSlug(item.title, city.name, item.place_id);
              const { data: inserted, error: insertError } = await client
                .from("businesses")
                .insert({
                  vertical_id: vertical.id,
                  city_id: cityId,
                  slug,
                  studio_name: item.title,
                  country: countryLabel(country),
                  website_url: item.url ?? null,
                  domain: item.domain ?? domain,
                  normalized_domain: domain,
                  description: item.description ?? null,
                  phone: item.phone ?? null,
                  address: item.address_info?.address ?? item.address ?? null,
                  postal_code: item.address_info?.zip ?? null,
                  latitude: item.latitude ?? null,
                  longitude: item.longitude ?? null,
                  google_place_id: item.place_id ?? null,
                  google_cid: item.cid ?? null,
                  google_category: item.category ?? null,
                  additional_categories: item.additional_categories ?? [],
                  google_rating: item.rating?.value ?? null,
                  google_review_count: item.rating?.votes_count ?? null,
                  review_rating: item.rating?.value ?? null,
                  review_count: item.rating?.votes_count ?? 0,
                  google_logo_url: item.logo ?? null,
                  google_main_image_url: item.main_image ?? null,
                  google_claimed: item.is_claimed ?? null,
                  google_status: listingStatus(item),
                  logo: item.logo ?? null,
                  source: "DATAFORSEO_BUSINESS_LISTINGS",
                  discovered_at: nowIso,
                  last_seen_at: nowIso,
                  discovery_count: 1,
                  lead_status: "DISCOVERED",
                  qualification_score: qualification.score,
                  qualification_status: qualification.status,
                  qualification_evidence: qualification.evidence,
                  is_chain: qualification.evidence.is_chain_suspect,
                  chain_name: qualification.evidence.chain_name,
                  lead_eligible: qualification.lead_eligible,
                  is_demo: false,
                  preview_status: "NOT_GENERATED",
                  raw_listing: item as Record<string, unknown>,
                  last_activity_at: nowIso,
                  primary_seo_keyword: runtime.vertical.seoDefaults.primaryTemplate(city.name),
                  secondary_seo_keywords: runtime.vertical.seoDefaults.secondaryTemplates.map(
                    (fn) => fn(city.name)
                  ),
                })
                .select("id")
                .single();

              if (insertError) {
                // Unique conflict race → treat as duplicate
                if (insertError.code === "23505") {
                  duplicates += 1;
                  continue;
                }
                errors.push(insertError.message);
                continue;
              }

              businessId = inserted.id as string;
              newBusinesses += 1;
              cityNew += 1;

              await writeActivity(client, {
                business_id: businessId,
                activity_type: "BUSINESS_DISCOVERED",
                title: `${item.title} ontdekt`,
                description: `${city.name} · ${term} · score ${qualification.score}`,
                metadata: { run_id: run.id, query: term, place_id: item.place_id },
              });
            }

            await client.from("discovery_occurrences").insert({
              business_id: businessId,
              discovery_run_id: run.id,
              vertical_id: vertical.id,
              query: term,
              source: "DATAFORSEO_BUSINESS_LISTINGS",
              city_name: city.name,
              country_code: city.country_code,
              raw_signal: {
                place_id: item.place_id,
                cid: item.cid,
                title: item.title,
                category: item.category,
              },
            });

            if (item.url) {
              try {
                await enrichBusinessEmailFromWebsite(client, {
                  businessId,
                  websiteUrl: item.url,
                  domain,
                  studioName: item.title,
                });
              } catch {
                /* enrichment mag discovery niet breken */
              }
            }

            if (qualification.excluded) {
              excluded += 1;
              await writeActivity(client, {
                business_id: businessId,
                activity_type: "BUSINESS_EXCLUDED",
                title: `${item.title} uitgesloten van lead-priority`,
                description: qualification.evidence.negatives.slice(0, 3).join(" · "),
                metadata: { run_id: run.id, score: qualification.score },
              });
            } else if (
              qualification.status === "QUALIFIED" ||
              qualification.status === "POTENTIAL"
            ) {
              qualified += 1;
              cityEligible += 1;
              if (!dup) {
                await writeActivity(client, {
                  business_id: businessId,
                  activity_type: "BUSINESS_QUALIFIED",
                  title: `${item.title} gekwalificeerd (${qualification.status})`,
                  description: `Score ${qualification.score}`,
                  metadata: { run_id: run.id, status: qualification.status },
                });
              }
            }
          }

          await client
            .from("discovery_runs")
            .update({
              api_calls: apiCalls,
              api_cost: apiCost,
              businesses_found: businessesFound,
              new_businesses: newBusinesses,
              duplicates,
              qualified,
              excluded,
              errors,
              updated_at: new Date().toISOString(),
            })
            .eq("id", run.id);
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          row.error = message;
          errors.push(`${city.name} / ${label}: ${message}`);
        }

        coverageRows.push(row);
      }

      const summary = summarizeCoverage({
        citySlug: city.slug,
        cityName: city.name,
        rows: coverageRows,
        uniqueBusinesses: seenInCity.size,
        relevantBusinesses: relevantInCity.size,
        duplicates: cityDuplicates,
        eligibleBusinesses: cityEligible,
        newBusinesses: cityNew,
        apiCost: cityCost,
        coverageThresholds: runtime.coverageThresholds,
      });
      coverage.push(summary);

      const { error: coverageError } = await client.from("discovery_coverage").insert({
        vertical_id: vertical.id,
        city_id: cityId,
        discovery_run_id: run.id,
        queries: intents.map((intent) => ({
          id: intent.id,
          label: intentLabelForCity(intent, city.name),
          kind: intent.kind,
          broad: Boolean(intent.broad),
        })),
        queries_run: summary.queries_run,
        total_results: summary.total_results,
        unique_businesses: summary.unique_businesses,
        relevant_businesses: summary.relevant_businesses,
        duplicates: summary.duplicates,
        eligible_businesses: summary.eligible_businesses,
        new_businesses: summary.new_businesses,
        incremental_unique_by_query: summary.incremental_unique_by_query,
        coverage_confidence: summary.coverage_confidence,
        coverage_label: summary.coverage_label,
        saturated: summary.saturated,
        api_cost: summary.api_cost,
      });
      if (coverageError) errors.push(`coverage ${city.name}: ${coverageError.message}`);
    }

    const status = errors.length && newBusinesses === 0 && businessesFound === 0
      ? "FAILED"
      : "COMPLETED";

    await client
      .from("discovery_runs")
      .update({
        status,
        pipeline_phase: status === "FAILED" ? "FAILED" : "COMPLETED",
        completed_at: new Date().toISOString(),
        api_calls: apiCalls,
        api_cost: apiCost,
        businesses_found: businessesFound,
        new_businesses: newBusinesses,
        duplicates,
        qualified,
        excluded,
        errors,
        coverage_summary: coverage.length
          ? {
              cities: coverage.map((row) => ({
                city_slug: row.city_slug,
                unique_businesses: row.unique_businesses,
                relevant_businesses: row.relevant_businesses,
                coverage_label: row.coverage_label,
                coverage_confidence: row.coverage_confidence,
              })),
            }
          : {},
        updated_at: new Date().toISOString(),
      })
      .eq("id", run.id);

    await writeActivity(client, {
      activity_type: "DISCOVERY_COMPLETED",
      title: `Discovery ${status.toLowerCase()} · ${runtime.displayName} · ${input.scope}`,
      description: `${newBusinesses} nieuw · ${duplicates} duplicates · cost $${apiCost.toFixed(4)}`,
      metadata: {
        run_id: run.id,
        api_calls: apiCalls,
        api_cost: apiCost,
        businesses_found: businessesFound,
      },
    });

    return {
      runId: run.id as string,
      status,
      api_calls: apiCalls,
      api_cost: apiCost,
      businesses_found: businessesFound,
      new_businesses: newBusinesses,
      duplicates,
      qualified,
      excluded,
      errors,
      coverage,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await client
      .from("discovery_runs")
      .update({
        status: "FAILED",
        completed_at: new Date().toISOString(),
        errors: [...errors, message],
        api_calls: apiCalls,
        api_cost: apiCost,
      })
      .eq("id", run.id);

    return {
      runId: run.id as string,
      status: "FAILED",
      api_calls: apiCalls,
      api_cost: apiCost,
      businesses_found: businessesFound,
      new_businesses: newBusinesses,
      duplicates,
      qualified,
      excluded,
      errors: [...errors, message],
      coverage,
    };
  }
}

/** @deprecated Gebruik runVerticalDiscovery met verticalSlug. */
export async function runPilatesDiscovery(
  input: Omit<DiscoveryRunInput, "verticalSlug">,
): Promise<DiscoveryRunResult> {
  return runVerticalDiscovery({ ...input, verticalSlug: "pilates" });
}

export async function runSkinClinicsDiscovery(
  input: Omit<DiscoveryRunInput, "verticalSlug">,
): Promise<DiscoveryRunResult> {
  return runVerticalDiscovery({ ...input, verticalSlug: "skin-clinics" });
}
