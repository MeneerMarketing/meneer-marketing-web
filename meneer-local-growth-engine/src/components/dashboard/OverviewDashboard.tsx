import Link from "next/link";
import type { ActivityLogEntry } from "@/types/domain";
import type { OverviewMetrics } from "@/lib/data/dashboard";
import { mailListOutreachHref } from "@/lib/mailListVerticals";
import { Badge, Panel } from "@/components/dashboard/ui";

interface Props {
  metrics: OverviewMetrics;
  activity: ActivityLogEntry[];
}

function pct(value: number, max: number): number {
  if (max <= 0) return 0;
  return Math.min(100, Math.round((value / max) * 100));
}

function activityTone(
  type: string
): "neutral" | "brand" | "success" | "warn" | "sky" {
  if (type.includes("SENT") || type.includes("SCHEDULED") || type.includes("EMAIL"))
    return "brand";
  if (type.includes("PREVIEW") || type.includes("DISCOVERY")) return "sky";
  if (type.includes("CLIENT") || type.includes("REPLIED") || type.includes("INBOUND")) return "success";
  if (type.includes("DRAFT") || type.includes("REVIEW")) return "warn";
  return "neutral";
}

function activityLabel(type: string): string {
  const map: Record<string, string> = {
    DISCOVERY_RUN_COMPLETED: "Discovery afgerond",
    PREVIEW_GENERATED: "Preview gegenereerd",
    PREVIEW_READY: "Preview klaar",
    OUTREACH_DRAFT_CREATED: "Outreach draft",
    OUTREACH_SCHEDULED: "Mail gepland",
    OUTREACH_BATCH_SCHEDULED: "Batch gepland",
    EMAIL_SENT: "Mail verzonden",
    EMAIL_OPENED: "Mail geopend",
    EMAIL_CLICKED: "Link geklikt",
    EMAIL_REPLIED: "Reactie ontvangen",
    INBOUND_FORM_RECEIVED: "Formulier ingevuld",
  };
  return map[type] ?? type.replaceAll("_", " ").toLowerCase();
}

