import { AppShell } from "@/components/AppShell";
import { EmptyValue, SectionTitle } from "@/components/ui";
import { formatDate } from "@/lib/format";
import { getSettings } from "@/lib/queries";
import type { EngineSettingRow } from "@/lib/types";

export const dynamic = "force-dynamic";

function formatSettingValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "object") return JSON.stringify(value, null, 2);
  return String(value);
}

function checklist() {
  const realEnabled =
    process.env.OUTREACH_REAL_SEND_ENABLED === "true" ||
    process.env.OUTREACH_REAL_SEND_ENABLED === "1";
  const from =
    process.env.RESEND_FROM_EMAIL?.trim() ||
    process.env.OUTREACH_FROM_EMAIL?.trim() ||
    "";
  const hasKey = Boolean(process.env.RESEND_API_KEY);
  const testEmail = process.env.OUTREACH_TEST_EMAIL?.trim() || "";

  const providerStatus =
    hasKey && from ? "READY" : hasKey ? "MISCONFIGURED" : "NOT_CONFIGURED";

  const dns = (raw: string | undefined) =>
    raw && raw.trim() ? raw.trim() : "Unknown / Check Resend";

  return [
    {
      label: "Resend provider status",
      status: providerStatus,
      detail:
        providerStatus === "READY"
          ? "API key + from address aanwezig"
          : providerStatus === "MISCONFIGURED"
            ? "API key aanwezig, from mist"
            : "RESEND_API_KEY ontbreekt",
    },
    {
      label: "From identity",
      status: from ? from : "No",
      detail: from
        ? "Gebruik alleen verified domain in Resend"
        : "RESEND_FROM_EMAIL / OUTREACH_FROM_EMAIL leeg",
    },
    {
      label: "Test email configured",
      status: testEmail ? "Yes" : "No",
      detail: testEmail
        ? "SEND TEST gaat alleen hierheen"
        : "OUTREACH_TEST_EMAIL leeg",
    },
    {
      label: "Real send disabled",
      status: realEnabled ? "NO — ENABLED" : "Yes (locked)",
      detail: realEnabled
        ? "OUTREACH_REAL_SEND_ENABLED=true"
        : "OUTREACH_REAL_SEND_ENABLED=false",
    },
    {
      label: "Domain verification",
      status: dns(process.env.RESEND_DOMAIN_VERIFIED),
      detail: "Alleen tonen als programmatisch bekend",
    },
    {
      label: "SPF",
      status: dns(process.env.RESEND_SPF_STATUS),
      detail: "Alleen tonen als programmatisch bekend",
    },
    {
      label: "DKIM",
      status: dns(process.env.RESEND_DKIM_STATUS),
      detail: "Alleen tonen als programmatisch bekend",
    },
    {
      label: "DMARC guidance",
      status: "Guidance only",
      detail:
        "Publiceer DMARC (start p=none) op het from-domein. Check bij DNS/Resend. Geen verzonnen status.",
    },
  ];
}

export default async function SettingsPage() {
  let settings: EngineSettingRow[] = [];
  try {
    settings = await getSettings();
  } catch {
    settings = [];
  }

  const items = checklist();

  return (
    <AppShell activePath="/settings">
      <SectionTitle
        eyebrow="Engine"
        title="Instellingen"
        description="Outreach deliverability + engine_settings. Geen credentials in logs."
      />

      <section className="mb-8 overflow-hidden rounded-2xl border border-mm-border bg-white shadow-mm-card">
        <div className="border-b border-slate-100 px-4 py-3">
          <h2 className="text-sm font-bold text-slate-900">
            Outreach / Resend
          </h2>
          <p className="text-xs text-slate-500">
            Test send alleen naar OUTREACH_TEST_EMAIL. Real send blijft locked.
          </p>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-mm-surface text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
            <tr>
              <th className="px-4 py-3">Check</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Detail</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.label} className="border-t border-slate-100">
                <td className="px-4 py-3 font-semibold text-slate-800">
                  {item.label}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-slate-700">
                  {item.status}
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">{item.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <div className="overflow-hidden rounded-2xl border border-mm-border bg-white shadow-mm-card">
        <table className="w-full text-left text-sm">
          <thead className="bg-mm-surface text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
            <tr>
              <th className="px-4 py-3">Key</th>
              <th className="px-4 py-3">Waarde</th>
              <th className="px-4 py-3">Beschrijving</th>
              <th className="px-4 py-3">Bijgewerkt</th>
            </tr>
          </thead>
          <tbody>
            {settings.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                  <EmptyValue label="Geen instellingen gevonden" />
                </td>
              </tr>
            ) : (
              settings.map((row) => (
                <tr key={row.key} className="border-t border-slate-100 align-top">
                  <td className="px-4 py-3 font-mono text-xs font-bold text-slate-800">
                    {row.key}
                  </td>
                  <td className="max-w-md px-4 py-3">
                    <pre className="whitespace-pre-wrap break-all font-mono text-xs text-slate-700">
                      {formatSettingValue(row.value)}
                    </pre>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {row.label ?? row.description ?? <EmptyValue label="—" />}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    {formatDate(row.updated_at)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
