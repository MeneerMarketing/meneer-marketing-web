/**
 * Quick unit checks for M8.1.1 claim fidelity (no API calls).
 */
import { validateOutreachDraft } from "../services/outreach/claimValidation.js";
import type { OutreachDraftAi } from "../services/outreach/claimValidation.js";
import {
  buildAllowedClaims,
  type AllowedClaim,
} from "../services/outreach/allowedClaims.js";

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

const claims: AllowedClaim[] = buildAllowedClaims({
  pageUrl:
    "https://huisdierspullen.nl/products/trixie-hondentuig-premium-touring-zwart-45-80x2-5-cm",
  productName: "Trixie Premium Touring hondentuig",
  brandName: "Huisdierspullen.nl",
  findings: [
    {
      id: "finding_0_price",
      title: "Missing price visibility above the fold",
      severity: "CRITICAL",
      evidence:
        "Both mobile and desktop screenshots show no visible price. JSON extraction confirms 'price: null'.",
      validationStatus: "QUESTIONABLE",
    },
  ],
  strengths: [
    {
      title: "Strong variant/color selection system",
      evidence: "Multiple color variants clearly shown on this product page.",
    },
  ],
  supportedOnly: false,
});

assert(
  claims.some((c) => c.type === "OBSERVATION" && c.scope === "PAGE_SPECIFIC"),
  "price claim must be PAGE_SPECIFIC"
);

const good: OutreachDraftAi = {
  subject: "Even iets over Huisdierspullen",
  body: `Hallo,

Ik kwam Huisdierspullen tegen toen ik naar webshops in de huisdierenbranche keek en heb jullie shop even bekeken.

Op de productpagina van het Trixie-tuig viel me op dat de prijs op mobiel niet direct duidelijk in beeld staat. De variantkeuze op die pagina vond ik juist netjes opgelost.

Ik help vanuit Meneer Marketing webshops met webdesign en Shopify.

Als je wilt, stuur ik mijn ideeën graag even door.

Groet,

Meneer Marketing
meneermarketing.nl
KVK 42095913`,
  selected_finding_id: "finding_0_price",
  selected_finding_title: "Missing price visibility above the fold",
  selected_strength_title: "Strong variant/color selection system",
  strategy: "SHOPIFY_CRO_REDESIGN",
  copy_style: "SOFT_OBSERVATION",
  personalization_used: {
    first_name: false,
    brand: true,
    product: true,
    category: true,
    platform: false,
  },
  claims_used: ["observation:finding_0_price"],
};

const ok = validateOutreachDraft({
  draft: good,
  auditType: "HIGH_CONFIDENCE_PRODUCT_TARGET",
  contactFirstName: null,
  productName: "Trixie Premium Touring hondentuig",
  brandDomain: "huisdierspullen.nl",
  findingTitles: ["Missing price visibility above the fold"],
  strengthTitles: ["Strong variant/color selection system"],
  confirmedGoogleAdvertiser: true,
  allowedClaims: claims,
  observationScope: "PAGE_SPECIFIC",
  availabilityProven: false,
});
assert(ok.status === "PASSED", `good draft failed: ${ok.errors.join(",")}`);

const expanded = validateOutreachDraft({
  draft: {
    ...good,
    body: good.body.replace(
      "Op de productpagina van het Trixie-tuig viel me op dat de prijs op mobiel niet direct duidelijk in beeld staat.",
      "Bij meerdere producten staat de prijs niet direct zichtbaar, ook niet als je naar beneden scrollt."
    ),
  },
  auditType: "HIGH_CONFIDENCE_PRODUCT_TARGET",
  contactFirstName: null,
  productName: "Trixie",
  brandDomain: "huisdierspullen.nl",
  findingTitles: ["Missing price visibility above the fold"],
  strengthTitles: ["Strong variant/color selection system"],
  confirmedGoogleAdvertiser: true,
  allowedClaims: claims,
  observationScope: "PAGE_SPECIFIC",
});
assert(expanded.status === "FAILED", "scope expansion must fail");
assert(
  expanded.errors.some((e) => e.includes("scope_")),
  `expected scope error, got ${expanded.errors.join(",")}`
);

const invented = validateOutreachDraft({
  draft: {
    ...good,
    body:
      good.body +
      " Dat kan voelen alsof er iets ontbreekt, ook al is het product tijdelijk niet leverbaar.",
  },
  auditType: "HIGH_CONFIDENCE_PRODUCT_TARGET",
  contactFirstName: null,
  productName: "Trixie",
  brandDomain: "huisdierspullen.nl",
  findingTitles: ["Missing price visibility above the fold"],
  strengthTitles: ["Strong variant/color selection system"],
  confirmedGoogleAdvertiser: true,
  allowedClaims: claims,
  observationScope: "PAGE_SPECIFIC",
  availabilityProven: false,
});
assert(invented.status === "FAILED", "availability causality must fail");

console.log("M8.1.1 claim fidelity unit checks PASSED");
console.log("- PAGE_SPECIFIC default OK");
console.log("- multi-product / scroll expansion blocked OK");
console.log("- invented availability causality blocked OK");
