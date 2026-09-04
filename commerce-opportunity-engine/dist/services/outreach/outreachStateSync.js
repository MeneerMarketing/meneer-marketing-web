/**
 * Milestone 8.1 — keep outreach message status consistent with brand/opportunity safety.
 * Non-sent messages become BLOCKED (or APPROVAL_REVOKED when previously approved).
 * Historical subject/body are preserved.
 */
import { isEmailOrDomainSuppressed } from "./outreachRepository.js";
const TERMINAL_SENT = new Set([
    "SENT",
    "DELIVERED",
    "REPLIED",
    "POSITIVE_REPLY",
    "NEGATIVE_REPLY",
    "BOUNCED",
    "UNSUBSCRIBED",
]);
const BLOCKABLE = new Set([
    "DRAFT",
    "DRAFT_INVALID",
    "READY_FOR_REVIEW",
    "READY_FOR_DRAFT",
    "APPROVED",
    "TEST_SENT",
    "APPROVAL_REVOKED",
    "BLOCKED",
]);
export function detectBlockReasons(snap, suppressed) {
    const reasons = [];
    if (snap.manualExcluded)
        reasons.push("brand_manually_excluded");
    if (snap.doNotContact)
        reasons.push("brand_do_not_contact");
    if ((snap.eligibilityStatus ?? "").toUpperCase() === "EXCLUDED") {
        reasons.push("brand_eligibility_excluded");
    }
    if (snap.leadEligible === false)
        reasons.push("brand_not_lead_eligible");
    const opp = (snap.opportunityStatus ?? "").toUpperCase();
    if (opp === "REJECTED")
        reasons.push("opportunity_rejected");
    if (opp === "EXCLUDED")
        reasons.push("opportunity_excluded");
    if (snap.outreachEligible === false)
        reasons.push("outreach_eligible_false");
    if (suppressed)
        reasons.push("suppression");
    if (snap.contactEmail && !snap.contactUsable)
        reasons.push("contact_unusable");
    return reasons;
}
export function humanBlockReason(reasons) {
    const map = {
        brand_manually_excluded: "brand manually excluded",
        brand_do_not_contact: "do not contact",
        brand_eligibility_excluded: "brand eligibility excluded",
        brand_not_lead_eligible: "brand not lead eligible",
        opportunity_rejected: "opportunity rejected",
        opportunity_excluded: "opportunity excluded",
        outreach_eligible_false: "outreach_eligible=false",
        suppression: "suppression list",
        contact_unusable: "contact not usable for outreach",
    };
    return reasons.map((r) => map[r]).join("; ");
}
/**
 * Invalidate non-sent outreach for a brand when safety flags trip.
 */
