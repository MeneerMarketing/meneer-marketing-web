import { config } from "dotenv";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "../config/env.js";
import { createSupabaseServerClient } from "../services/supabase/client.js";
import { createRun, completeRun } from "../services/supabase/runsRepository.js";
import { discoverBrandContacts } from "../services/outreach/contactDiscovery.js";
import { isEmailOrDomainSuppressed, upsertDiscoveredContacts, } from "../services/outreach/outreachRepository.js";
import { logger } from "../utils/logger.js";
import { one } from "../utils/one.js";
const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, "../../");
config({ path: resolve(projectRoot, ".env"), quiet: true });
/**
 * Milestone 8 — free website contact discovery for top audited prospects.
 * Max 5 brands. No paid enrichment. DataForSEO $0.
 */
async function loadCandidateBrands(
// eslint-disable-next-line @typescript-eslint/no-explicit-any
supabase, limit) {
    const preferredDomains = [
        "boozyshop.nl",
        "huisdierspullen.nl",
        "dekbed-discounter.nl",
        "currentbody.nl",
    ];
    const { data, error } = await supabase
        .from("opportunities")
        .select(`
      id, opportunity_score, meneer_marketing_fit_score, audit_confidence,
      cro_audit_status, recommended_project_type, outreach_priority_score,
      brands!inner (
        id, normalized_domain, name, manual_excluded, do_not_contact,
        contact_status, first_touch_sent_at, business_type
      )
    `)
        .eq("cro_audit_status", "COMPLETED")
        .not("opportunity_score", "is", null)
        .order("meneer_marketing_fit_score", { ascending: false, nullsFirst: false })
        .limit(80);
    if (error)
        throw new Error(error.message);
    const seen = new Set();
    const brands = [];
    const mapped = (data ?? [])
        .map((row) => {
        const brand = one(row.brands);
        if (!brand)
            return null;
        if (brand.manual_excluded || brand.do_not_contact)
            return null;
        if (brand.first_touch_sent_at)
            return null;
        return {
            brandId: String(brand.id),
            domain: String(brand.normalized_domain),
            name: brand.name ?? null,
            opportunityId: row.id,
            mmFit: row.meneer_marketing_fit_score != null
                ? Number(row.meneer_marketing_fit_score)
                : 0,
        };
    })
        .filter(Boolean);
    // Prefer audited shortlist first, then remaining by MM Fit
    const ordered = [
        ...preferredDomains
            .map((d) => mapped.find((m) => m.domain === d))
            .filter(Boolean),
        ...mapped.filter((m) => !preferredDomains.includes(m.domain)),
    ];
    for (const item of ordered) {
        if (seen.has(item.domain))
            continue;
        seen.add(item.domain);
        brands.push({
            brandId: item.brandId,
            domain: item.domain,
            name: item.name,
            opportunityId: item.opportunityId,
        });
        if (brands.length >= limit)
            break;
    }
    return brands;
}
async function main() {
    const env = loadEnv();
    const supabase = createSupabaseServerClient(env);
    const maxBrands = env.M8_CONTACT_DISCOVERY_MAX_BRANDS;
    const candidates = await loadCandidateBrands(supabase, maxBrands);
    logger.info("M8 contact discovery start", {
        count: candidates.length,
        domains: candidates.map((c) => c.domain),
    });
    const run = await createRun(supabase, "contact_discovery", {
        milestone: "8",
        maxBrands,
    });
    const results = [];
    try {
        for (const candidate of candidates) {
            const suppressed = await isEmailOrDomainSuppressed(supabase, null, candidate.domain);
            if (suppressed) {
                results.push({
                    domain: candidate.domain,
                    skipped: true,
                    reason: "domain_suppressed",
                });
                continue;
            }
            const discovery = await discoverBrandContacts({
                domain: candidate.domain,
                timeoutMs: env.CRAWLER_TIMEOUT_MS,
            });
            const { preferredId } = await upsertDiscoveredContacts(supabase, candidate.brandId, discovery.contacts, discovery.preferred?.email ?? null);
            await supabase
                .from("brands")
                .update({
                contact_status: discovery.contactStatus,
                preferred_contact_id: preferredId,
                preferred_contact_reason: discovery.preferredReason,
                updated_at: new Date().toISOString(),
            })
                .eq("id", candidate.brandId);
            await supabase.from("coe_contact_discovery_runs").insert({
                run_id: run.id,
                brand_id: candidate.brandId,
                status: "completed",
                pages_checked: discovery.pagesChecked,
                emails_found: discovery.contacts.length,
                preferred_contact_id: preferredId,
                contact_status: discovery.contactStatus,
                evidence: discovery.evidence,
                completed_at: new Date().toISOString(),
            });
            results.push({
                domain: candidate.domain,
                contactStatus: discovery.contactStatus,
                emailsFound: discovery.contacts.length,
                pagesChecked: discovery.pagesChecked,
                preferredEmail: discovery.preferred?.email ?? null,
                preferredType: discovery.preferred?.emailType ?? null,
                preferredConfidence: discovery.preferred?.contactConfidence ?? null,
                preferredReason: discovery.preferredReason,
                emails: discovery.contacts.map((c) => ({
                    email: c.email,
                    type: c.emailType,
                    confidence: c.contactConfidence,
                    sourceUrl: c.sourceUrl,
                })),
            });
            logger.info("Contact discovery done", {
                domain: candidate.domain,
                status: discovery.contactStatus,
                emails: discovery.contacts.length,
            });
        }
        await completeRun(supabase, run.id, "completed", {
            results,
            dataForSeoCost: 0,
            anthropicCost: 0,
        });
        console.log("");
        console.log("MILESTONE 8 — CONTACT DISCOVERY");
        console.log("================================");
        console.log(`Prospects onderzocht: ${results.length}`);
        console.log(`DataForSEO: $0`);
        console.log("");
        for (const r of results) {
            console.log(String(r.domain).toUpperCase());
            if (r.skipped) {
                console.log(`  skipped: ${r.reason}`);
            }
            else {
                console.log(`  status: ${r.contactStatus}`);
                console.log(`  emails: ${r.emailsFound} (pages ${r.pagesChecked})`);
                console.log(`  preferred: ${r.preferredEmail ?? "—"} (${r.preferredType ?? "n/a"}) conf ${r.preferredConfidence ?? "—"}`);
                const emails = r.emails ?? [];
                for (const e of emails) {
                    console.log(`    - ${e.email} [${e.type}] conf=${e.confidence} ← ${e.sourceUrl}`);
                }
            }
            console.log("");
        }
        process.exit(0);
    }
    catch (error) {
        await completeRun(supabase, run.id, "failed", {
            error: error instanceof Error ? error.message : "unknown",
        });
        logger.error("Contact discovery failed", {
            error: error instanceof Error ? error.message : "unknown",
        });
        process.exit(1);
    }
}
main();
//# sourceMappingURL=discoverContacts.js.map