import { createAdminClient } from "@/lib/supabase/admin";
import { writeActivity } from "@/lib/repositories/lge";
import {
  searchBusinessListings,
  type BusinessListingItem,
} from "@/services/discovery/dataforseoBusinessListings";
import { qualifyPilatesListing } from "@/services/discovery/qualifyPilates";
import {
  citiesForScope,
  pilatesVertical,
  type CitySeed,
  type DiscoveryMode,
  type DiscoveryScope,
} from "@/verticals/pilates";
import { normalizeDomain, slugify } from "@/lib/utils/normalize";

export interface DiscoveryRunInput {
  scope: DiscoveryScope;
  mode: DiscoveryMode;
  /** Limit to specific city slugs (e.g. ['arnhem'] for first live test) */
  citySlugs?: string[];
  maxCost?: number;
  maxResults?: number;
  terms?: string[];
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

export async function runPilatesDiscovery(
  input: DiscoveryRunInput
): Promise<DiscoveryRunResult> {
  const client = createAdminClient();
  const maxCost = input.maxCost ?? Number(process.env.DISCOVERY_MAX_COST_PER_RUN ?? 0.15);
  const maxResults =
    input.maxResults ?? Number(process.env.DISCOVERY_MAX_RESULTS ?? 15);
  const testMode =
    input.mode === "TEST" || process.env.DISCOVERY_TEST_MODE === "true";

  const { data: vertical, error: verticalError } = await client
    .from("verticals")
    .select("id, slug")
    .eq("slug", "pilates")
    .single();
  if (verticalError || !vertical) throw new Error("Pilates vertical ontbreekt in Supabase");

  let cities = citiesForScope(input.scope);
  if (input.citySlugs?.length) {
    cities = cities.filter((c) => input.citySlugs!.includes(c.slug));
  }
  if (testMode) {
    cities = cities.slice(0, Math.max(1, cities.length ? 1 : 0));
  }

  const terms = (input.terms?.length ? input.terms : pilatesVertical.discoveryTerms).slice(
    0,
    testMode ? 2 : pilatesVertical.discoveryTerms.length
  );

  const { data: run, error: runError } = await client
    .from("discovery_runs")
    .insert({
      vertical_id: vertical.id,
      scope: input.scope,
      mode: input.mode,
      status: "RUNNING",
      started_at: new Date().toISOString(),
      config_snapshot: {
        scope: input.scope,
        mode: input.mode,
        citySlugs: cities.map((c) => c.slug),
        terms,
        maxCost,
        maxResults,
        testMode,
      },
    })
    .select("*")
    .single();

  if (runError || !run) throw runError ?? new Error("Kon discovery_run niet aanmaken");

  await writeActivity(client, {
    activity_type: "DISCOVERY_STARTED",
    title: `Discovery gestart · Pilates · ${input.scope}`,
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
  let hardStop = false;

  try {
    for (const city of cities) {
      if (hardStop) break;
      const cityId = await ensureCity(client, city);

      // Ensure exclusivity row exists
      await client.from("city_exclusivity").upsert(
        {
          vertical_id: vertical.id,
          city_id: cityId,
          status: "AVAILABLE",
        },
        { onConflict: "vertical_id,city_id", ignoreDuplicates: true }
      );

      for (const term of terms) {
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
          const result = await searchBusinessListings({
            description: term,
            title: term,
            location_coordinate: `${city.latitude},${city.longitude},${city.radius_km}`,
            limit,
            tag: `lge-pilates-${city.slug}`,
          });

          apiCalls += 1;
          apiCost += result.cost;

          for (const item of result.items) {
            if (!item.title) continue;

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
            const qualification = qualifyPilatesListing(item);
            const domain = normalizeDomain(item.domain ?? item.url);
            const nowIso = new Date().toISOString();

            let businessId: string;

            if (dup) {
              duplicates += 1;
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
                  primary_seo_keyword: pilatesVertical.seoDefaults.primaryTemplate(city.name),
                  secondary_seo_keywords: pilatesVertical.seoDefaults.secondaryTemplates.map(
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
          errors.push(`${city.name} / ${term}: ${message}`);
        }
      }
    }

    const status = errors.length && newBusinesses === 0 && businessesFound === 0
      ? "FAILED"
      : "COMPLETED";

    await client
      .from("discovery_runs")
      .update({
        status,
        completed_at: new Date().toISOString(),
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

    await writeActivity(client, {
      activity_type: "DISCOVERY_COMPLETED",
      title: `Discovery ${status.toLowerCase()} · Pilates · ${input.scope}`,
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
    };
  }
}
