import type { Metadata } from "next";
import ReviewsTemplate from "@/components/templates/ReviewsTemplate";
import { DIBA_PROOF_STRIP_ITEMS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Reviews",
  description: "[COPY-NODIG]",
};

export default function ReviewsPage() {
  return <ReviewsTemplate proofItems={[...DIBA_PROOF_STRIP_ITEMS]} />;
}
