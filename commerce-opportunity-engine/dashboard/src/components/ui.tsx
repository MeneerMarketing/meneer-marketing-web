export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-mm-border bg-white p-5 shadow-mm-card">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}

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
    <div className="mb-6">
      {eyebrow ? (
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#FF5722]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "brand" | "success" | "warn" | "danger" | "sky";
}) {
  const tones = {
    neutral: "bg-slate-100 text-slate-600",
    brand: "bg-[#FF5722]/10 text-[#C2410C]",
    success: "bg-emerald-50 text-emerald-700",
    warn: "bg-amber-50 text-amber-700",
    danger: "bg-rose-50 text-rose-700",
    sky: "bg-mm-sky-subtle text-mm-sky-deep",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function EmptyValue({ label = "Niet gedetecteerd" }: { label?: string }) {
  return <span className="text-slate-400 italic">{label}</span>;
}

export function Panel({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-mm-border bg-white shadow-mm-card">
      <div className="flex items-center justify-between gap-3 border-b border-mm-border px-5 py-4">
        <h3 className="text-sm font-extrabold tracking-tight text-slate-900">
          {title}
        </h3>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function KeyValue({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 gap-1 border-b border-slate-100 py-3 last:border-0 sm:grid-cols-[180px_1fr] sm:gap-4">
      <dt className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
        {label}
      </dt>
      <dd className="text-sm font-medium text-slate-800">{value}</dd>
    </div>
  );
}

export function signalTone(
  signal: string | null | undefined
): "success" | "warn" | "neutral" | "danger" {
  if (signal === "CONFIRMED_PAID") return "success";
  if (signal === "PAID_CANDIDATE") return "warn";
  if (signal === "NON_PAID") return "neutral";
  return "neutral";
}
