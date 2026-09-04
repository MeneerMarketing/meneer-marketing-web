/**
 * Milestone 9.1.1 — content normalisation.
 * Source facts → short display copy. No new claims. No raw ellipsis pills.
 */
export function compactProductTitle(sourceTitle) {
    const t = sourceTitle.replace(/\s+/g, " ").trim();
    // Tensfact / similar long SEO titles
    const m = t.match(/^(.+?)\s+met\s+(HD\s*camera)\s+en\s+(app)\s+voor\s+(\d+\s+katten)/i);
    if (m) {
        return {
            displayTitle: `${m[1].trim()} met ${m[2]}`,
            subheadline: `${m[3]} · voor ${m[4]}`.replace(/^./, (c) => c.toUpperCase()),
        };
    }
    if (t.length <= 48)
        return { displayTitle: t, subheadline: null };
    const cut = t.split(/\s+met\s+/i);
    if (cut.length >= 2 && cut[0].length >= 12) {
        return {
            displayTitle: cut[0].trim(),
            subheadline: `met ${cut.slice(1).join(" met ")}`.slice(0, 80),
        };
    }
    return { displayTitle: t.slice(0, 52), subheadline: null };
}
/**
 * Human editorial one-liner, composed only from facts that were verified
 * in the source (no new claim, no adjectives that add promise).
 */
export function buildEditorialSubline(benefits, fallback) {
    const has = (re) => benefits.some((b) => re.test(b.title));
    const schedule = has(/schema/i);
    const camera = has(/camera/i);
    const app = has(/app/i);
    if (schedule && camera && app) {
        return "Automatisch voeren, meekijken en bedienen vanuit de app.";
    }
    if (schedule && camera)
        return "Automatisch voeren en meekijken vanaf je telefoon.";
    if (schedule && app)
        return "Automatisch voeren op de tijden die jij instelt.";
    if (camera && app)
        return "Meekijken en bedienen vanuit de app.";
    return fallback;
}
/**
 * Story body written from verified facts instead of the raw description,
 * which is scraped prose (wrong person, mid-sentence cuts, SEO filler).
 */
export function buildStoryBody(benefits) {
    const has = (re) => benefits.some((b) => re.test(b.title));
    const lines = [];
    if (has(/schema/i)) {
        lines.push("De voerbak verdeelt de maaltijden volgens het schema dat jij instelt.");
    }
    if (has(/app/i)) {
        lines.push("Tijden en porties pas je aan in de app op je telefoon.");
    }
    if (has(/camera/i)) {
        lines.push("Via de camera zie je wat er bij de kom gebeurt.");
    }
    if (has(/twee katten|kommen/i)) {
        lines.push("Twee roestvrijstalen kommen voeren twee katten tegelijk.");
    }
    if (lines.length < 2)
        return null;
    return lines.slice(0, 3).join(" ");
}
/** Pull clean trust chips from noisy page text. */
export function parseTrustItems(rawBody) {
    const text = rawBody.replace(/\s+/g, " ");
    const items = [];
    const push = (label, provenance) => {
        if (items.some((i) => i.label.toLowerCase() === label.toLowerCase()))
            return;
        if (items.length >= 4)
            return;
        items.push({ label, source: "SOURCE_CONTENT", provenance });
    };
    if (/gratis verzending vanaf\s*€?\s*25/i.test(text)) {
        push("Gratis verzending vanaf €25", "body: Gratis verzending vanaf €25");
    }
    else if (/gratis verzending binnen 1-2 werkdagen/i.test(text)) {
        push("Gratis verzending binnen 1-2 werkdagen", "body: verzending 1-2 werkdagen");
    }
    else if (/gratis verzending/i.test(text)) {
        push("Gratis verzending", "body: Gratis verzending");
    }
    if (/achteraf betalen met klarna/i.test(text) || /betalen met klarna/i.test(text)) {
        push("Achteraf betalen met Klarna", "body: Klarna");
    }
    if (/14\s*dagen (bedenktijd|retour)/i.test(text)) {
        push("14 dagen bedenktijd", "body: 14 dagen bedenktijd/retour");
    }
    else if (/retourneren/i.test(text) && /14/i.test(text)) {
        push("14 dagen retourneren", "body: retour + 14");
    }
    if (/10\.?000\+?\s*tevreden klanten/i.test(text)) {
        push("10.000+ tevreden klanten", "body: 10.000+ tevreden klanten");
    }
    if (/1\s*jaar garantie/i.test(text)) {
        push("1 jaar garantie", "body: 1 jaar garantie");
    }
    return items;
}
export function parseSocialProof(rawBody) {
    if (/10\.?000\+?\s*tevreden klanten/i.test(rawBody)) {
        return { customersLabel: "10.000+ tevreden klanten" };
    }
    if (/10\.?000\+?\s*blije huisdieren/i.test(rawBody)) {
        return { customersLabel: "10.000+ blije huisdieren en baasjes" };
    }
    return { customersLabel: null };
}
/**
 * Map long description / FAQ facts into short benefit rows.
 * Only keep rows whose meaning is grounded in source text.
 */