export async function syncOutreachMessagesForBrand(client, brandId, explicitReason) {
    const { data: brand, error: brandErr } = await client
        .from("brands")
        .select("id, normalized_domain, manual_excluded, do_not_contact, eligibility_status, lead_eligible")
        .eq("id", brandId)
        .single();
    if (brandErr || !brand)
        throw new Error(brandErr?.message ?? "Brand not found");
    const { data: messages, error } = await client
        .from("coe_outreach_messages")
        .select(`id, status, opportunity_id, contact_id, approved_at,
       coe_brand_contacts ( email, is_usable_for_outreach ),
       opportunities ( status, outreach_eligible )`)
        .eq("brand_id", brandId);
    if (error)
        throw new Error(error.message);
    const results = [];
    const now = new Date().toISOString();
    const domain = String(brand.normalized_domain);
    for (const msg of messages ?? []) {
        if (TERMINAL_SENT.has(String(msg.status))) {
            results.push({
                messageId: msg.id,
                previousStatus: String(msg.status),
                nextStatus: null,
                reasons: [],
            });
            continue;
        }
        if (!BLOCKABLE.has(String(msg.status))) {
            results.push({
                messageId: msg.id,
                previousStatus: String(msg.status),
                nextStatus: null,
                reasons: [],
            });
            continue;
        }
        const contact = Array.isArray(msg.coe_brand_contacts)
            ? msg.coe_brand_contacts[0]
            : msg.coe_brand_contacts;
        const opportunity = Array.isArray(msg.opportunities)
            ? msg.opportunities[0]
            : msg.opportunities;
        const snap = {
            brandId,
            domain,
            manualExcluded: Boolean(brand.manual_excluded),
            doNotContact: Boolean(brand.do_not_contact),
            eligibilityStatus: brand.eligibility_status ?? null,
            leadEligible: brand.lead_eligible === null || brand.lead_eligible === undefined
                ? null
                : Boolean(brand.lead_eligible),
            outreachEligible: opportunity?.outreach_eligible === null ||
                opportunity?.outreach_eligible === undefined
                ? null
                : Boolean(opportunity.outreach_eligible),
            opportunityStatus: opportunity?.status ?? null,
            contactEmail: contact?.email ?? null,
            contactUsable: Boolean(contact?.is_usable_for_outreach ?? true),
        };
        const suppressed = await isEmailOrDomainSuppressed(client, snap.contactEmail, domain);
        const reasons = detectBlockReasons(snap, suppressed);
        if (!reasons.length) {
            results.push({
                messageId: msg.id,
                previousStatus: String(msg.status),
                nextStatus: null,
                reasons: [],
            });
            continue;
        }
        const wasApproved = String(msg.status) === "APPROVED" || Boolean(msg.approved_at);
        const alreadyRevoked = String(msg.status) === "APPROVAL_REVOKED";
        const nextStatus = wasApproved || alreadyRevoked ? "APPROVAL_REVOKED" : "BLOCKED";
        const reasonText = explicitReason
            ? `${explicitReason}; ${humanBlockReason(reasons)}`
            : humanBlockReason(reasons);
        // Already in terminal blocked/revoked with same outcome — still refresh reason
        const { error: updErr } = await client
            .from("coe_outreach_messages")
            .update({
            status: nextStatus,
            blocked_at: now,
            blocked_reason: reasonText,
            approval_revoked_at: wasApproved || alreadyRevoked
                ? msg.approval_revoked_at ??
                    now
                : null,
            approved_at: null,
            approved_by: null,
            approved_content_hash: null,
            updated_at: now,
        })
            .eq("id", msg.id);
        if (updErr)
            throw new Error(updErr.message);
        await client.from("coe_outreach_events").insert({
            outreach_message_id: msg.id,
            brand_id: brandId,
            event_type: wasApproved ? "APPROVAL_REVOKED" : "BLOCKED",
            payload: { reasons, previousStatus: msg.status, reasonText },
        });
        if (msg.opportunity_id) {
            await client
                .from("opportunities")
                .update({
                outreach_status: nextStatus,
                outreach_eligible: false,
                outreach_eligible_reason: reasonText,
                updated_at: now,
            })
                .eq("id", msg.opportunity_id);
        }
        results.push({
            messageId: msg.id,
            previousStatus: String(msg.status),
            nextStatus,
            reasons,
        });
    }
    return results;
}
export async function syncAllUnsafeOutreachMessages(client) {
    const { data: brands, error } = await client
        .from("brands")
        .select("id")
        .or("manual_excluded.eq.true,do_not_contact.eq.true,eligibility_status.eq.EXCLUDED,lead_eligible.eq.false");
    if (error)
        throw new Error(error.message);
    const all = [];
    for (const b of brands ?? []) {
        const part = await syncOutreachMessagesForBrand(client, String(b.id));
        all.push(...part.filter((r) => r.nextStatus));
    }
    // Also catch opportunities marked not outreach-eligible with open messages
    const { data: opps } = await client
        .from("opportunities")
        .select("brand_id")
        .eq("outreach_eligible", false)
        .in("outreach_status", [
        "DRAFT",
        "DRAFT_INVALID",
        "READY_FOR_REVIEW",
        "APPROVED",
        "TEST_SENT",
    ]);
    const seen = new Set((brands ?? []).map((b) => String(b.id)));
    for (const o of opps ?? []) {
        const id = String(o.brand_id);
        if (seen.has(id))
            continue;
        seen.add(id);
        const part = await syncOutreachMessagesForBrand(client, id);
        all.push(...part.filter((r) => r.nextStatus));
    }
    return all;
}
//# sourceMappingURL=outreachStateSync.js.map