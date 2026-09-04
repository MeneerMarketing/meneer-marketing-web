/**
 * Milestone 9.5.1 — compare hero targets across milestone reports.
 */
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { heroProductIdFromUrl } from "./heroTargetMetadata.js";
async function loadCandidates(path) {
    try {
        const raw = await readFile(path, "utf8");
        const parsed = JSON.parse(raw);
        return parsed.candidates ?? [];
    }
    catch {
        return [];
    }
}
export async function runHeroDataConsistencyCheck(projectRoot) {
    const m94Path = resolve(projectRoot, "reports/high-ticket-discovery-report.json");
    const m95Path = resolve(projectRoot, "reports/design-gap-discovery-report.json");
    const m94 = await loadCandidates(m94Path);
    const m95 = await loadCandidates(m95Path);
    const m94ByDomain = new Map(m94.map((c) => [c.domain, c]));
    const m95ByDomain = new Map(m95.map((c) => [c.domain, c]));
    const domains = [...new Set([...m94ByDomain.keys(), ...m95ByDomain.keys()])].sort();
    const cases = [];
    for (const domain of domains) {
        const a = m94ByDomain.get(domain);
        const b = m95ByDomain.get(domain);
        if (!a && !b)
            continue;
        const m94Block = a
            ? {
                heroProductId: heroProductIdFromUrl(a.heroProductUrl ?? null),
                heroTitle: a.heroProduct ?? null,
                heroPrice: a.heroPrice ?? null,
                heroProductUrl: a.heroProductUrl ?? null,
                keywords: a.googleAdsEvidence?.keywords ?? [],
            }
            : null;
        const m95Block = b
            ? {
                heroProductId: heroProductIdFromUrl(b.heroProductUrl ?? null),
                heroTitle: b.heroProduct ?? null,
                heroPrice: b.heroPrice ?? null,
                heroProductUrl: b.heroProductUrl ?? null,
                keywords: b.googleAdsEvidence?.keywords ?? [],
            }
            : null;
        let assessment = "consistent";
        let likelyCause = "same hero target across reports";
        if (m94Block && m95Block) {
            const sameUrl = m94Block.heroProductUrl &&
                m95Block.heroProductUrl &&
                m94Block.heroProductUrl === m95Block.heroProductUrl;
            const sameId = m94Block.heroProductId &&
                m95Block.heroProductId &&
                m94Block.heroProductId === m95Block.heroProductId;
            if (!sameUrl && !sameId) {
                assessment = "hero_target_changed";
                likelyCause =
                    m94Block.keywords.join(", ") !== m95Block.keywords.join(", ")
                        ? "different discovery keywords resolved to different advertised products"
                        : "hero resolver picked a different product for the same keyword context";
            }
            else if (m94Block.heroPrice !== m95Block.heroPrice) {
                assessment = "price_mismatch_same_product";
                likelyCause = "price serialization or stale price on one of the placements";
            }
        }
        cases.push({ domain, m94: m94Block, m95: m95Block, assessment, likelyCause });
    }
    const vitalwave = cases.find((c) => c.domain === "vitalwave.nl");
    const vitalwaveNote = vitalwave
        ? `Vitalwave M9.4: ${vitalwave.m94?.heroTitle ?? "?"} @ €${vitalwave.m94?.heroPrice ?? "?"} (${vitalwave.m94?.keywords.join(", ")}) · M9.5: ${vitalwave.m95?.heroTitle ?? "?"} @ €${vitalwave.m95?.heroPrice ?? "?"} (${vitalwave.m95?.keywords.join(", ")}) · ${vitalwave.likelyCause}`
        : "vitalwave.nl not in overlap set";
    return { cases, vitalwaveNote };
}
//# sourceMappingURL=heroDataConsistency.js.map