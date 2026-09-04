import { PROJECT_TYPE_THRESHOLDS, } from "../../config/commercialFit.js";
export function recommendProjectType(input) {
    const t = PROJECT_TYPE_THRESHOLDS;
    const platform = (input.platform ?? input.platformCandidate ?? "").toUpperCase();
    const full = input.fullRebuildPotential ?? 0;
    const pdp = input.pdpImprovementPotential ?? 0;
    const rel = input.productRelationship;
    if (input.manualExcluded || input.mmFitScore < t.notAGoodFitMaxMmFit) {
        return {
            projectType: "NOT_A_GOOD_FIT",
            reason: "MM Fit te laag of handmatig uitgesloten",
        };
    }
    if ((input.retailerScale ?? 0) > 75) {
        return {
            projectType: "NOT_A_GOOD_FIT",
            reason: "Retailer scale te hoog voor custom rebuild traject",
        };
    }
    if (platform === "WOOCOMMERCE") {
        return {
            projectType: "WOOCOMMERCE_TO_SHOPIFY",
            reason: "WooCommerce-platform met migratiepotentieel naar Shopify",
        };
    }
    const ownBrandBoost = rel === "OWN_BRAND" || rel === "EXCLUSIVE_BRAND";
    if (platform === "SHOPIFY" &&
        full >= t.customRebuildMinFullRebuild &&
        input.mmFitScore >= t.customRebuildMinMmFit &&
        ownBrandBoost) {
        return {
            projectType: "CUSTOM_SHOPIFY_REBUILD",
            reason: "Eigen merk + Shopify + hoge full rebuild potential",
        };
    }
    if (platform === "SHOPIFY" &&
        pdp >= t.croRedesignMinPdp &&
        (rel === "RESELLER_PRODUCT" ||
            full <= t.croRedesignMaxFullRebuild ||
            (!ownBrandBoost && full >= 60))) {
        return {
            projectType: "SHOPIFY_CRO_REDESIGN",
            reason: rel === "RESELLER_PRODUCT"
                ? "Multi-brand specialist: sterkere fit op Shopify CRO/PDP redesign dan merk-rebuild"
                : "Shopify CRO redesign past beter dan volledige merk-rebuild",
        };
    }
    if (pdp >= t.pdpOnlyMinPdp) {
        return {
            projectType: "PDP_OPTIMIZATION",
            reason: "Concrete productpagina-verbeteringen zonder volledige rebuild-case",
        };
    }
    if (platform === "SHOPIFY" && full >= 45) {
        return {
            projectType: "DESIGN_UPGRADE",
            reason: "Visuele/design upgrade zonder zware CRO-case",
        };
    }
    // High MM Fit own-brand with already-strong PDP: still a fit client, light design upside
    if (platform === "SHOPIFY" &&
        input.mmFitScore >= 70 &&
        ownBrandBoost) {
        return {
            projectType: "DESIGN_UPGRADE",
            reason: "Eigen merk + hoge MM Fit; huidige PDP al sterk, dus eerder design/polish dan rebuild",
        };
    }
    if (platform === "SHOPIFY" && input.mmFitScore >= 65 && pdp >= 35) {
        return {
            projectType: "PDP_OPTIMIZATION",
            reason: "Shopify specialist met beperkte maar reële PDP-verbeterkans",
        };
    }
    return {
        projectType: "NOT_A_GOOD_FIT",
        reason: "Onvoldoende rebuild- of PDP-signalen voor een scherpe propositie",
    };
}
export function buildInternalSalesAngle(input) {
    if (input.aiSalesAngle && input.aiSalesAngle.trim().length > 40) {
        // Prefer Claude angle when present; append relationship context if missing.
        const base = input.aiSalesAngle.trim();
        if (/reseller|eigen merk|own brand|multi-brand/i.test(base))
            return base.slice(0, 600);
        const suffix = input.productRelationship === "RESELLER_PRODUCT"
            ? " Positioneer eerder als Shopify CRO/PDP redesign dan volledige merk-rebuild (reseller assortiment)."
            : input.productRelationship === "OWN_BRAND" &&
                input.projectType === "CUSTOM_SHOPIFY_REBUILD"
                ? " Eigen merk + paid acquisitie maakt custom Shopify rebuild logischer."
                : input.productRelationship === "OWN_BRAND"
                    ? " Eigen merk; huidige propositie is eerder polish/design dan volledige rebuild."
                    : "";
        return `${base}${suffix}`.slice(0, 600);
    }
    const platform = input.platform ?? "onbekend platform";
    const paid = input.confirmedAdvertiser
        ? "aantoonbare Google Ads-activiteit"
        : "commerciële productfocus";
    if (input.productRelationship === "RESELLER_PRODUCT") {
        return `Sterke specialistische ${platform}-webshop (${input.domain}) met ${paid}. De productpagina toont externe merken (reseller). Positioneer dit eerder als Shopify CRO/PDP redesign dan volledige merk-rebuild.`.slice(0, 600);
    }
    if (input.productRelationship === "OWN_BRAND") {
        return `Eigen merk op ${platform} (${input.domain}) met ${paid}. PDP-verbeterkans ${input.pdpPotential ?? "n/a"} / full rebuild ${input.fullRebuildPotential ?? "n/a"}. Custom Shopify rebuild is de logische hooflijn wanneer rebuild potential hoog is.`.slice(0, 600);
    }
    return `Prospect ${input.domain} (${platform}). Aanbevolen project: ${input.projectType}. PDP ${input.pdpPotential ?? "n/a"} / rebuild ${input.fullRebuildPotential ?? "n/a"}.`.slice(0, 600);
}
//# sourceMappingURL=projectType.js.map