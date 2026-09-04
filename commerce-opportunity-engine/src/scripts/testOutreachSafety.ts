import { evaluateOutreachEligibility } from "../services/outreach/outreachEligibility.js";
import { evaluateSendSafety } from "../services/outreach/emailProvider.js";
import { validateOutreachDraft } from "../services/outreach/claimValidation.js";
import type { OutreachDraftAi } from "../services/outreach/claimValidation.js";

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

const baseEligible = {
  manualExcluded: false,
  doNotContact: false,
  businessType: "SPECIALIST_WEBSHOP",
  croAuditStatus: "COMPLETED",
  auditValid: true,
  auditConfidence: 92,
  supportedFindingsCount: 3,
  mmFit: 75,
  opportunityScore: 72,
  recommendedProjectType: "SHOPIFY_CRO_REDESIGN",
  websiteReachable: true,
  suppressed: false,
  firstTouchSent: false,
};

assert(
  evaluateOutreachEligibility(baseEligible).eligible,
  "expected eligible"
);
assert(
  !evaluateOutreachEligibility({ ...baseEligible, doNotContact: true }).eligible,
  "DNC must block"
);
assert(
  !evaluateOutreachEligibility({ ...baseEligible, manualExcluded: true }).eligible,
  "manual excluded must block"
);
assert(
  !evaluateOutreachEligibility({
    ...baseEligible,
    recommendedProjectType: "DESIGN_UPGRADE",
    fullRebuildPotential: 25,
    pdpImprovementPotential: 35,
  }).eligible,
  "strong site weak gap must block"
);

const sendBlocked = evaluateSendSafety({
  status: "APPROVED",
  doNotContact: false,
  manualExcluded: false,
  contactEmail: "info@example.nl",
  contactUsable: true,
  claimValidationPassed: true,
  outreachEligible: true,
  realSendEnabled: false,
  suppressed: false,
  firstTouchAlreadySent: false,
  isTestSend: false,
  testEmail: "test@meneermarketing.nl",
});
assert(!sendBlocked.allowed, "real send must be locked");
assert(
  sendBlocked.blockers.includes("OUTREACH_REAL_SEND_ENABLED=false"),
  "must cite real send lock"
);

const draft: OutreachDraftAi = {
  subject: "Even over jullie productpagina",
  body: `Hallo,

Ik kwam jullie tegen tijdens mijn onderzoek naar huisdierproducten en heb jullie Trixie-pagina bekeken.

Jullie webshop oogt netjes en de service-informatie is duidelijk. Op de productpagina viel me vooral op dat de prijs niet clearly above the fold staat, terwijl dat voor iemand die gericht zoekt juist het eerste beslispunt is.

Als je wilt, stuur ik graag een paar concrete verbeterideeën door voor jullie Shopify productpagina's.

Groet,
Meneer Marketing`,
  selected_finding_id: "finding_0_missing-price",
  selected_finding_title: "Missing price visibility above the fold",
  selected_strength_title: null,
  strategy: "SHOPIFY_CRO_REDESIGN",
  personalization_used: {
    first_name: false,
    brand: true,
    product: true,
    category: true,
    platform: false,
  },
  claims_used: ["reviewed product page", "no unproven ads claim"],
};

const validation = validateOutreachDraft({
  draft,
  auditType: "HIGH_CONFIDENCE_PRODUCT_TARGET",
  contactFirstName: null,
  productName: "Trixie tuig",
  brandDomain: "huisdierspullen.nl",
  findingTitles: ["Missing price visibility above the fold"],
  strengthTitles: [],
  confirmedGoogleAdvertiser: true,
});
assert(validation.status === "PASSED", `draft validation failed: ${validation.errors.join(",")}`);

const badAds = validateOutreachDraft({
  draft: {
    ...draft,
    body: draft.body + "\nJullie sturen Google Ads naar deze productpagina.",
  },
  auditType: "HIGH_CONFIDENCE_PRODUCT_TARGET",
  contactFirstName: null,
  productName: "Trixie tuig",
  brandDomain: "huisdierspullen.nl",
  findingTitles: ["Missing price visibility above the fold"],
  strengthTitles: [],
  confirmedGoogleAdvertiser: true,
});
assert(badAds.status === "FAILED", "unproven ads claim must fail");

console.log("M8 safety checks PASSED");
console.log("- DNC blocking OK");
console.log("- manual exclusion OK");
console.log("- CurrentBody-style weak sales reason OK");
console.log("- OUTREACH_REAL_SEND_ENABLED=false blocks real send OK");
console.log("- claim validation OK");
