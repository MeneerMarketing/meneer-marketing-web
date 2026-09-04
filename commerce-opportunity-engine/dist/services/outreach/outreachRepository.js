import { normalizeEmail } from "./emailClassification.js";
export async function isEmailOrDomainSuppressed(client, email, domain) {
    const normalized = email ? normalizeEmail(email) : null;
    const brandDomain = domain.toLowerCase().replace(/^www\./, "");
    if (normalized) {
        const { data } = await client
            .from("coe_outreach_suppression")
            .select("id")
            .eq("email_normalized", normalized)
            .maybeSingle();
        if (data?.id)
            return true;
    }
    const { data: domainHit } = await client
        .from("coe_outreach_suppression")
        .select("id")
        .eq("domain", brandDomain)
        .is("email_normalized", null)
        .maybeSingle();
    return Boolean(domainHit?.id);
}
export async function upsertDiscoveredContacts(client, brandId, contacts, preferredEmail) {
    const ids = [];
    let preferredId = null;
    const now = new Date().toISOString();
    // Clear previous preferred flags
    await client
        .from("coe_brand_contacts")
        .update({ is_preferred: false, updated_at: now })
        .eq("brand_id", brandId);
    for (const c of contacts) {
        const row = {
            brand_id: brandId,
            full_name: c.fullName,
            first_name: c.firstName,
            last_name: c.lastName,
            job_title: c.jobTitle,
            email: c.email,
            email_normalized: c.emailNormalized,
            email_type: c.emailType,
            email_confidence: c.emailConfidence,
            contact_confidence: c.contactConfidence,
            phone: c.phone,
            linkedin_url: c.linkedinUrl,
            instagram_url: c.instagramUrl,
            source_url: c.sourceUrl,
            source_type: c.sourceType,
            source_evidence: c.sourceEvidence,
            is_preferred: preferredEmail
                ? c.emailNormalized === normalizeEmail(preferredEmail)
                : false,
            is_usable_for_outreach: c.isUsableForOutreach,
            updated_at: now,
        };
        const { data: existing } = await client
            .from("coe_brand_contacts")
            .select("id")
            .eq("brand_id", brandId)
            .eq("email_normalized", c.emailNormalized)
            .maybeSingle();
        let id;
        if (existing?.id) {
            const { data, error } = await client
                .from("coe_brand_contacts")
                .update(row)
                .eq("id", existing.id)
                .select("id")
                .single();
            if (error)
                throw new Error(error.message);
            id = data.id;
        }
        else {
            const { data, error } = await client
                .from("coe_brand_contacts")
                .insert(row)
                .select("id")
                .single();
            if (error)
                throw new Error(error.message);
            id = data.id;
        }
        ids.push(id);
        if (row.is_preferred)
            preferredId = id;
    }
    return { ids, preferredId };
}
export function findingIdFromTitle(title, index) {
    const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 60);
    return `finding_${index}_${slug || "item"}`;
}
export function countSupportedFindings(leaks, validations) {
    const list = Array.isArray(leaks) ? leaks : [];
    const vals = Array.isArray(validations) ? validations : [];
    if (!vals.length)
        return list.length;
    let count = 0;
    for (const leak of list) {
        if (!leak || typeof leak !== "object")
            continue;
        const title = String(leak.title ?? "");
        const v = vals.find((item) => item &&
            typeof item === "object" &&
            String(item.title ?? "") === title);
        const status = String(v?.status ?? "SUPPORTED").toUpperCase();
        if (status === "SUPPORTED" || !v)
            count += 1;
    }
    return count;
}
//# sourceMappingURL=outreachRepository.js.map