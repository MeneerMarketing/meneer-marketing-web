import { HUIDKLINIEKEN_VERTICAL } from "@/data/verticals/huidklinieken";
import { PILATES_VERTICAL } from "@/data/verticals/pilates";
import type { VerticalInterestId } from "@/data/verticals/types";
import { formatVerticalMoney } from "@/lib/verticals/format-price";

type LgeVertical = "pilates-studios" | "huidklinieken";

export interface VerticalOrderDisplay {
  packageName: string;
  monthlyLabel: string;
  studioLabel: string;
}

function packageFromInterest(
  vertical: LgeVertical,
  interest: VerticalInterestId,
): VerticalOrderDisplay {
  const config =
    vertical === "pilates-studios" ? PILATES_VERTICAL : HUIDKLINIEKEN_VERTICAL;
  const studioLabel =
    vertical === "pilates-studios" ? "Studio" : "Kliniek";

  if (interest === "unsure") {
    return {
      packageName: "Pakket samen kiezen",
      monthlyLabel: "Advies op maat",
      studioLabel,
    };
  }

  if (interest === "signature-custom") {
    const from = formatVerticalMoney(config.pricing.signatureCustom.fromPrice);
    return {
      packageName: "Signature Custom",
      monthlyLabel: `Vanaf ${from}`,
      studioLabel,
    };
  }

  const pkg = config.pricing.packages.find((p) => p.id === interest);
  if (!pkg) {
    return {
      packageName: "Studio Edition",
      monthlyLabel: formatVerticalMoney(config.pricing.packages[0]!.monthly),
      studioLabel,
    };
  }

  return {
    packageName: pkg.name,
    monthlyLabel: formatVerticalMoney(pkg.monthly),
    studioLabel,
  };
}

interface VerticalOrderSummaryProps {
  vertical: LgeVertical;
  studioName: string;
  interest: VerticalInterestId;
  launchWaived?: boolean;
}

export function VerticalOrderSummary({
  vertical,
  studioName,
  interest,
  launchWaived = false,
}: VerticalOrderSummaryProps) {
  const order = packageFromInterest(vertical, interest);
  const today = new Date().toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div
      className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-4"
      aria-label="Samenvatting van je aanvraag"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Aanvraag ontvangen
          </p>
          <p className="mt-2 text-sm font-bold text-slate-900">{studioName}</p>
          <p className="mt-0.5 text-xs text-slate-500">{today}</p>
        </div>
        <span className="rounded-full bg-[#FF5722]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#FF5722]">
          Binnen
        </span>
      </div>

      <div className="mt-4 border-t border-dashed border-slate-200 pt-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-slate-500">
              {order.packageName}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Kick-off binnen 24 uur
            </p>
          </div>
          <p className="text-right">
            <span className="block font-mono text-xl font-black tracking-tight text-[#FF5722]">
              {order.monthlyLabel}
            </span>
            {interest !== "unsure" && interest !== "signature-custom" ? (
              <span className="text-[10px] font-semibold text-slate-400">
                ex. btw / maand
              </span>
            ) : null}
          </p>
        </div>
      </div>

      {launchWaived ? (
        <p className="mt-3 text-[11px] font-semibold text-slate-600">
          Launch fee nu €0. Je hoeft nog niets te betalen.
        </p>
      ) : null}
    </div>
  );
}
