/**
 * Milestone 5.4.1 — deterministic page health gate.
 * Prevents Cloudflare/error/challenge pages from becoming fake CRO gaps.
 */
const CLOUDFLARE_SIGNATURES = [
    /error\s*520/i,
    /error\s*521/i,
    /error\s*522/i,
    /error\s*523/i,
    /error\s*524/i,
    /attention required/i,
    /checking your browser/i,
    /just a moment/i,
    /cf-error-details/i,
    /challenge-platform/i,
    /cdn-cgi\/challenge/i,
    /cloudflare/i,
    /ray id/i,
    /cf-browser-verification/i,
    /enable javascript and cookies to continue/i,
];
const CAPTCHA_SIGNATURES = [
    /captcha/i,
    /hcaptcha/i,
    /recaptcha/i,
    /verify you are human/i,
    /are you a robot/i,
    /bot detection/i,
    /access denied/i,
    /request blocked/i,
    /unusual traffic/i,
];
const MAINTENANCE_SIGNATURES = [
    /under maintenance/i,
    /in onderhoud/i,
    /temporarily unavailable/i,
    /tijdelijk niet beschikbaar/i,
    /service unavailable/i,
    /be right back/i,
    /scheduled maintenance/i,
];
const GENERIC_ERROR_SIGNATURES = [
    /something went wrong/i,
    /er is iets misgegaan/i,
    /page not found/i,
    /pagina niet gevonden/i,
    /404\s*not\s*found/i,
    /403\s*forbidden/i,
    /500\s*internal\s*server/i,
    /bad gateway/i,
    /gateway timeout/i,
];
const CONSENT_WALL_HEAVY = [
    /cookiebot/i,
    /onetrust/i,
    /cookie consent/i,
];
export function assessPageHealth(input) {
    const html = input.html ?? "";
    const text = stripTags(html);
    const textLen = text.replace(/\s+/g, " ").trim().length;
    const title = extractTitle(html);
    const domCount = countDomHints(html);
    const signatures = [];
    const cfHits = matchSignatures(html, CLOUDFLARE_SIGNATURES);
    const captchaHits = matchSignatures(html, CAPTCHA_SIGNATURES);
    const maintHits = matchSignatures(html, MAINTENANCE_SIGNATURES);
    const errHits = matchSignatures(html, GENERIC_ERROR_SIGNATURES);
    signatures.push(...cfHits, ...captchaHits, ...maintHits, ...errHits);
    const statusCode = input.httpStatus;
    const hardHttpError = statusCode != null &&
        (statusCode === 403 ||
            statusCode === 404 ||
            statusCode === 429 ||
            statusCode >= 500);
    if (hardHttpError) {
        signatures.push(`http_${statusCode}`);
    }
    const productHints = /itemprop=["']price["']|product-form|add to cart|in winkelwagen|product__title|og:type["']\s*content=["']product/i.test(html);
    const contentHints = productHints ||
        /<h1[\s>]/i.test(html) ||
        /product/i.test(title) ||
        textLen > 800;
    const blank = textLen < 80 &&
        domCount < 15 &&
        !input.hasMobileScreenshot &&
        !input.hasDesktopScreenshot;
    const captureFailed = input.captureErrors.length > 0 &&
        !input.hasMobileScreenshot &&
        !input.hasDesktopScreenshot;
    // --- Classify ---
    let status = "UNKNOWN";
    let confidence = 50;
    let reason = "Onvoldoende signalen";
    let failureAuditStatus = null;
    if (cfHits.some((s) => /error\s*52[0-4]|cf-error|ray id/i.test(s)) || /error\s*520/i.test(html)) {
        status = "ERROR";
        confidence = 98;
        reason = "Cloudflare/server error page detected";
        failureAuditStatus = "FAILED_TECHNICAL";
    }
    else if (cfHits.some((s) => /checking your browser|just a moment|challenge-platform|cf-browser/i.test(s))) {
        status = "CHALLENGE";
        confidence = 95;
        reason = "Cloudflare/bot challenge page detected";
        failureAuditStatus = "BLOCKED";
    }
    else if (captchaHits.length >= 1 && textLen < 1200 && !productHints) {
        status = "CHALLENGE";
        confidence = 90;
        reason = "CAPTCHA / bot protection signature";
        failureAuditStatus = "BLOCKED";
    }
    else if (hardHttpError || errHits.length >= 2) {
        status = "ERROR";
        confidence = hardHttpError ? 92 : 85;
        reason = hardHttpError
            ? `HTTP ${statusCode} error response`
            : "Generic error page signatures";
        failureAuditStatus = "FAILED_TECHNICAL";
    }
    else if (maintHits.length >= 1 && textLen < 1500) {
        status = "BLOCKED";
        confidence = 88;
        reason = "Maintenance / unavailable page";
        failureAuditStatus = "BLOCKED";
    }
    else if (blank || captureFailed || textLen < 40) {
        status = "EMPTY";
        confidence = 90;
        reason = captureFailed
            ? "Screenshot/render capture failed; empty content"
            : "Blank or near-empty page body";
        failureAuditStatus = "FAILED_TECHNICAL";
    }
    else if (textLen < 250 ||
        (domCount < 40 && !productHints) ||
        (CONSENT_WALL_HEAVY.some((r) => r.test(html)) && textLen < 400 && !productHints)) {
        status = "PARTIAL";
        confidence = 65;
        reason = "Partial extraction / heavy overlay / thin content";
        failureAuditStatus = null;
    }
    else if (contentHints && textLen >= 250) {
        status = "HEALTHY";
        confidence = productHints ? 92 : 80;
        reason = productHints
            ? "Product/content markers present with sufficient body text"
            : "Sufficient rendered content without error signatures";
        failureAuditStatus = null;
    }
    else {
        status = "PARTIAL";
        confidence = 55;
        reason = "Ambiguous page health; partial content only";
        failureAuditStatus = null;
    }
    // Screenshot quality
    let screenshotQuality = "INVALID";
    if (status === "ERROR" ||
        status === "CHALLENGE" ||
        status === "BLOCKED" ||
        status === "EMPTY") {
        screenshotQuality = "INVALID";
    }
    else if (!input.hasMobileScreenshot && !input.hasDesktopScreenshot) {
        screenshotQuality = "INVALID";
        if (status === "HEALTHY") {
            status = "PARTIAL";
            reason = "Content ok but screenshots missing";
            confidence = Math.min(confidence, 50);
        }
    }
    else if (status === "PARTIAL") {
        screenshotQuality = "PARTIAL";
    }
    else if (status === "HEALTHY") {
        screenshotQuality =
            input.hasMobileScreenshot && input.hasDesktopScreenshot ? "VALID" : "PARTIAL";
    }
    else {
        screenshotQuality = "INVALID";
    }
    const allowClaudeAudit = (status === "HEALTHY" || (status === "PARTIAL" && confidence >= 60 && contentHints)) &&
        screenshotQuality !== "INVALID";
    if (!allowClaudeAudit && failureAuditStatus == null) {
        failureAuditStatus = status === "CHALLENGE" || status === "BLOCKED" ? "BLOCKED" : "NEEDS_RETRY";
    }
    return {
        status,
        confidence: Math.round(confidence),
        reason,
        evidence: {
            httpStatus: statusCode,
            finalUrl: input.finalUrl,
            title,
            bodyTextLength: textLen,
            domElementHints: domCount,
            productContentPresent: productHints,
            hasMobileScreenshot: input.hasMobileScreenshot,
            hasDesktopScreenshot: input.hasDesktopScreenshot,
            captureErrors: input.captureErrors.slice(0, 5),
            signatures,
            lowerSnippet: text.slice(0, 240),
        },
        screenshotQuality,
        allowClaudeAudit,
        failureAuditStatus,
        signatures,
    };
}
export function auditConfidenceFromHealth(health, baseConfidence) {
    if (health.status === "ERROR" ||
        health.status === "CHALLENGE" ||
        health.status === "BLOCKED" ||
        health.status === "EMPTY") {
        return 0;
    }
    if (health.status === "PARTIAL") {
        return Math.round(Math.min(baseConfidence, 45) * (health.confidence / 100));
    }
    if (health.screenshotQuality === "PARTIAL") {
        return Math.round(baseConfidence * 0.75);
    }
    return Math.round(baseConfidence);
}
function matchSignatures(html, patterns) {
    const hits = [];
    for (const pattern of patterns) {
        const m = html.match(pattern);
        if (m?.[0])
            hits.push(m[0].slice(0, 80));
    }
    return hits;
}
function stripTags(html) {
    return html
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}
function extractTitle(html) {
    const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    return (m?.[1] ?? "").replace(/\s+/g, " ").trim().slice(0, 200);
}
function countDomHints(html) {
    const tags = html.match(/<[a-zA-Z][^>]*>/g);
    return tags?.length ?? 0;
}
/** Map failure status to opportunity verdict when no CRO score is set. */
export function verdictForFailedAudit(status) {
    if (status === "NEEDS_RETRY" || status === "FAILED_TECHNICAL" || status === "BLOCKED") {
        return "NEEDS_RETRY";
    }
    return "NOT_AUDITED";
}
//# sourceMappingURL=pageHealth.js.map