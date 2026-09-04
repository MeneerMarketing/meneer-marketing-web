/**
 * Milestone 9.1 / 9.1.1 — targeted public crawl for ONE pilot product (+ homepage).
 */
import * as cheerio from "cheerio";
import { crawlWebsite, closeCrawlerBrowser } from "../crawler/websiteCrawler.js";
import { extractPageSignals } from "../crawler/pageExtractor.js";
import { normaliseBenefitsFromSource, parseSocialProof, parseTrustItems, } from "./contentNormalisation.js";
function absUrl(base, maybe) {
    if (!maybe)
        return null;
    try {
        const u = new URL(maybe, base).toString();
        return u.split("?")[0] ?? null;
    }
    catch {
        return null;
    }
}
function uniqUrls(urls) {
    const seen = new Set();
    const out = [];
    for (const u of urls) {
        if (!u)
            continue;
        const key = u.replace(/_\d+x\./, ".").replace(/^http:/, "https:");
        if (seen.has(key))
            continue;
        seen.add(key);
        out.push(key.startsWith("http:") ? key.replace("http:", "https:") : key);
    }
    return out;
}
function classifyImage(url, alt, index = 0) {
    const u = url.toLowerCase();
    const a = (alt ?? "").toLowerCase();
    const blob = `${u} ${a}`;
    if (/logo|brand/.test(blob))
        return "logo";
    if (/vergelijk|tabel|table|chart|matrix|spec_/.test(blob))
        return "comparison";
    if (/app|phone|screen|smartphone|iphone|android/.test(blob))
        return "app_screen";
    if (/full_hd_feeder|feeder\.png/.test(u))
        return "packshot";
    if (/lifestyle|life-style|scene|outdoor|home/.test(blob))
        return "lifestyle";
    if (/use|away|stress|voedertijd|kat|hond|cat|dog/.test(a))
        return "use_case";
    if (/detail|close|zoom/.test(blob))
        return "detail";
    // Shopify PDP gallery without strong alt: spread editorial roles by order
    if (/cdn\.shopify\.com\/.*\/files\//.test(u)) {
        const roles = [
            "packshot",
            "feature_graphic",
            "use_case",
            "lifestyle",
            "detail",
            "feature_graphic",
            "use_case",
            "detail",
        ];
        return roles[index % roles.length];
    }
    return "other";
}
/** Real shop navigation labels from the prospect header (no invented categories). */
function extractNavLabels($) {
    const out = [];
    const seen = new Set();
    const push = (raw) => {
        const label = raw.replace(/\s+/g, " ").trim();
        if (label.length < 3 || label.length > 28)
            return;
        if (/inloggen|account|winkelwagen|cart|zoeken|search|menu|home|skip|overslaan|volg ons/i.test(label)) {
            return;
        }
        if (/^(nl|en|de|fr|€|\d+)$/i.test(label))
            return;
        const key = label.toLowerCase();
        if (seen.has(key))
            return;
        seen.add(key);
        out.push(label);
    };
    const selectors = [
        "header nav a",
        ".header__inline-menu a",
        ".header__menu-item",
        "nav[role='navigation'] a",
        ".site-nav a",
        "#main-menu a",
    ];
    for (const sel of selectors) {
        $(sel).each((_, el) => push($(el).text()));
        if (out.length >= 6)
            break;
    }
    return out.slice(0, 6);
}
function extractColorsFromCss(html) {
    const colors = new Set();
    const hex = html.match(/#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/g) ?? [];
    for (const h of hex.slice(0, 120))
        colors.add(h.toLowerCase());
    return [...colors].slice(0, 40);
}
function extractOrangeCandidates(colors) {
    const out = [];
    for (const hex of colors) {
        if (!/^#([0-9a-f]{6})$/i.test(hex))
            continue;
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        // warm orange / amber family (Tensfact)
        if (r > 180 && g > 60 && g < 160 && b < 100 && r > g && r > b) {
            out.push(hex.toLowerCase());
        }
    }
    return [...new Set(out)].slice(0, 8);
}
function extractFonts(html) {
    const fonts = new Set();
    const family = html.match(/font-family:\s*([^;}{]+)/gi) ?? [];
    for (const f of family.slice(0, 30)) {
        const cleaned = f
            .replace(/font-family:\s*/i, "")
            .split(",")[0]
            ?.replace(/['"]/g, "")
            .trim();
        if (cleaned && cleaned.length > 1 && cleaned.length < 40)
            fonts.add(cleaned);
    }
    return [...fonts].slice(0, 8);
}
function extractLogo($, base) {
    const candidates = [
        $('img[alt*="logo" i]').attr("src"),
        $('img[class*="logo" i]').attr("src"),
        $("header img").first().attr("src"),
        $('.header__heading-logo, .header-logo img').attr("src"),
    ];
    for (const c of candidates) {
        const abs = absUrl(base, c);
        if (abs && !/favicon|icon-/.test(abs))
            return abs;
    }
    return absUrl(base, candidates.find(Boolean) ?? null);
}
function extractFaq($) {
    const faqs = [];
    $("details").each((_, el) => {
        const q = $(el).find("summary").first().text().replace(/\s+/g, " ").trim();
        const a = $(el)
            .clone()
            .children("summary")
            .remove()
            .end()
            .text()
            .replace(/\s+/g, " ")
            .trim();
        if (q.length > 8 && a.length > 12)
            faqs.push({ question: q, answer: a.slice(0, 600) });
    });
    $('script[type="application/ld+json"]').each((_, el) => {
        try {
            const raw = $(el).html();
            if (!raw)
                return;
            const data = JSON.parse(raw);
            const nodes = Array.isArray(data) ? data : [data];
            for (const node of nodes) {
                if (!String(node["@type"] ?? "").toLowerCase().includes("faq"))
                    continue;
                const ents = node.mainEntity;
                if (!Array.isArray(ents))
                    continue;
                for (const e of ents) {
                    const q = typeof e.name === "string" ? e.name : null;
                    const ans = e.acceptedAnswer;
                    const a = typeof ans?.text === "string" ? ans.text : null;
                    if (q && a)
                        faqs.push({ question: q, answer: a.slice(0, 600) });
                }
            }
        }
        catch {
            /* ignore */
        }
    });
    return faqs.slice(0, 8);
}
function walkJsonLd(node, visit, seen = new WeakSet()) {
    if (!node || typeof node !== "object")
        return;
    if (seen.has(node))
        return;
    seen.add(node);
    if (Array.isArray(node)) {
        for (const n of node)
            walkJsonLd(n, visit, seen);
        return;
    }
    const obj = node;
    visit(obj);
    for (const v of Object.values(obj)) {
        if (v && typeof v === "object")
            walkJsonLd(v, visit, seen);
    }
}
function extractAggregateRating($) {
    let rating = null;
    let reviewCount = null;
    $('script[type="application/ld+json"]').each((_, el) => {
        try {
            const raw = $(el).html();
            if (!raw)
                return;
            const data = JSON.parse(raw);
            walkJsonLd(data, (obj) => {
                const agg = obj.aggregateRating;
                if (!agg || rating != null)
                    return;
                const v = agg.ratingValue;
                const c = agg.reviewCount ?? agg.ratingCount;
                if (typeof v === "number")
                    rating = v;
                else if (typeof v === "string")
                    rating = Number(v.replace(",", "."));
                if (typeof c === "number")
                    reviewCount = c;
                else if (typeof c === "string")
                    reviewCount = Number(c.replace(/\D/g, ""));
            });
        }
        catch {
            /* ignore */
        }
    });
    if (rating == null) {
        const tp = $("[data-rating], .trustpilot-widget, [class*='trustpilot']").attr("data-rating") ||
            $("[itemprop='ratingValue']").attr("content") ||
            $("[itemprop='ratingValue']").text();
        if (tp) {
            const n = Number(String(tp).replace(",", ".").trim());
            if (Number.isFinite(n) && n >= 1 && n <= 5)
                rating = n;
        }
    }
    if (reviewCount == null) {
        const countText = $("[itemprop='reviewCount']").attr("content") ||
            $("[itemprop='reviewCount']").text() ||
            "";
        const m = String(countText).match(/(\d[\d.\s]*)/);
        if (m) {
            const n = Number(m[1].replace(/[.\s]/g, ""));
            if (Number.isFinite(n) && n > 0)
                reviewCount = n;
        }
    }
    return {
        rating: rating != null && Number.isFinite(rating) ? rating : null,
        reviewCount: reviewCount != null && Number.isFinite(reviewCount) ? reviewCount : null,
    };
}
function extractReviewsFromJsonLd($, sourceUrl) {
    const reviews = [];
    $('script[type="application/ld+json"]').each((_, el) => {
        try {
            const raw = $(el).html();
            if (!raw)
                return;
            const data = JSON.parse(raw);
            walkJsonLd(data, (obj) => {
                const rev = obj.review;
                if (!Array.isArray(rev))
                    return;
                for (const r of rev.slice(0, 8)) {
                    const text = typeof r.reviewBody === "string"
                        ? r.reviewBody
                        : typeof r.description === "string"
                            ? r.description
                            : null;
                    if (!text || text.length < 12)
                        continue;
                    if (reviews.some((x) => x.text === text.slice(0, 500)))
                        continue;
                    const authorNode = r.author;
                    let author = null;
                    if (typeof authorNode === "string")
                        author = authorNode;
                    else if (authorNode && typeof authorNode === "object") {
                        const n = authorNode.name;
                        if (typeof n === "string")
                            author = n;
                    }
                    let rating = null;
                    const rr = r.reviewRating;
                    if (rr) {
                        const v = rr.ratingValue;
                        if (typeof v === "number")
                            rating = v;
                        else if (typeof v === "string")
                            rating = Number(v);
                    }
                    reviews.push({
                        author,
                        rating: rating != null && Number.isFinite(rating) ? rating : null,
                        text: text.slice(0, 500),
                        source_url: sourceUrl,
                    });
                }
            });
        }
        catch {
            /* ignore */
        }
    });
    return reviews;
}
function extractImages($, base) {
    const out = [];
    const push = (src, alt) => {
        const url = absUrl(base, src);
        if (!url)
            return;
        if (!/\.(jpe?g|png|webp|gif)/i.test(url) && !url.includes("cdn.shopify"))
            return;
        if (/pixel|spacer|1x1|sprite|icon-|favicon/.test(url))
            return;
        out.push({ url, alt, kind: classifyImage(url, alt), source_url: base });
    };
    $('meta[property="og:image"]').each((_, el) => push($(el).attr("content"), "og:image"));
    $("img").each((_, el) => {
        const src = $(el).attr("src") ||
            $(el).attr("data-src") ||
            $(el).attr("data-original") ||
            null;
        push(src, ($(el).attr("alt") || "").trim() || null);
    });
    $("script").each((_, el) => {
        const html = $(el).html() || "";
        if (!html.includes("cdn.shopify.com") || html.length > 500_000)
            return;
        const matches = html.match(/https?:\/\/cdn\.shopify\.com\/[^"'\s]+\.(?:jpe?g|png|webp)/gi);
        if (!matches)
            return;
        for (const m of matches.slice(0, 24))
            push(m, null);
    });
    const deduped = uniqUrls(out.map((i) => i.url)).map((url) => out.find((i) => i.url.replace(/^http:/, "https:") === url || i.url === url));
    return deduped
        .map((img) => ({
        ...img,
        url: img.url.replace(/^http:/, "https:"),
    }))
        .filter((i) => i.kind !== "logo")
        .slice(0, 8)
        .map((img, index) => ({
        ...img,
        kind: classifyImage(img.url, img.alt, index),
    }));
}
function parseCompareAt($) {
    const text = $("s, .compare-at, .price--compare, [class*='compare']").first().text() || "";
    const m = text.replace(/\s/g, "").match(/(\d+[.,]\d{2})/);
    if (!m)
        return null;
    const n = Number(m[1].replace(",", "."));
    return Number.isFinite(n) ? n : null;
}
function firstTrustLabel(items, match) {
    return items.find((i) => match.test(i.label))?.label ?? null;
}
export async function crawlPilotAssets(input) {
    const pagesCrawled = [];
    try {
        const productCrawl = await crawlWebsite(input.productUrl, 25000);
        pagesCrawled.push(productCrawl.finalUrl || input.productUrl);
        if (!productCrawl.html || productCrawl.html.length < 200) {
            throw new Error(`Product crawl failed: ${productCrawl.status} ${productCrawl.errorMessage ?? ""}`);
        }
        let homeHtml = "";
        let homeFinal = input.homepageUrl;
        try {
            const homeCrawl = await crawlWebsite(input.homepageUrl, 20000);
            homeHtml = homeCrawl.html;
            homeFinal = homeCrawl.finalUrl || input.homepageUrl;
            pagesCrawled.push(homeFinal);
        }
        catch {
            /* optional */
        }
        const html = productCrawl.html;
        const $ = cheerio.load(html);
        const signals = extractPageSignals(html, pagesCrawled[0]);
        const jsonProduct = signals.jsonLdProducts[0] ?? null;
        const rawBody = $("body").text();
        const h1 = $("h1").first().text().replace(/\s+/g, " ").trim();
        const ogTitle = $("meta[property='og:title']").attr("content")?.trim() || null;
        const title = jsonProduct?.name ?? (h1 || ogTitle);
        const metaDescription = $("meta[name='description']").attr("content")?.trim() || null;
        const domDesc = $(".product__description, .product-single__description, [class*='product-description'], .rte")
            .first()
            .text()
            .replace(/\s+/g, " ")
            .trim();
        const description = jsonProduct?.description ??
            (domDesc.length > 40 ? domDesc : null) ??
            metaDescription;
        const images = extractImages($, pagesCrawled[0]);
        let logoUrl = extractLogo($, pagesCrawled[0]);
        let navLabels = extractNavLabels($);
        if (homeHtml) {
            const $h = cheerio.load(homeHtml);
            logoUrl = extractLogo($h, homeFinal) || logoUrl;
            const homeNav = extractNavLabels($h);
            if (homeNav.length > navLabels.length)
                navLabels = homeNav;
        }
        const faqs = extractFaq($);
        const reviews = extractReviewsFromJsonLd($, pagesCrawled[0]);
        const agg = extractAggregateRating($);
        const trustItems = parseTrustItems(`${rawBody}\n${homeHtml ? cheerio.load(homeHtml)("body").text() : ""}`);
        const social = parseSocialProof(rawBody);
        const benefits = normaliseBenefitsFromSource({
            description,
            faqs,
            metaDescription,
        });
        const colors = [
            ...extractColorsFromCss(html),
            ...(homeHtml ? extractColorsFromCss(homeHtml) : []),
        ];
        const brandAccentCandidates = extractOrangeCandidates(colors);
        // Tensfact warm brand fallbacks often present as peach/cream; seed known orange if warm family seen
        if (brandAccentCandidates.length === 0 && colors.some((c) => /#ffe5da|#ff/i.test(c))) {
            brandAccentCandidates.push("#e85d04");
        }
        const paymentSignals = [...signals.paymentSignals];
        if (/klarna/i.test(rawBody) && !paymentSignals.includes("klarna")) {
            paymentSignals.push("klarna");
        }
        if (/ideal/i.test(rawBody) && !paymentSignals.includes("ideal")) {
            paymentSignals.push("ideal");
        }
        return {
            productUrl: pagesCrawled[0],
            homepageUrl: homeFinal,
            pagesCrawled,
            title,
            description,
            metaDescription,
            price: jsonProduct?.price ?? null,
            compareAtPrice: parseCompareAt($),
            currency: jsonProduct?.currency ?? "EUR",
            brandName: jsonProduct?.brand ?? "Tensfact",
            rating: jsonProduct?.rating ?? agg.rating,
            reviewCount: jsonProduct?.reviewCount ?? agg.reviewCount,
            availability: jsonProduct?.availability ?? null,
            images,
            logoUrl,
            brandColors: colors.filter((c) => /^#/.test(c)).slice(0, 12),
            brandAccentCandidates,
            navLabels,
            benefits,
            features: benefits.map((b) => ({ title: b.title, body: b.body })),
            specs: [],
            howSteps: [],
            faqs,
            reviews,
            trustItems,
            socialProofLabel: social.customersLabel,
            shippingText: firstTrustLabel(trustItems, /verzending/i),
            returnsText: firstTrustLabel(trustItems, /retour|bedenktijd/i),
            guaranteeText: firstTrustLabel(trustItems, /garantie/i),
            paymentSignals,
            cssColorCandidates: colors,
            fontCandidates: extractFonts(html + homeHtml),
            rawBodyText: rawBody.slice(0, 20000),
            rawDescriptionHtmlLength: description?.length ?? 0,
        };
    }
    finally {
        await closeCrawlerBrowser();
    }
}
//# sourceMappingURL=pilotAssetCrawl.js.map