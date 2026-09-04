import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import {
  Badge,
  EmptyValue,
  KeyValue,
  Panel,
  SectionTitle,
} from "@/components/ui";
import { getSupabase } from "@/lib/supabase";
import { OutreachDraftEditor } from "@/components/OutreachDraftEditor";

export const dynamic = "force-dynamic";

function one<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? value[0] ?? null : value;
}

function statusTone(status: string): "success" | "danger" | "warn" | "sky" {
  if (status === "APPROVED" || status === "TEST_SENT") return "success";
  if (status === "BLOCKED" || status === "APPROVAL_REVOKED" || status === "DRAFT_INVALID")
    return "danger";
  if (status === "READY_FOR_REVIEW" || status === "DRAFT") return "warn";
  return "sky";
}

export default async function OutreachDraftPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = getSupabase();

  const { data: message, error } = await supabase
    .from("coe_outreach_messages")
    .select(
      `*,
       brands ( normalized_domain, name, confirmed_google_advertiser, do_not_contact, manual_excluded, eligibility_status, lead_eligible ),
       coe_brand_contacts ( email, first_name, full_name, email_type, contact_confidence, source_url ),
       opportunities (
         id, outreach_eligible, outreach_priority_score, meneer_marketing_fit_score,
         recommended_project_type, recommended_project_reason, audit_type,
         opportunity_score, product_merchant_relationship
       )`
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !message) notFound();

  const brand = one(message.brands);
  const contact = one(message.coe_brand_contacts);
  const opportunity = one(message.opportunities);
  const claims = Array.isArray(message.claims_used) ? message.claims_used : [];
  const validation =
    message.claim_validation && typeof message.claim_validation === "object"
      ? (message.claim_validation as Record<string, unknown>)
      : {};

  const realSendEnabled =
    process.env.OUTREACH_REAL_SEND_ENABLED === "true" ||
    process.env.OUTREACH_REAL_SEND_ENABLED === "1";
  const testEmailConfigured = Boolean(process.env.OUTREACH_TEST_EMAIL);
  const resendConfigured = Boolean(process.env.RESEND_API_KEY);
  const fromAddress =
    process.env.RESEND_FROM_EMAIL?.trim() ||
    process.env.OUTREACH_FROM_EMAIL?.trim() ||
    "Meneer Marketing <(from niet geconfigureerd)>";

  return (
    <AppShell activePath="/outreach">
      <div className="mb-4">
        <Link
          href="/outreach?view=drafts"
          className="text-xs font-bold text-slate-500 hover:underline"
        >
          ← Outreach
        </Link>
      </div>
      <SectionTitle
        eyebrow="Draft review"
        title={String(brand?.normalized_domain ?? "Outreach draft")}
        description="Exacte preview van plain-text + minimale HTML. Approve is verplicht. Geen echte prospectmail zolang real send disabled is."
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Badge tone={statusTone(String(message.status))}>
          {String(message.status)}
        </Badge>
        {!realSendEnabled ? (
          <Badge tone="warn">REAL SEND DISABLED</Badge>
        ) : null}
        {message.blocked_reason ? (
          <span className="text-xs text-rose-700">
            Reden: {String(message.blocked_reason)}
          </span>
        ) : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <Panel title="E-mail">
          <OutreachDraftEditor
            messageId={id}
            initialSubject={String(message.subject ?? "")}
            initialBody={String(message.body ?? "")}
            initialHtml={(message.body_html as string | null) ?? null}
            status={String(message.status)}
            claimValidationStatus={
              (message.claim_validation_status as string | null) ?? null
            }
            blockedReason={(message.blocked_reason as string | null) ?? null}
            copyStyle={(message.copy_style as string | null) ?? null}
            promptVersion={(message.prompt_version as string | null) ?? null}
            generatorModel={(message.generator_model as string | null) ?? null}
            generationMode={(message.generation_mode as string | null) ?? null}
            fixedCopy={(message.fixed_copy as string | null) ?? null}
            personalisationCopy={
              (message.personalisation_copy as string | null) ?? null
            }
            fromAddress={fromAddress}
            toAddress={String(contact?.email ?? "")}
            realSendEnabled={realSendEnabled}
            testEmailConfigured={testEmailConfigured}
            resendConfigured={resendConfigured}
            feedbackVote={(message.feedback_vote as string | null) ?? null}
          />
        </Panel>

        <div className="space-y-4">
          <Panel title="Waarom deze mail?">
            <dl>
              <KeyValue
                label="Copy style"
                value={message.copy_style ?? <EmptyValue />}
              />
              <KeyValue
                label="Strategy"
                value={message.strategy ?? <EmptyValue />}
              />
              <KeyValue
                label="Finding"
                value={message.selected_finding_title ?? <EmptyValue />}
              />
              <KeyValue
                label="Strength"
                value={message.selected_strength_title ?? <EmptyValue />}
              />
              <KeyValue
                label="Source claim level"
                value={message.source_claim_level ?? <EmptyValue />}
              />
              <KeyValue
                label="Word count"
                value={
                  message.word_count != null ? (
                    String(message.word_count)
                  ) : (
                    <EmptyValue />
                  )
                }
              />
              <KeyValue
                label="Project"
                value={
                  opportunity?.recommended_project_type ?? <EmptyValue />
                }
              />
            </dl>
          </Panel>

          <Panel title="Contact">
            <dl>
              <KeyValue
                label="Email"
                value={
                  contact?.email ?? (
                    <EmptyValue label="Contact niet gevonden" />
                  )
                }
              />
              <KeyValue
                label="Naam"
                value={
                  contact?.full_name || contact?.first_name || (
                    <EmptyValue label="Geen voornaam" />
                  )
                }
              />
              <KeyValue
                label="Type"
                value={contact?.email_type ?? <EmptyValue />}
              />
              <KeyValue
                label="Brand flags"
                value={
                  [
                    brand?.manual_excluded ? "manual_excluded" : null,
                    brand?.do_not_contact ? "DNC" : null,
                    String(brand?.eligibility_status ?? ""),
                  ]
                    .filter(Boolean)
                    .join(" · ") || <EmptyValue />
                }
              />
            </dl>
          </Panel>

          <Panel title="Claims & safety">
            <div className="mb-3">
              <Badge
                tone={
                  message.claim_validation_status === "PASSED"
                    ? "success"
                    : "danger"
                }
              >
                {String(message.claim_validation_status ?? "UNKNOWN")}
              </Badge>
            </div>
            <ul className="space-y-1 text-sm text-slate-700">
              {claims.length === 0 ? (
                <li>
                  <EmptyValue label="Geen claims gelabeld" />
                </li>
              ) : (
                claims.map((c: unknown, i: number) => (
                  <li key={i}>• {String(c)}</li>
                ))
              )}
            </ul>
            {Array.isArray(validation.errors) &&
            validation.errors.length > 0 ? (
              <div className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-800">
                {(validation.errors as unknown[]).map((e, i) => (
                  <div key={i}>{String(e)}</div>
                ))}
              </div>
            ) : null}
          </Panel>

          {opportunity?.id ? (
            <Link
              href={`/opportunities/${opportunity.id}`}
              className="inline-flex text-xs font-bold text-[#C2410C] hover:underline"
            >
              Open opportunity →
            </Link>
          ) : null}
        </div>
      </div>
    </AppShell>
  );
}