export function OverviewDashboard({ metrics: m, activity }: Props) {
  const pipelineMax = Math.max(m.liveCount, 1);

  const funnel = [
    {
      label: "Gevonden",
      value: m.newLeads,
      hint: "Nog te beoordelen",
      href: "/dashboard/leads",
      tone: "bg-slate-200",
    },
    {
      label: "Gekwalificeerd",
      value: m.qualifiedLeads,
      hint: "Past bij propositie",
      href: "/dashboard/leads",
      tone: "bg-slate-300",
    },
    {
      label: "Previews klaar",
      value: m.previewsReady,
      hint: "Concept live",
      href: "/dashboard/previews",
      tone: "bg-[#FF5722]/35",
    },
    {
      label: "Mail-lijst",
      value: m.mailWishlistCount,
      hint: "Jouw selectie",
      href: "/dashboard/outreach?status=mail_list",
      tone: "bg-[#FF5722]/55",
    },
    {
      label: "Benaderd",
      value: m.contacted,
      hint: "Mail uit",
      href: "/dashboard/outreach?status=SENT",
      tone: "bg-[#FF5722]/75",
    },
    {
      label: "Klant",
      value: m.clients,
      hint: "Getekend",
      href: "/dashboard/klanten",
      tone: "bg-[#FF5722]",
    },
  ];

  const workflow = [
    {
      step: "Speuren",
      title: "Nieuwe stad ontdekken",
      detail: `${m.liveCount} live leads in database`,
      href: "/dashboard/discovery/new",
      cta: "Start discovery",
      accent: m.leadsThisWeek > 0,
      badge: m.leadsThisWeek > 0 ? `+${m.leadsThisWeek} deze week` : null,
    },
    {
      step: "Selecteren",
      title: "Mail-lijst vullen",
      detail:
        m.mailWishlistByVertical.filter((row) => row.count > 0).length > 0
          ? m.mailWishlistByVertical
              .filter((row) => row.count > 0)
              .map((row) => `${row.name} ${row.count}`)
              .join(" · ")
          : `${m.mailWishlistCount} studio's geselecteerd`,
      href: "/dashboard/outreach?status=mail_list",
      cta: "Naar mail-lijst",
      accent: m.mailWishlistCount > 0,
      badge: m.readyForOutreach > 0 ? `${m.readyForOutreach} klaar` : null,
    },
    {
      step: "Maken",
      title: "Previews & drafts",
      detail: `${m.previewsReady} previews · ${m.outreachDrafts} drafts open`,
      href: "/dashboard/outreach",
      cta: "Naar outreach",
      accent: m.outreachDrafts > 0,
      badge:
        m.outreachApproved > 0 ? `${m.outreachApproved} approved` : null,
    },
    {
      step: "Versturen",
      title: "Batch plannen",
      detail:
        m.outreachScheduled > 0
          ? `${m.outreachScheduled} gepland · ${m.outreachSent} verzonden`
          : m.outreachSent > 0
            ? `${m.outreachSent} mails uit`
            : "Nog geen mails verstuurd",
      href: "/dashboard/outreach",
      cta: "Campagne openen",
      accent: m.outreachScheduled > 0,
      badge: m.outreachScheduled > 0 ? "Gepland" : null,
    },
  ];

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden border border-mm-border bg-white shadow-mm-card">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,87,34,0.08) 0%, transparent 45%, rgba(15,23,42,0.03) 100%)",
          }}
        />
        <div className="relative flex flex-col gap-6 p-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="brand">{m.liveCount} live leads</Badge>
              {m.demoCount > 0 ? <Badge tone="demo">{m.demoCount} demo</Badge> : null}
              {m.leadsThisWeek > 0 ? (
                <Badge tone="sky">+{m.leadsThisWeek} deze week</Badge>
              ) : null}
            </div>
            <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Van discovery naar klant
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600">
              Speur nieuwe studios, zet ze op je mail-lijst, maak previews en plan
              outreach in één flow.
            </p>
          </div>
          <div className="flex flex-wrap gap-6 lg:gap-10">
            <StatPill label="Reactie" value={m.replyRateLabel} />
            <StatPill label="Naar klant" value={m.clientRateLabel} />
            <StatPill
              label="Previews week"
              value={String(m.previewsThisWeek)}
              highlight
            />
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="border border-mm-border bg-white p-6 shadow-mm-card">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                Pipeline
              </p>
              <h3 className="mt-1 text-lg font-extrabold text-slate-900">
                Waar zitten je leads?
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              {m.liveCount} live · {m.replied} reacties · {m.meetings} gesprekken
            </p>
          </div>

          <div className="space-y-4">
            {funnel.map((step) => (
              <Link
                key={step.label}
                href={step.href}
                className="group block rounded border border-transparent p-3 transition hover:border-mm-border hover:bg-mm-surface/50"
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-slate-900 group-hover:text-[#C2410C]">
                      {step.label}
                    </p>
                    <p className="text-xs text-slate-500">{step.hint}</p>
                  </div>
                  <p className="text-2xl font-extrabold tabular-nums text-slate-900">
                    {step.value}
                  </p>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full transition-all ${step.tone}`}
                    style={{ width: `${pct(step.value, pipelineMax)}%` }}
                  />
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="border border-mm-border bg-white p-6 shadow-mm-card">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Jouw workflow
          </p>
          <h3 className="mt-1 text-lg font-extrabold text-slate-900">
            Vandaag aan de slag
          </h3>

          <ol className="mt-6 space-y-0">
            {workflow.map((item, index) => (
              <li key={item.step} className="relative flex gap-4 pb-6 last:pb-0">
                {index < workflow.length - 1 ? (
                  <span
                    className="absolute left-[15px] top-8 h-[calc(100%-12px)] w-px bg-slate-200"
                    aria-hidden
                  />
                ) : null}
                <span
                  className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                    item.accent
                      ? "bg-[#FF5722] text-white"
                      : "border border-mm-border bg-white text-slate-500"
                  }`}
                >
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                      {item.step}
                    </p>
                    {item.badge ? (
                      <Badge tone={item.accent ? "brand" : "neutral"}>
                        {item.badge}
                      </Badge>
                    ) : null}
                  </div>
                  <p className="mt-1 font-bold text-slate-900">{item.title}</p>
                  <p className="mt-0.5 text-sm text-slate-500">{item.detail}</p>
                  <Link
                    href={item.href}
                    className="mt-2 inline-block text-xs font-bold uppercase tracking-[0.12em] text-[#C2410C] hover:underline"
                  >
                    {item.cta} →
                  </Link>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <QuickStat
          label="Outreach drafts"
          value={m.outreachDrafts}
          href="/dashboard/outreach?status=DRAFT"
          warn={m.outreachDrafts > 0}
        />
        <QuickStat
          label="Goedgekeurd"
          value={m.outreachApproved}
          href="/dashboard/outreach?status=APPROVED"
        />
        <QuickStat
          label="Gepland"
          value={m.outreachScheduled}
          href="/dashboard/outreach?status=SCHEDULED"
          highlight={m.outreachScheduled > 0}
        />
        <QuickStat
          label="Verzonden"
          value={m.outreachSent}
          href="/dashboard/outreach?status=SENT"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Panel title="Recente activiteit">
          {activity.length === 0 ? (
            <p className="text-sm text-slate-500">Nog geen activiteit gelogd.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {activity.map((item) => (
                <li key={item.id} className="flex gap-4 py-3 first:pt-0 last:pb-0">
                  <span
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                      activityTone(item.activity_type) === "brand"
                        ? "bg-[#FF5722]"
                        : activityTone(item.activity_type) === "success"
                          ? "bg-emerald-500"
                          : activityTone(item.activity_type) === "sky"
                            ? "bg-sky-500"
                            : "bg-slate-300"
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-900">
                        {item.title}
                      </p>
                      <time className="shrink-0 text-[11px] text-slate-400">
                        {new Date(item.created_at).toLocaleString("nl-NL", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </time>
                    </div>
                    {item.description ? (
                      <p className="mt-0.5 text-xs text-slate-500">{item.description}</p>
                    ) : null}
                    <Badge tone={activityTone(item.activity_type)}>
                      {activityLabel(item.activity_type)}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Snelkoppelingen">
          <div className="grid gap-2">
            <QuickLink href="/dashboard/discovery/new" title="Nieuwe discovery" />
            <QuickLink href="/dashboard/leads" title="Alle leads" />
            <QuickLink href="/dashboard/outreach?status=mail_list" title="Mail-lijst (alle branches)" />
            {m.mailWishlistByVertical
              .filter((row) => row.count > 0)
              .map((row) => (
                <QuickLink
                  key={row.slug}
                  href={mailListOutreachHref(row.slug)}
                  title={`Mail-lijst ${row.name} (${row.count})`}
                />
              ))}
            <QuickLink href="/dashboard/previews" title="Preview gallery" />
            <QuickLink href="/dashboard/klanten" title="Klanten & aanvragen" />
            <QuickLink href="/dashboard/seo" title="SEO opportunities" />
          </div>
        </Panel>
      </div>
    </div>
  );
}

function StatPill({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="text-right">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
        {label}
      </p>
      <p
        className={`mt-1 text-lg font-extrabold tabular-nums ${
          highlight ? "text-[#FF5722]" : "text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function QuickStat({
  label,
  value,
  href,
  warn = false,
  highlight = false,
}: {
  label: string;
  value: number;
  href: string;
  warn?: boolean;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group border bg-white px-4 py-4 shadow-mm-card transition hover:-translate-y-0.5 ${
        highlight
          ? "border-[#FF5722]/30 bg-[#FF5722]/5"
          : warn
            ? "border-amber-200 bg-amber-50/50"
            : "border-mm-border"
      }`}
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
        {label}
      </p>
      <p
        className={`mt-2 text-3xl font-extrabold tabular-nums ${
          highlight ? "text-[#FF5722]" : "text-slate-900"
        }`}
      >
        {value}
      </p>
      <p className="mt-1 text-xs font-semibold text-[#C2410C] opacity-0 transition group-hover:opacity-100">
        Open →
      </p>
    </Link>
  );
}

function QuickLink({ href, title }: { href: string; title: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between border border-mm-border bg-mm-surface/30 px-4 py-3 text-sm font-semibold text-slate-800 transition hover:border-[#FF5722]/30 hover:bg-[#FF5722]/5 hover:text-[#C2410C]"
    >
      {title}
      <span aria-hidden>→</span>
    </Link>
  );
}
