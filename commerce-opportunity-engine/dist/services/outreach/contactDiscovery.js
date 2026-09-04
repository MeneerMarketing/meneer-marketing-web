import * as cheerio from "cheerio";
import { CONTACT_PATHS, } from "../../config/outreach.js";
import { classifyEmailType, emailDomainMatchesBrand, emailTypePreferenceRank, isUsableForOutreach, normalizeEmail, } from "./emailClassification.js";
const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const PHONE_RE = /(?:\+31|0)[\d\s()-]{8,16}\d/g;
function isPlausibleEmail(email) {
    const normalized = normalizeEmail(email);
    if (!normalized.includes("@"))
        return false;
    const [local, domainPart] = normalized.split("@");
    if (!local || !domainPart)
        return false;
    if (local.length < 2 || domainPart.length < 4)
        return false;
    if (!domainPart.includes("."))
        return false;
    const tld = domainPart.split(".").pop() ?? "";
    if (!/^[a-z]{2,10}$/.test(tld))
        return false;
    if (["css", "js", "jpg", "jpeg", "png", "gif", "svg", "webp", "woff", "map"].includes(tld)) {
        return false;
    }
    if (normalized.includes("example.com") ||
        normalized.includes("sentry.io") ||
        normalized.includes("wixpress") ||
        normalized.includes("schema.org") ||
        normalized.includes("localhost")) {
        return false;
    }
    return true;
}
const TITLE_HINTS = [
    "founder",
    "eigenaar",
    "owner",
    "ceo",
    "directeur",
    "marketing",
    "e-commerce",
    "ecommerce",
    "webshop",
    "online",
];
async function fetchHtml(url, timeoutMs) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const res = await fetch(url, {
            signal: controller.signal,
            redirect: "follow",
            headers: {
                "User-Agent": "Mozilla/5.0 (compatible; MeneerMarketingBot/1.0; +https://meneermarketing.nl)",
                Accept: "text/html,application/xhtml+xml",
            },
        });
        const html = await res.text();
        return {
            ok: res.ok,
            html: res.ok ? html : "",
            finalUrl: res.url || url,
            status: res.status,
        };
    }
    catch {
        return { ok: false, html: "", finalUrl: url, status: 0 };
    }
    finally {
        clearTimeout(timer);
    }
}
function absoluteUrl(base, path) {
    try {
        return new URL(path, base).toString();
    }
    catch {
        return path;
    }
}
function extractSocial($, host) {
    let linkedin = null;
    let instagram = null;
    $("a[href]").each((_, el) => {
        const href = ($(el).attr("href") ?? "").trim();
        if (!href)
            return;
        if (!linkedin && /linkedin\.com/i.test(href))
            linkedin = href;
        if (!instagram && /instagram\.com/i.test(href))
            instagram = href;
    });
    void host;
    return { linkedin, instagram };
}
function guessNameNearEmail(text, email) {
    const idx = text.toLowerCase().indexOf(email.toLowerCase());
    if (idx < 0)
        return { fullName: null, jobTitle: null };
    const window = text.slice(Math.max(0, idx - 80), idx);
    // Only accept "Name <email>" / "Name - email" patterns, not random nearby words
    const nameMatch = window.match(/([A-ZÁÉÍÓÚÄËÏÖÜÀÂÊÎÔÛ][a-záéíóúäëïöüàâêîôû-]{1,20}(?:\s+[A-ZÁÉÍÓÚÄËÏÖÜÀÂÊÎÔÛ][a-záéíóúäëïöüàâêîôû-]{1,20}){0,2})\s*[-–:]?\s*$/);
    const fullName = nameMatch?.[1]?.trim() ?? null;
    // Reject likely nav/category blobs
    if (fullName &&
        /(brokjes|voer|product|populair|categorie|menu|home|shop|korting)/i.test(fullName)) {
        return { fullName: null, jobTitle: null };
    }
    const after = text.slice(idx, idx + 100);
    const titleMatch = after.match(new RegExp(`(${TITLE_HINTS.join("|")})[^\\n,]{0,40}`, "i"));
    return {
        fullName,
        jobTitle: titleMatch?.[0]?.trim().slice(0, 80) ?? null,
    };
}
function scoreContact(input) {
    let emailConfidence = 40;
    let contactConfidence = 35;
    if (input.domainMatch) {
        emailConfidence += 30;
        contactConfidence += 25;
    }
    else {
        emailConfidence -= 25;
        contactConfidence -= 30;
    }
    emailConfidence += Math.round(emailTypePreferenceRank(input.emailType) * 0.25);
    if (input.emailType === "PRIVACY_LEGAL") {
        emailConfidence = 10;
        contactConfidence = 5;
    }
    if (input.hasName)
        contactConfidence += 15;
    if (input.hasTitle)
        contactConfidence += 12;
    if (input.onContactPage) {
        emailConfidence += 10;
        contactConfidence += 12;
    }
    if (input.sourceType === "mailto") {
        emailConfidence += 8;
        contactConfidence += 8;
    }
    return {
        emailConfidence: clamp(emailConfidence),
        contactConfidence: clamp(contactConfidence),
    };
}
function clamp(n) {
    return Math.max(0, Math.min(100, Math.round(n)));
}
function splitName(fullName) {
    if (!fullName)
        return { firstName: null, lastName: null };
    const parts = fullName.split(/\s+/).filter(Boolean);
    if (parts.length === 1)
        return { firstName: parts[0], lastName: null };
    return {
        firstName: parts[0],
        lastName: parts.slice(1).join(" "),
    };
}
/**
 * Free website contact discovery — public pages only, no login, no guessing.
 */
