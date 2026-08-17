import Link from "next/link";

import { formatEuroAmount } from "@/lib/verticals/vat";

interface SubscriptionCheckoutLegalProps {
  variant: "consent" | "footnote";
  monthlyExclEur?: number;
  monthlyInclEur?: number;
  accepted?: boolean;
  onAcceptedChange?: (accepted: boolean) => void;
  id?: string;
}

function formatNlEuro(euros: number): string {
  return formatEuroAmount(euros).replace(/\s/g, "");
}

export function SubscriptionCheckoutLegal({
  variant,
  monthlyExclEur,
  monthlyInclEur,
  accepted = false,
  onAcceptedChange,
  id = "subscription-legal-consent",
}: SubscriptionCheckoutLegalProps) {
  const priceLine =
    monthlyExclEur != null && monthlyInclEur != null ? (
      <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
        Maandbedrag op deze pagina:{" "}
        <strong className="font-semibold text-slate-700">
          {formatNlEuro(monthlyExclEur)} ex. btw
        </strong>
        . In Mollie betaal je de eerste maand{" "}
        <strong className="font-semibold text-slate-700">
          {formatNlEuro(monthlyInclEur)} incl. 21% btw
        </strong>{" "}
        via iDEAL. Daarna incasseert Mollie maandelijks hetzelfde bedrag incl.
        btw via SEPA-incasso.
      </p>
    ) : (
      <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
        Alle maandbedragen op deze pagina zijn exclusief btw. In Mollie betaal je
        incl. 21% btw. Daarna volgt maandelijkse incasso via Mollie.
      </p>
    );

  const policyLinks = (
    <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
      <Link
        href="/algemene-voorwaarden#abonnement-incasso"
        className="font-semibold text-[#FF5722] underline decoration-[#FF5722]/30 underline-offset-2"
      >
        Algemene voorwaarden
      </Link>
      {" · "}
      <Link
        href="/privacybeleid"
        className="font-semibold text-[#FF5722] underline decoration-[#FF5722]/30 underline-offset-2"
      >
        Privacybeleid
      </Link>
    </p>
  );

  if (variant === "footnote") {
    return (
      <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
        <p className="text-[11px] leading-relaxed text-slate-600">
          Bij direct starten sluit je een maandelijks abonnement af. Opzegbaar
          per kalendermaand. Eerste maand via iDEAL, daarna automatische incasso
          via Mollie. Bedragen op deze pagina zijn ex. btw.
        </p>
        {policyLinks}
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-3.5">
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3">
        <input
          id={id}
          type="checkbox"
          checked={accepted}
          onChange={(e) => onAcceptedChange?.(e.target.checked)}
          className="mt-0.5 size-4 shrink-0 rounded border-slate-300 text-[#FF5722] focus:ring-[#FF5722]/30"
          required
        />
        <span className="text-[11px] leading-relaxed text-slate-600">
          Ik ga akkoord met een maandelijks abonnement op het gekozen pakket,
          maandelijks opzegbaar per kalendermaand. Eerste betaling via iDEAL,
          daarna automatische incasso via Mollie. Ik heb de{" "}
          <Link
            href="/algemene-voorwaarden#abonnement-incasso"
            className="font-semibold text-[#FF5722] underline decoration-[#FF5722]/30 underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            algemene voorwaarden
          </Link>{" "}
          en het{" "}
          <Link
            href="/privacybeleid"
            className="font-semibold text-[#FF5722] underline decoration-[#FF5722]/30 underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            privacybeleid
          </Link>{" "}
          gelezen.
        </span>
      </label>
      {priceLine}
    </div>
  );
}
