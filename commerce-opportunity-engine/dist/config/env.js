import { z } from "zod";
/** Parse env booleans correctly: "false" / "0" → false (z.coerce.boolean treats non-empty strings as true). */
const envBoolean = z.preprocess((value) => {
    if (typeof value === "boolean")
        return value;
    if (typeof value === "number")
        return value !== 0;
    if (typeof value === "string") {
        const normalized = value.trim().toLowerCase();
        if (["true", "1", "yes", "y", "on"].includes(normalized))
            return true;
        if (["false", "0", "no", "n", "off", ""].includes(normalized))
            return false;
    }
    return value;
}, z.boolean());
const envSchema = z.object({
    DATAFORSEO_LOGIN: z.string().min(1, "DATAFORSEO_LOGIN is required"),
    DATAFORSEO_PASSWORD: z.string().min(1, "DATAFORSEO_PASSWORD is required"),
    SUPABASE_URL: z.url("SUPABASE_URL must be a valid URL"),
    SUPABASE_SECRET_KEY: z.string().min(1, "SUPABASE_SECRET_KEY is required"),
    ANTHROPIC_API_KEY: z.string().min(1, "ANTHROPIC_API_KEY is required"),
    CLAUDE_MODEL: z.string().min(1).default("claude-haiku-4-5-20251001"),
    GOOGLE_DISCOVERY_MAX_KEYWORDS: z.coerce.number().int().min(0).default(10),
    DATAFORSEO_MAX_COST_PER_RUN: z.coerce.number().positive().default(0.1),
    DATAFORSEO_CONCURRENCY: z.coerce.number().int().positive().default(2),
    GOOGLE_SERP_LOCATION_CODE: z.coerce.number().int().positive().default(2528),
    GOOGLE_SERP_LANGUAGE_CODE: z.string().min(1).default("nl"),
    GOOGLE_SERP_DEVICE: z.enum(["desktop", "mobile"]).default("mobile"),
    GOOGLE_SERP_OS: z.enum(["windows", "macos", "ios", "android"]).default("android"),
    GOOGLE_SERP_SE_DOMAIN: z.string().min(1).default("google.nl"),
    /** Include shopping/popular_products blocks as PAID_CANDIDATE (not confirmed). */
    GOOGLE_DISCOVERY_INCLUDE_SHOPPING_ADS: envBoolean.default(true),
    GOOGLE_DISCOVERY_SKIP_SERP_FETCH: envBoolean.default(false),
    GOOGLE_DISCOVERY_KEYWORD_FILTER: z.string().min(1).optional(),
    GOOGLE_ADS_CONFIRMATION_ENABLED: envBoolean.default(true),
    GOOGLE_ADS_CONFIRMATION_MAX_DOMAINS_PER_RUN: z.coerce.number().int().positive().default(3),
    GOOGLE_ADS_CONFIRMATION_MAX_COST_PER_RUN: z.coerce.number().positive().default(0.05),
    /** Optional path to saved DataForSEO JSON response for parser debugging without API calls. */
    DATAFORSEO_SERP_FIXTURE_PATH: z.string().optional(),
    LOG_LEVEL: z.enum(["info", "warn", "error", "debug"]).default("info"),
    CRAWLER_MAX_BRANDS_PER_RUN: z.coerce.number().int().positive().default(10),
    CRAWLER_CONCURRENCY: z.coerce.number().int().positive().default(2),
    CRAWLER_TIMEOUT_MS: z.coerce.number().int().positive().default(45000),
    QUALIFICATION_HAIKU_FALLBACK_ENABLED: envBoolean.default(true),
    PRODUCT_RESOLUTION_MAX_INTERNAL_PAGES: z.coerce.number().int().positive().default(10),
    PRODUCT_RESOLUTION_CONCURRENCY: z.coerce.number().int().positive().default(2),
    /** Force re-qualification of priority regression domains even if already crawled. */
    QUALIFY_FORCE_PRIORITY_DOMAINS: envBoolean.default(true),
    PAID_GROUND_TRUTH_MAX_DOMAINS_PER_RUN: z.coerce.number().int().positive().default(3),
    PAID_GROUND_TRUTH_MAX_RESULTS_PER_DOMAIN: z.coerce.number().int().positive().default(50),
    PAID_GROUND_TRUTH_MAX_DATAFORSEO_COST_PER_RUN: z.coerce.number().positive().default(0.05),
    PAID_GROUND_TRUTH_CONCURRENCY: z.coerce.number().int().positive().default(1),
    PAID_GROUND_TRUTH_DOMAIN_FILTER: z.string().optional(),
    SHOPPING_GROUND_TRUTH_MAX_KEYWORDS: z.coerce.number().int().positive().default(3),
    SHOPPING_GROUND_TRUTH_MAX_RESULTS_PER_KEYWORD: z.coerce.number().int().positive().default(20),
    SHOPPING_GROUND_TRUTH_MAX_AD_URL_RESOLUTIONS: z.coerce.number().int().positive().default(10),
    SHOPPING_GROUND_TRUTH_MAX_DATAFORSEO_COST_PER_RUN: z.coerce.number().positive().default(0.05),
    SHOPPING_GROUND_TRUTH_CONCURRENCY: z.coerce.number().int().positive().default(1),
    SHOPPING_GROUND_TRUTH_KEYWORD_FILTER: z.string().optional(),
    /** 1=normal (~$0.001/SERP), 2=high (~$0.002/SERP) */
    SHOPPING_GROUND_TRUTH_PRIORITY: z.coerce.number().int().min(1).max(2).default(1),
    CRO_AUDIT_MODEL: z.string().min(1).default("claude-sonnet-4-5-20250929"),
    CRO_AUDIT_MAX_OPPORTUNITIES_PER_RUN: z.coerce.number().int().positive().default(3),
    CRO_AUDIT_CONCURRENCY: z.coerce.number().int().positive().default(1),
    CRO_AUDIT_MAX_ANTHROPIC_COST_PER_RUN: z.coerce.number().positive().default(0.35),
    CRO_AUDIT_FORCE_REAUDIT: envBoolean.default(false),
    CRO_AUDIT_DOMAIN_FILTER: z.string().optional(),
    CRO_SCREENSHOT_BUCKET: z.string().min(1).default("opportunity-screenshots"),
    AUDIT_PAGE_MAX_RETRIES: z.coerce.number().int().min(0).max(5).default(2),
    AUDIT_RETRY_DELAY_MS: z.coerce.number().int().min(0).default(1500),
    /** Allow PARTIAL pages with confidence >= this to reach Claude (default 60). */
    AUDIT_PARTIAL_MIN_CONFIDENCE: z.coerce.number().int().min(0).max(100).default(60),
    /** Milestone 7 — Keyword Intelligence Engine */
    KEYWORD_ENGINE_MAX_DATAFORSEO_COST_PER_RUN: z.coerce.number().positive().default(0.05),
    KEYWORD_ENGINE_MAX_CANDIDATES: z.coerce.number().int().positive().default(100),
    KEYWORD_ENGINE_MAX_SEEDS: z.coerce.number().int().positive().default(10),
    KEYWORD_ENGINE_MIN_AUTO_QUALIFY_SCORE: z.coerce.number().int().min(0).max(100).default(55),
    KEYWORD_ENGINE_CATEGORY: z.string().min(1).default("BEAUTY_SKINCARE"),
    KEYWORD_SERP_ESTIMATED_COST_PER_KEYWORD: z.coerce.number().positive().default(0.002),
    /** When true, discover:google / keywords:discover-test only load APPROVED keywords. */
    KEYWORD_DISCOVERY_APPROVED_ONLY: envBoolean.default(false),
    /** Milestone 7.2 — Controlled Multi-Category Scale */
    CONTROLLED_SCALE_MAX_KEYWORDS: z.coerce.number().int().positive().default(50),
    CONTROLLED_SCALE_MAX_SERP_COST: z.coerce.number().positive().default(0.25),
    CONTROLLED_SCALE_TOTAL_DATAFORSEO_BUDGET: z.coerce.number().positive().default(0.35),
    CONTROLLED_SCALE_MAX_ANTHROPIC_COST: z.coerce.number().positive().default(0.03),
    CONTROLLED_SCALE_SKIP_KEYWORD_GENERATE: envBoolean.default(false),
    KEYWORD_RESCAN_COOLDOWN_DAYS: z.coerce.number().int().min(0).default(7),
    TRANSPARENCY_SCALE_MAX_DOMAINS: z.coerce.number().int().positive().default(15),
    TRANSPARENCY_SCALE_MAX_COST: z.coerce.number().positive().default(0.05),
    PAID_TARGET_SCALE_MAX_BRANDS: z.coerce.number().int().positive().default(5),
    PAID_TARGET_SCALE_MAX_COST: z.coerce.number().positive().default(0.08),
    /** Milestone 7.2.1 — Selective paid verification (no SERP/keyword gen) */
    PAID_VERIFY_MAX_DOMAINS: z.coerce.number().int().positive().default(15),
    PAID_VERIFY_MAX_COST: z.coerce.number().positive().default(0.05),
    PAID_VERIFY_CONCURRENCY: z.coerce.number().int().positive().default(2),
    PAID_TARGET_VERIFY_MAX_BRANDS: z.coerce.number().int().positive().default(5),
    PAID_TARGET_VERIFY_MAX_COST: z.coerce.number().positive().default(0.1),
    M721_MAX_DATAFORSEO_COST: z.coerce.number().positive().default(0.15),
    /** Milestone 7.2.2 — Confirmed target harvest */
    M722_MAX_DATAFORSEO_COST: z.coerce.number().positive().default(0.25),
    TARGET_HARVEST_MAX_BRANDS: z.coerce.number().int().positive().default(10),
    TARGET_HARVEST_MAX_CRO_SHORTLIST: z.coerce.number().int().positive().default(5),
    /** Milestone 7.3 — CRO audit of new confirmed prospects (no DataForSEO) */
    M73_MAX_ANTHROPIC_COST: z.coerce.number().positive().default(0.15),
    M73_MAX_NEW_AUDITS: z.coerce.number().int().positive().default(2),
    /** Milestone 8 — Contact enrichment + outreach */
    M8_MAX_ANTHROPIC_COST: z.coerce.number().positive().default(0.05),
    M8_CONTACT_DISCOVERY_MAX_BRANDS: z.coerce.number().int().positive().default(5),
    M8_OUTREACH_DRAFT_MAX: z.coerce.number().int().positive().default(3),
    /** Milestone 8.1 — copy V2 + safety (hard Anthropic ceiling) */
    M81_MAX_ANTHROPIC_COST: z.coerce.number().positive().default(0.03),
    M81_COPY_TEST_MAX: z.coerce.number().int().positive().default(3),
    /** Allow harvest-excluded brands for copy tests only (still blocked for send). */
    M81_COPY_TEST_ALLOW_HARVEST_EXCLUDED: envBoolean.default(true),
    /** Milestone 8.1.1 — claim fidelity recalibration */
    M811_MAX_ANTHROPIC_COST: z.coerce.number().positive().default(0.02),
    /** Milestone 8.2 — human-first + hard pre-call budget gate */
    M82_MAX_ANTHROPIC_COST: z.coerce.number().positive().default(0.02),
    /** Milestone 9.2.1 — outreach CRO coverage expansion (max 8 audits) */
    M921_MAX_ANTHROPIC_COST: z.coerce.number().positive().default(0.3),
    /** Milestone 9.3 — ideal prospect discovery */
    M93_MAX_DATAFORSEO_COST: z.coerce.number().positive().default(0.4),
    M93_MAX_ANTHROPIC_COST: z.coerce.number().positive().default(0.3),
    /** Milestone 9.3.2 — prospect discovery calibration. Anthropic stays at zero. */
    M932_MAX_DATAFORSEO_COST: z.coerce.number().positive().default(0.12),
    /** Milestone 9.3.3 — focused production discovery. Anthropic stays at zero. */
    M933_MAX_DATAFORSEO_COST: z.coerce.number().positive().default(0.2),
    /** Milestone 9.3.4 — audit the new prospects. Max 6 audits, no DataForSEO. */
    M934_MAX_ANTHROPIC_COST: z.coerce.number().positive().default(0.22),
    /** Milestone 9.4 — high-ticket focused brand discovery. Anthropic stays at zero. */
    M94_MAX_DATAFORSEO_COST: z.coerce.number().positive().default(0.2),
    /** Milestone 9.4.1 — final design target validation. Max 2 audits. */
    M941_MAX_ANTHROPIC_COST: z.coerce.number().positive().default(0.12),
    /** Milestone 9.5 — design-gap-first discovery. Cheap vision only after pre-screen. */
    M95_MAX_DATAFORSEO_COST: z.coerce.number().positive().default(0.2),
    M95_MAX_ANTHROPIC_COST: z.coerce.number().positive().default(0.08),
    /** Milestone 9.5.1 — wide cheap screen on M9.5 pool. No DataForSEO. */
    M951_MAX_ANTHROPIC_COST: z.coerce.number().positive().default(0.025),
    /** Milestone 9.6 — brand-first high-ticket discovery. */
    M96_MAX_DATAFORSEO_COST: z.coerce.number().positive().default(0.2),
    M96_MAX_ANTHROPIC_COST: z.coerce.number().positive().default(0.025),
    /** Milestone 9.6.1 — balanced brand-first calibration. */
    M961_MAX_DATAFORSEO_COST: z.coerce.number().positive().default(0.18),
    M961_MAX_ANTHROPIC_COST: z.coerce.number().positive().default(0.02),
    /** Milestone 9.7 — third-party brand mining. */
    M97_MAX_DATAFORSEO_COST: z.coerce.number().positive().default(0.16),
    M97_MAX_ANTHROPIC_COST: z.coerce.number().positive().default(0.015),
    /** Milestone 9.8 — PDP-gap-first harvest. */
    M98_MAX_DATAFORSEO_COST: z.coerce.number().positive().default(0.18),
    M98_MAX_ANTHROPIC_COST: z.coerce.number().positive().default(0.035),
    /** Milestone 9.8.2 — high-ticket PDP-gap-first production search. */
    M982_MAX_DATAFORSEO_COST: z.coerce.number().positive().default(0.2),
    M982_MAX_ANTHROPIC_COST: z.coerce.number().positive().default(0.03),
    /** Milestone 9.8.3 — high-ticket gap completion pass. */
    M983_MAX_DATAFORSEO_COST: z.coerce.number().positive().default(0.12),
    M983_MAX_ANTHROPIC_COST: z.coerce.number().positive().default(0.02),
    /** Milestone 9.9.2 — visually underdesigned focused brand search. */
    M992_MAX_DATAFORSEO_COST: z.coerce.number().positive().default(0.18),
    M992_MAX_ANTHROPIC_COST: z.coerce.number().positive().default(0.03),
    /** Milestone 9.9.4 — visual focused brand production discovery. */
    M994_MAX_DATAFORSEO_COST: z.coerce.number().positive().default(0.2),
    M994_MAX_ANTHROPIC_COST: z.coerce.number().positive().default(0.035),
    /** Milestone 9.9.7 — compact brand + strong visual gap production. */
    M997_MAX_DATAFORSEO_COST: z.coerce.number().positive().default(0.2),
    M997_MAX_ANTHROPIC_COST: z.coerce.number().positive().default(0.035),
    OUTREACH_TEST_EMAIL: z.preprocess((v) => (typeof v === "string" && v.trim() === "" ? undefined : v), z.string().email().optional()),
    OUTREACH_REAL_SEND_ENABLED: envBoolean.default(false),
    OUTREACH_FROM_EMAIL: z.string().optional(),
    RESEND_FROM_EMAIL: z.string().optional(),
    RESEND_API_KEY: z.string().optional(),
    RESEND_DOMAIN_VERIFIED: z.string().optional(),
    RESEND_SPF_STATUS: z.string().optional(),
    RESEND_DKIM_STATUS: z.string().optional(),
});
function formatZodErrors(error) {
    return error.issues
        .map((issue) => `${issue.path.join(".") || "env"}: ${issue.message}`)
        .join("\n");
}
export function loadEnv() {
    const result = envSchema.safeParse(process.env);
    if (!result.success) {
        throw new Error(`Environment validation failed:\n${formatZodErrors(result.error)}`);
    }
    const env = result.data;
    return env;
}
//# sourceMappingURL=env.js.map