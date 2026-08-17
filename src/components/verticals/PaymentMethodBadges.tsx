import Image from "next/image";

const IDEAL_LOGO = "/brand/ideal-wero-lockup-transparent.png";

export function IdealBadge({ className = "h-8" }: { className?: string }) {
  return (
    <span
      className={`inline-flex shrink-0 overflow-hidden rounded-[10px] ${className}`}
    >
      <Image
        src={IDEAL_LOGO}
        alt="iDEAL · wero"
        width={132}
        height={36}
        className="h-full w-auto object-contain"
      />
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

export function MollieTrustLine({
  className = "",
  includeIdeal = true,
}: {
  className?: string;
  includeIdeal?: boolean;
}) {
  return (
    <p
      className={`flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-500 ${className}`}
    >
      {includeIdeal ? <IdealBadge /> : null}
      <SepaBadge />
      <span className="text-slate-400">·</span>
      <span>Veilig via Mollie</span>
    </p>
  );
}
