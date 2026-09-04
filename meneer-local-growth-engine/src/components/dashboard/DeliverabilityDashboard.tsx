import Link from "next/link";
import { Badge, DemoBanner, MetricTile, Panel, SectionTitle } from "@/components/dashboard/ui";
import { getDeliverabilityDashboard } from "@/services/deliverability/suppressionDashboardService";

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("nl-NL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export async function DeliverabilityDashboard() {
  const data = await getDeliverabilityDashboard();

  return (
    <div>
      <SectionTitle
        eyebrow="Deliverability"
        title="Bounces & suppressions"
        description="Overzicht van dode adressen per vertical en stad. Scrapers en enrichment slaan e-mails op de suppression-lijst over."
      />

      <DemoBanner />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricTile
          label="Suppression-lijst"
          value={data.totals.suppressions}
          hint="Hard bounce, klacht, uitschrijving"
        />
        <MetricTile
          label="Bounced outreach"
          value={data.totals.bounces}
          hint="Unieke leads met BOUNCED mail"
        />
        <MetricTile
          label="Ongeldig / leeg"
          value={data.totals.invalidEmails}
          hint="Geen mail, malformed of suppressed"
        />
        <MetricTile
          label="Dode leads"
          value={data.totals.deadLeads}
          hint="Unieke leads die je beter overslaat"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Per vertical & stad">
          {data.byVertical.length === 0 ? (
            <p className="text-sm text-slate-500">Nog geen bounces of suppressions geregistreerd.</p>
          ) : (
            <div className="space-y-5">
              {data.byVertical.map((vertical) => (
                <div key={vertical.verticalId} className="border-b border-slate-100 pb-4 last:border-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-bold text-slate-900">{vertical.verticalName}</h3>
                    <Badge tone="danger">{vertical.deadLeads} dode leads</Badge>
                  </div>
                  <ul className="mt-3 space-y-2">
                    {vertical.cities.map((city) => (
                      <li
                        key={city.cityId}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-slate-50 px-3 py-2 text-sm"
                      >
                        <span className="font-medium text-slate-800">{city.cityName}</span>
                        <span className="text-xs text-slate-500">
                          {city.suppressions} suppressions · {city.bounces} bounces ·{" "}
                          {city.invalidEmails} invalid
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </Panel>

        <Panel title="Wat gebeurt er automatisch?">
          <ul className="space-y-3 text-sm leading-relaxed text-slate-600">
            <li>
              Resend webhooks zetten hard bounces en klachten op de suppression-lijst en markeren
              outreach als BOUNCED of SUPPRESSED.
            </li>
            <li>
              Contact resolver en e-mail enrichment slaan adressen op de lijst over. Je scrapet
              niet opnieuw naar een adres dat al dood is.
            </li>
            <li>
              Outreach en follow-ups blokkeren suppressed adressen al vóór verzending.
            </li>
          </ul>
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Suppression-lijst (recent)">
          {data.suppressions.length === 0 ? (
            <p className="text-sm text-slate-500">Leeg. Dat is goed nieuws.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-400">
                    <th className="py-2 pr-3 font-bold">E-mail</th>
                    <th className="py-2 pr-3 font-bold">Reden</th>
                    <th className="py-2 pr-3 font-bold">Lead</th>
                    <th className="py-2 font-bold">Datum</th>
                  </tr>
                </thead>
                <tbody>
                  {data.suppressions.map((row) => (
                    <tr key={`${row.email}-${row.createdAt}`} className="border-b border-slate-50">
                      <td className="py-2 pr-3 font-mono text-xs">{row.email}</td>
                      <td className="py-2 pr-3">
                        <Badge tone={row.reason === "hard_bounce" ? "danger" : "warn"}>
                          {row.reasonLabel}
                        </Badge>
                      </td>
                      <td className="py-2 pr-3">
                        {row.businessId ? (
                          <Link
                            href={`/dashboard/leads/${row.businessId}`}
                            className="text-[#FF5722] hover:underline"
                          >
                            {row.studioName ?? "Lead"}
                          </Link>
                        ) : (
                          <span className="text-slate-400">
                            {row.cityName && row.verticalName
                              ? `${row.cityName} · ${row.verticalName}`
                              : "—"}
                          </span>
                        )}
                      </td>
                      <td className="py-2 text-xs text-slate-500">{formatDate(row.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>

        <Panel title="Leads zonder bruikbare mail">
          {data.invalidLeads.length === 0 ? (
            <p className="text-sm text-slate-500">Alle live leads hebben een plausibel adres.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-400">
                    <th className="py-2 pr-3 font-bold">Studio</th>
                    <th className="py-2 pr-3 font-bold">Stad</th>
                    <th className="py-2 pr-3 font-bold">Issue</th>
                    <th className="py-2 font-bold">E-mail</th>
                  </tr>
                </thead>
                <tbody>
                  {data.invalidLeads.map((row) => (
                    <tr key={row.businessId} className="border-b border-slate-50">
                      <td className="py-2 pr-3">
                        <Link
                          href={`/dashboard/leads/${row.businessId}`}
                          className="font-medium text-[#FF5722] hover:underline"
                        >
                          {row.studioName}
                        </Link>
                        <p className="text-xs text-slate-400">{row.verticalName}</p>
                      </td>
                      <td className="py-2 pr-3 text-slate-600">{row.cityName}</td>
                      <td className="py-2 pr-3">
                        <Badge
                          tone={
                            row.issue === "suppressed"
                              ? "danger"
                              : row.issue === "malformed"
                                ? "warn"
                                : "neutral"
                          }
                        >
                          {row.issueLabel}
                        </Badge>
                      </td>
                      <td className="py-2 font-mono text-xs text-slate-500">
                        {row.email ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
