export type Metric = {
  label: string;
  baseline: number;
  current: number;
  lowerIsBetter?: boolean;
};

export type MeasurementBlockProps = {
  context: string;
  metrics: Metric[];
};

const nf = new Intl.NumberFormat("nl-NL");

export default function MeasurementBlock({
  context,
  metrics,
}: MeasurementBlockProps) {
  return (
    <div className="rounded-[1.5rem] border border-[var(--g-100)] bg-white p-6 shadow-[0_8px_32px_rgba(15,45,28,.04)] sm:p-8">
      <p className="text-[10px] font-semibold uppercase tracking-[.14em] text-[var(--t-label)]">
        Wij meten
      </p>
      <p className="mt-1 text-[16px] leading-relaxed text-[var(--g-900)]">
        {context}
      </p>

      <dl className="mt-6 flex flex-col gap-6">
        {metrics.map((m) => {
          const max = Math.max(m.baseline, m.current, 1);
          const lowerIsBetter = m.lowerIsBetter ?? true;
          const improved = lowerIsBetter
            ? m.current < m.baseline
            : m.current > m.baseline;
          const deltaPct = Math.round(
            ((m.current - m.baseline) / m.baseline) * 100,
          );

          return (
            <div key={m.label}>
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-[14px] font-medium text-[var(--g-900)]">
                  {m.label}
                </dt>
                <dd className="text-[13px] text-[var(--t-muted)] tabular-nums">
                  {nf.format(m.baseline)} → {nf.format(m.current)}
                  {improved ? (
                    <span className="ml-2 font-medium text-[var(--g-700)]">
                      {deltaPct > 0 ? "+" : ""}
                      {nf.format(deltaPct)}%
                    </span>
                  ) : null}
                </dd>
              </div>
              <div className="mt-2 flex flex-col gap-1" aria-hidden="true">
                <div className="h-[6px] w-full overflow-hidden rounded-[3px] bg-[var(--g-050)]">
                  <div
                    className="h-full rounded-[3px] bg-[var(--g-300)]"
                    style={{ width: `${(m.baseline / max) * 100}%` }}
                  />
                </div>
                <div className="h-[6px] w-full overflow-hidden rounded-[3px] bg-[var(--g-050)]">
                  <div
                    className="h-full rounded-[3px] bg-[var(--g-700)]"
                    style={{ width: `${(m.current / max) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </dl>

      <p className="mt-6 flex flex-wrap items-center gap-4 text-[13px] text-[var(--t-muted)]">
        <span className="inline-flex items-center gap-2">
          <span
            aria-hidden="true"
            className="h-[6px] w-[18px] rounded-[3px] bg-[var(--g-300)]"
          />
          Nulmeting
        </span>
        <span className="inline-flex items-center gap-2">
          <span
            aria-hidden="true"
            className="h-[6px] w-[18px] rounded-[3px] bg-[var(--g-700)]"
          />
          Nu
        </span>
        <span className="ml-auto">Gemeten met Eve-M huidanalyse</span>
      </p>
    </div>
  );
}
