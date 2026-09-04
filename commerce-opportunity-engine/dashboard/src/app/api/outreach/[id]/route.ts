import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createHash } from "node:crypto";
import { syncOutreachMessagesForBrand } from "@/lib/outreachStateSync";

export const dynamic = "force-dynamic";

function getAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error("Missing Supabase env");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function envBool(value: string | undefined): boolean {
  if (!value) return false;
  return ["true", "1", "yes", "on"].includes(value.trim().toLowerCase());
}

function contentHash(subject: string, body: string): string {
  const normalized = `${subject.trim()}\n---\n${body.trim()}`.replace(
    /\r\n/g,
    "\n"
  );
  return createHash("sha256").update(normalized, "utf8").digest("hex");
}

async function isSuppressed(
  supabase: ReturnType<typeof getAdmin>,
  email: string | null,
  domain: string | null
): Promise<boolean> {
  if (email) {
    const { data } = await supabase
      .from("coe_outreach_suppression")
      .select("id")
      .eq("email_normalized", email.trim().toLowerCase())
      .maybeSingle();
    if (data?.id) return true;
  }
  if (domain) {
    const { data } = await supabase
      .from("coe_outreach_suppression")
      .select("id")
      .eq("domain", domain.toLowerCase().replace(/^www\./, ""))
      .is("email_normalized", null)
      .maybeSingle();
    if (data?.id) return true;
  }
  return false;
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as {
      action: string;
      subject?: string;
      body?: string;
      feedback_vote?: "up" | "down";
      feedback_note?: string;
      copy_style?: string;
    };

    const supabase = getAdmin();
    const { data: message, error } = await supabase
      .from("coe_outreach_messages")
      .select(
        `*, brands ( id, do_not_contact, manual_excluded, first_touch_sent_at, normalized_domain, eligibility_status, lead_eligible ),
         coe_brand_contacts ( email, is_usable_for_outreach ),
         opportunities ( outreach_eligible, status )`
      )
      .eq("id", id)
      .single();

    if (error || !message) {
      return NextResponse.json(
        { ok: false, error: error?.message ?? "Message not found" },
        { status: 404 }
      );
    }

    const brand = Array.isArray(message.brands)
      ? message.brands[0]
      : message.brands;
    const contact = Array.isArray(message.coe_brand_contacts)
      ? message.coe_brand_contacts[0]
      : message.coe_brand_contacts;
    const opportunity = Array.isArray(message.opportunities)
      ? message.opportunities[0]
      : message.opportunities;

    if (body.action === "save") {
      const nextSubject = body.subject ?? message.subject;
      const nextBody = body.body ?? message.body;
      const wasApproved = message.status === "APPROVED";
      const hashChanged =
        wasApproved &&
        message.approved_content_hash &&
        contentHash(String(nextSubject), String(nextBody)) !==
          message.approved_content_hash;

      const manualEdits = Array.isArray(message.manual_edits)
        ? [...message.manual_edits]
        : [];
      if (
        nextSubject !== message.subject ||
        nextBody !== message.body
      ) {
        manualEdits.push({
          at: new Date().toISOString(),
          from_subject: message.subject,
          from_body: message.body,
          to_subject: nextSubject,
          to_body: nextBody,
        });
      }

      const nextStatus =
        wasApproved || hashChanged
          ? "APPROVAL_REVOKED"
          : ["BLOCKED", "APPROVAL_REVOKED"].includes(String(message.status))
            ? message.status
            : "READY_FOR_REVIEW";

      const { error: updErr } = await supabase
        .from("coe_outreach_messages")
        .update({
          subject: nextSubject,
          body: nextBody,
          status: nextStatus,
          approved_at: null,
          approved_by: null,
          approved_content_hash: null,
          approval_revoked_at:
            wasApproved || hashChanged
              ? new Date().toISOString()
              : message.approval_revoked_at,
          manual_edits: manualEdits,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);
      if (updErr) {
        return NextResponse.json(
          { ok: false, error: updErr.message },
          { status: 500 }
        );
      }
      return NextResponse.json({
        ok: true,
        message: wasApproved
          ? "Opgeslagen. Approval automatisch ingetrokken (content gewijzigd)."
          : "Draft opgeslagen",
        status: nextStatus,
      });
    }

    if (body.action === "feedback") {
      if (body.feedback_vote !== "up" && body.feedback_vote !== "down") {
        return NextResponse.json(
          { ok: false, error: "feedback_vote must be up|down" },
          { status: 400 }
        );
      }
      await supabase
        .from("coe_outreach_messages")
        .update({
          feedback_vote: body.feedback_vote,
          feedback_note: body.feedback_note ?? null,
          feedback_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);
      await supabase.from("coe_outreach_events").insert({
        outreach_message_id: id,
        brand_id: message.brand_id,
        event_type: "COPY_FEEDBACK",
        payload: {
          vote: body.feedback_vote,
          note: body.feedback_note ?? null,
        },
      });
      return NextResponse.json({ ok: true, message: "Feedback opgeslagen" });
    }

    if (body.action === "approve") {
      if (message.claim_validation_status === "FAILED") {
        return NextResponse.json(
          { ok: false, error: "Claim validation FAILED — kan niet approven" },
          { status: 400 }
        );
      }
      if (
        brand?.do_not_contact ||
        brand?.manual_excluded ||
        String(brand?.eligibility_status ?? "").toUpperCase() === "EXCLUDED" ||
        brand?.lead_eligible === false ||
        message.status === "BLOCKED" ||
        message.status === "APPROVAL_REVOKED"
      ) {
        // Re-sync to be sure
        if (brand?.id) {
          await syncOutreachMessagesForBrand(
            supabase,
            String(brand.id),
            "approve blocked by brand safety"
          );
        }
        return NextResponse.json(
          {
            ok: false,
            error:
              "Brand/message is blocked (excluded / DNC / eligibility / revoked)",
          },
          { status: 400 }
        );
      }
      if (!opportunity?.outreach_eligible) {
        return NextResponse.json(
          { ok: false, error: "Opportunity niet outreach_eligible" },
          { status: 400 }
        );
      }

      const nextSubject = body.subject ?? message.subject;
      const nextBody = body.body ?? message.body;
      const hash = contentHash(String(nextSubject), String(nextBody));
      const now = new Date().toISOString();

      const { error: updErr } = await supabase
        .from("coe_outreach_messages")
        .update({
          subject: nextSubject,
          body: nextBody,
          status: "APPROVED",
          approved_at: now,
          approved_by: "manual_user",
          approved_content_hash: hash,
          blocked_at: null,
          blocked_reason: null,
          approval_revoked_at: null,
          updated_at: now,
        })
        .eq("id", id);
      if (updErr) {
        return NextResponse.json(
          { ok: false, error: updErr.message },
          { status: 500 }
        );
      }
      await supabase.from("coe_outreach_events").insert({
        outreach_message_id: id,
        brand_id: message.brand_id,
        event_type: "APPROVED",
        payload: { approved_by: "manual_user", content_hash: hash },
      });
      await supabase
        .from("opportunities")
        .update({
          outreach_status: "APPROVED",
          updated_at: now,
        })
        .eq("id", message.opportunity_id);
      return NextResponse.json({
        ok: true,
        message: "Draft approved",
        status: "APPROVED",
      });
    }

    if (body.action === "regenerate") {
      const now = new Date().toISOString();
      const wasApproved = message.status === "APPROVED";
      await supabase
        .from("coe_outreach_messages")
        .update({
          status: "READY_FOR_DRAFT",
          approved_at: null,
          approved_by: null,
          approved_content_hash: null,
          approval_revoked_at: wasApproved ? now : message.approval_revoked_at,
          updated_at: now,
        })
        .eq("id", id);
      await supabase.from("coe_outreach_events").insert({
        outreach_message_id: id,
        brand_id: message.brand_id,
        event_type: "REGENERATED",
        payload: {
          note: "Approval cleared; run npm run outreach:generate-v2",
          copy_style: body.copy_style ?? message.copy_style ?? null,
        },
      });
      await supabase
        .from("opportunities")
        .update({
          outreach_status: "READY_FOR_DRAFT",
          updated_at: now,
        })
        .eq("id", message.opportunity_id);
      return NextResponse.json({
        ok: true,
        message:
          "Approval gereset. Genereer opnieuw via npm run outreach:generate-v2",
        status: "READY_FOR_DRAFT",
      });
    }

    if (body.action === "test_send") {
      const testEmail = process.env.OUTREACH_TEST_EMAIL;
      const resendKey = process.env.RESEND_API_KEY;
      const from =
        process.env.RESEND_FROM_EMAIL?.trim() ||
        process.env.OUTREACH_FROM_EMAIL?.trim() ||
        "";

      if (!testEmail) {
        return NextResponse.json(
          { ok: false, error: "OUTREACH_TEST_EMAIL not set" },
          { status: 400 }
        );
      }

      // Live safety re-check (even for test: never to prospect)
      const suppressed = await isSuppressed(
        supabase,
        contact?.email ?? null,
        brand?.normalized_domain ?? null
      );
      const blockers: string[] = [];
      if (brand?.do_not_contact) blockers.push("do_not_contact");
      if (brand?.manual_excluded) blockers.push("manual_excluded");
      if (String(brand?.eligibility_status ?? "").toUpperCase() === "EXCLUDED") {
        blockers.push("eligibility_status_excluded");
      }
      if (["BLOCKED", "APPROVAL_REVOKED"].includes(String(message.status))) {
        // Test send still allowed for previewing copy to TEST inbox when blocked?
        // Spec: blocked must not show as Ready to Send. Test to OUTREACH_TEST_EMAIL is OK for copy QA.
      }
      if (suppressed) {
        // still allow test to internal inbox for QA of copy that was drafted before suppression
      }

      if (!resendKey) {
        return NextResponse.json(
          {
            ok: false,
            error: "RESEND_API_KEY missing — provider NOT_CONFIGURED",
            providerStatus: "NOT_CONFIGURED",
            blockers,
          },
          { status: 403 }
        );
      }
      if (!from) {
        return NextResponse.json(
          {
            ok: false,
            error: "RESEND_FROM_EMAIL / OUTREACH_FROM_EMAIL not configured",
            providerStatus: "MISCONFIGURED",
          },
          { status: 403 }
        );
      }

      const to = testEmail; // ALWAYS test inbox — never prospect
      const rawSubject = String(body.subject ?? message.subject ?? "");
      const subject = rawSubject.startsWith("[TEST]")
        ? rawSubject
        : `[TEST] ${rawSubject}`;
      const text = String(body.body ?? message.body ?? "");
      const html = message.body_html ?? undefined;

      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [to],
          subject,
          text,
          ...(html ? { html } : {}),
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        return NextResponse.json(
          { ok: false, error: `Test send failed: ${errText.slice(0, 200)}` },
          { status: 500 }
        );
      }
      const json = (await res.json()) as { id?: string };
      const now = new Date().toISOString();

      // Test send is isolated — never first_touch / never prospect SENT
      await supabase.from("coe_outreach_test_sends").insert({
        outreach_message_id: id,
        brand_id: message.brand_id,
        to_email: to,
        from_email: from,
        subject,
        provider: "resend",
        provider_message_id: json.id ?? null,
        simulated: false,
        prospect_email_blocked: contact?.email ?? null,
      });

      await supabase
        .from("coe_outreach_messages")
        .update({
          test_sent_at: now,
          updated_at: now,
          // Keep current status (BLOCKED/APPROVED/etc). Do NOT mark as SENT.
        })
        .eq("id", id);

      await supabase.from("coe_outreach_events").insert({
        outreach_message_id: id,
        brand_id: message.brand_id,
        event_type: "TEST_SENT",
        payload: {
          to,
          simulated: false,
          providerMessageId: json.id ?? null,
          prospectEmailBlocked: contact?.email ?? null,
          subject,
          isolatedFromProspectSend: true,
        },
      });

      return NextResponse.json({
        ok: true,
        message: `Test send naar ${to} (prospect ongemoeid)`,
        status: message.status,
        to,
        testOnly: true,
      });
    }

    if (body.action === "send") {
      const realEnabled = envBool(process.env.OUTREACH_REAL_SEND_ENABLED);
      const suppressed = await isSuppressed(
        supabase,
        contact?.email ?? null,
        brand?.normalized_domain ?? null
      );
      const blockers: string[] = [];
      if (!realEnabled) blockers.push("OUTREACH_REAL_SEND_ENABLED=false");
      if (message.status !== "APPROVED") blockers.push("status_not_approved");
      if (brand?.do_not_contact) blockers.push("do_not_contact");
      if (brand?.manual_excluded) blockers.push("manual_excluded");
      if (String(brand?.eligibility_status ?? "").toUpperCase() === "EXCLUDED") {
        blockers.push("eligibility_status_excluded");
      }
      if (brand?.lead_eligible === false) blockers.push("not_lead_eligible");
      if (!contact?.email) blockers.push("missing_contact");
      if (!contact?.is_usable_for_outreach) blockers.push("contact_not_usable");
      if (message.claim_validation_status !== "PASSED") {
        blockers.push("claim_validation_failed");
      }
      if (!opportunity?.outreach_eligible) blockers.push("not_outreach_eligible");
      if (brand?.first_touch_sent_at) blockers.push("first_touch_already_sent");
      if (suppressed) blockers.push("suppressed");
      if (message.approved_content_hash) {
        const current = contentHash(
          String(body.subject ?? message.subject),
          String(body.body ?? message.body)
        );
        if (current !== message.approved_content_hash) {
          blockers.push("approval_content_hash_mismatch");
        }
      }

      return NextResponse.json(
        {
          ok: false,
          error: `Real send geblokkeerd: ${blockers.join(", ")}`,
          blockers,
          realSendDisabled: !realEnabled,
        },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { ok: false, error: `Unknown action: ${body.action}` },
      { status: 400 }
    );
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "unknown" },
      { status: 500 }
    );
  }
}
