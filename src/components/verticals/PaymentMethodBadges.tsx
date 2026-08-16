export function IdealBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex h-7 items-center rounded-md bg-[#CC0066] px-2.5 text-[11px] font-black tracking-wide text-white shadow-sm ${className}`}
      aria-label="iDEAL"
    >
      iDEAL
    </span>
  );
}

export function SepaBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex h-7 items-center rounded-md border border-slate-200 bg-white px-2.5 text-[10px] font-bold uppercase tracking-wide text-slate-600 ${className}`}
      aria-label="SEPA incasso"
    >
      Incasso
    </span>
  );
}

export function MollieTrustLine({ className = "" }: { className?: string }) {
  return (
    <p
      className={`flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-500 ${className}`}
    >
      <IdealBadge />
      <SepaBadge />
      <span className="text-slate-400">·</span>
      <span>Veilig via Mollie</span>
    </p>
  );
}
