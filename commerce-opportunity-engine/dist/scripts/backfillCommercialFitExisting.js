import { config } from "dotenv";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "../config/env.js";
import { createSupabaseServerClient } from "../services/supabase/client.js";
import { classifyProductMerchantRelationship } from "../services/scoring/productMerchantRelationship.js";
import { recommendProjectType } from "../services/scoring/projectType.js";
import { one } from "../utils/one.js";
const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, "../../");
config({ path: resolve(projectRoot, ".env"), quiet: true });
const IDS = [
    "dc1d09e5-98e6-40de-9cac-52e4fddcc252",
    "7082f47f-d851-4adc-92a2-e0ce2b203fd0",
];
async function main() {
    const env = loadEnv();
    const supabase = createSupabaseServerClient(env);
    for (const id of IDS) {
        const { data: opp, error } = await supabase
            .from("opportunities")
            .select(`id, opportunity_score, meneer_marketing_fit_score, rebuild_potential,
         pdp_improvement_potential, full_rebuild_potential, latest_audit_id,
         brands!inner (
           normalized_domain, platform, platform_candidate, business_type,
           retailer_scale_score, manual_excluded, confirmed_google_advertiser
         ),
         pages ( product_name, product_brand )`)
            .eq("id", id)
            .single();
        if (error || !opp)
            throw new Error(error?.message ?? "missing opp");
        const brand = one(opp.brands);
        const page = one(opp.pages);
        if (!brand)
            throw new Error("missing brand");
        const merchant = classifyProductMerchantRelationship({
            productBrand: page?.product_brand ?? null,
            productName: page?.product_name ?? null,
            shopName: null,
            domain: String(brand.normalized_domain),
            businessType: brand.business_type ?? null,
            pageTitle: null,
            adHeadline: null,
        });
        const full = opp.full_rebuild_potential != null
            ? Number(opp.full_rebuild_potential)
            : Number(opp.rebuild_potential);
        const pdp = opp.pdp_improvement_potential != null
            ? Number(opp.pdp_improvement_potential)
            : Math.min(100, Math.round(full + 10));
        const project = recommendProjectType({
            platform: brand.platform ?? null,
            platformCandidate: brand.platform_candidate ?? null,
            businessType: brand.business_type ?? null,
            productRelationship: merchant.relationship,
            fullRebuildPotential: full,
            pdpImprovementPotential: pdp,
            mmFitScore: Number(opp.meneer_marketing_fit_score),
            manualExcluded: Boolean(brand.manual_excluded),
            retailerScale: brand.retailer_scale_score != null
                ? Number(brand.retailer_scale_score)
                : null,
        });
        const patch = {
            product_merchant_relationship: merchant.relationship,
            product_merchant_relationship_confidence: merchant.confidence,
            product_merchant_relationship_evidence: merchant.evidence,
            pdp_improvement_potential: pdp,
            full_rebuild_potential: full,
            recommended_project_type: project.projectType,
            recommended_project_reason: project.reason,
            updated_at: new Date().toISOString(),
        };
        await supabase.from("opportunities").update(patch).eq("id", id);
        if (opp.latest_audit_id) {
            await supabase.from("audits").update(patch).eq("id", opp.latest_audit_id);
        }
        console.log(`${brand.normalized_domain}: ${merchant.relationship} → ${project.projectType} (PDP ${pdp}, rebuild ${full})`);
    }
}
main().catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=backfillCommercialFitExisting.js.map