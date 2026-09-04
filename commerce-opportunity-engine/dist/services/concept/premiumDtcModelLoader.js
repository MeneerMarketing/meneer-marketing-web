/**
 * Milestone 9.1.2 — ConceptBrief + crawl → Premium DTC view-model.
 * Conversion-first, editorial art direction, no fake claims, no raw scrape chips.
 */
import { buildEditorialSubline, buildStoryBody, compactProductTitle, } from "./contentNormalisation.js";
function formatPrice(price, currency) {
    if (price == null)
        return null;
    try {
        return new Intl.NumberFormat("nl-NL", {
            style: "currency",
            currency: currency || "EUR",
        }).format(price);
    }
    catch {
        return `€ ${price.toFixed(2).replace(".", ",")}`;
    }
}
function slugify(s) {
    return s
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 80);
}
function discountPercent(price, compare) {
    if (compare <= price)
        return null;
    return Math.round(((compare - price) / compare) * 100);
}
export function buildPremiumDtcViewModel(input) {
    const { brief, crawl, theme } = input;
    const omitted = [];
    const variants = {};
    const assetUsage = [];
    const priceLabel = formatPrice(crawl.price ?? brief.price, crawl.currency ?? brief.currency) ||
        "Prijs op aanvraag";
    const compareAtLabel = formatPrice(crawl.compareAtPrice, crawl.currency ?? brief.currency);
    const discount = crawl.price != null && crawl.compareAtPrice != null
        ? discountPercent(crawl.price, crawl.compareAtPrice)
        : null;
    const titles = compactProductTitle(crawl.title || brief.product_title);
    const brandName = (crawl.brandName || brief.brand || brief.domain).replace(/\.com$/i, "");
    const editorialSubline = buildEditorialSubline(crawl.benefits, titles.subheadline);
    const media = crawl.images.map((img, i) => ({
        id: `img-${i + 1}`,
        src: img.url,
        alt: img.alt || titles.displayTitle,
        kind: "image",
        mediaKind: img.kind,
        claim: null,
    }));
    assetUsage.push({
        section: "HERO_BUY_BLOCK",
        assets: media.map((m) => m.src),
    });
    // One asset per editorial section — no image repeated across the deep dive.
    const claimed = new Set();
    const inStock = crawl.availability == null ||
        /instock|in_stock|available|voorraad/i.test(crawl.availability);
    const trustItems = crawl.trustItems.map((t) => ({
        label: t.label,
        source: "SOURCE_CONTENT",
    }));
    const serviceItems = trustItems.filter((t) => !/tevreden klanten/i.test(t.label));
    const shippingItem = serviceItems.find((t) => /verzending/i.test(t.label));
    const klarnaItem = serviceItems.find((t) => /klarna/i.test(t.label));
    const returnsItem = serviceItems.find((t) => /bedenktijd|retour/i.test(t.label));
    const promoParts = [shippingItem?.label, klarnaItem?.label, returnsItem?.label].filter(Boolean);
    const promoAnnouncements = promoParts.length > 0
        ? [{ text: promoParts.join(" · ") }]
        : serviceItems.slice(0, 1).map((t) => ({ text: t.label }));
    /**
     * The source gives no DOM evidence linking a specific asset to a specific
     * feature, so no asset is captioned with a feature it may not show.
     * Photographic assets carry the bleed moments, product graphics are shown whole.
     */
    const photographic = crawl.images.filter((i) => ["packshot", "lifestyle"].includes(i.kind));
    const graphics = crawl.images.filter((i) => !["packshot", "lifestyle", "logo"].includes(i.kind));
    const featureCanvas = photographic[0]?.url ?? crawl.images[0]?.url ?? null;
    if (featureCanvas)
        claimed.add(featureCanvas);
    const signatureFeatures = crawl.benefits.slice(0, 3).map((b) => ({
        title: b.title,
        body: b.body,
        accent: theme.brandAccent,
        image: null,
        source: b.source,
    }));
    const storyAsset = graphics.find((i) => !claimed.has(i.url) && i.kind !== "comparison");
    if (storyAsset)
        claimed.add(storyAsset.url);
    const storyImage = storyAsset?.url ?? null;
    const storyFit = storyAsset && ["packshot", "lifestyle"].includes(storyAsset.kind)
        ? "cover"
        : "contain";
    const detailItems = crawl.benefits.slice(3).map((b) => ({
        title: b.title,
        body: b.body,
        accent: theme.brandAccent,
        image: null,
        source: b.source,
    }));
    const detailMedia = graphics
        .filter((i) => !claimed.has(i.url))
        .slice(0, 3)
        .map((i) => {
        claimed.add(i.url);
        return i.url;
    });
    // A dark bleed only works with a real photo; marketing graphics would
    // collide with our own typography, so that moment stays typographic.
    const immersiveImage = photographic.find((i) => i.url !== featureCanvas)?.url ?? null;
    // The closing moment deliberately reuses the hero packshot.
    const finalImage = featureCanvas ?? crawl.images[0]?.url ?? null;
    const faqs = crawl.faqs.slice(0, 6).map((f) => ({
        question: f.question,
        answer: f.answer,
        source: "SOURCE_CONTENT",
    }));
    const storyBody = buildStoryBody(crawl.benefits);
    const cameraFact = crawl.benefits.find((b) => /camera|nachtzicht/i.test(b.title));
    const scheduleFact = crawl.benefits.find((b) => /schema|voeren/i.test(b.title));
    const activePlan = [];
    const push = (section, source) => {
        if (!activePlan.some((s) => s.section === section)) {
            activePlan.push({ section, content_source: source });
        }
    };
    push("HERO_BUY_BLOCK", "SOURCE_CONTENT");
    if (serviceItems.length)
        push("TRUST_BAR", "SOURCE_CONTENT");
    else
        omitted.push({ section: "TRUST_BAR", reason: "No parseable service facts" });
    if (crawl.benefits.length)
        push("BENEFIT_GRID", "DERIVED_COPY");
    else
        omitted.push({ section: "BENEFIT_GRID", reason: "No grounded benefits" });
    if (signatureFeatures.length >= 2) {
        push("FEATURE_DEEP_DIVE", "DERIVED_COPY");
        assetUsage.push({
            section: "FEATURE_DEEP_DIVE",
            assets: featureCanvas ? [featureCanvas] : [],
        });
    }
    else {
        omitted.push({
            section: "FEATURE_DEEP_DIVE",
            reason: "Fewer than two source-backed features",
        });
    }
    if (storyBody) {
        push("PRODUCT_STORY", "DERIVED_COPY");
        variants.PRODUCT_STORY = "EDITORIAL_STORY";
        if (storyImage)
            assetUsage.push({ section: "PRODUCT_STORY", assets: [storyImage] });
    }
    else {
        omitted.push({ section: "PRODUCT_STORY", reason: "No product description" });
    }
    if (detailItems.length >= 1 || detailMedia.length > 0) {
        push("TECH_SPECS", "DERIVED_COPY");
        assetUsage.push({ section: "TECH_SPECS", assets: detailMedia });
    }
    else {
        omitted.push({
            section: "TECH_SPECS",
            reason: "No remaining verified facts or product graphics",
        });
    }
    if (cameraFact) {
        push("PROBLEM_SOLUTION", "DERIVED_COPY");
        assetUsage.push({
            section: "PROBLEM_SOLUTION",
            assets: immersiveImage ? [immersiveImage] : [],
        });
        if (!immersiveImage) {
            omitted.push({
                section: "PROBLEM_SOLUTION_MEDIA",
                reason: "No second photographic asset without baked-in marketing text; section stays typographic",
            });
        }
    }
    if (faqs.length)
        push("FAQ", "SOURCE_CONTENT");
    else
        omitted.push({ section: "FAQ", reason: "No FAQ in source" });
    push("FINAL_PURCHASE", "DERIVED_COPY");
    if (finalImage)
        assetUsage.push({ section: "FINAL_PURCHASE", assets: [finalImage] });
    push("STICKY_ATC", "DERIVED_COPY");
    for (const item of input.sectionPlan) {
        if ((item.section === "REVIEWS" || item.section === "TESTIMONIALS") &&
            crawl.reviews.length === 0 &&
            crawl.rating == null) {
            omitted.push({ section: item.section, reason: "No SOURCE_CONTENT rating or reviews" });
        }
        if ((item.section === "HOW_TO_USE" || item.section === "HOW_IT_WORKS") &&
            crawl.howSteps.length === 0) {
            omitted.push({ section: item.section, reason: "No explicit how-to steps in source" });
        }
    }
    const klarnaLabel = crawl.price != null && crawl.paymentSignals.some((p) => /klarna/i.test(p))
        ? `3× ${formatPrice(Math.round((crawl.price / 3) * 100) / 100, crawl.currency)} met Klarna`
        : null;
    const paymentMethods = ["ideal", "visa", "mastercard", "klarna", "apple_pay", "paypal"].filter((id) => crawl.paymentSignals.some((p) => new RegExp(id.replace("_", "[-_ ]?"), "i").test(p)));
    const paymentsFinal = paymentMethods.length
        ? paymentMethods
        : /klarna/i.test(crawl.rawBodyText)
            ? ["ideal", "klarna"]
            : undefined;
    // Navigation labels come from the prospect's own header when available.
    const navFromSource = crawl.navLabels.filter((l) => !/tensfact/i.test(l)).slice(0, 4);
    const navSource = navFromSource.length >= 3
        ? "SOURCE_CONTENT"
        : "DERIVED_COPY";
    const navLinks = navSource === "SOURCE_CONTENT"
        ? navFromSource.map((label) => ({ label, href: "#pdtc-top" }))
        : [
            { label: "Shop", href: "#pdtc-buy-area" },
            { label: "Het systeem", href: "#pdtc-features-title" },
            ...(faqs.length ? [{ label: "Service", href: "#pdtc-faq" }] : []),
        ];
    const socialProof = crawl.socialProofLabel;
    const statMatch = socialProof?.match(/^([\d.]+\+?)\s+(.*)$/);
    return {
        meta: {
            conceptId: input.conceptId,
            briefId: input.briefId,
            brandSlug: slugify(brief.domain.replace(/\./g, "-")),
            productSlug: slugify(brief.product_title),
            previewSlug: brief.preview_slug,
            previewLifecycle: "INTERNAL_PREVIEW",
            templateFamily: "PREMIUM_DTC",
            templateId: "premium_dtc_a",
            templateVersion: "0.3.0-internal",
            domain: brief.domain,
            productUrl: crawl.productUrl,
            generatedAt: new Date().toISOString(),
            omittedSections: omitted,
            sectionVariants: variants,
            themeReport: {
                usedFallback: theme.usedFallback,
                fallbackReason: theme.fallbackReason,
                sourceColors: theme.sourceColors,
                brandAccent: theme.brandAccent,
            },
            crawlPages: crawl.pagesCrawled,
            navSource,
            rationale: [
                {
                    title: "KOOPMOMENT",
                    body: "Prijs, korting en drie kernvoordelen staan direct boven de CTA. Betaalinformatie volgt als reassurance, niet als ruis.",
                },
                {
                    title: "SIGNATURE",
                    body: "De feature experience laat één groot productbeeld meebewegen met de functie die je aanwijst. Dat vervangt de standaard feature-kaarten.",
                },
                {
                    title: "ART DIRECTION",
                    body: "Zwart als premium basis, het oranje van het merk alleen als accent op prijs, actieve states en markers.",
                },
                {
                    title: "MOBIEL",
                    body: "Titel, prijs en CTA komen binnen één scroll in beeld. De koopbalk verschijnt pas nadat de primaire CTA voorbij is.",
                },
            ],
            currentScreenshots: brief.current_screenshots,
            assetUsage,
        },
        model: {
            theme: {
                ink: theme.text,
                accent: theme.accent,
                accentSoft: theme.brandAccent,
                surface: theme.surface,
                surfaceAlt: theme.surfaceAlt,
                cream: theme.cream,
                logoUrl: crawl.logoUrl,
                logoAlt: brandName,
            },
            chrome: {
                brandName,
                logoUrl: crawl.logoUrl,
                logoAlt: brandName,
                navLinks,
                announcements: promoAnnouncements,
                cartCount: 0,
                accountLabel: "Account",
                footerTagline: editorialSubline ?? undefined,
                footerColumns: [
                    {
                        title: "Shop",
                        links: [
                            { label: titles.displayTitle, href: "#pdtc-buy-area" },
                            ...(crawl.benefits.length
                                ? [{ label: "Het systeem", href: "#pdtc-features-title" }]
                                : []),
                        ],
                    },
                    ...(faqs.length
                        ? [
                            {
                                title: "Service",
                                links: [{ label: "Veelgestelde vragen", href: "#pdtc-faq" }],
                            },
                        ]
                        : []),
                    ...(serviceItems.length
                        ? [{ title: "Voorwaarden", facts: serviceItems.map((t) => t.label) }]
                        : []),
                ],
                legalNote: `© ${new Date().getFullYear()} ${brandName}`,
            },
            product: {
                brandName,
                title: titles.displayTitle,
                subline: editorialSubline,
                lead: undefined,
                priceLabel,
                compareAtLabel,
                discountLabel: discount != null ? `Je bespaart ${discount}%` : null,
                currencyNote: null,
                klarnaLabel,
                ctaLabel: "In winkelwagen",
                inStock,
                media,
                trustItems: serviceItems,
                uspPills: [],
                buyBenefits: crawl.benefits.map((b) => ({ title: b.title, body: b.body })),
                socialProofLabel: socialProof,
                reassureItems: serviceItems.slice(0, 3).map((t) => t.label),
                paymentMethods: paymentsFinal ? [...paymentsFinal] : undefined,
                offerCard: null,
                miniFaqs: [],
                rating: crawl.rating,
                reviewCount: crawl.reviewCount,
                ratingNote: null,
                ratingHref: null,
                deliveryCutoffHour: 23,
                deliveryCutoffMinute: 0,
            },
            content: {
                benefitsKicker: "Het product",
                benefitsTitle: scheduleFact
                    ? "Voeren op schema. Met zicht op de kom."
                    : titles.displayTitle,
                benefitsLead: [
                    scheduleFact ? "Je stelt de voertijden en porties in via de app." : null,
                    cameraFact ? "De camera laat zien wat er bij de kom gebeurt." : null,
                ]
                    .filter(Boolean)
                    .join(" "),
                introStat: statMatch && statMatch[1] && statMatch[2]
                    ? { value: statMatch[1], label: statMatch[2] }
                    : null,
                introFacts: serviceItems.map((t) => t.label),
                benefits: [],
                featuresKicker: "Het systeem",
                featuresTitle: "Wat de voerbak voor je doet",
                featuresLead: "Loop de functies langs en bekijk het product van dichtbij.",
                features: signatureFeatures,
                detailKicker: "Details",
                detailTitle: "Details die je dagelijks merkt",
                detailLead: undefined,
                detailItems,
                detailMedia,
                featureCanvas,
                story: storyBody
                    ? {
                        kicker: scheduleFact ? "Voerschema" : "Het product",
                        title: scheduleFact
                            ? "Voeding op jouw schema, ook als je er niet bent."
                            : titles.displayTitle,
                        body: storyBody,
                        ctaLabel: "Naar het koopblok",
                        backgroundImage: storyImage,
                        mediaFit: storyFit,
                        source: "DERIVED_COPY",
                    }
                    : null,
                secondaryStory: cameraFact
                    ? {
                        kicker: "Full HD camera",
                        title: "Meekijken terwijl zij eten.",
                        body: cameraFact.body,
                        backgroundImage: immersiveImage,
                        source: "DERIVED_COPY",
                    }
                    : null,
                immersiveMeta: crawl.benefits
                    .filter((b) => /camera|nachtzicht|app/i.test(b.title))
                    .map((b) => b.title),
                howSteps: [],
                reviews: [],
                faqs,
                faqLead: "Vragen die klanten stellen voordat ze bestellen.",
                finalKicker: "Bestellen",
                finalTitle: titles.displayTitle,
                finalBody: editorialSubline ?? "",
                finalCtaLabel: "Bestel nu",
                finalImage,
                finalReassure: serviceItems.map((t) => t.label),
            },
            sectionPlan: activePlan,
        },
    };
}
//# sourceMappingURL=premiumDtcModelLoader.js.map