import {
  DemoBanner,
  KeyValue,
  Panel,
  SectionTitle,
} from "@/components/dashboard/ui";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getSenderConfig } from "@/lib/email/provider";
import { getBrandSettings } from "@/services/outreach/brandSettingsLoader";
import { getSenderDisplay } from "@/config/brandSettings";
import { getSessionUser } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const user = await getSessionUser();
  const sender = getSenderConfig();
  const brand = await getBrandSettings();
  const display = getSenderDisplay(brand);
  const bypass = process.env.LGE_DEV_AUTH_BYPASS === "true";

  return (
    <div>
      <SectionTitle
        eyebrow="Instellingen"
        title="Omgeving"
        description="Auth, outreach sender en Resend. Secrets blijven server-side."
      />
      <DemoBanner />

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Authenticatie">
          <dl>
            <KeyValue
              label="Supabase"
              value={isSupabaseConfigured() ? "Geconfigureerd" : "Env ontbreekt"}
            />
            <KeyValue label="Sessie" value={user?.email ?? "Geen sessie (bypass of uitgelogd)"} />
            <KeyValue label="DEV bypass" value={bypass ? "AAN" : "UIT"} />
          </dl>
          <form action="/auth/signout" method="post" className="mt-4">
            <button
              type="submit"
              className="border border-mm-border px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-600 hover:border-[#FF5722] hover:text-[#C2410C]"
            >
              Uitloggen
            </button>
          </form>
        </Panel>

        <Panel title="Outreach sender">
          <dl>
            <KeyValue label="Sender mode" value={brand.outreach_sender_mode} />
            <KeyValue label="Display name" value={display.display_name} />
            <KeyValue label="Signature" value={display.signature_name} />
            <KeyValue label="Brand name" value={brand.sender_brand_name} />
            <KeyValue label="Formal person" value={brand.formal_sender_name} />
            <KeyValue label="Years experience" value={String(brand.years_experience)} />
            <KeyValue label="Website" value={brand.website_label} />
            <KeyValue label="KVK" value={brand.kvk || "niet gezet"} />
            <KeyValue
              label="Preview base URL"
              value={brand.preview_base_url || "niet gezet"}
            />
            <KeyValue
              label="Approved preview hosts"
              value={brand.preview_allowed_hosts.join(", ")}
            />
            <KeyValue
              label="Allowed sender domains"
              value={brand.allowed_sender_domains.join(", ")}
            />
          </dl>
          <p className="mt-4 text-xs text-slate-500">
            Default is BRAND (Meneer Marketing). Geen voornaam in outreach.
          </p>
        </Panel>

        <Panel title="EMAIL PROVIDER">
          <dl>
            <KeyValue label="EMAIL PROVIDER" value="Resend" />
            <KeyValue
              label="STATUS"
              value={sender.configured ? "Configured" : "Not configured"}
            />
            <KeyValue
              label="SENDER"
              value={
                sender.fromEmailMasked
                  ? `${sender.fromName} <${sender.fromEmailMasked}>`
                  : `${sender.fromName} <niet gezet>`
              }
            />
            <KeyValue label="DOMAIN" value={sender.senderDomain ?? "niet gezet"} />
            <KeyValue
              label="Domain verification"
              value={sender.domainVerificationHint}
            />
            <KeyValue
              label="TEST ADDRESS"
              value={sender.testEmailMasked ?? "niet gezet"}
            />
            <KeyValue
              label="Test email configured"
              value={sender.testEmailConfigured ? "Yes" : "No"}
            />
            <KeyValue
              label="Webhook configured"
              value={sender.webhookConfigured ? "Yes" : "No"}
            />
            <KeyValue label="Webhook endpoint" value="/api/webhooks/email" />
            <KeyValue
              label="REAL OUTREACH"
              value={sender.realSendEnabled ? "ENABLED" : "DISABLED"}
            />
            <KeyValue
              label="Preview base (env)"
              value={sender.previewBaseUrl ?? "niet gezet"}
            />
          </dl>
          {!sender.configured ? (
            <p className="mt-4 text-xs text-amber-800">
              Vul RESEND_API_KEY, RESEND_FROM_EMAIL (bijv. hello@mail.meneermarketing.nl),
              OUTREACH_TEST_EMAIL en OUTREACH_PREVIEW_BASE_URL in. Geen secrets in de UI.
            </p>
          ) : null}
          {!sender.realSendEnabled ? (
            <p className="mt-3 text-xs font-semibold text-slate-700">
              Real send is server-side geblokkeerd tot OUTREACH_REAL_SEND_ENABLED=true.
            </p>
          ) : (
            <p className="mt-3 text-xs font-semibold text-rose-700">
              Real outreach is ENABLED. Alleen gebruiken na expliciete goedkeuring.
            </p>
          )}
        </Panel>

        <Panel title="Data">
          <dl>
            <KeyValue label="Dashboard source" value="Live Supabase (server-side)" />
            <KeyValue label="Discovery" value="DataForSEO Business Listings · Pilates NL/VL" />
            <KeyValue label="Copy engine" value="HARDENED_TEMPLATE (80-90% vast)" />
            <KeyValue label="Previews" value="Publiek via preview host /{slug} (noindex)" />
          </dl>
        </Panel>
      </div>
    </div>
  );
}
