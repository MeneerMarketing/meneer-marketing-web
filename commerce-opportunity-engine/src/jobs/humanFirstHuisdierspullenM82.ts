/**
 * Milestone 8.2 — Huisdierspullen human-first copy fixture.
 * A = DETERMINISTIC (no Anthropic)
 * B = AI_PERSONALIZED only if pre-call budget gate allows
 * No Resend send. No prospect mail.
 */
import { config } from "dotenv";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "../config/env.js";
import {
  attachValidationStatus,
  buildAllowedClaims,
} from "../services/outreach/allowedClaims.js";
import { findingIdFromTitle } from "../services/outreach/outreachRepository.js";
import { buildHumanFirstOutreach } from "../services/outreach/humanFirstOutreach.js";
import { normalizeBrandLabel } from "../services/outreach/mailAssembler.js";
import {
  CONSERVATIVE_PERSONALISATION_CALL_COST,
  evaluateAnthropicBudgetGate,
} from "../services/outreach/anthropicBudget.js";
import { syncOutreachMessagesForBrand } from "../services/outreach/outreachStateSync.js";
import { createSupabaseServerClient } from "../services/supabase/client.js";
import { createRun, completeRun } from "../services/supabase/runsRepository.js";
import { createEmailProvider, getOutreachDeliverabilityChecklist } from "../services/outreach/emailProvider.js";
import { one } from "../utils/one.js";
import { logger } from "../utils/logger.js";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, "../../");
config({ path: resolve(projectRoot, ".env"), quiet: true });

