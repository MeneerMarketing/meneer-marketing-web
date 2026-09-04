/**
 * Email provider abstraction — Milestone 8.1.
 * Real prospect sends stay blocked unless OUTREACH_REAL_SEND_ENABLED=true
 * AND all safety gates pass. Test sends always go to OUTREACH_TEST_EMAIL only.
 */
/** Safe default: never hits a network — used when no provider key is set. */
export class NoopEmailProvider {
    name = "noop";
    status = "NOT_CONFIGURED";
    async send(_input) {
        return {
            ok: false,
            provider: this.name,
            providerStatus: this.status,
            messageId: null,
            error: "RESEND_API_KEY missing — provider NOT_CONFIGURED",
            simulated: true,
        };
    }
}
export class ResendEmailProvider {
    apiKey;
    fromAddress;
    name = "resend";
    status;
    constructor(apiKey, fromAddress) {
        this.apiKey = apiKey;
        this.fromAddress = fromAddress;
        if (!apiKey)
            this.status = "NOT_CONFIGURED";
        else if (!fromAddress)
            this.status = "MISCONFIGURED";
        else
            this.status = "READY";
    }
    async send(input) {
        if (!this.apiKey) {
            return {
                ok: false,
                provider: this.name,
                providerStatus: "NOT_CONFIGURED",
                messageId: null,
                error: "RESEND_API_KEY missing — provider NOT_CONFIGURED",
                simulated: true,
            };
        }
        const from = input.from ?? this.fromAddress;
        if (!from) {
            return {
                ok: false,
                provider: this.name,
                providerStatus: "MISCONFIGURED",
                messageId: null,
                error: "RESEND_FROM_EMAIL / OUTREACH_FROM_EMAIL not configured",
                simulated: false,
            };
        }
        const payload = {
            from,
            to: [input.to],
            subject: input.subject,
            text: input.bodyText,
        };
        if (input.bodyHtml)
            payload.html = input.bodyHtml;
        if (input.replyTo)
            payload.reply_to = input.replyTo;
        const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${this.apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
        if (!res.ok) {
            const text = await res.text();
            return {
                ok: false,
                provider: this.name,
                providerStatus: this.status,
                messageId: null,
                error: `Resend HTTP ${res.status}: ${text.slice(0, 300)}`,
                simulated: false,
            };
        }
        const json = (await res.json());
        return {
            ok: true,
            provider: this.name,
            providerStatus: this.status,
            messageId: json.id ?? null,
            error: null,
            simulated: false,
        };
    }
}
const TEST_OK_STATUSES = new Set([
    "DRAFT",
    "READY_FOR_REVIEW",
    "APPROVED",
    "DRAFT_INVALID",
    "TEST_SENT",
]);
export function evaluateSendSafety(input) {
    const blockers = [];
    if (input.doNotContact)
        blockers.push("do_not_contact");
    if (input.manualExcluded)
        blockers.push("manual_excluded");
    if ((input.eligibilityStatus ?? "").toUpperCase() === "EXCLUDED") {
        blockers.push("eligibility_status_excluded");
    }
    if (input.leadEligible === false)
        blockers.push("not_lead_eligible");
    if (input.suppressed)
        blockers.push("suppressed");
    if (!input.contactEmail && !input.isTestSend) {
        blockers.push("missing_contact_email");
    }
    if (!input.contactUsable && !input.isTestSend) {
        blockers.push("contact_not_usable");
    }
    if (!input.claimValidationPassed)
        blockers.push("claim_validation_failed");
    if (!input.outreachEligible)
        blockers.push("not_outreach_eligible");
    if (input.status === "BLOCKED" ||
        input.status === "APPROVAL_REVOKED" ||
        input.status === "DO_NOT_CONTACT") {
        blockers.push(`status_blocked:${input.status}`);
    }
    if (input.isTestSend) {
        if (!input.testEmail)
            blockers.push("OUTREACH_TEST_EMAIL_not_set");
        if (!TEST_OK_STATUSES.has(input.status)) {
            blockers.push(`invalid_status_for_test:${input.status}`);
        }
        return { allowed: blockers.length === 0, blockers };
    }
    if (!input.realSendEnabled) {
        blockers.push("OUTREACH_REAL_SEND_ENABLED=false");
    }
    if (input.status !== "APPROVED") {
        blockers.push(`status_not_approved:${input.status}`);
    }
    if (input.approvalHashMatches === false) {
        blockers.push("approval_content_hash_mismatch");
    }
    if (input.firstTouchAlreadySent) {
        blockers.push("first_touch_already_sent");
    }
    return { allowed: blockers.length === 0, blockers };
}
export function createEmailProvider(env) {
    const from = env.RESEND_FROM_EMAIL?.trim() ||
        env.OUTREACH_FROM_EMAIL?.trim() ||
        null;
    if (env.RESEND_API_KEY) {
        return new ResendEmailProvider(env.RESEND_API_KEY, from);
    }
    return new NoopEmailProvider();
}
export function getOutreachDeliverabilityChecklist(env) {
    const realEnabled = env.OUTREACH_REAL_SEND_ENABLED === true ||
        env.OUTREACH_REAL_SEND_ENABLED === "true" ||
        env.OUTREACH_REAL_SEND_ENABLED === "1";
    const from = env.RESEND_FROM_EMAIL?.trim() || env.OUTREACH_FROM_EMAIL?.trim() || "";
    const provider = createEmailProvider(env);
    const dnsOrUnknown = (raw, label) => {
        if (!raw || !raw.trim()) {
            return {
                key: label,
                label,
                status: "Unknown / Check provider",
                detail: "Niet programmatisch bekend",
            };
        }
        return {
            key: label,
            label,
            status: raw.trim(),
            detail: "Uit env/config",
        };
    };
    return [
        {
            key: "resend",
            label: "Resend configured",
            status: provider.status === "READY" ? "Yes" : provider.status,
            detail: provider.status === "READY"
                ? "API key aanwezig"
                : "RESEND_API_KEY ontbreekt of from mist",
        },
        {
            key: "from",
            label: "From address configured",
            status: from ? "Yes" : "No",
            detail: from || "RESEND_FROM_EMAIL / OUTREACH_FROM_EMAIL leeg",
        },
        {
            key: "test_email",
            label: "Test email configured",
            status: env.OUTREACH_TEST_EMAIL ? "Yes" : "No",
            detail: env.OUTREACH_TEST_EMAIL || "OUTREACH_TEST_EMAIL leeg",
        },
        {
            key: "real_send",
            label: "Real send disabled",
            status: realEnabled ? "NO — ENABLED" : "Yes (locked)",
            detail: realEnabled
                ? "OUTREACH_REAL_SEND_ENABLED=true"
                : "OUTREACH_REAL_SEND_ENABLED=false",
        },
        dnsOrUnknown(env.RESEND_DOMAIN_VERIFIED, "Domain verification"),
        dnsOrUnknown(env.RESEND_SPF_STATUS, "SPF"),
        dnsOrUnknown(env.RESEND_DKIM_STATUS, "DKIM"),
        {
            key: "dmarc",
            label: "DMARC guidance",
            status: "Guidance only",
            detail: "Publiceer een DMARC-record (start met p=none) op het from-domein. Check bij je DNS/provider.",
        },
    ];
}
//# sourceMappingURL=emailProvider.js.map