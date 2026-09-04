import Link from "next/link";
import { notFound } from "next/navigation";

import { CustomerDetailEditor } from "@/components/dashboard/CustomerDetailEditor";
import {
  Badge,
  KeyValue,
  Panel,
  SectionTitle,
  TextLink,
} from "@/components/dashboard/ui";
import {
  paymentStatusLabel,
  paymentStatusTone,
  submissionStatusLabel,
  submissionStatusTone,
} from "@/lib/data/customer-labels";
import { getCustomerById } from "@/lib/data/inbound-customers";
import { maskCampaignRef } from "@/services/campaigns/types";

interface Props {
  params: Promise<{ id: string }>;
}

function formatEuro(cents: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function paymentRowStatusLabel(status: string): string {
  switch (status) {
    case "paid":
      return "Betaald";
    case "open":
    case "pending":
      return "Open";
    case "failed":
    case "expired":
    case "canceled":
      return "Mislukt / verlopen";
    default:
      return status;
  }
}

export default async function KlantDetailPage({ params }: Props) {
  const { id } = await params;
  const customer = await getCustomerById(id);
  if (!customer) notFound();

  const primaryPayment = customer.payments[0] ?? null;

  return (
    <div>
      <div className="mb-6">
        <TextLink href="/dashboard/klanten">← Terug naar klanten</TextLink>
      </div>

      <div className="mb-6 flex flex-col gap-4 border border-mm-border bg-white p-5 shadow-mm-card sm:flex-row sm:items-start sm:justify-between">
        <div>
          <SectionTitle
            eyebrow={customer.source}
            title={customer.studioName}
            description={`${customer.city ?? "—"} · ${customer.email}`}
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge tone={submissionStatusTone(customer.status)}>
              {submissionStatusLabel(customer.status)}
            </Badge>
            <Badge tone={paymentStatusTone(customer.paymentStatus)}>
              {paymentStatusLabel(customer.paymentStatus)}
            </Badge>
            {customer.launchPromoActive ? (
              <Badge tone="brand">Launch promo</Badge>
            ) : null}
          </div>
        </div>
        <div className="text-right text-xs text-slate-500">
          <p>
            Aanvraag{" "}
            {new Date(customer.createdAt).toLocaleString("nl-NL", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          {customer.updatedAt !== customer.createdAt ? (
            <p className="mt-1">
              Bijgewerkt{" "}
              {new Date(customer.updatedAt).toLocaleString("nl-NL", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Panel title="Contact & aanvraag">
            <dl>
              <KeyValue label="E-mail" value={customer.email} />
              <KeyValue label="Telefoon" value={customer.phone ?? "—"} />
              <KeyValue label="Stad (formulier)" value={customer.city ?? "—"} />
              <KeyValue label="Pakket" value={customer.packageInterest ?? "—"} />
              <KeyValue label="Booking" value={customer.bookingNeed ?? "—"} />
              <KeyValue
                label="Launch bedrag"
                value={
                  customer.paymentStatus === "waived"
                    ? "€0 (promo)"
                    : formatEuro(customer.launchAmountCents)
                }
              />
            </dl>
            {customer.message ? (
              <div className="mt-4 border-t border-slate-100 pt-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Bericht
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                  {customer.message}
                </p>
              </div>
            ) : null}
          </Panel>

          <Panel title={`Betalingen (${customer.payments.length})`}>
            {customer.payments.length === 0 ? (
              <p className="text-sm text-slate-500">
                Nog geen Mollie-betaling gekoppeld aan deze aanvraag.
              </p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {customer.payments.map((payment) => (
                  <li key={payment.id} className="py-4 first:pt-0">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {formatEuro(payment.amountCents)}
                        </p>
                        <p className="text-xs text-slate-500">
                          {paymentRowStatusLabel(payment.status)}
                          {payment.paymentMethod
                            ? ` · ${payment.paymentMethod}`
                            : ""}
                        </p>
                        {payment.description ? (
                          <p className="mt-1 text-xs text-slate-600">{payment.description}</p>
                        ) : null}
                      </div>
                      <div className="text-right text-xs text-slate-400">
                        {payment.paidAt ? (
                          <time>
                            {new Date(payment.paidAt).toLocaleString("nl-NL")}
                          </time>
                        ) : (
                          <time>
                            {new Date(payment.createdAt).toLocaleString("nl-NL")}
                          </time>
                        )}
                        {payment.molliePaymentId ? (
                          <p className="mt-1 font-mono text-[10px]">
                            {payment.molliePaymentId}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {primaryPayment?.checkoutUrl ? (
              <p className="mt-4 text-xs">
                <a
                  href={primaryPayment.checkoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#C2410C] hover:underline"
                >
                  Mollie checkout openen →
                </a>
              </p>
            ) : null}
          </Panel>

          {customer.activity.length > 0 ? (
            <Panel title="Prospect-activiteit">
              <ul className="divide-y divide-slate-100">
                {customer.activity.map((item) => (
                  <li key={item.id} className="py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone="neutral">{item.activityType}</Badge>
                      <time className="text-[11px] text-slate-400">
                        {new Date(item.createdAt).toLocaleString("nl-NL")}
                      </time>
                    </div>
                    <p className="mt-1 text-sm font-semibold">{item.title}</p>
                    {item.description ? (
                      <p className="text-xs text-slate-500">{item.description}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </Panel>
          ) : null}
        </div>

        <div className="space-y-6">
          <Panel title="Outreach & campaign">
            <dl>
              <KeyValue
                label="Campaign ref"
                value={
                  customer.campaignRef ? (
                    <span className="font-mono text-xs break-all">
                      {customer.campaignRef}
                      <span className="mt-1 block text-slate-400">
                        {maskCampaignRef(customer.campaignRef)}
                      </span>
                    </span>
                  ) : (
                    "Direct (geen ref)"
                  )
                }
              />
              {customer.campaign ? (
                <>
                  <KeyValue
                    label="Campaign"
                    value={
                      customer.campaign.environment === "PRODUCTION" ? "PROD" : "DEV"
                    }
                  />
                  <KeyValue
                    label="Engagement"
                    value={customer.campaign.engagementLevel}
                  />
                  <KeyValue
                    label="Conversie"
                    value={customer.campaign.conversionStatus}
                  />
                  <KeyValue
                    label="Aanbevolen"
                    value={customer.campaign.recommendedPackage ?? "—"}
                  />
                  <KeyValue
                    label="Geselecteerd"
                    value={customer.campaign.selectedPackage ?? "—"}
                  />
                </>
              ) : null}
            </dl>
            <div className="mt-4 flex flex-col gap-2 text-sm">
              {customer.business ? (
                <>
                  <Link
                    href={`/dashboard/leads/${customer.business.id}`}
                    className="font-semibold text-[#C2410C] hover:underline"
                  >
                    Open prospect →
                  </Link>
                  <Link
                    href={`/dashboard/leads/${customer.business.id}?tab=journey`}
                    className="font-semibold text-[#C2410C] hover:underline"
                  >
                    Campaign journey →
                  </Link>
                </>
              ) : (
                <p className="text-xs text-slate-500">
                  Geen gekoppelde prospect in LGE.
                </p>
              )}
              <Link
                href="/dashboard/campaigns"
                className="text-xs font-semibold text-slate-500 hover:text-[#C2410C]"
              >
                Alle campaigns →
              </Link>
            </div>
          </Panel>

          {customer.business ? (
            <Panel title="Prospect in LGE">
              <dl>
                <KeyValue label="Naam" value={customer.business.studioName} />
                <KeyValue label="Stad" value={customer.business.cityName ?? "—"} />
                <KeyValue label="Branche" value={customer.business.verticalName ?? "—"} />
                <KeyValue label="Lead status" value={customer.business.leadStatus ?? "—"} />
              </dl>
            </Panel>
          ) : null}

          <Panel title="Status & notities">
            <CustomerDetailEditor
              submissionId={customer.id}
              initialStatus={customer.status}
              initialNotes={customer.internalNotes}
            />
          </Panel>
        </div>
      </div>
    </div>
  );
}
