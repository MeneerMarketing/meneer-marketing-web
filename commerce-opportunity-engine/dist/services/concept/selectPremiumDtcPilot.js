/**
 * Milestone 9.1 / 9.2 — PREMIUM_DTC pilot selection.
 * ENGINEERING: brief quality + assets + renderability.
 * OUTREACH: transformation contrast + commercial pitch fit.
 */
const OWN_BRAND_BONUS = {
    DTC_OWN_BRAND: 14,
    MOSTLY_OWN_BRAND: 10,
    MIXED: 2,
    SPECIALIST_RESELLER: -8,
    GENERAL_RESELLER: -40,
    MARKETPLACE: -50,
    UNKNOWN: -4,
};
function num(v) {
    if (v == null)
        return 0;
    const n = typeof v === "number" ? v : Number(v);
    return Number.isFinite(n) ? n : 0;
}
export function isEligiblePilotRow(row) {
    if (row.status !== "BRIEF_READY")
        return "status_not_BRIEF_READY";
    if (row.manual_excluded)
        return "manual_excluded";
    if (row.do_not_contact)
        return "do_not_contact";
    if (row.suggested_template_family !== "PREMIUM_DTC") {
        return "template_not_PREMIUM_DTC";
    }
    if (!row.primary_concept_product_url)
        return "missing_product_url";
    if (!row.primary_concept_product_title)
        return "missing_product_title";
    const model = String(row.brand_commerce_model);
    if (model === "GENERAL_RESELLER" || model === "MARKETPLACE") {
        return "general_retailer_or_marketplace";
    }
    if (num(row.concept_ready_score) < 65)
        return "score_below_65";
    return null;
}
export function scoreEngineeringPilotRow(row) {
    const model = String(row.brand_commerce_model);
    let s = num(row.concept_ready_score);
    s += OWN_BRAND_BONUS[model] ?? 0;
    s += num(row.catalog_focus_score) * 0.12;
    s += num(row.concept_asset_readiness_score) * 0.08;
    s += num(row.hero_product_score) * 0.08;
    s += num(row.pdp_transformation_potential) * 0.1;
    if (row.primary_concept_product_price != null)
        s += 2;
    if (num(row.catalog_focus_score) >= 80)
        s += 4;
    if (model === "DTC_OWN_BRAND" || model === "MOSTLY_OWN_BRAND")
        s += 3;
    return Math.round(s * 100) / 100;
}
/** @deprecated Use scoreEngineeringPilotRow */
export function scorePilotRow(row) {
    return scoreEngineeringPilotRow(row);
}
export function selectPremiumDtcPilot(rows, options) {
    const mode = options?.mode ?? "ENGINEERING";
    const outreachScores = options?.outreachScores ?? new Map();
    const rejected = [];
    const eligible = [];
    for (const row of rows) {
        const reason = isEligiblePilotRow(row);
        if (reason) {
            rejected.push({
                id: row.id,
                domain: row.normalized_domain,
                reason,
            });
            continue;
        }
        eligible.push(row);
    }
    if (eligible.length === 0) {
        throw new Error(`No eligible BRIEF_READY PREMIUM_DTC pilot found (${mode})`);
    }
    const ranked = eligible
        .map((row) => {
        const engineeringScore = scoreEngineeringPilotRow(row);
        const outreach = outreachScores.get(row.id);
        const outreachScore = outreach?.outreachConceptFitScore;
        const score = mode === "OUTREACH"
            ? outreachScore ?? 0
            : engineeringScore;
        return { row, score, engineeringScore, outreachScore };
    })
        .sort((a, b) => b.score - a.score);
    const top = ranked[0];
    const reasons = mode === "OUTREACH"
        ? [
            `Highest outreach concept fit (${top.score}) among ${eligible.length} eligible briefs`,
            `engineering_score=${top.engineeringScore}`,
            `transformation=${top.row.pdp_transformation_potential}`,
            `asset_readiness=${top.row.concept_asset_readiness_score}`,
            `catalog_focus=${top.row.catalog_focus_score}`,
            `commerce_model=${top.row.brand_commerce_model}`,
            `product_url=${top.row.primary_concept_product_url}`,
        ]
        : [
            `Highest engineering pilot score (${top.score}) among ${eligible.length} eligible PREMIUM_DTC briefs`,
            `concept_ready_score=${top.row.concept_ready_score}`,
            `commerce_model=${top.row.brand_commerce_model}`,
            `catalog_focus=${top.row.catalog_focus_score}`,
            `asset_readiness=${top.row.concept_asset_readiness_score}`,
            `hero_score=${top.row.hero_product_score}`,
            `transformation=${top.row.pdp_transformation_potential}`,
            `product_url=${top.row.primary_concept_product_url}`,
        ];
    if (top.row.brand_commerce_model === "DTC_OWN_BRAND" ||
        top.row.brand_commerce_model === "MOSTLY_OWN_BRAND") {
        reasons.push("Own-brand / mostly-own-brand fit");
    }
    if (mode === "OUTREACH" && top.outreachScore != null) {
        const o = outreachScores.get(top.row.id);
        if (o) {
            reasons.push(`deep_dive_pdp_fit=${o.components.deepDivePdpFit}`);
            reasons.push(`project_economic_fit=${o.components.projectEconomicFit}`);
            reasons.push(`current_pdp_weakness=${o.components.currentPdpWeakness}`);
            if (o.penalties.croAlreadyStrong > 0) {
                reasons.push(`cro_already_strong_penalty=${o.penalties.croAlreadyStrong}`);
            }
        }
    }
    return {
        mode,
        winner: top.row,
        score: top.score,
        engineeringScore: top.engineeringScore,
        outreachScore: top.outreachScore,
        reasons,
        rejected,
        ranked: ranked.map((r) => ({
            id: r.row.id,
            domain: r.row.normalized_domain,
            score: r.score,
            engineeringScore: r.engineeringScore,
            outreachScore: r.outreachScore,
        })),
    };
}
//# sourceMappingURL=selectPremiumDtcPilot.js.map