/**
 * Milestone 9.7 — first-party store classification gate.
 */
export function classifyFirstPartyStore(input) {
    const evidence = [];
    const light = input.light;
    if (!light || light.crawlStatus !== "success") {
        return { storeClass: "UNKNOWN", evidence: ["homepage_unreadable"] };
    }
    if (!light.isEcommerce) {
        const type = (light.businessType ?? "").toUpperCase();
        if (type === "SERVICE_BUSINESS" || type === "NON_ECOMMERCE") {
            return { storeClass: "BRAND_INFORMATION_ONLY", evidence: ["non_ecommerce"] };
        }
        return { storeClass: "UNKNOWN", evidence: ["no_ecommerce_signal"] };
    }
    evidence.push("ecommerce_detected");
    const bodyReasoning = (light.businessTypeReasoning ?? "").toLowerCase();
    if (/distributor|distributeur|dealer|reseller only/i.test(bodyReasoning)) {
        return { storeClass: "DISTRIBUTOR_ONLY", evidence: [...evidence, "distributor_language"] };
    }
    if (/b2b|zakelijk only|professionals only|inloggen dealer/i.test(bodyReasoning)) {
        return { storeClass: "B2B_ONLY", evidence: [...evidence, "b2b_language"] };
    }
    if (input.purchaseMode === "DIRECT_ECOMMERCE" ||
        (input.hasProductPages && input.heroPrice != null)) {
        return { storeClass: "DTC_ECOMMERCE", evidence: [...evidence, "direct_purchase_signals"] };
    }
    if (input.purchaseMode === "LEAD_GENERATION" || input.purchaseMode === "SHOWROOM_ASSISTED") {
        return { storeClass: "BRAND_INFORMATION_ONLY", evidence: [...evidence, "lead_or_showroom"] };
    }
    return { storeClass: "UNKNOWN", evidence: [...evidence, "store_class_unclear"] };
}
export function passesDtcEcommerceGate(storeClass) {
    return storeClass === "DTC_ECOMMERCE";
}
//# sourceMappingURL=firstPartyStoreGate.js.map