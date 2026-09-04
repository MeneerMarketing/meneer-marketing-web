/**
 * Unit proof that Anthropic pre-call gate cannot overspend.
 */
import { CONSERVATIVE_PERSONALISATION_CALL_COST, evaluateAnthropicBudgetGate, } from "../services/outreach/anthropicBudget.js";
import { assembleHumanFirstMail } from "../services/outreach/mailAssembler.js";
function assert(cond, msg) {
    if (!cond)
        throw new Error(msg);
}
// Simulate M8.1.1 failure mode: two "full" estimates of 0.012 with cap 0.02
// First call OK, second must be BUDGET_BLOCKED before API
let spent = 0;
const cap = 0.02;
const first = evaluateAnthropicBudgetGate({
    currentRunCost: spent,
    configuredCap: cap,
    conservativeNextCallCost: CONSERVATIVE_PERSONALISATION_CALL_COST,
});
assert(first.allowed, "first call must be allowed");
spent += 0.011; // pretend actual was under estimate
const second = evaluateAnthropicBudgetGate({
    currentRunCost: spent,
    configuredCap: cap,
    conservativeNextCallCost: CONSERVATIVE_PERSONALISATION_CALL_COST,
});
assert(!second.allowed, "second call must be blocked pre-call");
assert(!second.allowed && second.status === "BUDGET_BLOCKED", "must return BUDGET_BLOCKED");
// Assembler deterministic smoke
const mail = assembleHumanFirstMail({
    brandLabel: "Huisdierspullen",
    contactFirstName: null,
    verifiedObservation: "Op mobiel viel me bij het Trixie Premium Touring hondentuig op dat de prijs niet direct duidelijk in beeld staat.",
    verifiedStrength: "De variantkeuze op die pagina vond ik juist netjes opgelost.",
    recommendedProjectType: "SHOPIFY_CRO_REDESIGN",
    includeExperienceLine: false,
    subjectKey: "EVEN_IETS",
});
assert(mail.subject === "Even iets over Huisdierspullen", "default subject");
assert(mail.bodyText.includes("Ik kwam Huisdierspullen laatst tegen"), "opening");
assert(!mail.bodyText.includes("onderzoek"), "no research story");
assert(mail.wordCount <= 140, `word count ${mail.wordCount}`);
assert(mail.fixedCopy.includes("Ik help vanuit Meneer Marketing"), "fixed positioning");
assert(mail.personalisationCopy.includes("prijs"), "personalisation has observation");
console.log("M8.2 budget gate + assembler checks PASSED");
console.log(`- conservative estimate $${CONSERVATIVE_PERSONALISATION_CALL_COST}`);
console.log(`- second call status: ${!second.allowed ? second.status : "allowed"}`);
console.log(`- deterministic words: ${mail.wordCount}`);
//# sourceMappingURL=testHumanFirstM82.js.map