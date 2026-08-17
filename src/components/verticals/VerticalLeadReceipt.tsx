"use client";

import type { VerticalInterestId, VerticalPackageId } from "@/data/verticals/types";
import { PilatesStudioReceipt } from "@/components/verticals/pilates/PilatesStudioReceipt";
import { HuidkliniekClinicReceipt } from "@/components/verticals/huidklinieken/HuidkliniekClinicReceipt";

export type VerticalLeadSource = "pilates-studios" | "huidklinieken";

interface VerticalLeadReceiptProps {
  vertical: VerticalLeadSource;
  interest: VerticalInterestId;
  businessName?: string;
  city?: string;
}

function resolveReceiptPackageId(interest: VerticalInterestId): VerticalPackageId {
  if (interest === "local-growth" || interest === "growth-partner") {
    return interest;
  }
  return "studio-edition";
}

export function VerticalLeadReceipt({
  vertical,
  interest,
  businessName,
  city,
}: VerticalLeadReceiptProps) {
  const packageId = resolveReceiptPackageId(interest);
  const indicative =
    interest === "unsure" || interest === "signature-custom";

  return (
    <div className="space-y-4">
      {businessName ? (
        <p className="text-center text-xs font-semibold text-emerald-800">
          {businessName}
          {city ? ` · ${city}` : ""}
        </p>
      ) : null}
      {vertical === "pilates-studios" ? (
        <PilatesStudioReceipt packageId={packageId} variant="submitted" />
      ) : (
        <HuidkliniekClinicReceipt packageId={packageId} variant="submitted" />
      )}
      {indicative ? (
        <p className="text-center text-xs leading-relaxed text-emerald-800/80">
          Pakket indicatief op je aanvraag. Ik bevestig het juiste plan bij contact.
        </p>
      ) : null}
    </div>
  );
}