async function main(): Promise<void> {
  const env = loadEnv();
  const supabase = createSupabaseServerClient(env);
  const costCap = env.M82_MAX_ANTHROPIC_COST;
  let anthropicCost = 0;

  // Prove pre-call gate cannot be exceeded
  const gateDemoBlocked = evaluateAnthropicBudgetGate({
    currentRunCost: 0.015,
    configuredCap: 0.02,
    conservativeNextCallCost: CONSERVATIVE_PERSONALISATION_CALL_COST,
    label: "demo_over_cap",
  });
  const gateDemoAllowed = evaluateAnthropicBudgetGate({
    currentRunCost: 0,
    configuredCap: 0.02,
    conservativeNextCallCost: CONSERVATIVE_PERSONALISATION_CALL_COST,
    label: "demo_under_cap",
  });

  const { data: brand } = await supabase
    .from("brands")
    .select(
      "id, name, normalized_domain, confirmed_google_advertiser, preferred_contact_id"
    )
    .eq("normalized_domain", "huisdierspullen.nl")
    .single();
  if (!brand) throw new Error("huisdierspullen brand missing");

  const oppId = "17b015ba-f3e6-4b61-922b-0b713eadc084";
  const { data: opp } = await supabase
    .from("opportunities")
    .select(
      `id, audit_type, recommended_project_type, landing_url, resolved_url,
       keywords!opportunities_keyword_id_fkey ( keyword, category ),
       pages ( product_name, url )`
    )
    .eq("id", oppId)
    .single();
  if (!opp) throw new Error("opportunity missing");

  const { data: audit } = await supabase
    .from("audits")
    .select("conversion_leaks, strengths, finding_validations, sales_angle")
    .eq("opportunity_id", opp.id)
    .eq("status", "COMPLETED")
    .eq("audit_valid", true)
    .order("audited_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!audit) throw new Error("audit missing");

  let contact: Record<string, unknown> | null = null;
  if (brand.preferred_contact_id) {
    const { data } = await supabase
      .from("coe_brand_contacts")
      .select("*")
      .eq("id", brand.preferred_contact_id)
      .maybeSingle();
    contact = data;
  }
  if (!contact) {
    const { data } = await supabase
      .from("coe_brand_contacts")
      .select("*")
      .eq("brand_id", brand.id)
      .eq("is_usable_for_outreach", true)
      .limit(1)
      .maybeSingle();
    contact = data;
  }

  const page = one(opp.pages as Record<string, unknown> | Record<string, unknown>[]);
  const keyword = one(
    opp.keywords as Record<string, unknown> | Record<string, unknown>[]
  );
  const leaks = Array.isArray(audit.conversion_leaks)
    ? (audit.conversion_leaks as Array<Record<string, unknown>>)
    : [];
  const strengthsRaw = Array.isArray(audit.strengths)
    ? (audit.strengths as Array<Record<string, unknown>>)
    : [];

  const findings = attachValidationStatus(
    leaks
      .filter((l) => l.title)
      .map((l, idx) => ({
        id: findingIdFromTitle(String(l.title), idx),
        title: String(l.title),
        severity: String(l.severity ?? "MEDIUM"),
        evidence: String(l.evidence ?? "").slice(0, 500),
      })),
    audit.finding_validations
  );

  const pageUrl =
    (page?.url as string | null) ??
    (opp.resolved_url as string | null) ??
    (opp.landing_url as string | null);
  const productName =
    (page?.product_name as string | null) ??
    "het Trixie Premium Touring hondentuig";

  const allowedClaims = buildAllowedClaims({
    pageUrl,
    productName,
    brandName: brand.name,
    findings: findings.filter((f) => f.validationStatus !== "REJECTED"),
    strengths: strengthsRaw
      .filter((s) => s.title)
      .map((s) => ({
        title: String(s.title),
        evidence: String(s.evidence ?? "").slice(0, 400),
      })),
    supportedOnly: false,
  }).map((c) =>
    c.scope === "MULTI_PAGE" || c.scope === "SITE_WIDE"
      ? c
      : { ...c, scope: "PAGE_SPECIFIC" as const }
  );

  const priceFirst = [
    ...allowedClaims.filter(
      (c) => c.type === "OBSERVATION" && /price|prijs/i.test(c.subject)
    ),
    ...allowedClaims.filter(
      (c) => !(c.type === "OBSERVATION" && /price|prijs/i.test(c.subject))
    ),
  ];

  const brandLabel = normalizeBrandLabel(brand.name, brand.normalized_domain);
  const run = await createRun(supabase, "outreach_human_first_m82", {
    milestone: "8.2",
    costCap,
  });

  const results: Array<Record<string, unknown>> = [];

  try {
    // A — DETERMINISTIC (always, $0 Anthropic)
    const det = await buildHumanFirstOutreach({
      env,
      mode: "DETERMINISTIC",
      currentRunCost: anthropicCost,
      costCap,
      brandDomain: brand.normalized_domain,
      brandName: brand.name,
      brandLabel,
      contactFirstName: (contact?.first_name as string | null) ?? null,
      productName,
      recommendedProjectType: String(opp.recommended_project_type),
      auditType: (opp.audit_type as string | null) ?? null,
      keyword: (keyword?.keyword as string | null) ?? null,
      confirmedGoogleAdvertiser: Boolean(brand.confirmed_google_advertiser),
      allowedClaims: priceFirst,
      includeExperienceLine: false,
      subjectKey: "EVEN_IETS",
      usePaidFunnelOpening: false,
    });

    const detId = await insertMessage(supabase, {
      brandId: brand.id,
      opportunityId: opp.id,
      contactId: contact?.id ?? null,
      result: det,
    });
    results.push({
      variant: "A_DETERMINISTIC",
      messageId: detId,
      ...summarize(det),
    });

    // B — AI only if gate allows
    const ai = await buildHumanFirstOutreach({
      env,
      mode: "AI_PERSONALIZED",
      currentRunCost: anthropicCost,
      costCap,
      brandDomain: brand.normalized_domain,
      brandName: brand.name,
      brandLabel,
      contactFirstName: (contact?.first_name as string | null) ?? null,
      productName,
      recommendedProjectType: String(opp.recommended_project_type),
      auditType: (opp.audit_type as string | null) ?? null,
      keyword: (keyword?.keyword as string | null) ?? null,
      confirmedGoogleAdvertiser: Boolean(brand.confirmed_google_advertiser),
      allowedClaims: priceFirst,
      includeExperienceLine: false,
      subjectKey: "EEN_IDEE",
      usePaidFunnelOpening: false,
    });
    anthropicCost += ai.anthropicCost;

    if (anthropicCost > costCap + 1e-9) {
      throw new Error(
        `HARD CAP VIOLATION: anthropicCost $${anthropicCost} > cap $${costCap}`
      );
    }

    const aiId = await insertMessage(supabase, {
      brandId: brand.id,
      opportunityId: opp.id,
      contactId: contact?.id ?? null,
      result: ai,
    });
    results.push({
      variant: "B_AI_PERSONALIZED",
      messageId: aiId,
      ...summarize(ai),
    });

    await syncOutreachMessagesForBrand(
      supabase,
      String(brand.id),
      "m8.2 copy fixture harvest-excluded"
    );

    const provider = createEmailProvider({
      RESEND_API_KEY: env.RESEND_API_KEY,
      OUTREACH_FROM_EMAIL: env.OUTREACH_FROM_EMAIL,
      RESEND_FROM_EMAIL: env.RESEND_FROM_EMAIL,
    });
    const checklist = getOutreachDeliverabilityChecklist({
      RESEND_API_KEY: env.RESEND_API_KEY,
      OUTREACH_FROM_EMAIL: env.OUTREACH_FROM_EMAIL,
      RESEND_FROM_EMAIL: env.RESEND_FROM_EMAIL,
      OUTREACH_TEST_EMAIL: env.OUTREACH_TEST_EMAIL,
      OUTREACH_REAL_SEND_ENABLED: env.OUTREACH_REAL_SEND_ENABLED,
      RESEND_DOMAIN_VERIFIED: env.RESEND_DOMAIN_VERIFIED,
      RESEND_SPF_STATUS: env.RESEND_SPF_STATUS,
      RESEND_DKIM_STATUS: env.RESEND_DKIM_STATUS,
    });

    await completeRun(supabase, run.id, "completed", {
      results,
      anthropicCost,
      dataForSeoCost: 0,
      gateDemoBlocked,
      gateDemoAllowed,
      providerStatus: provider.status,
      checklist,
    });

    console.log("");
    console.log("MILESTONE 8.2 — HUMAN-FIRST OUTREACH");
    console.log("====================================");
    console.log(`Anthropic: $${anthropicCost.toFixed(6)} (cap $${costCap})`);
    console.log(`DataForSEO: $0`);
    console.log("");
    console.log("COST SAFETY");
    console.log(
      `  Old overrun cause: post-call accounting; headroom checked after spend started / estimate too low for 2 full-mail calls`
    );
    console.log(
      `  Gate demo under cap: allowed=${gateDemoAllowed.allowed}`
    );
    console.log(
      `  Gate demo over cap: allowed=${gateDemoBlocked.allowed} status=${
        !gateDemoBlocked.allowed ? gateDemoBlocked.status : "n/a"
      }`
    );
    console.log(
      `  Conservative next-call estimate: $${CONSERVATIVE_PERSONALISATION_CALL_COST}`
    );
    console.log("");
    for (const r of results) {
      console.log(`--- ${r.variant} · mode=${r.mode} · ${r.wordCount}w · ${r.validation} ---`);
      console.log(`subject: ${r.subject}`);
      console.log(`claims: ${(r.claimsUsed as string[]).join(", ")}`);
      console.log(`notes: ${(r.notes as string[]).join("; ")}`);
      if (r.budgetBlocked) console.log(`BUDGET_BLOCKED: ${r.budgetBlockReason}`);
      console.log("");
      console.log("FIXED COPY:");
      console.log(String(r.fixedCopy));
      console.log("");
      console.log("PERSONALISATION:");
      console.log(String(r.personalisationCopy));
      console.log("");
      console.log("FULL BODY:");
      console.log(String(r.body));
      console.log("");
    }

    console.log("RESEND");
    console.log(`  provider: ${provider.status}`);
    for (const c of checklist) {
      console.log(`  · ${c.label}: ${c.status}`);
    }
    console.log("");
    console.log("COMPARISON");
    console.log(
      "  Deterministic is simpler/more consistent for first-touch; AI only tweaks observation/strength wording."
    );
    console.log("STOP — geen Resend-send, geen prospectmail.");
    if (provider.status !== "READY") {
      console.log("");
      console.log(
        "NEXT: zet RESEND_API_KEY, RESEND_FROM_EMAIL, OUTREACH_TEST_EMAIL in .env voor test-send."
      );
    }
    process.exit(0);
  } catch (err) {
    await completeRun(supabase, run.id, "failed", {
      error: err instanceof Error ? err.message : "unknown",
      anthropicCost,
    });
    logger.error("M8.2 failed", {
      error: err instanceof Error ? err.message : "unknown",
    });
    process.exit(1);
  }
}

function summarize(result: Awaited<ReturnType<typeof buildHumanFirstOutreach>>) {
  return {
    mode: result.mode,
    subject: result.mail.subject,
    body: result.mail.bodyText,
    fixedCopy: result.mail.fixedCopy,
    personalisationCopy: result.mail.personalisationCopy,
    wordCount: result.mail.wordCount,
    claimsUsed: result.claimsUsed,
    validation: result.validation.status,
    validationErrors: result.validation.errors,
    anthropicCost: result.anthropicCost,
    budgetBlocked: result.budgetBlocked,
    budgetBlockReason: result.budgetBlockReason,
    notes: result.notes,
    observation: result.observationClaim.source_title,
    strength: result.strengthClaim?.source_title ?? null,
  };
}

async function insertMessage(
  supabase: ReturnType<typeof createSupabaseServerClient>,
  input: {
    brandId: string;
    opportunityId: string;
    contactId: unknown;
    result: Awaited<ReturnType<typeof buildHumanFirstOutreach>>;
  }
): Promise<string> {
  const { data: latest } = await supabase
    .from("coe_outreach_messages")
    .select("version")
    .eq("opportunity_id", input.opportunityId)
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();
  const version = (latest?.version ?? 0) + 1;
  const status =
    input.result.validation.status === "PASSED"
      ? "READY_FOR_REVIEW"
      : "DRAFT_INVALID";

  const { data, error } = await supabase
    .from("coe_outreach_messages")
    .insert({
      brand_id: input.brandId,
      opportunity_id: input.opportunityId,
      contact_id: input.contactId,
      version,
      strategy: input.result.observationClaim.source_title.slice(0, 80),
      subject: input.result.mail.subject,
      body: input.result.mail.bodyText,
      body_html: input.result.mail.bodyHtml,
      status,
      generator_model: input.result.model,
      prompt_version: input.result.promptVersion,
      copy_style: "SOFT_OBSERVATION",
      generation_mode: input.result.mode,
      fixed_copy: input.result.mail.fixedCopy,
      personalisation_copy: input.result.mail.personalisationCopy,
      selected_finding_id: input.result.observationClaim.id,
      selected_finding_title: input.result.observationClaim.source_title,
      selected_strength_title:
        input.result.strengthClaim?.source_title ?? null,
      personalization_used: {
        first_name: false,
        brand: true,
        product: true,
        category: false,
        platform: false,
      },
      claims_used: input.result.claimsUsed,
      claim_validation: input.result.validation,
      claim_validation_status: input.result.validation.status,
      source_claim_level: input.result.validation.allowedClaimLevel,
      anthropic_cost: input.result.anthropicCost,
      word_count: input.result.mail.wordCount,
      idempotency_key: `m82_${input.result.mode}_${input.opportunityId}_v${version}`,
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  return data.id;
}

main();
