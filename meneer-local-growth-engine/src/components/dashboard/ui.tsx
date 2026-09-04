import Link from "next/link";
import type { ReactNode } from "react";
import { normalizeExternalUrl } from "@/lib/utils/normalize";

export function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-8">
      {eyebrow ? (
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#FF5722]">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function MetricTile({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="border border-mm-border bg-white px-4 py-4 shadow-mm-card sm:px-5">
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "brand" | "success" | "warn" | "danger" | "sky" | "demo";
}) {
  const tones = {
    neutral: "bg-slate-100 text-slate-600",
    brand: "bg-[#FF5722]/10 text-[#C2410C]",
    success: "bg-emerald-50 text-emerald-700",
    warn: "bg-amber-50 text-amber-800",
    danger: "bg-rose-50 text-rose-700",
    sky: "bg-sky-50 text-sky-800",
    demo: "bg-violet-50 text-violet-700",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function Panel({
  title,
  children,
  action,
  className = "",
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <section className={`border border-mm-border bg-white shadow-mm-card ${className}`}>
      <div className="flex items-center justify-between gap-3 border-b border-mm-border px-5 py-4">
        <h2 className="text-sm font-extrabold tracking-tight text-slate-900">{title}</h2>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function KeyValue({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-1 border-b border-slate-100 py-3 last:border-0 sm:grid-cols-[160px_1fr] sm:gap-4">
      <dt className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
        {label}
      </dt>
      <dd className="text-sm font-medium text-slate-800">{value}</dd>
    </div>
  );
}

export function DemoBanner() {
  return (
    <div className="mb-6 border border-slate-200 bg-mm-surface/70 px-4 py-3 text-sm text-slate-700">
      <span className="font-bold">Seed vs live.</span> Records met{" "}
      <code className="text-xs">DEMO</code>-badge of Studio Forma zijn seed. Nieuwe discovery en
      previews komen uit live Supabase (<code className="text-xs">is_demo = false</code>).
    </div>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="border border-dashed border-mm-border bg-mm-surface/50 px-6 py-12 text-center">
      <p className="text-sm font-bold text-slate-800">{title}</p>
      <p className="mt-2 text-sm text-slate-500">{body}</p>
    </div>
  );
}

export function TextLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className="font-semibold text-[#C2410C] underline-offset-2 hover:underline">
      {children}
    </Link>
  );
}

const externalLinkClass =
  "font-semibold text-[#C2410C] underline-offset-2 hover:underline break-all";

/** Klikbare website-link voor leads, discovery en overige dashboard-views. */
export function WebsiteLink({
  url,
  domain,
  label,
  className = "",
  showIcon = true,
  emptyLabel = "geen website",
}: {
  url?: string | null;
  domain?: string | null;
  label?: string | null;
  className?: string;
  showIcon?: boolean;
  emptyLabel?: string;
}) {
  const href =
    normalizeExternalUrl(url) ??
    (domain ? normalizeExternalUrl(`https://${domain}`) : null);
  const display = label ?? domain ?? url ?? null;

  if (!href || !display) {
    return <span className={`text-slate-400 ${className}`}>{emptyLabel}</span>;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${externalLinkClass} ${className}`}
    >
      {display}
      {showIcon ? " ↗" : ""}
    </a>
  );
}

/** Primaire dashboard-actie in het standaard MM card-patroon. */
export function ActionPanel({
  eyebrow,
  title,
  description,
  href,
  cta,
}: {
  eyebrow?: string;
  title?: string;
  description: string;
  href: string;
  cta: string;
}) {
  return (
    <section className="mb-6 border border-mm-border bg-white p-5 shadow-mm-card">
      {eyebrow ? (
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#FF5722]">
          {eyebrow}
        </p>
      ) : null}
      {title ? (
        <p className="mt-1 text-sm font-extrabold text-slate-900">{title}</p>
      ) : null}
      <p className={`text-sm text-slate-600 ${title || eyebrow ? "mt-2" : ""}`}>
        {description}
      </p>
      <Link
        href={href}
        className="mt-4 inline-block bg-[#FF5722] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-white hover:bg-[#C2410C]"
      >
        {cta}
      </Link>
    </section>
  );
}

export function leadStatusTone(
  status: string
): "neutral" | "brand" | "success" | "warn" | "danger" | "sky" {
  switch (status) {
    case "CLIENT":
      return "success";
    case "REJECTED":
    case "DO_NOT_CONTACT":
      return "danger";
    case "READY_FOR_OUTREACH":
    case "PREVIEW_READY":
      return "brand";
    case "CONTACTED":
    case "REPLIED":
    case "INBOUND":
    case "MEETING":
      return "sky";
    case "QUALIFIED":
    case "PREVIEW_GENERATING":
      return "warn";
    default:
      return "neutral";
  }
}