export async function discoverBrandContacts(input) {
    const timeoutMs = input.timeoutMs ?? 12000;
    const maxPages = input.maxPages ?? 10;
    const domain = input.domain.replace(/^www\./, "").toLowerCase();
    const origins = [`https://${domain}`, `https://www.${domain}`];
    const checked = [];
    const byEmail = new Map();
    let homepageOk = false;
    let socialLinkedin = null;
    let socialInstagram = null;
    for (const origin of origins) {
        const home = await fetchHtml(origin + "/", timeoutMs);
        if (!home.ok)
            continue;
        homepageOk = true;
        const base = home.finalUrl.replace(/\/$/, "") || origin;
        const paths = CONTACT_PATHS.slice(0, maxPages);
        for (const path of paths) {
            const url = path === "/" ? `${base}/` : absoluteUrl(base, path);
            if (checked.includes(url))
                continue;
            const page = path === "/"
                ? home
                : await fetchHtml(url, timeoutMs);
            checked.push(url);
            if (!page.ok || !page.html)
                continue;
            const $ = cheerio.load(page.html);
            const text = $("body").text().replace(/\s+/g, " ");
            const social = extractSocial($, domain);
            socialLinkedin = socialLinkedin ?? social.linkedin;
            socialInstagram = socialInstagram ?? social.instagram;
            const mailtoEmails = new Set();
            $('a[href^="mailto:"]').each((_, el) => {
                const href = ($(el).attr("href") ?? "").replace(/^mailto:/i, "").split("?")[0];
                if (href)
                    mailtoEmails.add(normalizeEmail(href));
            });
            const found = new Set([
                ...mailtoEmails,
                ...(page.html.match(EMAIL_RE) ?? []).map(normalizeEmail),
            ]);
            const phones = text.match(PHONE_RE)?.map((p) => p.replace(/\s+/g, " ").trim()) ?? [];
            const onContactPage = /contact|over-ons|about|team|klantenservice/i.test(path);
            for (const email of found) {
                if (!isPlausibleEmail(email))
                    continue;
                const emailType = classifyEmailType(email);
                const domainMatch = emailDomainMatchesBrand(email, domain);
                const near = guessNameNearEmail(text, email);
                const names = splitName(near.fullName);
                const scores = scoreContact({
                    emailType,
                    domainMatch,
                    hasName: Boolean(near.fullName),
                    hasTitle: Boolean(near.jobTitle),
                    sourceType: mailtoEmails.has(email) ? "mailto" : "page_text",
                    onContactPage,
                });
                const existing = byEmail.get(email);
                const candidate = {
                    fullName: near.fullName,
                    firstName: names.firstName,
                    lastName: names.lastName,
                    jobTitle: near.jobTitle,
                    email,
                    emailNormalized: email,
                    emailType,
                    emailConfidence: scores.emailConfidence,
                    contactConfidence: scores.contactConfidence,
                    phone: phones[0] ?? null,
                    linkedinUrl: socialLinkedin,
                    instagramUrl: socialInstagram,
                    sourceUrl: page.finalUrl || url,
                    sourceType: mailtoEmails.has(email) ? "mailto" : onContactPage ? "contact_page" : "website_page",
                    sourceEvidence: [
                        `source_url=${page.finalUrl || url}`,
                        `email_type=${emailType}`,
                        `domain_match=${domainMatch}`,
                        near.fullName ? `name_near_email=${near.fullName}` : "no_name_context",
                    ],
                    isUsableForOutreach: isUsableForOutreach(emailType) && domainMatch,
                };
                if (!existing ||
                    candidate.contactConfidence > existing.contactConfidence) {
                    byEmail.set(email, candidate);
                }
            }
        }
        break; // one working origin is enough
    }
    const contacts = [...byEmail.values()].sort((a, b) => b.contactConfidence - a.contactConfidence);
    const preferred = selectPreferredContact(contacts);
    let contactStatus = "NOT_FOUND";
    if (preferred.contact) {
        contactStatus = "FOUND";
    }
    else if (contacts.some((c) => c.emailType === "SUPPORT")) {
        contactStatus = "SUPPORT_ONLY";
    }
    else if (!homepageOk) {
        contactStatus = "NOT_FOUND";
    }
    return {
        contacts,
        preferred: preferred.contact,
        preferredReason: preferred.reason,
        contactStatus,
        pagesChecked: checked.length,
        evidence: {
            domain,
            homepageOk,
            pagesChecked: checked,
            emailCount: contacts.length,
        },
    };
}
export function selectPreferredContact(contacts) {
    const usable = contacts.filter((c) => c.isUsableForOutreach && c.emailType !== "PRIVACY_LEGAL");
    if (!usable.length) {
        return { contact: null, reason: null };
    }
    const ranked = [...usable].sort((a, b) => {
        const titleBoost = (c) => c.jobTitle && TITLE_HINTS.some((h) => c.jobTitle.toLowerCase().includes(h))
            ? 20
            : 0;
        const scoreA = emailTypePreferenceRank(a.emailType) +
            a.contactConfidence +
            titleBoost(a) +
            (a.firstName ? 10 : 0);
        const scoreB = emailTypePreferenceRank(b.emailType) +
            b.contactConfidence +
            titleBoost(b) +
            (b.firstName ? 10 : 0);
        return scoreB - scoreA;
    });
    const best = ranked[0];
    if (best.emailType === "SUPPORT" && ranked.length === 1) {
        return {
            contact: best,
            reason: "Alleen support-inbox gevonden; geen zakelijke of persoonlijke inbox",
        };
    }
    if (best.emailType === "PERSONAL_BUSINESS") {
        return {
            contact: best,
            reason: best.jobTitle
                ? `Persoonlijk zakelijk contact met functie (${best.jobTitle})`
                : "Persoonlijk zakelijk e-mailadres op officiële site",
        };
    }
    if (best.emailType === "GENERAL_BUSINESS" || best.emailType === "INFO") {
        return {
            contact: best,
            reason: "Algemene zakelijke inbox op officiële website",
        };
    }
    if (best.emailType === "SALES") {
        return {
            contact: best,
            reason: "Sales/contact inbox op officiële website",
        };
    }
    return {
        contact: best,
        reason: "Beste beschikbare publieke contact op eigen domein",
    };
}
//# sourceMappingURL=contactDiscovery.js.map