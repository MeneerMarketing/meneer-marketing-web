import type { BrandRow, EligibilityStatus } from "@/lib/types";

export function resolveEligibilityStatus(
  brand: Pick<
    BrandRow,
    | "eligibility_status"
    | "lead_eligible"
    | "manual_excluded"
    | "business_type"
  > | null | undefined
): EligibilityStatus {
  if (!brand) return "PENDING_QUALIFICATION";
  if (brand.manual_excluded) return "EXCLUDED";
  if (brand.eligibility_status) return brand.eligibility_status;
  if (brand.lead_eligible) return "LEAD_ELIGIBLE";
  if (brand.business_type === "UNKNOWN") return "PENDING_QUALIFICATION";
  return "EXCLUDED";
}

export function eligibilityLabel(status: EligibilityStatus): string {
  switch (status) {
    case "LEAD_ELIGIBLE":
      return "Lead eligible";
    case "PENDING_QUALIFICATION":
      return "Pending qualification";
    case "EXCLUDED":
      return "Excluded";
  }
}

export function eligibilityTone(
  status: EligibilityStatus
): "success" | "warn" | "danger" {
  switch (status) {
    case "LEAD_ELIGIBLE":
      return "success";
    case "PENDING_QUALIFICATION":
      return "warn";
    case "EXCLUDED":
      return "danger";
  }
}

export function isBrandExcluded(
  brand: Pick<BrandRow, "manual_excluded" | "eligibility_status" | "lead_eligible"> | null | undefined
): boolean {
  if (!brand) return false;
  return Boolean(brand.manual_excluded) || brand.eligibility_status === "EXCLUDED";
}