export function normaliseBenefitsFromSource(input) {
    const blob = [
        input.description ?? "",
        input.metaDescription ?? "",
        ...input.faqs.map((f) => `${f.question} ${f.answer}`),
    ]
        .join("\n")
        .toLowerCase();
    const catalog = [
        {
            title: "Voeren op schema",
            body: "Stel maaltijden en porties in via de app, zodat voedertijden automatisch lopen.",
            need: /voerschema|automatisch.*(voer|maaltijd)|porties|voedingstijden/,
            provenance: "description/faq: schema/porties",
        },
        {
            title: "Full HD camera",
            body: "Kijk via de app mee terwijl je huisdier eet, ook wanneer je niet thuis bent.",
            need: /hd[ -]?camera|full hd|meekijken|op afstand/,
            provenance: "description/faq: HD camera",
        },
        {
            title: "Nachtzicht",
            body: "Infrarood nachtzicht zodat je ook in het donker kunt meekijken.",
            need: /nachtzicht|infrarood/,
            provenance: "faq/description: nachtzicht",
        },
        {
            title: "Voor twee katten",
            body: "Dubbele RVS kommen, geschikt om twee katten tegelijk te voeren.",
            need: /twee katten|2 katten|dubbele.*kom/,
            provenance: "faq/title: 2 katten / dubbele kommen",
        },
        {
            title: "App-bediening",
            body: "Bedien voerschema en camera vanaf je telefoon.",
            need: /app bedien|via de app|app-bedien/,
            provenance: "description/faq: app",
        },
        {
            title: "RVS kommen",
            body: "Roestvrijstalen kommen die hygiënisch en stevig in gebruik zijn.",
            need: /rvs|roestvrij/,
            provenance: "faq: RVS kommen",
        },
    ];
    const out = [];
    for (const row of catalog) {
        if (row.need.test(blob)) {
            out.push({
                title: row.title,
                body: row.body,
                source: "DERIVED_COPY",
                provenance: row.provenance,
            });
        }
        if (out.length >= 5)
            break;
    }
    return out;
}
export function buildFeatureDeepDive(benefits, images) {
    const pick = (kinds) => images.find((i) => kinds.includes(i.kind))?.url ??
        images[0]?.url ??
        null;
    return benefits.slice(0, 4).map((b, i) => ({
        title: b.title,
        body: b.body,
        meta: undefined,
        image: i === 0
            ? pick(["feature_graphic", "packshot", "detail"])
            : i === 1
                ? pick(["app_screen", "feature_graphic", "use_case"])
                : pick(["use_case", "lifestyle", "detail", "packshot"]),
        source: b.source,
    }));
}
export function cleanSnippet(raw, max = 70) {
    if (!raw)
        return null;
    let t = raw.replace(/\s+/g, " ").trim();
    t = t.replace(/^[^\p{L}\p{N}]+/u, "");
    // Drop obvious scrape garbage
    if (/✓|🔄|aar artikel|ellingen vanaf|Wil je iets retour/i.test(t) && t.length > 40) {
        return null;
    }
    if (t.length < 8)
        return null;
    if (t.length > max)
        return null; // refuse ellipsis truncation for UI chips
    return t;
}
//# sourceMappingURL=contentNormalisation.js.map