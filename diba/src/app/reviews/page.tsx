import type { Metadata } from "next";
import ReviewsTemplate from "@/components/templates/ReviewsTemplate";
import { DIBA_HOME_PROOF_ITEMS } from "@/lib/site";
import { NOG_IN_AANBOUW } from "@/lib/pagina-af";

export const metadata: Metadata = {
  title: "Reviews",
  ...NOG_IN_AANBOUW,
};

export default function ReviewsPage() {
  return <ReviewsTemplate proofItems={DIBA_HOME_PROOF_ITEMS} />;
}
