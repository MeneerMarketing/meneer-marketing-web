/**
 * Milestone 9.1 / 9.2 — Shared concept pilot hydration (targeted crawl + snapshot).
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { crawlPilotAssets } from "./pilotAssetCrawl.js";
import { buildPremiumDtcViewModel } from "./premiumDtcModelLoader.js";
import { resolveProspectTheme } from "./prospectThemeResolver.js";
import { logger } from "../../utils/logger.js";
export async function hydrateConceptPilot(supabase, winner, projectRoot, options) {
    const { data: briefRow, error: briefErr } = await supabase
        .from("coe_concept_briefs")
        .select("id, brief, recommended_section_plan, preview_slug")
        .eq("concept_candidate_id", winner.id)
        .order("concept_version", { ascending: false })
        .limit(1)
        .maybeSingle();
    if (briefErr)
        throw briefErr;
    if (!briefRow?.brief)
        throw new Error(`No brief found for concept ${winner.id}`);
    const brief = briefRow.brief;
    const sectionPlan = (briefRow.recommended_section_plan ||
        brief.recommended_section_plan);
    const productUrl = winner.primary_concept_product_url || brief.source_product_url;
    if (!productUrl)
        throw new Error("Pilot has no product URL");
    const homepageUrl = `https://${winner.normalized_domain}/`;
    logger.info("Concept pilot crawl starting", {
        domain: winner.normalized_domain,
        productUrl,
    });
    const crawl = await crawlPilotAssets({ productUrl, homepageUrl });
    const theme = resolveProspectTheme({
        brandColors: brief.brand_colors,
        cssColorCandidates: crawl.cssColorCandidates,
        brandAccentCandidates: crawl.brandAccentCandidates,
        fontCandidates: crawl.fontCandidates,
    });
    const viewModel = buildPremiumDtcViewModel({
        conceptId: winner.id,
        briefId: briefRow.id,
        brief,
        crawl,
        theme,
        sectionPlan,
    });
    const outDir = path.resolve(projectRoot, "dashboard/src/preview/concepts/data");
    await mkdir(outDir, { recursive: true });
    const suffix = options?.reportSuffix ?? "";
    const snapshotPath = path.join(outDir, `${winner.id}${suffix}.json`);
    const reportPath = path.join(outDir, `${winner.id}${suffix}.report.json`);
    await writeFile(snapshotPath, JSON.stringify(viewModel, null, 2), "utf8");
    if (options?.updateLatest) {
        await writeFile(path.join(outDir, "latest.json"), JSON.stringify(viewModel, null, 2), "utf8");
    }
    await supabase
        .from("coe_concept_briefs")
        .update({
        preview_slug: viewModel.meta.previewSlug,
        preview_url: `/preview/concept/${winner.id}`,
        preview_version: viewModel.meta.templateVersion,
        template_version: viewModel.meta.templateVersion,
    })
        .eq("id", briefRow.id);
    await supabase.from("coe_concept_events").insert({
        concept_candidate_id: winner.id,
        brand_id: winner.brand_id,
        event_type: "INTERNAL_PREVIEW_HYDRATED",
        payload: {
            previewLifecycle: "INTERNAL_PREVIEW",
            snapshot: `dashboard/src/preview/concepts/data/${winner.id}${suffix}.json`,
            domain: winner.normalized_domain,
        },
    });
    return {
        conceptId: winner.id,
        domain: winner.normalized_domain,
        productUrl,
        snapshotPath,
        reportPath,
        previewPath: `/preview/concept/${winner.id}`,
        viewModel,
        crawlSummary: {
            images: crawl.images.length,
            benefits: crawl.benefits.length,
            faqs: crawl.faqs.length,
            reviews: crawl.reviews.length,
            logo: Boolean(crawl.logoUrl),
            price: crawl.price,
            pages: crawl.pagesCrawled,
        },
    };
}
//# sourceMappingURL=hydrateConceptPilot.js.map