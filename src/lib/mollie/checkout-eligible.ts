import type {
  VerticalInterestId,
  VerticalPackageId,
} from "@/data/verticals/types";

export function isCheckoutPackageId(
  interest: VerticalInterestId,
): interest is VerticalPackageId {
  return (
    interest === "studio-edition" ||
    interest === "local-growth" ||
    interest === "growth-partner"
  );
}
