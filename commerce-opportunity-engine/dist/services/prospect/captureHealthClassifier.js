/**
 * Milestone 9.9.5 — screenshot capture health before visual scoring.
 */
import { access, readFile } from "node:fs/promises";
const BOT_TEXT_PATTERNS = [
    /\bbot\.limit_reached\b/i,
    /\bcloudflare\b/i,
    /\bchecking your browser\b/i,
    /\bverify you are human\b/i,
    /\baccess denied\b/i,
    /\bcaptcha\b/i,
    /\brobot\b/i,
    /\bsecurity check\b/i,
    /\bbrowser verification\b/i,
    /\bplease enable javascript\b/i,
    /\b403 forbidden\b/i,
    /\b404\b/i,
    /\bpage not found\b/i,
    /\bservice unavailable\b/i,
    /\bjson error\b/i,
    /\berror state\b/i,
];
const ERROR_PAGE_PATTERNS = [
    /\b404\b/i,
    /\bpage not found\b/i,
    /\bnot found\b/i,
    /\bservice unavailable\b/i,
    /\binternal server error\b/i,
    /\b500\b/i,
];
function pngDimensions(buffer) {
    if (buffer.length < 24 || buffer[0] !== 0x89)
        return null;
    return {
        width: buffer.readUInt32BE(16),
        height: buffer.readUInt32BE(20),
    };
}
function scanTextForPatterns(text, patterns) {
    const hits = [];
    for (const pattern of patterns) {
        if (pattern.test(text))
            hits.push(pattern.source.slice(0, 32));
    }
    return hits;
}
export function classifyCaptureHealthFromText(input) {
    const combined = [
        input.visionReasoning ?? "",
        input.manualLook ?? "",
        input.htmlSnippet?.slice(0, 4000) ?? "",
    ].join("\n");
    const evidence = [];
    const botHits = scanTextForPatterns(combined, BOT_TEXT_PATTERNS);
    const errorHits = scanTextForPatterns(combined, ERROR_PAGE_PATTERNS);
    if (botHits.length > 0) {
        evidence.push(...botHits.map((h) => `bot_text_${h}`));
        const accessDenied = /access denied|403/i.test(combined);
        return {
            health: accessDenied ? "ACCESS_DENIED" : "BOT_CHALLENGE",
            confidence: "HIGH",
            visionScoreAllowed: false,
            evidence,
        };
    }
    if (errorHits.length > 0) {
        evidence.push(...errorHits.map((h) => `error_text_${h}`));
        return {
            health: "ERROR_PAGE",
            confidence: "HIGH",
            visionScoreAllowed: false,
            evidence,
        };
    }
    return {
        health: "UNKNOWN",
        confidence: "LOW",
        visionScoreAllowed: false,
        evidence: ["no_text_signals"],
    };
}
export async function classifyCaptureHealthFromScreenshot(input) {
    const textScan = classifyCaptureHealthFromText({
        visionReasoning: input.visionReasoning,
        manualLook: input.manualLook,
        htmlSnippet: input.htmlSnippet,
    });
    if (!textScan.visionScoreAllowed && textScan.confidence === "HIGH") {
        return {
            health: textScan.health,
            confidence: textScan.confidence,
            visionScoreAllowed: false,
            visualScoreSource: "INVALID_CAPTURE",
            evidence: textScan.evidence,
        };
    }
    const path = input.screenshotPath;
    if (!path) {
        return {
            health: "EMPTY",
            confidence: "HIGH",
            visionScoreAllowed: false,
            visualScoreSource: "MISSING",
            evidence: ["no_screenshot_path"],
        };
    }
    try {
        await access(path);
        const buffer = await readFile(path);
        const size = buffer.length;
        const dims = pngDimensions(buffer);
        if (size < 4_000) {
            return {
                health: "EMPTY",
                confidence: "HIGH",
                visionScoreAllowed: false,
                visualScoreSource: "INVALID_CAPTURE",
                evidence: ["tiny_screenshot_file"],
            };
        }
        if (dims && (dims.width < 200 || dims.height < 200)) {
            return {
                health: "PARTIAL_CONTENT",
                confidence: "MEDIUM",
                visionScoreAllowed: false,
                visualScoreSource: "INVALID_CAPTURE",
                evidence: ["undersized_viewport"],
            };
        }
        if (size < 12_000) {
            if (!textScan.visionScoreAllowed && textScan.health !== "UNKNOWN") {
                return {
                    health: textScan.health,
                    confidence: "MEDIUM",
                    visionScoreAllowed: false,
                    visualScoreSource: "INVALID_CAPTURE",
                    evidence: [...textScan.evidence, "small_screenshot_file"],
                };
            }
            return {
                health: "PARTIAL_CONTENT",
                confidence: "MEDIUM",
                visionScoreAllowed: true,
                visualScoreSource: input.liveCapture ? "LIVE_VALID_CAPTURE" : "CACHED_VALID_CAPTURE",
                evidence: ["small_but_usable_screenshot"],
            };
        }
        if (!textScan.visionScoreAllowed && textScan.health !== "UNKNOWN") {
            return {
                health: textScan.health,
                confidence: textScan.confidence,
                visionScoreAllowed: false,
                visualScoreSource: "INVALID_CAPTURE",
                evidence: textScan.evidence,
            };
        }
        return {
            health: "VALID_CONTENT",
            confidence: "HIGH",
            visionScoreAllowed: true,
            visualScoreSource: input.liveCapture ? "LIVE_VALID_CAPTURE" : "CACHED_VALID_CAPTURE",
            evidence: ["valid_screenshot_file"],
        };
    }
    catch {
        return {
            health: "EMPTY",
            confidence: "HIGH",
            visionScoreAllowed: false,
            visualScoreSource: "MISSING",
            evidence: ["screenshot_unreadable"],
        };
    }
}
export function nullVisualScoresWhenCaptureInvalid(input) {
    if (input.visionScoreAllowed) {
        return {
            currentVisualQualityScore: input.currentVisualQualityScore,
            visualGap: input.visualGap,
            purchaseGap: input.purchaseGap,
            mobileGap: input.mobileGap,
            visuallyUnderdesigned: input.currentVisualQualityScore != null
                ? input.currentVisualQualityScore < 55
                : null,
        };
    }
    return {
        currentVisualQualityScore: null,
        visualGap: null,
        purchaseGap: input.purchaseGap,
        mobileGap: input.mobileGap,
        visuallyUnderdesigned: null,
    };
}
//# sourceMappingURL=captureHealthClassifier.js.map