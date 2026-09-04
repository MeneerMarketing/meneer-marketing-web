export function DecisionTrail({
  title,
  items,
}: {
  title: string;
  items: Array<{ label: string; value: React.ReactNode }>;
}) {
  return (
    <section className="rounded-2xl border border-mm-border bg-white shadow-mm-card">
      <div className="border-b border-mm-border px-5 py-4">
        <h3 className="text-sm font-extrabold tracking-tight text-slate-900">{title}</h3>
      </div>
      <dl className="divide-y divide-slate-100 p-5">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0 sm:flex-row sm:gap-4">
            <dt className="shrink-0 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 sm:w-40">
              {item.label}
            </dt>
            <dd className="text-sm font-medium text-slate-800">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
