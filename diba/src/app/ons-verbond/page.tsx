import type { Metadata } from "next";
import VerbondTemplate from "@/components/templates/VerbondTemplate";
import { VERBOND_WEIGERINGEN } from "@/data/verbond";
import { PAGE_DEFAULTS } from "@/lib/page-defaults";
import { NOG_IN_AANBOUW } from "@/lib/pagina-af";

export const metadata: Metadata = {
  title: "Ons verbond",
  ...NOG_IN_AANBOUW,
};

export default function OnsVerbondPage() {
  return (
    <VerbondTemplate
      weigeringen={VERBOND_WEIGERINGEN}
      siteUrl={PAGE_DEFAULTS.siteUrl}
    />
  );
}
