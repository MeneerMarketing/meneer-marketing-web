import type { Metadata } from "next";
import VerbondTemplate from "@/components/templates/VerbondTemplate";
import { VERBOND_WEIGERINGEN } from "@/data/verbond";
import { PAGE_DEFAULTS } from "@/lib/page-defaults";

export const metadata: Metadata = {
  title: "Ons verbond",
  description: "[COPY-NODIG]",
};

export default function OnsVerbondPage() {
  return (
    <VerbondTemplate
      weigeringen={VERBOND_WEIGERINGEN}
      siteUrl={PAGE_DEFAULTS.siteUrl}
    />
  );
}
